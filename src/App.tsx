import { useEffect, useMemo, useRef, useState } from 'react';
import { Leaf } from 'lucide-react';
import { STORE_ITEMS } from './data/storeItems';
import type { Order, StoreItem } from './types';
import { Header } from './components/Header';
import { CartPage } from './components/CartPage';
import { AuthModal } from './components/AuthModal';
import { OrderPopup } from './components/OrderPopup';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { AdminPage } from './components/AdminPage';
import { OrdersPage } from './components/OrdersPage';
import { HomePage } from './components/HomePage';
import { BottomNav } from './components/BottomNav';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { createOrder, fetchInventory, resetInventory } from './api';
import { useOrders } from './hooks/useOrders';
import { getOrderToken, setOrderToken } from './utils/storage';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useCustomerAuth } from './hooks/useCustomerAuth';
import { useCartState } from './hooks/useCartState';

function App() {
  const [inventory, setInventory] = useState<StoreItem[]>(STORE_ITEMS);
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

  const handleCustomerLogout = () => {
    customerLogout();
    setCustomerName('');
    setPhone('');
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
        setInventory(STORE_ITEMS);
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
    const fresh = inventory.filter((item) => item.category === 'fresh');
    const dry = inventory.filter((item) => item.category === 'dry');
    return { fresh, dry };
  }, [inventory]);

  const cartItems = useMemo(() => {
    return inventory.filter((item) => cart[item.id] > 0).map((item) => ({
      ...item,
      qty: cart[item.id],
      total: cart[item.id] * item.price,
    }));
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

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[id] ?? 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        delete next[id];
      } else {
        next[id] = updated;
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
    const rawPhone = customerProfile?.phone || phone.trim();
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
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
          if (isCartRoute) {
            return;
          }
          navigateTo('/cart');
          if (!customerProfile && !isGuestCheckout) {
            openAuthModal('signin');
          }
        }}
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
          onAdminUsernameChange={setAdminUsername}
          onAdminPasswordChange={setAdminPassword}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onSelectedDateChange={setSelectedDate}
          onOrderClick={setActiveOrder}
          onUpdateOrderStatus={updateOrderStatus}
          onInventoryReset={handleInventoryReset}
        />
      ) : isCartRoute ? (
        <CartPage
          cartItems={cartItems}
          recommendedItems={recommendedItems}
          cartCount={cartCount}
          cartTotal={cartTotal}
          customerProfile={customerProfile}
          isGuestCheckout={isGuestCheckout}
          showAuthModal={showAuthModal}
          customerName={customerName}
          phone={phone}
          address={address}
          locationCoords={locationCoords}
          locationError={locationError}
          locationStatus={locationStatus}
          submitting={submitting}
          submitError={submitError}
          storePlaced={storePlaced}
          onBackToShop={() => navigateTo('/')}
          onOpenAuth={() => openAuthModal('signin')}
          onStartGuestCheckout={() => setIsGuestCheckout(true)}
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
            if (isCartRoute) {
              return;
            }
            navigateTo('/cart');
            if (!customerProfile && !isGuestCheckout) {
              openAuthModal('signin');
            }
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
          if (isCartRoute && !customerProfile && !isGuestCheckout) {
            navigateTo('/');
          }
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
            if (isCartRoute) {
              return;
            }
            navigateTo('/cart');
            if (!customerProfile && !isGuestCheckout) {
              openAuthModal('signin');
            }
          }}
        />
      )}

      <footer className="bg-gray-900 text-white py-10 pb-20 sm:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-7 h-7 text-green-500" />
            <span className="text-lg font-semibold">NutriBowl</span>
          </div>
          <p className="text-gray-400 text-sm">
            COD-only MVP for a single city. Built for small-team operations.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
