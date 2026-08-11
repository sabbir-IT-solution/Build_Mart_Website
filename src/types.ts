export type ProductCategory = 'rod' | 'cement' | 'sand' | 'brick' | 'other';
export type AdminRole = 'owner' | 'developer';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  unitPrice: number; // in BDT
  unit: string; // e.g., 'টন', 'ব্যাগ', 'সিএফটি', 'হাজার'
  minOrder: string;
  inStock: boolean;
  image?: string;
}

export interface QuoteInquiry {
  id: string;
  date: string;
  name: string;
  phone: string;
  address: string;
  productName: string;
  quantity: string;
  estimatedCost?: number;
  note: string;
  status: 'pending' | 'contacted' | 'completed';
}

export interface CustomerReview {
  id: string;
  name: string;
  roleOrLocation: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified?: boolean;
}

export interface CompletedProject {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'infrastructure';
  location: string;
  completionYear: string;
  materialsSupplied: string[];
  image: string;
  description: string;
  clientName?: string;
}

export interface DeliveryTruck {
  id: string;
  title: string;
  capacity: string;
  idealFor: string;
  iconName: string;
  available: boolean;
}

export interface SiteData {
  brandName: string;
  phone: string;
  address: string;
  email: string;
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  ownerName: string;
  ownerTitle: string;
  ownerIntro: string;
  logo: string;
  ownerPhoto: string;
  heroBgImage: string;
  adminUsername?: string;
  adminPassword?: string;
  developerUsername?: string;
  developerPassword?: string;
  // Web Creator / Developer Advertisement fields
  devBrandName?: string;
  devLogo?: string;
  devTagline?: string;
  devWebsiteUrl?: string;
  devPhone?: string;
  // Mobile Notification Settings
  telegramBotToken?: string;
  telegramChatId?: string;
  // Startup Loading Animation Settings
  enableLoadingAnimation?: boolean;
  loadingTitle?: string;
  loadingLogo?: string;
  loadingBgColor?: string;
  loadingAccentColor?: string;
  loadingDuration?: number;
}
