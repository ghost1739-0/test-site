import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../api/authApi";

const AUTH_TOKEN_KEY = "architect_shop_token";
const AUTH_USER_KEY = "architect_shop_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || "");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchMe();
        setUser(profile);
      } catch (error) {
        setUser(null);
        setToken("");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  const login = async (payload) => {
    const data = await loginUser(payload);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
