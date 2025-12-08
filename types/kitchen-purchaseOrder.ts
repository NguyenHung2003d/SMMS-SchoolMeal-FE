export interface PurchaseOrderSummaryDto {
  orderId: number;
  orderDate: string;
  purchaseOrderStatus: string; // 'Draft', 'Confirmed'...
  supplierName: string;
  planId: number;
  linesCount: number;
  totalQuantityGram: number;
}

export interface PurchaseOrderDetailDto {
  orderId: number;
  schoolId: string;
  orderDate: string;
  purchaseOrderStatus: string;
  supplierName: string;
  note: string;
  planId: number;
  staffInCharged: string; 
  lines: any[];
}

export interface KsPurchaseOrderDetailDto {
  linesId: number;
  ingredientId: number;
  ingredientName: string;
  quantityGram: number;
  unitPrice?: number;
  batchNo?: string;
  origin?: string;
  expiryDate?: string;
}

export interface CreatePurchaseOrderFromPlanRequest {
  planId: number;
  supplierName: string;
  note?: string;
  lines: {
    ingredientId: number;
    quantityOverrideGram?: number;
    unitPrice: number;
    batchNo?: string;
    origin?: string;
    expiryDate?: string;
  }[];
}