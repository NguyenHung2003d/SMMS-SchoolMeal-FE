import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useLogoutMutation = (
  options?: Omit<UseMutationOptions<void, AxiosError, void>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, AxiosError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      
      localStorage.removeItem("accessToken");
      
      router.push("/login");
    },
    onError: () => {
      queryClient.clear();
      localStorage.removeItem("accessToken");
      router.push("/login");
    },
    ...options,
  });
};