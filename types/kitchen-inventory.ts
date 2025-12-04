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
