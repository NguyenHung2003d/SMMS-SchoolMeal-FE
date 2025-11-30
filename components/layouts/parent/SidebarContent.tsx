"use client";

import React, { useEffect, useState } from "react";
import { User, Loader2, AlertCircle } from "lucide-react";
import { useSelectedChild } from "@/context/SelectedChildContext";
import { Student } from "@/types/student";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/auth/useAuth";

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
            id: child.studentId,
            studentId: child.studentId,
            name: child.fullName,
            fullName: child.fullName,
            class: child.className,
            className: child.className,
            avatarUrl: child.avatarUrl,
            allergies: child.allergyFoods ?? [],
            avatar: User,
            birthdate: child.birthdate
              ? new Date(child.birthdate).toISOString().split("T")[0]
              : "",
            gender: child.gender ?? "Nam",
            bloodType: child.bloodType ?? "Không biết",
            healthNotes: child.healthNotes ?? "",
            emergencyContact: child.emergencyContact ?? "",
            status: "active",
            parent: { name: "", phone: "", email: "", hasAccount: false },
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
  const { selectedChild, setSelectedChild } = useSelectedChild();

  if (isLoadingStudents) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-500">Đang tải danh sách con...</p>
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-700 text-center">{studentError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Chưa có con nào được thêm
      </div>
    );
  }

  return (
    <div className="space-y-3" suppressHydrationWarning>
      {students.map((child) => {
        const avatarSrc = child.avatarUrl || null;
        const isSelected = selectedChild?.studentId === child.studentId;
        const handleClick = () => {
          if (isSelected) {
            setSelectedChild(null);
          } else {
            setSelectedChild(child);
          }
        };
        return (
          <div
            key={child.studentId}
            onClick={handleClick}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              isSelected
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
            }`}
            suppressHydrationWarning
          >
            <div
              className="flex items-center space-x-3"
              suppressHydrationWarning
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={child.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-gray-400" />
              )}
              <div className="flex-1" suppressHydrationWarning>
                <p className="font-semibold text-gray-800">{child.fullName}</p>
                <p className="text-sm text-gray-600">{child.className}</p>
                {child.allergies && child.allergies.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Dị ứng: {child.allergies.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}