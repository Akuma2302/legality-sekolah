import express from 'express';
import { schoolsController } from '../controllers/schools.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// ---- PUBLIC — the user portal has no login, so anyone can browse/add/edit schools ----
router.get('/', asyncHandler(schoolsController.list));
router.post('/', asyncHandler(schoolsController.create));
router.get('/:id', asyncHandler(schoolsController.getById));
router.put('/:id', asyncHandler(schoolsController.update));
router.delete('/:id', asyncHandler(schoolsController.remove));

// ---- ADMIN ONLY — requires login. The only thing gated behind admin auth. ----
router.patch('/:id/legality-status', requireAuth, requireAdmin, asyncHandler(schoolsController.updateLegalityStatus));

export default router;
