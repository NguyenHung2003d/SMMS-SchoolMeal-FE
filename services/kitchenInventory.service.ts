// src/services/inventory.service.ts
import { axiosInstance } from "@/lib/axiosInstance";
import {
  InventoryItemDto,
  PagedResult,
  UpdateInventoryItemRequest,
} from "@/types/kitchen-inventory";

export const kitchenInventoryService = {
  getAll: async (pageIndex: number = 1, pageSize: number = 10) => {
    const response = await axiosInstance.get<PagedResult<InventoryItemDto>>(
      `/inventory/InventoryItems?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<InventoryItemDto>(
      `/inventory/InventoryItems/${id}`
    );
    return response.data;
  },

  update: async (id: number, data: UpdateInventoryItemRequest) => {
    await axiosInstance.put(`/inventory/InventoryItems/${id}`, data);
  },
};
