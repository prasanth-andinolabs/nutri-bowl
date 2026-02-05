import crypto from 'crypto';

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const generateToken = () => crypto.randomBytes(24).toString('hex');

export const hashPassword = (password, salt) =>
  crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

export const createPasswordHash = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { hash, salt };
};

export const verifyPassword = (password, hash, salt) => {
  const derived = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
};
