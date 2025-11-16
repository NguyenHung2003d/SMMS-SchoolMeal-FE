"use client";

import React, { useRef } from "react";
import {
  Camera,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  X,
  Edit,
  Save,
  Heart,
} from "lucide-react";
import { ALLERGY_LIST } from "@/data/nutrition/allergies";
import { StudentsInfoProps } from "@/types/student";
import { AllergyPill } from "@/utils/AllergyPill";
import toast from "react-hot-toast";

export function StudentsInfo({
  students,
  selectedStudent,
  onSelectStudent,
  onStudentInfoChange,
  onToggleAllergy,
  onToggleOther,
  onOtherAllergyChange,
  onSubmit,
  isSaving,
  otherAllergy,
  hasOtherChecked,
  onStudentAvatarChange,
}: StudentsInfoProps & { onStudentAvatarChange: (file: File) => void }) {
  const Icon = selectedStudent?.avatar || User;
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB.");
        return;
      }

      onStudentAvatarChange(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    }
  };
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };
  const handleClose = () => {
    onSelectStudent(null);
    setPreviewUrl(null);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileChange}
      />
      {!selectedStudent ? (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Danh sách học sinh
            </h2>
            <p className="text-slate-500 mt-2">
              Chọn bé để cập nhật thông tin sức khỏe và dị ứng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {students.map((st) => {
              const Icon = st.avatar || User;
              return (
                <div
                  key={st.studentId}
                  onClick={() => onSelectStudent(st)}
                  className="bg-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-transparent hover:border-blue-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800">
                        {st.fullName}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">
                        Lớp: {st.className}
                      </p>
                      {st.allergies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {st.allergies.slice(0, 2).map((a) => (
                            <span
                              key={a}
                              className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full"
                            >
                              {a}
                            </span>
                          ))}
                          {st.allergies.length > 2 && (
                            <span className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                              +{st.allergies.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Edit
                      className="text-blue-500 flex-shrink-0 mt-1"
                      size={20}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-slate-200">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Cập nhật thông tin
              </h2>
              <p className="text-slate-500 mt-1">Bé {selectedStudent.className}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-2 transition"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="flex flex-col items-center pb-8 border-b-2 border-slate-200">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex justify-center items-center shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-105">
                  {previewUrl || selectedStudent.avatarUrl ? (
                    <img
                      src={previewUrl || selectedStudent.avatarUrl || ""}
                      alt="Student Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon size={56} className="text-white" />
                  )}{" "}
                </div>
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                  <Camera size={20} />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-4 font-medium">
                Thay đổi ảnh đại diện
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Họ và tên
                </label>
                <input
                  value={selectedStudent.className}
                  disabled
                  className="w-full pl-4 pr-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg text-slate-700 cursor-not-allowed font-medium"
                />
                <p className="text-xs text-slate-500">
                  Liên hệ nhà trường để thay đổi
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Lớp
                </label>
                <input
                  value={selectedStudent.className}
                  disabled
                  className="w-full pl-4 pr-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg text-slate-700 cursor-not-allowed font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Ngày sinh
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={20}
                  />
                  <input
                    type="date"
                    name="birthdate"
                    value={selectedStudent.dateOfBirth}
                    onChange={onStudentInfoChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={selectedStudent.gender}
                  onChange={onStudentInfoChange}
                  className="w-full py-3 px-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white font-medium"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-slate-700 gap-2">
                <AlertTriangle size={16} className="text-orange-500" />
                Dị ứng
              </label>
              <div className="border-2 border-orange-300 bg-orange-50 rounded-xl p-6">
                <p className="text-sm font-medium text-slate-700 mb-4">
                  Các món dị ứng
                </p>
                <div className="flex flex-wrap gap-3 mb-5">
                  {ALLERGY_LIST.map((item) => (
                    <AllergyPill
                      key={item}
                      label={item}
                      selected={selectedStudent.allergies.includes(item)}
                      onClick={() => onToggleAllergy(item)}
                      color="black"
                    />
                  ))}
                  <AllergyPill
                    label="Khác…"
                    selected={hasOtherChecked}
                    onClick={onToggleOther}
                    color="yellow"
                  />
                </div>
                {hasOtherChecked && (
                  <div className="space-y-2 mt-4 pt-4 border-t-2 border-orange-200">
                    <label className="text-sm font-semibold text-slate-700">
                      Nhập món dị ứng khác
                    </label>
                    <input
                      value={otherAllergy}
                      onChange={(e) => onOtherAllergyChange(e.target.value)}
                      className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="Vd: Cua, tôm..."
                    />
                    <p className="text-xs text-slate-500">
                      Lưu dưới dạng: "Khác: món"
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Save size={20} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Lưu thông tin
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
