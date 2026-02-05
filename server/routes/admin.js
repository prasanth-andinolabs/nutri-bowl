import express from 'express';
import { config } from '../config.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === config.ADMIN_USERNAME && password === config.ADMIN_PASSWORD) {
    res.json({ ok: true, adminKey: config.ADMIN_API_KEY });
    return;
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
