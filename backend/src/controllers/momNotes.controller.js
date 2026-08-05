import { momNotesService } from '../services/momNotes.service.js';

export const momNotesController = {
  list: async (req, res) => {
    res.json(await momNotesService.list(req.user, req.params.schoolId));
  },

  add: async (req, res) => {
    // Response includes created_at timestamp
    const note = await momNotesService.add(req.user, req.params.schoolId, req.body);
    res.status(201).json(note);
  },
};
