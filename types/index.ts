export interface NavigationItem {
  label: string;
  href: string;
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

export interface FeatureDetails {
  title: string;
  description: string;
  benefits: string[];
  mockupFeatures: string[];
}