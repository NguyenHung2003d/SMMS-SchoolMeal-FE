export interface NavigationItem {
  label: string;
  href: string;
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