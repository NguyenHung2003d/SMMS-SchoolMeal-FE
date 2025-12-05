export interface PurchaseOrderLine {
  linesId: number;
  ingredientId: number;
  ingredientName: string;
  quantityGram: number;
  unitPrice: number;
  batchNo: string | null;
  origin: string | null;
  expiryDate: string | null;
}

export interface PurchaseOrderDetail {
  orderId: number;
  schoolId: string;
  orderDate: string;
  purchaseOrderStatus: string;
  supplierName: string;
  note: string | null;
  planId: number | null;
  staffInCharged: string;
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderSummary {
  orderId: number;
  orderDate: string;
  purchaseOrderStatus: string;
  supplierName: string;
  planId: number | null;
  linesCount: number;
  totalQuantityGram: number;
}

export interface PurchaseOrderFilter {
  fromDate?: string;
  toDate?: string;
}
