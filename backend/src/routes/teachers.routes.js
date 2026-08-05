import express from 'express';
import { teachersController } from '../controllers/teachers.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/school/:schoolId', asyncHandler(teachersController.list));
router.post('/school/:schoolId', asyncHandler(teachersController.add));
router.delete('/:id', asyncHandler(teachersController.remove));

export default router;
