"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Activity,
  Weight,
  Ruler,
  Save,
  BarChart2,
  Download,
  X,
  Loader2,
  AlertCircle,
  History,
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
import { StudentHealthDto } from "@/types/warden";
import { wardenHealthService } from "@/services/wardenHealthServices";
import { format } from "date-fns";
import { getBMIStatusColor, getBMIStatusText } from "@/helpers";

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

export default function TeacherHealthTracking() {
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState<string | null>(null);

  const [rawData, setRawData] = useState<StudentHealthDto[]>([]);

  const [showBMITrend, setShowBMITrend] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const storedClassId = localStorage.getItem("currentClassId");
    if (storedClassId) {
      setClassId(storedClassId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!classId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await wardenHealthService.getClassHealthRecords(classId);
        setRawData(data);
      } catch (error) {
        console.error("Failed to fetch health records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  const latestRecords = useMemo(() => {
    const studentMap = new Map<string, StudentHealthDto>();

    rawData.forEach((record) => {
      const existing = studentMap.get(record.studentId);
      if (
        !existing ||
        new Date(record.recordDate) > new Date(existing.recordDate)
      ) {
        studentMap.set(record.studentId, record);
      }
    });

    return Array.from(studentMap.values());
  }, [rawData]);

  const classBMIData = {
    labels: latestRecords.map((s) => s.studentName),
    datasets: [
      {
        label: "BMI hiện tại",
        data: latestRecords.map((s) => s.bmi || 0),
        backgroundColor: latestRecords.map((s) => {
          const cat = s.bmiCategory?.toLowerCase();
          if (cat === "underweight") return "rgba(54,162,235,0.6)";
          if (cat === "normal") return "rgba(75,192,192,0.6)";
          if (cat === "overweight") return "rgba(255,206,86,0.6)";
          return "rgba(255,99,132,0.6)";
        }),
        borderColor: "rgba(255,255,255,0.8)",
        borderWidth: 1,
      },
    ],
  };

  // 5. Chuẩn bị dữ liệu cho biểu đồ tròn (Phân bố)
  const bmiDistributionData = useMemo(() => {
    let under = 0,
      norm = 0,
      over = 0,
      obese = 0;

    latestRecords.forEach((r) => {
      const cat = r.bmiCategory?.toLowerCase();
      if (cat === "underweight") under++;
      else if (cat === "normal") norm++;
      else if (cat === "overweight") over++;
      else obese++; // Bao gồm cả Obese hoặc null tính vào nhóm khác nếu cần
    });

    return {
      labels: ["Thiếu cân", "Bình thường", "Thừa cân", "Béo phì"],
      datasets: [
        {
          data: [under, norm, over, obese],
          backgroundColor: [
            "rgba(54,162,235,0.6)",
            "rgba(75,192,192,0.6)",
            "rgba(255,206,86,0.6)",
            "rgba(255,99,132,0.6)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [latestRecords]);

  const getStudentHistoryData = (studentId: string) => {
    const history = rawData
      .filter((r) => r.studentId === studentId && r.bmi !== null)
      .sort(
        (a, b) =>
          new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
      );

    return {
      labels: history.map((r) => format(new Date(r.recordDate), "dd/MM/yyyy")),
      datasets: [
        {
          label: "Diễn biến BMI",
          data: history.map((r) => r.bmi),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
  };

  const handleExport = async () => {
    if (!classId) return;
    try {
      const blob = await wardenHealthService.exportHealthReport(classId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BaoCao_SucKhoe_${format(new Date(), "yyyyMMdd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("Xuất báo cáo thất bại");
    }
  };

  const handleViewTrend = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowBMITrend(true);
  };

  // --- Render ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle size={48} className="text-gray-300 mb-2" />
        <p className="text-gray-500">
          Chưa chọn lớp học. Vui lòng quay lại trang chủ.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Theo dõi sức khỏe học sinh
            </h1>
            <p className="text-sm text-gray-500">
              Cập nhật chỉ số BMI và theo dõi sự phát triển
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-white"
            >
              <Download size={16} className="mr-2" />
              Xuất báo cáo
            </Button>
            {/* Backend chưa có API Update, nút này để UI thôi */}
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Save size={16} className="mr-2" />
              Cập nhật (Coming soon)
            </Button>
          </div>
        </div>

        {/* BMI Chart Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-medium flex items-center mb-4 text-gray-700">
              <BarChart2 className="mr-2 text-orange-500" size={20} />
              Chỉ số BMI học sinh (Mới nhất)
            </h2>
            <div className="h-[300px] w-full">
              <Bar
                data={classBMIData}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-medium flex items-center mb-4 text-gray-700">
              <Activity className="mr-2 text-green-500" size={20} />
              Phân bố trạng thái
            </h2>
            <div className="h-[300px] w-full flex justify-center">
              <Doughnut
                data={bmiDistributionData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* BMI Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 overflow-hidden border border-orange-100/50">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <Activity className="mr-2 text-orange-500" size={20} />
              Danh sách chi tiết
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    Chiều cao (cm)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    Cân nặng (kg)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    BMI
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    Ngày đo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {latestRecords.length > 0 ? (
                  latestRecords.map((s) => (
                    <tr
                      key={s.studentId}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {s.studentName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                          <Ruler size={14} className="text-gray-400" />
                          {s.heightCm || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                          <Weight size={14} className="text-gray-400" />
                          {s.weightKg || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {s.bmi ? s.bmi.toFixed(2) : "-"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {format(new Date(s.recordDate), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${getBMIStatusColor(
                            s.bmiCategory
                          )}`}
                        >
                          {getBMIStatusText(s.bmiCategory)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewTrend(s.studentId)}
                          className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                        >
                          <History size={12} /> Lịch sử
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Chưa có dữ liệu sức khỏe cho lớp này
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showBMITrend && selectedStudentId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                  Biểu đồ phát triển BMI -{" "}
                  {
                    latestRecords.find((s) => s.studentId === selectedStudentId)
                      ?.studentName
                  }
                </h3>
                <button
                  onClick={() => setShowBMITrend(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6 h-[400px]">
                <Line
                  data={getStudentHistoryData(selectedStudentId)}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
