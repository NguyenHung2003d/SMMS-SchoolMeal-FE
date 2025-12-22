export interface PurchaseOrderLineDto {
  linesId: number;
  ingredientId: number;
  ingredientName: string;
  quantityGram: number;
  unitPrice: number;
  batchNo: string | null;
  origin: string | null;
  expiryDate: string | null; // ISO date string
}

export interface PurchaseOrderDetail {
  orderId: number;
  supplierName: string;
  note: string | null;
  planId: number | null;
  staffInCharged: string | null;
  purchaseOrderStatus: string;
  orderDate: string;
  billImageUrl: string
  lines: PurchaseOrderLineDto[];
}
