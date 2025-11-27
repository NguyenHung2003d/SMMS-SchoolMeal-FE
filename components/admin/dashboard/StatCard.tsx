import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const StatCard = ({ label, value, growth, icon, subValue }: any) => {
  const isPositive = growth >= 0;

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 transition-all duration-300" />

      <div className="relative flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            {label}
          </p>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-xl transform group-hover:scale-110 transition-all duration-300 ${
            label.includes("Doanh thu")
              ? "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600"
              : label.includes("Trường")
              ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600"
              : "bg-gradient-to-br from-green-100 to-green-50 text-green-600"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        {growth !== null && growth !== undefined ? (
          <div
            className={`flex items-center text-sm font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={16} className="mr-1" />
            ) : (
              <ArrowDownRight size={16} className="mr-1" />
            )}
            <span>{Math.abs(growth)}% vs tháng trước</span>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Tháng trước:{" "}
            <span className="font-semibold text-gray-700">{subValue}</span>
          </p>
        )}
      </div>
    </div>
  );
};
