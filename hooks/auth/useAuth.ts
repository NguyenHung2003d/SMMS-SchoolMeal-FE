import { LoginVariables, useLoginMutation } from "./useLoginMutation";
import { useLogoutMutation } from "./useLogoutMutation";
import {
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthResponse, LoginFormData, User } from "@/types/auth";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const USER_QUERY_KEY = ["user"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const token = Cookies.get("accessToken");

  const userQuery = useQuery<User | null, AxiosError>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const token = Cookies.get("accessToken");
      if (!token) return null;
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        throw error;
      }
    },
    staleTime: 7 * 24 * 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 1;
    },
  });

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const handleLogin = (
    data: LoginFormData,
    rememberMe: boolean,
    options?: UseMutationOptions<AuthResponse, any, LoginVariables>
  ) => {
    loginMutation.mutate({ data, rememberMe }, options);
  };

  useEffect(() => {
    const handleAuthExpired = () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      router.push("/login");
    };
    window.addEventListener("auth-session-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleAuthExpired);
    };
  }, [queryClient, router]);

  return {
    token,
    user: userQuery.data,
    isAuthenticated: !!userQuery.data && !userQuery.error,
    isLoading: userQuery.isLoading,
    error: userQuery.error,

    login: handleLogin,
    logout: logoutMutation.mutate,

    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    loginError: loginMutation.error,

    refetchUser: userQuery.refetch,
    invalidateUser: () => userQuery.refetch(),
  };
};
