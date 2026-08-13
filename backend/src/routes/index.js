import express from 'express';
import authRoutes from './auth.routes.js';
import schoolsRoutes from './schools.routes.js';
import alumniRoutes from './alumni.routes.js';
import randomRoutes from './random.routes.js';
import teachersRoutes from './teachers.routes.js';
import momNotesRoutes from './momNotes.routes.js';
import programSubmissionsRoutes from './programSubmissions.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolsRoutes);
router.use('/alumni', alumniRoutes);
router.use('/random', randomRoutes);
router.use('/teachers', teachersRoutes);
router.use('/mom-notes', momNotesRoutes);
router.use('/program-submissions', programSubmissionsRoutes);

export default router;
