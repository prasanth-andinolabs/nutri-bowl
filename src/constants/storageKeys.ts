export const STORAGE_KEYS = {
  cart: 'nb_cart',
  customerName: 'nb_customer_name',
  customerPhone: 'nb_customer_phone',
  customerAddress: 'nb_customer_address',
  customerProfile: 'nb_customer_profile',
  customerToken: 'nb_customer_token',
  adminKey: 'nb_admin_key',
} as const;

export const orderTokenKey = (phone: string) => `nb_order_token_${phone}`;
