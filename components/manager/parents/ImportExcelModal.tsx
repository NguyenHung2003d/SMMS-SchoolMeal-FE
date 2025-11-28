"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { parentService } from "@/services/managerParentService";
import toast from "react-hot-toast";

interface ImportExcelModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportExcelModal({ open, onClose, onSuccess }: ImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await parentService.importExcel(file);
      toast.success("Import thành công!");
      onSuccess();
      onClose();
      setFile(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập danh sách từ Excel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
            <Input
              type="file"
              accept=".xlsx, .xls"
              className="cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-gray-500 mt-2">
              Chọn file .xlsx hoặc .xls theo mẫu quy định
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleImport} disabled={!file || uploading}>
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}