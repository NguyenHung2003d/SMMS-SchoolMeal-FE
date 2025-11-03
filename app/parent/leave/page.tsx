"use client";
import LeaveApplication from "@/components/parents/LeaveApplication";
import { useSelectedChild } from "@/context/SelectedChildContext";

export default function LeavePage() {
  const { selectedChild } = useSelectedChild();
  return <LeaveApplication selectedChild={selectedChild} />;
}
