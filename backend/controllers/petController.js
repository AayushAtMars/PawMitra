import Pet from '../models/Pet.js';
import cloudinaryService from '../services/cloudinaryService.js';

// Add pet for adoption
export const addPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      healthStatus,
      description,
      personality,
      location,
      address,
      shelterName,
      contactInfo,
      photos
    } = req.body;

    // Upload photos if provided as base64
    let uploadedPhotos = [];
    if (photos && photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        // Handle both object { url: 'base64...' } and string 'base64...' formats
        const photoData = typeof photos[i] === 'object' ? photos[i].url : photos[i];

        const uploaded = await cloudinaryService.uploadBase64Image(
          photoData,
          'pawmitra/pets'
        );
        uploadedPhotos.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          isPrimary: i === 0
        });
      }
    }

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      size,
      healthStatus,
      description,
      personality,
      location,
      address,
      shelterName,
      contactInfo,
      photos: uploadedPhotos,
      listedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      pet,
      message: 'Pet added successfully'
    });
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({ error: 'Failed to add pet' });
  }
};

// Get all pets with filters
export const getPets = async (req, res) => {
  try {
    const { species, status, limit = 50, page = 1 } = req.query;

    const query = { isLostFound: false };
    if (species) query.species = species;

    // If owner is specified, filter by owner and ignore status (show all their pets)
    if (req.query.owner) {
      query.listedBy = req.query.owner;
    } else {
      // Default behavior for public listing: showing available pets
      if (status) query.status = status;
      else query.status = 'available';
    }

    const pets = await Pet.find(query)
      .populate('listedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Pet.countDocuments(query);

    res.json({
      success: true,
      pets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
};

// Get single pet
export const getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('listedBy', 'name email phone avatar')
      .populate('interestedUsers.user', 'name email phone avatar');

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Increment views
    pet.views += 1;
    await pet.save();

    res.json({ success: true, pet });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
};

// Express interest in adopting
export const expressInterest = async (req, res) => {
  try {
    const { message } = req.body;
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({ error: 'Pet is not available for adoption' });
    }

    // Check if already expressed interest
    const alreadyInterested = pet.interestedUsers.some(
      iu => iu.user.toString() === req.user._id.toString()
    );

    if (alreadyInterested) {
      return res.status(400).json({ error: 'You have already expressed interest' });
    }

    pet.interestedUsers.push({
      user: req.user._id,
      message,
      status: 'pending'
    });

    await pet.save();

    // Emit Socket.io event to pet owner
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${pet.listedBy}`).emit('adoption_interest', {
        petId: pet._id,
        petName: pet.name,
        userId: req.user._id,
        userName: req.user.name
      });
    }

    res.json({
      success: true,
      message: 'Interest expressed successfully'
    });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ error: 'Failed to express interest' });
  }
};

// Report lost/found pet
export const reportLostFound = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      description,
      location,
      address,
      lostFoundType,
      lastSeenDate,
      photos
    } = req.body;

    // Upload photos
    let uploadedPhotos = [];
    if (photos && photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        const uploaded = await cloudinaryService.uploadBase64Image(
          photos[i],
          'pawmitra/lost-found'
        );
        uploadedPhotos.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          isPrimary: i === 0
        });
      }
    }

    const pet = await Pet.create({
      name,
      species,
      breed,
      description,
      location,
      address,
      photos: uploadedPhotos,
      listedBy: req.user._id,
      isLostFound: true,
      lostFoundType,
      lastSeenDate: lastSeenDate || new Date(),
      status: 'available'
    });

    // Emit Socket.io event to nearby users
    const io = req.app.get('io');
    if (io) {
      io.to('lost_found_room').emit('new_lost_found', {
        pet: {
          id: pet._id,
          name: pet.name,
          type: lostFoundType,
          location: pet.location,
          photo: pet.photos[0]?.url
        }
      });
    }

    res.status(201).json({
      success: true,
      pet,
      message: `${lostFoundType === 'lost' ? 'Lost' : 'Found'} pet reported successfully`
    });
  } catch (error) {
    console.error('Report lost/found error:', error);
    res.status(500).json({ error: 'Failed to report pet' });
  }
};

// Get lost/found pets
export const getLostFoundPets = async (req, res) => {
  try {
    const { type, species, limit = 50 } = req.query;

    const query = { isLostFound: true };
    if (type) query.lostFoundType = type;
    if (species) query.species = species;

    const pets = await Pet.find(query)
      .populate('listedBy', 'name phone avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, pets });
  } catch (error) {
    console.error('Get lost/found pets error:', error);
    res.status(500).json({ error: 'Failed to fetch lost/found pets' });
  }
};
// Get pet statistics
export const getPetStats = async (req, res) => {
  try {
    const total = await Pet.countDocuments({ isLostFound: false });
    const adopted = await Pet.countDocuments({ status: 'adopted', isLostFound: false });
    const available = await Pet.countDocuments({ status: 'available', isLostFound: false });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newListings = await Pet.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isLostFound: false
    });

    res.json({
      success: true,
      stats: {
        total,
        adopted,
        available,
        newListings
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch pet stats' });
  }
};

// Delete a pet
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check ownership
    // Convert both to strings to ensure correct comparison
    if (pet.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this pet' });
    }

    // Delete photos from Cloudinary (optional but recommended)
    // if (pet.photos && pet.photos.length > 0) { ... }

    await pet.deleteOne();

    res.json({
      success: true,
      message: 'Pet removed successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ error: 'Failed to delete pet' });
  }
};
