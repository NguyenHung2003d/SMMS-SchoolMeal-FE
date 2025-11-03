import { useLoginMutation } from "./useLoginMutation";
import { useLogoutMutation } from "./useLogoutMutation";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/auth";
import { AxiosError } from "axios";
import { authService } from "@/services/authService";

export const USER_QUERY_KEY = ["user"] as const;

export const useAuth = () => {
  const userQuery = useQuery<User, AxiosError>({
    queryKey: USER_QUERY_KEY,
    queryFn: () => Promise.resolve(null),
    // queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  return {
    user: userQuery.data,
    isAuthenticated: !!userQuery.data,
    isLoading: userQuery.isLoading,
    error: userQuery.error,

    login: loginMutation.mutate,
    logout: logoutMutation.mutate,

    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    loginError: loginMutation.error,

    refetchUser: userQuery.refetch,
    invalidateUser: () => userQuery.refetch(),
  };
};
