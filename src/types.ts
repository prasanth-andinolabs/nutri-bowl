export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'delivered' | 'cancelled';

export type StoreItem = {
  id: string;
  sku: string;
  name: string;
  category: 'fruit' | 'dry' | 'combo' | 'subscription';
  subcategory?: 'regular' | 'exotic';
  unit: 'g' | 'kg' | 'pack' | 'bundle' | 'bowl';
  weightGrams?: number;
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
