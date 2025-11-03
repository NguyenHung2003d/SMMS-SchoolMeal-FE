import { MenuItem, WeeklyMenu } from "@/types";

export const menuData: MenuItem[] = [
  {
    day: "Thứ 2",
    date: "30/09/2025",
    morning: "Bánh mì trứng, Sữa tươi",
    lunch: "Cơm, Thịt kho tàu, Canh rau",
    afternoon: "Xôi đậu xanh, Nước ép trái cây",
    details: {
      morning: ["Bánh mì trứng (2 ổ)", "Sữa tươi (200ml)", "Chuối"],
      lunch: [
        "Cơm trắng (1 chén)",
        "Thịt kho tàu (100g)",
        "Canh rau ngót",
        "Dưa leo",
      ],
      afternoon: ["Xôi đậu xanh (1 phần)", "Nước ép cam (150ml)"],
      nutrition: {
        calories: 1450,
        protein: 45,
        carbs: 185,
        fat: 38,
      },
    },
  },
  {
    day: "Thứ 3",
    date: "01/10/2025",
    morning: "Phở gà, Sữa đậu nành",
    lunch: "Cơm, Cá kho, Rau xào",
    afternoon: "Bánh bao, Trà sữa",
    details: {
      morning: ["Phở gà (1 tô)", "Sữa đậu nành (200ml)", "Táo"],
      lunch: [
        "Cơm trắng (1 chén)",
        "Cá kho (80g)",
        "Rau xào thập cẩm",
        "Canh bí đỏ",
      ],
      afternoon: ["Bánh bao nhân thịt (1 cái)", "Trà sữa (150ml)"],
      nutrition: {
        calories: 1480,
        protein: 48,
        carbs: 190,
        fat: 35,
      },
    },
  },
  {
    day: "Thứ 4",
    date: "02/10/2025",
    morning: "Xôi gà, Sữa chua",
    lunch: "Cơm, Sườn xào chua ngọt, Canh chua",
    afternoon: "Chè đậu xanh, Nước cam",
    details: {
      morning: ["Xôi gà (1 phần)", "Sữa chua (1 hộp)", "Nho"],
      lunch: [
        "Cơm trắng (1 chén)",
        "Sườn xào chua ngọt (100g)",
        "Canh chua cá",
        "Đậu que luộc",
      ],
      afternoon: ["Chè đậu xanh (1 chén)", "Nước cam ép (150ml)"],
      nutrition: {
        calories: 1520,
        protein: 50,
        carbs: 195,
        fat: 40,
      },
    },
  },
  {
    day: "Thứ 5",
    date: "03/10/2025",
    morning: "Bún bò, Sữa tươi",
    lunch: "Cơm, Gà chiên mắm, Canh rau",
    afternoon: "Bánh flan, Sinh tố bơ",
    details: {
      morning: ["Bún bò (1 tô)", "Sữa tươi (200ml)", "Xoài"],
      lunch: [
        "Cơm trắng (1 chén)",
        "Gà chiên mắm (1 miếng)",
        "Canh rau ngót",
        "Cà rót",
      ],
      afternoon: ["Bánh flan (1 phần)", "Sinh tố bơ (150ml)"],
      nutrition: {
        calories: 1500,
        protein: 52,
        carbs: 188,
        fat: 42,
      },
    },
  },
  {
    day: "Thứ 6",
    date: "04/10/2025",
    morning: "Cháo thịt, Sữa đậu nành",
    lunch: "Cơm, Cá rán, Rau luộc",
    afternoon: "Bánh ngọt, Nước ép dứa",
    details: {
      morning: ["Cháo thịt (1 tô)", "Sữa đậu nành (200ml)", "Ổi"],
      lunch: ["Cơm trắng (1 chén)", "Cá rán (100g)", "Rau luộc", "Canh bí đao"],
      afternoon: ["Bánh ngọt (2 cái)", "Nước ép dứa (150ml)"],
      nutrition: {
        calories: 1440,
        protein: 46,
        carbs: 182,
        fat: 36,
      },
    },
  },
];

export const sampleMenus: WeeklyMenu[] = [
  {
    weekId: "week1",
    period: "30/09 - 04/10/2025",
    days: [
      {
        date: "30/09/2025",
        dayOfWeek: "Thứ Hai",
        meals: {
          lunch: {
            name: "Bữa trưa",
            dishes: ["Cơm", "Thịt kho tàu", "Canh rau cải"],
          },
        },
      },
      {
        date: "01/10/2025",
        dayOfWeek: "Thứ Ba",
        meals: {
          lunch: {
            name: "Bữa trưa",
            dishes: ["Cơm", "Cá chiên xù", "Canh bí đao"],
          },
        },
      },
      {
        date: "02/10/2025",
        dayOfWeek: "Thứ Tư",
        meals: {
          lunch: {
            name: "Bữa trưa",
            dishes: ["Cơm", "Gà rang gừng", "Canh mồng tơi"],
          },
        },
      },
      {
        date: "03/10/2025",
        dayOfWeek: "Thứ Năm",
        meals: {
          lunch: {
            name: "Bữa trưa",
            dishes: ["Cơm", "Tôm rim thịt", "Canh chua"],
          },
        },
      },
      {
        date: "04/10/2025",
        dayOfWeek: "Thứ Sáu",
        meals: {
          lunch: {
            name: "Bữa trưa",
            dishes: ["Cơm", "Sườn nướng", "Canh khoai mỡ"],
          },
        },
      },
    ],
  },
];
