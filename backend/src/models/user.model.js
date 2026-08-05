import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Never send the password hash back in an API response
toCleanJSON(userSchema, { hide: ['password_hash'] });

export const User = mongoose.model('User', userSchema);
