import { useEffect, useState } from 'react';
import { Minus, Phone, Plus, Store } from 'lucide-react';
import type { StoreItem } from '../types';

type HomePageProps = {
  inventoryLoading: boolean;
  catalog: {
    fresh: StoreItem[];
    dry: StoreItem[];
  };
  cart: Record<string, number>;
  cartCount: number;
  cartTotal: number;
  onUpdateQty: (id: string, delta: number) => void;
  onGoToCart: () => void;
  onGoToOrders: () => void;
  onGoToSubscriptions: () => void;
  onGoToCatalog: () => void;
};

export function HomePage({
  inventoryLoading,
  catalog,
  cart,
  cartCount,
  cartTotal,
  onUpdateQty,
  onGoToCart,
  onGoToOrders,
  onGoToSubscriptions,
  onGoToCatalog,
}: HomePageProps) {
  const [toastMessage, setToastMessage] = useState('');
  const hasTag = (item: StoreItem, tag: string) => item.tags?.includes(tag);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setToastMessage('');
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleAdd = (item: StoreItem) => {
    onUpdateQty(item.id, 1);
    setToastMessage(`${item.name} added to cart`);
  };
  const skeletons = Array.from({ length: 6 });

  return (
    <main className="pb-24 sm:pb-0">
      <>
        <section className="bg-gradient-to-br from-green-50 to-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm text-green-700 font-semibold mb-3">Rajam City • 5 km radius</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Stay Fit, Stay Healthy... Choose Nutri Bowl
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Fresh fruits, exotic fruits, and dry fruits delivered to customers within 5 km of
                Rajam city.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Looking for daily fruit bowls? Check the subscription plans.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold">
                  COD Only
                </span>
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  Same-day delivery
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onGoToCatalog}
                  className="bg-green-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-700 transition"
                >
                  Browse fruits
                </button>
                <button
                  type="button"
                  onClick={onGoToSubscriptions}
                  className="text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50 transition"
                >
                  See subscriptions
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white border border-green-100 rounded-[32px] shadow-lg p-6">
                <div className="relative">
                  <div className="w-full h-64 rounded-3xl bg-white border border-green-100 flex items-center justify-center">
                    <img
                      src="/image.png"
                      alt="NutriBowl logo"
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <span className="absolute top-4 left-4 bg-white/90 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
                    Handpicked daily
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-500">Radius</p>
                    <p className="text-sm font-semibold text-gray-900">5 km</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-500">Delivery</p>
                    <p className="text-sm font-semibold text-gray-900">Same day</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="text-sm font-semibold text-gray-900">COD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-16 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-7 h-7 text-green-600" />
              <h3 className="text-3xl font-bold">Fruit & Dry Fruit Store</h3>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mb-6">
              Handpicked daily for freshness, taste, and hygiene.
            </p>
            <div className="space-y-10">
              <div>
                <h4 className="text-2xl font-semibold mb-4">Fresh Fruits</h4>
                {inventoryLoading && (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {skeletons.map((_, index) => (
                      <div
                        key={`fresh-skeleton-${index}`}
                        className="bg-white rounded-3xl p-5 border border-green-100 shadow-sm animate-pulse"
                      >
                        <div className="w-full h-40 rounded-2xl bg-gray-200 mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {catalog.fresh.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => handleAdd(item)}
                        aria-label={`Add ${item.name}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 rounded-2xl object-cover mb-4"
                        />
                      </button>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hasTag(item, 'seasonal') && (
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                            Seasonal
                          </span>
                        )}
                        {hasTag(item, 'exotic') && (
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                            Exotic
                          </span>
                        )}
                        {hasTag(item, 'best_seller') && (
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                            Best Seller
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <button
                            type="button"
                            onClick={() => handleAdd(item)}
                            className="text-left text-lg font-semibold text-gray-900"
                          >
                            {item.name}
                          </button>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} / {item.unit}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                          Fresh
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => onUpdateQty(item.id, -1)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Minus className="w-5 h-5 text-green-600" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {cart[item.id] ?? 0}
                          </span>
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => handleAdd(item)}
                            aria-label={`Add ${item.name}`}
                          >
                            <Plus className="w-5 h-5 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-4">Dry Fruits</h4>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {catalog.dry.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => handleAdd(item)}
                        aria-label={`Add ${item.name}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 rounded-2xl object-cover mb-4"
                        />
                      </button>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hasTag(item, 'best_seller') && (
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                            Best Seller
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <button
                            type="button"
                            onClick={() => handleAdd(item)}
                            className="text-left text-lg font-semibold text-gray-900"
                          >
                            {item.name}
                          </button>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} / {item.unit}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                          Dry
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => onUpdateQty(item.id, -1)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Minus className="w-5 h-5 text-green-600" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {cart[item.id] ?? 0}
                          </span>
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => handleAdd(item)}
                            aria-label={`Add ${item.name}`}
                          >
                            <Plus className="w-5 h-5 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5">
                <p className="text-sm font-semibold text-gray-900">Track your orders</p>
                <p className="text-xs text-gray-600 mt-1">
                  See order status and details anytime from your phone.
                </p>
                <button
                  type="button"
                  onClick={onGoToOrders}
                  className="mt-3 text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50 transition"
                >
                  Go to Orders
                </button>
              </div>
              <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5">
                <p className="text-sm font-semibold text-gray-900">Need help ordering?</p>
                <p className="text-xs text-gray-600 mt-1">We confirm every COD order.</p>
                <a
                  href="tel:+919390574240"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-green-700 font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Call us
                </a>
              </div>
            </div>
          </div>
        </section>

      </>

      {cartCount > 0 && (
        <div className="fixed bottom-16 inset-x-0 z-30 sm:hidden px-4">
          <div className="bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Cart total</p>
              <p className="text-base font-semibold text-gray-900">₹{cartTotal}</p>
            </div>
            <button
              type="button"
              onClick={onGoToCart}
              className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition"
            >
              View Cart ({cartCount})
            </button>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-32 inset-x-0 z-40 flex justify-center px-4 sm:bottom-6">
          <div className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
    </main>
  );
}
