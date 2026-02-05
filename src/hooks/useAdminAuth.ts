import { useEffect, useState } from 'react';
import { adminLogin } from '../api/admin';
import { clearStoredAdminKey, getStoredAdminKey, setStoredAdminKey } from '../utils/storage';

export function useAdminAuth() {
  const [adminKey, setAdminKey] = useState(() => getStoredAdminKey());
  const [adminAuthed, setAdminAuthed] = useState(() => Boolean(getStoredAdminKey()));
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    if (!adminKey && adminAuthed) {
      setAdminAuthed(false);
    }
  }, [adminKey, adminAuthed]);

  const login = async () => {
    setAdminError('');
    try {
      const data = await adminLogin(adminUsername.trim(), adminPassword);
      setAdminAuthed(true);
      setAdminKey(data.adminKey);
      setAdminUsername('');
      setAdminPassword('');
      setStoredAdminKey(data.adminKey);
    } catch {
      setAdminError('Invalid credentials. Please try again.');
    }
  };

  const logout = () => {
    setAdminAuthed(false);
    setAdminKey('');
    clearStoredAdminKey();
  };

  return {
    adminKey,
    adminAuthed,
    adminUsername,
    adminPassword,
    adminError,
    setAdminUsername,
    setAdminPassword,
    login,
    logout,
  };
}
