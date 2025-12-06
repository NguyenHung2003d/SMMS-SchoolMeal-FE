import { axiosInstance } from "@/lib/axiosInstance";
import { ManagerOverviewDto } from "@/types/manager";

export const managerDashboardService = {
  getOverview: async () => {
    const res = await axiosInstance.get<ManagerOverviewDto>(
      "/ManagerHome/overview"
    );
    return res.data;
  },
};
