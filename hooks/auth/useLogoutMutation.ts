import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useLogoutMutation = (
  options?: Omit<UseMutationOptions<void, AxiosError, void>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Đăng xuất thành công!");
      queryClient.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    },
    onError: (error) => {
      console.log("Logout error:", error);
      toast.success("Đăng xuất thành công!");
      queryClient.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    },
    ...options,
  });
};
