export const mockShoppingOrders = [
  {
    orderId: 1,
    orderDate: "2025-10-22T21:12:49.257",
    supplierName: "Công ty TNHH Thực phẩm Xanh",
    purchaseOrderStatus: "Confirmed",
    note: "Đơn hàng thực phẩm tuần 42",
    totalAmount: 220000.0,
  },
  {
    orderId: 2,
    orderDate: "2025-10-25T10:30:00.000",
    supplierName: "Công ty Thực phẩm Sạch",
    purchaseOrderStatus: "Confirmed",
    note: "Đơn hàng rau quả tuần 42",
    totalAmount: 180000.0,
  },
];

export const mockOrderDetails = {
  1: {
    orderId: 1,
    lines: [
      {
        lineId: 1,
        ingredientId: 6,
        quantityGram: 5.88,
        unitPrice: 18000.88,
        batchNo: "BATCH-GAQ-42",
        origin: "Việt Nam",
        expiryDate: "2025-12-31",
        totalPrice: 96000.0,
      },
      {
        lineId: 2,
        ingredientId: 7,
        quantityGram: 10.5,
        unitPrice: 22000.0,
        batchNo: "BATCH-CA-42",
        origin: "Việt Nam",
        expiryDate: "2025-11-30",
        totalPrice: 231000.0,
      },
    ],
  },
  2: {
    orderId: 2,
    lines: [
      {
        lineId: 1,
        ingredientId: 8,
        quantityGram: 15.0,
        unitPrice: 12000.0,
        batchNo: "BATCH-RQ-42",
        origin: "Việt Nam",
        expiryDate: "2025-11-15",
        totalPrice: 180000.0,
      },
    ],
  },
};
