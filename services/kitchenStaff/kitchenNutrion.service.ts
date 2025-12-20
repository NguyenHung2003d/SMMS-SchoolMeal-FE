import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateIngredientRequest,
  FoodItemDto,
  IngredientDto,
} from "@/types/kitchen-nutrition";

export const kitchenNutritionService = {
  getFoods: async (keyword?: string) => {
    const params = keyword ? `?keyword=${keyword}` : "";
    const res = await axiosInstance.get<FoodItemDto[]>(
      `/nutrition/FoodItems${params}`
    );
    return res.data;
  },

  createFood: async (data: {
    foodName: string;
    foodType: string;
    foodDesc: string;
    isMainDish: boolean;
    imageFile?: File | null;
    ingredients: { ingredientId: number; quantityGram: number }[];
  }) => {
    const formData = new FormData();
    formData.append("FoodName", data.foodName);
    formData.append("FoodType", data.foodType);
    formData.append("FoodDesc", data.foodDesc);
    formData.append("IsMainDish", data.isMainDish.toString());

    if (data.imageFile) {
      formData.append("ImageFile", data.imageFile);
    }

    data.ingredients.forEach((ing, index) => {
      formData.append(
        `Ingredients[${index}].IngredientId`,
        ing.ingredientId.toString()
      );
      formData.append(
        `Ingredients[${index}].QuantityGram`,
        ing.quantityGram.toString()
      );
    });

    const res = await axiosInstance.post<FoodItemDto>(
      "/nutrition/FoodItems",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  updateFood: async (
    id: number,
    data: {
      foodName: string;
      foodType: string;
      foodDesc: string;
      isMainDish: boolean;
      imageFile?: File | null;
      ingredients: { ingredientId: number; quantityGram: number }[];
    }
  ) => {
    const formData = new FormData();
    formData.append("FoodName", data.foodName);
    formData.append("FoodType", data.foodType);
    formData.append("FoodDesc", data.foodDesc);
    formData.append("IsMainDish", data.isMainDish.toString());

    if (data.imageFile) {
      formData.append("ImageFile", data.imageFile);
    }

    data.ingredients.forEach((ing, index) => {
      formData.append(
        `Ingredients[${index}].IngredientId`,
        ing.ingredientId.toString()
      );
      formData.append(
        `Ingredients[${index}].QuantityGram`,
        ing.quantityGram.toString()
      );
    });
    const res = await axiosInstance.put<FoodItemDto>(
      `/nutrition/FoodItems/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  deleteFood: async (id: number) => {
    await axiosInstance.delete(`/nutrition/FoodItems/${id}`);
  },

  getIngredients: async (keyword?: string) => {
    const params = keyword ? `?keyword=${keyword}` : "";
    const res = await axiosInstance.get<IngredientDto[]>(
      `/nutrition/Ingredients${params}`
    );
    return res.data;
  },

  createIngredient: async (data: CreateIngredientRequest) => {
    const res = await axiosInstance.post<IngredientDto>(
      "/nutrition/Ingredients",
      data
    );
    return res.data;
  },
};
