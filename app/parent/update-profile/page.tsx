"use client";

import React, { useState } from "react";
import { Loader2, UserCircle, Users } from "lucide-react";
import { useParentProfile } from "@/hooks/useParentProfile";
import { ParentInfoForm } from "@/components/parents/updateInfo/ParentInfoForm";
import { ParentInfoDisplay } from "@/components/parents/updateInfo/ParentInfoDisplay";
import { StudentsInfo } from "@/components/parents/updateInfo/StudentsInfo";

export default function ParentProfileUpdate() {
  const {
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
  } = useParentProfile();

  const [activeTab, setActiveTab] = useState<"parent-info" | "students-info">(
    "parent-info"
  );
  const [isEditingParent, setIsEditingParent] = useState(false);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "parent-info") {
      handleSave("parent");
    } else {
      handleSave("child");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
        <span className="text-gray-500 font-medium">
          Đang tải dữ liệu hồ sơ...
        </span>
      </div>
    );

  if (loadError || !parentInfo)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 shadow-sm">
          {loadError || "Không tìm thấy thông tin."}
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Quản lý hồ sơ
        </h1>
        <p className="text-gray-500 mt-2">
          Cập nhật thông tin phụ huynh và hồ sơ sức khỏe của con.
        </p>
      </div>

      <div className="flex justify-center sm:justify-start mb-8">
        <div className="bg-gray-100/80 p-1.5 rounded-2xl inline-flex shadow-inner">
          <button
            onClick={() => setActiveTab("parent-info")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === "parent-info"
                ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            <UserCircle size={18} />
            Thông tin Phụ huynh
          </button>
          <button
            onClick={() => setActiveTab("students-info")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === "students-info"
                ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            <Users size={18} />
            Thông tin Học sinh
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              onSubmit={onFormSubmit}
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
            onUpdateStudent={handleUpdateStudentLocal}
            onStudentAvatarChange={handleChildAvatarChange}
            onSubmit={onFormSubmit}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
