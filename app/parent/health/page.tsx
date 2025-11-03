'use client'
import TrackBMI from "@/components/parents/TrackBMI";
import { useSelectedChild } from "@/context/SelectedChildContext";

export default function HealthPage() {
  const { selectedChild } = useSelectedChild();
  return <TrackBMI selectedChild={selectedChild} />;
}
