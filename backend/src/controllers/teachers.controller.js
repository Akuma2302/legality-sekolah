import { teachersService } from '../services/teachers.service.js';

export const teachersController = {
  list: async (req, res) => {
    res.json(await teachersService.list(req.params.parentType, req.params.parentId));
  },

  add: async (req, res) => {
    const teacher = await teachersService.add(req.params.parentType, req.params.parentId, req.body);
    res.status(201).json(teacher);
  },

  remove: async (req, res) => {
    await teachersService.remove(req.params.id);
    res.status(204).send();
  },
};
