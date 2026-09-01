import { BottleSize, orderConfig } from "./orderConfig";

export type OrderTotals = {
  unitPrice: number;
  subtotal: number;
  personalizationCharge: number;
  shipping: number;
  gst: number;
  discount: number;
  grandTotal: number;
};

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
  const unitPrice = unitPriceOverride ?? orderConfig.bottlePrices[bottleSize];
  const subtotal = unitPrice * quantity;
  const personalizationCharge = hasPersonalization
    ? orderConfig.personalizationCharge
    : 0;
  const shipping = orderConfig.shippingCharge;
  const discount = orderConfig.discount;
  const taxableAmount = Math.max(
    0,
    subtotal + personalizationCharge + shipping - discount,
  );
  const gst = Math.round((taxableAmount * orderConfig.gstPercentage) / 100);

  return {
    unitPrice,
    subtotal,
    personalizationCharge,
    shipping,
    gst,
    discount,
    grandTotal: taxableAmount + gst,
  };
}
