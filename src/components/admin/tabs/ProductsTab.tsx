import React, { useState, useMemo, useRef } from "react";
import { useAdmin } from "@/lib/admin-context";
import type { AdminProduct, ProductCategory, ProductBadge } from "@/types/admin";
import {
  Search,
  Plus,
  Sparkles,
  LayoutGrid,
  List,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  X,
  Droplet,
  Layers,
  ArrowUpDown,
  Upload,
  Video,
  Image as ImageIcon,
  Film,
  Play,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

// High-resolution studio stills bundled with the project
const STUDIO_IMAGE_PRESETS = [
  { id: "kiwi", name: "Kiwi Crush Hero", url: "/src/assets/hero-kiwi.jpg", bg: "bg-pastel", preview: "🥝" },
  { id: "watermelon", name: "Watermelon Berry", url: "/src/assets/p-watermelon.jpg", bg: "bg-melon", preview: "🍉" },
  { id: "peach", name: "Peach Please", url: "/src/assets/p-peach.jpg", bg: "bg-peach-gradient", preview: "🍑" },
  { id: "vanilla", name: "Vanilla & Amber", url: "/src/assets/p-vanilla.jpg", bg: "bg-cream", preview: "🍦" },
];

// Cinematic 4K looping videos bundled with the project
const STUDIO_VIDEO_PRESETS = [
  { id: "kiwi", name: "Kiwi Zest 4K Loop", url: "/src/assets/vdos/kiwi.mp4", preview: "🥝", duration: "10s Looping" },
  { id: "watermelon", name: "Watermelon Splash 4K", url: "/src/assets/vdos/watermelon.mp4", preview: "🍉", duration: "8s Looping" },
  { id: "peach", name: "Peach Sunset 4K Loop", url: "/src/assets/vdos/peach.mp4", preview: "🍑", duration: "9s Looping" },
  { id: "ambre", name: "Gourmand Caramel Loop", url: "/src/assets/vdos/ambre.mp4", preview: "🍦", duration: "10s Looping" },
  { id: "main", name: "Juicé Master Brand Reel", url: "/src/assets/vdos/v_main.mp4", preview: "🎬", duration: "12s Looping" },
];

export const ProductsTab: React.FC = () => {
  const { products, updateProduct, addProduct, deleteProduct, quickAdjustStock } = useAdmin();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modals & Panels
  const [scentModalProduct, setScentModalProduct] = useState<AdminProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(true);

  // Fragrance Details Form State
  const [newProdName, setNewProdName] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [skuManuallyEdited, setSkuManuallyEdited] = useState(false);
  const [newProdCat, setNewProdCat] = useState<ProductCategory>("EDP");
  const [newProdPrice, setNewProdPrice] = useState(1299);
  const [newProdWasPrice, setNewProdWasPrice] = useState<number | undefined>(1599);
  const [newProdCost, setNewProdCost] = useState(380);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdNotes, setNewProdNotes] = useState("");
  const [newTopNotes, setNewTopNotes] = useState("Grapefruit, Italian Bergamot");
  const [newHeartNotes, setNewHeartNotes] = useState("Orange Blossom, Fresh Peony");
  const [newBaseNotes, setNewBaseNotes] = useState("Amberwood, Sheer Musk");
  const [newBadge, setNewBadge] = useState<ProductBadge>("new");
  const [bgChoice, setBgChoice] = useState<string>("bg-pastel");

  // Media (Picture & Video) State
  const [imageMode, setImageMode] = useState<"preset" | "upload" | "url">("preset");
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>("kiwi");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [uploadedImageName, setUploadedImageName] = useState<string>("");
  const [customImageUrl, setCustomImageUrl] = useState<string>("");

  const [videoMode, setVideoMode] = useState<"preset" | "upload" | "url">("preset");
  const [selectedVideoPreset, setSelectedVideoPreset] = useState<string>("kiwi");
  const [uploadedVideo, setUploadedVideo] = useState<string>("");
  const [uploadedVideoName, setUploadedVideoName] = useState<string>("");
  const [customVideoUrl, setCustomVideoUrl] = useState<string>("");

  const [sampleIdx, setSampleIdx] = useState(0);

  // Active Media Resolvers
  const activeImage = useMemo(() => {
    if (imageMode === "preset") {
      const p = STUDIO_IMAGE_PRESETS.find((x) => x.id === selectedImagePreset);
      return p ? p.url : "";
    }
    if (imageMode === "upload") {
      return uploadedImage;
    }
    return customImageUrl.trim();
  }, [imageMode, selectedImagePreset, uploadedImage, customImageUrl]);

  const activeVideo = useMemo(() => {
    if (videoMode === "preset") {
      const p = STUDIO_VIDEO_PRESETS.find((x) => x.id === selectedVideoPreset);
      return p ? p.url : "";
    }
    if (videoMode === "upload") {
      return uploadedVideo;
    }
    return customVideoUrl.trim();
  }, [videoMode, selectedVideoPreset, uploadedVideo, customVideoUrl]);

  // File Upload Handlers
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (.jpg, .png, .webp)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large (max 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUploadedImage(result);
      setUploadedImageName(file.name);
      setImageMode("upload");
      toast.success(`Photo "${file.name}" uploaded!`);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file (.mp4, .webm, .mov)");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Video file is too large (max 20MB for browser preview).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedVideo(objectUrl);
      setUploadedVideoName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      setVideoMode("upload");
      toast.success(`Video "${file.name}" loaded for homepage cards!`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUploadedVideo(result);
      setUploadedVideoName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      setVideoMode("upload");
      toast.success(`Video "${file.name}" attached for homepage cards!`);
    };
    reader.readAsDataURL(file);
  };

  const sampleFormulations = [
    {
      name: "Watermelon Berry",
      sku: "JC-EDP-WB02",
      cat: "EDP" as ProductCategory,
      price: 1099,
      wasPrice: 1499,
      costPrice: 320,
      stock: 65,
      notes: "Watermelon · Strawberry · Sheer Musk",
      top: "Crisp Watermelon Pulp, Pink Strawberry",
      heart: "Rosewater, Wild Jasmine",
      base: "Clean White Musk, Soft Sandalwood",
      badge: "sale" as ProductBadge,
      imagePreset: "watermelon",
      videoPreset: "watermelon",
      bg: "bg-melon",
    },
    {
      name: "Peach Please",
      sku: "JC-EDP-PP03",
      cat: "EDP" as ProductCategory,
      price: 1199,
      wasPrice: 1599,
      costPrice: 350,
      stock: 75,
      notes: "Sun-warmed Peach · Apricot · Neroli",
      top: "Sunlit Peach, Crisp Apricot Nectar",
      heart: "Golden Neroli, Freesia",
      base: "Blonde Woods, Sheer Vanilla",
      badge: "best" as ProductBadge,
      imagePreset: "peach",
      videoPreset: "peach",
      bg: "bg-peach-gradient",
    },
    {
      name: "Ambre Caramel",
      sku: "JC-ATT-AC04",
      cat: "Attar" as ProductCategory,
      price: 899,
      wasPrice: 1199,
      costPrice: 260,
      stock: 90,
      notes: "Tahitian Vanilla · Salted Caramel · Cocoa",
      top: "Almond Cream, Warm Sugar",
      heart: "Golden Caramel, French Orchid",
      base: "Tonka Bean, Smoked Vanilla, Amber",
      badge: "sale" as ProductBadge,
      imagePreset: "vanilla",
      videoPreset: "ambre",
      bg: "bg-cream",
    },
    {
      name: "Citrus Horizon",
      sku: "JC-EDP-CH05",
      cat: "EDP" as ProductCategory,
      price: 1399,
      wasPrice: 1699,
      costPrice: 410,
      stock: 50,
      notes: "Sparkling Lime · Green Tea · Vetiver",
      top: "Lime Rind, Mandarin",
      heart: "Green Tea Leaves, Bamboo",
      base: "Haitian Vetiver, White Amber",
      badge: "new" as ProductBadge,
      imagePreset: "kiwi",
      videoPreset: "kiwi",
      bg: "bg-pastel",
    },
  ];

  const handleFillSample = () => {
    const s = sampleFormulations[sampleIdx % sampleFormulations.length]!;
    setSampleIdx((i) => i + 1);
    setNewProdName(s.name);
    setNewProdSku(s.sku);
    setSkuManuallyEdited(true);
    setNewProdCat(s.cat);
    setNewProdPrice(s.price);
    setNewProdWasPrice(s.wasPrice);
    setNewProdCost(s.costPrice);
    setNewProdStock(s.stock);
    setNewProdNotes(s.notes);
    setNewTopNotes(s.top);
    setNewHeartNotes(s.heart);
    setNewBaseNotes(s.base);
    setNewBadge(s.badge);
    setBgChoice(s.bg);
    setImageMode("preset");
    setSelectedImagePreset(s.imagePreset);
    setVideoMode("preset");
    setSelectedVideoPreset(s.videoPreset);
    toast.success(`Form populated with "${s.name}" formulation, picture & video!`);
  };

  const handleNameChange = (val: string) => {
    setNewProdName(val);
    if (!skuManuallyEdited) {
      const initials = val
        .split(" ")
        .map((w) => w[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 3) || "FR";
      const catPrefix = newProdCat === "Attar" ? "ATT" : newProdCat === "Gifting" ? "GFT" : "EDP";
      setNewProdSku(`JC-${catPrefix}-${initials}01`);
    }
  };

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCat === "all" ? true : p.cat === selectedCat;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.notes.toLowerCase().includes(search.toLowerCase());
      const matchesLowStock = onlyLowStock ? p.stock <= p.minThreshold : true;
      return matchesCat && matchesSearch && matchesLowStock;
    });
  }, [products, selectedCat, search, onlyLowStock]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Details Validation
    if (!newProdName.trim()) {
      toast.error("Fragrance Name is required");
      return;
    }
    if (!newProdSku.trim()) {
      toast.error("SKU Code is required");
      return;
    }
    if (!newProdPrice || Number(newProdPrice) <= 0) {
      toast.error("Retail Price must be greater than 0");
      return;
    }
    if (!newProdStock || Number(newProdStock) < 0) {
      toast.error("Stock quantity must be 0 or more");
      return;
    }
    if (!newProdNotes.trim()) {
      toast.error("Storefront Notes / Scent vibe is required");
      return;
    }

    // 2. Mandatory Picture Validation
    if (!activeImage) {
      toast.error("Product Picture is REQUIRED. Please upload an image, choose a studio preset, or enter an image URL.");
      return;
    }

    // 3. Mandatory Video Validation
    if (!activeVideo) {
      toast.error("Product Video is REQUIRED. Homepage cards showcase a looping video for every fragrance.");
      return;
    }

    addProduct({
      sku: newProdSku.toUpperCase(),
      name: newProdName,
      cat: newProdCat,
      price: Number(newProdPrice),
      wasPrice: newProdWasPrice ? Number(newProdWasPrice) : undefined,
      costPrice: Number(newProdCost),
      stock: Number(newProdStock),
      reservedStock: 0,
      minThreshold: 20,
      rating: 5.0,
      reviews: 1,
      badge: newBadge,
      notes: newProdNotes || `${newTopNotes.split(",")[0]} · Floral · Musk`,
      scentPyramid: {
        top: newTopNotes.split(",").map((s) => s.trim()),
        heart: newHeartNotes.split(",").map((s) => s.trim()),
        base: newBaseNotes.split(",").map((s) => s.trim()),
        longevity: "8-10 Hours",
        sillage: "Moderate",
      },
      img: activeImage,
      video: activeVideo,
      bg: bgChoice,
      active: true,
      batchCode: `JC-2026-${newProdSku.slice(0, 3)}01`,
    });

    setIsAddModalOpen(false);
    toast.success(`"${newProdName}" published with Picture & Video! It is now live on homepage cards.`);

    // Reset formulation fields
    setNewProdName("");
    setNewProdSku("");
    setSkuManuallyEdited(false);
    setNewProdNotes("");
    setUploadedImage("");
    setUploadedImageName("");
    setUploadedVideo("");
    setUploadedVideoName("");
    setCustomImageUrl("");
    setCustomVideoUrl("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            Fragrance Catalog & Inventory
          </h2>
          <p className="text-xs text-muted-foreground">
            SKU management, bottle stock thresholds, and live storefront sync.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition shadow-xs w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Full Formulation Modal</span>
        </button>
      </div>

      {/* Quick Fragrance Entry Panel - Always ready for input */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-foreground">
                  Quick Product Entry
                </h3>
                <span className="pill inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 text-[10px] font-sans font-semibold px-2 py-0.5 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Storefront Sync
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Form is primed to publish. Fill in details and click "Publish to Storefront" to appear immediately on the main page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleFillSample}
              className="pill text-[11px] font-medium border border-border bg-background px-3 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition"
              title="Populate with a ready formulation preset"
            >
              Fill Sample Formulation
            </button>
            <button
              type="button"
              onClick={() => setIsQuickEntryOpen(!isQuickEntryOpen)}
              className="text-xs text-muted-foreground hover:text-foreground underline px-1"
            >
              {isQuickEntryOpen ? "Collapse Form" : "Expand Form"}
            </button>
          </div>
        </div>

        {isQuickEntryOpen && (
          <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Product Name */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Fragrance Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Watermelon Spark, Peach Velvet..."
                  value={newProdName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* SKU */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                  <span>SKU Code *</span>
                  <span className="text-[9px] text-muted-foreground font-normal">Auto-generated</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="JC-EDP-01"
                  value={newProdSku}
                  onChange={(e) => {
                    setNewProdSku(e.target.value);
                    setSkuManuallyEdited(true);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-foreground uppercase"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Category *
                </label>
                <select
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value as ProductCategory)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="EDP">EDP (Eau De Parfum)</option>
                  <option value="Attar">Pure Oil Attar</option>
                  <option value="Extrait">Extrait de Parfum</option>
                  <option value="Gifting">Gift Set Box</option>
                  <option value="Cologne">Fresh Cologne</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* Retail Price */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Retail Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="99"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Was Price */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Was Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Optional crossed price"
                  value={newProdWasPrice || ""}
                  onChange={(e) => setNewProdWasPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Initial Stock */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Stock Units *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Storefront Badge */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Storefront Badge
                </label>
                <select
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value as ProductBadge)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="new">New Arrival</option>
                  <option value="best">Bestseller</option>
                  <option value="sale">Sale Offer</option>
                  <option value="soldout">Sold Out</option>
                </select>
              </div>

              {/* Theme Background */}
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Theme Palette
                </label>
                <select
                  value={bgChoice}
                  onChange={(e) => setBgChoice(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="bg-pastel">Lime Pastel (Kiwi)</option>
                  <option value="bg-melon">Berry Melon Pink</option>
                  <option value="bg-peach-gradient">Warm Peach Amber</option>
                  <option value="bg-cream">Gourmand Vanilla Cream</option>
                  <option value="bg-kiwi">Zesty Lime Green</option>
                </select>
              </div>
            </div>

            {/* Scent Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Storefront Notes (e.g. Kiwi · Lime · Green tea) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crisp Apple · White Lily · Clean Musk"
                  value={newProdNotes}
                  onChange={(e) => setNewProdNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Top & Heart Notes (Lab Hierarchy)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bergamot, Green Apple, Lily"
                  value={newTopNotes}
                  onChange={(e) => setNewTopNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Base Notes & Longevity (Lab Hierarchy)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amberwood, Soft Musk"
                  value={newBaseNotes}
                  onChange={(e) => setNewBaseNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            {/* MANDATORY MEDIA ENTRY: PICTURES & VIDEO */}
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h4 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
                    <Film className="h-4 w-4 text-primary" />
                    Required Media Assets (Picture & Looping Video)
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Both a picture and a video are required. The video will be showcased on homepage cards (autoplay on Bestsellers & Editor's Picks, hover on New Arrivals).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`pill inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 border ${
                      activeImage
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {activeImage ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <AlertCircle className="h-3 w-3 text-destructive" />}
                    {activeImage ? "Picture Attached" : "Picture Required"}
                  </span>
                  <span
                    className={`pill inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 border ${
                      activeVideo
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {activeVideo ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <AlertCircle className="h-3 w-3 text-destructive" />}
                    {activeVideo ? "Video Attached" : "Video Required"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. PRODUCT PICTURE SECTION */}
                <div className="space-y-3 rounded-xl border border-border bg-card p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      Product Picture *
                    </label>
                    <span className="text-[10px] text-muted-foreground">Format: JPG, PNG, WebP</span>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex rounded-lg border border-border bg-muted/40 p-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode("preset")}
                      className={`flex-1 rounded-md py-1 font-medium transition ${
                        imageMode === "preset" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Studio Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`flex-1 rounded-md py-1 font-medium transition ${
                        imageMode === "upload" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Upload Picture
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex-1 rounded-md py-1 font-medium transition ${
                        imageMode === "url" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>

                  {/* Mode Content */}
                  {imageMode === "preset" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STUDIO_IMAGE_PRESETS.map((p) => {
                        const isSelected = selectedImagePreset === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedImagePreset(p.id);
                              setBgChoice(p.bg);
                            }}
                            className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition ${
                              isSelected
                                ? "border-foreground bg-foreground/5 ring-1 ring-foreground"
                                : "border-border bg-card hover:bg-muted/50"
                            }`}
                          >
                            <img src={p.url} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                            <span className="text-[10px] font-medium leading-tight truncate w-full">{p.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {imageMode === "upload" && (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-foreground/40 bg-muted/10 p-4 cursor-pointer transition">
                        <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs font-semibold text-foreground">Click to upload bottle photograph</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Under 5MB · Auto-converted to DataURL</span>
                        <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                      </label>
                      {uploadedImageName && (
                        <p className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready: {uploadedImageName}
                        </p>
                      )}
                    </div>
                  )}

                  {imageMode === "url" && (
                    <div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground font-mono"
                      />
                    </div>
                  )}

                  {/* Picture Live Thumbnail */}
                  {activeImage && (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-2">
                      <img src={activeImage} alt="Preview" className="h-14 w-14 rounded-lg object-cover border border-border" />
                      <div className="flex-1 min-w-0 text-[11px]">
                        <p className="font-semibold text-foreground truncate">Selected Photo Source</p>
                        <p className="text-[10px] text-muted-foreground truncate font-mono">{activeImage.slice(0, 45)}...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. PRODUCT VIDEO SECTION */}
                <div className="space-y-3 rounded-xl border border-border bg-card p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Film className="h-3.5 w-3.5 text-primary" />
                      Product Video *
                    </label>
                    <span className="text-[10px] text-muted-foreground">Format: MP4, WebM, MOV</span>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex rounded-lg border border-border bg-muted/40 p-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setVideoMode("preset")}
                      className={`flex-1 rounded-md py-1 font-medium transition ${
                        videoMode === "preset" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      4K Studio Loops
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoMode("upload")}
                      className={`flex-1 rounded-md py-1 font-medium transition ${
                        videoMode === "upload" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Upload Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoMode("url")}
                      className={`flex-1 rounded-md py-1 font-medium transition ${
                        videoMode === "url" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Video URL
                    </button>
                  </div>

                  {/* Mode Content */}
                  {videoMode === "preset" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {STUDIO_VIDEO_PRESETS.map((v) => {
                        const isSelected = selectedVideoPreset === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVideoPreset(v.id)}
                            className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${
                              isSelected
                                ? "border-foreground bg-foreground/5 ring-1 ring-foreground"
                                : "border-border bg-card hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-xs">
                              {v.preview}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-semibold block truncate">{v.name}</span>
                              <span className="text-[9px] text-muted-foreground">{v.duration}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {videoMode === "upload" && (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-foreground/40 bg-muted/10 p-4 cursor-pointer transition">
                        <Video className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs font-semibold text-foreground">Click to upload fragrance video clip</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">MP4, WebM (Looping on homepage cards)</span>
                        <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                      </label>
                      {uploadedVideoName && (
                        <p className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready: {uploadedVideoName}
                        </p>
                      )}
                    </div>
                  )}

                  {videoMode === "url" && (
                    <div>
                      <input
                        type="url"
                        placeholder="https://cdn.example.com/videos/fragrance.mp4"
                        value={customVideoUrl}
                        onChange={(e) => setCustomVideoUrl(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground font-mono"
                      />
                    </div>
                  )}

                  {/* Video Live Looping Preview */}
                  {activeVideo && (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-2">
                      <video
                        key={activeVideo}
                        src={activeVideo}
                        poster={activeImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-14 w-14 rounded-lg object-cover border border-border bg-black"
                      />
                      <div className="flex-1 min-w-0 text-[11px]">
                        <p className="font-semibold text-foreground flex items-center gap-1">
                          <span>Homepage Looping Video</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Plays continuously on Bestsellers & Editor's Picks, and on hover in New Arrivals.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-[11px] text-muted-foreground">
                All details, picture, and video will immediately propagate to the live homepage cards via reactive store bus.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto pill flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 text-xs font-semibold shadow-xs transition active:scale-98"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Publish to Storefront</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {["all", "EDP", "Attar", "Gifting", "Extrait", "Cologne"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`pill px-3.5 py-1.5 text-xs font-medium transition ${
                selectedCat === cat
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              {cat === "all" ? "All Fragrances" : cat}
            </button>
          ))}

          {/* Low Stock Toggle */}
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`pill flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition ${
              onlyLowStock
                ? "bg-hot text-destructive-foreground"
                : "border border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Low Stock Alert</span>
          </button>
        </div>

        {/* Search & View Switch */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search fragrance, SKU, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-card pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`pill p-1.5 ${
                viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`pill p-1.5 ${
                viewMode === "table" ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => {
            const isLow = p.stock <= p.minThreshold;
            const grossMargin = Math.round(((p.price - p.costPrice) / p.price) * 100);

            return (
              <div
                key={p.id}
                className="group flex flex-col rounded-3xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Visual Top Preview */}
                <div className={`relative overflow-hidden rounded-2xl ${p.bg} aspect-4/3 flex items-center justify-center p-3`}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
                  />
                  {p.video && (
                    <video
                      src={p.video}
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                      onMouseEnter={(e) => {
                        const playPromise = (e.target as HTMLVideoElement).play();
                        if (playPromise !== undefined) playPromise.catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        try {
                          (e.target as HTMLVideoElement).pause();
                        } catch {}
                      }}
                    />
                  )}

                  {/* Badge */}
                  {p.badge && (
                    <div className="absolute left-3 top-3 z-10">
                      <span
                        className={`pill px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          p.badge === "best"
                            ? "bg-hot text-destructive-foreground"
                            : p.badge === "sale"
                            ? "bg-sale text-destructive-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                  )}

                  {p.video && (
                    <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-white font-mono backdrop-blur">
                      <Film className="h-3 w-3 text-emerald-400" />
                      <span>Card Video</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <span className="pill absolute right-3 top-3 z-10 bg-card/90 px-2 py-0.5 text-[10px] font-bold text-foreground backdrop-blur">
                    {p.cat}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-3 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono font-semibold">{p.sku}</span>
                      <span>Batch: {p.batchCode}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-foreground mt-0.5">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {p.notes}
                    </p>

                    {/* Price and Margin */}
                    <div className="mt-2 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-foreground text-base">
                          {inr(p.price)}
                        </span>
                        {p.wasPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {inr(p.wasPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {grossMargin}% Margin
                      </span>
                    </div>
                  </div>

                  {/* Stock Adjuster Control */}
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Live Stock:</span>
                      <span
                        className={`font-bold font-mono ${
                          isLow ? "text-hot font-black" : "text-foreground"
                        }`}
                      >
                        {p.stock} bottles {isLow && "(Low Buffer!)"}
                      </span>
                    </div>

                    {/* Quick Stepper */}
                    <div className="grid grid-cols-5 gap-1 text-xs">
                      <button
                        onClick={() => quickAdjustStock(p.id, -10)}
                        className="rounded-xl border border-border bg-muted/40 py-1 font-mono font-bold hover:bg-muted"
                        title="-10 Stock"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => quickAdjustStock(p.id, -1)}
                        className="rounded-xl border border-border bg-muted/40 py-1 font-mono font-bold hover:bg-muted"
                        title="-1 Stock"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => setScentModalProduct(p)}
                        className="col-span-1 rounded-xl bg-primary/20 py-1 flex items-center justify-center text-foreground hover:bg-primary/30"
                        title="View Scent Pyramid & Notes"
                      >
                        <Droplet className="h-3.5 w-3.5 text-primary" />
                      </button>
                      <button
                        onClick={() => quickAdjustStock(p.id, 1)}
                        className="rounded-xl border border-border bg-muted/40 py-1 font-mono font-bold hover:bg-muted"
                        title="+1 Stock"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => quickAdjustStock(p.id, 10)}
                        className="rounded-xl border border-border bg-muted/40 py-1 font-mono font-bold hover:bg-muted"
                        title="+10 Stock"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Table Mode */
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Fragrance Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Retail Price</th>
                  <th className="p-4">Cost</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Batch Code</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 text-right">Quick Stock Stepper</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition">
                      <td className="p-4 font-mono font-bold text-foreground">{p.sku}</td>
                      <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                        <button
                          onClick={() => setScentModalProduct(p)}
                          className="hover:text-primary transition flex items-center gap-1.5"
                        >
                          <span>{p.name}</span>
                          <Droplet className="h-3 w-3 text-primary opacity-60" />
                        </button>
                      </td>
                      <td className="p-4">
                        <span className="pill bg-muted px-2 py-0.5 text-[11px] font-medium">
                          {p.cat}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-foreground">{inr(p.price)}</td>
                      <td className="p-4 text-muted-foreground">{inr(p.costPrice)}</td>
                      <td className="p-4">
                        <span
                          className={`pill font-mono px-2.5 py-1 text-xs font-bold ${
                            isLow ? "bg-hot text-destructive-foreground" : "bg-muted text-foreground"
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-muted-foreground">
                        {p.batchCode}
                      </td>
                      <td className="p-4">
                        {p.badge && (
                          <span className="pill bg-primary/20 text-foreground px-2 py-0.5 text-[10px] font-bold uppercase">
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => quickAdjustStock(p.id, -5)}
                            className="rounded-lg border border-border px-2 py-1 font-mono hover:bg-muted"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => quickAdjustStock(p.id, 5)}
                            className="rounded-lg border border-border px-2 py-1 font-mono hover:bg-muted"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => quickAdjustStock(p.id, 25)}
                            className="pill bg-primary/20 text-foreground px-2.5 py-1 font-semibold text-[11px] hover:bg-primary/40 ml-1"
                          >
                            +25
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scent Pyramid & Formulation Details Modal */}
      {scentModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setScentModalProduct(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-border bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="pill bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {scentModalProduct.cat} Matrix
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  {scentModalProduct.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {scentModalProduct.sku} · Batch {scentModalProduct.batchCode}
                </p>
              </div>
              <button
                onClick={() => setScentModalProduct(null)}
                className="pill p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Pyramid visualization */}
              <div className="space-y-3 rounded-2xl bg-card p-4 border border-border">
                {/* Top Notes */}
                <div className="border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 uppercase text-[10px] tracking-wider mb-1">
                    <Droplet className="h-3 w-3" />
                    <span>Top Notes (First 15-30 mins)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scentModalProduct.scentPyramid.top.map((note, i) => (
                      <span key={i} className="pill bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 font-medium">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 uppercase text-[10px] tracking-wider mb-1">
                    <Droplet className="h-3 w-3" />
                    <span>Heart Notes (2 - 6 Hours)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scentModalProduct.scentPyramid.heart.map((note, i) => (
                      <span key={i} className="pill bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-0.5 font-medium">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-indigo-700 uppercase text-[10px] tracking-wider mb-1">
                    <Droplet className="h-3 w-3" />
                    <span>Base Notes (6 - 12+ Hours)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scentModalProduct.scentPyramid.base.map((note, i) => (
                      <span key={i} className="pill bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 font-medium">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Longevity & Sillage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-card p-3 border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Longevity
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {scentModalProduct.scentPyramid.longevity}
                  </span>
                </div>
                <div className="rounded-2xl bg-card p-3 border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Sillage Projection
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {scentModalProduct.scentPyramid.sillage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Fragrance Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-border bg-cream p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-bold">New Fragrance Formulation</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="pill p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Fragrance Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lychee L'Amour"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JC-EDP-LA11"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="EDP">EDP (Eau De Parfum)</option>
                    <option value="Attar">Pure Oil Attar</option>
                    <option value="Extrait">Extrait de Parfum</option>
                    <option value="Gifting">Gift Set Box</option>
                    <option value="Cologne">Fresh Cologne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Retail Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Initial Stock Bottles *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground">
                  Scent Notes Pyramid (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Top notes (e.g. Lychee, Pink Peppercorn)"
                  value={newTopNotes}
                  onChange={(e) => setNewTopNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Heart notes (e.g. Turkish Rose, Peony)"
                  value={newHeartNotes}
                  onChange={(e) => setNewHeartNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Base notes (e.g. Cedar, Soft Musk, Vanilla)"
                  value={newBaseNotes}
                  onChange={(e) => setNewBaseNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              {/* Picture & Video Required Summary in Modal */}
              <div className="rounded-2xl border border-border bg-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-muted-foreground">Required Media Assets:</span>
                  <div className="flex gap-2">
                    <span className={`pill px-2 py-0.5 text-[9px] font-semibold border ${activeImage ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                      {activeImage ? "✓ Picture Ready" : "⚠️ Picture Missing"}
                    </span>
                    <span className={`pill px-2 py-0.5 text-[9px] font-semibold border ${activeVideo ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                      {activeVideo ? "✓ Video Ready" : "⚠️ Video Missing"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {activeImage ? (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5">
                      <img src={activeImage} alt="Cover" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="text-[10px] truncate text-muted-foreground">Picture ready</span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-2 text-center text-[10px] text-destructive">
                      Please attach a picture
                    </div>
                  )}

                  {activeVideo ? (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5">
                      <video src={activeVideo} autoPlay loop muted playsInline className="h-10 w-10 rounded-lg object-cover bg-black" />
                      <span className="text-[10px] truncate text-muted-foreground">Looping video ready</span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-2 text-center text-[10px] text-destructive">
                      Please attach a video
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="pill border border-border bg-card px-4 py-2 hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill bg-primary text-primary-foreground hover:bg-kiwi px-5 py-2 font-bold shadow-sm transition"
                >
                  Publish Fragrance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

