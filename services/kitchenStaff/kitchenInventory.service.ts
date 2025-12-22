import { axiosInstance } from "@/lib/axiosInstance";
import {
  InventoryItemDto,
  PagedResult,
  UpdateInventoryItemRequest,
} from "@/types/kitchen-inventory";
import {
  CreateIngredientRequest,
  IngredientDto,
  UpdateIngredientRequest,
} from "@/types/kitchen-nutrition";

export const kitchenInventoryService = {
  getInventoryItems: async (pageIndex = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PagedResult<InventoryItemDto>>(
      "/inventory/InventoryItems",
      { params: { pageIndex, pageSize } }
    );
    return response.data;
  },

  getInventoryItemById: async (id: number) => {
    const response = await axiosInstance.get<InventoryItemDto>(
      `/inventory/InventoryItems/${id}`
    );
    return response.data;
  },

  updateInventoryItem: async (id: number, data: UpdateInventoryItemRequest) => {
    const response = await axiosInstance.put(
      `/inventory/InventoryItems/${id}`,
      data
    );
    return response.data;
  },

  getActiveIngredients: async (keyword?: string) => {
    const params = keyword ? { keyword } : {};
    const response = await axiosInstance.get<IngredientDto[]>(
      "/nutrition/Ingredients",
      { params }
    );
    return response.data;
  },

  getAllIngredients: async (keyword?: string) => {
    const params = keyword ? { keyword } : {};
    const response = await axiosInstance.get<IngredientDto[]>(
      "/nutrition/Ingredients/all",
      { params }
    );
    return response.data;
  },

  getIngredientById: async (id: number) => {
    const response = await axiosInstance.get<IngredientDto>(
      `/nutrition/Ingredients/${id}`
    );
    return response.data;
  },

  createIngredient: async (data: CreateIngredientRequest) => {
    const response = await axiosInstance.post<IngredientDto>(
      "/nutrition/Ingredients",
      data
    );
    return response.data;
  },

  updateIngredient: async (id: number, data: UpdateIngredientRequest) => {
    const response = await axiosInstance.put<IngredientDto>(
      `/nutrition/Ingredients/${id}`,
      data
    );
    return response.data;
  },

  deleteIngredient: async (id: number, hardDelete = false) => {
    const response = await axiosInstance.delete(
      `/nutrition/Ingredients/${id}`,
      { params: { hardDelete } }
    );
    return response.data;
  },
};
