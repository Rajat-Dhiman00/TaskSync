import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, apiError } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // null=loading, false=guest, obj=user
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("tasksync_token");
    if (!token) { setUser(false); return; }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("tasksync_token");
      setUser(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("tasksync_token", data.token);
      setUser(data.user);
      return true;
    } catch (e) { setError(apiError(e)); return false; }
  };

  const register = async (name, email, password) => {
    setError("");
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("tasksync_token", data.token);
      setUser(data.user);
      return true;
    } catch (e) { setError(apiError(e)); return false; }
  };

  const logout = () => {
    localStorage.removeItem("tasksync_token");
    setUser(false);
  };

  return (
    <AuthCtx.Provider value={{ user, error, login, register, logout, refresh, setError }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
