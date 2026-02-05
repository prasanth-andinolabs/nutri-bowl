import type { StoreItem } from '../types';

/**
 * Format amount with respect to unit for display (e.g. "500 gm", "1 kg", "1 pack").
 * Uses weightGrams when present; otherwise shows "1 {unit}" with unit label (gm for g).
 */
export function formatAmountWithUnit(item: StoreItem): string {
  if (item.weightGrams != null && item.weightGrams > 0) {
    return item.weightGrams >= 1000
      ? `${item.weightGrams / 1000} kg`
      : `${item.weightGrams} gm`;
  }
  const u = item.unit;
  if (u === 'g') return 'gm';
  if (u === 'kg') return '1 kg';
  if (u === 'pack') return '1 pack';
  if (u === 'bundle') return '1 bundle';
  if (u === 'bowl') return '1 bowl';
  return u;
}

/**
 * Format a weight in grams for display (e.g. "250 gm", "1 kg").
 */
export function formatWeightFromGrams(weightGrams: number): string {
  return weightGrams >= 1000 ? `${weightGrams / 1000} kg` : `${weightGrams} gm`;
}

/**
 * Format price with amount for display. Omits " / 1 kg" when amount is 1 kg.
 */
export function formatPriceWithAmount(price: number, amountLabel: string): string {
  if (amountLabel === '1 kg') {
    return `₹${price}`;
  }
  return `₹${price} / ${amountLabel}`;
}
