import type { Product } from "@/lib/data";
import type { ComboDefinition } from "@/lib/combo/combo-config";
import { getProductSizePrice } from "@/lib/pricing";

export type ComboPricingMetrics = {
  referencePrice: number;
  targetPercentage: number;
  discountAmount: number;
  comboPrice: number;
  savings: number;
  savingsPercentage: number;
};

export function calculateReferencePrice(combo: ComboDefinition, selectedProducts: Product[]): number {
  return selectedProducts.reduce((total, product) => total + getProductSizePrice(product, combo.bottleSize), 0);
}

export function calculateDiscountAmount(referencePrice: number, targetPercentage: number): number {
  return (referencePrice * targetPercentage) / 100;
}

export function roundComboValue(value: number, roundingMode?: string | null, roundingValue?: number | null): number {
  switch (roundingMode ?? "none") {
    case "none":
      return Number(value.toFixed(2));
    case "nearestWhole":
      return Math.round(value);
    case "nearestTen":
      return Math.round(value / (roundingValue ?? 10)) * (roundingValue ?? 10);
    default:
      return Number(value.toFixed(2));
  }
}

export function calculateComboMetrics({
  combo,
  selectedProducts,
}: {
  combo: ComboDefinition;
  selectedProducts: Product[];
}): ComboPricingMetrics {
  const referencePrice = calculateReferencePrice(combo, selectedProducts);
  const targetPercentage = Number(combo.pricingRule?.targetPercentage ?? 0);
  const discountAmount = calculateDiscountAmount(referencePrice, targetPercentage);
  const rawComboPrice = referencePrice - discountAmount;
  const comboPrice = roundComboValue(
    rawComboPrice,
    combo.rounding?.mode,
    combo.rounding?.value
  );
  const savings = referencePrice - comboPrice;
  const savingsPercentage = referencePrice > 0 ? (savings / referencePrice) * 100 : 0;

  return {
    referencePrice,
    targetPercentage,
    discountAmount: roundComboValue(discountAmount, combo.rounding?.mode, combo.rounding?.value),
    comboPrice,
    savings,
    savingsPercentage,
  };
}
