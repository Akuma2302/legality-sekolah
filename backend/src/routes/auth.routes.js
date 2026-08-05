import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// No POST /signup — admin accounts are only ever created via scripts/seedAdmin.js
router.post('/signin', asyncHandler(authController.signin));
router.get('/me', requireAuth, asyncHandler(authController.me));

export default router;
