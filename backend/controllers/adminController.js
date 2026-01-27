import Incident from '../models/Incident.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalIncidents,
      pendingVerifications,
      activeIncidents,
      resolvedIncidents,
      totalVolunteers,
      totalPets,
      adoptedPets
    ] = await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ 'verification.status': 'pending' }),
      Incident.countDocuments({ status: { $in: ['reported', 'volunteer_assigned', 'in_progress'] } }),
      Incident.countDocuments({ status: 'resolved' }),
      User.countDocuments({ isVolunteer: true }),
      Pet.countDocuments({ isLostFound: false }),
      Pet.countDocuments({ status: 'adopted' })
    ]);

    res.json({
      success: true,
      stats: {
        totalIncidents,
        pendingVerifications,
        activeIncidents,
        resolvedIncidents,
        totalVolunteers,
        totalPets,
        adoptedPets
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Get all pending verifications
export const getPendingVerifications = async (req, res) => {
  try {
    const incidents = await Incident.find({ 'verification.status': 'pending' })
      .populate('reportedBy', 'name email avatar phone')
      .populate('verification.submittedBy', 'name email avatar phone volunteerData')
      .populate('assignedVolunteers.volunteer', 'name avatar')
      .sort({ 'verification.submittedAt': -1 });

    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};

// Approve verification and award karma
export const approveVerification = async (req, res) => {
  try {
    const { incidentId, bonusKarma = 0 } = req.body;

    if (!incidentId) {
      return res.status(400).json({ error: 'Incident ID is required' });
    }

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (incident.verification.status !== 'pending') {
      return res.status(400).json({ error: 'This incident is not pending verification' });
    }

    const volunteer = await User.findById(incident.verification.submittedBy);

    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    // Calculate karma points based on priority
    const baseKarma = incident.aiAnalysis.priority === 'high' ? 15 :
                      incident.aiAnalysis.priority === 'medium' ? 10 : 5;
    const totalKarma = baseKarma + parseInt(bonusKarma || 0);

    // Award karma points NOW (after verification)
    if (volunteer.volunteerData) {
      volunteer.volunteerData.karmaPoints = (volunteer.volunteerData.karmaPoints || 0) + totalKarma;
      volunteer.volunteerData.tasksCompleted = (volunteer.volunteerData.tasksCompleted || 0) + 1;
      
      // Award badges based on karma points
      const badges = volunteer.volunteerData.badges || [];
      const badgeThresholds = [
        { name: 'first_rescue', threshold: 1, label: 'First Rescue' },
        { name: 'helper', threshold: 10, label: 'Helper' },
        { name: 'hero', threshold: 50, label: 'Hero' },
        { name: 'legend', threshold: 100, label: 'Legend' },
        { name: 'champion', threshold: 250, label: 'Champion' }
      ];

      for (const badge of badgeThresholds) {
        if (volunteer.volunteerData.karmaPoints >= badge.threshold) {
          if (!badges.includes(badge.name)) {
            badges.push(badge.name);
          }
        }
      }
      volunteer.volunteerData.badges = badges;
    }
    await volunteer.save();

    // Update incident status to resolved
    incident.status = 'resolved';
    incident.verification.status = 'approved';
    incident.verification.verifiedBy = req.user._id;
    incident.verification.verifiedAt = new Date();
    incident.verification.karmaAwarded = totalKarma;
    incident.resolvedAt = new Date();

    // Add timeline entry
    incident.timeline.push({
      action: 'Verification approved by admin',
      performedBy: req.user._id,
      notes: `Awarded ${totalKarma} karma points`,
      timestamp: new Date()
    });

    await incident.save();

    // Emit socket event to notify volunteer
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${volunteer._id}`).emit('verification_approved', {
        incidentId: incident._id,
        karmaEarned: totalKarma,
        totalKarma: volunteer.volunteerData.karmaPoints,
        message: `Your resolution was verified! You earned ${totalKarma} karma points.`
      });

      io.to('admin_room').emit('verification_processed', {
        incidentId: incident._id,
        status: 'approved'
      });
    }

    res.json({
      success: true,
      message: 'Verification approved successfully',
      karmaAwarded: totalKarma,
      volunteerName: volunteer.name,
      incident: {
        id: incident._id,
        status: incident.status
      }
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ error: 'Failed to approve verification' });
  }
};

// Reject verification
export const rejectVerification = async (req, res) => {
  try {
    const { incidentId, reason } = req.body;

    if (!incidentId) {
      return res.status(400).json({ error: 'Incident ID is required' });
    }

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (incident.verification.status !== 'pending') {
      return res.status(400).json({ error: 'This incident is not pending verification' });
    }

    // Update incident - back to in_progress so volunteer can resubmit
    incident.status = 'in_progress';
    incident.verification.status = 'rejected';
    incident.verification.rejectionReason = reason;
    incident.verification.verifiedBy = req.user._id;
    incident.verification.verifiedAt = new Date();

    // Add timeline entry
    incident.timeline.push({
      action: 'Verification rejected by admin',
      performedBy: req.user._id,
      notes: reason,
      timestamp: new Date()
    });

    await incident.save();

    // Emit socket event to notify volunteer
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${incident.verification.submittedBy}`).emit('verification_rejected', {
        incidentId: incident._id,
        reason,
        message: `Your resolution was rejected. Reason: ${reason}`
      });

      io.to('admin_room').emit('verification_processed', {
        incidentId: incident._id,
        status: 'rejected'
      });
    }

    res.json({
      success: true,
      message: 'Verification rejected',
      incident: {
        id: incident._id,
        status: incident.status
      }
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({ error: 'Failed to reject verification' });
  }
};

// Get all volunteers with stats
export const getAllVolunteers = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'karmaPoints' } = req.query;

    const sortOptions = {
      karmaPoints: { 'volunteerData.karmaPoints': -1 },
      tasksCompleted: { 'volunteerData.tasksCompleted': -1 },
      recent: { createdAt: -1 }
    };

    const volunteers = await User.find({ isVolunteer: true })
      .select('name email avatar phone volunteerData createdAt')
      .sort(sortOptions[sortBy] || sortOptions.karmaPoints)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments({ isVolunteer: true });

    res.json({
      success: true,
      volunteers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
};

// Get all incidents with filters
export const getAllIncidents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority,
      verificationStatus
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (priority) query['aiAnalysis.priority'] = priority;
    if (verificationStatus) query['verification.status'] = verificationStatus;

    const incidents = await Incident.find(query)
      .populate('reportedBy', 'name avatar')
      .populate('verification.submittedBy', 'name avatar')
      .populate('assignedVolunteers.volunteer', 'name avatar')
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

// Add bonus karma to a volunteer
export const addBonusKarma = async (req, res) => {
  try {
    const { volunteerId, karma, reason } = req.body;

    if (!volunteerId || !karma) {
      return res.status(400).json({ error: 'Volunteer ID and karma amount are required' });
    }

    const volunteer = await User.findById(volunteerId);

    if (!volunteer || !volunteer.isVolunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    volunteer.volunteerData.karmaPoints = (volunteer.volunteerData.karmaPoints || 0) + parseInt(karma);
    await volunteer.save();

    // Notify volunteer
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${volunteerId}`).emit('bonus_karma', {
        karma: parseInt(karma),
        reason,
        totalKarma: volunteer.volunteerData.karmaPoints
      });
    }

    res.json({
      success: true,
      message: `Added ${karma} karma to ${volunteer.name}`,
      newTotal: volunteer.volunteerData.karmaPoints
    });
  } catch (error) {
    console.error('Add bonus karma error:', error);
    res.status(500).json({ error: 'Failed to add bonus karma' });
  }
};
