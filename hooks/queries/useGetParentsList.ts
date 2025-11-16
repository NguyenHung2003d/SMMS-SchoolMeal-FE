import { useQuery } from "@tanstack/react-query";
import { parentService, GetParentsParams } from "@/services/parentService";
import { GetParentsResponse } from "@/types/parent";
import { AxiosError } from "axios";

// Định nghĩa query key
export const PARENT_KEYS = {
  all: ["parents"] as const,
  lists: () => [...PARENT_KEYS.all, "list"] as const,
  // Key này sẽ thay đổi khi filter thay đổi -> tự động fetch lại
  list: (filters: GetParentsParams) =>
    [...PARENT_KEYS.lists(), filters] as const,
};

/**
 * Hook để lấy danh sách phụ huynh, có thể lọc
 * @param filters - { schoolId, classId }
 */
export const useGetParentsList = (filters: GetParentsParams) => {
  return useQuery<GetParentsResponse, AxiosError>({
    queryKey: PARENT_KEYS.list(filters),

    queryFn: () => parentService.getParentsList(filters),

    // Rất quan trọng: Chỉ chạy query khi có schoolId
    enabled: !!filters.schoolId,

    staleTime: 1000 * 60 * 5, // 5 phút cache
  });
};
