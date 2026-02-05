export const normalizePhone = (value) => {
  if (!value) {
    return '';
  }
  return String(value).replace(/\D/g, '').slice(-10);
};
