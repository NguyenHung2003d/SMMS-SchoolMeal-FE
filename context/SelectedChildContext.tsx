"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Student } from "@/types/student";

interface SelectedChildContextType {
  selectedChild: Student | null;
  setSelectedChild: (child: Student | null) => void;
}

const SelectedChildContext = createContext<
  SelectedChildContextType | undefined
>(undefined);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<Student | null>(null);

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

  const handleSetSelectedChild = (child: Student | null) => {
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
