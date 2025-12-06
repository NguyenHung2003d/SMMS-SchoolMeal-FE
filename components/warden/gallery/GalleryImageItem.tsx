"use client";

import React from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { GalleryImageDto } from "@/services/wardens/wardenGallery.service";

interface GalleryImageItemProps {
  image: GalleryImageDto;
  onDelete: (id: string) => void;
}

export const GalleryImageItem: React.FC<GalleryImageItemProps> = ({
  image,
  onDelete,
}) => {
  const getFullImageUrl = (url: string) => {
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL || "";
    return `${BASE_URL}${url}`;
  };

  const fullUrl = getFullImageUrl(image.url);

  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all relative border border-gray-100">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={fullUrl}
          alt={image.caption || "Gallery Image"}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => window.open(fullUrl, "_blank")}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors"
            title="Xem ảnh gốc"
          >
            <ImageIcon size={20} />
          </button>
          <button
            onClick={() => onDelete(image.imageId)}
            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 backdrop-blur-sm transition-colors"
            title="Xóa ảnh"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="text-xs text-gray-500">
          {image.createdAt
            ? format(new Date(image.createdAt), "dd/MM/yyyy HH:mm")
            : "N/A"}
        </div>
      </div>
    </div>
  );
};
