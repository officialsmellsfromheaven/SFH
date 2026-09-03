import type { CartItem } from "./store";
import type { WhatsAppCustomer, CartTotals } from "./orderMessaging";

export type PendingOrder = {
  orderNumber: string;
  customer: WhatsAppCustomer;
  items: CartItem[];
  summary?: Partial<CartTotals>;
  createdAt: number;
};

const STORAGE_KEY = "sfh-pending-whatsapp-order";

export function savePendingOrder(order: PendingOrder) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

export function getPendingOrder(): PendingOrder | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingOrder;

    if (!parsed?.orderNumber || !parsed?.customer || !Array.isArray(parsed.items)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPendingOrder() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
