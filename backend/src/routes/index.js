import express from 'express';
import authRoutes from './auth.routes.js';
import schoolsRoutes from './schools.routes.js';
import alumniRoutes from './alumni.routes.js';
import teachersRoutes from './teachers.routes.js';
import momNotesRoutes from './momNotes.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolsRoutes);
router.use('/alumni', alumniRoutes);
router.use('/teachers', teachersRoutes);
router.use('/mom-notes', momNotesRoutes);

export default router;
