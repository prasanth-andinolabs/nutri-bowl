import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db/index.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.resolve(__dirname, '../../public/images/products');

router.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, sku, name, category, subcategory, unit, weight_grams, price, image, tags FROM inventory ORDER BY name'
  );
  const normalized = rows.map((row) => {
    const category = row.category === 'fresh' ? 'fruit' : row.category;
    const subcategory =
      row.subcategory ??
      (category === 'fruit' && Array.isArray(row.tags) && row.tags.includes('exotic')
        ? 'exotic'
        : category === 'fruit'
        ? 'regular'
        : null);
    return {
      id: row.id,
      sku: row.sku ?? row.id?.toString().toUpperCase(),
      name: row.name,
      category,
      subcategory: subcategory ?? undefined,
      unit: row.unit,
      weightGrams: row.weight_grams ?? undefined,
      price: row.price,
      image: row.image,
      tags: Array.isArray(row.tags) ? row.tags : [],
    };
  });
  res.json(normalized);
});

router.get('/images', async (_req, res) => {
  try {
    const entries = await fs.readdir(imagesDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => `/images/products/${entry.name}`);
    res.json(files);
  } catch {
    res.json([]);
  }
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
      'INSERT INTO inventory (id, sku, name, category, subcategory, unit, weight_grams, price, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    for (const item of inventory) {
      await client.query(insert, [
        item.id,
        item.sku,
        item.name,
        item.category,
        item.subcategory ?? null,
        item.unit,
        item.weightGrams ?? null,
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
    await client.query('BEGIN');
    await client.query('DELETE FROM inventory');
    await client.query('COMMIT');
    res.json({ ok: true, count: 0 });
  } catch {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to reset inventory' });
  } finally {
    client.release();
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const category = typeof payload.category === 'string' ? payload.category.trim() : '';
  const subcategory = typeof payload.subcategory === 'string' ? payload.subcategory.trim() : '';
  const unit = typeof payload.unit === 'string' ? payload.unit.trim() : '';
  const image = typeof payload.image === 'string' ? payload.image.trim() : '';
  const tags = Array.isArray(payload.tags) ? payload.tags : [];
  const price = Number(payload.price);
  const weightGrams =
    payload.weightGrams === undefined || payload.weightGrams === null
      ? null
      : Number(payload.weightGrams);

  if (!id || !name || !category || !unit || !image || !Number.isFinite(price)) {
    res.status(400).json({ error: 'Invalid inventory item' });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE inventory
       SET name = $1,
           category = $2,
           subcategory = $3,
           unit = $4,
           weight_grams = $5,
           price = $6,
           image = $7,
           tags = $8
       WHERE id = $9`,
      [
        name,
        category,
        subcategory || null,
        unit,
        Number.isFinite(weightGrams) ? weightGrams : null,
        Math.round(price),
        image,
        tags,
        id,
      ]
    );
    if (!result.rowCount) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  try {
    const result = await pool.query('DELETE FROM inventory WHERE id = $1', [id]);
    if (!result.rowCount) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
