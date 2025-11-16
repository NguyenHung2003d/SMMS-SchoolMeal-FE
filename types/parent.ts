import { ChangeEvent, FormEvent } from "react";
export interface ChildDto {
  studentId: number;
  fullName: string;
  classId: string;
  className: string;
  avatarUrl: string;
}

export interface ParentAccountDto {
  userId: string;
  fullName: string;
  email: string | null;
  phone: string;
  isActive: boolean;
  avatarUrl: string;
  dateOfBirth: string | null;
}

export type ParentInfoFormProps = {
  parentInfo: ParentAccountDto;
  isSaving: boolean;
  onInfoChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onAvatarChange: (file: File) => void;
};
