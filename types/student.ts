import { LucideIcon } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";

export interface Student {
  studentId: number;
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
  dateOfBirth: string
}

export type StudentsInfoProps = {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
  onStudentInfoChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onToggleAllergy: (item: string) => void;
  onToggleOther: () => void;
  onOtherAllergyChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isSaving: boolean;
  otherAllergy: string;
  hasOtherChecked: boolean;
};