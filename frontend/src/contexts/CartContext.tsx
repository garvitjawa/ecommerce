import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiService from '../services/api';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await apiService.getCart();
      setCartItems(cartData as CartItem[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch cart data',
      );
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await apiService.addToCart(productId);
      // Refresh cart after adding
      await refreshCart();
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await apiService.removeFromCart(productId);
      // Refresh cart after removing
      await refreshCart();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    cartItems,
    loading,
    error,
    refreshCart,
    addToCart,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
