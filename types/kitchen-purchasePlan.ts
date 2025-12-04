export interface PurchasePlanItem {
  ingredientId: number;
  ingredientName: string;
  category: string;
  rqQuanityGram: number;
  estimatedPrice: number; // Đơn giá dự kiến
  actualPrice?: number;   // Đơn giá thực tế (User nhập)
  supplierName?: string;  // Tạm thời để ở item hoặc gom chung
  batchNo?: string; 
  origin?: string;
  status: 'Pending' | 'Purchased' | 'OutOfStock';
}

export interface PurchasePlan {
  planId: number;
  planStatus: string;
  startDate: string;
  endDate: string;
  lines: PurchasePlanItem[];
  totalEstimatedCost: number;
  note?: string;
  supplierName?: string; // Field mới để lưu Supplier khi complete
}