export interface UserAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserOrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  status: "Processing" | "Packed" | "Shipped" | "Delivered";
  courier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  total: number;
  items: Array<{
    name: string;
    cat: string;
    qty: number;
    price: number;
    img?: string;
  }>;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  tier: "Standard" | "Juicy Silver" | "Juicy Gold" | "Amber Connoisseur";
  points: number; // e.g. 850 points = ₹850 credit
  pointsToNextTier: number;
  nextTier: string;
  scentPersona: string;
  favoriteNotes: string[];
  addresses: UserAddress[];
  orders: UserOrderHistoryItem[];
  notifications: {
    whatsappUpdates: boolean;
    flashDropSms: boolean;
    newsletter: boolean;
  };
}

