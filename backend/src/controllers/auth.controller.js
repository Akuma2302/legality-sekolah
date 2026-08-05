import { authService } from '../services/auth.service.js';

export const authController = {
  signin: async (req, res) => {
    const result = await authService.signin(req.body);
    res.json(result);
  },

  me: async (req, res) => {
    res.json(await authService.me(req.user));
  },
};
