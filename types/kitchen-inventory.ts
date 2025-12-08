export interface InventoryItemDto {
  itemId: number;
  schoolId: string;
  ingredientId: number;
  ingredientName?: string;
  quantityGram: number;
  expirationDate?: string; // DateOnly trả về string "yyyy-mm-dd"
  batchNo?: string;
  origin?: string;
}

export interface PagedResult<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface UpdateInventoryItemRequest {
  quantityGram?: number;
  expirationDate?: string;
  batchNo?: string;
  origin?: string;
}

export interface IngredientDto {
  ingredientId: number;
  ingredientName: string;
  unit: string;        // Đơn vị tính (kg, g, lít...)
  kcal100g?: number;   // Calo trên 100g
  isActive: boolean;
}

export interface CreateIngredientRequest {
  ingredientName: string;
  unit: string;
  kcal100g?: number;
  // ...
}

export interface UpdateIngredientRequest {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  kcal100g?: number;
  isActive: boolean;
}