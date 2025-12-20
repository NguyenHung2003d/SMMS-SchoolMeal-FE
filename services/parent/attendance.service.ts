import { axiosInstance } from "@/lib/axiosInstance";
import { AttendanceRequestDto, AttendanceResponseDto } from "@/types/parent";

export const attendanceService = {
  getHistory: async (studentId: string) => {
    const res = await axiosInstance.get<{
      records: AttendanceResponseDto[];
    }>(`/Attendance/student/${studentId}`);
    return res.data;
  },

  submitLeave: async (payload: AttendanceRequestDto) => {
    const res = await axiosInstance.post("/Attendance", payload);
    return res.data;
  },
};
