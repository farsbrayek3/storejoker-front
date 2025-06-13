"use client";
import React, { createContext, useContext, useState } from "react";

type Toast = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};

const ToastContext = createContext<{
  toasts: Toast[];
  showToast: (type: Toast["type"], message: string) => void;
}>({
  toasts: [],
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500
    );
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
