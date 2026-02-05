import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Add it to your .env file.');
}

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      unit TEXT NOT NULL,
      weight_grams INTEGER,
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
    ALTER TABLE inventory
      ADD COLUMN IF NOT EXISTS sku TEXT;
    ALTER TABLE inventory
      ADD COLUMN IF NOT EXISTS subcategory TEXT;
    ALTER TABLE inventory
      ADD COLUMN IF NOT EXISTS weight_grams INTEGER;
  `);
};
