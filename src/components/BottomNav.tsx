import { ClipboardList, Home, ShoppingCart } from 'lucide-react';

type BottomNavProps = {
  isHome: boolean;
  isOrders: boolean;
  isCart: boolean;
  cartCount: number;
  onNavigate: (path: string) => void;
  onCartClick: () => void;
};

export function BottomNav({
  isHome,
  isOrders,
  isCart,
  cartCount,
  onNavigate,
  onCartClick,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 sm:hidden">
      <div className="flex items-center justify-around py-2">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className={`flex flex-col items-center text-xs ${
            isHome ? 'text-green-700' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          Shop
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/orders')}
          className={`flex flex-col items-center text-xs ${
            isOrders ? 'text-green-700' : 'text-gray-500'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          Orders
        </button>
        <button
          type="button"
          onClick={onCartClick}
          className={`flex flex-col items-center text-xs ${
            isCart ? 'text-green-700' : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </div>
          Cart
        </button>
      </div>
    </nav>
  );
}
