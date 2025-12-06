"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

const routes: Record<string, string> = {
  register: "/parent/register-meal",
  profile: "/parent/update-profile",
  health: "/parent/health",
  menu_and_feedback: "/parent/menu_and_feedback",
  invoice: "/parent/invoice",
  leave: "/parent/leave",
  gallery: '/parent/student-images'
};

export function useParentNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (pathname === "/parent" && !isAuthLoading) {
      router.push(routes.register);
    }
  }, [pathname, router, isAuthLoading]);

  const activeTab =
    Object.keys(routes).find((key) => pathname.includes(routes[key])) ||
    "register";

  const handleTabClick = (tabId: string) => {
    if (routes[tabId]) {
      router.push(routes[tabId]);
    }
  };

  return { activeTab, handleTabClick };
}
