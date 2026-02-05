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

export async function updateInventory(
  adminKey: string,
  inventory: StoreItem[]
): Promise<void> {
  const response = await fetch(apiUrl('/api/inventory'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(inventory),
  });
  if (!response.ok) {
    throw new Error('Failed');
  }
}

export async function updateInventoryItem(
  adminKey: string,
  item: StoreItem
): Promise<void> {
  const response = await fetch(apiUrl(`/api/inventory/${encodeURIComponent(item.id)}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory ?? null,
      unit: item.unit,
      weightGrams: item.weightGrams ?? null,
      price: item.price,
      image: item.image,
      tags: item.tags ?? [],
    }),
  });
  if (!response.ok) {
    throw new Error('Failed');
  }
}

export async function deleteInventoryItem(adminKey: string, id: string): Promise<void> {
  const response = await fetch(apiUrl(`/api/inventory/${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Failed');
  }
}

export async function fetchInventoryImages(): Promise<string[]> {
  const response = await fetch(apiUrl('/api/inventory/images'));
  if (!response.ok) {
    throw new Error('Failed');
  }
  return (await response.json()) as string[];
}
