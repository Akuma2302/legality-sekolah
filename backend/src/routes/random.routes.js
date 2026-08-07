import express from 'express';
import { randomController } from '../controllers/random.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(randomController.list));
router.post('/', asyncHandler(randomController.create));
router.get('/:id', asyncHandler(randomController.getById));
router.put('/:id', asyncHandler(randomController.update));
router.delete('/:id', asyncHandler(randomController.remove));

export default router;