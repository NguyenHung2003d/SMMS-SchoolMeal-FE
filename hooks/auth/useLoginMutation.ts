import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AuthResponse, User } from "@/types/auth";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";
import { USER_QUERY_KEY } from "./useAuth";
import { LoginFormData } from "@/lib/definitions";

export type LoginVariables = {
  data: LoginFormData;
  rememberMe?: boolean;
};

export const useLoginMutation = (
  options?: Omit<
    UseMutationOptions<AuthResponse, AxiosError, LoginVariables>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError, LoginVariables>({
    mutationFn: ({ data, rememberMe }) => authService.login(data, rememberMe),

    onSuccess: (data) => {
      const user: User = data.user;
      queryClient.setQueryData<User>(USER_QUERY_KEY, user);
    },
    onError: (error) => {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
      console.error("Login failed:", error);
    },
    ...options,
  });
};
