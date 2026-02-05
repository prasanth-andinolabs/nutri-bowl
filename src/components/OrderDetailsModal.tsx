import type { Order } from '../types';

type OrderDetailsModalProps = {
  order: Order | null;
  onClose: () => void;
  getOrderTotal: (order: Order) => number;
};

export function OrderDetailsModal({ order, onClose, getOrderTotal }: OrderDetailsModalProps) {
  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-3xl p-6 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Order Details</h3>
          <button
            className="text-sm text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Customer:</span> {order.name ?? 'Customer'}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {order.phone ?? 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Total:</span> ₹{getOrderTotal(order)}
          </p>
          <div className="border-t border-gray-200 pt-3">
            <p className="font-semibold mb-2">Items</p>
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={`${order.id}-${item.id}`} className="flex justify-between">
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>₹{item.total}</span>
                </div>
              ))
            ) : (
              <p>No items recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
