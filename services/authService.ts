import { axiosInstance } from "@/lib/axiosInstance";
import { LoginFormData } from "@/lib/definitions";
import { AuthResponse, User } from "@/types/auth";

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/Auth/login", data);
    if (res.data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.data.token);
      }
    }
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await axiosInstance.get<User>("/ParentProfile/profile");
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/Auth/logout");
    } catch (error) {
      console.error("Logout API error", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
      }
    }
  },
};
