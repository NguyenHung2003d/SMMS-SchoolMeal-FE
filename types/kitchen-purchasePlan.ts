export interface PurchasePlanLine {
  ingredientId: number;
  ingredientName: string;
  category: string;
  rqQuanityGram: number;
  estimatedPrice: number
  actualPrice?: number;
  supplierName?: string;
  batchNo?: string;
  origin?: string;
  status: "Pending" | "Purchased" | "OutOfStock";
}

export interface PurchasePlan {
  planId: number;
  planStatus: string;
  startDate: string;
  endDate: string;
  lines: PurchasePlanLine[];
  totalEstimatedCost: number;
  note?: string;
  supplierName?: string; // Field mới để lưu Supplier khi complete
}
