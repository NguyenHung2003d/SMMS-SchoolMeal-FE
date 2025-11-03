"use client";

import React, { useMemo, useState, ChangeEvent, FormEvent } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Save,
  AlertTriangle,
  Check,
  X,
  Edit,
  Square,
  CheckSquare,
} from "lucide-react";
import { Child, ParentInfo } from "@/types";
import { ALLERGY_LIST } from "@/data";

/** Một "pill" chọn dị ứng dùng icon Lucide + nền màu */
function AllergyPill({
  label,
  selected,
  onClick,
  color = "black",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: "black" | "yellow";
}) {
  const isYellow = color === "yellow";
  const base =
    "px-3 py-1 rounded-md border-2 transition-colors inline-flex items-center gap-2 select-none";

  const cls = isYellow
    ? selected
      ? `${base} bg-yellow-400 text-black border-yellow-500`
      : `${base} bg-yellow-100 text-yellow-800 border-yellow-400`
    : selected
    ? `${base} bg-black text-white border-black`
    : `${base} bg-white text-black border-black`;

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      aria-pressed={selected}
    >
      {selected ? (
        <CheckSquare
          size={18}
          className={isYellow ? "text-black" : "text-white"}
        />
      ) : (
        <Square
          size={18}
          className={isYellow ? "text-yellow-700" : "text-black"}
        />
      )}
      <span className="text-sm">{label}</span>
    </button>
  );
}

export default function ParentProfileUpdate() {
  /** ========== Parent state ========== */
  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0912345678",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    idNumber: "079123456789",
    relationship: "Cha",
    emergencyContact: "0987654321 (Nguyễn Thị Bình - Mẹ)",
  });

  /** ========== Children state ========== */
  const [children, setChildren] = useState<Child[]>([
    {
      id: 1,
      name: "Nguyễn Minh An",
      class: "3A",
      avatar: User,
      birthdate: "15/08/2015",
      gender: "Nam",
      bloodType: "A+",
      allergies: ["Đậu phộng", "Hải sản"],
      healthNotes: "Hen suyễn nhẹ, cần mang theo ống hít khi vận động mạnh",
      emergencyContact: "0912345678 (Cha), 0987654321 (Mẹ)",
    },
    {
      id: 2,
      name: "Nguyễn Thu Hà",
      class: "1B",
      avatar: User,
      birthdate: "20/10/2017",
      gender: "Nữ",
      bloodType: "O+",
      allergies: ["Sữa"],
      healthNotes: "Không có vấn đề sức khỏe đặc biệt",
      emergencyContact: "0912345678 (Cha), 0987654321 (Mẹ)",
    },
  ]);

  /** ========== UI state ========== */
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<"parent-info" | "children-info">(
    "parent-info"
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  /** ========== Derived: other allergy text of selected child ========== */
  const otherAllergy = useMemo(() => {
    if (!selectedChild) return "";
    const found = selectedChild.allergies.find((a) => a.startsWith("Khác:"));
    return found ? found.replace("Khác:", "").trim() : "";
  }, [selectedChild]);

  const hasOtherChecked = useMemo(() => {
    if (!selectedChild) return false;
    return (
      selectedChild.allergies.includes("Khác") ||
      selectedChild.allergies.some((a) => a.startsWith("Khác:"))
    );
  }, [selectedChild]);

  /** ================== Handlers ================== */
  // Parent
  const handleParentInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParentInfo((prev) => ({ ...prev, [name]: value } as ParentInfo));
  };

  const handleSaveParentInfo = (e: FormEvent) => {
    e.preventDefault();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Child
  const handleSelectChild = (child: Child) => setSelectedChild(child);

  const handleChildInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!selectedChild) return;
    const { name, value } = e.target;
    setSelectedChild({ ...selectedChild, [name]: value } as Child);
  };

  // Toggle một dị ứng phổ biến (ô đen)
  const handleToggleAllergy = (item: (typeof ALLERGY_LIST)[number]) => {
    if (!selectedChild) return;
    const exists = selectedChild.allergies.includes(item);
    const next = exists
      ? selectedChild.allergies.filter((a) => a !== item)
      : [...selectedChild.allergies, item];
    setSelectedChild({ ...selectedChild, allergies: next });
  };

  // Bật/tắt "Khác..." (ô vàng)
  const handleToggleOther = () => {
    if (!selectedChild) return;
    let next = [...selectedChild.allergies];

    if (hasOtherChecked) {
      // Bỏ tick: remove "Khác" & "Khác: ..."
      next = next.filter((a) => a !== "Khác" && !a.startsWith("Khác:"));
    } else {
      // Tick: add nhãn "Khác" (chưa có nội dung)
      next.push("Khác");
    }
    setSelectedChild({ ...selectedChild, allergies: next });
  };

  // Nhập nội dung cho "Khác..."
  const handleOtherAllergyChange = (value: string) => {
    if (!selectedChild) return;
    let next = selectedChild.allergies.filter((a) => !a.startsWith("Khác:"));
    if (value.trim().length > 0) {
      // đảm bảo có nhãn Khác đã tick
      if (!next.includes("Khác")) next.push("Khác");
      next.push(`Khác: ${value.trim()}`);
    }
    setSelectedChild({ ...selectedChild, allergies: next });
  };

  const handleSaveChildInfo = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;
    const updatedChildren = children.map((c) =>
      c.id === selectedChild.id ? selectedChild : c
    );
    setChildren(updatedChildren);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  /** ================== Render ================== */
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cập nhật hồ sơ</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("parent-info")}
          className={`py-3 px-4 font-medium ${
            activeTab === "parent-info"
              ? "text-black border-b-2 border-black"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Thông tin phụ huynh
        </button>
        <button
          onClick={() => setActiveTab("children-info")}
          className={`py-3 px-4 font-medium ${
            activeTab === "children-info"
              ? "text-black border-b-2 border-black"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Thông tin con
        </button>
      </div>

      {/* Parent info */}
      {activeTab === "parent-info" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSaveParentInfo}>
            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
                  <img
                    src="https://i.imgur.com/3bLRsZQ.jpg"
                    alt="Parent avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 shadow-md hover:opacity-90"
                >
                  <Camera size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={parentInfo.fullName}
                    onChange={handleParentInfoChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={parentInfo.email}
                    onChange={handleParentInfoChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <Mail
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={parentInfo.phone}
                    onChange={handleParentInfoChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <Phone
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số CMND/CCCD
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="idNumber"
                    value={parentInfo.idNumber}
                    onChange={handleParentInfoChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={parentInfo.address}
                    onChange={handleParentInfoChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <Home
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mối quan hệ với học sinh
                </label>
                <select
                  name="relationship"
                  value={parentInfo.relationship}
                  onChange={handleParentInfoChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Cha">Cha</option>
                  <option value="Mẹ">Mẹ</option>
                  <option value="Ông">Ông</option>
                  <option value="Bà">Bà</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Emergency */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liên hệ khẩn cấp (Tên, số điện thoại)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="emergencyContact"
                    value={parentInfo.emergencyContact}
                    onChange={handleParentInfoChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <Phone
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors"
              >
                <Save size={18} className="mr-2" />
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Children info */}
      {activeTab === "children-info" && (
        <div>
          {/* List */}
          {!selectedChild && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Danh sách con</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child) => {
                  const Icon = child.avatar;
                  return (
                    <div
                      key={child.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectChild(child)}
                    >
                      <div className="flex items-center">
                        <Icon className="w-10 h-10 text-blue-500" />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-800">
                            {child.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Lớp {child.class}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {child.allergies.map((a, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Edit size={18} className="ml-auto text-black" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <AlertTriangle
                  className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <div>
                  <p className="text-sm text-blue-800">
                    Để thêm con mới hoặc thay đổi thông tin cơ bản (tên, lớp),
                    vui lòng liên hệ với nhà trường.
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    Phụ huynh chỉ có thể cập nhật thông tin sức khỏe, dị ứng và
                    các ghi chú đặc biệt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit form */}
          {selectedChild && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Cập nhật thông tin cho bé {selectedChild.name}
                </h2>
                <button
                  onClick={() => setSelectedChild(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Đóng"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveChildInfo}>
                {/* Avatar */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
                      <selectedChild.avatar size={48} className="text-gray-600" />
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 shadow-md hover:opacity-90"
                      aria-label="Đổi ảnh đại diện"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name (disabled) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedChild.name}
                        disabled
                        className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md w-full"
                      />
                      <User
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Liên hệ nhà trường để thay đổi
                    </p>
                  </div>

                  {/* Class (disabled) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lớp
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedChild.class}
                        disabled
                        className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md w-full"
                      />
                      <User
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Liên hệ nhà trường để thay đổi
                    </p>
                  </div>

                  {/* Birthdate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="birthdate"
                        value={selectedChild.birthdate}
                        onChange={handleChildInfoChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <Calendar
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={selectedChild.gender}
                      onChange={handleChildInfoChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  {/* Blood type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhóm máu
                    </label>
                    <select
                      name="bloodType"
                      value={selectedChild.bloodType}
                      onChange={handleChildInfoChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="Không biết">Không biết</option>
                    </select>
                  </div>

                  {/* Allergies – NEW Lucide UI with colored background */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Các món dị ứng
                    </label>

                    {/* Khung theo mockup */}
                    <div className="rounded-2xl border-2 border-green-500 p-5">
                      <p className="text-sm font-medium mb-3">Các món dị ứng</p>

                      {/* Ô đen: dị ứng phổ biến */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ALLERGY_LIST.map((item) => {
                          const selected =
                            selectedChild.allergies.includes(item);
                          return (
                            <AllergyPill
                              key={item}
                              label={item}
                              selected={selected}
                              onClick={() => handleToggleAllergy(item)}
                              color="black"
                            />
                          );
                        })}

                        {/* Ô vàng: Khác... */}
                        <AllergyPill
                          label="Khác…"
                          selected={hasOtherChecked}
                          onClick={handleToggleOther}
                          color="yellow"
                        />
                      </div>

                      {/* Input khi tick Khác… */}
                      {hasOtherChecked && (
                        <div className="grid grid-cols-1 gap-2">
                          <label className="text-sm text-gray-700">
                            Nhập tên món dị ứng khác
                          </label>
                          <input
                            type="text"
                            value={otherAllergy}
                            onChange={(e) =>
                              handleOtherAllergyChange(e.target.value)
                            }
                            placeholder="VD: mít, mè đen…"
                            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500">
                            Nội dung này sẽ lưu dưới dạng{" "}
                            <em>“Khác: &lt;tên món&gt;”</em>.
                          </p>
                        </div>
                      )}

                      {/* Gợi ý/diễn giải */}
                      <div className="mt-4 text-xs text-green-700">
                        Ở các ô màu đen hiển thị các món ăn gây dị ứng phổ biến;
                        ô màu vàng là “Khác…”. Khi nhấn vào “Khác…” phụ huynh có
                        thể nhập tên món.
                      </div>
                    </div>
                  </div>

                  {/* Health notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú sức khỏe
                    </label>
                    <textarea
                      name="healthNotes"
                      value={selectedChild.healthNotes}
                      onChange={handleChildInfoChange}
                      rows={3}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Nhập các vấn đề sức khỏe cần lưu ý như bệnh mãn tính, thuốc đang dùng, v.v..."
                    />
                  </div>

                  {/* Emergency */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liên hệ khẩn cấp
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="emergencyContact"
                        value={selectedChild.emergencyContact}
                        onChange={handleChildInfoChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <Phone
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedChild(null)}
                    className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <X size={18} className="mr-2" />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors"
                  >
                    <Save size={18} className="mr-2" />
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
