import { useAuth } from "@/hooks/auth/useAuth";
import { AuthContextProps } from "@/types/auth";
import { createContext, useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const isLoggingOut = useRef(false);
  useEffect(() => {
    const handleSessionExpired = () => {
      if (isLoggingOut.current) {
        return;
      }
      isLoggingOut.current = true;
      console.log("AuthProvider received session-expired event. Logging out.");
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      logout();
    };
    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, [logout]);
  return (
    <AuthContext
      value={{
        user: user || null,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
