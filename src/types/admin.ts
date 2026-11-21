export type ProductCategory = "EDP" | "Attar" | "Gifting" | "Extrait" | "Cologne";

export type ProductBadge = "sale" | "best" | "new" | "soldout";

export interface ScentPyramid {
  top: string[];
  heart: string[];
  base: string[];
  longevity: string; // e.g., "8-10 Hours"
  sillage: "Intimate" | "Moderate" | "Enormous";
}

export interface AdminProduct {
  id: number;
  sku: string;
  name: string;
  cat: ProductCategory;
  price: number;
  wasPrice?: number;
  costPrice: number;
  stock: number;
  reservedStock: number;
  minThreshold: number;
  rating: number;
  reviews: number;
  badge?: ProductBadge;
  notes: string;
  scentPyramid: ScentPyramid;
  img: string;
  video?: string;
  bg: string;
  active: boolean;
  batchCode: string;
}

export type OrderStatus =
  | "pending"
  | "queue_hold"
  | "paid"
  | "packing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "UPI" | "Credit Card" | "RuPay" | "COD" | "NetBanking";

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  cat: string;
  img?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  trackingNumber?: string;
  courier?: "Bluedart Express" | "Delhivery Air" | "Shiprocket Priority" | "India Post";
  isRushOrder?: boolean;
  timeline: Array<{
    title: string;
    timestamp: string;
    description: string;
  }>;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  favoriteScent: string;
  tier: "Standard" | "Juicy Silver" | "Juicy Gold" | "Amber Connoisseur";
  lastOrderDate: string;
}

export interface AdminCoupon {
  code: string;
  discountType: "percent" | "fixed";
  amount: number;
  minSpend: number;
  usageCount: number;
  usageLimit: number;
  active: boolean;
  expiresAt: string;
  description: string;
}

export interface BatchProduction {
  id: string;
  batchCode: string;
  fragranceName: string;
  fragranceCategory: ProductCategory;
  liters: number;
  yieldBottles: number;
  macerationStartDate: string;
  macerationTargetDays: number;
  daysAged: number;
  alcoholPercentage: number;
  qcStatus: "Macerating" | "Filtration" | "QC Passed" | "Bottling Ready" | "Released";
  perfumerNote: string;
}

export interface PressureMetrics {
  rps: number;
  peakRps: number;
  activeSessions: number;
  edgeCacheHitRate: number; // e.g. 96.8
  p99LatencyMs: number; // e.g. 38
  checkoutQueueDepth: number; // e.g. 14
  originServerLoad: number; // e.g. 32%
  dbConnectionsActive: number; // e.g. 18 / 100
  flashDropMode: boolean;
  waitingRoomActive: boolean;
  waitingRoomPassRate: number; // orders per minute permitted
  botShieldLevel: "Standard" | "Aggressive" | "Maximum Under Attack";
  inventoryBufferLocked: boolean;
  cdnStatus: "Operational" | "Degraded" | "Purging";
  paymentGatewayHealth: {
    upi: number; // success rate %
    cards: number;
    cod: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: "Security" | "Inventory" | "Orders" | "Pressure" | "Price";
  severity: "info" | "warning" | "critical";
  details: string;
}

