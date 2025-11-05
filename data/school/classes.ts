import { ClassItem, ClassStudent } from "@/types";
import { studentsData } from "./students";

export const initialClasses: ClassItem[] = [
  {
    id: 1,
    name: "1A",
    grade: 1,
    year: "2023-2024",
    teacherId: "1A30792C-E072-4737-A7E1-A7C84D91143A",
  },
  {
    id: 2,
    name: "2B",
    grade: 2,
    year: "2023-2024",
    teacherId: "2B40882D-F183-4848-B8E2-B7D95E22154B",
  },
  {
    id: 3,
    name: "1B",
    grade: 1,
    year: "2023-2024",
    teacherId: "3C50993E-G294-4959-C9F3-C8E06F33265C",
  },
];

export const classStudents: ClassStudent[] = [
  {
    classId: 1,
    className: "4B",
    students: studentsData.filter((s) => s.class === "4B"),
  },
  {
    classId: 2,
    className: "5A",
    students: studentsData.filter((s) => s.class === "5A"),
  },
  {
    classId: 3,
    className: "6A",
    students: studentsData.filter((s) => s.class === "6A"),
  },
  {
    classId: 4,
    className: "7A",
    students: studentsData.filter((s) => s.class === "7A"),
  },
];
