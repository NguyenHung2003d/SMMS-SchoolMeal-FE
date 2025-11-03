"use client";
import { pastMenuItems } from "@/data";
import { Eye, MessageCircle } from "lucide-react";

export default function PastMenu() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pastMenuItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className="bg-white/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                {item.date}
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Thành phần: {item.ingredients.join(", ")}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-xs text-gray-500">Đánh giá</p>
                <p className="font-medium text-sm flex items-center justify-center">
                  {item.feedback.rating}
                  <svg
                    className="w-3 h-3 text-yellow-400 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-xs text-gray-500">Bình luận</p>
                <p className="font-medium text-sm">{item.feedback.comments}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-xs text-gray-500">Thừa thãi</p>
                <p className="font-medium text-sm">{item.feedback.wastage}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-1 mt-3">
              <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                <Eye size={18} />
              </button>
              <button className="p-1 text-orange-500 hover:bg-orange-50 rounded">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
