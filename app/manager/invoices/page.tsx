"use client";
import React, { useState } from "react";
import { Invoice, InvoiceFilter } from "@/types/invoices";
import { useInvoices } from "@/hooks/manager/useInvoices";
import { InvoiceFilters } from "@/components/manager/invoices/InvoiceFilters";
import { InvoiceTable } from "@/components/manager/invoices/InvoiceTable";
import { GenerateInvoiceModal } from "@/components/manager/invoices/GenerateInvoiceModal";
import { EditInvoiceModal } from "@/components/manager/invoices/EditInvoiceModal";

export default function InvoiceManager() {
  const [filter, setFilter] = useState<InvoiceFilter>({
    year: new Date().getFullYear(),
    monthNo: undefined,
    status: "",
  });

  const [showGenModal, setShowGenModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const {
    invoices,
    isLoading,
    deleteInvoice,
    generateInvoices,
    updateInvoice,
    isGenerating,
    isUpdating,
  } = useInvoices(filter);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      await deleteInvoice(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Học Phí</h1>
          <p className="text-gray-500 text-sm mt-1">
            {invoices.length} hóa đơn · Năm {filter.year}
          </p>
        </div>
        <button
          onClick={() => setShowGenModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <span>+</span> Tạo Hóa Đơn
        </button>
      </div>

      <InvoiceFilters filter={filter} setFilter={setFilter} />

      <InvoiceTable
        invoices={invoices}
        loading={isLoading}
        onEdit={setEditingInvoice}
        onDelete={handleDelete}
      />

      {showGenModal && (
        <GenerateInvoiceModal
          isOpen={showGenModal}
          onClose={() => setShowGenModal(false)}
          onSubmit={generateInvoices}
          isSubmitting={isGenerating}
        />
      )}

      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSubmit={updateInvoice}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
}
