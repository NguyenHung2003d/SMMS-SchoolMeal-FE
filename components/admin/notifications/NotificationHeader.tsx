import { Bell, Plus } from "lucide-react";

interface NotificationHeaderProps {
    onOpenForm: () => void;
}

export default function NotificationHeader({
    onOpenForm,
}: NotificationHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell size={32} className="text-orange-500" />
                    Quản lý Thông báo
                </h1>
                <p className="text-gray-600 mt-1">
                    Gửi thông báo hệ thống đến tất cả người dùng
                </p>
            </div>
            <button
                onClick={onOpenForm}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-medium"
            >
                <Plus size={20} />
                <span>Tạo thông báo mới</span>
            </button>
        </div>
    );
}