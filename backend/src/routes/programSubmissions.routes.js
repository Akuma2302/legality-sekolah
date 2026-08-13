import express from 'express';
import { programSubmissionsController } from '../controllers/programSubmissions.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(programSubmissionsController.submit));

export default router;
