"use client";

import React, { useState } from "react";
import { Users, UserCheck, FileText, Eye } from "lucide-react";
import { ClassDto } from "@/types/warden";
import { Button } from "@/components/ui/button";
import ClassDetailModal from "./ClassDetailModal";

interface ClassOverviewProps {
  classes: ClassDto[];
}

export const ClassOverview: React.FC<ClassOverviewProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<ClassDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (cls: ClassDto) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          Tổng quan lớp học
        </h2>

        {classes.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Users className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">
              Chưa có dữ liệu lớp học.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls) => (
              <div
                key={cls.classId}
                className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white hover:border-blue-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                      {cls.className}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      GVCN:{" "}
                      <span className="font-medium">{cls.wardenName}</span>
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                    {cls.shift || "Cả ngày"}
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-sm p-2 rounded-lg bg-gray-50">
                    <Users size={16} className="text-blue-500 mr-2" />
                    <span className="text-gray-600">Sĩ số:</span>
                    <span className="ml-auto font-bold text-gray-800">
                      {cls.totalStudents}
                    </span>
                  </div>
                  <div className="flex items-center text-sm p-2 rounded-lg bg-green-50/50">
                    <UserCheck size={16} className="text-green-500 mr-2" />
                    <span className="text-gray-600">Hiện diện:</span>
                    <span className="ml-auto font-bold text-green-700">
                      {cls.presentToday}/{cls.totalStudents}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2"
                    onClick={() => handleOpenDetail(cls)}
                  >
                    <Eye size={16} />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClassDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        classId={selectedClass?.classId.toString() || null}
        classNameTitle={selectedClass?.className}
      />
    </>
  );
};
