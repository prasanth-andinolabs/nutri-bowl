import { useEffect, useMemo, useRef, useState } from 'react';
import { Instagram, MessageCircle, Phone } from 'lucide-react';
import type { Order, StoreItem } from './types';
import { Header } from './components/Header';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { CartPage } from './components/CartPage';
import { AuthModal } from './components/AuthModal';
import { OrderPopup } from './components/OrderPopup';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { AdminPage } from './components/AdminPage';
import { OrdersPage } from './components/OrdersPage';
import { HomePage } from './components/HomePage';
import { BottomNav } from './components/BottomNav';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import {
  createOrder,
  fetchInventory,
  resetInventory,
  updateInventory,
  updateInventoryItem,
  deleteInventoryItem,
} from './api';
import { useOrders } from './hooks/useOrders';
import { getOrderToken, setOrderToken } from './utils/storage';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useCustomerAuth } from './hooks/useCustomerAuth';
import { useCartState } from './hooks/useCartState';

function App() {
  const [inventory, setInventory] = useState<StoreItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [storePlaced, setStorePlaced] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    customerProfile,
    customerToken,
    authMode,
    authName,
    authPhone,
    authPassword,
    authError,
    authLoading,
    showAuthPassword,
    showAuthModal,
    setAuthMode,
    setAuthName,
    setAuthPhone,
    setAuthPassword,
    setShowAuthPassword,
    openAuthModal,
    closeAuthModal,
    handleAuth,
    logout: customerLogout,
    continueAsGuest,
  } = useCustomerAuth();
  const {
    cart,
    setCart,
    customerName,
    setCustomerName,
    phone,
    setPhone,
    address,
    setAddress,
    isGuestCheckout,
    setIsGuestCheckout,
    clearGuestDetails,
  } = useCartState(customerProfile);

  useEffect(() => {
    if (customerProfile) {
      setIsGuestCheckout(false);
    }
  }, [customerProfile, setIsGuestCheckout]);

  const [alternatePhone, setAlternatePhone] = useState('');
  const handleCustomerLogout = () => {
    customerLogout();
    setCustomerName('');
    setPhone('');
    setAlternatePhone('');
    setIsGuestCheckout(true);
  };
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const {
    adminKey,
    adminAuthed,
    adminUsername,
    adminPassword,
    adminError,
    setAdminUsername,
    setAdminPassword,
    login: handleAdminLogin,
    logout: handleAdminLogout,
  } = useAdminAuth();
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') {
      return '/';
    }
    return window.location.pathname;
  });
  const isAdminRoute = currentPath.startsWith('/admin');
  const isCartRoute = currentPath.startsWith('/cart');
  const isOrdersRoute = currentPath.startsWith('/orders');
  const isSubscriptionsRoute = currentPath.startsWith('/subscriptions');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle'
  );
  const [locationError, setLocationError] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [popupSeconds, setPopupSeconds] = useState(5);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const pageSize = 5;
  const [inventorySaving, setInventorySaving] = useState(false);
  const [inventoryMessage, setInventoryMessage] = useState('');
  const redirectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory();
        if (Array.isArray(data) && data.length > 0) {
          setInventory(data);
        }
      } catch {
        setInventory([]);
      } finally {
        setInventoryLoading(false);
      }
    };
    loadInventory();
  }, []);


  useEffect(() => {
    if (!customerProfile && !authPhone && phone.length === 10) {
      setAuthPhone(phone);
    }
  }, [phone, authPhone, customerProfile]);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const navigateTo = (path: string) => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
      setShowOrderPopup(false);
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const {
    ordersLoading: adminOrdersLoading,
    customerOrders,
    customerOrdersLoading,
    updateOrderStatus,
    ordersBySelectedDate,
  } = useOrders({
    isAdminRoute,
    isOrdersRoute,
    adminAuthed,
    adminKey,
    customerProfilePhone: customerProfile?.phone ?? '',
    guestPhone: phone,
    customerToken: customerToken || getOrderToken(customerProfile?.phone ?? phone),
  });

  const catalog = useMemo(() => {
    const regularFruits = inventory.filter(
      (item) => item.category === 'fruit' && item.subcategory !== 'exotic'
    );
    const exoticFruits = inventory.filter(
      (item) => item.category === 'fruit' && item.subcategory === 'exotic'
    );
    const dry = inventory.filter((item) => item.category === 'dry');
    const combos = inventory.filter((item) => item.category === 'combo');
    const subscriptions = inventory.filter((item) => item.category === 'subscription');
    return { regularFruits, exoticFruits, dry, combos, subscriptions };
  }, [inventory]);

  const CART_KEY_DELIMITER = '::';
  const buildCartKey = (id: string, weightGrams?: number) =>
    typeof weightGrams === 'number' ? `${id}${CART_KEY_DELIMITER}${weightGrams}` : id;
  const parseCartKey = (key: string) => {
    if (!key.includes(CART_KEY_DELIMITER)) {
      return { id: key, weightGrams: undefined };
    }
    const [id, weight] = key.split(CART_KEY_DELIMITER);
    const weightGrams = Number(weight);
    return {
      id,
      weightGrams: Number.isFinite(weightGrams) ? weightGrams : undefined,
    };
  };
  const getPricePerKg = (item: StoreItem) => {
    if (item.weightGrams && item.weightGrams > 0) {
      return item.price / (item.weightGrams / 1000);
    }
    return item.price;
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart).flatMap(([key, qty]) => {
      const { id, weightGrams } = parseCartKey(key);
      const item = inventory.find((entry) => entry.id === id);
      if (!item || qty <= 0) {
        return [];
      }
      const usesWeight = typeof weightGrams === 'number';
      const unitPrice = usesWeight
        ? Math.round(getPricePerKg(item) * (weightGrams / 1000))
        : item.price;
      return [
        {
          ...item,
          weightGrams: usesWeight ? weightGrams : item.weightGrams,
          price: unitPrice,
          qty,
          total: unitPrice * qty,
          cartKey: key,
        },
      ];
    });
  }, [cart, inventory]);

  const recommendedItems = useMemo(() => {
    return catalog.dry.slice(0, 3);
  }, [catalog.dry]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.total, 0),
    [cartItems]
  );
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  );
  const orderLookupPhone = customerProfile?.phone || phone;
  const hasCustomerToken = Boolean(customerToken);
  const hasOrderToken =
    typeof window !== 'undefined' && orderLookupPhone ? getOrderToken(orderLookupPhone) : '';

  const ordersBySelectedDateMemo = useMemo(
    () => ordersBySelectedDate(selectedDate),
    [ordersBySelectedDate, selectedDate]
  );

  const getOrderTotal = (order: Order) => {
    if (typeof order.total === 'number') {
      return order.total;
    }
    return 0;
  };

  const pendingOrders = useMemo(
    () => ordersBySelectedDateMemo.filter((order) => order.status === 'pending_confirmation'),
    [ordersBySelectedDateMemo]
  );
  const confirmedOrders = useMemo(
    () => ordersBySelectedDateMemo.filter((order) => order.status === 'confirmed'),
    [ordersBySelectedDateMemo]
  );
  const deliveredOrders = useMemo(
    () => ordersBySelectedDateMemo.filter((order) => order.status === 'delivered'),
    [ordersBySelectedDateMemo]
  );
  const cancelledOrders = useMemo(
    () => ordersBySelectedDateMemo.filter((order) => order.status === 'cancelled'),
    [ordersBySelectedDateMemo]
  );
  const pendingTotals = useMemo(
    () => ({
      count: pendingOrders.length,
      value: pendingOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
    }),
    [pendingOrders]
  );
  const confirmedTotals = useMemo(
    () => ({
      count: confirmedOrders.length,
      value: confirmedOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
    }),
    [confirmedOrders]
  );
  const deliveredTotals = useMemo(
    () => ({
      count: deliveredOrders.length,
      value: deliveredOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
    }),
    [deliveredOrders]
  );
  const cancelledTotals = useMemo(
    () => ({
      count: cancelledOrders.length,
      value: cancelledOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
    }),
    [cancelledOrders]
  );
  const paginate = (items: Order[]) => {
    const start = 0;
    return items.slice(start, start + pageSize);
  };

  const updateQty = (id: string, delta: number, weightGrams?: number) => {
    const cartKey = buildCartKey(id, weightGrams);
    setCart((prev) => {
      const next = { ...prev };
      const current = next[cartKey] ?? 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        delete next[cartKey];
      } else {
        next[cartKey] = updated;
      }
      return next;
    });
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    setLocationStatus('loading');
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('ready');
      },
      () => {
        setLocationStatus('error');
        setLocationError('Unable to access location. Please allow permission.');
      }
    );
  };

  useEffect(() => {
    if (!showOrderPopup) {
      return;
    }
    setPopupSeconds(5);
    const interval = setInterval(() => {
      setPopupSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    redirectTimeoutRef.current = window.setTimeout(() => {
      setShowOrderPopup(false);
      navigateTo('/');
    }, 5000);
    return () => clearInterval(interval);
  }, [showOrderPopup]);

  const submitOrder = async (payload: Record<string, unknown>, type: 'subscription' | 'store') => {
    const orderName = customerProfile?.name || customerName.trim();
    const rawPhone = customerProfile
      ? (alternatePhone.trim() || customerProfile.phone)
      : phone.trim();
    if (!orderName || !rawPhone || !address.trim()) {
      setSubmitError('Please add name, phone number, and delivery address.');
      return;
    }
    const normalizedPhone = rawPhone.replace(/\D/g, '');
    const isIndianPhone = /^[6-9]\d{9}$/.test(normalizedPhone);
    if (!isIndianPhone) {
      setSubmitError('Please enter a valid Indian mobile number (10 digits).');
      return;
    }
    if (type === 'store' && cartItems.length === 0) {
      setSubmitError('Add items to your cart before placing an order.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const existingToken = typeof window === 'undefined' ? '' : getOrderToken(normalizedPhone);
      const data = await createOrder({
        ...payload,
        name: orderName,
        phone: normalizedPhone,
        accessToken: existingToken || undefined,
      });
      if (data?.accessToken && typeof window !== 'undefined') {
        setOrderToken(normalizedPhone, data.accessToken);
      }
      setStorePlaced(true);
      setCart({});
      if (!customerProfile) {
        setCustomerName('');
        setPhone('');
      }
      setAlternatePhone('');
      setIsGuestCheckout(false);
      setAddress('');
      setLocationCoords(null);
      setLocationStatus('idle');
      setLocationError('');
      if (typeof window !== 'undefined') {
        clearGuestDetails();
      }
      setShowOrderPopup(true);
    } catch {
      setSubmitError('Unable to submit right now. Please call us for COD order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomerAuth = handleAuth;

  const handleInventoryReset = async () => {
    try {
      setInventorySaving(true);
      setInventoryMessage('');
      await resetInventory(adminKey);
      const data = await fetchInventory();
      setInventory(data);
      setInventoryMessage('Catalogue reset to default.');
    } catch {
      setInventoryMessage('Failed to reset catalogue.');
    } finally {
      setInventorySaving(false);
    }
  };

  const handleInventoryUpload = async (items: StoreItem[]) => {
    try {
      setInventorySaving(true);
      setInventoryMessage('');
      await updateInventory(adminKey, items);
      const data = await fetchInventory();
      setInventory(data);
      setInventoryMessage('Catalogue updated successfully.');
    } catch {
      setInventoryMessage('Failed to upload catalogue.');
    } finally {
      setInventorySaving(false);
    }
  };

  const handleInventoryItemUpdate = async (item: StoreItem) => {
    try {
      setInventorySaving(true);
      setInventoryMessage('');
      await updateInventoryItem(adminKey, item);
      const data = await fetchInventory();
      setInventory(data);
      setInventoryMessage('Item updated.');
    } catch {
      setInventoryMessage('Failed to update item.');
    } finally {
      setInventorySaving(false);
    }
  };

  const handleInventoryItemDelete = async (id: string) => {
    try {
      setInventorySaving(true);
      setInventoryMessage('');
      await deleteInventoryItem(adminKey, id);
      setInventory((prev) => prev.filter((item) => item.id !== id));
      setInventoryMessage('Item deleted.');
    } catch {
      setInventoryMessage('Failed to delete item.');
    } finally {
      setInventorySaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {!isAdminRoute && <PwaInstallBanner />}
      <Header
        isAdminRoute={isAdminRoute}
        isOrdersRoute={isOrdersRoute}
        isCartRoute={isCartRoute}
        isSubscriptionsRoute={isSubscriptionsRoute}
        cartCount={cartCount}
        cartTotal={cartTotal}
        customerProfile={customerProfile}
        isGuestCheckout={isGuestCheckout}
        onNavigate={navigateTo}
        onCartClick={() => {
          if (!isCartRoute) navigateTo('/cart');
        }}
        onOpenAuth={() => openAuthModal('signin')}
        onCustomerLogout={handleCustomerLogout}
      />

      {isAdminRoute ? (
        <AdminPage
          adminAuthed={adminAuthed}
          adminUsername={adminUsername}
          adminPassword={adminPassword}
          adminError={adminError}
          ordersLoading={adminOrdersLoading}
          selectedDate={selectedDate}
          pendingOrders={paginate(pendingOrders)}
          confirmedOrders={paginate(confirmedOrders)}
          deliveredOrders={paginate(deliveredOrders)}
          cancelledOrders={paginate(cancelledOrders)}
          pendingTotals={pendingTotals}
          confirmedTotals={confirmedTotals}
          deliveredTotals={deliveredTotals}
          cancelledTotals={cancelledTotals}
          inventorySaving={inventorySaving}
          inventoryMessage={inventoryMessage}
          inventory={inventory}
          onAdminUsernameChange={setAdminUsername}
          onAdminPasswordChange={setAdminPassword}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onSelectedDateChange={setSelectedDate}
          onOrderClick={setActiveOrder}
          onUpdateOrderStatus={updateOrderStatus}
          onInventoryReset={handleInventoryReset}
          onInventoryUpload={handleInventoryUpload}
          onInventoryItemUpdate={handleInventoryItemUpdate}
          onInventoryItemDelete={handleInventoryItemDelete}
        />
      ) : isCartRoute ? (
        <CartPage
          cartItems={cartItems}
          recommendedItems={recommendedItems}
          cartCount={cartCount}
          cartTotal={cartTotal}
          customerProfile={customerProfile}
          showAuthModal={showAuthModal}
          customerName={customerName}
          phone={phone}
          alternatePhone={alternatePhone}
          onAlternatePhoneChange={setAlternatePhone}
          address={address}
          locationCoords={locationCoords}
          locationError={locationError}
          locationStatus={locationStatus}
          submitting={submitting}
          submitError={submitError}
          storePlaced={storePlaced}
          onBackToShop={() => navigateTo('/')}
          onOpenAuth={() => openAuthModal('signin')}
          onCustomerLogout={handleCustomerLogout}
          onUpdateQty={updateQty}
          onNameChange={setCustomerName}
          onPhoneChange={setPhone}
          onAddressChange={setAddress}
          onRequestLocation={requestLocation}
          onSubmitOrder={() =>
            submitOrder(
              {
                type: 'store',
                name: customerName,
                phone,
                address,
                paymentMethod: 'COD',
                items: cartItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  qty: item.qty,
                  price: item.price,
                  total: item.total,
                  weightGrams: item.weightGrams,
                })),
                total: cartTotal,
                location: locationCoords,
              },
              'store'
            )
          }
        />
      ) : isOrdersRoute ? (
        <OrdersPage
          customerProfile={customerProfile}
          authPhone={authPhone}
          authPassword={authPassword}
          authLoading={authLoading}
          authError={authError}
          showAuthPassword={showAuthPassword}
          orderLookupPhone={orderLookupPhone}
          hasCustomerToken={hasCustomerToken}
          hasOrderToken={hasOrderToken}
          customerOrdersLoading={customerOrdersLoading}
          customerOrders={customerOrders}
          onBackToShop={() => navigateTo('/')}
          onCustomerLogout={handleCustomerLogout}
          onAuthPhoneChange={setAuthPhone}
          onAuthPasswordChange={setAuthPassword}
          onTogglePassword={() => setShowAuthPassword((prev) => !prev)}
          onSignIn={() => {
            setAuthMode('signin');
            handleCustomerAuth();
          }}
          onGuestPhoneChange={setPhone}
          onOrderClick={setActiveOrder}
          getOrderTotal={getOrderTotal}
        />
      ) : isSubscriptionsRoute ? (
        <SubscriptionsPage />
      ) : (
        <HomePage
          inventoryLoading={inventoryLoading}
          catalog={catalog}
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onUpdateQty={updateQty}
          onGoToCart={() => {
            if (!isCartRoute) navigateTo('/cart');
          }}
          onGoToOrders={() => navigateTo('/orders')}
          onGoToSubscriptions={() => navigateTo('/subscriptions')}
          onGoToCatalog={() => {
            const el = document.getElementById('catalog');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

      <OrderPopup isOpen={showOrderPopup} seconds={popupSeconds} />
      <OrderDetailsModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        getOrderTotal={getOrderTotal}
      />
      <AuthModal
        isOpen={showAuthModal && !customerProfile}
        mode={authMode === 'signup' ? 'signup' : 'signin'}
        authName={authName}
        authPhone={authPhone}
        authPassword={authPassword}
        authError={authError}
        authLoading={authLoading}
        showPassword={showAuthPassword}
        onModeChange={(mode) => setAuthMode(mode)}
        onNameChange={setAuthName}
        onPhoneChange={setAuthPhone}
        onPasswordChange={setAuthPassword}
        onTogglePassword={() => setShowAuthPassword((prev) => !prev)}
        onSubmit={async () => {
          await handleCustomerAuth();
          if (!authError) {
            setIsGuestCheckout(false);
            closeAuthModal();
          }
        }}
        onClose={() => {
          closeAuthModal();
        }}
        onGuest={() => {
          continueAsGuest();
          setIsGuestCheckout(true);
        }}
      />

      {!isAdminRoute && (
        <BottomNav
          isHome={!isOrdersRoute && !isCartRoute && !isSubscriptionsRoute}
          isOrders={isOrdersRoute}
          isCart={isCartRoute}
          cartCount={cartCount}
          onNavigate={navigateTo}
          onCartClick={() => {
            if (!isCartRoute) navigateTo('/cart');
          }}
        />
      )}

      <footer className="bg-gray-900 text-white py-12 pb-20 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/image.png"
                  alt="Nutri Bowl logo"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">Nutri Bowl</h3>
                  <p className="text-sm text-gray-400">Fresh & Healthy</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Delivering fresh, nutritious breakfast bowls to your doorstep every morning. Your
                health, our priority.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a
                  href="tel:+919642338692"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <Phone className="w-5 h-5 text-green-500" />
                  <span>+91 96423 38692</span>
                </a>
                <a
                  href="https://wa.me/919390574240"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span>+91 93905 74240 (WhatsApp)</span>
                </a>
                <a
                  href="https://instagram.com/nutribowl_rajam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <Instagram className="w-5 h-5 text-green-500" />
                  <span>@nutribowl_rajam</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#packages" className="text-gray-400 hover:text-white transition">
                    Our Packages
                  </a>
                </li>
                <li>
                  <a href="#special" className="text-gray-400 hover:text-white transition">
                    Specialized Plans
                  </a>
                </li>
                <li>
                  <a href="#catering" className="text-gray-400 hover:text-white transition">
                    Catering Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Nutri Bowl. All rights reserved. | Stay Fit, Stay Healthy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
