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

export const getWardenIdFromToken = (): string | null => {
  const token = Cookies.get("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Token Payload:", payload); // <--- Bật log này lên để xem key thật
    return payload.nameid || payload.sub || null;
  } catch {
    return null;
  }
};