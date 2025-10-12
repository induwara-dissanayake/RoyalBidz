import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false); // Changed to false initially

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log("Attempting login with:", { email, password: "***" });

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response received:", response.data);

      // Backend returns { Token, User, ExpiresAt } (PascalCase)
      const {
        Token: newToken,
        User: userData,
        ExpiresAt: expiresAt,
      } = response.data;

      console.log("Extracted data:", {
        token: newToken ? "present" : "missing",
        userData,
        expiresAt,
      });

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      localStorage.setItem("tokenExpiry", expiresAt);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      console.log("Login successful, user set:", userData);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", userData);

      // Registration endpoint returns just the user, then we need to login
      const newUser = response.data;

      // After successful registration, automatically log the user in
      const loginResult = await login(userData.email, userData.password);

      if (loginResult.success) {
        return { success: true };
      } else {
        return {
          success: false,
          message:
            "Registration successful, but auto-login failed. Please login manually.",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    delete axios.defaults.headers.common["Authorization"];
  };

  const getCurrentUser = async () => {
    if (!token) return;

    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      // Only logout if the token is actually invalid (401), not for other errors
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // Check token expiry
  const isTokenExpired = () => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return false;
    return new Date() > new Date(expiry);
  };

  // Initialize user data if we have a valid token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !isTokenExpired()) {
        // Only fetch user if we have a valid token
        await getCurrentUser();
      } else if (token && isTokenExpired()) {
        // Token is expired, logout
        logout();
      }
    };

    initializeAuth();
  }, []); // Run only once on mount

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !isTokenExpired(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
