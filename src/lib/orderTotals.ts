import type { Product } from "./data";
import type { CartItem } from "./store";
import { getComboById } from "./combo/combo-config";
import { calculateComboMetrics } from "./combo/combo-pricing";
import {
  orderConfig,
  type BottleSize,
  type PersonalizationType,
} from "./orderConfig";
import { getProductSizeEntries, getProductSizePrice, normalizeSizeLabel } from "./pricing";
import { products } from "./data";

export type OrderLine = {
  item: CartItem;
  productPrice: number;
  personalizationType?: PersonalizationType;
  personalizationText: string;
  personalizationCharge: number;
  lineTotal: number;
  quantity: number;
};

export type OrderTotals = {
  productTotal: number;
  personalizationTotal: number;
  subtotal: number;
  discount: number;
  shipping: number;
  gst: number;
  gstRate: number;
  grandTotal: number;
  items: OrderLine[];
  unitPrice?: number;
  personalizationCharge: number;
};

export function roundCurrency(value: number): number {
  return Number((Number.isFinite(value) ? value : 0).toFixed(2));
}

export function getPersonalizationPrice(type?: string | null): number {
  if (!type || !(type in orderConfig.personalizationPricing)) return 0;
  return orderConfig.personalizationPricing[type as PersonalizationType];
}

function validQuantity(value: unknown): number {
  const quantity = Number(value ?? 1);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new Error("Quantity must be a whole number between 1 and 100.");
  }
  return quantity;
}

export function calculateCartPricing(
  items: CartItem[] = [],
  catalog: Product[] = products,
): OrderTotals {
  let productTotal = 0;
  let personalizationTotal = 0;
  let subtotal = 0;
  let discount = 0;
  const lines: OrderLine[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") throw new Error("One of the cart items is invalid.");
    const quantity = validQuantity(item.quantity);

    if (item.type === "product") {
      const product = catalog.find((entry) => entry.id === item.productId);
      if (!product) throw new Error("One of the selected products could not be found.");
      const requestedSize = normalizeSizeLabel(item.bottleSize);
      if (requestedSize && !getProductSizeEntries(product).some((entry) => entry.size === requestedSize)) {
        throw new Error("The selected bottle size is invalid.");
      }
      const productPrice = roundCurrency(getProductSizePrice(product, item.bottleSize));
      if (productPrice <= 0) throw new Error("The selected bottle size is invalid.");
      const text = String(item.personalizationText ?? "").trim();
      const type = text ? item.personalizationType : undefined;
      if (text && !getPersonalizationPrice(type)) {
        throw new Error("The selected personalization type is invalid.");
      }
      const personalizationCharge = roundCurrency(getPersonalizationPrice(type) * quantity);
      const lineProductTotal = roundCurrency(productPrice * quantity);
      const lineTotal = roundCurrency(lineProductTotal + personalizationCharge);
      productTotal += lineProductTotal;
      personalizationTotal += personalizationCharge;
      subtotal += lineTotal;
      lines.push({ item, productPrice, personalizationType: type, personalizationText: text, personalizationCharge, lineTotal, quantity });
      continue;
    }

    if (item.type === "combo") {
      const combo = getComboById(item.comboId);
      if (!combo) throw new Error("One of the selected combos could not be found.");
      const selectedIds = Array.isArray(item.selectedProductIds) ? item.selectedProductIds : [];
      const selectedProducts = catalog.filter((product) => selectedIds.includes(product.id));
      if (!selectedProducts.length) throw new Error("A selected combo is missing valid products.");
      const metrics = calculateComboMetrics({ combo, selectedProducts });
      const comboPrice = roundCurrency(metrics.comboPrice);
      const comboDiscount = roundCurrency(metrics.discountAmount);
      const reference = roundCurrency(metrics.referencePrice);
      subtotal += reference;
      discount += comboDiscount;
      lines.push({ item, productPrice: roundCurrency(metrics.comboPrice), personalizationText: "", personalizationCharge: 0, lineTotal: comboPrice, quantity });
      continue;
    }

    throw new Error("An item in the cart has an unsupported type.");
  }

  productTotal = roundCurrency(productTotal);
  personalizationTotal = roundCurrency(personalizationTotal);
  subtotal = roundCurrency(subtotal);
  discount = roundCurrency(discount);
  const netSubtotal = roundCurrency(Math.max(0, subtotal - discount));
  const shipping = netSubtotal >= orderConfig.freeShippingThreshold ? 0 : orderConfig.shippingCharge;
  const taxableAmount = roundCurrency(netSubtotal + shipping);
  const gst = roundCurrency((taxableAmount * orderConfig.gstPercentage) / 100);
  const grandTotal = roundCurrency(taxableAmount + gst);

  return {
    productTotal,
    personalizationTotal,
    subtotal,
    discount,
    shipping,
    gst,
    gstRate: orderConfig.gstPercentage,
    grandTotal,
    items: lines,
    unitPrice: lines.length === 1 ? lines[0].productPrice : undefined,
    personalizationCharge: personalizationTotal,
  };
}

export function calculateOrderTotals({
  bottleSize,
  quantity,
  hasPersonalization,
  unitPrice: unitPriceOverride,
}: {
  bottleSize: BottleSize;
  quantity: number;
  hasPersonalization: boolean;
  unitPrice?: number;
}): OrderTotals {
  const item: CartItem = {
    id: "preview",
    type: "product",
    productId: "__preview__",
    bottleSize: Number.parseInt(bottleSize, 10),
    quantity,
    personalizationType: hasPersonalization ? "Name" : undefined,
    personalizationText: hasPersonalization ? "preview" : "",
  };
  const previewProduct = {
    id: "__preview__",
    price: unitPriceOverride ?? orderConfig.bottlePrices[bottleSize],
    sizes: [{ size: bottleSize, price: unitPriceOverride ?? orderConfig.bottlePrices[bottleSize] }],
  } as Product;
  return calculateCartPricing([item], [previewProduct]);
}
