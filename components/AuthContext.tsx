"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "admin" | "seller" | "buyer";
type User = {
  username: string;
  email: string;
  roles: Role[];
  buyerBalance: number;
  sellerBalance?: number;
  registeredAt: string;
  lastLogin: string;
  walletAddress?: string;
  sellerId?: number;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: User[] = [
  {
    username: "admin",
    email: "admin@site.com",
    roles: ["admin"],
    buyerBalance: 1000,
    sellerBalance: 0,
    registeredAt: "2024-01-01",
    lastLogin: "2025-06-13",
    walletAddress: "",
    sellerId: 1,
  },
  {
    username: "seller",
    email: "seller@site.com",
    roles: ["seller"],
    buyerBalance: 500,
    sellerBalance: 2000,
    registeredAt: "2024-03-15",
    lastLogin: "2025-06-13",
    walletAddress: "0xsellerwallet",
    sellerId: 2,
  },
  {
    username: "buyer",
    email: "buyer@site.com",
    roles: ["buyer"],
    buyerBalance: 250,
    registeredAt: "2024-05-10",
    lastLogin: "2025-06-13",
  },
];

function loginMock(email: string, password: string) {
  // password is always "test123" for demo
  const user = mockUsers.find((u) => u.email === email);
  if (user && password === "test123") {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
}

function logoutMock() {
  localStorage.removeItem("user");
}

function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  if (!data) return null;
  return JSON.parse(data);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = (email: string, password: string) => {
    const u = loginMock(email, password);
    setUser(u);
    return u;
  };

  const logout = () => {
    logoutMock();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
