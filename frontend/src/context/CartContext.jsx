import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const EMPTY = { items: [], total: 0, item_count: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setCart(EMPTY);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart/");
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/add/", {
      product: productId,
      quantity,
    });
    setCart(data);
  };

  const updateItem = async (productId, quantity) => {
    const { data } = await api.post("/cart/update_item/", {
      product: productId,
      quantity,
    });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.post("/cart/remove/", { product: productId });
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.post("/cart/clear/");
    setCart(data);
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, load, addToCart, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
