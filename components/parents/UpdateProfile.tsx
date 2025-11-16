"use client";

import React, {
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useTransition,
} from "react";
import { User } from "lucide-react";
import { ParentAccountDto } from "@/types/parent";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { ParentInfoForm } from "./ParentInfoForm";
import { StudentsInfo } from "./StudentsInfo";
import { Student } from "@/types/student";
import axios from "axios";

export default function ParentProfileUpdate() {
  const [parentInfo, setParentInfo] = useState<ParentAccountDto | null>(null);
  const [studentAvatarFile, setStudentAvatarFile] = useState<File | null>(null);
  const [parentAvatarFile, setParentAvatarFile] = useState<File | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"parent-info" | "students-info">(
    "parent-info"
  );

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

  const handleStudentAvatarChange = (file: File) => {
    setStudentAvatarFile(file);
    setParentAvatarFile(null); // Đảm bảo chỉ upload 1 ảnh 1 lần
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/ParentProfile/profile");
        const { children, ...parentData } = res.data;
        if (parentData.dateOfBirth) {
          parentData.dateOfBirth = new Date(parentData.dateOfBirth)
            .toISOString()
            .split("T")[0];
        }

        setParentInfo(parentData);
        setStudents(
          children.map((child: any) => ({
            ...child,
            id: child.studentId,
            name: child.fullName,
            class: child.className,
            allergies: child.allergyFoods ?? [],
            avatar: User,
            birthdate: child.birthdate ?? "",
            gender: child.gender ?? "Nam",
            bloodType: child.bloodType ?? "Không biết",
            healthNotes: child.healthNotes ?? "",
            emergencyContact: child.emergencyContact ?? "",
          }))
        );
      } catch (err) {
        console.error(err);
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

    const dtoSend = {
      FullName: parentInfo.fullName,
      Email: parentInfo.email,
      Phone: parentInfo.phone,
      AvatarUrl: parentInfo.avatarUrl,
      DateOfBirth: parentInfo.dateOfBirth,

      Children: finalStudents.map((s) => ({
        StudentId: s.studentId,
        Birthdate: s.dateOfBirth,
        Gender: s.gender,
        AllergyFoods: s.allergies,
      })),
    };

    startTransition(async () => {
      try {
        await axiosInstance.put("/ParentProfile/profile", dtoSend);
        toast.success("Đã lưu thông tin thành công!");
        console.log("Saved data:", dtoSend);
      } catch (err) {
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

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;
  if (!parentInfo) return <div className="p-6">Không thể load dữ liệu.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cập nhật hồ sơ</h1>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("parent-info")}
          className={`py-3 px-4 font-medium ${
            activeTab === "parent-info"
              ? "text-black border-b-2 border-black"
              : "text-gray-600"
          }`}
        >
          Thông tin phụ huynh
        </button>
        <button
          onClick={() => setActiveTab("students-info")}
          className={`py-3 px-4 font-medium ${
            activeTab === "students-info"
              ? "text-black border-b-2 border-black"
              : "text-gray-600"
          }`}
        >
          Thông tin học sinh
        </button>
      </div>

      {activeTab === "parent-info" && (
        <ParentInfoForm
          parentInfo={parentInfo}
          isSaving={isSaving}
          onInfoChange={handleParentInfoChange}
          onSubmit={handleSave}
          onAvatarChange={(file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setParentInfo((prev) =>
                prev ? { ...prev, avatarUrl: reader.result as string } : prev
              );
            };
            reader.readAsDataURL(file);
          }}
        />
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
  );
}
