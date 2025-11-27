import { axiosInstance } from "@/lib/axiosInstance";

export const adminDashboardService = {
  getOverview: async () => {
    const res = await axiosInstance.get("/admin/dashboard/overview");
    console.log("Dashboard Overview Data:", res.data);
    return res.data;
  },
};
