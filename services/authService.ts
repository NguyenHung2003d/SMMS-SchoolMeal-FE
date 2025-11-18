import { axiosInstance } from "@/lib/axiosInstance";
import { LoginFormData } from "@/lib/definitions";
import { AuthResponse, User } from "@/types/auth";

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/Auth/login", data);
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await axiosInstance.get<User>("/ParentProfile/profile");
    return res.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/Auth/logout", {});
  },
};
