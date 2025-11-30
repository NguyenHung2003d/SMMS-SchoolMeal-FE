import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLogoutMutation = (
  options?: Omit<UseMutationOptions<void, AxiosError, void>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, AxiosError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Đăng xuất thành công!");
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      console.log("Logout error:", error);
      toast.success("Đăng xuất thành công!");
      queryClient.clear();
      router.push("/login");
    },
    ...options,
  });
};
