import React, { useState } from "react";
import type { UserProfileData, UserAddress } from "@/types/user-profile";
import {
  X,
  User,
  ShoppingBag,
  Sparkles,
  MapPin,
  Settings,
  Truck,
  CheckCircle2,
  Clock,
  Copy,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  Heart,
  Droplet,
  ShieldCheck,
  RotateCcw,
  LogOut,
  Bell,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_USER_DATA: UserProfileData = {
  id: "usr-491",
  name: "Aanya Singhania",
  email: "aanya.singh@gmail.com",
  phone: "+91 98201 44521",
  avatarInitials: "AS",
  tier: "Amber Connoisseur",
  points: 850,
  pointsToNextTier: 150,
  nextTier: "Diamond Juicer",
  scentPersona: "Sparkling Fruity Florals & Gourmand Warmth",
  favoriteNotes: ["Zesty Kiwi", "White Peach", "French Caramel", "Tunisian Neroli", "Madagascar Vanilla"],
  addresses: [
    {
      id: "addr-1",
      label: "Home",
      street: "Flat 14B, Oberoi Sky Heights, Lokhandwala",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Work",
      street: "Studio 402, Signature Tower, Bandra Kurla Complex",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051",
      isDefault: false,
    },
  ],
  orders: [
    {
      id: "ord-1",
      orderNumber: "JC-94821",
      date: "21 Nov 2026",
      status: "Shipped",
      courier: "Bluedart Express Priority",
      trackingNumber: "BLU-88294101",
      estimatedDelivery: "Arriving Tomorrow by 2:00 PM",
      total: 3418,
      items: [
        { name: "Kiwi Crush EDP (50ml)", cat: "EDP", qty: 2, price: 1299 },
        { name: "Peach Please EDP (50ml)", cat: "EDP", qty: 1, price: 1199 },
      ],
    },
    {
      id: "ord-2",
      orderNumber: "JC-88192",
      date: "12 Nov 2026",
      status: "Delivered",
      courier: "Delhivery Air",
      trackingNumber: "DLV-99381021",
      total: 2198,
      items: [
        { name: "Ambre Caramel Attar (12ml)", cat: "Attar", qty: 1, price: 899 },
        { name: "Watermelon Berry EDP (50ml)", cat: "EDP", qty: 1, price: 1099 },
      ],
    },
  ],
  notifications: {
    whatsappUpdates: true,
    flashDropSms: true,
    newsletter: false,
  },
};

export const UserProfileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productName: string) => void;
}> = ({ isOpen, onClose, onAddToCart }) => {
  const [profile, setProfile] = useState<UserProfileData>(() => {
    if (typeof window === "undefined") return INITIAL_USER_DATA;
    try {
      const saved = localStorage.getItem("juice_customer_profile_v2");
      return saved ? JSON.parse(saved) : INITIAL_USER_DATA;
    } catch {
      return INITIAL_USER_DATA;
    }
  });

  const [activeTab, setActiveTab] = useState<"orders" | "club" | "wardrobe" | "addresses" | "settings">("orders");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);

  // Address add state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newLabel, setNewLabel] = useState<UserAddress["label"]>("Home");

  if (!isOpen) return null;

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const saveProfileUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: editName,
      phone: editPhone,
      email: editEmail,
      avatarInitials: editName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };
    setProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("juice_customer_profile_v2", JSON.stringify(updated));
    }
    setIsEditingProfile(false);
    toast.success("Profile details updated!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) {
      toast.error("Please fill all address fields");
      return;
    }
    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      street: newStreet,
      city: newCity,
      state: "India",
      pincode: newPincode,
      isDefault: profile.addresses.length === 0,
    };
    const updated = { ...profile, addresses: [...profile.addresses, newAddr] };
    setProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("juice_customer_profile_v2", JSON.stringify(updated));
    }
    setIsAddingAddress(false);
    setNewStreet("");
    setNewCity("");
    setNewPincode("");
    toast.success("Delivery address saved!");
  };

  const setDefaultAddress = (id: string) => {
    const updated = {
      ...profile,
      addresses: profile.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    };
    setProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("juice_customer_profile_v2", JSON.stringify(updated));
    }
    toast.success("Default address updated");
  };

  const toggleNotification = (key: keyof UserProfileData["notifications"]) => {
    const updated = {
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key],
      },
    };
    setProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("juice_customer_profile_v2", JSON.stringify(updated));
    }
    toast.info("Notification preferences saved");
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code} to clipboard!`);
  };

  const handleReorder = (itemName: string) => {
    if (onAddToCart) {
      onAddToCart(itemName);
    }
    toast.success(`Added ${itemName} to your bag!`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <aside
        className="ml-auto flex h-full w-full max-w-lg flex-col bg-cream shadow-2xl animate-in slide-in-from-right duration-300 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="border-b border-border bg-card/80 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background font-serif font-black text-lg shadow-sm">
                {profile.avatarInitials}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {profile.name}
                  </h2>
                  <span className="pill bg-primary/30 text-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    VIP
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Profile"
              className="pill p-2 text-muted-foreground hover:bg-muted transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Juicy Club Loyalty Pill Strip */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-pastel/60 via-peach/30 to-pastel/60 p-3 text-xs border border-foreground/5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-hot" />
              <div>
                <span className="font-bold text-foreground text-[11px] block">
                  {profile.tier}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  <b>{profile.points}</b> Drops (₹{profile.points} redeemable credit)
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("club")}
              className="pill bg-foreground text-background px-3 py-1 text-[11px] font-semibold hover:bg-foreground/90 transition"
            >
              Rewards
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-4 flex gap-1 border-t border-border pt-3 overflow-x-auto scrollbar-none">
            {[
              { id: "orders", label: "My Orders", icon: ShoppingBag },
              { id: "club", label: "Juicy Club", icon: Sparkles },
              { id: "wardrobe", label: "Scent Wardrobe", icon: Droplet },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pill flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                    isActive
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Order History & Live Dispatch
                </h3>
                <span className="text-muted-foreground font-semibold">
                  {profile.orders.length} Orders
                </span>
              </div>

              {profile.orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-border bg-card p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-sm text-foreground">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`pill px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            order.status === "Shipped"
                              ? "bg-primary text-primary-foreground animate-pulse"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Placed on {order.date} · Total: <b>{inr(order.total)}</b>
                      </p>
                    </div>

                    {order.status === "Shipped" && (
                      <div className="text-right">
                        <span className="pill bg-kiwi/20 text-foreground px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                          <Truck className="h-3 w-3 text-emerald-700" />
                          <span>On Route</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Estimated Delivery Banner */}
                  {order.estimatedDelivery && (
                    <div className="rounded-2xl bg-pastel/50 p-2.5 flex items-center justify-between text-[11px] text-foreground font-medium">
                      <span>🚚 {order.estimatedDelivery}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="divide-y divide-border/60 border-t border-border/60 pt-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="pill bg-muted px-1.5 py-0.2 font-mono font-bold text-[10px]">
                            {item.qty}x
                          </span>
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.cat} Formulation
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">
                            {inr(item.price * item.qty)}
                          </span>
                          <button
                            onClick={() => handleReorder(item.name)}
                            className="pill border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[10px] font-semibold transition"
                            title="Add to bag again"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-mono">
                      Carrier: {order.courier}
                    </span>
                    <button
                      onClick={() =>
                        toast.info(`Live tracking link opened for ${order.trackingNumber}`)
                      }
                      className="font-bold text-foreground hover:text-hot transition flex items-center gap-1"
                    >
                      <span>Track Shipment</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: JUICY CLUB REWARDS */}
          {activeTab === "club" && (
            <div className="space-y-5">
              {/* VIP Card */}
              <div className="rounded-3xl bg-gradient-to-br from-kiwi/40 via-cream to-peach/50 p-6 border border-border shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-hot" />
                    <span className="font-serif text-lg font-bold">Juicé Connoisseur Club</span>
                  </div>
                  <span className="pill bg-foreground text-background font-mono text-[10px] px-2.5 py-0.5 font-bold uppercase">
                    {profile.tier}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Available Scent Drops Balance
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="font-serif text-4xl font-black text-foreground">
                      {profile.points}
                    </h2>
                    <span className="text-xs font-semibold text-emerald-700">
                      = {inr(profile.points)} Off Next Bottle
                    </span>
                  </div>
                </div>

                {/* Progress to Next Tier */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      Next Tier: <b>{profile.nextTier}</b>
                    </span>
                    <span className="font-mono font-semibold">
                      {profile.pointsToNextTier} points away
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-hot"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Exclusive VIP Coupons */}
              <div className="space-y-3">
                <h4 className="font-serif text-base font-bold text-foreground">
                  Your Exclusive VIP Vouchers
                </h4>

                <div className="rounded-2xl border border-dashed border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-foreground">
                        JUICYVIP15
                      </span>
                      <span className="pill bg-hot text-destructive-foreground px-1.5 py-0.2 text-[9px] font-bold">
                        15% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Valid on all EDP & Extrait orders above ₹1,999
                    </p>
                  </div>
                  <button
                    onClick={() => copyCoupon("JUICYVIP15")}
                    className="pill bg-foreground text-background px-3 py-1.5 text-xs font-semibold hover:bg-foreground/90 transition flex items-center gap-1.5"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-dashed border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-foreground">
                        MINIFREESHIP
                      </span>
                      <span className="pill bg-primary text-primary-foreground px-1.5 py-0.2 text-[9px] font-bold">
                        FREE GIFT
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Free 5ml Peach Fizz Mini with next order
                    </p>
                  </div>
                  <button
                    onClick={() => copyCoupon("MINIFREESHIP")}
                    className="pill bg-foreground text-background px-3 py-1.5 text-xs font-semibold hover:bg-foreground/90 transition flex items-center gap-1.5"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCENT WARDROBE & PERSONA */}
          {activeTab === "wardrobe" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Your Signature Fragrance Persona
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Curated olfactory profile based on your scent ratings and purchase notes.
                </p>
              </div>

              {/* Persona Card */}
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-3">
                <span className="pill bg-peach/40 text-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase">
                  Olfactory DNA
                </span>
                <h4 className="font-serif text-xl font-bold text-foreground">
                  {profile.scentPersona}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You gravitate toward candy-bright citrus top notes with creamy gourmand bases. Your skin chemistry elevates juicy accords like kiwi pulp, white peach nectar, and ambergris.
                </p>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1.5">
                    Your Most-Loved Scent Notes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.favoriteNotes.map((note) => (
                      <span
                        key={note}
                        className="pill bg-pastel text-foreground px-3 py-1 text-xs font-medium border border-foreground/5"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty Bottle Recycling Perk */}
              <div className="rounded-2xl bg-kiwi/20 p-4 border border-kiwi/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Recycle & Earn Drops ♻️</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Return 3 empty Juicé glass bottles and get <b>+200 Drops</b> credited instantly.
                  </p>
                </div>
                <button
                  onClick={() => toast.success("Free courier pickup requested for empty bottles!")}
                  className="pill bg-foreground text-background px-3 py-1.5 font-semibold text-[11px] hover:bg-foreground/90 shrink-0"
                >
                  Request Pickup
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Speed up checkout with 1-click address selection.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="pill bg-foreground text-background px-3 py-1.5 font-semibold hover:bg-foreground/90 transition flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="rounded-3xl border border-border bg-card p-4 space-y-3 animate-in fade-in"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-foreground">New Address</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {(["Home", "Work", "Other"] as const).map((lbl) => (
                      <button
                        type="button"
                        key={lbl}
                        onClick={() => setNewLabel(lbl)}
                        className={`pill px-3 py-1 text-xs font-semibold ${
                          newLabel === lbl
                            ? "bg-foreground text-background"
                            : "border border-border bg-muted"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Street, Building, Flat No."
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City (e.g. Mumbai)"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Pincode (e.g. 400053)"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="pill w-full bg-primary text-primary-foreground font-bold py-2 hover:bg-kiwi transition"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address Cards */}
              {profile.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-3xl border border-border bg-card p-4 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="pill bg-muted px-2.5 py-0.5 font-bold uppercase text-[10px]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="pill bg-primary/30 text-foreground px-2 py-0.5 font-bold text-[10px]">
                          Default
                        </span>
                      )}
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <p className="text-foreground font-medium">{addr.street}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {addr.city}, {addr.state} — <b>{addr.pincode}</b>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SETTINGS & NOTIFICATIONS */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Account & Preferences
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manage your personal details and drop alerts.
                  </p>
                </div>

                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="pill border border-border bg-card px-3 py-1 font-semibold hover:bg-muted transition"
                >
                  {isEditingProfile ? "Cancel" : "Edit Details"}
                </button>
              </div>

              {/* Profile Details Form */}
              {isEditingProfile ? (
                <form
                  onSubmit={saveProfileUpdates}
                  className="rounded-3xl border border-border bg-card p-4 space-y-3"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                      Mobile Number (For WhatsApp tracking)
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="pill w-full bg-foreground text-background font-bold py-2 hover:bg-foreground/90 transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="rounded-3xl border border-border bg-card p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-bold text-foreground">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-mono text-foreground">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-mono text-foreground">{profile.phone}</span>
                  </div>
                </div>
              )}

              {/* Notification Toggles */}
              <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">
                  Alerts & VIP Drops
                </h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp Dispatch Alerts</p>
                    <p className="text-muted-foreground text-[10px]">Instant courier updates & OTP</p>
                  </div>
                  <button
                    onClick={() => toggleNotification("whatsappUpdates")}
                    className={`pill w-11 h-6 transition-colors p-1 ${
                      profile.notifications.whatsappUpdates ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-foreground transition-transform ${
                        profile.notifications.whatsappUpdates ? "translate-x-5 bg-foreground" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground">Flash Drop SMS Access</p>
                    <p className="text-muted-foreground text-[10px]">15-minute early secret link</p>
                  </div>
                  <button
                    onClick={() => toggleNotification("flashDropSms")}
                    className={`pill w-11 h-6 transition-colors p-1 ${
                      profile.notifications.flashDropSms ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-foreground transition-transform ${
                        profile.notifications.flashDropSms ? "translate-x-5 bg-foreground" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-card/60 p-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Signed in as <b>{profile.name}</b></span>
          <button
            onClick={() => {
              toast.info("Logged out of Juicé profile");
              onClose();
            }}
            className="hover:text-destructive flex items-center gap-1 font-semibold"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
