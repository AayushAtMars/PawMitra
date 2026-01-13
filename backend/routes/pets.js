import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  addPet,
  getPets,
  getPet,
  expressInterest,
  reportLostFound,
  getLostFoundPets,
  getPetStats,
  deletePet
} from '../controllers/petController.js';

const router = express.Router();

// @route   POST /api/pets
// @desc    Add pet for adoption
// @access  Private
router.post('/', authenticate, addPet);

// @route   GET /api/pets
// @desc    Get all pets with filters
// @access  Public
router.get('/', getPets);

// @route   GET /api/pets/lost-found
// @desc    Get lost/found pets
// @access  Public
router.get('/lost-found', getLostFoundPets);

// @route   GET /api/pets/stats
// @desc    Get pet statistics
// @access  Public
router.get('/stats', getPetStats);

// @route   GET /api/pets/:id
// @desc    Get single pet
// @access  Public
router.get('/:id', getPet);

// @route   POST /api/pets/:id/interest
// @desc    Express interest in adopting
// @access  Private
router.post('/:id/interest', authenticate, expressInterest);

// @route   POST /api/pets/report-lost-found
// @desc    Report lost/found pet
// @access  Private
router.post('/report-lost-found', authenticate, reportLostFound);

// @route   DELETE /api/pets/:id
// @desc    Delete a pet
// @access  Private
router.delete('/:id', authenticate, deletePet);

export default router;
