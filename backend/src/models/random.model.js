import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';
import { SCHOOL_TYPES, BRANCHES, STATES } from './school.model.js';
import { ALUMNI_STATUSES as RANDOM_STATUSES, SCHOOL_TYPE_OPTIONS } from './alumni.model.js';

const { Schema } = mongoose;

// Random entries reuse the same type/branch/state/status/school-type options as alumni.
export { SCHOOL_TYPES, BRANCHES, STATES, RANDOM_STATUSES, SCHOOL_TYPE_OPTIONS };

/** Fields anyone can edit through the public user portal. */
export const EDITABLE_RANDOM_FIELDS = [
  'school_name', 'pic_name', 'type', 'school_type', 'branch', 'state', 'status',
  'email', 'contact_number', 'website', 'tiktok', 'instagram', 'program_propose', 'note',
];

const randomSchema = new Schema(
  {
    // Step 1 (Add)
    school_name: { type: String, required: true, trim: true },
    pic_name: { type: String, required: true, trim: true },
    type: { type: String, enum: SCHOOL_TYPES, required: true },

    // Step 2 (Detail view, editable)
    school_type: { type: String, enum: [...SCHOOL_TYPE_OPTIONS, ''], default: '' },
    branch: { type: String, enum: [...BRANCHES, ''], default: '' },
    state: { type: String, enum: [...STATES, ''], default: '' },
    status: { type: String, enum: [...RANDOM_STATUSES, ''], default: '' },
    email: { type: String, default: '' },
    contact_number: { type: String, default: '' },
    website: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    instagram: { type: String, default: '' },
    program_propose: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

toCleanJSON(randomSchema);

export const Random = mongoose.model('Random', randomSchema);