import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { USER_QUERY_KEY } from "./useAuth";

export const useLogoutMutation = (
  options?: Omit<UseMutationOptions<void, AxiosError, void>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    },
    onError: (error) => {
      console.log("Logout error:", error);
      queryClient.setQueryData(USER_QUERY_KEY, null);
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    },
    ...options,
  });
};
