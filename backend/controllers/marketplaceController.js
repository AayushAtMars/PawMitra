import Marketplace from '../models/Marketplace.js';
import cloudinaryService from '../services/cloudinaryService.js';

// Register service provider
export const registerService = async (req, res) => {
  try {
    const {
      businessName,
      category,
      contactInfo,
      location,
      address,
      description,
      services,
      operatingHours,
      emergencyAvailable,
      emergency24x7,
      photos,
      logo
    } = req.body;

    // Upload photos
    let uploadedPhotos = [];
    if (photos && photos.length > 0) {
      for (const photo of photos) {
        const uploaded = await cloudinaryService.uploadBase64Image(
          photo,
          'pawmitra/marketplace'
        );
        uploadedPhotos.push({
          url: uploaded.url,
          publicId: uploaded.publicId
        });
      }
    }

    // Upload logo
    let uploadedLogo;
    if (logo) {
      uploadedLogo = await cloudinaryService.uploadBase64Image(
        logo,
        'pawmitra/marketplace/logos'
      );
    }

    const marketplace = await Marketplace.create({
      businessName,
      category,
      owner: req.user._id,
      contactInfo,
      location,
      address,
      description,
      services,
      operatingHours,
      emergencyAvailable,
      emergency24x7,
      photos: uploadedPhotos,
      logo: uploadedLogo ? {
        url: uploadedLogo.url,
        publicId: uploadedLogo.publicId
      } : undefined
    });

    res.status(201).json({
      success: true,
      marketplace,
      message: 'Service registered successfully'
    });
  } catch (error) {
    console.error('Register service error:', error);
    res.status(500).json({ error: 'Failed to register service' });
  }
};

// Get all services with filters
export const getServices = async (req, res) => {
  try {
    const { category, emergencyAvailable, limit = 50, page = 1 } = req.query;

    const query = { status: 'active' };
    if (category) query.category = category;
    if (emergencyAvailable === 'true') query.emergencyAvailable = true;

    const services = await Marketplace.find(query)
      .populate('owner', 'name avatar')
      .sort({ isPremium: -1, 'ratings.average': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Marketplace.countDocuments(query);

    res.json({
      success: true,
      services,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get nearby services
export const getNearbyServices = async (req, res) => {
  try {
    const { longitude, latitude, category, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const query = {
      status: 'active',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    };

    if (category) query.category = category;

    const services = await Marketplace.find(query)
      .populate('owner', 'name avatar')
      .sort({ isPremium: -1, 'ratings.average': -1 })
      .limit(20);

    res.json({ success: true, services });
  } catch (error) {
    console.error('Get nearby services error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby services' });
  }
};

// Get single service
export const getService = async (req, res) => {
  try {
    const service = await Marketplace.findById(req.params.id)
      .populate('owner', 'name email phone avatar')
      .populate('reviews.user', 'name avatar');

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Increment views
    service.views += 1;
    await service.save();

    res.json({ success: true, service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const service = await Marketplace.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if user already reviewed
    const existingReview = service.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this service' });
    }

    service.reviews.push({
      user: req.user._id,
      rating,
      comment,
      photos: photos || []
    });

    await service.updateRating();

    res.json({
      success: true,
      message: 'Review added successfully',
      averageRating: service.ratings.average
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const service = await Marketplace.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check ownership
    if (service.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this service' });
    }

    const allowedUpdates = [
      'description',
      'services',
      'operatingHours',
      'contactInfo',
      'emergencyAvailable',
      'emergency24x7'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();

    res.json({
      success: true,
      service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};
