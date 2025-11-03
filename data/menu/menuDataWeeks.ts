import { DayMenu, WeekKey } from "@/types";

export const menuDataWeeks: Record<WeekKey, DayMenu[]> = {
  week1: [
    {
      day: "Thứ 2",
      date: "30/09/2025",
      details: {
        morning: ["Cháo gà", "Sữa tươi"],
        lunch: ["Cơm + cá sốt cà", "Canh bí đỏ"],
        afternoon: ["Bánh flan", "Nước cam"],
        nutrition: { calories: 550, protein: 25, carbs: 60, fat: 15 },
      },
    },
    {
      day: "Thứ 3",
      date: "01/10/2025",
      details: {
        morning: ["Bún bò Huế", "Trà lúa mạch"],
        lunch: ["Cơm + gà kho gừng", "Canh rau ngót"],
        afternoon: ["Sữa chua", "Bánh quy"],
        nutrition: { calories: 560, protein: 27, carbs: 58, fat: 14 },
      },
    },
    {
      day: "Thứ 4",
      date: "02/10/2025",
      details: {
        morning: ["Mì xào bò", "Sữa đậu nành"],
        lunch: ["Cơm + thịt heo chiên", "Canh cải xanh"],
        afternoon: ["Trái cây", "Nước ép táo"],
        nutrition: { calories: 540, protein: 24, carbs: 62, fat: 13 },
      },
    },
    {
      day: "Thứ 5",
      date: "03/10/2025",
      details: {
        morning: ["Bánh cuốn", "Sữa tươi"],
        lunch: ["Cơm + cá chiên", "Canh khổ qua nhồi thịt"],
        afternoon: ["Rau câu", "Nước cam"],
        nutrition: { calories: 570, protein: 26, carbs: 64, fat: 16 },
      },
    },
    {
      day: "Thứ 6",
      date: "04/10/2025",
      details: {
        morning: ["Phở bò", "Sữa tươi"],
        lunch: ["Cơm + thịt kho trứng", "Canh chua cá lóc"],
        afternoon: ["Bánh bông lan", "Trà đào"],
        nutrition: { calories: 590, protein: 28, carbs: 63, fat: 17 },
      },
    },
  ],
  week2: [
    {
      day: "Thứ 2",
      date: "07/10/2025",
      details: {
        morning: ["Xôi đậu phộng", "Sữa tươi"],
        lunch: ["Cơm + thịt bò xào", "Canh rau muống"],
        afternoon: ["Bánh su kem", "Nước ép cam"],
        nutrition: { calories: 560, protein: 26, carbs: 61, fat: 15 },
      },
    },
    // ... các ngày tiếp theo tương tự
  ],
};