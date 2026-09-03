import {
  DEFAULT_SINGLE_PRODUCT_PRICING,
  DEFAULT_SINGLE_PRODUCT_SIZE_ORDER,
  type StandardBottleSize,
} from "@/lib/pricing";

export const orderConfig = {
  bottlePrices: DEFAULT_SINGLE_PRODUCT_PRICING,
  personalizationPricing: {
    Name: 99,
    Initials: 99,
    "Short Message": 99,
  } as const,
  personalizationCharge: 99,
  shippingCharge: 99,
  freeShippingThreshold: 999,
  gstPercentage: 18,
  discount: 0,
  whatsappNumber: "918087568338",
};

export type BottleSize = StandardBottleSize;
export type PersonalizationType = keyof typeof orderConfig.personalizationPricing;

export const bottleSizes = DEFAULT_SINGLE_PRODUCT_SIZE_ORDER as BottleSize[];
