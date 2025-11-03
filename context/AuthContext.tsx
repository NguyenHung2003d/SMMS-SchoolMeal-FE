import { useAuth } from "@/hooks/auth/useAuth";
import { AuthContextProps } from "@/types/auth";
import { createContext, useContext } from "react";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/*

UI nhập phone + pass
   -> gọi AuthContext.login()
   -> AuthContext gọi useLoginMutation
   -> service gọi API /auth/login
   -> check DB -> trả token + user
   -> server set token vào cookie HTTP-only
   -> client React Query lưu user vào cache
   -> AuthContext đọc user từ React Query
   -> middleware kiểm tra token để redirect đúng role
   -> UI render theo role

*/
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
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
