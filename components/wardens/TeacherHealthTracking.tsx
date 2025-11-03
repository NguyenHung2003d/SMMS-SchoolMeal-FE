"use client";

import React, { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import {
  Search,
  Activity,
  Weight,
  Ruler,
  AlertCircle,
  Save,
  Filter,
  BarChart2,
  Download,
  X,
  User,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { BMIStatus, Student } from "@/types";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function TeacherHealthTracking() {
  const [selectedClass, setSelectedClass] = useState<string>("1A");
  const [selectedMonth, setSelectedMonth] = useState<string>("10");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editHeight, setEditHeight] = useState<string>("");
  const [editWeight, setEditWeight] = useState<string>("");
  const [editBMI, setEditBMI] = useState<string>("");
  const [showBMITrend, setShowBMITrend] = useState<boolean>(false);
  const [selectedStudentForTrend, setSelectedStudentForTrend] =
    useState<Student | null>(null);

  const students: Student[] = [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      avatar: "https://i.imgur.com/wgJDypg.jpg",
      gender: "Nữ",
      height: 115,
      weight: 20.5,
      bmi: 15.5,
      bmiStatus: "normal",
      lastUpdate: "15/10/2023",
      history: [
        { date: "15/10/2023", height: 115, weight: 20.5, bmi: 15.5 },
        { date: "15/07/2023", height: 113, weight: 19.8, bmi: 15.5 },
        { date: "15/04/2023", height: 111, weight: 19.0, bmi: 15.4 },
        { date: "15/01/2023", height: 109, weight: 18.2, bmi: 15.3 },
      ],
    },
    {
      id: 2,
      name: "Trần Hoàng Nam",
      avatar: "https://i.imgur.com/8RWKYSf.jpg",
      gender: "Nam",
      height: 118,
      weight: 22.5,
      bmi: 16.2,
      bmiStatus: "normal",
      lastUpdate: "15/10/2023",
      history: [
        { date: "15/10/2023", height: 118, weight: 22.5, bmi: 16.2 },
        { date: "15/07/2023", height: 116, weight: 21.8, bmi: 16.2 },
        { date: "15/04/2023", height: 114, weight: 21.0, bmi: 16.1 },
        { date: "15/01/2023", height: 112, weight: 20.2, bmi: 16.1 },
      ],
    },
  ];

  // ====== CHART DATA ======
  const classBMIData = {
    labels: students.map((s) => s.name),
    datasets: [
      {
        label: "BMI hiện tại",
        data: students.map((s) => s.bmi),
        backgroundColor: students.map((s) =>
          s.bmiStatus === "underweight"
            ? "rgba(54,162,235,0.6)"
            : s.bmiStatus === "normal"
            ? "rgba(75,192,192,0.6)"
            : s.bmiStatus === "overweight"
            ? "rgba(255,206,86,0.6)"
            : "rgba(255,99,132,0.6)"
        ),
        borderColor: "rgba(255,255,255,0.8)",
        borderWidth: 1,
      },
    ],
  };

  const bmiDistributionData = {
    labels: ["Thiếu cân", "Bình thường", "Thừa cân/Béo phì"],
    datasets: [
      {
        data: [
          students.filter((s) => s.bmiStatus === "underweight").length,
          students.filter((s) => s.bmiStatus === "normal").length,
          students.filter(
            (s) => s.bmiStatus === "overweight" || s.bmiStatus === "obese"
          ).length,
        ],
        backgroundColor: [
          "rgba(54,162,235,0.6)",
          "rgba(75,192,192,0.6)",
          "rgba(255,206,86,0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getBMITrendData = (student: Student | null) => {
    if (!student) return null;
    return {
      labels: student.history.map((r) => r.date).reverse(),
      datasets: [
        {
          label: "BMI",
          data: student.history.map((r) => r.bmi).reverse(),
          borderColor: "rgba(75,192,192,1)",
          fill: false,
        },
      ],
    };
  };

  // ====== HELPERS ======
  const getBMIStatusColor = (status: BMIStatus) => {
    switch (status) {
      case "underweight":
        return "bg-blue-100 text-blue-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "overweight":
        return "bg-yellow-100 text-yellow-800";
      case "obese":
        return "bg-red-100 text-red-800";
    }
  };

  const getBMIStatusText = (status: BMIStatus) => {
    switch (status) {
      case "underweight":
        return "Thiếu cân";
      case "normal":
        return "Bình thường";
      case "overweight":
        return "Thừa cân";
      case "obese":
        return "Béo phì";
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditHeight(student.height.toString());
    setEditWeight(student.weight.toString());
    setEditBMI(student.bmi.toFixed(1));
  };

  const handleViewBMITrend = (student: Student, e: MouseEvent) => {
    e.stopPropagation();
    setSelectedStudentForTrend(student);
    setShowBMITrend(true);
  };

  const handleCloseTrendModal = () => {
    setShowBMITrend(false);
    setSelectedStudentForTrend(null);
  };

  // ====== RENDER ======
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Theo dõi sức khỏe học sinh</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Xuất báo cáo
          </Button>
          <Button>
            <Save size={16} className="mr-2" />
            Cập nhật BMI
          </Button>
        </div>
      </div>

      {/* BMI Chart Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium flex items-center mb-4">
            <BarChart2 className="mr-2" size={20} />
            Chỉ số BMI của học sinh lớp {selectedClass}
          </h2>
          <Bar data={classBMIData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium flex items-center mb-4">
            <Activity className="mr-2" size={20} />
            Phân bố BMI theo trạng thái
          </h2>
          <Doughnut data={bmiDistributionData} />
        </div>
      </div>

      {/* BMI Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium flex items-center">
            <Activity className="mr-2" size={20} />
            Chỉ số BMI học sinh
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/5">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">
                  Chiều cao
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">
                  Cân nặng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">
                  BMI
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-1/6">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Ruler
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                        style={{ width: "30%" }}
                      />
                      <span
                        className="text-sm text-gray-600"
                        style={{ width: "30%" }}
                      >
                        Chiều cao
                      </span>
                      <span className="font-medium" style={{ width: "40%" }}>
                        {s.height} cm
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Weight
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                        style={{ width: "30%" }}
                      />
                      <span
                        className="text-sm text-gray-600"
                        style={{ width: "30%" }}
                      >
                        Cân nặng
                      </span>
                      <span className="font-medium" style={{ width: "40%" }}>
                        {s.weight} kg
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Activity
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                        style={{ width: "30%" }}
                      />
                      <span
                        className="text-sm text-gray-600"
                        style={{ width: "30%" }}
                      >
                        BMI
                      </span>
                      <span className="font-medium" style={{ width: "40%" }}>
                        {s.bmi.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getBMIStatusColor(
                        s.bmiStatus
                      )}`}
                    >
                      {getBMIStatusText(s.bmiStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditStudent(s)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={(e) => handleViewBMITrend(s, e)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Biểu đồ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Modal */}
      {showBMITrend && selectedStudentForTrend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-6 flex justify-between border-b">
              <h3 className="text-xl font-bold">
                Biểu đồ BMI - {selectedStudentForTrend.name}
              </h3>
              <button onClick={handleCloseTrendModal}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <Line data={getBMITrendData(selectedStudentForTrend)!} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
