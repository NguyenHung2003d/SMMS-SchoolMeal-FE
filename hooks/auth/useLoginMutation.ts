import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse, LoginVariables } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { USER_QUERY_KEY } from "./useAuth";
import toast from "react-hot-toast";
import { PATHS, ROLES } from "@/constants/auth";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError, LoginVariables>({
    mutationFn: ({ data }) => authService.login(data),

    onSuccess: (res) => {
      queryClient.setQueryData(USER_QUERY_KEY, res.user);

      // if (res.user) {
      //   localStorage.setItem("currentUser", JSON.stringify(res.user));
      // }

      // if (variables.rememberMe) {
      //   localStorage.setItem("rememberMe", "true");
      // } else {
      //   localStorage.removeItem("rememberMe");
      // }

      if (res.requirePasswordReset) {
        toast("Vui lòng đổi mật khẩu lần đầu", { icon: "🔑" });
        window.location.href = `/reset-first-password?phoneOrEmail=${encodeURIComponent(
          res.user.phone || res.user.email || ""
        )}`;
        return;
      }

      const { path, message } = (() => {
        switch (res.user.role) {
          case ROLES.ADMIN:
            return {
              path: PATHS.ADMIN_DASHBOARD,
              message: "Xin chào Admin! Đăng nhập hệ thống thành công.",
            };
          case ROLES.MANAGER:
            return {
              path: PATHS.MANAGER_DASHBOARD,
              message: "Chào mừng Quản lý quay trở lại!",
            };
          case ROLES.TEACHER:
            return {
              path: PATHS.WARDEN_DASHBOARD,
              message: "Xin chào Giáo viên! Chúc bạn một ngày tốt lành.",
            };
          case ROLES.KITCHEN_STAFF:
            return {
              path: PATHS.KITCHEN_DASHBOARD,
              message: "Xin chào Nhân viên bếp! Đăng nhập thành công.",
            };
          default:
            return {
              path: PATHS.PARENT_DASHBOARD,
              message: "Chào mừng Phụ huynh! Đăng nhập thành công.",
            };
        }
      })();

      toast.success(message);

      setTimeout(() => {
        window.location.href = path;
      }, 500);
    },

    onError: (error: any) => {
      let message = "Đã có lỗi xảy ra. Vui lòng thử lại.";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = "Số điện thoại/email hoặc mật khẩu không đúng.";
      } else if (error.response?.status >= 500) {
        message = "Máy chủ đang bận. Vui lòng thử lại sau vài phút.";
      } else if (!navigator.onLine) {
        message = "Không có kết nối mạng.";
      }

      toast.error(message);
    },
  });
};
