import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';
import { STATES } from './school.model.js';

const { Schema } = mongoose;

// Teachers reuse the same Malaysian state list as schools.
export { STATES };

const teacherSchema = new Schema(
  {
    school_id: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true, trim: true },
    position: { type: String, default: '' },
    subject: { type: String, default: '' },
    phone: { type: String, default: '' },
    state: { type: String, enum: [...STATES, ''], default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

teacherSchema.index({ school_id: 1 });

toCleanJSON(teacherSchema);

export const Teacher = mongoose.model('Teacher', teacherSchema);
