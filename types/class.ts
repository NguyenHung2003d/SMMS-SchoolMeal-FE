import { Student } from "./student";

export type ClassStudent = {
  classId: number;
  className: string;
  students: Student[];
};

export type ClassItem = {
  id: number;
  name: string;
  grade: number;
  year: string;
  teacherId: string;
};