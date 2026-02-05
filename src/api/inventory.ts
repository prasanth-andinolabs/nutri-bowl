import type { StoreItem } from '../types';
import { apiUrl } from './base';

export async function fetchInventory(): Promise<StoreItem[]> {
  const response = await fetch(apiUrl('/api/inventory'));
  if (!response.ok) {
    throw new Error('Inventory fetch failed');
  }
  return (await response.json()) as StoreItem[];
}

export async function resetInventory(adminKey: string): Promise<void> {
  const response = await fetch(apiUrl('/api/inventory/reset'), {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Failed');
  }
}
