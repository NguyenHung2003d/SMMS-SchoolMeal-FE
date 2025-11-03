// Các role được hỗ trợ
export type Role = "admin" | "teacher" | "student" | "parent" | "kitchenstaff";

// Thông tin user sau khi login
export interface User {
  id: string;
  role: Role;
  name: string;
}

// Response khi login thành công từ API
export interface AuthResponse {
  token: string;
  user: User;
}

// Payload được encode trong JWT
export interface TokenPayload {
  id: string;
  role: Role;
}

// Context Auth để dùng trong React Context
export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => void;
  logout: () => void;
}

// Dữ liệu form login (client -> API)
export interface LoginFormData {
  phone: string;
  password: string;
}
