import { axiosInstance } from "@/lib/axiosInstance";
import { UserListDto } from "@/types/user"; // Import type vừa tạo

export const userService = {
  /**
   * Lấy danh sách nhân viên (staff) của một trường
   */
  getStaffBySchool: async (schoolId: string): Promise<UserListDto[]> => {
    const res = await axiosInstance.get<UserListDto[]>(
      `/schools/${schoolId}/users/staff`
    );
    return res.data;
  },

  /**
   * Lấy danh sách phụ huynh (parent) của một trường
   */
  getParentsBySchool: async (schoolId: string): Promise<UserListDto[]> => {
    const res = await axiosInstance.get<UserListDto[]>(
      `/schools/${schoolId}/users/parents`
    );
    return res.data;
  },
};
