import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    note?: string;
}

export const WeeklyMenuNote: React.FC<Props> = ({ note }) => {
    return (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
            <AlertCircle
                size={20}
                className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
            />
            <div>
                <h4 className="text-sm font-bold text-blue-800 mb-1">
                    Ghi chú từ quản lý:
                </h4>
                <p className="text-sm text-blue-700">
                    {note ||
                        "Hiện chưa có ghi chú đặc biệt cho tuần này. Thực đơn có thể thay đổi tùy thuộc vào nguồn nguyên liệu thực tế."}
                </p>
            </div>
        </div>
    );
};