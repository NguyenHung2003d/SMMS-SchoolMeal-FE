import { axiosInstance } from "@/lib/axiosInstance";
import { GetParentsResponse } from "@/types/parent";

// Type cho các tham số query
export interface GetParentsParams {
  schoolId: string;
  classId?: string | null; // Cho phép null hoặc undefined
}

export const parentService = {
  /**
   * Lấy danh sách phụ huynh có phân trang/lọc
   * (Gọi tới [HttpGet] GetAll)
   */
  getParentsList: async ({
    schoolId,
    classId,
  }: GetParentsParams): Promise<GetParentsResponse> => {
    // Xây dựng các tham số query
    const params = new URLSearchParams();
    params.append("schoolId", schoolId);

    if (classId) {
      params.append("classId", classId);
    }

    // Gọi API (giả sử là /api/parents)
    const res = await axiosInstance.get<GetParentsResponse>("/parents", {
      params,
    });

    return res.data;
  },
};
