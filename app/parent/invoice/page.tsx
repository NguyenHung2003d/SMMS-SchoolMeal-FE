"use client";
import ViewInvoice from "@/components/parents/ViewInvoice";
import { useSelectedChild } from "@/context/SelectedChildContext";

export default function InvoicePage() {
  const { selectedChild } = useSelectedChild();
  return <ViewInvoice selectedChild={selectedChild} />;
}
