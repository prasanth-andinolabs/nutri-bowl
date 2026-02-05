import type { CustomerProfile } from '../types';

type AuthResponse = { ok: true; accessToken: string; profile: CustomerProfile };

export async function registerCustomer(
  name: string,
  phone: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch('/api/customers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, password }),
  });
  if (response.status === 409) {
    const error = new Error('Account already exists');
    // @ts-expect-error custom status
    error.status = 409;
    throw error;
  }
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return (await response.json()) as AuthResponse;
}

export async function loginCustomer(phone: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/customers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return (await response.json()) as AuthResponse;
}
