import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db/index.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');
const inventorySeedPath = path.join(dataDir, 'inventory.json');

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM inventory ORDER BY name');
  res.json(rows);
});

router.put('/', requireAdmin, async (req, res) => {
  const inventory = Array.isArray(req.body) ? req.body : null;
  if (!inventory) {
    res.status(400).json({ error: 'Inventory must be an array' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM inventory');
    const insert =
      'INSERT INTO inventory (id, name, category, unit, price, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    for (const item of inventory) {
      await client.query(insert, [
        item.id,
        item.name,
        item.category,
        item.unit,
        item.price,
        item.image,
        Array.isArray(item.tags) ? item.tags : [],
      ]);
    }
    await client.query('COMMIT');
    res.json({ ok: true, count: inventory.length });
  } catch {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to update inventory' });
  } finally {
    client.release();
  }
});

router.post('/reset', requireAdmin, async (_req, res) => {
  const client = await pool.connect();
  try {
    const seedRaw = await fs.readFile(inventorySeedPath, 'utf-8');
    const seed = JSON.parse(seedRaw);
    if (!Array.isArray(seed)) {
      res.status(400).json({ error: 'Seed inventory is invalid' });
      return;
    }

    await client.query('BEGIN');
    await client.query('DELETE FROM inventory');
    const insert =
      'INSERT INTO inventory (id, name, category, unit, price, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    for (const item of seed) {
      await client.query(insert, [
        item.id,
        item.name,
        item.category,
        item.unit,
        item.price,
        item.image,
        Array.isArray(item.tags) ? item.tags : [],
      ]);
    }
    await client.query('COMMIT');
    res.json({ ok: true, count: seed.length });
  } catch {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to reset inventory' });
  } finally {
    client.release();
  }
});

export default router;
