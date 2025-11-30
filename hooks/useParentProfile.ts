"use client";

import { useState, useEffect, useTransition, ChangeEvent } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { ParentAccountDto } from "@/types/parent";
import { Student } from "@/types/student";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export const useParentProfile = () => {
  const [parentInfo, setParentInfo] = useState<ParentAccountDto | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [parentAvatarFile, setParentAvatarFile] = useState<File | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/ParentProfile/profile");
        const { children, ...parentData } = res.data;

        if (parentData.DateOfBirth || parentData.dateOfBirth) {
          parentData.dateOfBirth = new Date(
            parentData.DateOfBirth || parentData.dateOfBirth
          )
            .toISOString()
            .split("T")[0];
        }
        setParentInfo(parentData);

        const formattedStudents = children.map((child: any) => ({
          ...child,
          studentId: child.studentId,
          fullName: child.fullName,
          className: child.className || child.ClassName || "",
          allergies: child.allergyFoods ?? [],
          avatar: User, 
          dateOfBirth:
            child.DateOfBirth || child.dateOfBirth
              ? new Date(child.DateOfBirth || child.dateOfBirth)
                  .toISOString()
                  .split("T")[0]
              : "",
          gender: child.gender || child.Gender || "M",
          relation: child.relation || child.Relation || "Phụ huynh",
        }));
        setStudents(formattedStudents);
      } catch (err) {
        console.error("❌ [Fetch Error]:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn.");
          window.location.href = "/login";
          return;
        }
        setLoadError("Lỗi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleParentInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParentInfo((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const saveParentProfile = async () => {
    if (!parentInfo) return;

    try {
      let newAvatarUrl = parentInfo.avatarUrl;

      if (parentAvatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("File", parentAvatarFile);
        const uploadRes = await axiosInstance.post(
          "/ParentProfile/upload-avatar",
          avatarFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        newAvatarUrl = uploadRes.data.avatarUrl;
      }

      // 2. Update Info
      const profileFormData = new FormData();
      profileFormData.append("FullName", parentInfo.fullName);
      profileFormData.append("Email", parentInfo.email);
      profileFormData.append("Phone", parentInfo.phone);
      if (parentInfo.dateOfBirth) {
        profileFormData.append("DateOfBirth", parentInfo.dateOfBirth);
      }
      profileFormData.append("ChildrenJson", "[]");

      await axiosInstance.put("/ParentProfile/profile", profileFormData);

      toast.success("Cập nhật thông tin phụ huynh thành công!");
      
      setParentInfo((prev) => ({
        ...prev!,
        avatarUrl: newAvatarUrl,
      }));
      setParentAvatarFile(null);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật thông tin phụ huynh!");
      return false;
    }
  };

  const handleUpdateStudentLocal = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === updatedStudent.studentId ? updatedStudent : s
      )
    );
    setSelectedStudent(updatedStudent);
  };

  const handleChildAvatarChange = (file: File) => {
    if (selectedStudent) {
      const updated = { ...selectedStudent, avatarFile: file };
      handleUpdateStudentLocal(updated);
    }
  };

  const saveStudentProfile = async () => {
    if (!selectedStudent) return;

    try {
      let childAvatarUrl = selectedStudent.avatarUrl;

      const avatarFile = (selectedStudent as any).avatarFile;
      if (avatarFile) {
        const childAvatarFormData = new FormData();
        childAvatarFormData.append("File", avatarFile);

        const uploadRes = await axiosInstance.post(
          `/ParentProfile/upload-avatar/${selectedStudent.studentId}`,
          childAvatarFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        childAvatarUrl = uploadRes.data.avatarUrl;
      }

      // 2. Update Info con
      const studentFormData = new FormData();
      studentFormData.append("StudentId", selectedStudent.studentId.toString());
      studentFormData.append("FullName", selectedStudent.fullName);
      studentFormData.append("Relation", selectedStudent.relation || "Phụ huynh");
      
      if (selectedStudent.dateOfBirth) {
        studentFormData.append("DateOfBirth", selectedStudent.dateOfBirth);
      }
      if (selectedStudent.gender) {
        studentFormData.append("Gender", selectedStudent.gender);
      }
      selectedStudent.allergies.forEach((food, index) => {
        studentFormData.append(`AllergyFoods[${index}]`, food);
      });

      await axiosInstance.put("/ParentProfile/child", studentFormData);

      toast.success(`Đã cập nhật thông tin bé ${selectedStudent.fullName}!`);

      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === selectedStudent.studentId
            ? { ...s, avatarUrl: childAvatarUrl }
            : s
        )
      );
      
      // Update selected item
      setSelectedStudent((prev) =>
        prev ? { ...prev, avatarUrl: childAvatarUrl } : null
      );
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu thông tin học sinh!");
      return false;
    }
  };

  const handleSave = (type: "parent" | "child") => {
    startTransition(async () => {
      if (type === "parent") {
        await saveParentProfile();
      } else {
        await saveStudentProfile();
      }
    });
  };

  return {
    parentInfo,
    students,
    selectedStudent,
    isLoading,
    loadError,
    isSaving,
    
    setSelectedStudent,
    setParentAvatarFile,
    
    handleParentInfoChange,
    handleUpdateStudentLocal,
    handleChildAvatarChange,
    handleSave,
  };
};