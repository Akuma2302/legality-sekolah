import express from 'express';
import { alumniController } from '../controllers/alumni.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Public — same access model as schools, no legality-style admin field on alumni entries
router.get('/', asyncHandler(alumniController.list));
router.post('/', asyncHandler(alumniController.create));
router.get('/:id', asyncHandler(alumniController.getById));
router.put('/:id', asyncHandler(alumniController.update));
router.delete('/:id', asyncHandler(alumniController.remove));

export default router;
