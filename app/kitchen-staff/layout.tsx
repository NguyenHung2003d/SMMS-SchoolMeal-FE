"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { Sidebar } from "@/components/kitchenstaff/dashboard/Sidebar";
import { Header } from "@/components/kitchenstaff/dashboard/Header";

export default function KitchenStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header
          user={user}
          logout={logout}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="p-4 md:p-6 lg:p-8 animate-fade-in relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
