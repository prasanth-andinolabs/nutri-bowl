export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'delivered' | 'cancelled';

export type StoreItem = {
  id: string;
  name: string;
  category: 'fresh' | 'dry';
  unit: 'kg' | 'pack';
  price: number;
  image: string;
  tags?: string[];
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  type: 'subscription' | 'store';
  name?: string;
  phone?: string;
  address?: string;
  paymentMethod?: 'COD';
  location?: { lat: number; lng: number } | null;
  items?: Array<{
    id: string;
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
  total?: number;
};

export type CustomerProfile = {
  name: string;
  phone: string;
};
