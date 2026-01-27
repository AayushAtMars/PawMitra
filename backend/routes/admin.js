import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  getDashboardStats,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getAllVolunteers,
  getAllIncidents,
  addBonusKarma
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// All routes require admin or ngo role
router.use(authorizeRoles('admin', 'ngo'));

// Dashboard
router.get('/stats', getDashboardStats);

// Verifications
router.get('/verifications/pending', getPendingVerifications);
router.post('/verifications/approve', approveVerification);
router.post('/verifications/reject', rejectVerification);

// Volunteers
router.get('/volunteers', getAllVolunteers);
router.post('/volunteers/bonus-karma', addBonusKarma);

// Incidents
router.get('/incidents', getAllIncidents);

export default router;
