"use client";

import React, { useRef, useMemo } from "react";
import {
  Camera,
  User,
  AlertTriangle,
  X,
  Edit,
  Save,
  Calendar,
} from "lucide-react";
import { StudentsInfoProps } from "@/types/student";
import { AllergyPill } from "@/helpers";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/utils";
import { ALLERGY_LIST } from "@/data";

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
    let next = selectedStudent.allergies.filter((a) => !a.startsWith("Khác:"));
    if (value.trim()) {
      if (!next.includes("Khác")) next.push("Khác");
      next.push(`Khác: ${value.trim()}`);
    }
    onUpdateStudent({ ...selectedStudent, allergies: next });
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
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {!selectedStudent ? (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {students.map((st) => (
              <div
                key={st.studentId}
                onClick={() => onSelectStudent(st)}
                className="bg-white rounded-xl p-5 cursor-pointer hover:shadow-lg border-2 border-transparent hover:border-blue-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden border-2 border-white">
                    {st.avatarUrl ? (
                      <img
                        src={getImageUrl(st.avatarUrl)}
                        alt={st.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{st.fullName}</h3>
                    <p className="text-sm text-slate-500">
                      Lớp: {st.className}
                    </p>
                  </div>
                  <Edit className="text-blue-500" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-slate-200">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Cập nhật thông tin
              </h2>
              <p className="text-slate-500">Bé {selectedStudent.fullName}</p>
            </div>
            <button
              onClick={() => {
                onSelectStudent(null);
                setPreviewUrl(null);
              }}
              className="p-2 hover:bg-slate-200 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="flex flex-col items-center pb-8 border-b-2 border-slate-200">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex justify-center items-center shadow-xl overflow-hidden">
                  {previewUrl || selectedStudent.avatarUrl ? (
                    <img
                      src={previewUrl || getImageUrl(selectedStudent.avatarUrl)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon size={56} className="text-white" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full hover:scale-110 transition"
                >
                  <Camera size={20} />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Thay đổi ảnh đại diện
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">
                  Họ và tên
                </label>
                <input
                  value={selectedStudent.fullName}
                  disabled
                  className="w-full p-3 bg-slate-100 border-2 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Lớp</label>
                <input
                  value={selectedStudent.className}
                  disabled
                  className="w-full p-3 bg-slate-100 border-2 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700">
                  Ngày sinh
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={20}
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={selectedStudent.dateOfBirth}
                    onChange={handleInfoChange}
                    className="w-full pl-12 p-3 border-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={selectedStudent.gender || ""}
                  onChange={handleInfoChange}
                  className="w-full p-3 border-2 rounded-lg bg-white"
                >
                  <option value="" disabled>
                    Chọn giới tính
                  </option>
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 font-semibold text-slate-700">
                <AlertTriangle className="text-orange-500" size={16} /> Dị ứng
              </label>
              <div className="border-2 border-orange-300 bg-orange-50 rounded-xl p-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  {ALLERGY_LIST.map((item) => (
                    <AllergyPill
                      key={item}
                      label={item}
                      selected={selectedStudent.allergies.includes(item)}
                      onClick={() => handleToggleAllergy(item)}
                      color="black"
                    />
                  ))}
                  <AllergyPill
                    label="Khác…"
                    selected={hasOtherChecked}
                    onClick={handleToggleOther}
                    color="yellow"
                  />
                </div>
                {hasOtherChecked && (
                  <div className="mt-4 border-t-2 border-orange-200 pt-4">
                    <input
                      value={otherAllergy}
                      onChange={(e) => handleOtherAllergyChange(e.target.value)}
                      className="w-full p-3 border-2 rounded-lg focus:border-orange-500"
                      placeholder="Vd: Cua, tôm..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Save className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save /> Lưu thông tin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
