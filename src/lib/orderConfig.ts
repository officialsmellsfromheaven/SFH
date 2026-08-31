import {
  DEFAULT_SINGLE_PRODUCT_PRICING,
  DEFAULT_SINGLE_PRODUCT_SIZE_ORDER,
  type StandardBottleSize,
} from "@/lib/pricing";

export const orderConfig = {
  bottlePrices: DEFAULT_SINGLE_PRODUCT_PRICING,
  personalizationCharge: 299,
  shippingCharge: 99,
  gstPercentage: 18,
  discount: 0,
  whatsappNumber: "918087568338",
};

export type BottleSize = StandardBottleSize;

export const bottleSizes = DEFAULT_SINGLE_PRODUCT_SIZE_ORDER as BottleSize[];
