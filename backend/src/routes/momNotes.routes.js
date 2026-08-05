import express from 'express';
import { momNotesController } from '../controllers/momNotes.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/school/:schoolId', asyncHandler(momNotesController.list));
router.post('/school/:schoolId', asyncHandler(momNotesController.add));

export default router;
