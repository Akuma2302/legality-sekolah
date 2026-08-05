import express from 'express';
import { schoolsController } from '../controllers/schools.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// ---- USER: only their own schools (as PIC) ----
router.get('/mine', requireAuth, asyncHandler(schoolsController.listMine));
router.post('/', requireAuth, asyncHandler(schoolsController.create));
router.get('/:id', requireAuth, asyncHandler(schoolsController.getById));
router.put('/:id', requireAuth, asyncHandler(schoolsController.update));
router.delete('/:id', requireAuth, asyncHandler(schoolsController.remove));

// ---- ADMIN: every school across all PICs ----
router.get('/', requireAuth, requireAdmin, asyncHandler(schoolsController.listAll));
router.patch('/:id/legality-status', requireAuth, requireAdmin, asyncHandler(schoolsController.updateLegalityStatus));

export default router;
