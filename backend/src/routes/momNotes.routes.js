import express from 'express';
import { momNotesController } from '../controllers/momNotes.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Must come before /:parentType/:parentId below — both are two-segment paths,
// and Express matches whichever is registered first ("latest" would otherwise
// be swallowed as a parentType value).
router.get('/latest/:parentType', asyncHandler(momNotesController.latestByParentType));

router.get('/:parentType/:parentId', asyncHandler(momNotesController.list));
router.post('/:parentType/:parentId', asyncHandler(momNotesController.add));
router.put('/:id', asyncHandler(momNotesController.update));
router.delete('/:id', asyncHandler(momNotesController.remove));

export default router;
