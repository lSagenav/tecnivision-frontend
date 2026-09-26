import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number; name: string; slug: string; branchSlug?: string | null;
  imageUrl?: string | null; description?: string | null;
  selectedDescription?: string | null; selectedOption?: string | null; quantity: number;
};
export const cartItemKey = (item: Pick<CartItem, "id" | "selectedDescription" | "selectedOption">) =>
  JSON.stringify([item.id, item.selectedDescription ?? null, item.selectedOption ?? null]);
type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => boolean;
  addItems: (items: CartItem[]) => boolean;
  decreaseItem: (id: number, option?: string | null, description?: string | null) => void;
  removeItem: (id: number, option?: string | null, description?: string | null) => void;
  updateQuantity: (id: number, quantity: number, option?: string | null, description?: string | null) => void;
  clearCart: () => void; totalItems: () => number;
};
export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  addItem: item => get().addItems([item]),
  addItems: additions => {
    if (!additions.length || additions.some(item => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) return false;
    const items = [...get().items];
    if (new Set([...items, ...additions].map(item => item.branchSlug).filter(Boolean)).size > 1) return false;
    for (const item of additions) {
      const index = items.findIndex(existing => cartItemKey(existing) === cartItemKey(item));
      if (index < 0) items.push({ ...item });
      else {
        const quantity = items[index].quantity + item.quantity;
        if (quantity > 99) return false;
        items[index] = { ...items[index], quantity };
      }
    }
    if (items.length > 20) return false;
    set({ items }); return true;
  },
  decreaseItem: (id, selectedOption, selectedDescription) => {
    const key = cartItemKey({ id, selectedOption, selectedDescription });
    set(state => ({ items: state.items.map(item => cartItemKey(item) === key ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0) }));
  },
  removeItem: (id, selectedOption, selectedDescription) => {
    const key = cartItemKey({ id, selectedOption, selectedDescription });
    set(state => ({ items: state.items.filter(item => cartItemKey(item) !== key) }));
  },
  updateQuantity: (id, quantity, selectedOption, selectedDescription) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
    const key = cartItemKey({ id, selectedOption, selectedDescription });
    set(state => ({ items: state.items.map(item => cartItemKey(item) === key ? { ...item, quantity } : item) }));
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
}), { name: "tech-store-cart" }));
