"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  ChevronLeft,
  Loader2,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassDto } from "@/types/warden";
import { wardenGalleryService } from "@/services/wardens/wardenGallery.service";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GalleryImageItem } from "./GalleryImageItem"; // Import component con

interface ClassAlbumProps {
  classInfo: ClassDto;
  onBack: () => void;
}

export const ClassAlbum: React.FC<ClassAlbumProps> = ({ classInfo, onBack }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["classImages", classInfo.classId],
    queryFn: () => wardenGalleryService.getImagesByClass(classInfo.classId),
  });

  const uploadMutation = useMutation({
    mutationFn: wardenGalleryService.uploadImage,
    onSuccess: () => {
      toast.success("Tải ảnh lên thành công!");
      queryClient.invalidateQueries({ queryKey: ["classImages", classInfo.classId] });
    },
    onError: () => toast.error("Tải ảnh thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: wardenGalleryService.deleteImage,
    onSuccess: () => {
      toast.success("Đã xóa ảnh.");
      setImageToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["classImages", classInfo.classId] });
    },
    onError: () => toast.error("Xóa ảnh thất bại."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("File", files[0]);
    formData.append("ClassId", classInfo.classId);

    uploadMutation.mutate(formData);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-white bg-gray-200 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Lớp {classInfo.className}
            </h1>
            <p className="text-sm text-gray-500">
              {images.length} ảnh đã tải lên
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
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            {uploadMutation.isPending ? "Đang tải..." : "Tải ảnh lên"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <GalleryImageItem
              key={img.imageId}
              image={img}
              onDelete={(id) => setImageToDelete(id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="bg-orange-50 rounded-full p-6 mb-4">
            <Camera size={32} className="text-orange-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            Chưa có ảnh nào
          </h3>
          <p className="text-gray-500 mt-2 text-center mb-6">
            Hãy tải lên những khoảnh khắc đáng nhớ của lớp học
          </p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Tải ảnh đầu tiên
          </Button>
        </div>
      )}

      <Dialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Xác nhận xóa ảnh
            </DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageToDelete(null)}>
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => imageToDelete && deleteMutation.mutate(imageToDelete)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Xóa ảnh"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};