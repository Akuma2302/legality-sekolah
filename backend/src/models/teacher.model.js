import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';
import { STATES } from './school.model.js';

const { Schema } = mongoose;

// Teachers reuse the same Malaysian state list as schools.
export { STATES };

export const PARENT_TYPES = ['School', 'Alumni'];

const teacherSchema = new Schema(
  {
    // Polymorphic reference — a teacher belongs to either a School or an Alumni entry.
    parent_type: { type: String, enum: PARENT_TYPES, required: true },
    parent_id: { type: Schema.Types.ObjectId, required: true, refPath: 'parent_type' },

    name: { type: String, required: true, trim: true },
    position: { type: String, default: '' },
    subject: { type: String, default: '' },
    phone: { type: String, default: '' },
    state: { type: String, enum: [...STATES, ''], default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

teacherSchema.index({ parent_type: 1, parent_id: 1 });

toCleanJSON(teacherSchema);

export const Teacher = mongoose.model('Teacher', teacherSchema);
