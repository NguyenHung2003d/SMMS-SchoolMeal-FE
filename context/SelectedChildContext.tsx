"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Student } from "@/types/student";

interface SelectedStudentContextType {
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  isInitialized: boolean;
}

const SelectedStudentContext = createContext<
  SelectedStudentContextType | undefined
>(undefined);

export function SelectedStudentProvider({ children }: { children: ReactNode }) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedStudent");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.studentId) {
          parsed.studentId = String(parsed.studentId);
        }
        setSelectedStudent(parsed);
      } catch (e) {
        console.error("Lỗi parse student từ storage", e);
        localStorage.removeItem("selectedStudent");
      }
    }
    setIsInitialized(true);
  }, []);

  const handleSetSelectedStudent = (student: Student | null) => {
    if (student) {
      const sanitizedStudent = {
        ...student,
        studentId: String(student.studentId),
      };
      setSelectedStudent(sanitizedStudent);
      localStorage.setItem("selectedStudent", JSON.stringify(sanitizedStudent));
    } else {
      setSelectedStudent(null);
      localStorage.removeItem("selectedStudent");
    }
  };

  return (
    <SelectedStudentContext.Provider
      value={{
        selectedStudent,
        setSelectedStudent: handleSetSelectedStudent,
        isInitialized,
      }}
    >
      {children}
    </SelectedStudentContext.Provider>
  );
}

export function useSelectedStudent() {
  const context = useContext(SelectedStudentContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedStudent must be used within a SelectedStudentProvider"
    );
  }
  return context;
}
