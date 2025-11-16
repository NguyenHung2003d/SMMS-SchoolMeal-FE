import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { UserListDto } from "@/types/user";
import { AxiosError } from "axios";

// Query key
export const USER_KEYS = {
  all: ["users"] as const,
  lists: (schoolId: string) => [...USER_KEYS.all, "list", schoolId] as const,
  staff: (schoolId: string) => [...USER_KEYS.lists(schoolId), "staff"] as const,
  parents: (schoolId: string) =>
    [...USER_KEYS.lists(schoolId), "parents"] as const,
};

/**
 * Hook để lấy danh sách Staff của trường
 */
export const useGetStaff = (schoolId: string) => {
  return useQuery<UserListDto[], AxiosError>({
    queryKey: USER_KEYS.staff(schoolId),
    queryFn: () => userService.getStaffBySchool(schoolId),
    enabled: !!schoolId, // Chỉ chạy query khi schoolId tồn tại
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

/**
 * Hook để lấy danh sách Parents của trường
 */
export const useGetParents = (schoolId: string) => {
  return useQuery<UserListDto[], AxiosError>({
    queryKey: USER_KEYS.parents(schoolId),
    queryFn: () => userService.getParentsBySchool(schoolId),
    enabled: !!schoolId, // Chỉ chạy query khi schoolId tồn tại
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};
