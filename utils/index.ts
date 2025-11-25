import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export interface DecodeToken {
  SchoolId?: string;
  schoolId?: string;
  sub?: string;
  [key: string]: any;
}

export const getSchoolId = () => {
  const token = Cookies.get("accessToken");
  if (!token) return;
  try {
    const decoded = jwtDecode<DecodeToken>(token);
    return decoded.SchoolId || decoded.schoolId || "";
  } catch (error) {
    console.error("Lỗi decode token:", error);
    return "";
  }
};
