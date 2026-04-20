import React, { createContext, useCallback, useEffect, useState } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken);
  const [loading, setLoading] = useState(!!storedToken);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await authAPI.getMe();

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res.data.user;
      }

      return null;
    } catch (err) {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
      return;
    }

    setLoading(false);
  }, [fetchUser, token]);

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await authAPI.register(name, email, password);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res.data;
      }

      throw new Error(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await authAPI.login(email, password);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res.data;
      }

      throw new Error(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
