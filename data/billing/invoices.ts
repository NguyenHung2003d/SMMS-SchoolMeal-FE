export const invoices = [
  {
    id: "INV-001",
    type: "tuition",
    amount: 2500000,
    student: "Nguyễn Minh Anh",
    class: "3A",
    parent: "Nguyễn Văn An",
    parentEmail: "nguyenvanan@gmail.com",
    dueDate: "15/11/2023",
    status: "paid",
    paidDate: "10/11/2023",
    paidMethod: "bank",
    items: [
      {
        description: "Học phí tháng 11/2023",
        amount: 2500000,
      },
    ],
  },
  {
    id: "INV-002",
    type: "meal",
    amount: 750000,
    student: "Trần Hoàng Nam",
    class: "2B",
    parent: "Trần Thị Bình",
    parentEmail: "tranthiminh@gmail.com",
    dueDate: "15/11/2023",
    status: "paid",
    paidDate: "12/11/2023",
    paidMethod: "cash",
    items: [
      {
        description: "Tiền ăn tháng 11/2023",
        amount: 750000,
      },
    ],
  },
  {
    id: "INV-003",
    type: "tuition",
    amount: 2500000,
    student: "Lê Thu Hà",
    class: "4C",
    parent: "Lê Văn Cường",
    parentEmail: "levancuong@gmail.com",
    dueDate: "15/11/2023",
    status: "pending",
    paidDate: "",
    paidMethod: "",
    items: [
      {
        description: "Học phí tháng 11/2023",
        amount: 2500000,
      },
    ],
  },
  {
    id: "INV-004",
    type: "activity",
    amount: 350000,
    student: "Phạm Minh Đức",
    class: "1A",
    parent: "Phạm Thị Dung",
    parentEmail: "phamthidung@gmail.com",
    dueDate: "20/11/2023",
    status: "overdue",
    paidDate: "",
    paidMethod: "",
    items: [
      {
        description: "Phí hoạt động ngoại khóa tháng 11/2023",
        amount: 350000,
      },
    ],
  },
  {
    id: "INV-005",
    type: "tuition",
    amount: 2500000,
    student: "Hoàng Thị Mai",
    class: "3A",
    parent: "Hoàng Văn Em",
    parentEmail: "hoangvanem@gmail.com",
    dueDate: "15/11/2023",
    status: "paid",
    paidDate: "05/11/2023",
    paidMethod: "bank",
    items: [
      {
        description: "Học phí tháng 11/2023",
        amount: 2500000,
      },
    ],
  },
];

export const periodOptions = [
    {
      value: 1,
      label: "1 tháng",
    },
    {
      value: 3,
      label: "3 tháng",
    },
    {
      value: 6,
      label: "6 tháng",
    },
    {
      value: 12,
      label: "12 tháng",
    },
  ];