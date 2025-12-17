import Incident from '../models/Incident.js';
import User from '../models/User.js';
import cloudinaryService from '../services/cloudinaryService.js';
import geminiService from '../services/geminiService.js';

// Create new incident
export const createIncident = async (req, res) => {
  try {
    const { location, address, description, imageBase64 } = req.body;

    if (!location || !location.coordinates || !imageBase64) {
      return res.status(400).json({ 
        error: 'Location and image are required' 
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinaryService.uploadBase64Image(
      imageBase64,
      'pawmitra/incidents'
    );

    // Extract base64 data for AI analysis
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Analyze image with Gemini AI
    const aiAnalysis = await geminiService.analyzeIncidentImage(base64Data);

    // Create incident
    const incident = await Incident.create({
      reportedBy: req.user._id,
      location: {
        type: 'Point',
        coordinates: location.coordinates // [longitude, latitude]
      },
      address: address || 'Location not specified',
      photos: [{
        url: uploadedImage.url,
        publicId: uploadedImage.publicId
      }],
      description,
      aiAnalysis,
      timeline: [{
        action: 'Incident reported',
        performedBy: req.user._id,
        timestamp: new Date()
      }]
    });

    // Populate reporter details
    await incident.populate('reportedBy', 'name email avatar');

    // Emit Socket.io event for real-time alerts
    const io = req.app.get('io');
    if (io) {
      // Find nearby volunteers (within 2km)
      const nearbyVolunteers = await User.find({
        isVolunteer: true,
        'volunteerData.availability': true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: location.coordinates
            },
            $maxDistance: 2000 // 2km in meters
          }
        }
      }).select('_id');

      // Emit to nearby volunteers
      nearbyVolunteers.forEach(volunteer => {
        io.to(`user_${volunteer._id}`).emit('new_incident_alert', {
          incident: {
            id: incident._id,
            location: incident.location,
            address: incident.address,
            priority: incident.aiAnalysis.priority,
            category: incident.aiAnalysis.category,
            photo: incident.photos[0]?.url,
            reportedAt: incident.createdAt
          }
        });
      });

      // Emit to admin dashboard
      io.to('admin_room').emit('new_incident', incident);
    }

    res.status(201).json({
      success: true,
      incident,
      message: 'Incident reported successfully'
    });
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
};

// Get all incidents with filters
export const getIncidents = async (req, res) => {
  try {
    const { status, priority, category, limit = 50, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query['aiAnalysis.priority'] = priority;
    if (category) query['aiAnalysis.category'] = category;

    const incidents = await Incident.find(query)
      .populate('reportedBy', 'name avatar')
      .populate('assignedVolunteers.volunteer', 'name avatar')
      .populate('assignedNGO', 'name ngoData')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Incident.countDocuments(query);

    res.json({
      success: true,
      incidents,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

// Get nearby incidents
export const getNearbyIncidents = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const incidents = await Incident.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: { $nin: ['resolved', 'closed'] }
    })
      .populate('reportedBy', 'name avatar')
      .limit(20);

    res.json({ success: true, incidents });
  } catch (error) {
    console.error('Get nearby incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby incidents' });
  }
};

// Get single incident
export const getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email phone avatar')
      .populate('assignedVolunteers.volunteer', 'name phone avatar volunteerData')
      .populate('assignedNGO', 'name ngoData')
      .populate('timeline.performedBy', 'name');

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({ success: true, incident });
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
};

// Update incident status
export const updateIncidentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = status;
    
    await incident.addTimelineEntry(
      `Status updated to ${status}`,
      req.user._id,
      notes
    );

    if (status === 'resolved') {
      incident.resolvedAt = new Date();
      incident.resolutionNotes = notes;
    }

    await incident.save();

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('incident_updated', incident);
      io.to(`incident_${incident._id}`).emit('status_updated', {
        incidentId: incident._id,
        status: incident.status
      });
    }

    res.json({ success: true, incident });
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

// Assign volunteer to incident
export const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const volunteer = await User.findById(volunteerId);
    if (!volunteer || !volunteer.isVolunteer) {
      return res.status(400).json({ error: 'Invalid volunteer' });
    }

    // Check if already assigned
    const alreadyAssigned = incident.assignedVolunteers.some(
      av => av.volunteer.toString() === volunteerId
    );

    if (alreadyAssigned) {
      return res.status(400).json({ error: 'Volunteer already assigned' });
    }

    incident.assignedVolunteers.push({
      volunteer: volunteerId,
      assignedAt: new Date(),
      status: 'pending'
    });

    incident.status = 'volunteer_assigned';
    
    await incident.addTimelineEntry(
      'Volunteer assigned',
      req.user._id,
      `Assigned to ${volunteer.name}`
    );

    await incident.save();

    // Emit Socket.io event to volunteer
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${volunteerId}`).emit('task_assigned', {
        incident: {
          id: incident._id,
          location: incident.location,
          address: incident.address,
          priority: incident.aiAnalysis.priority
        }
      });
    }

    res.json({ success: true, incident });
  } catch (error) {
    console.error('Assign volunteer error:', error);
    res.status(500).json({ error: 'Failed to assign volunteer' });
  }
};
