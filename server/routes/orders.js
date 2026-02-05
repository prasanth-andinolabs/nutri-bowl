import express from 'express';
import { pool } from '../db/index.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { generateToken, hashToken } from '../utils/crypto.js';
import { normalizePhone } from '../utils/phone.js';

const router = express.Router();

router.get('/', requireAdmin, async (_req, res) => {
  const { rows: orders } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  const { rows: items } = await pool.query('SELECT * FROM order_items');
  const itemsByOrder = items.reduce((acc, item) => {
    if (!acc[item.order_id]) {
      acc[item.order_id] = [];
    }
    acc[item.order_id].push({
      id: item.item_id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      total: item.total,
    });
    return acc;
  }, {});

  const mapped = orders.map((order) => ({
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    type: order.type,
    plan: order.plan,
    deliverySlot: order.delivery_slot,
    serviceArea: order.service_area,
    name: order.customer_name,
    phone: order.phone,
    address: order.address,
    paymentMethod: order.payment_method,
    total: order.total,
    location:
      order.location_lat && order.location_lng
        ? { lat: order.location_lat, lng: order.location_lng }
        : null,
    items: itemsByOrder[order.id] || [],
  }));
  res.json(mapped);
});

router.get('/customer', async (req, res) => {
  const phone = normalizePhone(req.query.phone);
  const customerToken = req.headers['x-customer-token'];
  const orderToken = req.headers['x-order-token'];
  if (!phone || (!customerToken && !orderToken)) {
    res.status(400).json({ error: 'Phone and token required' });
    return;
  }
  let orders = [];
  if (customerToken) {
    const customerHash = hashToken(customerToken);
    const { rowCount } = await pool.query(
      'SELECT 1 FROM customers WHERE phone = $1 AND access_hash = $2',
      [phone, customerHash]
    );
    if (!rowCount) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const result = await pool.query(
      'SELECT * FROM orders WHERE phone = $1 ORDER BY created_at DESC',
      [phone]
    );
    orders = result.rows;
  } else {
    const tokenHash = hashToken(orderToken);
    const result = await pool.query(
      'SELECT * FROM orders WHERE phone = $1 AND order_access_hash = $2 ORDER BY created_at DESC',
      [phone, tokenHash]
    );
    orders = result.rows;
  }
  const { rows: items } = await pool.query('SELECT * FROM order_items');
  const itemsByOrder = items.reduce((acc, item) => {
    if (!acc[item.order_id]) {
      acc[item.order_id] = [];
    }
    acc[item.order_id].push({
      id: item.item_id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      total: item.total,
    });
    return acc;
  }, {});
  const mapped = orders.map((order) => ({
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    type: order.type,
    name: order.customer_name,
    phone: order.phone,
    address: order.address,
    paymentMethod: order.payment_method,
    total: order.total,
    location:
      order.location_lat && order.location_lng
        ? { lat: order.location_lat, lng: order.location_lng }
        : null,
    items: itemsByOrder[order.id] || [],
  }));
  res.json(mapped);
});

router.post('/', async (req, res) => {
  const payload = req.body || {};
  const orderId = `ord_${Date.now()}`;
  const createdAt = new Date().toISOString();
  const accessToken = payload.accessToken || generateToken();
  const accessHash = hashToken(accessToken);
  const normalizedPhone = normalizePhone(payload.phone);
  const normalizedName = typeof payload.name === 'string' ? payload.name.trim() : '';
  const normalizedAddress = typeof payload.address === 'string' ? payload.address.trim() : '';
  const orderType = payload.type === 'subscription' ? 'subscription' : 'store';
  const paymentMethod = payload.paymentMethod === 'COD' ? 'COD' : null;

  if (!normalizedName || !normalizedPhone || !/^[6-9]\d{9}$/.test(normalizedPhone)) {
    res.status(400).json({ error: 'Valid name and phone are required' });
    return;
  }
  if (!normalizedAddress || normalizedAddress.length < 6) {
    res.status(400).json({ error: 'Delivery address is required' });
    return;
  }
  if (!paymentMethod) {
    res.status(400).json({ error: 'Payment method must be COD' });
    return;
  }
  if (orderType === 'store' && (!Array.isArray(payload.items) || payload.items.length === 0)) {
    res.status(400).json({ error: 'Order items are required' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let computedTotal = 0;
    let itemsForInsert = [];

    if (orderType === 'store') {
      const itemIds = payload.items.map((item) => item.id).filter(Boolean);
      const { rows: inventoryRows } = await client.query(
        'SELECT id, name, price, weight_grams, category FROM inventory WHERE id = ANY($1::text[])',
        [itemIds]
      );
      const inventoryById = inventoryRows.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      itemsForInsert = payload.items.map((item) => {
        const qty = Number(item.qty);
        const inventoryItem = inventoryById[item.id];
        if (!inventoryItem || !Number.isInteger(qty) || qty <= 0) {
          throw new Error('Invalid order item');
        }
        const isWeighted = inventoryItem.category === 'fruit' || inventoryItem.category === 'dry';
        if (!isWeighted) {
          const price = Number(inventoryItem.price);
          const total = price * qty;
          computedTotal += total;
          return {
            id: item.id,
            name: inventoryItem.name,
            qty,
            price,
            total,
          };
        }

        const weightGramsRaw = Number(item.weightGrams);
        const weightGrams = Number.isFinite(weightGramsRaw) && weightGramsRaw > 0 ? weightGramsRaw : 1000;
        const allowedWeights = new Set([250, 500, 1000]);
        if (!allowedWeights.has(weightGrams)) {
          throw new Error('Invalid order item');
        }
        const pricePerKg = inventoryItem.weight_grams
          ? Number(inventoryItem.price) / (Number(inventoryItem.weight_grams) / 1000)
          : Number(inventoryItem.price);
        const price = Math.round(pricePerKg * (weightGrams / 1000));
        const total = price * qty;
        computedTotal += total;
        const weightLabel = weightGrams >= 1000 ? `${weightGrams / 1000} kg` : `${weightGrams} gm`;
        return {
          id: item.id,
          name: `${inventoryItem.name} (${weightLabel})`,
          qty,
          price,
          total,
        };
      });
    }

    await client.query(
      `INSERT INTO orders (
        id, created_at, status, type, plan, delivery_slot, service_area,
        customer_name, phone, address, payment_method, total, location_lat, location_lng,
        order_access_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        orderId,
        createdAt,
        'pending_confirmation',
        orderType,
        payload.plan ?? null,
        payload.deliverySlot ?? null,
        payload.serviceArea ?? null,
        normalizedName,
        normalizedPhone || null,
        normalizedAddress,
        paymentMethod,
        computedTotal || payload.total || null,
        payload.location?.lat ?? null,
        payload.location?.lng ?? null,
        accessHash,
      ]
    );

    if (itemsForInsert.length > 0) {
      const insertItem =
        'INSERT INTO order_items (order_id, item_id, name, qty, price, total) VALUES ($1, $2, $3, $4, $5, $6)';
      for (const item of itemsForInsert) {
        await client.query(insertItem, [
          orderId,
          item.id,
          item.name,
          item.qty,
          item.price,
          item.total,
        ]);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ id: orderId, createdAt, accessToken });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error?.message === 'Invalid order item') {
      res.status(400).json({ error: 'One or more items are invalid' });
      return;
    }
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const updates = req.body || {};
  const fields = [];
  const values = [];
  const addField = (column, value) => {
    if (value !== undefined) {
      fields.push(`${column} = $${values.length + 1}`);
      values.push(value);
    }
  };

  if (updates.status && !['pending_confirmation', 'confirmed', 'delivered', 'cancelled'].includes(updates.status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  addField('status', updates.status);
  addField('plan', updates.plan);
  addField('delivery_slot', updates.deliverySlot);
  addField('service_area', updates.serviceArea);
  addField('customer_name', updates.name);
  addField('phone', updates.phone);
  addField('address', updates.address);
  addField('payment_method', updates.paymentMethod);
  addField('total', updates.total);

  if (fields.length === 0) {
    res.status(400).json({ error: 'No updates provided' });
    return;
  }

  values.push(req.params.id);
  const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${values.length}`;

  const result = await pool.query(query, values);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json({ ok: true });
});

export default router;
