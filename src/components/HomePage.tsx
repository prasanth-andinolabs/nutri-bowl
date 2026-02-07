import { useState } from 'react';
import { Minus, Phone, Plus, Store } from 'lucide-react';
import type { StoreItem } from '../types';
import { formatAmountWithUnit, formatPriceWithAmount, formatWeightFromGrams } from '../utils/format';

type HomePageProps = {
  inventoryLoading: boolean;
  catalog: {
    regularFruits: StoreItem[];
    exoticFruits: StoreItem[];
    dry: StoreItem[];
    combos: StoreItem[];
    subscriptions: StoreItem[];
  };
  cart: Record<string, number>;
  cartCount: number;
  cartTotal: number;
  onUpdateQty: (id: string, delta: number, weightGrams?: number) => void;
  onGoToCart: () => void;
  onGoToOrders: () => void;
  onGoToSubscriptions: () => void;
  onGoToCatalog: () => void;
};

type CatalogGroup = {
  key: string;
  name: string;
  category: StoreItem['category'];
  subcategory?: StoreItem['subcategory'];
  image: string;
  tags: string[];
  variants: StoreItem[];
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
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const hasTag = (item: StoreItem, tag: string) => item.tags?.includes(tag);
  const weightOptions = [250, 500, 1000];
  const getPricePerKg = (item: StoreItem) => {
    if (item.weightGrams && item.weightGrams > 0) {
      return item.price / (item.weightGrams / 1000);
    }
    return item.price;
  };
  const getBaseVariant = (group: CatalogGroup) => {
    return group.variants.reduce((best, current) => {
      const bestWeight = best.weightGrams ?? 0;
      const currentWeight = current.weightGrams ?? 0;
      if (bestWeight === 0) {
        return current;
      }
      if (currentWeight === 0) {
        return best;
      }
      const bestDiff = Math.abs(1000 - bestWeight);
      const currentDiff = Math.abs(1000 - currentWeight);
      return currentDiff < bestDiff ? current : best;
    }, group.variants[0]);
  };
  const groupItems = (items: StoreItem[]): CatalogGroup[] => {
    const grouped = new Map<string, CatalogGroup>();
    items.forEach((item) => {
      const key = `${item.category}-${item.subcategory ?? 'all'}-${item.name}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.variants.push(item);
        return;
      }
      grouped.set(key, {
        key,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        image: item.image,
        tags: item.tags ?? [],
        variants: [item],
      });
    });
    grouped.forEach((group) => {
      group.variants.sort((a, b) => {
        const weightDiff = (a.weightGrams ?? 0) - (b.weightGrams ?? 0);
        if (weightDiff !== 0) {
          return weightDiff;
        }
        return a.price - b.price;
      });
    });
    return Array.from(grouped.values());
  };
  const regularFruitGroups = groupItems(catalog.regularFruits);
  const exoticFruitGroups = groupItems(catalog.exoticFruits);
  const dryGroups = groupItems(catalog.dry);
  const comboGroups = groupItems(catalog.combos);
  const subscriptionGroups = groupItems(catalog.subscriptions);
  const getSelectedWeight = (group: CatalogGroup) => selectedWeights[group.key] ?? 1000;
  const handleWeightSelect = (groupKey: string, weightGrams: number) => {
    setSelectedWeights((prev) => ({ ...prev, [groupKey]: weightGrams }));
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
                <h4 className="text-2xl font-semibold mb-4">Regular Fruits</h4>
                {inventoryLoading && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
                    {skeletons.map((_, index) => (
                      <div
                        key={`fresh-skeleton-${index}`}
                        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-green-100 shadow-sm animate-pulse"
                      >
                        <div className="w-full h-36 sm:h-40 rounded-2xl bg-gray-200 mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {regularFruitGroups.map((group) => {
                    const baseItem = getBaseVariant(group);
                    const selectedWeight = getSelectedWeight(group);
                    const pricePerKg = getPricePerKg(baseItem);
                    const unitPrice = Math.round(pricePerKg * (selectedWeight / 1000));
                    const qty = cart[`${baseItem.id}::${selectedWeight}`] ?? 0;
                    return (
                    <div
                      key={group.key}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <div className="relative mb-4">
                        <div className="w-full block">
                          <img
                            src={baseItem.image}
                            alt={group.name}
                            className="w-full h-36 sm:h-40 rounded-2xl object-contain bg-gray-50"
                          />
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {hasTag(baseItem, 'seasonal') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-50/95 text-green-700 shadow-sm">
                              Seasonal
                            </span>
                          )}
                          {hasTag(baseItem, 'exotic') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-purple-50/95 text-purple-700 shadow-sm">
                              Exotic
                            </span>
                          )}
                          {hasTag(baseItem, 'best_seller') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-50/95 text-amber-700 shadow-sm">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-left text-base font-semibold text-gray-900 line-clamp-2">
                            {group.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPriceWithAmount(unitPrice, formatWeightFromGrams(selectedWeight))}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                          Fresh
                        </span>
                      </div>
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-500 mb-1 leading-4 h-4">
                            Weight
                          </p>
                          <div className="relative max-w-[130px] sm:max-w-[150px]">
                            <select
                              className="w-full h-9 appearance-none border border-gray-200 rounded-xl px-3 text-sm bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                              value={selectedWeight}
                              onChange={(event) =>
                                handleWeightSelect(group.key, Number(event.target.value))
                              }
                            >
                              {weightOptions.map((option) => (
                                <option key={option} value={option}>
                                  {formatWeightFromGrams(option)}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                              ▾
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <p className="text-[11px] font-semibold text-gray-500 mb-1 text-center leading-4 h-4">
                            Qty
                          </p>
                          <div className="flex items-center justify-between gap-1 h-9 rounded-full border border-green-200 bg-green-50/60 px-1 w-[110px]">
                            <button
                              className="p-2 rounded-full hover:bg-white"
                              onClick={() => onUpdateQty(baseItem.id, -1, selectedWeight)}
                              aria-label={`Remove ${group.name}`}
                            >
                              <Minus className="w-4 h-4 text-green-600" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-gray-900">
                              {qty}
                            </span>
                            <button
                              className="p-2 rounded-full hover:bg-white"
                              onClick={() => onUpdateQty(baseItem.id, 1, selectedWeight)}
                              aria-label={`Add ${group.name}`}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-4">Exotic Fruits</h4>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {exoticFruitGroups.map((group) => {
                    const baseItem = getBaseVariant(group);
                    const selectedWeight = getSelectedWeight(group);
                    const pricePerKg = getPricePerKg(baseItem);
                    const unitPrice = Math.round(pricePerKg * (selectedWeight / 1000));
                    const qty = cart[`${baseItem.id}::${selectedWeight}`] ?? 0;
                    return (
                    <div
                      key={group.key}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <div className="relative mb-4">
                        <div className="w-full block">
                          <img
                            src={baseItem.image}
                            alt={group.name}
                            className="w-full h-36 sm:h-40 rounded-2xl object-contain bg-gray-50"
                          />
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {hasTag(baseItem, 'premium') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-purple-50/95 text-purple-700 shadow-sm">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-left text-base font-semibold text-gray-900 line-clamp-2">
                            {group.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPriceWithAmount(unitPrice, formatWeightFromGrams(selectedWeight))}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                          Exotic
                        </span>
                      </div>
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-500 mb-1 leading-4 h-4">
                            Weight
                          </p>
                          <div className="relative max-w-[130px] sm:max-w-[150px]">
                            <select
                              className="w-full h-9 appearance-none border border-gray-200 rounded-xl px-3 text-sm bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                              value={selectedWeight}
                              onChange={(event) =>
                                handleWeightSelect(group.key, Number(event.target.value))
                              }
                            >
                              {weightOptions.map((option) => (
                                <option key={option} value={option}>
                                  {formatWeightFromGrams(option)}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                              ▾
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <p className="text-[11px] font-semibold text-gray-500 mb-1 text-center leading-4 h-4">
                            Qty
                          </p>
                          <div className="flex items-center justify-between gap-1 h-9 rounded-full border border-green-200 bg-green-50/60 px-1 w-[110px]">
                            <button
                              className="p-2 rounded-full hover:bg-white"
                              onClick={() => onUpdateQty(baseItem.id, -1, selectedWeight)}
                              aria-label={`Remove ${group.name}`}
                            >
                              <Minus className="w-4 h-4 text-green-600" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-gray-900">
                              {qty}
                            </span>
                            <button
                              className="p-2 rounded-full hover:bg-white"
                              onClick={() => onUpdateQty(baseItem.id, 1, selectedWeight)}
                              aria-label={`Add ${group.name}`}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-4">Dry Fruits</h4>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {dryGroups.map((group) => {
                    const baseItem = getBaseVariant(group);
                    const selectedWeight = getSelectedWeight(group);
                    const pricePerKg = getPricePerKg(baseItem);
                    const unitPrice = Math.round(pricePerKg * (selectedWeight / 1000));
                    const qty = cart[`${baseItem.id}::${selectedWeight}`] ?? 0;
                    return (
                    <div
                      key={group.key}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <div className="relative mb-4">
                        <div className="w-full block">
                          <img
                            src={baseItem.image}
                            alt={group.name}
                            className="w-full h-36 sm:h-40 rounded-2xl object-contain bg-gray-50"
                          />
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {hasTag(baseItem, 'best_seller') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-50/95 text-amber-700 shadow-sm">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-left text-base font-semibold text-gray-900 line-clamp-2">
                            {group.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPriceWithAmount(unitPrice, formatWeightFromGrams(selectedWeight))}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                          Dry
                        </span>
                      </div>
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-500 mb-1 leading-4 h-4">
                            Weight
                          </p>
                          <div className="relative max-w-[130px] sm:max-w-[150px]">
                            <select
                              className="w-full h-9 appearance-none border border-gray-200 rounded-xl px-3 text-sm bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                              value={selectedWeight}
                              onChange={(event) =>
                                handleWeightSelect(group.key, Number(event.target.value))
                              }
                            >
                              {weightOptions.map((option) => (
                                <option key={option} value={option}>
                                  {formatWeightFromGrams(option)}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                              ▾
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <p className="text-[11px] font-semibold text-gray-500 mb-1 text-center leading-4 h-4">
                            Qty
                          </p>
                          <div className="flex items-center justify-between gap-1 h-9 rounded-full border border-green-200 bg-green-50/60 px-1 w-[110px]">
                            <button
                              className="p-2 rounded-full hover:bg-white"
                              onClick={() => onUpdateQty(baseItem.id, -1, selectedWeight)}
                              aria-label={`Remove ${group.name}`}
                            >
                              <Minus className="w-4 h-4 text-green-600" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-gray-900">
                              {qty}
                            </span>
                            <button
                              className="p-2 rounded-full hover:bg-white"
                              onClick={() => onUpdateQty(baseItem.id, 1, selectedWeight)}
                              aria-label={`Add ${group.name}`}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-4">Combos & Bundles</h4>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {comboGroups.map((group) => {
                    const baseItem = getBaseVariant(group);
                    const qty = cart[baseItem.id] ?? 0;
                    return (
                    <div
                      key={group.key}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <div className="relative mb-4">
                        <div className="w-full block">
                          <img
                            src={baseItem.image}
                            alt={group.name}
                            className="w-full h-36 sm:h-40 rounded-2xl object-contain bg-gray-50"
                          />
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {hasTag(baseItem, 'premium') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-indigo-50/95 text-indigo-700 shadow-sm">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-left text-base font-semibold text-gray-900 line-clamp-2">
                            {group.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPriceWithAmount(baseItem.price, formatAmountWithUnit(baseItem))}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                          Combo
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => onUpdateQty(baseItem.id, -1)}
                            aria-label={`Remove ${group.name}`}
                          >
                            <Minus className="w-5 h-5 text-green-600" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {qty}
                          </span>
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => onUpdateQty(baseItem.id, 1)}
                            aria-label={`Add ${group.name}`}
                          >
                            <Plus className="w-5 h-5 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-4">Subscription Bowls</h4>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {subscriptionGroups.map((group) => {
                    const baseItem = getBaseVariant(group);
                    const qty = cart[baseItem.id] ?? 0;
                    return (
                    <div
                      key={group.key}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-green-100 shadow-sm transition sm:hover:shadow-lg sm:hover:-translate-y-0.5"
                    >
                      <div className="relative mb-4">
                        <div className="w-full block">
                          <img
                            src={baseItem.image}
                            alt={group.name}
                            className="w-full h-36 sm:h-40 rounded-2xl object-contain bg-gray-50"
                          />
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {hasTag(baseItem, 'daily_use') && (
                            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-50/95 text-green-700 shadow-sm">
                              Daily Use
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-left text-base font-semibold text-gray-900 line-clamp-2">
                            {group.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPriceWithAmount(baseItem.price, formatAmountWithUnit(baseItem))}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                          Bowl
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => onUpdateQty(baseItem.id, -1)}
                            aria-label={`Remove ${group.name}`}
                          >
                            <Minus className="w-5 h-5 text-green-600" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {qty}
                          </span>
                          <button
                            className="p-3 rounded-full border border-green-200 hover:bg-green-50"
                            onClick={() => onUpdateQty(baseItem.id, 1)}
                            aria-label={`Add ${group.name}`}
                          >
                            <Plus className="w-5 h-5 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
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
    </main>
  );
}
