import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  const baseUrl ="http://localhost:5000";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
