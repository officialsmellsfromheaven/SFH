import pricingConfig from "../../config/pricing.json";
import type { Product } from "@/lib/data";

const pricingDefinition = pricingConfig as {
  defaultSingleProductPricing: Record<string, number>;
  defaultSingleProductSizeOrder: string[];
};

export const DEFAULT_SINGLE_PRODUCT_PRICING = pricingDefinition.defaultSingleProductPricing as {
  "20ml": number;
  "30ml": number;
  "50ml": number;
  "100ml": number;
};

export const DEFAULT_SINGLE_PRODUCT_SIZE_ORDER = pricingDefinition.defaultSingleProductSizeOrder as Array<
  keyof typeof DEFAULT_SINGLE_PRODUCT_PRICING
>;

export type StandardBottleSize = keyof typeof DEFAULT_SINGLE_PRODUCT_PRICING;

export function normalizeSizeLabel(size: string | number | null | undefined): string {
  if (size === null || size === undefined) return "";

  const raw = String(size).trim();
  if (!raw) return "";

  const digits = raw.match(/\d+/);
  if (digits) {
    return `${digits[0]}ml`;
  }

  return raw.toLowerCase();
}

export function getDefaultPriceForSize(size: string | number | null | undefined): number {
  const normalized = normalizeSizeLabel(size);
  const matched = DEFAULT_SINGLE_PRODUCT_PRICING[normalized as StandardBottleSize];
  return Number.isFinite(matched) ? Number(matched) : 0;
}

export function getProductSizeEntries(
  product?: Pick<Product, "sizes"> | null
): Array<{ size: string; price: number }> {
  const entries = Array.isArray(product?.sizes) ? product.sizes : [];
  const normalizedEntries = entries
    .filter((entry) => !!entry && !!entry.size)
    .map((entry) => {
      const size = normalizeSizeLabel(entry.size);
      const price = Number(entry.price);
      return {
        size,
        price: Number.isFinite(price) && price > 0 ? price : getDefaultPriceForSize(size),
      };
    });

  const orderedEntries: Array<{ size: string; price: number }> = [];
  const seen = new Set<string>();

  for (const size of DEFAULT_SINGLE_PRODUCT_SIZE_ORDER) {
    const match = normalizedEntries.find((entry) => entry.size === size);
    const resolved = match ?? { size, price: getDefaultPriceForSize(size) };
    orderedEntries.push(resolved);
    seen.add(size);
  }

  for (const entry of normalizedEntries) {
    if (seen.has(entry.size)) continue;
    orderedEntries.push(entry);
    seen.add(entry.size);
  }

  return orderedEntries;
}

export function getProductSizePrice(
  product: Pick<Product, "sizes" | "price"> | null | undefined,
  size: string | number | null | undefined
): number {
  const normalized = normalizeSizeLabel(size);

  if (normalized) {
    const exactMatch = getProductSizeEntries(product).find((entry) => entry.size === normalized);
    if (exactMatch) return exactMatch.price;
  }

  const defaultPrice = getDefaultPriceForSize(normalized);
  if (defaultPrice > 0) return defaultPrice;

  const topLevelPrice = Number(product?.price);
  return Number.isFinite(topLevelPrice) && topLevelPrice > 0 ? topLevelPrice : 0;
}

export function getLowestProductPrice(product: Pick<Product, "sizes" | "price"> | null | undefined): number {
  const entries = getProductSizeEntries(product);
  if (entries.length === 0) {
    const topLevelPrice = Number(product?.price);
    return Number.isFinite(topLevelPrice) && topLevelPrice > 0 ? topLevelPrice : 0;
  }

  return Math.min(...entries.map((entry) => entry.price));
}

export function normalizeProductPricing(product: Partial<Product> | null | undefined): Product {
  const baseProduct = { ...(product ?? {}) } as Product;
  const sizeEntries = getProductSizeEntries(baseProduct);
  const fallbackPrice = sizeEntries[0]?.price ?? getDefaultPriceForSize("20ml");

  baseProduct.sizes = sizeEntries;

  const explicitTopLevelPrice = Number(baseProduct.price);
  const hasCustomTopLevelPrice = Number.isFinite(explicitTopLevelPrice)
    && explicitTopLevelPrice > 0
    && explicitTopLevelPrice !== 999;

  baseProduct.price = hasCustomTopLevelPrice ? explicitTopLevelPrice : fallbackPrice;

  return baseProduct;
}
