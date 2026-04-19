import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CART_STORAGE_KEY = "architect_shop_cart";

function getInitialCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item._id === action.payload._id);

      if (existing) {
        return state.map((item) =>
          item._id === action.payload._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, action.payload.stock || 99),
              }
            : item
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item._id !== action.payload);
    case "DECREASE_ITEM":
      return state
        .map((item) =>
          item._id === action.payload
            ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
            : item
        )
        .filter((item) => item.quantity > 0);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], getInitialCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const summary = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { totalItems, totalPrice };
  }, [items]);

  const value = {
    items,
    ...summary,
    addToCart: (product) => dispatch({ type: "ADD_ITEM", payload: product }),
    removeFromCart: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    decreaseItem: (id) => dispatch({ type: "DECREASE_ITEM", payload: id }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
