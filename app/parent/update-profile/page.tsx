"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useParentProfile } from "@/hooks/useParentProfile"; // Import Hook vừa tạo
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
      setIsEditingParent(false);
    } else {
      handleSave("child");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-blue-500" />
        <span className="text-blue-400 ml-2">Đang tải dữ liệu ...</span>
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
          className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
            activeTab === "parent-info"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-blue-500"
          }`}
        >
          Thông tin phụ huynh
        </button>
        <button
          onClick={() => setActiveTab("students-info")}
          className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
            activeTab === "students-info"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-blue-500"
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
