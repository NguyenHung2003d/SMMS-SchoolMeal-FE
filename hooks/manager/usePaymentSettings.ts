import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SchoolPaymentSettingDto,
  CreateSchoolPaymentSettingRequest,
  UpdateSchoolPaymentSettingRequest,
} from "@/types/manager-payment";
import toast from "react-hot-toast";
import { managerPaymentService } from "@/services/manager/managerPayment.service";

export const usePaymentSettings = () => {
  const queryClient = useQueryClient();

  const { data: settingsList = [], isLoading } = useQuery({
    queryKey: ["payment-settings"],
    queryFn: async () => {
      const data = await managerPaymentService.getBySchool();
      return data.sort((a: any, b: any) => a.fromMonth - b.fromMonth);
    },
    staleTime: 1000 * 60 * 60,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSchoolPaymentSettingRequest) =>
      managerPaymentService.create(data),
    onSuccess: () => {
      toast.success("Tạo mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["payment-settings"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi tạo mới"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateSchoolPaymentSettingRequest;
    }) => managerPaymentService.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["payment-settings"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });

  const deleteMutation = useMutation({
    mutationFn: managerPaymentService.delete,
    onSuccess: () => {
      toast.success("Xóa thành công!");
      queryClient.invalidateQueries({ queryKey: ["payment-settings"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi xóa"),
  });

  return {
    settingsList,
    isLoading,
    createSetting: createMutation.mutateAsync,
    updateSetting: updateMutation.mutateAsync,
    deleteSetting: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
