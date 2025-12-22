import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  unit: string;
}

interface DbCartItem {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  price: string;
  image: string | null;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load cart items from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      // Load from localStorage for guest users
      const saved = localStorage.getItem('cart');
      setItems(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  }, [user]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user && items.length >= 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.product_id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        quantity: item.quantity,
        unit: item.unit,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cart items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: CartItem) => {
    if (!user) {
      // Guest user - use localStorage
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        }
        return [...prev, item];
      });
      return;
    }

    // Authenticated user - use database
    try {
      const { data: existing } = await (supabase as any)
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', item.id)
        .maybeSingle();

      if (existing) {
        const { error } = await (supabase as any)
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('user_id', user.id)
          .eq('product_id', item.id);

        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            unit: item.unit,
          });

        if (error) throw error;
      }

      await loadCartFromDatabase();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (id: string) => {
    if (!user) {
      // Guest user - use localStorage
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    // Authenticated user - use database
    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;
      await loadCartFromDatabase();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    if (!user) {
      // Guest user - use localStorage
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      return;
    }

    // Authenticated user - use database
    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;
      await loadCartFromDatabase();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Guest user - use localStorage
      setItems([]);
      return;
    }

    // Authenticated user - use database
    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
