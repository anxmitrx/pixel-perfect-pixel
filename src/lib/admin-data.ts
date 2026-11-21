import type {
  AdminProduct,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  BatchProduction,
  PressureMetrics,
  AuditLog,
} from "@/types/admin";

// Exactly ONE mock product as requested
export const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 1,
    sku: "JC-EDP-KW01",
    name: "Kiwi Crush",
    cat: "EDP",
    price: 1299,
    wasPrice: 1599,
    costPrice: 380,
    stock: 84,
    reservedStock: 12,
    minThreshold: 25,
    rating: 4.8,
    reviews: 412,
    badge: "best",
    notes: "Kiwi · Lime · Green tea",
    scentPyramid: {
      top: ["Zesty Kiwi Pulp", "Italian Lime", "Dewy Bergamot"],
      heart: ["Steeped Green Tea", "Freesia", "Crisp Bamboo"],
      base: ["Clean White Musk", "Sunlit Cedarwood", "Golden Amber"],
      longevity: "8-10 Hours",
      sillage: "Moderate",
    },
    img: "/src/assets/hero-kiwi.jpg",
    video: "/src/assets/vdos/kiwi.mp4",
    bg: "bg-pastel",
    active: true,
    batchCode: "JC-2026-KW04",
  },
];

// Exactly ONE mock order
export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1001",
    orderNumber: "JC-94821",
    createdAt: "2026-11-21T23:45:10Z",
    customerName: "Aanya Singhania",
    email: "aanya.singh@gmail.com",
    phone: "+91 98201 44521",
    address: {
      street: "Flat 14B, Oberoi Sky Heights, Lokhandwala",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
    },
    items: [
      { productId: 1, name: "Kiwi Crush", quantity: 1, unitPrice: 1299, cat: "EDP" },
    ],
    subtotal: 1299,
    discount: 130,
    total: 1169,
    status: "paid",
    paymentMethod: "UPI",
    paymentId: "pay_upi_984182901",
    trackingNumber: "BLU-88294101",
    courier: "Bluedart Express",
    isRushOrder: false,
    timeline: [
      { title: "Order Placed", timestamp: "23:45", description: "Customer paid via Google Pay UPI" },
      { title: "Payment Verified", timestamp: "23:46", description: "Razorpay settled successfully" },
    ],
  },
];

// Exactly ONE mock customer
export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust-1",
    name: "Aanya Singhania",
    email: "aanya.singh@gmail.com",
    phone: "+91 98201 44521",
    city: "Mumbai",
    totalOrders: 1,
    totalSpent: 1169,
    favoriteScent: "Kiwi Crush",
    tier: "Juicy Silver",
    lastOrderDate: "2026-11-21",
  },
];

// Exactly ONE mock coupon
export const INITIAL_COUPONS: AdminCoupon[] = [
  {
    code: "JUICY10",
    discountType: "percent",
    amount: 10,
    minSpend: 999,
    usageCount: 142,
    usageLimit: 5000,
    active: true,
    expiresAt: "2026-12-31",
    description: "Welcome 10% discount on orders above ₹999",
  },
];

// Exactly ONE mock batch
export const INITIAL_BATCHES: BatchProduction[] = [
  {
    id: "batch-1",
    batchCode: "JC-2026-KW04",
    fragranceName: "Kiwi Crush",
    fragranceCategory: "EDP",
    liters: 150,
    yieldBottles: 1500,
    macerationStartDate: "2026-11-01",
    macerationTargetDays: 28,
    daysAged: 21,
    alcoholPercentage: 80,
    qcStatus: "Filtration",
    perfumerNote: "Exceptional top note clarity; green tea accords perfectly rounded with Italian lime.",
  },
];

export const INITIAL_PRESSURE_METRICS: PressureMetrics = {
  rps: 42,
  peakRps: 1240,
  activeSessions: 184,
  edgeCacheHitRate: 98.4,
  p99LatencyMs: 32,
  checkoutQueueDepth: 1,
  originServerLoad: 24,
  dbConnectionsActive: 12,
  flashDropMode: false,
  waitingRoomActive: false,
  waitingRoomPassRate: 150,
  botShieldLevel: "Standard",
  inventoryBufferLocked: true,
  cdnStatus: "Operational",
  paymentGatewayHealth: {
    upi: 99.8,
    cards: 99.2,
    cod: 100,
  },
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "23:46:12",
    actor: "System Engine",
    action: "Catalog Initialized",
    category: "Inventory",
    severity: "info",
    details: "Production catalog ready for live entries with single flagship Kiwi Crush baseline.",
  },
];
