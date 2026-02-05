import type { CustomerProfile } from '../types';
import { STORAGE_KEYS, orderTokenKey } from '../constants/storageKeys';

const isBrowser = () => typeof window !== 'undefined';

const safeParse = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const getStoredCart = (): Record<string, number> | null => {
  if (!isBrowser()) {
    return null;
  }
  return safeParse<Record<string, number>>(window.localStorage.getItem(STORAGE_KEYS.cart));
};

export const setStoredCart = (cart: Record<string, number>) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
};

export const clearStoredCart = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.cart);
};

export const getStoredCustomerProfile = (): CustomerProfile | null => {
  if (!isBrowser()) {
    return null;
  }
  return safeParse<CustomerProfile>(window.localStorage.getItem(STORAGE_KEYS.customerProfile));
};

export const setStoredCustomerProfile = (profile: CustomerProfile) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.customerProfile, JSON.stringify(profile));
};

export const clearStoredCustomerProfile = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.customerProfile);
};

export const getStoredCustomerToken = () => {
  if (!isBrowser()) {
    return '';
  }
  return window.localStorage.getItem(STORAGE_KEYS.customerToken) ?? '';
};

export const setStoredCustomerToken = (token: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.customerToken, token);
};

export const clearStoredCustomerToken = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.customerToken);
};

export const getStoredCustomerName = () => {
  if (!isBrowser()) {
    return '';
  }
  return window.localStorage.getItem(STORAGE_KEYS.customerName) ?? '';
};

export const setStoredCustomerName = (value: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.customerName, value);
};

export const clearStoredCustomerName = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.customerName);
};

export const getStoredCustomerPhone = () => {
  if (!isBrowser()) {
    return '';
  }
  return window.localStorage.getItem(STORAGE_KEYS.customerPhone) ?? '';
};

export const setStoredCustomerPhone = (value: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.customerPhone, value);
};

export const clearStoredCustomerPhone = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.customerPhone);
};

export const getStoredCustomerAddress = () => {
  if (!isBrowser()) {
    return '';
  }
  return window.localStorage.getItem(STORAGE_KEYS.customerAddress) ?? '';
};

export const setStoredCustomerAddress = (value: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.customerAddress, value);
};

export const clearStoredCustomerAddress = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.customerAddress);
};

export const getStoredAdminKey = () => {
  if (!isBrowser()) {
    return '';
  }
  return window.localStorage.getItem(STORAGE_KEYS.adminKey) ?? '';
};

export const setStoredAdminKey = (value: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.adminKey, value);
};

export const clearStoredAdminKey = () => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEYS.adminKey);
};

export const getOrderToken = (phone: string) => {
  if (!isBrowser()) {
    return '';
  }
  return window.localStorage.getItem(orderTokenKey(phone)) ?? '';
};

export const setOrderToken = (phone: string, token: string) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(orderTokenKey(phone), token);
};
