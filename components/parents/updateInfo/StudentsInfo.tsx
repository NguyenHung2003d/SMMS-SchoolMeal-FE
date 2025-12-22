"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Camera,
  User,
  X,
  Save,
  Calendar,
  Baby,
  ChevronRight,
} from "lucide-react";
import { StudentsInfoProps } from "@/types/student";
import { getImageUrl } from "@/lib/utils";
import { kitchenNutritionService } from "@/services/kitchenStaff/kitchenNutrion.service";
import { StudentCard } from "./StudentCard";
import { AllergyManager } from "./AllergyManager";
import { IngredientDto } from "@/types/kitchen-nutrition";

export function StudentsInfo({
  students,
  selectedStudent,
  onSelectStudent,
  onUpdateStudent,
  isSaving,
  onSubmit,
  onStudentAvatarChange,
}: StudentsInfoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IngredientDto[]>([]);
  const [allergyNote, setAllergyNote] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 1) {
        try {
          const results = await kitchenNutritionService.getIngredients(
            searchTerm
          );
          setSearchResults(results);
        } catch (error) {
          console.error("Search error", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleToggleAllergy = (name: string) => {
    if (!selectedStudent) return;
    const exists = selectedStudent.allergies.includes(name);
    const next = exists
      ? selectedStudent.allergies.filter((a) => a !== name)
      : [...selectedStudent.allergies, name];
    onUpdateStudent({ ...selectedStudent, allergies: next });
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!selectedStudent) return;
    onUpdateStudent({ ...selectedStudent, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onStudentAvatarChange(file);
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
      />

      {!selectedStudent ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Baby className="text-blue-500" /> Danh sách các con
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((st) => (
              <StudentCard
                key={st.studentId}
                student={st}
                onSelect={onSelectStudent}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Cập nhật thông tin
              </h2>
              <p className="text-gray-500 text-sm">
                Đang chỉnh sửa hồ sơ của{" "}
                <span className="text-blue-600 font-semibold">
                  {selectedStudent.fullName}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                onSelectStudent(null);
                setPreviewUrl(null);
              }}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white border px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
            >
              <X size={16} /> Quay lại
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center md:w-1/4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-blue-50 relative">
                    <img
                      src={previewUrl || getImageUrl(selectedStudent.avatarUrl)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      alt="Avatar"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="text-white" size={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      value={selectedStudent.fullName}
                      disabled
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Lớp học
                    </label>
                    <input
                      value={selectedStudent.className}
                      disabled
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3.5 top-3.5 text-gray-400"
                        size={18}
                      />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={selectedStudent.dateOfBirth?.split("T")[0] || ""}
                        onChange={handleInfoChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Giới tính
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={selectedStudent.gender || ""}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>
                          Chọn giới tính
                        </option>
                        <option value="M">Nam</option>
                        <option value="F">Nữ</option>
                      </select>
                      <div className="absolute right-4 top-4 pointer-events-none">
                        <ChevronRight
                          className="rotate-90 text-gray-400"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <AllergyManager
                  allergies={selectedStudent.allergies}
                  searchTerm={searchTerm}
                  searchResults={searchResults}
                  allergyNote={allergyNote}
                  onSearchChange={setSearchTerm}
                  onAddAllergy={handleToggleAllergy}
                  onRemoveAllergy={handleToggleAllergy}
                  onNoteChange={setAllergyNote}
                />

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
                  >
                    {isSaving ? (
                      <Save className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving ? "Đang lưu..." : "Lưu hồ sơ của bé"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
