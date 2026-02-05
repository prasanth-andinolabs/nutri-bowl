import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customers.js';
import inventoryRoutes from './routes/inventory.js';
import orderRoutes from './routes/orders.js';
import { initDb } from './db/index.js';
import { config } from './config.js';

const app = express();
let dbReady = false;

const allowedOrigins = config.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());
app.use(
  pinoHttp({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          headers: {
            'user-agent': req.headers['user-agent'],
          },
          remoteAddress: req.remoteAddress,
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
app.use('/api/admin/login', authLimiter);
app.use('/api/customers/login', authLimiter);
app.use('/api/customers/register', authLimiter);
app.use('/api/orders', orderLimiter);

app.get('/api/health', (_req, res) => {
  if (!dbReady) {
    res.status(503).json({ ok: false, error: 'Database not ready' });
    return;
  }
  res.json({ ok: true });
});

app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception', error);
});

const start = async () => {
  try {
    await initDb();
    dbReady = true;
  } catch (error) {
    console.error('Failed to initialize database', error);
  }

  app.listen(config.PORT, () => {
    console.log(`NutriBowl API running on http://localhost:${config.PORT}`);
  });
};

start();
