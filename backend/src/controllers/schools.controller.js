import { schoolsService } from '../services/schools.service.js';

export const schoolsController = {
  // Public — anyone can browse the full list, no login required
  list: async (req, res) => {
    res.json(await schoolsService.list());
  },

  create: async (req, res) => {
    const school = await schoolsService.create(req.body);
    res.status(201).json(school);
  },

  getById: async (req, res) => {
    res.json(await schoolsService.getById(req.params.id));
  },

  update: async (req, res) => {
    // Includes updated_at, refreshed automatically on save (Mongoose timestamps option)
    res.json(await schoolsService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    await schoolsService.remove(req.params.id);
    res.status(204).send();
  },

  // Admin-only — requires login (see routes/schools.routes.js)
  updateLegalityStatus: async (req, res) => {
    const school = await schoolsService.updateLegalityStatus(req.params.id, req.body.legality_status);
    res.json(school);
  },
};
