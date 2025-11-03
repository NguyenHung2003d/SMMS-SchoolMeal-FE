"use client";

import { LoadingContextType } from "@/types";
import React, { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoadingState] = useState<boolean>(true);

  const setLoading = useCallback((newLoading: boolean) => {
    setLoadingState((prevLoading) => {
      if (prevLoading === newLoading) return prevLoading;
      return newLoading;
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({
      loading,
      setLoading,
    }),
    [loading, setLoading]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
