"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { Child } from "@/types";

interface SelectedChildContextType {
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
}

const SelectedChildContext = createContext<
  SelectedChildContextType | undefined
>(undefined);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  return (
    <SelectedChildContext value={{ selectedChild, setSelectedChild }}>
      {children}
    </SelectedChildContext>
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
