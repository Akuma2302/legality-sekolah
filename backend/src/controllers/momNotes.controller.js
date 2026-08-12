import { momNotesService } from '../services/momNotes.service.js';

export const momNotesController = {
  list: async (req, res) => {
    res.json(await momNotesService.list(req.params.parentType, req.params.parentId));
  },

  add: async (req, res) => {
    const note = await momNotesService.add(req.params.parentType, req.params.parentId, req.body);
    res.status(201).json(note);
  },

  update: async (req, res) => {
    res.json(await momNotesService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    await momNotesService.remove(req.params.id);
    res.status(204).send();
  },
};
