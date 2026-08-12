import express from 'express';
import { momNotesController } from '../controllers/momNotes.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/:parentType/:parentId', asyncHandler(momNotesController.list));
router.post('/:parentType/:parentId', asyncHandler(momNotesController.add));
router.put('/:id', asyncHandler(momNotesController.update));
router.delete('/:id', asyncHandler(momNotesController.remove));

export default router;
