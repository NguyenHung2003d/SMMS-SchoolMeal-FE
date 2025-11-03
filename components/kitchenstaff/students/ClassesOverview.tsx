"use client";

import { Users } from "lucide-react";

export default function ClassesOverview({
  classes,
  selectedClass,
  onSelectClass,
}: {
  classes: { name: string; students: number; present: number }[];
  selectedClass: string;
  onSelectClass: (name: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium flex items-center">
          <Users className="mr-2" size={20} />
          Tổng quan lớp học
        </h2>
      </div>
      <div className="p-4">
        {classes.map((classItem, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg cursor-pointer ${
              index !== classes.length - 1 ? "mb-3" : ""
            } ${
              selectedClass === classItem.name
                ? "bg-orange-50 border border-orange-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onSelectClass(classItem.name)}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Lớp {classItem.name}</div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  classItem.present === classItem.students
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {classItem.present}/{classItem.students}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-orange-500 rounded-full"
                style={{
                  width: `${(classItem.present / classItem.students) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
