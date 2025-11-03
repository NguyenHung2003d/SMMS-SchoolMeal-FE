"use client";

export default function OrdersTable({ orders }: { orders: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium">Đơn đặt hàng</h2>
        <button className="flex items-center text-sm text-orange-500 hover:text-orange-600">
          + Tạo đơn đặt hàng mới
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nhà cung cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Các mặt hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày giao dự kiến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tổng tiền
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">#{order.id}</td>
                <td className="px-6 py-4">{order.supplier}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {order.items.map((i: string, idx: number) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-gray-500">{order.orderDate}</td>
                <td className="px-6 py-4 text-gray-500">
                  {order.expectedDelivery}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        order.status === "Đang giao hàng"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Đã xác nhận"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
