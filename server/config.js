import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5174,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'admin',
  CORS_ORIGINS: process.env.CORS_ORIGINS || '',
};
