import { axiosInstance } from "@/lib/axiosInstance";
import { LoginFormData } from "@/lib/definitions";
import { AuthResponse, User } from "@/types/auth";
import Cookies from "js-cookie";

export const authService = {
  login: async (
    data: LoginFormData,
    rememberMe: boolean = false
  ): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/Auth/login", data);
    if (res.data.token) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      const cookieOptions: Cookies.CookieAttributes = rememberMe
        ? { expires: 30, secure: true, sameSite: "Strict" }
        : { secure: true, sameSite: "Strict" };

      Cookies.set("accessToken", res.data.token, cookieOptions);
      if ((res.data as any).refreshToken) {
        Cookies.set(
          "refreshToken",
          (res.data as any).refreshToken,
          cookieOptions
        );
      }
    }
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await axiosInstance.get("/Auth/me");
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/Auth/logout");
    } catch (error) {
      console.error("Logout API error", error);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    }
  },
};
