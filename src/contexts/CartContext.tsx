import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Storage can be blocked by the browser or hold a damaged value. The cart then lasts for the visit. */
const readSavedCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const writeSavedCart = (items: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch {
    // The cart stays in memory for this visit.
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(readSavedCart);

  useEffect(() => {
    writeSavedCart(items);
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        toast.info('This package is already in your cart');
        return prev;
      }
      toast.success('Added to cart');
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Removed from cart');
  };

  // Stable, because the order confirmation page runs this from an effect that depends on it.
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
