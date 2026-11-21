import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type {
  AdminProduct,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  BatchProduction,
  PressureMetrics,
  AuditLog,
  OrderStatus,
} from "@/types/admin";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_BATCHES,
  INITIAL_PRESSURE_METRICS,
  INITIAL_AUDIT_LOGS,
} from "./admin-data";
import { toast } from "sonner";

interface AdminContextType {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  coupons: AdminCoupon[];
  batches: BatchProduction[];
  metrics: PressureMetrics;
  auditLogs: AuditLog[];
  autoStreamOrders: boolean;
  soundEnabled: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoStreamOrders: (enabled: boolean) => void;

  // Product Actions
  updateProduct: (id: number, updates: Partial<AdminProduct>) => void;
  addProduct: (product: Omit<AdminProduct, "id">) => void;
  deleteProduct: (id: number) => void;
  quickAdjustStock: (id: number, delta: number) => void;

  // Order Actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  bulkUpdateOrderStatus: (orderIds: string[], status: OrderStatus) => void;
  assignCourier: (orderId: string, courier: AdminOrder["courier"], trackingNumber: string) => void;
  deleteOrder: (orderId: string) => void;
  injectStressOrders: (count: number) => void;

  // Pressure & Resilience Controls
  toggleFlashDropMode: () => void;
  toggleWaitingRoom: () => void;
  setWaitingRoomPassRate: (rate: number) => void;
  setBotShieldLevel: (level: PressureMetrics["botShieldLevel"]) => void;
  toggleInventoryBufferLock: () => void;
  purgeEdgeCache: () => void;
  simulateRushTraffic: (targetRps: number) => void;

  // Coupon Actions
  addCoupon: (coupon: AdminCoupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Batch Lab Actions
  updateBatchStatus: (id: string, qcStatus: BatchProduction["qcStatus"], note?: string) => void;

  // System
  addAuditLog: (action: string, category: AuditLog["category"], details: string, severity?: AuditLog["severity"]) => void;
  resetAllData: () => void;
  exportDatabaseJSON: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const STORAGE_KEYS = {
  products: "juice_admin_products_v5",
  orders: "juice_admin_orders_v5",
  customers: "juice_admin_customers_v5",
  coupons: "juice_admin_coupons_v5",
  batches: "juice_admin_batches_v5",
  metrics: "juice_admin_metrics_v5",
  logs: "juice_admin_logs_v5",
  sound: "juice_admin_sound_v5",
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStreamOrders, setAutoStreamOrders] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize state with SSR-safe initial defaults
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(INITIAL_COUPONS);
  const [batches, setBatches] = useState<BatchProduction[]>(INITIAL_BATCHES);
  const [metrics, setMetrics] = useState<PressureMetrics>(INITIAL_PRESSURE_METRICS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Hydrate once safely on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedProds = localStorage.getItem(STORAGE_KEYS.products);
      if (savedProds) {
        const parsed = JSON.parse(savedProds);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }
      const savedOrders = localStorage.getItem(STORAGE_KEYS.orders);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) setOrders(parsed);
      }
      const savedCustomers = localStorage.getItem(STORAGE_KEYS.customers);
      if (savedCustomers) {
        const parsed = JSON.parse(savedCustomers);
        if (Array.isArray(parsed)) setCustomers(parsed);
      }
      const savedCoupons = localStorage.getItem(STORAGE_KEYS.coupons);
      if (savedCoupons) {
        const parsed = JSON.parse(savedCoupons);
        if (Array.isArray(parsed)) setCoupons(parsed);
      }
      const savedBatches = localStorage.getItem(STORAGE_KEYS.batches);
      if (savedBatches) {
        const parsed = JSON.parse(savedBatches);
        if (Array.isArray(parsed)) setBatches(parsed);
      }
      const savedLogs = localStorage.getItem(STORAGE_KEYS.logs);
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) setAuditLogs(parsed);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  // Sync state changes to localStorage ONLY after hydration has finished
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    } catch {}
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {}
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.coupons, JSON.stringify(coupons));
    } catch {}
  }, [coupons, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.batches, JSON.stringify(batches));
    } catch {}
  }, [batches, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(auditLogs.slice(0, 100)));
    } catch {}
  }, [auditLogs, isHydrated]);

  // Real-time synchronization across browser tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.products && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === STORAGE_KEYS.orders && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const playBeep = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [soundEnabled]);

  const addAuditLog = useCallback((
    action: string,
    category: AuditLog["category"],
    details: string,
    severity: AuditLog["severity"] = "info"
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
      actor: "Lead Ops Admin",
      action,
      category,
      severity,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  // Product Actions
  const updateProduct = useCallback((id: number, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    addAuditLog("Product Updated", "Inventory", `Updated SKU/Stock/Price for Product #${id}`);
    toast.success("Product updated successfully");
  }, [addAuditLog]);

  const addProduct = useCallback((productData: Omit<AdminProduct, "id">) => {
    setProducts((prev) => {
      const newId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      const newProduct: AdminProduct = { ...productData, id: newId };
      return [newProduct, ...prev];
    });
    addAuditLog("New Product Created", "Inventory", `Created product: ${productData.name} (${productData.sku})`);
    toast.success(`Created "${productData.name}"`);
  }, [addAuditLog]);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog("Product Deleted", "Inventory", `Removed product #${id}`, "warning");
    toast.info("Product removed from catalog");
  }, [addAuditLog]);

  const quickAdjustStock = useCallback((id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = Math.max(0, p.stock + delta);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );
    playBeep();
  }, [playBeep]);

  // Order Actions
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const timelineEntry = {
            title: `Status changed to ${status.toUpperCase()}`,
            timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            description: `Updated by operations desk`,
          };
          return {
            ...o,
            status,
            timeline: [timelineEntry, ...o.timeline],
          };
        }
        return o;
      })
    );
    addAuditLog("Order Status Changed", "Orders", `Order #${orderId} marked as ${status}`);
    toast.success(`Order status changed to ${status}`);
  }, [addAuditLog]);

  const bulkUpdateOrderStatus = useCallback((orderIds: string[], status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (orderIds.includes(o.id)) {
          return {
            ...o,
            status,
            timeline: [
              {
                title: `Bulk Status: ${status.toUpperCase()}`,
                timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                description: `Batch fulfilled in single dispatch batch`,
              },
              ...o.timeline,
            ],
          };
        }
        return o;
      })
    );
    addAuditLog("Bulk Order Update", "Orders", `Updated ${orderIds.length} orders to ${status}`);
    toast.success(`Updated ${orderIds.length} orders to ${status}`);
  }, [addAuditLog]);

  const assignCourier = useCallback((
    orderId: string,
    courier: AdminOrder["courier"],
    trackingNumber: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            courier,
            trackingNumber,
            status: "shipped",
            timeline: [
              {
                title: `Dispatched via ${courier}`,
                timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                description: `Airway bill #${trackingNumber} generated`,
              },
              ...o.timeline,
            ],
          };
        }
        return o;
      })
    );
    addAuditLog("Courier Assigned", "Orders", `Order #${orderId} dispatched with ${courier} (${trackingNumber})`);
    toast.success(`Dispatched via ${courier}`);
  }, [addAuditLog]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addAuditLog("Order Deleted", "Orders", `Deleted order #${orderId}`, "warning");
    toast.info(`Deleted order #${orderId}`);
  }, [addAuditLog]);

  // Pressure & Resilience Controls
  const toggleFlashDropMode = useCallback(() => {
    setMetrics((prev) => {
      const nextMode = !prev.flashDropMode;
      return {
        ...prev,
        flashDropMode: nextMode,
        edgeCacheHitRate: nextMode ? 99.2 : 97.4,
        botShieldLevel: nextMode ? "Aggressive" : "Standard",
        waitingRoomActive: nextMode ? true : prev.waitingRoomActive,
      };
    });
    setMetrics((m) => {
      addAuditLog(
        m.flashDropMode ? "Flash Drop Mode ACTIVATED" : "Flash Drop Mode DEACTIVATED",
        "Pressure",
        m.flashDropMode
          ? "Aggressive edge caching & queue waiting room engaged to absorb traffic surge."
          : "Normal catalog serving restored.",
        m.flashDropMode ? "warning" : "info"
      );
      return m;
    });
    toast.success(`Flash Drop Mode ${!metrics.flashDropMode ? "Activated 🚀" : "Deactivated"}`);
  }, [addAuditLog, metrics.flashDropMode]);

  const toggleWaitingRoom = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      waitingRoomActive: !prev.waitingRoomActive,
    }));
    addAuditLog("Waiting Room Toggled", "Pressure", `Queue Waiting room is now ${!metrics.waitingRoomActive ? "ON" : "OFF"}`);
    toast.info(`Checkout Waiting Room ${!metrics.waitingRoomActive ? "Enabled" : "Disabled"}`);
  }, [addAuditLog, metrics.waitingRoomActive]);

  const setWaitingRoomPassRate = useCallback((rate: number) => {
    setMetrics((prev) => ({ ...prev, waitingRoomPassRate: rate }));
    addAuditLog("Pass Rate Adjusted", "Pressure", `Waiting room pass rate set to ${rate} req/min`);
  }, [addAuditLog]);

  const setBotShieldLevel = useCallback((level: PressureMetrics["botShieldLevel"]) => {
    setMetrics((prev) => ({ ...prev, botShieldLevel: level }));
    addAuditLog("Bot Shield Adjusted", "Security", `Challenge rigor set to ${level}`);
    toast.success(`Bot Shield: ${level}`);
  }, [addAuditLog]);

  const toggleInventoryBufferLock = useCallback(() => {
    setMetrics((prev) => ({ ...prev, inventoryBufferLocked: !prev.inventoryBufferLocked }));
    addAuditLog("Safety Buffer Toggled", "Inventory", `5% Safety reservation locked state changed`);
  }, [addAuditLog]);

  const purgeEdgeCache = useCallback(() => {
    setMetrics((prev) => ({ ...prev, cdnStatus: "Purging" }));
    toast.loading("Purging edge cache worldwide across 285 PoPs...", { id: "purge-cache" });
    setTimeout(() => {
      setMetrics((prev) => ({ ...prev, cdnStatus: "Operational", edgeCacheHitRate: 98.9 }));
      addAuditLog("Edge Cache Purged", "Pressure", "Purged Cloudflare Worker edge nodes worldwide");
      toast.success("Edge cache warm and healthy! Hit rate 98.9%", { id: "purge-cache" });
    }, 1200);
  }, [addAuditLog]);

  const simulateRushTraffic = useCallback((targetRps: number) => {
    setMetrics((prev) => {
      const isExtreme = targetRps > 2000;
      const isModerate = targetRps > 500;
      return {
        ...prev,
        rps: targetRps,
        peakRps: Math.max(prev.peakRps, targetRps),
        activeSessions: Math.round(targetRps * 9.2),
        originServerLoad: isExtreme ? 78 : isModerate ? 52 : 28,
        p99LatencyMs: isExtreme ? 68 : isModerate ? 42 : 32,
        checkoutQueueDepth: isExtreme ? 48 : isModerate ? 16 : 2,
        dbConnectionsActive: isExtreme ? 64 : isModerate ? 32 : 14,
      };
    });
    addAuditLog(
      "Traffic Simulation Changed",
      "Pressure",
      `Simulated load set to ${targetRps} RPS`,
      targetRps > 2000 ? "warning" : "info"
    );
  }, [addAuditLog]);

  // Stress order injection (simulates sudden surge of orders during high traffic)
  const injectStressOrders = useCallback((count: number) => {
    const cities = ["Mumbai", "Bengaluru", "New Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur"];
    const names = [
      "Isha Oberoi", "Vikramaditya Roy", "Ananya Deshmukh", "Kabir Khanna", "Pooja Hegde",
      "Tara Sutaria", "Arjun Kapoor", "Meera Rajput", "Karan Johar", "Simran Gill"
    ];
    const methods: AdminOrder["paymentMethod"][] = ["UPI", "Credit Card", "RuPay", "COD"];

    const newOrders: AdminOrder[] = [];
    for (let i = 0; i < count; i++) {
      const p1 = products[Math.floor(Math.random() * products.length)]!;
      const p2 = Math.random() > 0.5 ? products[Math.floor(Math.random() * products.length)]! : null;
      const randomName = names[Math.floor(Math.random() * names.length)]!;
      const randomCity = cities[Math.floor(Math.random() * cities.length)]!;
      const orderNum = `JC-${Math.floor(100000 + Math.random() * 900000)}`;

      const items = [
        { productId: p1.id, name: p1.name, quantity: Math.floor(Math.random() * 2) + 1, unitPrice: p1.price, cat: p1.cat },
      ];
      if (p2 && p2.id !== p1.id) {
        items.push({ productId: p2.id, name: p2.name, quantity: 1, unitPrice: p2.price, cat: p2.cat });
      }

      const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
      const discount = subtotal > 2000 ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal - discount;

      newOrders.push({
        id: `ord-stress-${Date.now()}-${i}`,
        orderNumber: orderNum,
        createdAt: new Date().toISOString(),
        customerName: `${randomName} (${i + 1})`,
        email: `stress.${Math.floor(Math.random() * 1000)}@test.com`,
        phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
        address: {
          street: `Rush Tower, Sector ${Math.floor(Math.random() * 50)}`,
          city: randomCity,
          state: "India",
          pincode: `${Math.floor(100000 + Math.random() * 800000)}`,
        },
        items,
        subtotal,
        discount,
        total,
        status: metrics.waitingRoomActive ? "queue_hold" : "paid",
        paymentMethod: methods[Math.floor(Math.random() * methods.length)]!,
        isRushOrder: true,
        timeline: [
          { title: "Stress Order Created", timestamp: new Date().toLocaleTimeString(), description: "High-volume flash sale pressure injection" }
        ]
      });
    }

    setOrders((prev) => [...newOrders, ...prev]);
    playBeep();
    addAuditLog("High Pressure Stress Test", "Pressure", `Injected ${count} concurrent rush orders into pipeline`, "warning");
    toast.success(`⚡ Injected ${count} rush orders! System latency: ${metrics.p99LatencyMs}ms`);
  }, [products, metrics.waitingRoomActive, metrics.p99LatencyMs, playBeep, addAuditLog]);

  // Live Auto Stream simulation
  useEffect(() => {
    if (!autoStreamOrders) return;
    const interval = setInterval(() => {
      injectStressOrders(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoStreamOrders, injectStressOrders]);

  // Coupon Actions
  const addCoupon = useCallback((coupon: AdminCoupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addAuditLog("Coupon Created", "Price", `Created promo code: ${coupon.code} (${coupon.amount}${coupon.discountType === 'percent' ? '%' : '₹'})`);
    toast.success(`Promo code "${coupon.code}" created`);
  }, [addAuditLog]);

  const toggleCoupon = useCallback((code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    toast.info(`Promo code "${code}" updated`);
  }, []);

  const deleteCoupon = useCallback((code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addAuditLog("Coupon Deleted", "Price", `Deleted promo code: ${code}`);
    toast.info(`Deleted code "${code}"`);
  }, [addAuditLog]);

  // Batch Lab Actions
  const updateBatchStatus = useCallback((id: string, qcStatus: BatchProduction["qcStatus"], note?: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, qcStatus, perfumerNote: note || b.perfumerNote } : b))
    );
    addAuditLog("Batch QC Updated", "Inventory", `Batch #${id} updated to ${qcStatus}`);
    toast.success(`Batch status updated to ${qcStatus}`);
  }, [addAuditLog]);

  // Database Reset & Export
  const resetAllData = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCoupons(INITIAL_COUPONS);
    setBatches(INITIAL_BATCHES);
    setMetrics(INITIAL_PRESSURE_METRICS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    }
    toast.success("Database restored to pristine factory state!");
  }, []);

  const exportDatabaseJSON = useCallback(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      products,
      orders,
      customers,
      coupons,
      batches,
      metrics,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `juice-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported full database backup JSON");
  }, [products, orders, customers, coupons, batches, metrics, auditLogs]);

  const value = useMemo(
    () => ({
      products,
      orders,
      customers,
      coupons,
      batches,
      metrics,
      auditLogs,
      autoStreamOrders,
      soundEnabled,
      activeTab,
      setActiveTab,
      setSoundEnabled,
      setAutoStreamOrders,
      updateProduct,
      addProduct,
      deleteProduct,
      quickAdjustStock,
      updateOrderStatus,
      bulkUpdateOrderStatus,
      assignCourier,
      deleteOrder,
      injectStressOrders,
      toggleFlashDropMode,
      toggleWaitingRoom,
      setWaitingRoomPassRate,
      setBotShieldLevel,
      toggleInventoryBufferLock,
      purgeEdgeCache,
      simulateRushTraffic,
      addCoupon,
      toggleCoupon,
      deleteCoupon,
      updateBatchStatus,
      addAuditLog,
      resetAllData,
      exportDatabaseJSON,
    }),
    [
      products,
      orders,
      customers,
      coupons,
      batches,
      metrics,
      auditLogs,
      autoStreamOrders,
      soundEnabled,
      activeTab,
      updateProduct,
      addProduct,
      deleteProduct,
      quickAdjustStock,
      updateOrderStatus,
      bulkUpdateOrderStatus,
      assignCourier,
      deleteOrder,
      injectStressOrders,
      toggleFlashDropMode,
      toggleWaitingRoom,
      setWaitingRoomPassRate,
      setBotShieldLevel,
      toggleInventoryBufferLock,
      purgeEdgeCache,
      simulateRushTraffic,
      addCoupon,
      toggleCoupon,
      deleteCoupon,
      updateBatchStatus,
      addAuditLog,
      resetAllData,
      exportDatabaseJSON,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

