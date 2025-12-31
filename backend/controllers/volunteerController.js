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

// Complete task
export const completeTask = async (req, res) => {
  try {
    const { incidentId, notes, outcome } = req.body;

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

    assignment.status = 'completed';

    await incident.addTimelineEntry(
      'Volunteer completed task',
      req.user._id,
      notes
    );

    // Award karma points
    const user = await User.findById(req.user._id);
    const karmaPoints = incident.aiAnalysis.priority === 'high' ? 15 :
      incident.aiAnalysis.priority === 'medium' ? 10 : 5;

    await user.addKarmaPoints(karmaPoints);
    user.volunteerData.tasksCompleted += 1;
    await user.save();

    await incident.save();

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_completed', {
        incidentId: incident._id,
        volunteerId: req.user._id
      });
    }

    res.json({
      success: true,
      message: `Task completed! You earned ${karmaPoints} karma points.`,
      karmaEarned: karmaPoints,
      totalKarma: user.volunteerData.karmaPoints,
      badges: user.volunteerData.badges
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
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
