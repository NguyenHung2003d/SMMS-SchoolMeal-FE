"use client";

import React, { useRef, useMemo } from "react";
import {
  Camera,
  User,
  AlertTriangle,
  X,
  Edit2,
  Save,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Baby,
  Loader2,
} from "lucide-react";
import { StudentsInfoProps } from "@/types/student";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { parentService } from "@/services/parent/parent.service";
import { Button } from "@/components/ui/button";

export function StudentsInfo({
  students,
  selectedStudent,
  onSelectStudent,
  onUpdateStudent,
  onSubmit,
  isSaving,
  onStudentAvatarChange,
}: StudentsInfoProps) {
  const Icon = selectedStudent?.avatar || User;
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: allergyList = [], isLoading: isAllergyLoading } = useQuery({
    queryKey: ["allergens", selectedStudent?.studentId],
    queryFn: () =>
      selectedStudent
        ? parentService.getAllergensByStudent(selectedStudent.studentId)
        : Promise.resolve([]),
    enabled: !!selectedStudent?.studentId,
    staleTime: 1000 * 60 * 5,
  });

  const handleInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!selectedStudent) return;
    onUpdateStudent({ ...selectedStudent, [e.target.name]: e.target.value });
  };

  const handleToggleAllergy = (item: string) => {
    if (!selectedStudent) return;
    const exists = selectedStudent.allergies.includes(item);
    const next = exists
      ? selectedStudent.allergies.filter((a) => a !== item)
      : [...selectedStudent.allergies, item];
    onUpdateStudent({ ...selectedStudent, allergies: next });
  };

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

  const handleToggleOther = () => {
    if (!selectedStudent) return;
    let next = selectedStudent.allergies.filter((a) => !a.startsWith("Khác:"));
    if (hasOtherChecked) {
      next = next.filter((a) => a !== "Khác");
    } else {
      next.push("Khác");
    }
    onUpdateStudent({ ...selectedStudent, allergies: next });
  };

  const handleOtherAllergyChange = (value: string) => {
    if (!selectedStudent) return;

    let nextAllergies = selectedStudent.allergies.filter(
      (a) => !a.startsWith("Khác:")
    );

    if (value.trim()) {
      if (!nextAllergies.includes("Khác")) {
        nextAllergies.push("Khác");
      }
      nextAllergies.push(`Khác: ${value.trim()}`);
    } else {
      if (!nextAllergies.includes("Khác")) {
        nextAllergies.push("Khác");
      }
    }

    onUpdateStudent({
      ...selectedStudent,
      allergies: nextAllergies,
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh quá lớn (>5MB).");
        return;
      }
      onStudentAvatarChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {!selectedStudent ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Baby className="text-blue-500" /> Danh sách các con
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((st) => (
              <div
                key={st.studentId}
                onClick={() => onSelectStudent(st)}
                className="group bg-white rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
                    <Edit2 size={16} />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      {st.avatarUrl ? (
                        <img
                          src={getImageUrl(st.avatarUrl)}
                          alt={st.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-300">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                      {st.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-md mt-1">
                      Lớp: {st.className}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400">
                  <span>Cập nhật hồ sơ</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Cập nhật thông tin
              </h2>
              <p className="text-gray-500 text-sm">
                Đang chỉnh sửa hồ sơ của bé{" "}
                <span className="font-semibold text-blue-600">
                  {selectedStudent.fullName}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                onSelectStudent(null);
                setPreviewUrl(null);
              }}
              className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <X size={16} />
              Quay lại
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center space-y-4 md:w-1/4">
                <div className="relative group">
                  <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl ring-2 ring-gray-100 overflow-hidden relative bg-blue-50">
                    {previewUrl || selectedStudent.avatarUrl ? (
                      <img
                        src={
                          previewUrl || getImageUrl(selectedStudent.avatarUrl)
                        }
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-200">
                        <User size={48} />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="text-white drop-shadow-md" size={32} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-white text-gray-700 p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-transform hover:scale-110"
                  >
                    <Camera size={16} />
                  </button>
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
                        value={
                          selectedStudent.dateOfBirth
                            ? selectedStudent.dateOfBirth.split("T")[0]
                            : ""
                        }
                        onChange={handleInfoChange}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none"
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

                <div className="pt-4 border-t border-gray-100">
                  <label className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                    <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
                      <AlertTriangle size={18} />
                    </div>
                    Thông tin dị ứng
                  </label>

                  <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5">
                    <p className="text-sm text-gray-500 mb-4">
                      Vui lòng chọn các loại thực phẩm mà bé bị dị ứng:
                    </p>
                    {isAllergyLoading ? (
                      <div className="flex items-center justify-center py-6 text-orange-400">
                        <Loader2 className="animate-spin mr-2" />
                        Đang tải danh sách dị ứng...
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {allergyList
                          .filter((a) => a.allergenName !== "Khác")
                          .map((allergen) => {
                            const isSelected =
                              selectedStudent.allergies.includes(
                                allergen.allergenName
                              );
                            return (
                              <Button
                                key={allergen.allergenId}
                                type="button"
                                onClick={() =>
                                  handleToggleAllergy(allergen.allergenName)
                                }
                                title={allergen.allergenInfo || ""}
                                className={`
                                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                ${
                                  isSelected
                                    ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 pl-9"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                                }
                              `}
                              >
                                {isSelected && (
                                  <CheckCircle2
                                    size={16}
                                    className="absolute left-2 top-2"
                                  />
                                )}
                                {allergen.allergenName}
                              </Button>
                            );
                          })}
                        <Button
                          type="button"
                          onClick={handleToggleOther}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all border
                            ${
                              hasOtherChecked
                                ? "bg-gray-800 text-white border-gray-900 shadow-md"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }
                          `}
                        >
                          Khác ...
                        </Button>
                      </div>
                    )}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        hasOtherChecked
                          ? "grid-rows-[1fr] opacity-100 mt-4"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <input
                          value={otherAllergy}
                          onChange={(e) =>
                            handleOtherAllergyChange(e.target.value)
                          }
                          className="w-full p-3 border border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 outline-none bg-white"
                          placeholder="Nhập tên thực phẩm bé bị dị ứng..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
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
