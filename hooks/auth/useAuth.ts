import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import { useEffect } from "react";
import { useLoginMutation } from "./useLoginMutation";
import { useLogoutMutation } from "./useLogoutMutation";

export const USER_QUERY_KEY = ["user"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  const userQuery = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const user = await authService.getCurrentUser();
        // if (user) {
        //   localStorage.setItem("currentUser", JSON.stringify(user));
        // }
        return user;
      } catch (error) {
        // localStorage.removeItem("currentUser");
        throw error;
      }
    },
    enabled: true,
    retry: false,
    staleTime: 7 * 24 * 60 * 60 * 1000,
  });

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const handleExpired = () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      // localStorage.removeItem("currentUser");
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
        // localStorage.removeItem("currentUser");
        queryClient.setQueryData(USER_QUERY_KEY, null);
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
    logout: logout,

    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,

    refetchUser: userQuery.refetch,
  };
};
