"use client";
import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext<{
  loading: boolean;
  setLoading: (v: boolean) => void;
}>({
  loading: false,
  setLoading: () => {},
});

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
