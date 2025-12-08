export interface BaseItem {
  image: string;
  description: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: "info" | "alert" | "success";
}

export interface Features {
  title: string;
  desc: string;
  image: string;
  features?: string[];
  badge?: string;
}

export interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export interface SidebarItemProps {
  href: string;
  icon: any;
  label: string;
  isActive: boolean;
}

export type IconKey = "utensils" | "activity" | "shield" | "gamepad";

export interface FeatureDetails {
  title: string;
  description: string;
  benefits: string[];
  mockupFeatures: string[];
}

export interface Feature {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  image: string,
  color: string;
  bgClass: string;
  accentColor: string;
  details: FeatureDetails;
}