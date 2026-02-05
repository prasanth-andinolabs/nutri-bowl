import { useEffect, useState } from 'react';
import type { CustomerProfile } from '../types';
import { loginCustomer, registerCustomer } from '../api/customers';
import {
  clearStoredCustomerProfile,
  clearStoredCustomerToken,
  getStoredCustomerProfile,
  getStoredCustomerToken,
  setStoredCustomerProfile,
  setStoredCustomerToken,
} from '../utils/storage';

export function useCustomerAuth() {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(() =>
    getStoredCustomerProfile()
  );
  const [customerToken, setCustomerToken] = useState(() => getStoredCustomerToken());
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'guest'>('guest');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (customerProfile) {
      setAuthPhone(customerProfile.phone);
    }
  }, [customerProfile]);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthError('');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => setShowAuthModal(false);

  const handleAuth = async () => {
    const normalizedPhone = authPhone.trim().replace(/\D/g, '');
    if (authMode === 'signup' && !authName.trim()) {
      setAuthError('Enter your name to sign up.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(normalizedPhone) || !authPassword.trim()) {
      setAuthError('Enter a valid 10-digit phone and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const data =
        authMode === 'signup'
          ? await registerCustomer(authName.trim(), normalizedPhone, authPassword.trim())
          : await loginCustomer(normalizedPhone, authPassword.trim());
      if (!data?.accessToken || !data?.profile) {
        throw new Error('Missing auth data');
      }
      setCustomerProfile(data.profile);
      setCustomerToken(data.accessToken);
      setStoredCustomerToken(data.accessToken);
      setStoredCustomerProfile(data.profile);
      setAuthName('');
      setAuthPassword('');
      setAuthError('');
    } catch (error) {
      const status = (error as { status?: number } | null)?.status;
      if (status === 409) {
        setAuthMode('signin');
        setAuthError('Account already exists. Please sign in.');
      } else {
        setAuthError('Invalid phone or password. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setCustomerProfile(null);
    setCustomerToken('');
    clearStoredCustomerToken();
    clearStoredCustomerProfile();
  };

  const continueAsGuest = () => {
    setAuthMode('guest');
    setShowAuthModal(false);
  };

  return {
    customerProfile,
    customerToken,
    authMode,
    authName,
    authPhone,
    authPassword,
    authError,
    authLoading,
    showAuthPassword,
    showAuthModal,
    setAuthMode,
    setAuthName,
    setAuthPhone,
    setAuthPassword,
    setShowAuthPassword,
    openAuthModal,
    closeAuthModal,
    handleAuth,
    logout,
    continueAsGuest,
  };
}
