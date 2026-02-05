import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import type { CustomerProfile, StoreItem } from '../types';
import { formatAmountWithUnit, formatPriceWithAmount } from '../utils/format';

type CartPageProps = {
  cartItems: Array<StoreItem & { qty: number; total: number }>;
  recommendedItems: StoreItem[];
  cartCount: number;
  cartTotal: number;
  customerProfile: CustomerProfile | null;
  isGuestCheckout: boolean;
  showAuthModal: boolean;
  customerName: string;
  phone: string;
  address: string;
  locationCoords: { lat: number; lng: number } | null;
  locationError: string;
  locationStatus: 'idle' | 'loading' | 'ready' | 'error';
  submitting: boolean;
  submitError: string;
  storePlaced: boolean;
  onBackToShop: () => void;
  onOpenAuth: () => void;
  onStartGuestCheckout: () => void;
  onCustomerLogout: () => void;
  onUpdateQty: (id: string, delta: number, weightGrams?: number) => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onRequestLocation: () => void;
  onSubmitOrder: () => void;
};

export function CartPage({
  cartItems,
  recommendedItems,
  cartCount,
  cartTotal,
  customerProfile,
  isGuestCheckout,
  showAuthModal,
  customerName,
  phone,
  address,
  locationCoords,
  locationError,
  locationStatus,
  submitting,
  submitError,
  storePlaced,
  onBackToShop,
  onOpenAuth,
  onStartGuestCheckout,
  onCustomerLogout,
  onUpdateQty,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onRequestLocation,
  onSubmitOrder,
}: CartPageProps) {
  const [showLocation, setShowLocation] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);
  const skeletons = Array.from({ length: 3 });
  useEffect(() => {
    setCartHydrated(true);
  }, []);

  return (
    <main className="bg-gray-50 py-10 pb-24 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold">Your Cart</h2>
          </div>
          <button
            className="text-sm text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
            onClick={onBackToShop}
          >
            Back to shop
          </button>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div
            className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
            onClick={() => {
              if (!customerProfile && !isGuestCheckout) {
                onOpenAuth();
              }
            }}
            role={!customerProfile && !isGuestCheckout ? 'button' : undefined}
            tabIndex={!customerProfile && !isGuestCheckout ? 0 : undefined}
          >
            <h3 className="text-lg font-semibold mb-4">Cart Items</h3>
            {!cartHydrated ? (
              <div className="space-y-4">
                {skeletons.map((_, index) => (
                  <div
                    key={`cart-skeleton-${index}`}
                    className="border border-gray-100 rounded-2xl p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <p className="text-sm text-gray-600">Your cart is empty. Add items to place an order.</p>
            ) : (
              <div
                className={`space-y-4 ${
                  !customerProfile && !isGuestCheckout && showAuthModal ? 'blur-sm' : ''
                }`}
              >
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.name}
                        <span className="ml-2 text-xs text-gray-500 font-medium">
                          {formatAmountWithUnit(item)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.qty} x ₹{item.price} ({formatAmountWithUnit(item)})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.total}</p>
                      <div className="flex items-center gap-2 justify-end mt-2">
                        <button
                          className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                          onClick={() => onUpdateQty(item.id, -1, item.weightGrams)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Minus className="w-5 h-5 text-green-600" />
                        </button>
                        <button
                          className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                          onClick={() => onUpdateQty(item.id, 1, item.weightGrams)}
                          aria-label={`Add ${item.name}`}
                        >
                          <Plus className="w-5 h-5 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
            )}
            {!customerProfile && !isGuestCheckout && showAuthModal && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs font-semibold text-gray-700 bg-white/90 px-3 py-2 rounded-full border border-gray-100 shadow-sm">
                  Please sign in to continue
                </div>
              </div>
            )}
          </div>

          {cartItems.length === 0 && cartHydrated ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-start justify-center">
              <h3 className="text-lg font-semibold mb-2">Ready to shop?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add fruits, dry fruits, or combos to continue checkout.
              </p>
              <button
                type="button"
                className="text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
                onClick={onBackToShop}
              >
                Start shopping
              </button>
            </div>
          ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Checkout</h3>
                <p className="text-xs text-gray-600">Fast, simple, COD only</p>
              </div>
            </div>
            {!customerProfile && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-4">
                <span className="px-3 py-1 rounded-full border border-green-100 bg-green-50 text-green-700 font-semibold">
                  1. Sign in or guest
                </span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full border border-gray-200 bg-white">
                  2. Delivery details
                </span>
              </div>
            )}
            <div className="space-y-4">
              {!cartHydrated && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              )}
              {!customerProfile && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Login for faster checkout</p>
                      <p className="text-xs text-gray-600">Save details, track orders, reuse address</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded-full border text-green-700 border-green-200 hover:bg-green-50"
                        onClick={onOpenAuth}
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded-full border text-green-700 border-green-200 hover:bg-green-50"
                        onClick={onOpenAuth}
                      >
                        Create account
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span>Or continue without login.</span>
                    <button
                      type="button"
                      onClick={onStartGuestCheckout}
                      className="text-xs font-semibold text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50"
                    >
                      Continue as guest
                    </button>
                  </div>
                </div>
              )}
              {!customerProfile && !isGuestCheckout && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Choose Sign in or Continue as guest to enter delivery details.
                </div>
              )}
              {customerProfile && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Signed in as <span className="font-semibold">{customerProfile.name}</span>
                  </p>
                  <button
                    type="button"
                    className="text-xs text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50"
                    onClick={onCustomerLogout}
                  >
                    Sign out
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                {!customerProfile && isGuestCheckout && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Name</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-green-100 px-3 py-2 text-sm"
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(event) => onNameChange(event.target.value)}
                      />
                    </div>
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
                          value={phone}
                          onChange={(event) =>
                            onPhoneChange(event.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
                {!customerProfile && isGuestCheckout && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    Continue as guest highlighted — you can sign in later to see all orders.
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Delivery Address</label>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-green-100 px-3 py-2"
                    rows={3}
                    placeholder="House no, street, landmark"
                    value={address}
                    onChange={(event) => onAddressChange(event.target.value)}
                  />
                </div>
                {!showLocation && !locationCoords && !locationError && (
                  <button
                    type="button"
                    className="w-full text-xs font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
                    onClick={() => setShowLocation(true)}
                  >
                    Add live location (optional)
                  </button>
                )}
                {(showLocation || locationCoords || locationError) && (
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-green-700">Live Location</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-xs font-semibold text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100"
                          onClick={onRequestLocation}
                          disabled={locationStatus === 'loading'}
                        >
                          {locationStatus === 'loading' ? 'Locating...' : 'Use my location'}
                        </button>
                        <button
                          type="button"
                          className="text-xs text-gray-500"
                          onClick={() => setShowLocation(false)}
                        >
                          Hide
                        </button>
                      </div>
                    </div>
                    {locationCoords && (
                      <a
                        href={`https://maps.google.com/?q=${locationCoords.lat},${locationCoords.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-sm text-green-700 underline"
                      >
                        View on Google Maps
                      </a>
                    )}
                    {locationError && <p className="text-xs text-red-600 mt-2">{locationError}</p>}
                    {!locationCoords && !locationError && (
                      <p className="text-xs text-gray-600 mt-2">
                        Optional: share live location to help delivery.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Items</span>
                  <span>{cartCount} items</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Payment</span>
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button
                  className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-70"
                  onClick={onSubmitOrder}
                  disabled={submitting || cartItems.length === 0}
                >
                  Place COD Order
                </button>
                <p className="text-xs text-gray-500">
                  We call to confirm availability and delivery timing.
                </p>
              </div>

              {recommendedItems.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Add dry fruits to your order
                  </p>
                  <div className="space-y-3">
                    {recommendedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {formatPriceWithAmount(item.price, formatAmountWithUnit(item))}
                          </p>
                        </div>
                        <button
                          className="text-xs px-3 py-1 rounded-full border border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => onUpdateQty(item.id, 1)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submitError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">{submitError}</div>
              )}
              {storePlaced && (
                <div className="bg-green-100 text-green-800 p-3 rounded-xl text-sm">
                  Order received. Expect a call to confirm your COD order.
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 sm:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-base font-semibold text-gray-900">₹{cartTotal}</p>
          </div>
          <button
            className="bg-green-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-70"
            onClick={onSubmitOrder}
            disabled={submitting || cartItems.length === 0}
          >
            Place COD Order
          </button>
        </div>
      </div>
    </main>
  );
}
