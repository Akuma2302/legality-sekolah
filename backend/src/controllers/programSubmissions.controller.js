import { programSubmissionsService } from '../services/programSubmissions.service.js';

export const programSubmissionsController = {
  submit: async (req, res) => {
    const result = await programSubmissionsService.submit(req.body);
    res.status(201).json(result);
  },
};
