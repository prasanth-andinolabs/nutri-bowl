import { ShoppingCart } from 'lucide-react';
import type { CustomerProfile } from '../types';

type HeaderProps = {
  isAdminRoute: boolean;
  isOrdersRoute: boolean;
  isCartRoute: boolean;
  isSubscriptionsRoute: boolean;
  cartCount: number;
  cartTotal: number;
  customerProfile: CustomerProfile | null;
  isGuestCheckout: boolean;
  onNavigate: (path: string) => void;
  onCartClick: () => void;
  onOpenAuth: () => void;
  onCustomerLogout: () => void;
};

export function Header({
  isAdminRoute,
  isOrdersRoute,
  isCartRoute,
  isSubscriptionsRoute,
  cartCount,
  customerProfile,
  onNavigate,
  onCartClick,
  onOpenAuth,
  onCustomerLogout,
}: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/image.png"
            alt="Nutri Bowl logo"
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-600">NutriBowl</h1>
            <p className="text-xs text-gray-600 hidden sm:block">
              COD-First Local Nutrition Platform
            </p>
          </div>
        </div>
        {!isAdminRoute && (
          <>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className={`text-sm font-semibold px-4 py-2 rounded-full border ${
                !isOrdersRoute && !isCartRoute && !isSubscriptionsRoute
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-200 hover:bg-green-50'
              }`}
            >
              Shop
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/orders')}
              className={`text-sm font-semibold px-4 py-2 rounded-full border ${
                isOrdersRoute
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-200 hover:bg-green-50'
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/subscriptions')}
              className={`text-sm font-semibold px-4 py-2 rounded-full border ${
                isSubscriptionsRoute
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-200 hover:bg-green-50'
              }`}
            >
              Subscription
            </button>
            <button
              type="button"
              onClick={onCartClick}
              className="relative inline-flex items-center gap-2 text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>
            {customerProfile ? (
              <button
                type="button"
                onClick={onCustomerLogout}
                className="text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-full hover:bg-green-50"
              >
                Sign in
              </button>
            )}
          </div>
          <div className="flex sm:hidden items-center gap-2">
            {customerProfile ? (
              <button
                type="button"
                onClick={onCustomerLogout}
                className="text-sm font-semibold text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-50"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-sm font-semibold text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-50"
              >
                Sign in
              </button>
            )}
            <button
              type="button"
              onClick={onCartClick}
              className="relative p-2 text-green-700 rounded-full hover:bg-green-50"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          </>
        )}
        {isAdminRoute && (
          <span className="text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full">
            Admin & Ops
          </span>
        )}
      </div>
    </header>
  );
}
