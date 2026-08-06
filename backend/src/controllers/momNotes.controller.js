import { momNotesService } from '../services/momNotes.service.js';

export const momNotesController = {
  list: async (req, res) => {
    res.json(await momNotesService.list(req.params.parentType, req.params.parentId));
  },

  add: async (req, res) => {
    const note = await momNotesService.add(req.params.parentType, req.params.parentId, req.body);
    res.status(201).json(note);
  },
};
