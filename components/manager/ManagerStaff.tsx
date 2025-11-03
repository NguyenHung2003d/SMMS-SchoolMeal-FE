"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash,
  Mail,
  Phone,
  UserPlus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  X,
  User,
  Calendar,
  Lock,
  Ban,
  Unlock,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { staffMembers } from "@/data";
import { Button } from "@/components/ui/button";

export default function ManagerStaff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [banType, setBanType] = useState("temporary");
  const [banReason, setBanReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [banDuration, setBanDuration] = useState("7");
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [selectedUnbanStaff, setSelectedUnbanStaff] = useState<any>(null);

  // Filter staff
  const filteredStaff = staffMembers.filter(
    (staff) =>
      (staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedRole === "all" || staff.role === selectedRole)
  );

  // Role info
  const getRoleInfo = (role: string) => {
    switch (role) {
      case "teacher":
        return { text: "Giáo viên", className: "bg-blue-100 text-blue-800" };
      case "kitchen":
        return {
          text: "Nhân viên bếp",
          className: "bg-green-100 text-green-800",
        };
      case "support":
        return {
          text: "Nhân viên hỗ trợ",
          className: "bg-purple-100 text-purple-800",
        };
      case "admin":
        return { text: "Quản trị viên", className: "bg-red-100 text-red-800" };
      default:
        return { text: role, className: "bg-gray-100 text-gray-800" };
    }
  };

  // Status info
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return { text: "Hoạt động", className: "bg-green-100 text-green-800" };
      case "pending":
        return {
          text: "Chờ xác nhận",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "inactive":
        return {
          text: "Không hoạt động",
          className: "bg-red-100 text-red-800",
        };
      case "banned":
        return { text: "Đã bị cấm", className: "bg-red-100 text-red-800" };
      default:
        return { text: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  // Ban logic
  const handleOpenBanModal = (staff: any) => {
    setSelectedStaff(staff);
    setShowBanModal(true);
    setBanReason("");
    setStartDate(new Date().toISOString().split("T")[0]);
    const endDateDefault = new Date();
    endDateDefault.setDate(endDateDefault.getDate() + 7);
    setEndDate(endDateDefault.toISOString().split("T")[0]);
    setBanDuration("7");
    setBanType("temporary");
  };

  const handleBanUser = () => {
    console.log(
      `Banning staff ${selectedStaff.name} with reason: ${banReason}`
    );
    console.log(`Ban type: ${banType}`);
    if (banType === "temporary") {
      console.log(`Ban period: ${startDate} to ${endDate}`);
    } else if (banType === "immediate") {
      console.log(`Ban duration: ${banDuration} days`);
    } else {
      console.log("Permanent ban");
    }
    setShowBanModal(false);
    setSelectedStaff(null);
  };

  // Unban logic
  const handleOpenUnbanModal = (staff: any) => {
    setSelectedUnbanStaff(staff);
    setShowUnbanModal(true);
  };

  const handleConfirmUnban = () => {
    console.log(`Unbanning staff with ID: ${selectedUnbanStaff.id}`);
    setShowUnbanModal(false);
    setSelectedUnbanStaff(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý tài khoản nhân viên
          </h1>
          <p className="text-gray-600">
            Tạo và quản lý tài khoản cho giáo viên và nhân viên
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center"
          >
            <UserPlus size={16} className="mr-2" />
            Tạo tài khoản
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center cursor-pointer hover:bg-gray-50">
              <Filter size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Lọc</span>
            </div>
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="teacher">Quản sinh</option>
              <option value="kitchen">Nhân viên bếp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((staff) => {
                const roleInfo = getRoleInfo(staff.role);
                const statusStyle = getStatusStyle(staff.status);
                return (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500 font-medium">
                              {staff.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">
                            {staff.name}
                          </p>
                          {staff.subject && (
                            <p className="text-xs text-gray-500">
                              {staff.subject}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {staff.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {staff.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.className}`}
                      >
                        {roleInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {staff.joinDate}
                      </span>
                      {staff.status === "banned" && staff.banExpiry && (
                        <div className="text-xs text-red-600 flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          <span>Hết hạn cấm: {staff.banExpiry}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.className}`}
                      >
                        {statusStyle.text}
                      </span>
                      {staff.status === "banned" && staff.banReason && (
                        <div className="text-xs text-red-600 flex items-center mt-1">
                          <AlertTriangle size={12} className="mr-1" />
                          <span>Lý do: {staff.banReason}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {staff.status === "banned" ? (
                          <button
                            className="p-1 text-green-500 hover:bg-green-50 rounded flex items-center"
                            onClick={() => handleOpenUnbanModal(staff)}
                            title="Bỏ cấm"
                          >
                            <Unlock size={18} />
                          </button>
                        ) : (
                          <button
                            className="p-1 text-orange-500 hover:bg-orange-50 rounded"
                            onClick={() => handleOpenBanModal(staff)}
                            title="Cấm tài khoản"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredStaff.length} trong tổng số {staffMembers.length}{" "}
          nhân viên
        </p>
        <div className="flex items-center space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
            Trước
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
            Sau
          </button>
        </div>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo tài khoản nhân viên</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="">-- Chọn vai trò --</option>
                    <option value="teacher">Quản sinh</option>
                    <option value="kitchen">Nhân viên bếp</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Nhập mật khẩu"
                    />
                    <Lock
                      size={16}
                      className="absolute right-3 top-2.5 text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Mật khẩu phải có ít nhất 8 ký tự
                  </p>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </button>
                  <Button type="submit">Tạo tài khoản</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Ban Staff Modal */}
      {showBanModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-red-600">
                  <Ban size={20} className="mr-2" />
                  Cấm tài khoản nhân viên
                </h2>
                <button
                  onClick={() => setShowBanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">
                  {selectedStaff.name}
                </p>
                <p className="text-sm text-gray-600">{selectedStaff.email}</p>
                <p className="text-sm text-gray-600">
                  {getRoleInfo(selectedStaff.role).text}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại cấm
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="ban-temporary"
                      name="ban-type"
                      checked={banType === "temporary"}
                      onChange={() => setBanType("temporary")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="ban-temporary"
                      className="ml-2 text-sm text-gray-700 flex items-center"
                    >
                      <Calendar size={16} className="mr-1 text-gray-500" />
                      Cấm trong khoảng thời gian
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="ban-immediate"
                      name="ban-type"
                      checked={banType === "immediate"}
                      onChange={() => setBanType("immediate")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="ban-immediate"
                      className="ml-2 text-sm text-gray-700 flex items-center"
                    >
                      <Clock size={16} className="mr-1 text-gray-500" />
                      Cấm ngay lập tức (có thời hạn)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="ban-permanent"
                      name="ban-type"
                      checked={banType === "permanent"}
                      onChange={() => setBanType("permanent")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="ban-permanent"
                      className="ml-2 text-sm text-gray-700 flex items-center"
                    >
                      <Lock size={16} className="mr-1 text-gray-500" />
                      Cấm vĩnh viễn
                    </label>
                  </div>
                </div>
              </div>
              {banType === "temporary" && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {banType === "immediate" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian cấm
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={banDuration}
                      onChange={(e) => setBanDuration(e.target.value)}
                      min="1"
                      className="w-24 p-2 border border-gray-300 rounded-lg mr-2"
                    />
                    <select className="p-2 border border-gray-300 rounded-lg">
                      <option value="days">Ngày</option>
                      <option value="weeks">Tuần</option>
                      <option value="months">Tháng</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do cấm
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg h-24"
                  placeholder="Nhập lý do cấm tài khoản..."
                ></textarea>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
                <div className="flex items-start">
                  <AlertTriangle
                    className="text-yellow-500 mr-2 mt-0.5"
                    size={16}
                  />
                  <p className="text-sm text-yellow-700">
                    Nhân viên sẽ nhận được thông báo về việc tài khoản bị cấm và
                    lý do cấm.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowBanModal(false)}
                >
                  Hủy
                </button>
                <Button
                  onClick={handleBanUser}
                  className="bg-red-600 hover:bg-red-700 flex items-center"
                >
                  <Ban size={16} className="mr-2" />
                  Cấm tài khoản
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Unban Staff Confirmation Modal */}
      {showUnbanModal && selectedUnbanStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-green-600">
                  <Unlock size={20} className="mr-2" />
                  Bỏ cấm tài khoản
                </h2>
                <button
                  onClick={() => setShowUnbanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">
                  {selectedUnbanStaff.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedUnbanStaff.email}
                </p>
                <p className="text-sm text-gray-600">
                  {getRoleInfo(selectedUnbanStaff.role).text}
                </p>
                {selectedUnbanStaff.banReason && (
                  <div className="mt-2 text-sm">
                    <p className="text-red-600 font-medium">Lý do bị cấm:</p>
                    <p className="text-gray-700">
                      {selectedUnbanStaff.banReason}
                    </p>
                  </div>
                )}
                {selectedUnbanStaff.banExpiry && (
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Clock size={14} className="mr-1 text-gray-500" />
                    <span>Hết hạn cấm: {selectedUnbanStaff.banExpiry}</span>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <p className="text-gray-700">
                  Bạn có chắc chắn muốn bỏ cấm tài khoản này? Nhân viên sẽ có
                  thể đăng nhập và sử dụng hệ thống ngay sau khi được bỏ cấm.
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUnbanModal(false)}
                >
                  Hủy
                </button>
                <Button
                  onClick={handleConfirmUnban}
                  className="bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <Unlock size={16} className="mr-2" />
                  Xác nhận bỏ cấm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
