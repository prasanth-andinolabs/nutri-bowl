import type { StoreItem } from '../types';

export async function fetchInventory(): Promise<StoreItem[]> {
  const response = await fetch('/api/inventory');
  if (!response.ok) {
    throw new Error('Inventory fetch failed');
  }
  return (await response.json()) as StoreItem[];
}

export async function resetInventory(adminKey: string): Promise<void> {
  const response = await fetch('/api/inventory/reset', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Failed');
  }
}
