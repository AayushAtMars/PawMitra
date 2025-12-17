import express from 'express';
import { authenticate, isVolunteer } from '../middleware/auth.js';
import {
  registerVolunteer,
  updateVolunteerProfile,
  getNearbyVolunteers,
  acceptTask,
  completeTask,
  getLeaderboard,
  getVolunteerStats
} from '../controllers/volunteerController.js';

const router = express.Router();

// @route   POST /api/volunteers/register
// @desc    Register as volunteer
// @access  Private
router.post('/register', authenticate, registerVolunteer);

// @route   PATCH /api/volunteers/profile
// @desc    Update volunteer profile
// @access  Private (Volunteer only)
router.patch('/profile', authenticate, isVolunteer, updateVolunteerProfile);

// @route   GET /api/volunteers/nearby
// @desc    Get nearby volunteers
// @access  Private
router.get('/nearby', authenticate, getNearbyVolunteers);

// @route   POST /api/volunteers/accept-task
// @desc    Accept incident task
// @access  Private (Volunteer only)
router.post('/accept-task', authenticate, isVolunteer, acceptTask);

// @route   POST /api/volunteers/complete-task
// @desc    Complete incident task and earn karma
// @access  Private (Volunteer only)
router.post('/complete-task', authenticate, isVolunteer, completeTask);

// @route   GET /api/volunteers/leaderboard
// @desc    Get volunteer leaderboard
// @access  Public
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/volunteers/stats
// @desc    Get volunteer statistics
// @access  Private (Volunteer only)
router.get('/stats', authenticate, isVolunteer, getVolunteerStats);

export default router;
