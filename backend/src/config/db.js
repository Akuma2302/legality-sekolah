import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongodbUri) {
    console.error('Missing MONGODB_URI env var.');
    return;
  }
  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}
