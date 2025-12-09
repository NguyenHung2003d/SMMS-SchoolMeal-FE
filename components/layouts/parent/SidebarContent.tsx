"use client";

import React, { useEffect, useState } from "react";
import { User, Loader2, AlertCircle, CheckCircle2, Baby } from "lucide-react";
import { Student } from "@/types/student";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/auth/useAuth";
import { useSelectedStudent } from "@/context/SelectedChildContext";

function useStudentData() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      setIsLoadingStudents(true);
      return;
    }
    if (user) {
      async function fetchStudentData() {
        try {
          setIsLoadingStudents(true);
          setStudentError(null);
          const res = await axiosInstance.get("/ParentProfile/profile");
          const children = res.data.children || [];

          const mappedStudents: Student[] = children.map((child: any) => ({
            studentId: String(child.studentId),
            fullName: child.fullName,
            className: child.className,
            avatarUrl: child.avatarUrl || "",
            avatar: User,
            gender: child.gender ?? "Nam",
            dateOfBirth: child.birthdate
              ? new Date(child.birthdate).toISOString().split("T")[0]
              : "",
            allergies: child.allergyFoods ?? [],
            status: "active",
            parent: {
              name: "",
              phone: "",
              email: "",
              hasAccount: false,
            },
            relation: child.relation ?? "Con",
          }));

          setStudents(mappedStudents);
        } catch (error) {
          console.error(error);
          toast.error("Không thể tải danh sách con.");
          setStudentError("Lỗi tải danh sách con. Vui lòng F5.");
        } finally {
          setIsLoadingStudents(false);
        }
      }
      fetchStudentData();
    } else {
      setIsLoadingStudents(false);
      setStudents([]);
    }
  }, [isAuthLoading, user]);

  return { students, isLoadingStudents, studentError };
}

export function SidebarContent() {
  const { students, isLoadingStudents, studentError } = useStudentData();
  const { selectedStudent, setSelectedStudent } = useSelectedStudent();

  useEffect(() => {
    if (!isLoadingStudents && students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
    }
  }, [students, isLoadingStudents, selectedStudent, setSelectedStudent]);

  const renderAllergies = (allergies: string[]) => {
    if (!allergies || allergies.length === 0) return null;

    const displayItems = allergies.slice(0, 2).join(", ");
    const remainingCount = allergies.length - 2;

    return (
      <div className="flex items-start gap-1.5 mt-2 bg-red-50 px-2 py-1 rounded-md border border-red-100 w-fit">
        <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
        <p className="text-xs font-medium text-red-600 truncate max-w-[180px]">
          Dị ứng: {displayItems}
          {remainingCount > 0 ? `, ... (+${remainingCount})` : ""}
        </p>
      </div>
    );
  };

  if (isLoadingStudents) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin relative" />
        </div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="m-4 flex flex-col items-center justify-center py-6 px-4 space-y-3 bg-red-50 rounded-xl border border-red-200 shadow-sm">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-700 text-center font-medium">
          {studentError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-white border border-red-300 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition shadow-sm"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-3">
          <Baby className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Chưa có thông tin học sinh</p>
        <p className="text-xs text-gray-400 mt-1">
          Vui lòng liên hệ nhà trường để cập nhật.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-1">
      {students.map((child) => {
        const avatarSrc = child.avatarUrl || null;
        const isSelected =
          selectedStudent &&
          String(selectedStudent.studentId) === String(child.studentId);

        return (
          <div
            key={child.studentId}
            onClick={() => setSelectedStudent(child)}
            className={`
              group relative p-3 rounded-xl cursor-pointer transition-all duration-200 border
              ${
                isSelected
                  ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20"
                  : "bg-white border-transparent hover:border-blue-200 hover:shadow-md hover:bg-gray-50"
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 text-blue-500">
                <CheckCircle2
                  size={18}
                  fill="currentColor"
                  className="text-white"
                />
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div
                className={`
                relative w-12 h-12 rounded-full flex-shrink-0 border-2 overflow-hidden
                ${
                  isSelected
                    ? "border-blue-200"
                    : "border-gray-100 group-hover:border-blue-100"
                }
              `}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={child.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-gray-50 -z-10`}
                >
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p
                  className={`font-bold text-sm truncate pr-6 ${
                    isSelected ? "text-blue-700" : "text-gray-800"
                  }`}
                >
                  {child.fullName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    Lớp: {child.className}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    • {child.relation}
                  </span>
                </div>

                {child.allergies &&
                  child.allergies.length > 0 &&
                  renderAllergies(child.allergies)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
