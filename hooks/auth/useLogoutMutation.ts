import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authService } from "@/services/authService";
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
      console.log("Logout success. Clearing cache and redirecting.");
      toast.success("Đăng xuất thành công!");
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      console.log(
        "Logout API failed. Clearing cache and redirecting anyway.",
        error.message
      );
      toast.error(
        "Có lỗi khi đăng xuất, bạn đã được đưa về trang login."
      );
      queryClient.clear();
      router.push("/login");
    },
    ...options,
  });
};
