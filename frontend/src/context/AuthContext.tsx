"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  full_name?: string;
  preferred_madhhab: string;
  ui_language: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUserSettings: (updates: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("ilm_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem("ilm_token", newToken);
    setToken(newToken);
    await fetchUser(newToken);
    router.push("/chat");
  };

  const logout = () => {
    localStorage.removeItem("ilm_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const updateUserSettings = async (updates: Partial<User>) => {
    if (!token) return false;
    try {
      const response = await fetch("http://127.0.0.1:8000/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update failed:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserSettings, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
