"use client";

import { useState, useEffect, useTransition, ChangeEvent } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { ParentAccountDto } from "@/types/parent";
import { Student } from "@/types/student";
import toast from "react-hot-toast";
import axios from "axios";

const getAvatarUrl = (url: string | null | undefined) => {
  if (!url) return undefined;
  if (
    url.startsWith("http") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  return url;
};

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
        parentData.avatarUrl = getAvatarUrl(
          parentData.avatarUrl || parentData.AvatarUrl
        );
        setParentInfo(parentData);

        const formattedStudents = children.map((child: any) => ({
          ...child,
          studentId: child.studentId,
          fullName: child.fullName,
          className: child.className || child.ClassName || "",
          allergies: child.allergyFoods ?? [],
          avatarUrl: getAvatarUrl(child.avatarUrl || child.AvatarUrl),
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

      const formData = new FormData();
      formData.append("FullName", parentInfo.fullName);
      formData.append("Email", parentInfo.email);
      formData.append("Phone", parentInfo.phone);

      if (parentInfo.dateOfBirth) {
        formData.append("DateOfBirth", parentInfo.dateOfBirth);
      }
      if (newAvatarUrl) {
        formData.append("AvatarUrl", newAvatarUrl);
      }

      formData.append("ChildrenJson", "[]");

      await axiosInstance.put("/ParentProfile/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      const previewUrl = URL.createObjectURL(file);
      const updated = {
        ...selectedStudent,
        avatarFile: file,
        avatarUrl: previewUrl,
      };
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

      const formData = new FormData();
      formData.append("StudentId", selectedStudent.studentId.toString());
      formData.append("FullName", selectedStudent.fullName);
      formData.append("Relation", selectedStudent.relation || "Phụ huynh");

      if (selectedStudent.dateOfBirth) {
        formData.append("DateOfBirth", selectedStudent.dateOfBirth);
      }
      if (selectedStudent.gender) {
        formData.append("Gender", selectedStudent.gender);
      }
      if (childAvatarUrl) {
        formData.append("AvatarUrl", childAvatarUrl);
      }

      selectedStudent.allergies.forEach((food, index) => {
        formData.append(`AllergyFoods[${index}]`, food);
      });

      await axiosInstance.put("/ParentProfile/child", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Đã cập nhật thông tin bé ${selectedStudent.fullName}!`);

      const updatedStudentClean = {
        ...selectedStudent,
        avatarUrl: childAvatarUrl,
      };
      delete (updatedStudentClean as any).avatarFile;

      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === selectedStudent.studentId ? updatedStudentClean : s
        )
      );

      setSelectedStudent(updatedStudentClean);
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
