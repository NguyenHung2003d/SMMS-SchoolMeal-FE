import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { managerInvoiceService } from "@/services/manager/managerInvoice.service";
import {
  InvoiceFilter,
  GenerateInvoiceRequest,
  UpdateInvoiceRequest,
} from "@/types/invoices";
import toast from "react-hot-toast";

export const useInvoices = (filter: InvoiceFilter) => {
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices", filter],
    queryFn: async () => {
      const res = await managerInvoiceService.getAll(filter);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
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

  return {
    invoices,
    isLoading,
    deleteInvoice: deleteMutation.mutateAsync,
    generateInvoices: generateMutation.mutateAsync,
    updateInvoice: updateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
