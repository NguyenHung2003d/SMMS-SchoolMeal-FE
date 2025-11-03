"use client";

import { TabContentProps } from "@/types";
import LeaveApplicationSection from "./LeaveApplication";
import RegisterMeal from "./RegisterMeal";
import TrackBMISection from "./TrackBMI";
import UpdateProfileSection from "./UpdateProfile";
import ViewInvoiceSection from "./ViewInvoice";
import MenuAndFeedback from "./MenuAndFeedback";

export default function TabContent({
  activeTab,
  selectedChild,
}: TabContentProps) {
  const tabs: Record<string, any> = {
    register: RegisterMeal,
    profile: UpdateProfileSection,
    health: TrackBMISection,
    menu_and_feedback: MenuAndFeedback,
    invoice: ViewInvoiceSection,
    leave: LeaveApplicationSection,
  };

  const Component = tabs[activeTab] || RegisterMeal;
  return <Component selectedChild={selectedChild} />;
}
