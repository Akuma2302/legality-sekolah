import { schoolsService } from '../services/schools.service.js';

export const schoolsController = {
  listMine: async (req, res) => {
    res.json(await schoolsService.listMine(req.user));
  },

  listAll: async (req, res) => {
    res.json(await schoolsService.listAll());
  },

  create: async (req, res) => {
    const school = await schoolsService.create(req.user, req.body);
    res.status(201).json(school);
  },

  getById: async (req, res) => {
    res.json(await schoolsService.getById(req.user, req.params.id));
  },

  update: async (req, res) => {
    // Includes updated_at, refreshed automatically on save (see supabase/schema.sql trigger)
    res.json(await schoolsService.update(req.user, req.params.id, req.body));
  },

  remove: async (req, res) => {
    await schoolsService.remove(req.user, req.params.id);
    res.status(204).send();
  },

  updateLegalityStatus: async (req, res) => {
    const school = await schoolsService.updateLegalityStatus(req.params.id, req.body.legality_status);
    res.json(school);
  },
};
