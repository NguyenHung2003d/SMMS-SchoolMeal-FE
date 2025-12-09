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
  orderId: number; // Có thể cần lấy từ context hoặc props khác nếu API không trả về
  supplierName: string;
  note: string | null;
  planId: number | null;
  staffInCharged: string | null;
  purchaseOrderStatus: string; // Cần đảm bảo có trường này để hiện trạng thái
  orderDate: string; // Cần đảm bảo có trường này
  lines: PurchaseOrderLineDto[]; // Map dữ liệu API vào mảng này
}
