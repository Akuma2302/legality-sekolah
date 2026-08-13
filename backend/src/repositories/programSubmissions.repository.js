import { ProgramSubmission } from '../models/programSubmission.model.js';

export const programSubmissionsRepository = {
  async create(data) {
    return ProgramSubmission.create(data);
  },

  async markTelegramResult(id, { sent, error }) {
    return ProgramSubmission.findByIdAndUpdate(
      id,
      { telegram_sent: sent, telegram_error: error || '' },
      { new: true }
    );
  },

  async findAll() {
    return ProgramSubmission.find().sort({ created_at: -1 });
  },
};
