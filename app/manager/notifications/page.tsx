"use client";
import React, { useState, useEffect } from "react";
import {
  Bell, Search, Plus, Send, Trash, X,
  Loader2, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button"; 
import * as signalR from "@microsoft/signalr";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { ManagerNotification, CreateNotificationRequest } from "@/types/notification";
import toast from "react-hot-toast";
import { notificationService } from "@/services/managerNotificationService";

export default function ManagerNotifications() {
  const [notifications, setNotifications] = useState<ManagerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: "",
    content: "",
    attachmentUrl: "",
    sendToParents: true,
    sendToTeachers: false,
    sendToKitchenStaff: false,
    sendType: "Immediate",
    scheduleCron: "",
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll(page, 20);
      setNotifications(res.data);
      setTotalCount(res.count);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/hubs/notifications", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    connection.start().catch((err) => console.error("SignalR Error: ", err));

    connection.on("ReceiveNotification", (newNotification: ManagerNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      connection.stop();
    };
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notificationService.create(formData);
      toast.success("Đã gửi thông báo thành công!");
      setShowCreateModal(false);
      fetchNotifications(); 
      
      setFormData({
        title: "", content: "", attachmentUrl: "",
        sendToParents: true, sendToTeachers: false, sendToKitchenStaff: false,
        sendType: "Immediate", scheduleCron: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo thông báo.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      await notificationService.delete(id);
      // Cập nhật UI ngay lập tức
      setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Thông báo</h1>
          <p className="text-gray-600">Gửi thông báo đến hệ thống</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus size={16} /> Tạo mới
        </Button>
      </div>

      <div className="bg-white p-4 mb-6 rounded-lg border shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Thông tin</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Người nhận</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNotifications.map((notif) => (
                  <tr key={notif.notificationId} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{notif.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{notif.content}</div>
                    </td>
                    <td className="py-3 px-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notif.sendType === 'Immediate' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {notif.sendType === 'Immediate' ? 'Gửi ngay' : 'Lên lịch'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {notif.totalRecipients} người
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(new Date(notif.createdAt), "HH:mm dd/MM/yyyy", { locale: vi })}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(notif.notificationId)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredNotifications.length === 0 && <div className="p-4 text-center text-gray-500">Không có dữ liệu</div>}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tạo thông báo mới</h2>
              <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            
            <form onSubmit={handleCreateSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                  <input type="text" required className="w-full border p-2 rounded"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nội dung</label>
                  <textarea required rows={4} className="w-full border p-2 rounded"
                    value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Gửi đến:</label>
                  <div className="flex gap-4">
                    {['Parents', 'Teachers', 'KitchenStaff'].map((role) => (
                        <label key={role} className="flex items-center space-x-2">
                           <input type="checkbox" 
                             checked={(formData as any)[`sendTo${role}`]}
                             onChange={e => setFormData({...formData, [`sendTo${role}`]: e.target.checked})}
                             className="rounded text-blue-600"
                           />
                           <span>{role === 'Parents' ? 'Phụ huynh' : role === 'Teachers' ? 'Giáo viên' : 'Bếp ăn'}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Loại gửi</label>
                        <select className="w-full border p-2 rounded"
                            value={formData.sendType}
                            onChange={e => setFormData({...formData, sendType: e.target.value})}
                        >
                            <option value="Immediate">Gửi ngay</option>
                            <option value="Scheduled">Lên lịch</option>
                        </select>
                    </div>
                    {formData.sendType === 'Scheduled' && (
                        <div>
                             <label className="block text-sm font-medium mb-1">Cron Expression</label>
                             <input type="text" className="w-full border p-2 rounded" 
                                placeholder="0 8 * * *"
                                value={formData.scheduleCron || ""}
                                onChange={e => setFormData({...formData, scheduleCron: e.target.value})}
                             />
                        </div>
                    )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Hủy</button>
                <Button type="submit" className="flex items-center gap-2"><Send size={16}/> Gửi</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}