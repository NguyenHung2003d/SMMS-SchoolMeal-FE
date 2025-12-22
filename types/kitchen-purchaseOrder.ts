export interface PurchaseOrderSummaryDto {
  orderId: number;
  orderDate: string;
  purchaseOrderStatus: string;
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
