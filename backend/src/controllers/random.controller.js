import { randomService } from '../services/random.service.js';

export const randomController = {
  list: async (req, res) => {
    res.json(await randomService.list());
  },

  create: async (req, res) => {
    const entry = await randomService.create(req.body);
    res.status(201).json(entry);
  },

  getById: async (req, res) => {
    res.json(await randomService.getById(req.params.id));
  },

  update: async (req, res) => {
    res.json(await randomService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    await randomService.remove(req.params.id);
    res.status(204).send();
  },
};