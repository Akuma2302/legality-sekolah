import mongoose from 'mongoose';
import { toCleanJSON } from './plugins.js';
import { BRANCHES } from './school.model.js';

const { Schema } = mongoose;

export const PROGRAM_TYPES = ['Kepimpinan', 'Kerohanian', 'Akademik', 'Lain-lain'];
export { BRANCHES };

const programSubmissionSchema = new Schema(
  {
    // Ketetapan Virality — must be confirmed before submitting
    virality_ack_before_1: { type: Boolean, required: true }, // Isi Details Program Dalam Form
    virality_ack_before_2: { type: Boolean, required: true }, // Pantauan Content Plan & Update Posting
    virality_ack_after_1: { type: Boolean, required: true }, // Upload Semua Footage Dan Content Dalam Google Drive

    // Borang Program
    school_name: { type: String, required: true, trim: true },
    school_branch: { type: String, enum: BRANCHES, required: true }, // Cawangan Sekolah
    program_date: { type: Date, required: true },
    program_type: { type: String, enum: PROGRAM_TYPES, required: true },
    start_time: { type: String, required: true }, // "HH:mm"
    end_time: { type: String, required: true },
    teacher_on_duty: { type: String, required: true, trim: true },
    teacher_position: { type: String, required: true, trim: true }, // Jawatan Guru
    students_involved: { type: [String], default: [] }, // up to 5 (T1–T5)
    total_manpower: { type: Number, required: true, min: 0 },
    needs_additional_manpower: { type: Boolean, default: false },
    additional_manpower_count: { type: Number, default: 0, min: 0 },
    sheet_program_url: { type: String, default: '' },

    // PIC Program (Telegram handle + Kader Cawangan per PIC)
    main_pic_telegram: { type: String, required: true, trim: true },
    main_pic_branch: { type: String, enum: BRANCHES, required: true },
    legality_pic_telegram: { type: String, required: true, trim: true },
    legality_pic_branch: { type: String, enum: BRANCHES, required: true },
    virality_pic_telegram: { type: String, required: true, trim: true },
    virality_pic_branch: { type: String, enum: BRANCHES, required: true },

    // Telegram delivery status — set after attempting to send, not user-supplied
    telegram_sent: { type: Boolean, default: false },
    telegram_error: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

toCleanJSON(programSubmissionSchema);

export const ProgramSubmission = mongoose.model('ProgramSubmission', programSubmissionSchema);
