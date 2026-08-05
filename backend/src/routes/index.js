import express from 'express';
import schoolsRoutes from './schools.routes.js';
import teachersRoutes from './teachers.routes.js';
import momNotesRoutes from './momNotes.routes.js';

const router = express.Router();

router.use('/schools', schoolsRoutes);
router.use('/teachers', teachersRoutes);
router.use('/mom-notes', momNotesRoutes);

export default router;
