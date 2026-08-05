import express from 'express';
import { momNotesController } from '../controllers/momNotes.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/school/:schoolId', requireAuth, asyncHandler(momNotesController.list));
router.post('/school/:schoolId', requireAuth, asyncHandler(momNotesController.add));

export default router;
