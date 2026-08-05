import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';

export const app = express();

// Allow the Netlify frontend to call this API — set FRONTEND_URL in Render env vars.
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'legality-sekolah-backend' });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
