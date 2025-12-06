import { axiosInstance } from "@/lib/axiosInstance";
import { UpdateAccountRequest } from "@/types/auth";
import {
  CreateAccountRequest,
  ManagerOverviewDto,
  RecentPurchaseDto,
} from "@/types/manager";

export const managerService = {
  getOverview: async (): Promise<ManagerOverviewDto> => {
    const res = await axiosInstance.get<ManagerOverviewDto>(
      "/ManagerHome/overview"
    );
    return res.data;
  },

  getRecentPurchases: async (
    take: number = 5
  ): Promise<RecentPurchaseDto[]> => {
    const res = await axiosInstance.get<RecentPurchaseDto[]>(
      `/ManagerHome/recent-purchases?take=${take}`
    );
    return res.data;
  },

  getStaffList: async (keyword: string, role: string) => {
    let url = "/ManagerStaff/staff";
    if (keyword.trim()) {
      url = `/ManagerStaff/search?keyword=${encodeURIComponent(keyword)}`;
    } else if (role !== "all") {
      url = `/ManagerStaff/filter-by-role?role=${role}`;
    }
    const res = await axiosInstance.get(url);
    return res.data.data || [];
  },

  createStaff: async (data: CreateAccountRequest) => {
    return axiosInstance.post("/ManagerStaff/create", data);
  },

  updateStaff: async (id: string, data: UpdateAccountRequest) => {
    return axiosInstance.put(`/ManagerStaff/${id}`, data);
  },

  changeStatus: async (id: string, newStatus: boolean) => {
    return axiosInstance.patch(
      `/ManagerStaff/${id}/status?isActive=${newStatus}`
    );
  },
  deleteStaff: async (id: string) => {
    return axiosInstance.delete(`/ManagerStaff/${id}`);
  },
};
