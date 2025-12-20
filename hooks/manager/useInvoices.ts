import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { managerInvoiceService } from "@/services/manager/managerInvoice.service";
import { InvoiceFilter, UpdateInvoiceRequest } from "@/types/invoices";
import toast from "react-hot-toast";

export const useInvoices = (filter: InvoiceFilter) => {
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices", filter],
    queryFn: async () => {
      const res = await managerInvoiceService.getAll(filter);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: managerInvoiceService.delete,
    onSuccess: () => {
      toast.success("Xóa hóa đơn thành công!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: () => toast.error("Lỗi khi xóa hóa đơn!"),
  });

  const generateMutation = useMutation({
    mutationFn: managerInvoiceService.generate,
    onSuccess: (res) => {
      toast.success(res.message || "Tạo hóa đơn thành công!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi tạo hóa đơn");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInvoiceRequest }) =>
      managerInvoiceService.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      if (!filter.monthNo) {
        throw new Error("Vui lòng chọn tháng để xuất báo cáo.");
      }
      return managerInvoiceService.exportFeeBoard(
        filter.monthNo,
        filter.year,
        filter.classId
      );
    },
    onSuccess: (res) => {
      try {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = res.headers["content-disposition"];
        let fileName = `Bang-thu-thang-${filter.monthNo}-${filter.year}.xlsx`;
        if (contentDisposition) {
          const fileNameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (fileNameMatch && fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Xuất file thành công!");
      } catch (error) {
        console.error("Lỗi khi tải file xuống", error);
        toast.error("Có lỗi xảy ra khi xử lý file.");
      }
    },
    onError: (err: any) => {
      if (err.message === "Vui lòng chọn tháng để xuất báo cáo.") {
        toast.error(err.message);
        return;
      }
      console.error(err);
      toast.error("Lỗi khi xuất báo cáo Excel.");
    },
  });

  return {
    invoices,
    isLoading,

    deleteInvoice: deleteMutation.mutateAsync,
    generateInvoices: generateMutation.mutateAsync,
    updateInvoice: updateMutation.mutateAsync,

    exportFeeBoard: exportMutation.mutate,

    isGenerating: generateMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExporting: exportMutation.isPending,
  };
};
