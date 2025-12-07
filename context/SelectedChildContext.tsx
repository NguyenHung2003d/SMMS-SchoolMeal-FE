"use client";

import { Child } from "@/types/parent";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface SelectedChildContextType {
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
  isInitialized: boolean;
}

const SelectedChildContext = createContext<
  SelectedChildContextType | undefined
>(undefined);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedChild");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.studentId) {
          parsed.studentId = String(parsed.studentId);
        }
        setSelectedChild(parsed);
      } catch (e) {
        console.error("Lỗi parse student từ storage", e);
        localStorage.removeItem("selectedChild");
      }
    }
    setIsInitialized(true);
  }, []);

  const handleSetSelectedChild = (child: Child | null) => {
    if (child) {
      const sanitizedChild = { ...child, studentId: String(child.studentId) };
      setSelectedChild(sanitizedChild);
      localStorage.setItem("selectedChild", JSON.stringify(sanitizedChild));
    } else {
      setSelectedChild(null);
      localStorage.removeItem("selectedChild");
    }
  };

  return (
    <SelectedChildContext.Provider
      value={{
        selectedChild,
        setSelectedChild: handleSetSelectedChild,
        isInitialized,
      }}
    >
      {children}
    </SelectedChildContext.Provider>
  );
}

export function useSelectedChild() {
  const context = useContext(SelectedChildContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedChild must be used within a SelectedChildProvider"
    );
  }
  return context;
}
