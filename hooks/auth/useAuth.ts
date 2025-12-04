import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import { useEffect } from "react";
import { useLoginMutation } from "./useLoginMutation";
import { useLogoutMutation } from "./useLogoutMutation";

export const USER_QUERY_KEY = ["user"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    throwOnError: false,
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
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(USER_QUERY_KEY, null);
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      },
    });
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
