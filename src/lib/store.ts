import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  type: "product" | "combo";
  productId?: string;
  productName?: string;
  comboId?: string;
  comboName?: string;
  bottleSize?: number;
  quantity?: number;
  selectedProductIds?: string[];
  selectedProductNames?: string[];
  selectedProductImages?: string[];
  referencePrice?: number;
  discountAmount?: number;
  comboPrice?: number;
  savings?: number;
  pricingRule?: Record<string, unknown>;
  personalizationText?: string;
  personalizationType?: "Name" | "Initials" | "Short Message";
  personalizationCharge?: number;
  createdAt?: string;
};

type WishlistStore = {
  items: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  addComboItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },
      isWishlisted: (productId) => get().items.includes(productId),
    }),
    { name: "wishlist-storage" }
  )
);

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => {
        set((state) => ({ items: [...state.items, item] }));
      },
      addComboItem: (item) => {
        set((state) => ({ items: [...state.items, item] }));
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);
