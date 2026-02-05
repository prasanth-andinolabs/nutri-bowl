import { apiUrl } from './base';

type AdminLoginResponse = { ok: true; adminKey: string };

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const response = await fetch(apiUrl('/api/admin/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  return (await response.json()) as AdminLoginResponse;
}
