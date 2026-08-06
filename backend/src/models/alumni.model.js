import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';
import { SCHOOL_TYPES, BRANCHES, STATES } from './school.model.js';

const { Schema } = mongoose;

// Alumni entries reuse the same type/branch/state options as schools.
export { SCHOOL_TYPES, BRANCHES, STATES };

export const ALUMNI_STATUSES = [
  'Done messaging teacher',
  'Done proposing talk',
  'Done getting talk date',
  'Done talk preparation',
  'Done creating program report',
];

/** Fields anyone can edit through the public user portal. */
export const EDITABLE_ALUMNI_FIELDS = [
  'school_name', 'pic_name', 'type', 'branch', 'state', 'status',
  'email', 'contact_number', 'website', 'tiktok', 'instagram', 'note',
];

const alumniSchema = new Schema(
  {
    // Step 1 (Add school)
    school_name: { type: String, required: true, trim: true },
    pic_name: { type: String, required: true, trim: true },
    type: { type: String, enum: SCHOOL_TYPES, required: true },

    // Step 2 (Detail view, editable)
    branch: { type: String, enum: [...BRANCHES, ''], default: '' },
    state: { type: String, enum: [...STATES, ''], default: '' },
    status: { type: String, enum: [...ALUMNI_STATUSES, ''], default: '' },
    email: { type: String, default: '' },
    contact_number: { type: String, default: '' },
    website: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    instagram: { type: String, default: '' },
    note: { type: String, default: '' }, // "for PIC reference"
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

toCleanJSON(alumniSchema);

export const Alumni = mongoose.model('Alumni', alumniSchema);
