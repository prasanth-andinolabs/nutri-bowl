import express from 'express';
import { pool } from '../db/index.js';
import { createPasswordHash, generateToken, hashToken, verifyPassword } from '../utils/crypto.js';
import { normalizePhone } from '../utils/phone.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, phone, password } = req.body || {};
  const normalizedPhone = normalizePhone(phone);
  if (!name || !normalizedPhone || !/^[6-9]\d{9}$/.test(normalizedPhone) || !password) {
    res.status(400).json({ error: 'Name, valid phone, and password are required' });
    return;
  }
  const { hash, salt } = createPasswordHash(password);
  const accessToken = generateToken();
  const accessHash = hashToken(accessToken);
  try {
    const { rowCount } = await pool.query(
      'INSERT INTO customers (phone, name, password_hash, password_salt, access_hash) VALUES ($1, $2, $3, $4, $5)',
      [normalizedPhone, name, hash, salt, accessHash]
    );
    if (rowCount === 0) {
      res.status(500).json({ error: 'Failed to register' });
      return;
    }
    res.json({ ok: true, accessToken, profile: { name, phone: normalizedPhone } });
  } catch (error) {
    if (error?.code === '23505') {
      res.status(409).json({ error: 'Account already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  const { phone, password } = req.body || {};
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone || !password) {
    res.status(400).json({ error: 'Phone and password required' });
    return;
  }
  const { rows } = await pool.query(
    'SELECT name, password_hash, password_salt FROM customers WHERE phone = $1',
    [normalizedPhone]
  );
  const customer = rows[0];
  if (!customer || !verifyPassword(password, customer.password_hash, customer.password_salt)) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const accessToken = generateToken();
  const accessHash = hashToken(accessToken);
  await pool.query('UPDATE customers SET access_hash = $1 WHERE phone = $2', [
    accessHash,
    normalizedPhone,
  ]);
  res.json({ ok: true, accessToken, profile: { name: customer.name, phone: normalizedPhone } });
});

export default router;
