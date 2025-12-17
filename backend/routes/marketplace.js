import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  registerService,
  getServices,
  getNearbyServices,
  getService,
  addReview,
  updateService
} from '../controllers/marketplaceController.js';

const router = express.Router();

// @route   POST /api/marketplace/services
// @desc    Register service provider
// @access  Private
router.post('/services', authenticate, registerService);

// @route   GET /api/marketplace/services
// @desc    Get all services with filters
// @access  Public
router.get('/services', getServices);

// @route   GET /api/marketplace/services/nearby
// @desc    Get nearby services
// @access  Public
router.get('/services/nearby', getNearbyServices);

// @route   GET /api/marketplace/services/:id
// @desc    Get single service
// @access  Public
router.get('/services/:id', getService);

// @route   POST /api/marketplace/services/:id/review
// @desc    Add review to service
// @access  Private
router.post('/services/:id/review', authenticate, addReview);

// @route   PATCH /api/marketplace/services/:id
// @desc    Update service
// @access  Private (Owner only)
router.patch('/services/:id', authenticate, updateService);

export default router;
