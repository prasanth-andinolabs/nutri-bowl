import { useEffect, useMemo, useState } from 'react';
import type { Order, OrderStatus } from '../types';
import { fetchAdminOrders, fetchCustomerOrders, updateOrderStatus as apiUpdateOrderStatus } from '../api/orders';

type UseOrdersParams = {
  isAdminRoute: boolean;
  isOrdersRoute: boolean;
  adminAuthed: boolean;
  adminKey: string;
  customerProfilePhone: string;
  guestPhone: string;
  customerToken: string;
};

export function useOrders({
  isAdminRoute,
  isOrdersRoute,
  adminAuthed,
  adminKey,
  customerProfilePhone,
  guestPhone,
  customerToken,
}: UseOrdersParams) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [customerOrdersLoading, setCustomerOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isAdminRoute || !adminAuthed || !adminKey) {
      return;
    }
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await fetchAdminOrders(adminKey);
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [isAdminRoute, adminAuthed, adminKey]);

  useEffect(() => {
    if (!isOrdersRoute || isAdminRoute) {
      return;
    }
    const loadCustomerOrders = async () => {
      const requestPhone = customerProfilePhone || guestPhone;
      if (!requestPhone || requestPhone.length !== 10) {
        setCustomerOrders([]);
        return;
      }
      const token = customerToken;
      const tokenType = customerToken ? 'customer' : 'order';
      if (!token) {
        setCustomerOrders([]);
        return;
      }
      setCustomerOrdersLoading(true);
      try {
        const data = await fetchCustomerOrders(requestPhone, token, tokenType);
        setCustomerOrders(Array.isArray(data) ? data : []);
      } catch {
        setCustomerOrders([]);
      } finally {
        setCustomerOrdersLoading(false);
      }
    };
    loadCustomerOrders();
  }, [isOrdersRoute, isAdminRoute, customerProfilePhone, guestPhone, customerToken]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await apiUpdateOrderStatus(adminKey, orderId, status);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
    } catch {
      // no-op
    }
  };

  const ordersBySelectedDate = (selectedDate: string) =>
    orders.filter((order) => order.createdAt?.startsWith(selectedDate));

  return {
    orders,
    ordersLoading,
    customerOrders,
    customerOrdersLoading,
    setOrders,
    updateOrderStatus,
    ordersBySelectedDate,
  };
}
