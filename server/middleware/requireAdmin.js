import { config } from '../config.js';

export const requireAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (!key || key !== config.ADMIN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};
