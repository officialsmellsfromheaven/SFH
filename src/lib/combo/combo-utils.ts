import type { Product } from "@/lib/data";
import type { ComboDefinition } from "@/lib/combo/combo-config";
import type { ComboPricingMetrics } from "@/lib/combo/combo-pricing";

export function getRequiredSelectionCount(combo: ComboDefinition): number {
  return Number(combo.quantity ?? 0);
}

export function selectionIsComplete(combo: ComboDefinition, selectedProducts: Product[]): boolean {
  return selectedProducts.length >= getRequiredSelectionCount(combo);
}

export function getRemainingSelectionCount(combo: ComboDefinition, selectedProducts: Product[]): number {
  return Math.max(0, getRequiredSelectionCount(combo) - selectedProducts.length);
}

export function buildComboCartItem({
  combo,
  selectedProducts,
  metrics,
}: {
  combo: ComboDefinition;
  selectedProducts: Product[];
  metrics: ComboPricingMetrics;
}) {
  return {
    id: `${combo.id}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    type: "combo" as const,
    comboId: combo.id,
    comboName: combo.name,
    bottleSize: combo.bottleSize,
    quantity: combo.quantity,
    selectedProductIds: selectedProducts.map((product) => product.id),
    selectedProductNames: selectedProducts.map((product) => product.name),
    selectedProductImages: selectedProducts.map((product) => product.thumbnail || product.images?.[0] || ""),
    referencePrice: metrics.referencePrice,
    discountAmount: metrics.discountAmount,
    comboPrice: metrics.comboPrice,
    savings: metrics.savings,
    pricingRule: combo.pricingRule,
    createdAt: new Date().toISOString(),
  };
}
