// src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  images: string;
  price: number;
  moq: number;
  stock: number;
  selectedVariant?: string;
  quantity: number; // How many units in cart
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Computed values
  totalItems: number;
  totalPrice: number;

  // Actions
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      totalItems: 0,
      totalPrice: 0,

      // Add product to cart
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id,
          );

          let newItems: CartItem[];

          if (existingItem) {
            // If item already exists, increase quantity
            newItems = state.items.map((item) =>
              item._id === product._id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, product.stock),
                  }
                : item,
            );
          } else {
            // Add new item to cart
            newItems = [
              ...state.items,
              {
                ...product,
                quantity: Math.min(quantity, product.stock),
              },
            ];
          }

          // Calculate totals
          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const totalPrice = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      // Remove product from cart
      removeFromCart: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item._id !== productId);

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const totalPrice = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      // Update quantity of a product in cart
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            return get().removeFromCart(productId) as any;
          }

          const newItems = state.items.map((item) => {
            if (item._id === productId) {
              return {
                ...item,
                quantity: Math.min(quantity, item.stock), // Don't exceed stock
              };
            }
            return item;
          });

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const totalPrice = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      // Toggle cart sidebar/modal
      toggleCart: () => {
        set((state) => ({
          isCartOpen: !state.isCartOpen,
        }));
      },

      // Get specific cart item
      getCartItem: (productId) => {
        return get().items.find((item) => item._id === productId);
      },
    }),
    {
      name: "cart-storage", // localStorage key
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }), // Only persist these fields
    },
  ),
);
