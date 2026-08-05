import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, trim: true, default: 'Admin' },
    // Every account in this system is an admin — there's no self-signup flow,
    // accounts are only ever created via the seed-admin script (see scripts/seedAdmin.js).
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Never send the password hash back in an API response
toCleanJSON(userSchema, { hide: ['password_hash'] });

export const User = mongoose.model('User', userSchema);
