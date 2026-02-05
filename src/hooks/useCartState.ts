import { useEffect, useState } from 'react';
import type { CustomerProfile } from '../types';
import {
  clearStoredCart,
  clearStoredCustomerAddress,
  clearStoredCustomerName,
  clearStoredCustomerPhone,
  getStoredCart,
  getStoredCustomerAddress,
  getStoredCustomerName,
  getStoredCustomerPhone,
  setStoredCart,
  setStoredCustomerAddress,
  setStoredCustomerName,
  setStoredCustomerPhone,
} from '../utils/storage';

export function useCartState(customerProfile: CustomerProfile | null) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartHydrated, setCartHydrated] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);

  useEffect(() => {
    const storedCart = getStoredCart();
    const rawName = getStoredCustomerName();
    const rawPhone = getStoredCustomerPhone();
    const rawAddress = getStoredCustomerAddress();
    if (storedCart && typeof storedCart === 'object') {
      setCart(storedCart);
    }
    if (customerProfile) {
      setCustomerName(customerProfile.name);
      setPhone(customerProfile.phone);
    } else {
      if (rawName) {
        setCustomerName(rawName);
      }
      if (rawPhone) {
        setPhone(rawPhone);
      }
    }
    if (rawAddress) {
      setAddress(rawAddress);
    }
    setCartHydrated(true);
  }, [customerProfile]);

  useEffect(() => {
    if (!cartHydrated) {
      return;
    }
    setStoredCart(cart);
  }, [cart, cartHydrated]);

  useEffect(() => {
    if (!cartHydrated) {
      return;
    }
    if (!customerProfile) {
      setStoredCustomerName(customerName);
    }
  }, [customerName, cartHydrated, customerProfile]);

  useEffect(() => {
    if (!cartHydrated) {
      return;
    }
    if (!customerProfile) {
      setStoredCustomerPhone(phone);
    }
  }, [phone, cartHydrated, customerProfile]);

  useEffect(() => {
    if (!cartHydrated) {
      return;
    }
    setStoredCustomerAddress(address);
  }, [address, cartHydrated]);

  const clearGuestDetails = () => {
    clearStoredCart();
    clearStoredCustomerName();
    clearStoredCustomerPhone();
    clearStoredCustomerAddress();
  };

  return {
    cart,
    setCart,
    customerName,
    setCustomerName,
    phone,
    setPhone,
    address,
    setAddress,
    cartHydrated,
    isGuestCheckout,
    setIsGuestCheckout,
    clearGuestDetails,
  };
}
