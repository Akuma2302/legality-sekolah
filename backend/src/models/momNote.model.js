import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';
import { PARENT_TYPES } from './teacher.model.js';

const { Schema } = mongoose;

const momNoteSchema = new Schema(
  {
    // Polymorphic reference — a MOM note belongs to either a School or an Alumni entry.
    parent_type: { type: String, enum: PARENT_TYPES, required: true },
    parent_id: { type: Schema.Types.ObjectId, required: true, refPath: 'parent_type' },

    content: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

momNoteSchema.index({ parent_type: 1, parent_id: 1 });

toCleanJSON(momNoteSchema);

export const MomNote = mongoose.model('MomNote', momNoteSchema);
