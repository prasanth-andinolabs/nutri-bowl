import { ClipboardList, Truck } from 'lucide-react';
import type { Order, OrderStatus } from '../types';

type AdminPageProps = {
  adminAuthed: boolean;
  adminUsername: string;
  adminPassword: string;
  adminError: string;
  ordersLoading: boolean;
  selectedDate: string;
  pendingOrders: Order[];
  confirmedOrders: Order[];
  deliveredOrders: Order[];
  cancelledOrders: Order[];
  pendingTotals: { count: number; value: number };
  confirmedTotals: { count: number; value: number };
  deliveredTotals: { count: number; value: number };
  cancelledTotals: { count: number; value: number };
  inventorySaving: boolean;
  inventoryMessage: string;
  onAdminUsernameChange: (value: string) => void;
  onAdminPasswordChange: (value: string) => void;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  onSelectedDateChange: (value: string) => void;
  onOrderClick: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onInventoryReset: () => void;
};

export function AdminPage({
  adminAuthed,
  adminUsername,
  adminPassword,
  adminError,
  ordersLoading,
  selectedDate,
  pendingOrders,
  confirmedOrders,
  deliveredOrders,
  cancelledOrders,
  pendingTotals,
  confirmedTotals,
  deliveredTotals,
  cancelledTotals,
  inventorySaving,
  inventoryMessage,
  onAdminUsernameChange,
  onAdminPasswordChange,
  onAdminLogin,
  onAdminLogout,
  onSelectedDateChange,
  onOrderClick,
  onUpdateOrderStatus,
  onInventoryReset,
}: AdminPageProps) {
  const renderOrderList = (orders: Order[], label: string, color: string) => (
    <ul className="space-y-4 text-sm">
      {orders.map((order) => (
        <li key={order.id} className="bg-gray-50 rounded-2xl p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <button className="font-semibold text-gray-900 text-left" onClick={() => onOrderClick(order)}>
                {order.name ?? 'Customer'} · ₹{order.total ?? 0}
              </button>
              <p className="text-xs text-gray-500">
                {order.phone ?? 'No phone'} · {order.items?.length ?? 0} items
              </p>
              {order.location ? (
                <a
                  href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-green-700 underline"
                >
                  View location
                </a>
              ) : (
                <span className="text-xs text-gray-400">No location shared</span>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`font-semibold text-xs ${color}`}>{label}</span>
              <select
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                value={order.status}
                onChange={(event) => onUpdateOrderStatus(order.id, event.target.value as OrderStatus)}
              >
                <option value="pending_confirmation">Pending Call</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="bg-gray-50 py-12">
      {!adminAuthed ? (
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ClipboardList className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold">Admin Login</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Use the fixed admin credentials to access the ops dashboard.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
                  placeholder="Enter username"
                  value={adminUsername}
                  onChange={(event) => onAdminUsernameChange(event.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(event) => onAdminPasswordChange(event.target.value)}
                />
              </div>
              {adminError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">{adminError}</div>
              )}
              <button
                className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition"
                onClick={onAdminLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">Today’s Ops Dashboard</h2>
              </div>
              <button
                className="text-sm text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
                onClick={onAdminLogout}
              >
                Logout
              </button>
            </div>
            <p className="text-gray-600">
              Manual-friendly view for a small team. Confirm COD orders by phone and prepare packing lists by area.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Select date</label>
              <input
                type="date"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
                value={selectedDate}
                onChange={(event) => onSelectedDateChange(event.target.value)}
              />
              {ordersLoading && <span className="text-sm text-gray-500">Loading orders...</span>}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pending</h3>
                <span className="text-xs text-gray-500">
                  {pendingTotals.count} orders · ₹{pendingTotals.value}
                </span>
              </div>
              {pendingOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No pending orders for this date.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-1">
                  {renderOrderList(pendingOrders, 'Pending Call', 'text-amber-600')}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Confirmed</h3>
                <span className="text-xs text-gray-500">
                  {confirmedTotals.count} orders · ₹{confirmedTotals.value}
                </span>
              </div>
              {confirmedOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No confirmed orders for this date.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-1">
                  {renderOrderList(confirmedOrders, 'Confirmed', 'text-blue-600')}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Delivered</h3>
                <span className="text-xs text-gray-500">
                  {deliveredTotals.count} orders · ₹{deliveredTotals.value}
                </span>
              </div>
              {deliveredOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No delivered orders for this date.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-1">
                  {renderOrderList(deliveredOrders, 'Delivered', 'text-green-600')}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cancelled</h3>
                <span className="text-xs text-gray-500">
                  {cancelledTotals.count} orders · ₹{cancelledTotals.value}
                </span>
              </div>
              {cancelledOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No cancelled orders for this date.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-1">
                  {renderOrderList(cancelledOrders, 'Cancelled', 'text-red-600')}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Delivery Checklist</h3>
              </div>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>Confirm COD orders by phone before 8 PM.</li>
                <li>Prepare packing list and labels by area.</li>
                <li>Collect COD and mark delivered in the sheet.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Catalogue Manager</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50"
                    onClick={onInventoryReset}
                    disabled={inventorySaving}
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
              {inventoryMessage && <div className="mt-3 text-xs text-gray-600">{inventoryMessage}</div>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
