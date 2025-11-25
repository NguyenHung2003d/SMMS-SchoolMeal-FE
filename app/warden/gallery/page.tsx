"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Filter,
  Grid,
  List,
  ChevronLeft,
  Loader2,
  Folder,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  wardenGalleryService,
  GalleryImageDto,
} from "@/services/wardenGalleryServices";
import { getWardenIdFromToken } from "@/utils";
import { ClassDto } from "@/types/warden";
import { format } from "date-fns";
import { wardenDashboardService } from "@/services/wardenDashboradServices";

export default function TeacherGallery() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [classes, setClasses] = useState<ClassDto[]>([]);

  const [selectedClass, setSelectedClass] = useState<ClassDto | null>(null);
  const [classImages, setClassImages] = useState<GalleryImageDto[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const wardenId = getWardenIdFromToken();
        if (wardenId) {
          const data = await wardenDashboardService.getClasses(wardenId);
          setClasses(data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách lớp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleViewAlbum = async (cls: ClassDto) => {
    setSelectedClass(cls);
    setLoadingImages(true);
    try {
      const images = await wardenGalleryService.getImagesByClass(cls.classId);
      setClassImages(images);
    } catch (error) {
      console.error("Lỗi lấy ảnh:", error);
      alert("Không thể tải danh sách ảnh.");
    } finally {
      setLoadingImages(false);
    }
  };

  const handleBackToGalleries = () => {
    setSelectedClass(null);
    setClassImages([]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedClass) return;

    const file = files[0];
    const wardenId = getWardenIdFromToken();

    if (!wardenId) {
      alert("Phiên đăng nhập không hợp lệ.");
      return;
    }

    const formData = new FormData();
    formData.append("File", file);
    formData.append("ClassId", selectedClass.classId);
    formData.append("UploaderId", wardenId);
    // formData.append("Caption", "Optional Caption");

    setUploading(true);
    try {
      await wardenGalleryService.uploadImage(formData);
      alert("Upload thành công!");

      const updatedImages = await wardenGalleryService.getImagesByClass(
        selectedClass.classId
      );
      setClassImages(updatedImages);
    } catch (error) {
      console.error("Upload thất bại:", error);
      alert("Upload thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) return;

    try {
      await wardenGalleryService.deleteImage(imageId);
      setClassImages((prev) => prev.filter((img) => img.imageId !== imageId));
    } catch (error) {
      console.error("Xóa ảnh thất bại:", error);
      alert("Không thể xóa ảnh này.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (selectedClass) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBackToGalleries}
              className="mr-4 p-2 hover:bg-white bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Thư viện ảnh: {selectedClass.className}
              </h1>
              <p className="text-sm text-gray-500">
                {classImages.length} ảnh đã tải lên
              </p>
            </div>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              className="flex items-center bg-orange-500 hover:bg-orange-600"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Upload size={16} className="mr-2" />
              )}
              {uploading ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          </div>
        </div>

        {loadingImages ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <>
            {classImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {classImages.map((image) => (
                  <div
                    key={image.imageId}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all relative"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={image.imageUrl}
                        alt={image.caption || "Student Image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => window.open(image.imageUrl, "_blank")}
                        className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm"
                        title="Xem ảnh gốc"
                      >
                        <ImageIcon size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.imageId)}
                        className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 backdrop-blur-sm"
                        title="Xóa ảnh"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="p-3">
                      <div className="text-xs text-gray-500">
                        {image.createdAt
                          ? format(
                              new Date(image.createdAt),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "N/A"}
                      </div>
                      {image.caption && (
                        <p className="text-sm font-medium truncate mt-1">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <div className="bg-orange-50 rounded-full p-6 mb-4">
                  <Camera size={32} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Lớp này chưa có ảnh nào
                </h3>
                <p className="text-gray-500 mt-2 text-center mb-6">
                  Hãy tải lên những khoảnh khắc đáng nhớ của lớp học
                </p>
                <Button variant="outline" onClick={handleUploadClick}>
                  Tải ảnh đầu tiên
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 via-white to-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thư viện ảnh</h1>
          <p className="text-gray-500 text-sm">
            Quản lý ảnh hoạt động theo lớp học
          </p>
        </div>

        <div className="bg-white border rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md ${
              viewMode === "grid"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md ${
              viewMode === "list"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">
            Bạn chưa được phân công quản lý lớp nào.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.classId}
              onClick={() => handleViewAlbum(cls)}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 group"
            >
              <div className="h-40 bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center group-hover:from-orange-200 group-hover:to-yellow-100 transition-colors relative">
                <Folder
                  size={64}
                  className="text-orange-300 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-600">
                  {cls.totalStudents} HS
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                  Lớp {cls.className}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{cls.schoolName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tên lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trường
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sĩ số
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((cls) => (
                <tr
                  key={cls.classId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewAlbum(cls)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Lớp {cls.className}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cls.schoolName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cls.totalStudents} học sinh
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-orange-500 text-sm font-medium hover:underline">
                      Mở Album
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
