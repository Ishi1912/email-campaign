import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/client";
import { decodeJwtPayload } from "../api/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("signal_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("signal_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) localStorage.setItem("signal_token", token);
    else localStorage.removeItem("signal_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("signal_user", JSON.stringify(user));
    else localStorage.removeItem("signal_user");
  }, [user]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.login({ email, password });
      const payload = decodeJwtPayload(data.token);
      setToken(data.token);
      setUser({ id: payload?.id, email: payload?.email || email });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign in. Check your details and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError("");
    try {
      await authApi.register({ name, email, password });
      return await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Try a different email.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
