"use client";

import { createContext, useContext, useState, useEffect, ReactNode, use } from "react";

interface GlobalSidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const GlobalSidebarContext = createContext<GlobalSidebarContextType | undefined>(undefined);

export function GlobalSidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to slim/collapsed on homepage
  const [isMounted, setIsMounted] = useState(false);

  // Load initial state from localStorage
  // NOTE: This provider does NOT depend on any API calls
  // It's pure client-side UI state management (redux-like)
  // If /users/me or any backend call fails, this still works fine
  // Auth errors are handled separately in individual pages (app/page.tsx, app/dashboard/page.tsx)
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar_collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
    setIsMounted(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMounted]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <GlobalSidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </GlobalSidebarContext.Provider>
  );
}

export function useGlobalSidebar() {
  const context = useContext(GlobalSidebarContext);
  if (context === undefined) {
    // Return default values if context is not available (e.g., during SSR)
    // This prevents errors during pre-rendering
    return {
      isCollapsed: true,
      toggleCollapse: () => {},
    };
  }
  return context;
}
