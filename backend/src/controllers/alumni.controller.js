import { alumniService } from '../services/alumni.service.js';

export const alumniController = {
  list: async (req, res) => {
    res.json(await alumniService.list());
  },

  create: async (req, res) => {
    const alumnus = await alumniService.create(req.body);
    res.status(201).json(alumnus);
  },

  getById: async (req, res) => {
    res.json(await alumniService.getById(req.params.id));
  },

  update: async (req, res) => {
    res.json(await alumniService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    await alumniService.remove(req.params.id);
    res.status(204).send();
  },
};
