import { axiosInstance } from "@/lib/axiosInstance";

export interface GalleryImageDto {
  imageId: string;
  imageUrl: string;
  publicId?: string;
  caption?: string;
  createdAt: string;
}

export const wardenGalleryService = {
  getImagesByClass: async (classId: string): Promise<GalleryImageDto[]> => {
    const res = await axiosInstance.get(
      `/WardensManageImage/class/${classId}/images`
    );
    return res.data.data || [];
  },

  // Upload ảnh
  uploadImage: async (formData: FormData) => {
    const res = await axiosInstance.post(
      `/WardensManageImage/upload-student-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  // Xóa ảnh
  deleteImage: async (imageId: string) => {
    const res = await axiosInstance.delete(`/WardensManageImage/${imageId}`);
    return res.data;
  },
};
