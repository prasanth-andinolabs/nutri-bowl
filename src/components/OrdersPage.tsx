import { useState } from 'react';
import type { CustomerProfile, Order } from '../types';

type OrdersPageProps = {
  customerProfile: CustomerProfile | null;
  authPhone: string;
  authPassword: string;
  authLoading: boolean;
  authError: string;
  showAuthPassword: boolean;
  orderLookupPhone: string;
  hasCustomerToken: boolean;
  hasOrderToken: string;
  customerOrdersLoading: boolean;
  customerOrders: Order[];
  onBackToShop: () => void;
  onCustomerLogout: () => void;
  onAuthPhoneChange: (value: string) => void;
  onAuthPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSignIn: () => void;
  onGuestPhoneChange: (value: string) => void;
  onOrderClick: (order: Order) => void;
  getOrderTotal: (order: Order) => number;
};

export function OrdersPage({
  customerProfile,
  authPhone,
  authPassword,
  authLoading,
  authError,
  showAuthPassword,
  orderLookupPhone,
  hasCustomerToken,
  hasOrderToken,
  customerOrdersLoading,
  customerOrders,
  onBackToShop,
  onCustomerLogout,
  onAuthPhoneChange,
  onAuthPasswordChange,
  onTogglePassword,
  onSignIn,
  onGuestPhoneChange,
  onOrderClick,
  getOrderTotal,
}: OrdersPageProps) {
  const skeletons = Array.from({ length: 3 });
  const [mobileTab, setMobileTab] = useState<'signin' | 'guest'>('signin');

  return (
    <main>
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Orders</h2>
            <button
              className="text-sm text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
              onClick={onBackToShop}
            >
              Back to shop
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Access your orders</h3>
              <p className="text-xs text-gray-600">
                Sign in to see all orders, or use the phone number from this device.
              </p>
            </div>
            {customerProfile ? (
              <div className="flex items-center justify-between rounded-2xl border border-green-100 bg-green-50/60 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{customerProfile.name}</p>
                  <p className="text-xs text-gray-600">+91 {customerProfile.phone}</p>
                </div>
                <button
                  type="button"
                  className="text-xs text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100"
                  onClick={onCustomerLogout}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileTab('signin')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      mobileTab === 'signin'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'text-green-700 border-green-200 hover:bg-green-50'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab('guest')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      mobileTab === 'guest'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'text-green-700 border-green-200 hover:bg-green-50'
                    }`}
                  >
                    Guest lookup
                  </button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div
                    className={`rounded-2xl border border-green-100 p-4 space-y-3 ${
                      mobileTab === 'guest' ? 'hidden lg:block' : ''
                    }`}
                  >
                  <p className="text-sm font-semibold text-gray-700">Sign in</p>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Phone</label>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 px-3 py-2 focus-within:ring-2 focus-within:ring-green-200">
                      <span className="text-lg" aria-hidden="true">
                        🇮🇳
                      </span>
                      <span className="text-sm text-gray-500">+91</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={authPhone}
                        onChange={(event) =>
                          onAuthPhoneChange(event.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Password</label>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 px-3 py-2">
                      <input
                        type={showAuthPassword ? 'text' : 'password'}
                        className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                        placeholder="Enter your password"
                        value={authPassword}
                        onChange={(event) => onAuthPasswordChange(event.target.value)}
                      />
                      <button
                        type="button"
                        className="text-xs text-green-700"
                        onClick={onTogglePassword}
                      >
                        {showAuthPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition disabled:opacity-70"
                    onClick={onSignIn}
                    disabled={authLoading}
                  >
                    {authLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                  {authError && <div className="text-xs text-red-600">{authError}</div>}
                </div>
                <div
                  className={`rounded-2xl border border-green-100 p-4 space-y-3 ${
                    mobileTab === 'signin' ? 'hidden lg:block' : ''
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-700">Guest lookup</p>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Phone</label>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 px-3 py-2 focus-within:ring-2 focus-within:ring-green-200">
                      <span className="text-lg" aria-hidden="true">
                        🇮🇳
                      </span>
                      <span className="text-sm text-gray-500">+91</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={orderLookupPhone}
                        onChange={(event) =>
                          onGuestPhoneChange(event.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                      />
                    </div>
                  </div>
                  {!orderLookupPhone && (
                    <div className="text-xs text-gray-600">
                      Enter the number used while placing the order.
                    </div>
                  )}
                  {orderLookupPhone && !hasCustomerToken && !hasOrderToken && (
                    <div className="text-xs text-gray-600">
                      This device has no saved order history yet.
                    </div>
                  )}
                </div>
              </div>
              </>
            )}
            {customerOrdersLoading ? (
              <div className="space-y-3">
                {skeletons.map((_, index) => (
                  <div
                    key={`order-skeleton-${index}`}
                    className="border border-gray-100 rounded-2xl p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : customerOrders.length === 0 ? (
              <p className="text-sm text-gray-600">No orders found yet.</p>
            ) : (
              <div className="space-y-4 text-sm">
                {customerOrders.map((order) => (
                  <button
                    key={order.id}
                    className="w-full border border-gray-100 rounded-2xl p-4 flex items-start justify-between hover:bg-green-50/40 transition text-left"
                    onClick={() => onOrderClick(order)}
                  >
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Items: {order.items?.length ?? 0} · Total ₹{getOrderTotal(order)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                      {order.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
