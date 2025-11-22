import { ParentAccountDto } from "./parent";
import { Student } from "./student";

export type Role = "Admin" | "Manager" | "Warden" | "Parent" | "KitchenStaff";

export interface User {
  userId: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: Role;
  schoolId: string | null;
  parentDetails: ParentAccountDto;
  children: Student[];
}

export interface AuthResponse {
  token: string | null;
  user: User 
  message: string;
  requirePasswordReset?: boolean;
}

export interface TokenPayload {
  id: string;
  role: Role;
}

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => void;
  logout: () => void;
}

export interface LoginFormData {
  PhoneOrEmail: string;
  password: string;
}
