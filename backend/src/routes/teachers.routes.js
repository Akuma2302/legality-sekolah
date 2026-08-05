import express from 'express';
import { teachersController } from '../controllers/teachers.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/school/:schoolId', requireAuth, asyncHandler(teachersController.list));
router.post('/school/:schoolId', requireAuth, asyncHandler(teachersController.add));
router.delete('/:id', requireAuth, asyncHandler(teachersController.remove));

export default router;
