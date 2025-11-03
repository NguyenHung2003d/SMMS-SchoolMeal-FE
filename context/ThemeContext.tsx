"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext } from "react";

export function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const ThemeContext = createContext("");
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
