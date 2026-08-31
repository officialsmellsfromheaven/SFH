import { products, type Product } from "@/lib/data";
import comboConfigJson from "../../../config/combos.json";

const comboConfigSource = comboConfigJson as {
  version?: number;
  currency?: string;
  pricing?: {
    mode?: string;
    targetPercentage?: number | null;
    rounding?: {
      mode?: string;
      value?: number | null;
    };
  };
  combos?: ComboDefinition[];
};

export type ComboEligibility = {
  mode: "allActiveProducts" | "selectedProducts";
  productIds?: string[];
};

export type ComboReferencePricing = {
  mode: "sumOfSelectedProductPrices";
};

export type ComboPricingRule = {
  mode: "percentageBelowReference";
  targetPercentage?: number | null;
};

export type ComboRounding = {
  mode: "none" | string;
  value?: number | null;
};

export type ComboDefinition = {
  id: string;
  name: string;
  bottleSize: number;
  quantity: number;
  eligibility: ComboEligibility;
  referencePricing: ComboReferencePricing;
  pricingRule: ComboPricingRule;
  rounding: ComboRounding;
  badge?: string;
  description?: string;
  active?: boolean;
  sortOrder?: number;
};

export const comboConfig = comboConfigSource;

export function validateCombo(combo: Partial<ComboDefinition> | null | undefined): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!combo) {
    return { valid: false, errors: ["Combo is missing."] };
  }

  if (!combo.id || !String(combo.id).trim()) {
    errors.push("Missing combo ID.");
  }

  if (typeof combo.quantity !== "number" || Number.isNaN(combo.quantity) || combo.quantity <= 0) {
    errors.push("Invalid quantity.");
  }

  if (typeof combo.bottleSize !== "number" || Number.isNaN(combo.bottleSize) || combo.bottleSize <= 0) {
    errors.push("Invalid bottle size.");
  }

  if (!combo.pricingRule || combo.pricingRule.mode !== "percentageBelowReference") {
    errors.push("Missing pricing rule.");
  }

  if (
    combo.pricingRule &&
    (typeof combo.pricingRule.targetPercentage !== "number" || Number.isNaN(combo.pricingRule.targetPercentage))
  ) {
    errors.push("Invalid percentage.");
  }

  if (combo.active === false) {
    errors.push("Inactive combo.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getActiveCombos(): ComboDefinition[] {
  return (comboConfig.combos ?? [])
    .filter((combo) => combo?.active !== false)
    .filter((combo) => validateCombo(combo).valid)
    .sort((a, b) => {
      const aOrder = Number.isFinite(a.sortOrder) ? Number(a.sortOrder) : 9999;
      const bOrder = Number.isFinite(b.sortOrder) ? Number(b.sortOrder) : 9999;
      return aOrder - bOrder;
    });
}

export function getComboById(id?: string | null): ComboDefinition | undefined {
  return getActiveCombos().find((combo) => combo.id === id);
}

export function getEligibleProducts(
  combo: Partial<ComboDefinition> | null | undefined,
  productCatalog: Product[] = products
): Product[] {
  const availableProducts = productCatalog.filter((product) => product.available !== false);

  if (!combo || !combo.eligibility) {
    return availableProducts;
  }

  if (combo.eligibility.mode === "selectedProducts") {
    const selectedIds = new Set((combo.eligibility.productIds ?? []).filter(Boolean));
    return availableProducts.filter((product) => selectedIds.has(product.id));
  }

  return availableProducts;
}
