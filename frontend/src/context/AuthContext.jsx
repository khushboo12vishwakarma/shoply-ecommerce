import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login/", { email, password });
    persist(data);
    return data.user;
  };

  const register = async (payload) => {
    await api.post("/auth/register/", payload);
    // auto-login after successful registration
    return login(payload.email, payload.password);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/profile/");
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Keep profile in sync on first load if logged in.
  useEffect(() => {
    if (localStorage.getItem("access")) {
      setLoading(true);
      refreshProfile()
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
