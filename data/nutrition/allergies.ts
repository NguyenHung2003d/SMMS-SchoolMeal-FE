export const ALLERGY_LIST = [
  "Đậu phộng",
  "Hải sản",
  "Sữa",
  "Trứng",
  "Lúa mì",
  "Đậu nành",
] as const;

export const allergyAlerts = [
  {
    id: 1,
    student: "Nguyễn Minh Anh",
    class: "3A",
    allergies: ALLERGY_LIST[2],
    meal: "Bữa trưa",
    dish: "Sữa chua & hoa quả",
    status: "high",
    date: "24/10/2023",
  },
  {
    id: 2,
    student: "Trần Hoàng Nam",
    class: "2B",
    allergies: ALLERGY_LIST[0],
    meal: "Bữa trưa",
    dish: "Cơm gà rau củ",
    status: "medium",
    date: "24/10/2023",
  },
  {
    id: 3,
    student: "Phạm Tuấn Kiệt",
    class: "3A",
    allergies: ALLERGY_LIST[1],
    meal: "Bữa trưa",
    dish: "Bún riêu cua",
    status: "high",
    date: "27/10/2023",
  },
];
