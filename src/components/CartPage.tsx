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
  showAuthModal: boolean;
  customerName: string;
  phone: string;
  alternatePhone: string;
  onAlternatePhoneChange: (value: string) => void;
  address: string;
  locationCoords: { lat: number; lng: number } | null;
  locationError: string;
  locationStatus: 'idle' | 'loading' | 'ready' | 'error';
  submitting: boolean;
  submitError: string;
  storePlaced: boolean;
  onBackToShop: () => void;
  onOpenAuth: () => void;
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
  showAuthModal,
  customerName,
  phone,
  alternatePhone,
  onAlternatePhoneChange,
  address,
  locationCoords,
  locationError,
  locationStatus,
  submitting,
  submitError,
  storePlaced,
  onBackToShop,
  onOpenAuth,
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
    <main className="bg-gray-50 py-10 pb-28 sm:pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shopping</p>
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            </div>
          </div>
          <button
            className="text-sm text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
            onClick={onBackToShop}
          >
            Back to shop
          </button>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="relative bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Your order</p>
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Cart items</h3>
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
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">Add items from the shop to place an order.</p>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
                  onClick={onBackToShop}
                >
                  Back to shop
                </button>
              </div>
            ) : (
              <>
              <div
                className={`space-y-3 ${
                  !customerProfile && showAuthModal ? 'blur-sm' : ''
                }`}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-green-100 transition"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {item.name}
                        <span className="ml-1.5 text-xs text-gray-500 font-normal">
                          {formatAmountWithUnit(item)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        ₹{item.price} each · {formatAmountWithUnit(item)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center rounded-full border border-green-200 bg-white overflow-hidden">
                          <button
                            type="button"
                            className="p-2 hover:bg-green-50 text-green-600"
                            onClick={() => onUpdateQty(item.id, -1, item.weightGrams)}
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-900">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            className="p-2 hover:bg-green-50 text-green-600"
                            onClick={() => onUpdateQty(item.id, 1, item.weightGrams)}
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-semibold text-green-700">₹{item.total}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t-2 border-gray-100 pt-4 mt-4 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 -mx-1">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="text-lg font-semibold text-green-700">₹{cartTotal}</span>
                </div>
              </div>
              {recommendedItems.length > 0 && (
                <div className="mt-5 rounded-2xl border-2 border-green-100 bg-green-50/40 p-4">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Recommendations</p>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Add dry fruits to your order</h4>
                  <p className="text-xs text-gray-600 mb-3">Popular picks that pair well with your cart.</p>
                  <div className="space-y-3">
                    {recommendedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm py-2">
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            <span className="font-medium text-gray-600">{formatAmountWithUnit(item)}</span>
                            <span className="mx-1.5">·</span>
                            {formatPriceWithAmount(item.price, formatAmountWithUnit(item))}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-semibold px-3 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 shrink-0"
                          onClick={() => onUpdateQty(item.id, 1)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </>
            )}
            {!customerProfile && showAuthModal && (
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
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Checkout</p>
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-2">Delivery & payment</h3>
            <p className="text-xs text-gray-500 mb-5">Fast, simple · Cash on Delivery only</p>
            <div className="space-y-4">
              {!cartHydrated && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              )}
              {customerProfile && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-gray-700">
                    Signed in as <span className="font-semibold">{customerProfile.name}</span>
                    <span className="text-gray-500 font-normal"> · +91 {customerProfile.phone}</span>
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

              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Delivery details
                  </p>
                  {!customerProfile && (
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                      Sign in to save details
                    </button>
                  )}
                </div>
                {!customerProfile && (
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
                {customerProfile && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Alternate phone number (optional)
                    </label>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 px-3 py-2 focus-within:ring-2 focus-within:ring-green-200">
                      <span className="text-lg" aria-hidden="true">
                        🇮🇳
                      </span>
                      <span className="text-sm text-gray-500">+91</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                        placeholder="Different number for this delivery"
                        maxLength={10}
                        value={alternatePhone}
                        onChange={(event) =>
                          onAlternatePhoneChange(event.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Address</label>
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

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}
              <div className="rounded-2xl border-2 border-gray-100 bg-white p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Order summary
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Items ({cartCount})</span>
                    <span className="text-gray-700 font-medium">₹{cartTotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Payment</span>
                    <span>Cash on Delivery</span>
                  </div>
                </div>
                <div className="border-t-2 border-gray-100 pt-3 flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-700">₹{cartTotal}</span>
                </div>
                <button
                  type="button"
                  className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  onClick={onSubmitOrder}
                  disabled={submitting || cartItems.length === 0}
                >
                  {submitting ? 'Placing order…' : 'Place COD Order'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  We’ll call to confirm availability and delivery time.
                </p>
              </div>

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

      {cartItems.length > 0 && cartHydrated && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 sm:hidden safe-area-pb">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">{cartCount} items</p>
              <p className="text-lg font-semibold text-gray-900">₹{cartTotal}</p>
            </div>
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
              onClick={onSubmitOrder}
              disabled={submitting}
            >
              {submitting ? 'Placing…' : 'Place order'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
