import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo } from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Star, Truck, ShieldCheck,
  Sparkles, RotateCcw, Instagram, Facebook, Youtube, Minus, Plus, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import BestsellersFramerMotion from "@/components/BestsellersFramerMotion";
import CategoryGrid from "@/components/CategoryGrid";
import HeroBanner from "@/components/HeroBanner";
import ShopByScent from "@/components/ShopByScent";
import Wave from "@/components/Wave";
import MagneticButton from "@/components/MagneticButton";
import SmellJuiceMarquee from "@/components/SmellJuiceMarquee";
import { UserProfileDrawer } from "@/components/UserProfileDrawer";
import hero from "@/assets/hero-kiwi.jpg";
import melon from "@/assets/p-watermelon.jpg";
import peach from "@/assets/p-peach.jpg";
import vanilla from "@/assets/p-vanilla.jpg";
import vMain from "@/assets/vdos/v_main.mp4";
import vProd1 from "@/assets/vdos/v_prod1.mp4";
import vProd2 from "@/assets/vdos/v_prod2.mp4";
import vProd3 from "@/assets/vdos/v_prod3.mp4";
import vProd4 from "@/assets/vdos/v_prod4.mp4";
import logo from "@/assets/logo.png";
import kiwiVid from "@/assets/vdos/kiwi.mp4";
import watermelonVid from "@/assets/vdos/watermelon.mp4";
import peachVid from "@/assets/vdos/peach.mp4";
import ambreVid from "@/assets/vdos/ambre.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Juicé — Fruity Perfumes for the Bold" },
      { name: "description", content: "Candy-bright EDPs, attars & gift sets inspired by real fruit. Free shipping over ₹999." },
      { property: "og:title", content: "Juicé — Fruity Perfumes for the Bold" },
      { property: "og:description", content: "Candy-bright EDPs, attars & gift sets inspired by real fruit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Product = {
  id: number;
  name: string;
  notes: string;
  img: string;
  video?: string | undefined;
  price: number;
  was?: number | undefined;
  rating: number;
  reviews: number;
  badge?: "sale" | "best" | "new" | undefined;
  cat: string;
  bg: string;
};

// Exactly one mock product as requested
const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: "Kiwi Crush", notes: "Kiwi · Lime · Green tea", img: hero, video: kiwiVid, price: 1299, rating: 4.8, reviews: 412, badge: "best", cat: "EDP", bg: "bg-pastel" },
];

const slides = [
  { vid: vMain, tag: "New Arrival", title: "Your glow-up smells like kiwi.", sub: "Meet Kiwi Crush — zesty, green and impossibly fresh.", bg: "bg-kiwi" },
  { vid: vProd1, tag: "Summer Sale · 30% off", title: "Juicy, sweet & a little extra.", sub: "Watermelon Berry is back for the season.", bg: "bg-melon" },
  { vid: vProd3, tag: "Bestseller", title: "Peach, please. Always.", sub: "Our most-loved fruity floral, now in minis.", bg: "bg-peach-gradient" },
  { vid: vProd2, tag: "Must Have", title: "Gourmand dreams.", sub: "Sweet vanilla and caramel for a cozy vibe.", bg: "bg-cream" },
  { vid: vProd4, tag: "Exclusive", title: "Fresh Citrus Pop.", sub: "The perfect pick-me-up for any day.", bg: "bg-pastel" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Badge({ kind }: { kind: NonNullable<Product["badge"]> }) {
  const map = {
    sale: "bg-sale text-destructive-foreground",
    best: "bg-hot text-destructive-foreground",
    new: "bg-primary text-primary-foreground",
  } as const;
  const label = { sale: "Sale", best: "Bestseller", new: "New" }[kind];
  return <span className={`pill px-3 py-1 text-xs font-semibold ${map[kind]}`}>{label}</span>;
}

function ScrollReveal({ children, index }: { children: React.ReactNode, index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;
  const translate = isLeft ? '-translate-x-12 -translate-y-12' : 'translate-x-12 -translate-y-12';
  const delay = (index % 2) * 200;
  
  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] h-full ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translate}`}`}
    >
      {children}
    </div>
  );
}

function Index() {
  const { products: adminProducts } = useAdmin();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wish, setWish] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const resolveImage = (img?: string) => {
    if (!img) return hero;
    if (img.startsWith("data:") || img.startsWith("blob:") || img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    if (img.includes("watermelon") || img.includes("melon")) return melon;
    if (img.includes("peach")) return peach;
    if (img.includes("vanilla") || img.includes("ambre")) return vanilla;
    if (img.includes("kiwi") || img.includes("hero")) return hero;
    return img;
  };

  const resolveVideo = (vid?: string) => {
    if (!vid) return kiwiVid;
    if (vid.startsWith("data:") || vid.startsWith("blob:") || vid.startsWith("http://") || vid.startsWith("https://")) {
      return vid;
    }
    if (vid.includes("watermelon") || vid.includes("melon")) return watermelonVid;
    if (vid.includes("peach")) return peachVid;
    if (vid.includes("ambre") || vid.includes("vanilla")) return ambreVid;
    if (vid.includes("v_main") || vid.includes("main")) return vMain;
    if (vid.includes("v_prod1")) return vProd1;
    if (vid.includes("v_prod2")) return vProd2;
    if (vid.includes("v_prod3")) return vProd3;
    if (vid.includes("v_prod4")) return vProd4;
    if (vid.includes("kiwi")) return kiwiVid;
    return vid;
  };

  // Live products connected directly to Admin state
  const products: Product[] = useMemo(() => {
    if (!adminProducts || adminProducts.length === 0) {
      return DEFAULT_PRODUCTS;
    }
    return adminProducts
      .filter((p) => p.active !== false)
      .map((p) => ({
        id: p.id,
        name: p.name,
        notes: p.notes,
        img: resolveImage(p.img),
        video: resolveVideo(p.video),
        price: p.price,
        was: p.wasPrice,
        rating: p.rating || 5.0,
        reviews: p.reviews || 0,
        badge: (p.badge === "soldout" ? undefined : p.badge) as "sale" | "best" | "new" | undefined,
        cat: p.cat,
        bg: p.bg || "bg-pastel",
      }));
  }, [adminProducts]);

  const add = (id: number, d = 1) =>
    setCart((c) => {
      const q = (c[id] ?? 0) + d;
      const n = { ...c };
      if (q <= 0) delete n[id]; else n[id] = q;
      return n;
    });
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => {
    const item = products.find((p) => p.id === +id);
    return s + (item ? item.price * q : 0);
  }, 0);
  const freeLeft = Math.max(0, 999 - subtotal);

  const bestSellers = products.filter(p => p.badge === "best" || p.badge === "sale");
  
  // Dynamic bestseller mapping for Framer Motion 3D component
  const bestsellerProductsMapped = useMemo(() => {
    const pool = bestSellers.length > 0 ? bestSellers : products;
    return pool.map((p) => ({
      id: p.id,
      name: p.name,
      notes: p.notes,
      image: p.img,
      video: p.video,
      price: p.price,
      originalPrice: p.was,
      discount: p.was ? `-${Math.round(((p.was - p.price) / p.was) * 100)}%` : undefined,
      rating: p.rating,
      reviews: p.reviews,
      badge: p.badge === "best" ? ("Bestseller" as const) : p.badge === "sale" ? ("Sale" as const) : p.badge === "new" ? ("New" as const) : undefined,
      category: (p.cat === "Attar" || p.cat === "Gifting" ? p.cat : "EDP") as "EDP" | "Attar" | "Gifting",
      accentColor: p.bg.includes("melon")
        ? "from-pink-100 to-rose-200"
        : p.bg.includes("peach")
        ? "from-amber-100 to-orange-200"
        : p.bg.includes("cream")
        ? "from-amber-50 to-yellow-100"
        : "from-lime-100 to-emerald-200",
    }));
  }, [bestSellers, products]);

  const newArrivals = products;

  const nav = [
    { label: "EDP Fragrances", items: ["Fruity Florals", "Citrus", "Sweet Gourmands", "Minis"] },
    { label: "Attar", items: ["Floral Attars", "Oud Attars", "Roll-ons"] },
    { label: "Gifting", items: ["Gift Sets", "Discovery Kits", "Under ₹999"] },
    { label: "Offers", items: ["Clearance", "Bundles"] },
  ];

  const s = slides[slide]!;

  return (
    <div className="min-h-screen">
      {/* Announcement */}
      <div className="bg-foreground py-2 text-center text-xs font-medium tracking-wide text-background">
        🍋 Free shipping on orders above ₹999 · Use code <b>JUICY10</b> for 10% off
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4 md:px-8">
          <div className="flex items-center gap-6">
            <button aria-label="Menu" onClick={() => setMenuOpen(true)} className="lg:hidden"><Menu className="h-6 w-6" /></button>
            <Search className="hidden h-5 w-5 sm:block text-muted-foreground" strokeWidth={1.5} />
          </div>
          <a href="#" className="flex justify-center items-center">
            <img src={logo} alt="One of None Logo" className="h-4 md:h-5 object-contain" />
          </a>
          <div className="flex items-center justify-end gap-4">
            <button
              aria-label="User Profile & Account"
              onClick={() => setProfileOpen(true)}
              className="p-1 text-foreground hover:text-hot transition flex items-center"
              title="My Profile & Orders"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button aria-label="Wishlist" className="relative">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wish.length > 0 && <span className="pill absolute -right-2 -top-2 bg-hot px-1.5 text-[10px] text-destructive-foreground">{wish.length}</span>}
            </button>
            <button aria-label="Cart" onClick={() => setCartOpen(true)} className="relative">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {count > 0 && <span className="pill absolute -right-2 -top-2 bg-primary px-1.5 text-[10px] font-bold">{count}</span>}
            </button>
          </div>
        </div>
        
        {/* Main Navigation (Moved out of header to match Ajmal's layout) */}
        <div className="hidden border-y border-foreground/10 lg:block">
          <nav className="mx-auto flex max-w-7xl justify-center gap-10 px-8">
            {nav.map((n) => (
              <div key={n.label} className="group relative">
                <a href="#shop" className="flex items-center gap-1 py-3 text-sm font-medium hover:text-hot tracking-wide">{n.label}<ChevronDown className="h-3.5 w-3.5 opacity-50" /></a>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 w-52 rounded-2xl border bg-card p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 z-50">
                  {n.items.map((i) => <a key={i} href="#shop" className="block rounded-xl px-3 py-2 text-sm hover:bg-muted">{i}</a>)}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/40" onClick={() => setMenuOpen(false)}>
          <div className="h-full w-80 max-w-[85%] bg-cream p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <img src={logo} alt="One of None Logo" className="h-4 object-contain" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close"><X /></button>
            </div>
            <button
              onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
              className="flex items-center gap-2.5 w-full py-3 mb-2 text-left font-medium border-b border-foreground/10 text-foreground hover:text-hot transition text-sm"
            >
              <User className="h-4 w-4" />
              <span>My Profile & Orders</span>
            </button>
            {nav.map((n) => (
              <details key={n.label} className="border-b py-3">
                <summary className="cursor-pointer font-medium">{n.label}</summary>
                {n.items.map((i) => <a key={i} href="#shop" onClick={() => setMenuOpen(false)} className="block py-1.5 pl-3 text-sm text-muted-foreground">{i}</a>)}
              </details>
            ))}
          </div>
        </div>
      )}

      {/* 1. Hero (Clean Full Width Video Banner) */}
      <HeroBanner slides={slides} slide={slide} setSlide={setSlide} />
      <div className="relative w-full z-10 translate-y-1">
        <Wave fill="text-background" />
      </div>

      {/* 2. Best Sellers */}
      <BestsellersFramerMotion
        products={bestsellerProductsMapped}
        onAddToCart={(p) => add(p.id)}
        onToggleWishlist={(id) => setWish((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id])}
      />

      {/* 2b. New Arrivals */}
      <section id="new-arrivals" className="bg-background pt-4 pb-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8 border-t border-foreground/10 pt-16">
          <h2 className="text-4xl md:text-5xl text-center">New <em>Arrivals</em></h2>
        </div>
        {newArrivals.length === 1 ? (
          <div className="mx-auto max-w-sm px-4 py-4">
            <Card p={newArrivals[0]!} add={add} wish={wish} setWish={setWish} pop videoMode="hover" />
          </div>
        ) : (
          <div className="mt-10 relative w-full overflow-hidden">
            <Carousel 
              opts={{ align: "start", loop: newArrivals.length > 3, dragFree: true }} 
              plugins={newArrivals.length > 2 ? [AutoScroll({ playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false, speed: 1.5 })] as any : []}
              className="w-full cursor-grab active:cursor-grabbing"
            >
              <CarouselContent className="py-4">
                {newArrivals.map((p) => (
                  <CarouselItem key={p.id} className="pl-4 md:pl-6 basis-[85%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]">
                    <Card p={p} add={add} wish={wish} setWish={setWish} pop videoMode="hover" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 md:px-8 mt-12 flex justify-center">
          <MagneticButton>
            <a href="#shop" className="border-b-2 border-foreground pb-1 font-medium hover:text-hot hover:border-hot transition-colors inline-block">
              VIEW ALL NEW ARRIVALS
            </a>
          </MagneticButton>
        </div>
      </section>

      {/* 3. 4-Grid Categories */}
      <CategoryGrid />

      {/* 4. Promo banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="bg-peach-gradient grid items-center gap-8 overflow-hidden rounded-[2.5rem] md:grid-cols-2">
          <div className="p-10 md:p-14">
            <span className="pill bg-sale px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-destructive-foreground">Limited · 25% off</span>
            <h2 className="mt-5 text-4xl leading-tight md:text-5xl">The Peach Nectar collection is <em>ripe</em>.</h2>
            <p className="mt-4 text-foreground/75">Sun-warmed peach, apricot and a hint of neroli. Bottled sunshine for every day.</p>
            <MagneticButton>
              <a href="#shop" className="pill mt-8 inline-block bg-foreground px-8 py-3.5 font-medium text-background hover:scale-105 transition-transform">
                Shop the line
              </a>
            </MagneticButton>
          </div>
          <img src={peach} alt="Peach Please perfume" loading="lazy" className="h-full max-h-[480px] w-full object-cover" />
        </div>
      </section>

      {/* 5. Shop by Scent (Sticky Stacking Cards) */}
      <ShopByScent />

      {/* 6. Editor's Picks */}
      <Wave fill="text-pastel" flip />
      <section className="bg-pastel pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-center text-4xl md:text-5xl mb-10">Our Editor's <em>Picks</em></h2>
          <div className={`grid gap-4 md:gap-6 ${
            products.length === 1
              ? "max-w-sm mx-auto grid-cols-1"
              : products.length === 2
              ? "max-w-2xl mx-auto grid-cols-2"
              : products.length === 3
              ? "max-w-5xl mx-auto grid-cols-2 lg:grid-cols-3"
              : "grid-cols-2 lg:grid-cols-4"
          }`}>
            {products.slice(0, 4).map((p) => (
              <Card
                key={p.id}
                p={p}
                add={add}
                wish={wish}
                setWish={setWish}
                videoMode="autoplay"
              />
            ))}
          </div>
        </div>
      </section>
      <Wave fill="text-pastel" />

      {/* 7. #SmellJuice Infinite Marquee */}
      <SmellJuiceMarquee />

      {/* 8. USPs */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-8 border-t border-foreground/10">
        {[
          { i: Truck, t: "Free shipping", d: "On orders above ₹999" },
          { i: ShieldCheck, t: "100% authentic", d: "Made in our own labs" },
          { i: Sparkles, t: "Long-lasting", d: "8–10 hrs of juicy wear" },
          { i: RotateCcw, t: "Easy returns", d: "7-day hassle-free" },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="p-4 text-center">
            <div className="pill mx-auto grid h-14 w-14 place-items-center bg-pastel mb-4"><I className="h-6 w-6" strokeWidth={1.5} /></div>
            <h3 className="text-lg font-medium">{t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{d}</p>
          </div>
        ))}
      </section>

      {/* 9. Footer */}
      <Wave fill="text-foreground" flip />
      <footer className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <span className="font-serif text-4xl italic">Juicé</span>
              <p className="mt-3 max-w-sm text-sm text-background/70">Fruity fragrances for people who don't do boring. Get 10% off your first order.</p>
              {subscribed ? (
                <p className="mt-5 text-sm text-kiwi">You're on the list! 🍓</p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSubscribed(true); }} className="pill mt-5 flex max-w-sm bg-background/10 p-1">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-background/50" />
                  <button className="pill bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Subscribe</button>
                </form>
              )}
            </div>
            {[
              { h: "Shop", l: ["EDP Fragrances", "Attar", "Gifting", "Minis"] },
              { h: "Help", l: ["FAQs", "Track Order", "Store Locator", "Contact Us"] },
              { h: "Policies", l: ["Shipping", "Returns", "Privacy Policy", "Terms of Service"] },
            ].map((c) => (
              <div key={c.h}>
                <h4 className="font-sans text-sm font-semibold uppercase tracking-widest">{c.h}</h4>
                <ul className="mt-4 space-y-2 text-sm text-background/70">{c.l.map((x) => <li key={x}><a href="#" className="hover:text-kiwi transition-colors">{x}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 text-xs text-background/60 md:flex-row border-t border-background/10 pt-8">
            <span>© 2026 Juicé Fragrances. All rights reserved.</span>
            <div className="flex gap-2">{["UPI", "Visa", "Mastercard", "RuPay", "COD"].map((p) => <span key={p} className="pill border border-background/20 px-3 py-1">{p}</span>)}</div>
            <div className="flex gap-4"><Instagram className="h-5 w-5 hover:text-white transition-colors" /><Facebook className="h-5 w-5 hover:text-white transition-colors" /><Youtube className="h-5 w-5 hover:text-white transition-colors" /></div>
          </div>
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/40" onClick={() => setCartOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-cream animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-2xl">Your bag ({count})</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button>
            </div>
            <div className="bg-pastel px-6 py-3 text-sm">
              {freeLeft > 0 ? <>Add <b>{inr(freeLeft)}</b> more for free shipping 🚚</> : <>You've unlocked <b>free shipping</b>! 🎉</>}
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {count === 0 && <p className="text-center text-muted-foreground">Your bag is empty — go get juicy.</p>}
              {Object.entries(cart).map(([id, q]) => {
                const p = products.find((x) => x.id === +id);
                if (!p) return null;
                return (
                  <div key={id} className="flex gap-4">
                    <img src={p.img} alt={p.name} className="h-20 w-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{inr(p.price)}</p>
                      <div className="pill mt-2 inline-flex items-center gap-3 border px-2 py-1">
                        <button aria-label="Decrease" onClick={() => add(p.id, -1)}><Minus className="h-3.5 w-3.5" /></button>
                        <span className="text-sm">{q}</span>
                        <button aria-label="Increase" onClick={() => add(p.id, 1)}><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <p className="font-medium">{inr(p.price * q)}</p>
                  </div>
                );
              })}
            </div>
            <div className="border-t p-6">
              <div className="flex justify-between text-lg"><span>Subtotal</span><b>{inr(subtotal)}</b></div>
              <button disabled={!count} className="pill mt-4 w-full bg-foreground py-4 font-medium text-background disabled:opacity-40 transition-opacity">Checkout</button>
            </div>
          </aside>
        </div>
      )}

      {/* User Profile drawer */}
      <UserProfileDrawer
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onAddToCart={(name) => {
          const match = products.find((prod) => prod.name.toLowerCase().includes(name.toLowerCase()));
          if (match) add(match.id);
          else add(1);
        }}
      />
    </div>
  );
}

function Card({
  p,
  add,
  wish,
  setWish,
  pop,
  videoMode = "hover",
}: {
  p: Product;
  add: (id: number) => void;
  wish: number[];
  setWish: (f: (w: number[]) => number[]) => void;
  pop?: boolean | undefined;
  videoMode?: "hover" | "autoplay" | undefined;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const liked = wish.includes(p.id);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoMode === "hover" && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoMode === "hover" && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex flex-col rounded-[2rem] bg-card p-3 shadow-sm transition-all duration-300 ${
        pop
          ? "hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.03] hover:ring-2 hover:ring-foreground/5 z-10 hover:z-20 relative bg-background"
          : "hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div className={`${p.bg} relative overflow-hidden rounded-[1.5rem]`}>
        {videoMode === "autoplay" && p.video ? (
          <video
            src={p.video}
            poster={p.img}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:scale-[1.08]"
          />
        ) : (
          <>
            <img
              src={p.img}
              alt={p.name}
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {p.video && (
              <video
                ref={videoRef}
                src={p.video}
                loop
                muted
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 pointer-events-none ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </>
        )}
        <div className="absolute left-3 top-3 z-10">{p.badge && <Badge kind={p.badge} />}</div>
        <button
          aria-label="Wishlist"
          onClick={() => setWish((w) => (liked ? w.filter((x) => x !== p.id) : [...w, p.id]))}
          className="pill absolute right-3 top-3 z-10 bg-card/90 p-2 transition-transform hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-hot text-hot" : ""}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <span className="pill w-fit bg-pastel px-2.5 py-0.5 text-[11px] font-medium">{p.cat}</span>
        <h3 className="mt-2 text-lg leading-tight md:text-xl">{p.name}</h3>
        <p className="text-xs text-muted-foreground">{p.notes}</p>
        <div className="mt-1.5 flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-foreground" /> {p.rating} <span className="text-muted-foreground">({p.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold">{inr(p.price)}</span>
          {p.was && (
            <>
              <span className="text-sm text-muted-foreground line-through">{inr(p.was)}</span>
              <span className="text-xs font-semibold text-sale">-{Math.round((1 - p.price / p.was) * 100)}%</span>
            </>
          )}
        </div>
        <button onClick={() => add(p.id)} className="pill mt-auto w-full bg-primary py-2.5 text-sm font-medium transition hover:bg-kiwi md:mt-4">Add to bag</button>
      </div>
    </div>
  );
}

export default Index;
