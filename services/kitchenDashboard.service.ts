import { axiosInstance } from "@/lib/axiosInstance";
import { KitchenDashboardDto } from "@/types/kitchen-dashboard";

export const kitchenDashboardService = {
  getKitchenDashboard: async (
    date?: string 
  ): Promise<KitchenDashboardDto> => {
    const res = await axiosInstance.get<KitchenDashboardDto>(
      "/kitchen/dashboard",
      {
        params: { date },
      }
    );
    return res.data;
  },
};
