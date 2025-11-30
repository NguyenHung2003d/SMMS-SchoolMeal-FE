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
}

const SelectedChildContext = createContext<
  SelectedChildContextType | undefined
>(undefined);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedChild");
    if (saved) {
      try {
        setSelectedChild(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi parse student từ storage", e);
      }
    }
  }, []);

  const handleSetSelectedChild = (child: Child | null) => {
    setSelectedChild(child);
    if (child) {
      localStorage.setItem("selectedChild", JSON.stringify(child));
    } else {
      localStorage.removeItem("selectedChild");
    }
  };

  return (
    <SelectedChildContext.Provider
      value={{ selectedChild, setSelectedChild: handleSetSelectedChild }}
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
