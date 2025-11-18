"use client";

import React, {
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useTransition,
} from "react";
import { User, Loader2, AlertCircle } from "lucide-react";
import { ParentAccountDto } from "@/types/parent";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { ParentInfoForm } from "./ParentInfoForm";
import { StudentsInfo } from "./StudentsInfo";
import { Student } from "@/types/student";
import axios from "axios";
import { ParentInfoDisplay } from "./ParentInfoDisplay";
import { convertFileToBase64 } from "@/helpers";

export default function ParentProfileUpdate() {
  const [parentInfo, setParentInfo] = useState<ParentAccountDto | null>(null);
  const [studentAvatarFile, setStudentAvatarFile] = useState<File | null>(null);
  const [parentAvatarFile, setParentAvatarFile] = useState<File | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"parent-info" | "students-info">(
    "parent-info"
  );
  const [isEditingParent, setIsEditingParent] = useState(false);

  const otherAllergy = useMemo(() => {
    if (!selectedStudent) return "";
    const found = selectedStudent.allergies.find((a) => a.startsWith("Khác:"));
    return found ? found.replace("Khác:", "").trim() : "";
  }, [selectedStudent]);

  const hasOtherChecked = useMemo(() => {
    if (!selectedStudent) return false;
    return (
      selectedStudent.allergies.includes("Khác") ||
      selectedStudent.allergies.some((a) => a.startsWith("Khác:"))
    );
  }, [selectedStudent]);

  const handleParentInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParentInfo((prev) => ({ ...prev, [name]: value } as ParentAccountDto));
  };

  const handleStudentInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!selectedStudent) return;
    const { name, value } = e.target;
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };

  const handleToggleAllergy = (item: string) => {
    if (!selectedStudent) return;
    const exists = selectedStudent.allergies.includes(item);
    const next = exists
      ? selectedStudent.allergies.filter((a) => a !== item)
      : [...selectedStudent.allergies, item];
    setSelectedStudent({ ...selectedStudent, allergies: next });
  };

  const handleToggleOther = () => {
    if (!selectedStudent) return;
    let next = selectedStudent.allergies.filter((a) => !a.startsWith("Khác:"));
    if (hasOtherChecked) {
      next = next.filter((a) => a !== "Khác");
    } else {
      next.push("Khác");
    }
    setSelectedStudent({ ...selectedStudent, allergies: next });
  };

  const handleOtherAllergyChange = (value: string) => {
    if (!selectedStudent) return;
    let next = selectedStudent.allergies.filter((a) => !a.startsWith("Khác:"));
    if (value.trim()) {
      if (!next.includes("Khác")) next.push("Khác");
      next.push(`Khác: ${value.trim()}`);
    }
    setSelectedStudent({ ...selectedStudent, allergies: next });
  };

  const handleParentAvatarChange = (file: File) => {
    setParentAvatarFile(file);
    setStudentAvatarFile(null);
  };

  const handleStudentAvatarChange = (file: File) => {
    setStudentAvatarFile(file);
    setParentAvatarFile(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const res = await axiosInstance.get("/ParentProfile/profile");
        console.log("API Response:", res.data);
        const { children, ...parentData } = res.data;
        const rawParentDob = parentData.dateOfBirth || parentData.DateOfBirth;
        if (rawParentDob) {
          parentData.dateOfBirth = new Date(rawParentDob)
            .toISOString()
            .split("T")[0];
        }

        setParentInfo(parentData);
        setStudents(
          children.map((child: any) => {
            let formattedDateOfBirth = "";
            const rawChildDob = child.dateOfBirth || child.DateOfBirth;
            if (rawChildDob) {
              formattedDateOfBirth = new Date(rawChildDob)
                .toISOString()
                .split("T")[0];
            }
            const rawGender = child.gender || child.Gender;
            const genderValue = rawGender ? rawGender : "M";

            return {
              ...child,
              id: child.studentId,
              name: child.fullName,
              class: child.className,
              allergies: child.allergyFoods ?? [],
              avatar: User,
              DateOfBirth: formattedDateOfBirth,
              gender: genderValue,
            };
          })
        );
      } catch (err) {
        console.error(err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
          return;
        }
        setLoadError("Không thể tải dữ liệu hồ sơ. Vui lòng thử lại.");
        toast.error("Không thể tải dữ liệu hồ sơ.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!parentInfo) return;

    const finalStudents = selectedStudent
      ? students.map((s) =>
          s.studentId === selectedStudent.studentId ? selectedStudent : s
        )
      : students;

    setStudents(finalStudents);
    startTransition(async () => {
      try {
        let parentAvatarUrl = parentInfo.avatarUrl;
        if (parentAvatarFile) {
          const formData = new FormData();
          formData.append("file", parentAvatarFile);
          const uploadToast = toast.loading("Đang tải lên ảnh đại diện...");
          const uploadRes = await axiosInstance.post(
            "/ParentProfile/upload-avatar",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          parentAvatarUrl = uploadRes.data.avatarUrl;
          toast.dismiss(uploadToast);
        }
        const childrenDto = await Promise.all(
          finalStudents.map(async (s) => {
            const childPayload: any = {
              StudentId: s.studentId,
              DateOfBirth: s.DateOfBirth,
              Gender: s.gender,
              AllergyFoods: s.allergies,
            };
            if (
              selectedStudent &&
              s.studentId === selectedStudent.studentId &&
              studentAvatarFile
            ) {
              const base64Data = await convertFileToBase64(studentAvatarFile);
              childPayload.AvatarFileName = studentAvatarFile.name;
              childPayload.AvatarFileData = base64Data;
            }
            return childPayload;
          })
        );

        const dtoSend = {
          FullName: parentInfo.fullName,
          Email: parentInfo.email,
          Phone: parentInfo.phone,
          AvatarUrl: parentAvatarUrl,
          DateOfBirth: parentInfo.dateOfBirth,
          Children: childrenDto,
        };

        await axiosInstance.put("/ParentProfile/profile", dtoSend);

        toast.success("Đã lưu thông tin thành công!");
        console.log("Saved data:", dtoSend);
        setParentInfo(
          (pre) =>
            ({
              ...pre,
              avatarUrl: parentAvatarUrl,
            } as ParentAccountDto)
        );
        setStudentAvatarFile(null);
        setParentAvatarFile(null);
        setIsEditingParent(false);
      } catch (err) {
        toast.dismiss();
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message || "Lỗi không xác định";
          toast.error(errorMessage);
        } else {
          toast.error("Lỗi khi lưu thông tin!");
        }
        console.error("Lỗi khi lưu:", err);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (loadError || !parentInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 p-6 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-red-700 font-medium text-center">
          {loadError || "Không thể load dữ liệu."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Quản lý hồ sơ cá nhân
        </h1>
        <p className="text-gray-600 mt-2">
          Cập nhật thông tin phụ huynh và học sinh
        </p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("parent-info")}
            className={`py-4 px-6 font-semibold text-base border-b-2 transition-all ${
              activeTab === "parent-info"
                ? "text-blue-600 border-b-blue-600"
                : "text-gray-600 border-b-transparent hover:text-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={20} />
              Thông tin phụ huynh
            </div>
          </button>
          <button
            onClick={() => setActiveTab("students-info")}
            className={`py-4 px-6 font-semibold text-base border-b-2 transition-all ${
              activeTab === "students-info"
                ? "text-blue-600 border-b-blue-600"
                : "text-gray-600 border-b-transparent hover:text-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={20} />
              Thông tin học sinh ({students.length})
            </div>
          </button>
        </div>
      </div>

      <div className="animate-fadeIn">
        {activeTab === "parent-info" && (
          <>
            {isEditingParent ? (
              <ParentInfoForm
                parentInfo={parentInfo}
                isSaving={isSaving}
                onCancel={() => setIsEditingParent(false)}
                onInfoChange={handleParentInfoChange}
                onSubmit={handleSave}
                onAvatarChange={handleParentAvatarChange}
              />
            ) : (
              <ParentInfoDisplay
                parentInfo={parentInfo}
                onEditClick={() => setIsEditingParent(true)}
              />
            )}
          </>
        )}

        {activeTab === "students-info" && (
          <StudentsInfo
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
            onStudentInfoChange={handleStudentInfoChange}
            onToggleAllergy={handleToggleAllergy}
            onToggleOther={handleToggleOther}
            onOtherAllergyChange={handleOtherAllergyChange}
            onSubmit={handleSave}
            isSaving={isSaving}
            otherAllergy={otherAllergy}
            hasOtherChecked={hasOtherChecked}
            onStudentAvatarChange={handleStudentAvatarChange}
          />
        )}
      </div>
    </div>
  );
}
