import { axiosInstance } from "@/lib/axiosInstance";
import {
  FinanceReportDto,
  FinanceReportFilterDto,
  ReportFilterDto,
  UserReportDto,
} from "@/types/admin-report";

export const adminReportService = {
  getAllUserReports: async (): Promise<UserReportDto[]> => {
    const res = await axiosInstance.get("/Report/users");
    return res.data;
  },

  getUserReportsByFilter: async (
    filter: ReportFilterDto
  ): Promise<UserReportDto[]> => {
    const res = await axiosInstance.post("/Report/users", filter);
    return res.data;
  },

  getAllFinanceReports: async (): Promise<FinanceReportDto[]> => {
    const res = await axiosInstance.get("/Report/Finance");
    return res.data;
  },

  getFinanceReportsByFilter: async (
    filter: FinanceReportFilterDto
  ): Promise<FinanceReportDto[]> => {
    const res = await axiosInstance.post("/Report/Finance", filter);
    return res.data;
  },
};
