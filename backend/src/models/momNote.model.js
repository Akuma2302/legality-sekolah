import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';

const { Schema } = mongoose;

const momNoteSchema = new Schema(
  {
    school_id: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

momNoteSchema.index({ school_id: 1 });

toCleanJSON(momNoteSchema);

export const MomNote = mongoose.model('MomNote', momNoteSchema);
