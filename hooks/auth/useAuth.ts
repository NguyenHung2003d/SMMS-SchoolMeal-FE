import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useEffect } from "react";
import { useLoginMutation } from "./useLoginMutation";
import { useLogoutMutation } from "./useLogoutMutation";

export const USER_QUERY_KEY = ["user"] as const;

export const useAuth = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const handleExpired = () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      window.location.href = "/login";
    };

    window.addEventListener("auth-session-expired", handleExpired);
    return () =>
      window.removeEventListener("auth-session-expired", handleExpired);
  }, [queryClient]);

  const login = (data: any, rememberMe: boolean = false) => {
    loginMutation.mutate({ data, rememberMe });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: userQuery.data,
    isAuthenticated: !!userQuery.data,
    isLoading: userQuery.isLoading || userQuery.isFetching,
    isError: userQuery.isError,

    login,
    logout,

    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,

    refetchUser: userQuery.refetch,
  };
};
