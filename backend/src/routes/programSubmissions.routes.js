import express from 'express';
import { programSubmissionsController } from '../controllers/programSubmissions.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Public — anyone can submit the form, no login required
router.post('/', asyncHandler(programSubmissionsController.submit));

// Admin only — submissions contain PIC contact details, not meant for public viewing
router.get('/', requireAuth, requireAdmin, asyncHandler(programSubmissionsController.list));

export default router;
