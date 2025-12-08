"use client";

import React, { useEffect, useState } from "react";
import { useSelectedStudent } from "@/context/SelectedChildContext"; // Context lấy con đang chọn
import { parentStudentImageService } from "@/services/parent/parentStudentImage.service";
import { StudentImageDto } from "@/types/parent";
import { Loader2, Image as ImageIcon, Calendar, X, ZoomIn } from "lucide-react";
import { formatDate } from "@/helpers";

export default function StudentGalleryPage() {
  const { selectedStudent } = useSelectedStudent();

  const [images, setImages] = useState<StudentImageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StudentImageDto | null>(
    null
  );

  useEffect(() => {
    if (!selectedStudent?.studentId) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const data = await parentStudentImageService.getImagesByStudent(
          selectedStudent.studentId
        );
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.takenAt || a.createdAt).getTime();
          const dateB = new Date(b.takenAt || b.createdAt).getTime();
          return dateB - dateA;
        });
        setImages(sortedData);
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedStudent?.studentId]);

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center text-gray-500">
        Vui lòng chọn học sinh để xem thư viện ảnh.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="text-blue-600" />
          Thư viện ảnh của bé
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Những khoảnh khắc đáng nhớ của {selectedStudent.fullName} tại trường.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Chưa có hình ảnh nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.imageId}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
              onClick={() => setSelectedImage(img)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Ảnh học sinh"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="text-white w-8 h-8 drop-shadow-md" />
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(img.takenAt || img.createdAt)}
                </div>
                {img.caption ? (
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {img.caption}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Không có mô tả</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)} // Click ra ngoài để đóng
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Ngăn click vào ảnh bị đóng modal
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || "Full size"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />

            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">
                {selectedImage.caption || "Hoạt động của bé"}
              </p>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2 mt-1">
                <Calendar size={14} />
                {formatDate(selectedImage.takenAt || selectedImage.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
