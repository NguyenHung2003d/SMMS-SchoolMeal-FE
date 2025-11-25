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
