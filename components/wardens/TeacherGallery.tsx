"use client";

import React, { useState, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  Filter,
  Grid,
  List,
  Plus,
  Camera,
  FolderOpen,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // 👈 import Button (nếu bạn dùng shadcn/ui hoặc tự có button)

export function TeacherGallery() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mock gallery data
  const [galleries, setGalleries] = useState([
    {
      id: 1,
      title: "Hoạt động văn nghệ lớp 3A",
      description: "Các hoạt động văn nghệ của lớp 3A trong học kỳ 1",
      date: "15/09/2023",
      imageCount: 24,
      coverImage: "https://i.imgur.com/aNyGpaH.jpg",
      shared: true,
      images: [
        { id: 1, url: "https://i.imgur.com/aNyGpaH.jpg", date: "15/09/2023" },
        { id: 2, url: "https://i.imgur.com/qW4YhBV.jpg", date: "15/09/2023" },
        { id: 3, url: "https://i.imgur.com/zL8TcXg.jpg", date: "15/09/2023" },
        { id: 4, url: "https://i.imgur.com/yRnHCCz.jpg", date: "15/09/2023" },
      ],
    },
    {
      id: 2,
      title: "Giờ học nhóm lớp 2B",
      description: "Các hoạt động học nhóm của lớp 2B",
      date: "10/09/2023",
      imageCount: 18,
      coverImage: "https://i.imgur.com/qW4YhBV.jpg",
      shared: true,
      images: [
        { id: 1, url: "https://i.imgur.com/qW4YhBV.jpg", date: "10/09/2023" },
        { id: 2, url: "https://i.imgur.com/aNyGpaH.jpg", date: "10/09/2023" },
      ],
    },
  ]);

  // ===== Handlers =====
  const handleTakePhoto = () => {
    setShowUploadOptions(false);
    setShowCameraModal(true);
  };

  const handleFileSelected = (e: any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", files);
      alert("Ảnh đã được tải lên thành công!");
      setShowUploadModal(false);
      e.target.value = null;
    }
  };

  const handleCapture = () => {
    alert("Ảnh đã được chụp thành công!");
    setShowCameraModal(false);
  };

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) {
      alert("Vui lòng nhập tên thư mục!");
      return;
    }
    const newAlbum = {
      id: galleries.length + 1,
      title: newAlbumName,
      description: newAlbumDescription,
      date: new Date().toLocaleDateString("vi-VN"),
      imageCount: 0,
      coverImage: "https://i.imgur.com/7oFpIWW.jpg",
      shared: false,
      images: [],
    };
    setGalleries([...galleries, newAlbum]);
    setNewAlbumName("");
    setNewAlbumDescription("");
    setShowCreateAlbumModal(false);
  };

  const handleViewAlbum = (album: any) => setSelectedAlbum(album);
  const handleBackToGalleries = () => setSelectedAlbum(null);
  const handleUploadInAlbum = () => setShowUploadModal(true);
  const handleChooseFromGallery = () => fileInputRef.current?.click();

  // ====== Album View ======
  if (selectedAlbum) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBackToGalleries}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">{selectedAlbum.title}</h1>
          </div>
          <Button className="flex items-center" onClick={handleUploadInAlbum}>
            <Upload size={16} className="mr-2" />
            Tải ảnh lên
          </Button>
        </div>

        {/* Album details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p className="text-gray-600">{selectedAlbum.description}</p>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <div>Ngày tạo: {selectedAlbum.date}</div>
            <div>{selectedAlbum.images.length} ảnh</div>
          </div>
        </div>

        {/* Images */}
        {selectedAlbum.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedAlbum.images.map((image: any) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt="Album"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm text-gray-500">{image.date}</div>
                  <div className="mt-2 flex justify-end">
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              Chưa có ảnh nào trong thư mục này
            </h3>
            <p className="text-gray-500 mt-2 text-center">
              Nhấn "Tải ảnh lên" để thêm ảnh vào thư mục
            </p>
          </div>
        )}
      </div>
    );
  }

  // ===== Main Gallery View =====
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý ảnh</h1>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="all">Tất cả thư mục</option>
              <option value="1A">Lớp 1A</option>
              <option value="2B">Lớp 2B</option>
              <option value="3C">Lớp 3C</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Theo tên</option>
            </select>
            <button className="border border-gray-300 rounded-lg px-3 py-2 flex items-center text-sm hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              Bộ lọc
            </button>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Items */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Album */}
          <div
            className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-64 hover:border-orange-400 transition-colors cursor-pointer"
            onClick={() => setShowCreateAlbumModal(true)}
          >
            <div className="bg-orange-100 rounded-full p-4 mb-3">
              <Plus size={24} className="text-orange-500" />
            </div>
            <p className="font-medium text-gray-800">Tạo thư mục ảnh mới</p>
            <p className="text-sm text-gray-500 mt-1">Tải lên và tổ chức ảnh</p>
          </div>

          {/* Albums */}
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewAlbum(gallery)}
            >
              <div className="relative h-40">
                <img
                  src={gallery.coverImage}
                  alt={gallery.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {gallery.shared ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Đã chia sẻ
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      Chưa chia sẻ
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">
                  {gallery.title}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <ImageIcon size={14} className="mr-1" />
                    <span>{gallery.imageCount} ảnh</span>
                  </div>
                  <span className="text-gray-500">{gallery.date}</span>
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
                  Tên thư mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Số lượng ảnh
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleries.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewAlbum(g)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {g.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{g.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {g.imageCount}
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
