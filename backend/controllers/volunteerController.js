import User from '../models/User.js';
import Incident from '../models/Incident.js';

// Register as volunteer
export const registerVolunteer = async (req, res) => {
  try {
    const { serviceRadius, location } = req.body;

    const user = await User.findById(req.user._id);

    user.isVolunteer = true;
    user.volunteerData.serviceRadius = serviceRadius || 2000;
    user.volunteerData.availability = true;

    if (location) {
      user.location = location;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Successfully registered as volunteer',
      user: {
        id: user._id,
        name: user.name,
        isVolunteer: user.isVolunteer,
        volunteerData: user.volunteerData
      }
    });
  } catch (error) {
    console.error('Register volunteer error:', error);
    res.status(500).json({ error: 'Failed to register as volunteer' });
  }
};

// Update volunteer profile
export const updateVolunteerProfile = async (req, res) => {
  try {
    const { serviceRadius, availability, location } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.isVolunteer) {
      return res.status(400).json({ error: 'User is not a volunteer' });
    }

    if (serviceRadius !== undefined) {
      user.volunteerData.serviceRadius = serviceRadius;
    }

    if (availability !== undefined) {
      user.volunteerData.availability = availability;
    }

    if (location) {
      user.location = location;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        volunteerData: user.volunteerData,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Update volunteer profile error:', error);
    res.status(500).json({ error: 'Failed to update volunteer profile' });
  }
};

// Get nearby volunteers
export const getNearbyVolunteers = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const volunteers = await User.find({
      isVolunteer: true,
      'volunteerData.availability': true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
      .select('name avatar volunteerData location')
      .limit(20);

    res.json({ success: true, volunteers });
  } catch (error) {
    console.error('Get nearby volunteers error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby volunteers' });
  }
};

// Accept task
export const acceptTask = async (req, res) => {
  try {
    const { incidentId } = req.body;

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Find the volunteer assignment
    const assignment = incident.assignedVolunteers.find(
      av => av.volunteer.toString() === req.user._id.toString()
    );

    if (!assignment) {
      return res.status(400).json({ error: 'You are not assigned to this incident' });
    }

    assignment.status = 'accepted';
    assignment.acceptedAt = new Date();

    incident.status = 'in_progress';

    await incident.addTimelineEntry(
      'Volunteer accepted task',
      req.user._id
    );

    await incident.save();

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_accepted', {
        incidentId: incident._id,
        volunteerId: req.user._id
      });
    }

    res.json({
      success: true,
      message: 'Task accepted successfully',
      incident
    });
  } catch (error) {
    console.error('Accept task error:', error);
    res.status(500).json({ error: 'Failed to accept task' });
  }
};

// Submit resolution for verification (replaces direct task completion)
// Karma is NOT awarded here - only after admin verification
export const submitResolution = async (req, res) => {
  try {
    const { incidentId, notes, outcome, proofPhotos } = req.body;

    // Validate proof photo is provided
    if (!proofPhotos || proofPhotos.length === 0) {
      return res.status(400).json({ 
        error: 'Proof photo is required when marking a case as resolved' 
      });
    }

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Find the volunteer assignment
    const assignment = incident.assignedVolunteers.find(
      av => av.volunteer.toString() === req.user._id.toString()
    );

    if (!assignment) {
      return res.status(400).json({ error: 'You are not assigned to this incident' });
    }

    if (assignment.status === 'completed') {
      return res.status(400).json({ error: 'You have already submitted a resolution for this incident' });
    }

    // Upload proof photos to Cloudinary
    const uploadedPhotos = [];
    for (const photo of proofPhotos) {
      try {
        // Check if it's a base64 string or already a URL
        if (photo.startsWith('data:') || photo.startsWith('file:')) {
          const cloudinaryService = (await import('../services/cloudinaryService.js')).default;
          const uploaded = await cloudinaryService.uploadBase64Image(photo, 'pawmitra/resolutions');
          uploadedPhotos.push({ 
            url: uploaded.url, 
            publicId: uploaded.publicId,
            uploadedAt: new Date()
          });
        } else if (photo.startsWith('http')) {
          // Already a URL, use as is
          uploadedPhotos.push({ 
            url: photo, 
            publicId: null,
            uploadedAt: new Date()
          });
        }
      } catch (uploadError) {
        console.error('Error uploading proof photo:', uploadError);
        // Continue with other photos even if one fails
      }
    }

    if (uploadedPhotos.length === 0) {
      return res.status(400).json({ error: 'Failed to upload proof photos. Please try again.' });
    }

    // Update volunteer assignment status
    assignment.status = 'completed';

    // Update incident - mark as pending_verification (NOT resolved yet)
    incident.status = 'pending_verification';
    incident.resolutionNotes = notes;
    incident.outcome = outcome || 'rescued';
    
    // Set verification data
    incident.verification = {
      status: 'pending',
      submittedBy: req.user._id,
      submittedAt: new Date(),
      proofPhotos: uploadedPhotos
    };

    // Add timeline entry
    incident.timeline.push({
      action: 'Resolution submitted for verification',
      performedBy: req.user._id,
      notes: notes || 'Volunteer submitted resolution with proof photos',
      timestamp: new Date()
    });

    await incident.save();

    // Emit Socket.io event for admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('new_verification_request', {
        incidentId: incident._id,
        volunteerId: req.user._id,
        volunteerName: req.user.name,
        submittedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Resolution submitted! Awaiting admin verification for karma points.',
      status: 'pending_verification',
      incident: {
        id: incident._id,
        status: incident.status,
        verification: incident.verification.status
      }
    });
  } catch (error) {
    console.error('Submit resolution error:', error);
    res.status(500).json({ error: 'Failed to submit resolution' });
  }
};

// Legacy completeTask - redirects to submitResolution for backward compatibility
export const completeTask = async (req, res) => {
  // If proofPhotos not provided, return error explaining new flow
  if (!req.body.proofPhotos || req.body.proofPhotos.length === 0) {
    return res.status(400).json({ 
      error: 'Proof photo is now required. Please capture a photo of the resolved situation.',
      requiresProofPhoto: true
    });
  }
  
  // Forward to submitResolution
  return submitResolution(req, res);
};


// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const volunteers = await User.find({ isVolunteer: true })
      .select('name avatar volunteerData')
      .sort({ 'volunteerData.karmaPoints': -1 })
      .limit(parseInt(limit));

    const leaderboard = volunteers.map((v, index) => ({
      rank: index + 1,
      id: v._id,
      name: v.name,
      avatar: v.avatar,
      karmaPoints: v.volunteerData.karmaPoints,
      tasksCompleted: v.volunteerData.tasksCompleted,
      badges: v.volunteerData.badges
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Get volunteer stats
export const getVolunteerStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Admin or NGO Level Stats
    if (user.role === 'admin' || user.role === 'ngo') {
      const totalVolunteers = await User.countDocuments({ isVolunteer: true });
      const activeVolunteers = await User.countDocuments({
        isVolunteer: true,
        'volunteerData.availability': true
      });

      return res.json({
        success: true,
        activeVolunteers,
        totalVolunteers
      });
    }

    // Volunteer Personal Stats
    if (!user.isVolunteer) {
      return res.status(400).json({ error: 'User is not a volunteer' });
    }

    // Get assigned incidents
    const assignedIncidents = await Incident.find({
      'assignedVolunteers.volunteer': req.user._id
    }).select('status aiAnalysis createdAt assignedVolunteers');

    const stats = {
      karmaPoints: user.volunteerData.karmaPoints,
      tasksCompleted: user.volunteerData.tasksCompleted,
      badges: user.volunteerData.badges,
      activeTasks: assignedIncidents.filter(i =>
        i.assignedVolunteers.some(av =>
          av.volunteer.toString() === req.user._id.toString() &&
          av.status === 'accepted'
        )
      ).length,
      pendingTasks: assignedIncidents.filter(i =>
        i.assignedVolunteers.some(av =>
          av.volunteer.toString() === req.user._id.toString() &&
          av.status === 'pending'
        )
      ).length,
      completedTasks: assignedIncidents.filter(i =>
        i.assignedVolunteers.some(av =>
          av.volunteer.toString() === req.user._id.toString() &&
          av.status === 'completed'
        )
      ).length
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get volunteer stats error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer stats' });
  }
};
