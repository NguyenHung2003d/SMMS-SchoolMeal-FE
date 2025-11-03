'use client'
import { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Save,
  School,
  Globe,
  Edit,
} from "lucide-react";
import { EditMode, SchoolContact, SystemContact } from "@/types";

export default function ContactInfoManagement() {
  const [contactInfo, setContactInfo] = useState<{
    system: SystemContact;
    schools: SchoolContact[];
  }>({
    system: {
      hotline: "1900-xxxx",
      zalo: "0912-345-678",
      email: "support@schoolmeals.vn",
      address: "123 Đường ABC, Quận XYZ, TP. HCM",
    },
    schools: [
      {
        id: 1,
        name: "THCS Nguyễn Du",
        hotline: "0283-xxx-xxxx",
        zalo: "0901-234-567",
        email: "nguyendu@edu.vn",
        address: "456 Đường Nguyễn Du, Q.1",
      },
      {
        id: 2,
        name: "THPT Lê Quý Đôn",
        hotline: "0283-yyy-yyyy",
        zalo: "0902-345-678",
        email: "lequydon@edu.vn",
        address: "789 Đường Lê Quý Đôn, Q.3",
      },
    ],
  });

  const [editMode, setEditMode] = useState<EditMode>(null);
  const [tempData, setTempData] = useState<
    SystemContact | SchoolContact | null
  >(null);

  const startEdit = (type: EditMode, data: SystemContact | SchoolContact) => {
    setEditMode(type);
    setTempData({ ...data });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setTempData(null);
  };

  const saveChanges = () => {
    if (editMode === "system") {
      setContactInfo({ ...contactInfo, system: tempData as SystemContact });
      alert("Đã cập nhật thông tin liên hệ hệ thống!");
    } else if (editMode?.startsWith("school-")) {
      const schoolId = parseInt(editMode.split("-")[1]);
      setContactInfo({
        ...contactInfo,
        schools: contactInfo.schools.map((s) =>
          s.id === schoolId ? (tempData as SchoolContact) : s
        ),
      });
      alert(
        `Đã cập nhật thông tin liên hệ cho ${(tempData as SchoolContact).name}!`
      );
    }
    setEditMode(null);
    setTempData(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cập nhật Thông tin Liên hệ</h1>
        <div className="text-sm text-gray-600">
          Thông tin sẽ hiển thị công khai cho người dùng
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-t-4 border-orange-500">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Globe size={24} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Thông tin liên hệ Hệ thống</h2>
              <p className="text-sm text-gray-600">
                Hiển thị trên trang web chính
              </p>
            </div>
          </div>
          {editMode !== "system" && (
            <button
              onClick={() => startEdit("system", contactInfo.system)}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit size={18} />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {editMode === "system" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Hotline *
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={tempData?.hotline}
                    onChange={(e) =>
                      setTempData({
                        ...(tempData as SchoolContact),
                        hotline: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="1900-xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Zalo CSKH *
                </label>
                <div className="relative">
                  <MessageSquare
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={tempData?.zalo}
                    onChange={(e) =>
                      setTempData({
                        ...(tempData as SchoolContact),
                        zalo: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="0912-xxx-xxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email tiếp nhận phản hồi *
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="email"
                    value={tempData?.email}
                    onChange={(e) =>
                      setTempData({
                        ...(tempData as SchoolContact),
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="support@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={tempData?.address}
                  onChange={(e) =>
                    setTempData({
                      ...(tempData as SchoolContact),
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Địa chỉ văn phòng"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={saveChanges}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                <Save size={18} />
                <span>Lưu thay đổi</span>
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Phone size={20} className="text-orange-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Hotline</p>
                <p className="font-medium">{contactInfo.system.hotline}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare size={20} className="text-orange-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Zalo CSKH</p>
                <p className="font-medium">{contactInfo.system.zalo}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail size={20} className="text-orange-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{contactInfo.system.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <School size={20} className="text-orange-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium">{contactInfo.system.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">
        Thông tin liên hệ các Trường học
      </h2>
      <div className="space-y-4">
        {contactInfo.schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <School size={20} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">{school.name}</h3>
              </div>
              {editMode !== `school-${school.id}` && (
                <button
                  onClick={() => startEdit(`school-${school.id}`, school)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  <Edit size={16} />
                  <span>Chỉnh sửa</span>
                </button>
              )}
            </div>

            {editMode === `school-${school.id}` ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hotline trường
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-2.5 text-gray-400"
                      />
                      <input
                        type="text"
                        value={tempData?.hotline}
                        onChange={(e) =>
                          setTempData({
                            ...(tempData as SystemContact),
                            hotline: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="028-xxxx-xxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Zalo trường
                    </label>
                    <div className="relative">
                      <MessageSquare
                        size={18}
                        className="absolute left-3 top-2.5 text-gray-400"
                      />
                      <input
                        type="text"
                        value={tempData?.zalo}
                        onChange={(e) =>
                          setTempData({
                            ...(tempData as SystemContact),
                            zalo: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="090-xxx-xxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email trường
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-2.5 text-gray-400"
                      />
                      <input
                        type="email"
                        value={tempData?.email}
                        onChange={(e) =>
                          setTempData({
                            ...(tempData as SystemContact),
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="school@edu.vn"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={tempData?.address}
                      onChange={(e) =>
                        setTempData({
                          ...(tempData as SystemContact),
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Địa chỉ trường"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={saveChanges}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Save size={18} />
                    <span>Lưu thay đổi</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Hotline</p>
                    <p className="font-medium text-sm">{school.hotline}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageSquare size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Zalo</p>
                    <p className="font-medium text-sm">{school.zalo}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-sm">{school.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <School size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ</p>
                    <p className="font-medium text-sm">{school.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          ℹ️ <strong>Lưu ý:</strong> Thông tin liên hệ sẽ hiển thị công khai
          trong phần "Cài đặt" của ứng dụng cho tất cả người dùng. Vui lòng đảm
          bảo thông tin chính xác và luôn cập nhật.
        </p>
      </div>
    </div>
  );
}
