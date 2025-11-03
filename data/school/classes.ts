import { ClassItem, ClassStudent } from "@/types";
import { studentsData } from "./students";

export const initialClasses: ClassItem[] = [
  {
    id: 1,
    name: "1A",
    grade: 1,
    room: "101",
    teacherName: "Nguyễn Văn A",
    year: "2023-2024",
  },
  {
    id: 2,
    name: "2B",
    grade: 2,
    room: "202",
    teacherName: "Trần Thị B",
    year: "2023-2024",
  },
  {
    id: 3,
    name: "3C",
    grade: 3,
    room: "303",
    teacherName: "Lê Văn C",
    year: "2023-2024",
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
