"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define a context and provider for loading state
type LoadingContextType = {
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface RootLayoutProps {
  children: ReactNode; // Typing the children prop correctly
}
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children } : RootLayoutProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
