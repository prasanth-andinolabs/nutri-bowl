import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Add it to your .env file.');
}

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');
const inventorySeedPath = path.join(dataDir, 'inventory.json');

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS customers (
      phone TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      access_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      plan TEXT,
      delivery_slot TEXT,
      service_area TEXT,
      customer_name TEXT,
      phone TEXT,
      address TEXT,
      payment_method TEXT,
      total INTEGER,
      location_lat DOUBLE PRECISION,
      location_lng DOUBLE PRECISION,
      order_access_hash TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      item_id TEXT NOT NULL,
      name TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price INTEGER NOT NULL,
      total INTEGER NOT NULL
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM inventory');
  if (rows[0]?.count === 0) {
    try {
      const seedRaw = await fs.readFile(inventorySeedPath, 'utf-8');
      const seed = JSON.parse(seedRaw);
      if (Array.isArray(seed)) {
        const insert =
          'INSERT INTO inventory (id, name, category, unit, price, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        for (const item of seed) {
          await pool.query(insert, [
            item.id,
            item.name,
            item.category,
            item.unit,
            item.price,
            item.image,
            Array.isArray(item.tags) ? item.tags : [],
          ]);
        }
      }
    } catch {
      // If seed fails, keep inventory empty for manual setup.
    }
  }

  await pool.query(`
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION;
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION;
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS customer_name TEXT;
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS order_access_hash TEXT;
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS access_hash TEXT;
    ALTER TABLE inventory
      ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
  `);
};
