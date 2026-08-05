import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';

const { Schema } = mongoose;

export const SCHOOL_TYPES = ['A', 'B', 'C', 'New'];
export const BRANCHES = ['Central', 'North', 'East Coast', 'Borneo'];
export const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak',
  'Perlis', 'Penang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
];
export const LEGALITY_STATUSES = ['Legal w/ BnW', 'Legal w/o BnW', 'Potentially Legal', 'Not Legal'];

/** Fields a PIC (regular user) is allowed to edit on their own school record. */
export const EDITABLE_SCHOOL_FIELDS = [
  'school_name', 'pic_name', 'type', 'branch', 'state',
  'email', 'contact_number', 'website', 'tiktok', 'instagram', 'note',
];

const schoolSchema = new Schema(
  {
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Step 1 (Add School)
    school_name: { type: String, required: true, trim: true },
    pic_name: { type: String, required: true, trim: true },
    type: { type: String, enum: SCHOOL_TYPES, required: true },

    // Step 2 (Detail view, editable)
    branch: { type: String, enum: [...BRANCHES, ''], default: '' },
    state: { type: String, enum: [...STATES, ''], default: '' },
    email: { type: String, default: '' },
    contact_number: { type: String, default: '' },
    website: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    instagram: { type: String, default: '' },
    note: { type: String, default: '' }, // "for PIC reference"

    // Admin-only field
    legality_status: { type: String, enum: LEGALITY_STATUSES, default: 'Not Legal' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

schoolSchema.index({ owner_id: 1 });

toCleanJSON(schoolSchema);

export const School = mongoose.model('School', schoolSchema);
