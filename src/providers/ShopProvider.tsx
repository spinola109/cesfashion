"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import type { Product } from "@/types/product";

export type CartItem = Product & {
  quantity: number;
};

type ShopContextValue = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartReady: boolean;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "cs-fashion-cart";

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    const loadCartTimer = window.setTimeout(() => {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart) as CartItem[]);
        } catch {
          window.localStorage.removeItem(CART_STORAGE_KEY);
        }
      }

      setHasLoadedCart(true);
    }, 0);

    return () => window.clearTimeout(loadCartTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedCart]);

  function addToCart(product: Product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId: string) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function updateCartItemQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const value = {
    searchQuery,
    setSearchQuery,
    isCartReady: hasLoadedCart,
    cartItems,
    cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }

  return context;
}
