import type { Order } from '../types';
import { apiUrl } from './base';

export async function fetchAdminOrders(adminKey: string): Promise<Order[]> {
  const response = await fetch(apiUrl('/api/orders'), {
    headers: { 'x-admin-key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Orders fetch failed');
  }
  return (await response.json()) as Order[];
}

export async function fetchCustomerOrders(
  phone: string,
  token: string,
  tokenType: 'customer' | 'order'
): Promise<Order[]> {
  const response = await fetch(
    apiUrl(`/api/orders/customer?phone=${encodeURIComponent(phone)}`),
    {
      headers:
        tokenType === 'customer' ? { 'x-customer-token': token } : { 'x-order-token': token },
    }
  );
  if (!response.ok) {
    throw new Error('Orders fetch failed');
  }
  return (await response.json()) as Order[];
}

export async function createOrder(payload: Record<string, unknown>): Promise<{ accessToken?: string }> {
  const response = await fetch(apiUrl('/api/orders'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Order failed');
  }
  return (await response.json()) as { accessToken?: string };
}

export async function updateOrderStatus(
  adminKey: string,
  orderId: string,
  status: string
): Promise<void> {
  const response = await fetch(apiUrl(`/api/orders/${orderId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update');
  }
}
