"use client";
import React, { useState } from "react";
import { Invoice, InvoiceFilter } from "@/types/invoices";

import { useInvoices } from "@/hooks/manager/useInvoices";

import { InvoiceFilters } from "@/components/manager/invoices/InvoiceFilters";
import { InvoiceTable } from "@/components/manager/invoices/InvoiceTable";
import { GenerateInvoiceModal } from "@/components/manager/invoices/GenerateInvoiceModal";
import { EditInvoiceModal } from "@/components/manager/invoices/EditInvoiceModal";
import { DeleteInvoiceModal } from "@/components/manager/invoices/DeleteInvoiceModal";

import { FileDown, Loader2 } from "lucide-react";
import { useClassData } from "@/hooks/manager/useClassData";
import toast from "react-hot-toast";

export default function InvoiceManager() {
  const [filter, setFilter] = useState<InvoiceFilter>({
    year: new Date().getFullYear(),
    monthNo: new Date().getMonth() + 1,
    status: "",
    classId: "",
    studentName: "",
  });

  console.log("Current Filter:", filter);

  const { classes, loading: isLoadingClasses } = useClassData();

  const [showGenModal, setShowGenModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    invoices,
    isLoading,
    deleteInvoice,
    generateInvoices,
    updateInvoice,
    isGenerating,
    isExporting,
    exportFeeBoard,
    isUpdating,
  } = useInvoices(filter);

  const canExport = filter.year && filter.monthNo && filter.classId;

  const onRequestDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteInvoice(deleteId);
      setDeleteId(null); 
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Không thể xóa hóa đơn này (có thể do ràng buộc dữ liệu thanh toán).";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Học Phí</h1>
          <p className="text-gray-500 text-sm mt-1">
            {invoices.length} hóa đơn
            {filter.monthNo ? ` · Tháng ${filter.monthNo}` : ""} · Năm{" "}
            {filter.year}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportFeeBoard()}
            disabled={isExporting || !filter.monthNo}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors border shadow-sm ${
              !canExport
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-green-700 border-green-200 hover:bg-green-50"
            }`}
            title={!canExport ? "Chọn đủ Năm, Tháng và Lớp để xuất" : ""}
          >
            {isExporting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <FileDown size={18} />
            )}
            <span>Xuất Bảng Thu</span>
          </button>
          <button
            onClick={() => setShowGenModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span> Tạo Hóa Đơn
          </button>
        </div>
      </div>

      <InvoiceFilters
        filter={filter}
        setFilter={setFilter}
        classes={classes}
        isLoadingClasses={isLoadingClasses}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        <InvoiceTable
          invoices={invoices}
          loading={isLoading}
          onEdit={setEditingInvoice}
          onDelete={onRequestDelete}
        />
      </div>

      <GenerateInvoiceModal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
        onSubmit={generateInvoices}
        isSubmitting={isGenerating}
      />

      <EditInvoiceModal
        invoice={editingInvoice}
        onClose={() => setEditingInvoice(null)}
        onSubmit={updateInvoice}
        isSubmitting={isUpdating}
      />

      <DeleteInvoiceModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
