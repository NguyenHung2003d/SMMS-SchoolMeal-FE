import { LucideIcon } from "lucide-react";

export interface Student {
  studentId: string;
  fullName: string;
  avatar?: LucideIcon;
  avatarUrl: string;
  gender: string;
  className: string;
  parent: {
    name: string;
    phone: string;
    email: string;
    hasAccount: boolean;
  };
  status: "active" | "inactive";
  allergies: string[];
  dateOfBirth: string;
  relation: string;
  avatarFile?: File;
}

export type StudentsInfoProps = {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
  onUpdateStudent: (student: Student) => void;
  onStudentAvatarChange: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
};
