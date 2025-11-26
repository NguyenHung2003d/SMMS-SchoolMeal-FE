"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useTransition,
} from "react";
import { User, Loader2 } from "lucide-react";
import { ParentAccountDto } from "@/types/parent";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { ParentInfoForm } from "./ParentInfoForm";
import { StudentsInfo } from "./StudentsInfo";
import { Student } from "@/types/student";
import { ParentInfoDisplay } from "./ParentInfoDisplay";
import axios from "axios";

export default function ParentProfileUpdate() {
  const [parentInfo, setParentInfo] = useState<ParentAccountDto | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [parentAvatarFile, setParentAvatarFile] = useState<File | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"parent-info" | "students-info">(
    "parent-info"
  );
  const [isEditingParent, setIsEditingParent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/ParentProfile/profile");

        console.log("🚀 [API Raw Data]:", res.data);

        const { children, ...parentData } = res.data;

        if (parentData.DateOfBirth || parentData.dateOfBirth) {
          parentData.dateOfBirth = new Date(
            parentData.DateOfBirth || parentData.dateOfBirth
          )
            .toISOString()
            .split("T")[0];
        }

        console.log("👤 [Parent Data Processed]:", parentData);
        setParentInfo(parentData);

        const formattedStudents = children.map((child: any) => {
          console.log("Child item raw:", child);

          return {
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
          };
        });
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
    setParentInfo((prev) => ({ ...prev, [name]: value } as ParentAccountDto));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === updatedStudent.studentId ? updatedStudent : s
      )
    );
    setSelectedStudent(updatedStudent);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!parentInfo) return;

    startTransition(async () => {
      try {
        // trên ni là parent
        if (activeTab === "parent-info") {
          let newAvatarUrl = parentInfo.avatarUrl;
          if (parentAvatarFile) {
            const avatarFormData = new FormData();
            avatarFormData.append("File", parentAvatarFile);
            const uploadRes = await axiosInstance.post(
              "/ParentProfile/upload-avatar",
              avatarFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            newAvatarUrl = uploadRes.data.avatarUrl;
          }
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
          setIsEditingParent(false);
        }

        // xử lý thông tin học sinh
        if (activeTab === "students-info" && selectedStudent) {
          let childAvatarUrl = selectedStudent.avatarUrl;
          if ((selectedStudent as any).avatarFile) {
            const childAvatarFormData = new FormData();
            childAvatarFormData.append(
              "File",
              (selectedStudent as any).avatarFile
            );

            const uploadRes = await axiosInstance.post(
              `/ParentProfile/upload-avatar/${selectedStudent.studentId}`,
              childAvatarFormData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            childAvatarUrl = uploadRes.data.avatarUrl;
          }
          const studentFormData = new FormData();
          studentFormData.append(
            "StudentId",
            selectedStudent.studentId.toString()
          );
          studentFormData.append("FullName", selectedStudent.fullName);
          studentFormData.append(
            "Relation",
            selectedStudent.relation || "Phụ huynh"
          );
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

          toast.success(
            `Đã cập nhật thông tin bé ${selectedStudent.fullName}!`
          );

          setStudents((prev) =>
            prev.map((s) =>
              s.studentId === selectedStudent.studentId
                ? { ...s, avatarUrl: childAvatarUrl }
                : s
            )
          );

          setSelectedStudent((prev) =>
            prev ? { ...prev, avatarUrl: childAvatarUrl } : null
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi lưu thông tin!");
      }
    });
  };

  const handleChildAvatarChange = (file: File) => {
    if (selectedStudent) {
      const updated = { ...selectedStudent, avatarFile: file };
      handleUpdateStudent(updated);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-blue-500" />
        <span className="text-blue-400">Đang tải dữ liệu ...</span>
      </div>
    );
  if (loadError || !parentInfo)
    return <div className="text-center py-16 text-red-500">{loadError}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý hồ sơ</h1>
      </div>

      <div className="border-b border-gray-200 mb-8 flex space-x-1">
        <button
          onClick={() => setActiveTab("parent-info")}
          className={`py-4 px-6 font-semibold border-b-2 ${
            activeTab === "parent-info"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent"
          }`}
        >
          Thông tin phụ huynh
        </button>
        <button
          onClick={() => setActiveTab("students-info")}
          className={`py-4 px-6 font-semibold border-b-2 ${
            activeTab === "students-info"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent"
          }`}
        >
          Thông tin học sinh
        </button>
      </div>

      <div className="animate-fadeIn">
        {activeTab === "parent-info" &&
          (isEditingParent ? (
            <ParentInfoForm
              parentInfo={parentInfo}
              isSaving={isSaving}
              onCancel={() => {
                setIsEditingParent(false);
                setParentAvatarFile(null);
              }}
              onInfoChange={handleParentInfoChange}
              onSubmit={handleSave}
              onAvatarChange={setParentAvatarFile}
            />
          ) : (
            <ParentInfoDisplay
              parentInfo={parentInfo}
              onEditClick={() => setIsEditingParent(true)}
            />
          ))}

        {activeTab === "students-info" && (
          <StudentsInfo
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
            onUpdateStudent={handleUpdateStudent}
            onStudentAvatarChange={handleChildAvatarChange}
            onSubmit={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
