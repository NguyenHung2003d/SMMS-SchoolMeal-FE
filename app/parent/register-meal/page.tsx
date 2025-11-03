"use client";

import RegisterMeal from "@/components/parents/RegisterMeal";
import { useSelectedChild } from "@/context/SelectedChildContext";

export default function RegisterMealPage() {
  const { selectedChild } = useSelectedChild();
  return <RegisterMeal selectedChild={selectedChild} />;
}
