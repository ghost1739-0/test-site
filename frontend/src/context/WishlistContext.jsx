import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchWishlist, toggleWishlist } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setItems([]);
        return;
      }

      try {
        const data = await fetchWishlist();
        setItems(data);
      } catch (error) {
        setItems([]);
      }
    }

    loadWishlist();
  }, [user]);

  const value = useMemo(
    () => ({
      items,
      ids: new Set(items.map((item) => item._id)),
      toggle: async (productId) => {
        if (!user) {
          throw new Error("Login required for wishlist.");
        }
        const data = await toggleWishlist(productId);
        setItems(data.wishlist || []);
        return data;
      },
    }),
    [items, user]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider.");
  }
  return context;
}
