import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createIncident,
  getIncidents,
  getNearbyIncidents,
  getIncident,
  updateIncidentStatus,
  resolveIncident,
  acceptTask,
  assignVolunteer
} from '../controllers/incidentController.js';

const router = express.Router();

// @route   POST /api/incidents
// @desc    Create new incident
// @access  Private
router.post('/', authenticate, createIncident);

// @route   GET /api/incidents
// @desc    Get all incidents with filters
// @access  Private
router.get('/', authenticate, getIncidents);

// @route   GET /api/incidents/nearby
// @desc    Get nearby incidents
// @access  Private
router.get('/nearby', authenticate, getNearbyIncidents);

// @route   GET /api/incidents/:id
// @desc    Get single incident
// @access  Private
router.get('/:id', authenticate, getIncident);

// @route   PATCH /api/incidents/:id/status
// @desc    Update incident status
// @access  Private
router.patch('/:id/status', authenticate, updateIncidentStatus);

// @route   POST /api/incidents/:id/accept
// @desc    Accept task (volunteer self-assignment)
// @access  Private (Volunteers only)
router.post('/:id/accept', authenticate, acceptTask);

// @route   POST /api/incidents/:id/resolve
// @desc    Resolve incident (for volunteers)
// @access  Private (Volunteers only)
router.post('/:id/resolve', authenticate, resolveIncident);

// @route   POST /api/incidents/:id/assign
// @desc    Assign volunteer to incident
// @access  Private
router.post('/:id/assign', authenticate, assignVolunteer);

export default router;
