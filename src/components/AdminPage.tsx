import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Truck } from 'lucide-react';
import type { Order, OrderStatus, StoreItem } from '../types';
import { fetchInventoryImages } from '../api/inventory';

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
  inventory: StoreItem[];
  onAdminUsernameChange: (value: string) => void;
  onAdminPasswordChange: (value: string) => void;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  onSelectedDateChange: (value: string) => void;
  onOrderClick: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onInventoryReset: () => void;
  onInventoryUpload: (items: StoreItem[]) => void;
  onInventoryItemUpdate: (item: StoreItem) => void;
  onInventoryItemDelete: (id: string) => void;
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
  inventory,
  onAdminUsernameChange,
  onAdminPasswordChange,
  onAdminLogin,
  onAdminLogout,
  onSelectedDateChange,
  onOrderClick,
  onUpdateOrderStatus,
  onInventoryReset,
  onInventoryUpload,
  onInventoryItemUpdate,
  onInventoryItemDelete,
}: AdminPageProps) {
  const [showCatalogueManager, setShowCatalogueManager] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem('admin_catalogue_view') === 'true';
  });
  const [catalogDraft, setCatalogDraft] = useState<StoreItem[]>(inventory);
  const [catalogError, setCatalogError] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<StoreItem['category']>('fruit');
  const [newSubcategory, setNewSubcategory] = useState<StoreItem['subcategory']>('regular');
  const [newUnit, setNewUnit] = useState<StoreItem['unit']>('kg');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newTags, setNewTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | StoreItem['category']>('all');
  const [bulkError, setBulkError] = useState('');
  const [bulkPreviewCount, setBulkPreviewCount] = useState<number | null>(null);
  const [bulkItems, setBulkItems] = useState<StoreItem[] | null>(null);
  const [imageOptions, setImageOptions] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  useEffect(() => {
    setCatalogDraft(inventory);
  }, [inventory]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('admin_catalogue_view', String(showCatalogueManager));
  }, [showCatalogueManager]);

  useEffect(() => {
    if (!showCatalogueManager) {
      return;
    }
    const loadImages = async () => {
      setImagesLoading(true);
      setImagesError('');
      try {
        const images = await fetchInventoryImages();
        setImageOptions(images);
      } catch {
        setImagesError('Unable to load image library.');
      } finally {
        setImagesLoading(false);
      }
    };
    loadImages();
  }, [showCatalogueManager]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const parsedPrice = Number(newPrice);
  const canAddItem =
    newName.trim().length > 1 &&
    Number.isFinite(parsedPrice) &&
    parsedPrice > 0 &&
    newImage.trim().length > 5;

  const sortedCatalog = useMemo(
    () =>
      [...catalogDraft].sort((a, b) => a.name.localeCompare(b.name)),
    [catalogDraft]
  );

  const filteredCatalog = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return sortedCatalog.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [sortedCatalog, searchQuery, categoryFilter]);

  const handleAddItem = () => {
    if (!canAddItem) {
      setCatalogError('Please add name, price, and image URL.');
      return;
    }
    const baseId = slugify(newName);
    const id = `${baseId}-1kg`;
    const sku = `${baseId.toUpperCase()}-1KG`;
    const weightGrams = newCategory === 'fruit' || newCategory === 'dry' ? 1000 : undefined;
    const tags = newTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const item: StoreItem = {
      id,
      sku,
      name: newName.trim(),
      category: newCategory,
      subcategory: newCategory === 'fruit' ? newSubcategory : undefined,
      unit: newUnit,
      weightGrams,
      price: Math.round(parsedPrice),
      image: newImage.trim(),
      tags: tags.length ? tags : undefined,
    };
    setCatalogDraft((prev) => [...prev, item]);
    setCatalogError('');
    setNewName('');
    setNewPrice('');
    setNewImage('');
    setNewTags('');
  };

  const handleRemoveItem = (id: string) => {
    setConfirmRemoveId(id);
  };

  const handleConfirmRemove = () => {
    if (!confirmRemoveId) {
      return;
    }
    setCatalogDraft((prev) => prev.filter((item) => item.id !== confirmRemoveId));
    onInventoryItemDelete(confirmRemoveId);
    setConfirmRemoveId(null);
  };

  const handlePriceUpdate = (id: string, value: string) => {
    const nextPrice = Number(value);
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      return;
    }
    setCatalogDraft((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: Math.round(nextPrice) } : item))
    );
  };

  const handleSaveItem = (id: string) => {
    const itemToSave = catalogDraft.find((item) => item.id === id);
    if (!itemToSave) {
      return;
    }
    onInventoryItemUpdate(itemToSave);
  };

  const parseCsvLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
        continue;
      }
      current += char;
    }
    result.push(current.trim());
    return result;
  };

  const normalizeHeader = (value: string) => value.toLowerCase().trim().replace(/\s+/g, '_');

  const handleBulkFile = async (file: File | null) => {
    if (!file) {
      setBulkError('');
      setBulkPreviewCount(null);
      setBulkItems(null);
      return;
    }
    try {
      const raw = await file.text();
      const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        throw new Error('CSV must include header and at least one row.');
      }
      const header = parseCsvLine(lines[0]).map(normalizeHeader);
      const getIndex = (key: string) => header.indexOf(key);
      const required = ['name', 'category', 'unit', 'price', 'image'];
      required.forEach((key) => {
        if (getIndex(key) === -1) {
          throw new Error(`Missing required column: ${key}`);
        }
      });
      const rows = lines.slice(1);
      const items: StoreItem[] = rows.map((line, index) => {
        const cols = parseCsvLine(line);
        const getValue = (key: string) => cols[getIndex(key)] ?? '';
        const name = getValue('name').trim();
        const category = getValue('category').trim() as StoreItem['category'];
        const subcategory = getValue('subcategory').trim() as StoreItem['subcategory'];
        const unit = getValue('unit').trim() as StoreItem['unit'];
        const price = Number(getValue('price'));
        const image = getValue('image').trim();
        const tags = getValue('tags')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
        if (!name || !category || !unit || !image || !Number.isFinite(price)) {
          throw new Error(`Invalid row at line ${index + 2}.`);
        }
        const baseId = slugify(name);
        const id = `${baseId}-1kg`;
        const sku = `${baseId.toUpperCase()}-1KG`;
        const weightGrams = category === 'fruit' || category === 'dry' ? 1000 : undefined;
        return {
          id,
          sku,
          name,
          category,
          subcategory: category === 'fruit' && subcategory ? subcategory : undefined,
          unit,
          weightGrams,
          price: Math.round(price),
          image,
          tags: tags.length ? tags : undefined,
        };
      });
      setBulkError('');
      setBulkItems(items);
      setBulkPreviewCount(items.length);
    } catch (error) {
      setBulkError(error instanceof Error ? error.message : 'Invalid CSV file.');
      setBulkPreviewCount(null);
      setBulkItems(null);
    }
  };

  const normalizeItemName = (value: string) =>
    value
      .toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const imageMap = new Map<string, string>([
    ['apple', 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['banana', 'https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['orange', 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['grapes', 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['pomegranate', 'https://images.pexels.com/photos/70841/pomegranate-fruit-ruby-red-70841.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['papaya', 'https://images.pexels.com/photos/5945841/pexels-photo-5945841.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['watermelon', 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['muskmelon', 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['pineapple', 'https://images.pexels.com/photos/1697204/pexels-photo-1697204.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['guava', 'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['sweet lime', 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['mosambi', 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['pear', 'https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['plum', 'https://images.pexels.com/photos/5945782/pexels-photo-5945782.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['sapota', 'https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['chikoo', 'https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['dragon fruit', 'https://images.pexels.com/photos/5611701/pexels-photo-5611701.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['kiwi', 'https://images.pexels.com/photos/5945763/pexels-photo-5945763.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['avocado', 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['blueberries', 'https://images.pexels.com/photos/51312/blueberries-berries-fruit-51312.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['strawberries', 'https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['raspberries', 'https://images.pexels.com/photos/52534/raspberries-fruits-berries-52534.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['blackberries', 'https://images.pexels.com/photos/52533/blackberries-berries-fruits-52533.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['passion fruit', 'https://images.pexels.com/photos/5945832/pexels-photo-5945832.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['figs', 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['cherries', 'https://images.pexels.com/photos/3080/food-fruit-kitchen-sweet.jpg?auto=compress&cs=tinysrgb&w=600'],
    ['gooseberries', 'https://images.pexels.com/photos/51312/blueberries-berries-fruit-51312.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['cranberries', 'https://images.pexels.com/photos/1171170/pexels-photo-1171170.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['mangosteen', 'https://images.pexels.com/photos/5945757/pexels-photo-5945757.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['rambutan', 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['almonds', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['cashews', 'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['pistachios', 'https://images.pexels.com/photos/5430892/pexels-photo-5430892.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['walnuts', 'https://images.pexels.com/photos/1295571/pexels-photo-1295571.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['raisins', 'https://images.pexels.com/photos/616404/pexels-photo-616404.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['dates', 'https://images.pexels.com/photos/259810/pexels-photo-259810.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['dried figs', 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['anjeer', 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['dried apricots', 'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['makhana', 'https://images.pexels.com/photos/5945817/pexels-photo-5945817.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['fox nuts', 'https://images.pexels.com/photos/5945817/pexels-photo-5945817.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['hazelnuts', 'https://images.pexels.com/photos/810510/pexels-photo-810510.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['pecans', 'https://images.pexels.com/photos/1295571/pexels-photo-1295571.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['brazil nuts', 'https://images.pexels.com/photos/1295571/pexels-photo-1295571.jpeg?auto=compress&cs=tinysrgb&w=600'],
    ['pine nuts', 'https://images.pexels.com/photos/1295571/pexels-photo-1295571.jpeg?auto=compress&cs=tinysrgb&w=600'],
  ]);

  const buildImageUrl = (item: StoreItem) => {
    const baseName = normalizeItemName(item.name);
    const directMatch = imageMap.get(baseName);
    if (directMatch) {
      return directMatch;
    }
    const fallbackMatch =
      Array.from(imageMap.entries()).find(([key]) => baseName.includes(key))?.[1] ?? '';
    if (fallbackMatch) {
      return fallbackMatch;
    }
    return item.image;
  };

  const handleAutoMatchImages = () => {
    let updated = 0;
    let skipped = 0;
    setCatalogDraft((prev) =>
      prev.map((item) => {
        const nextImage = buildImageUrl(item);
        if (nextImage && nextImage !== item.image) {
          updated += 1;
          return { ...item, image: nextImage };
        }
        skipped += 1;
        return item;
      })
    );
    setCatalogError(
      updated
        ? `Auto-matched ${updated} images. ${skipped} need manual review.`
        : 'No matching images found. Please update manually.'
    );
  };

  const renderCatalogueManager = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Catalogue Manager</h2>
            <p className="text-sm text-gray-600">
              Manage items and images. Prices are stored per kg.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-sm text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
              onClick={() => onInventoryUpload(catalogDraft)}
              disabled={inventorySaving || catalogDraft.length === 0}
            >
              Save catalogue
            </button>
            <button
              className="text-sm text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
              onClick={handleAutoMatchImages}
              disabled={catalogDraft.length === 0}
            >
              Auto-match images
            </button>
            <button
              className="text-sm text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
              onClick={() => setShowCatalogueManager(false)}
            >
              Back to dashboard
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              placeholder="Search by name or ID"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <select
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value as 'all' | StoreItem['category'])
            }
          >
            <option value="all">All categories</option>
            <option value="fruit">Fruit</option>
            <option value="dry">Dry fruit</option>
            <option value="combo">Combo</option>
            <option value="subscription">Subscription</option>
          </select>
          <span className="text-xs text-gray-500">
            {filteredCatalog.length} items
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-4">
            Use a stable image URL (or a path from `/public/images/products/...`).
          </p>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Add new item</h4>
            <div className="grid gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Eg. Dragon Fruit"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Image URL</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  value={newImage}
                  onChange={(event) => setNewImage(event.target.value)}
                  placeholder="/images/products/dragon-fruit.jpg"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs"
                    value=""
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value) {
                        setNewImage(value);
                      }
                    }}
                    disabled={imagesLoading || imageOptions.length === 0}
                  >
                    <option value="">
                      {imagesLoading
                        ? 'Loading image library...'
                        : imageOptions.length
                        ? 'Pick from library'
                        : 'No images found'}
                    </option>
                    {imageOptions.map((image) => (
                      <option key={image} value={image}>
                        {image}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="text-xs text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
                    onClick={async () => {
                      setImagesLoading(true);
                      setImagesError('');
                      try {
                        const images = await fetchInventoryImages();
                        setImageOptions(images);
                      } catch {
                        setImagesError('Unable to load image library.');
                      } finally {
                        setImagesLoading(false);
                      }
                    }}
                  >
                    Refresh
                  </button>
                  {imagesError && <span className="text-xs text-red-600">{imagesError}</span>}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    {newImage ? (
                      <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Preview</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Category</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value as StoreItem['category'])}
                  >
                    <option value="fruit">Fruit</option>
                    <option value="dry">Dry fruit</option>
                    <option value="combo">Combo</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Subcategory</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    value={newSubcategory ?? 'regular'}
                    onChange={(event) =>
                      setNewSubcategory(event.target.value as StoreItem['subcategory'])
                    }
                    disabled={newCategory !== 'fruit'}
                  >
                    <option value="regular">Regular</option>
                    <option value="exotic">Exotic</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Unit</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    value={newUnit}
                    onChange={(event) => setNewUnit(event.target.value as StoreItem['unit'])}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="pack">pack</option>
                    <option value="bundle">bundle</option>
                    <option value="bowl">bowl</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Price (₹ per kg)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    value={newPrice}
                    onChange={(event) => setNewPrice(event.target.value)}
                    placeholder="Eg. 180"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Tags (comma separated)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  value={newTags}
                  onChange={(event) => setNewTags(event.target.value)}
                  placeholder="daily_use, premium"
                />
              </div>
            </div>
            {catalogError && <p className="mt-2 text-xs text-red-600">{catalogError}</p>}
            <div className="mt-3 flex items-center gap-2">
              <button
                className="text-xs bg-green-600 text-white px-3 py-2 rounded-full font-semibold hover:bg-green-700 disabled:opacity-60"
                onClick={handleAddItem}
                disabled={!canAddItem}
              >
                Add item
              </button>
              <button
                className="text-xs text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50 disabled:opacity-60"
                onClick={() => onInventoryUpload(catalogDraft)}
                disabled={inventorySaving || catalogDraft.length === 0}
              >
                Save catalogue
              </button>
              <button
                className="text-xs text-red-600 border border-red-200 px-3 py-2 rounded-full hover:bg-red-50 disabled:opacity-60"
                onClick={onInventoryReset}
                disabled={inventorySaving}
              >
                Clear catalogue
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Bulk upload (CSV)</h4>
              <p className="text-xs text-gray-500 mb-3">
                Required columns: name, category, unit, price, image. Optional: subcategory, tags.
              </p>
              <input
                type="file"
                accept=".csv,text/csv"
                className="w-full text-sm"
                onChange={(event) => handleBulkFile(event.target.files?.[0] ?? null)}
                disabled={inventorySaving}
              />
              {bulkPreviewCount !== null && (
                <p className="mt-2 text-xs text-gray-600">
                  Ready to import {bulkPreviewCount} items.
                </p>
              )}
              {bulkError && <p className="mt-2 text-xs text-red-600">{bulkError}</p>}
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="text-xs bg-green-600 text-white px-3 py-2 rounded-full font-semibold hover:bg-green-700 disabled:opacity-60"
                  onClick={() => bulkItems && onInventoryUpload(bulkItems)}
                  disabled={!bulkItems || inventorySaving}
                >
                  Import catalogue
                </button>
                <span className="text-xs text-gray-500">CSV only</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredCatalog.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500 text-center">
                No items match your filters.
              </div>
            ) : (
              filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.category}
                    {item.subcategory ? ` · ${item.subcategory}` : ''} · {item.unit}
                  </p>
                  </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">₹</label>
                  <input
                    type="number"
                    className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    defaultValue={item.price}
                    min="1"
                    onBlur={(event) => handlePriceUpdate(item.id, event.target.value)}
                  />
                </div>
                <button
                  className="text-xs text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 disabled:opacity-60"
                  onClick={() => handleSaveItem(item.id)}
                  disabled={inventorySaving}
                >
                  Save
                </button>
                  <button
                    className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
          {inventoryMessage && (
            <div className="mt-3 text-xs text-gray-600">{inventoryMessage}</div>
          )}
        </div>
      </div>
    {confirmRemoveId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
          <h4 className="text-lg font-semibold text-gray-900">Remove item?</h4>
          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to remove this item from the catalogue?
          </p>
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              className="text-sm text-gray-700 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50"
              onClick={() => setConfirmRemoveId(null)}
            >
              Cancel
            </button>
            <button
              className="text-sm text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700"
              onClick={handleConfirmRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
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
      ) : showCatalogueManager ? (
        renderCatalogueManager()
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">Today’s Ops Dashboard</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
                  onClick={() => setShowCatalogueManager(true)}
                >
                  Catalogue Manager
                </button>
                <button
                  className="text-sm text-green-700 border border-green-200 px-3 py-2 rounded-full hover:bg-green-50"
                  onClick={onAdminLogout}
                >
                  Logout
                </button>
              </div>
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
          </div>
        </div>
      )}
    </main>
  );
}
