import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import hero from "@/assets/hero-kiwi.jpg";
import melon from "@/assets/p-watermelon.jpg";
import peach from "@/assets/p-peach.jpg";
import vanilla from "@/assets/p-vanilla.jpg";

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
  id: number; name: string; notes: string; img: string; price: number; was?: number;
  rating: number; reviews: number; badge?: "sale" | "best" | "new"; cat: string; bg: string;
};

const products: Product[] = [
  { id: 1, name: "Kiwi Crush", notes: "Kiwi · Lime · Green tea", img: hero, price: 1299, rating: 4.8, reviews: 412, badge: "best", cat: "EDP", bg: "bg-pastel" },
  { id: 2, name: "Watermelon Berry", notes: "Watermelon · Strawberry · Musk", img: melon, price: 1099, was: 1499, rating: 4.7, reviews: 289, badge: "sale", cat: "EDP", bg: "bg-melon" },
  { id: 3, name: "Peach Please", notes: "Peach · Apricot · Neroli", img: peach, price: 1199, rating: 4.9, reviews: 530, badge: "best", cat: "EDP", bg: "bg-peach-gradient" },
  { id: 4, name: "Ambre Caramel", notes: "Vanilla · Caramel · Cocoa", img: vanilla, price: 899, was: 1199, rating: 4.6, reviews: 174, badge: "sale", cat: "Attar", bg: "bg-cream" },
  { id: 5, name: "Melon Mist Attar", notes: "Melon · Rose · Oud", img: melon, price: 749, rating: 4.5, reviews: 98, badge: "new", cat: "Attar", bg: "bg-melon" },
  { id: 6, name: "Citrus Pop Duo", notes: "Gift set · 2 × 30ml", img: hero, price: 1999, was: 2599, rating: 4.8, reviews: 211, badge: "sale", cat: "Gifting", bg: "bg-pastel" },
  { id: 7, name: "Peach Fizz Mini", notes: "Peach · Soda · Pear", img: peach, price: 599, rating: 4.7, reviews: 143, badge: "new", cat: "EDP", bg: "bg-peach-gradient" },
  { id: 8, name: "Gourmand Gift Box", notes: "Gift set · 3 × 10ml", img: vanilla, price: 1499, rating: 4.9, reviews: 320, badge: "best", cat: "Gifting", bg: "bg-cream" },
];

const slides = [
  { img: hero, tag: "New Arrival", title: "Your glow-up smells like kiwi.", sub: "Meet Kiwi Crush — zesty, green and impossibly fresh.", bg: "bg-kiwi" },
  { img: melon, tag: "Summer Sale · 30% off", title: "Juicy, sweet & a little extra.", sub: "Watermelon Berry is back for the season.", bg: "bg-melon" },
  { img: peach, tag: "Bestseller", title: "Peach, please. Always.", sub: "Our most-loved fruity floral, now in minis.", bg: "bg-peach-gradient" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Wave({ fill, flip }: { fill: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-12 w-full md:h-20 ${fill} ${flip ? "rotate-180" : ""}`} aria-hidden>
      <path fill="currentColor" d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" />
    </svg>
  );
}

function Badge({ kind }: { kind: NonNullable<Product["badge"]> }) {
  const map = {
    sale: "bg-sale text-destructive-foreground",
    best: "bg-hot text-destructive-foreground",
    new: "bg-primary text-primary-foreground",
  } as const;
  const label = { sale: "Sale", best: "Bestseller", new: "New" }[kind];
  return <span className={`pill px-3 py-1 text-xs font-semibold ${map[kind]}`}>{label}</span>;
}

function Index() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wish, setWish] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const add = (id: number, d = 1) =>
    setCart((c) => {
      const q = (c[id] ?? 0) + d;
      const n = { ...c };
      if (q <= 0) delete n[id]; else n[id] = q;
      return n;
    });
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + products.find((p) => p.id === +id)!.price * q, 0);
  const freeLeft = Math.max(0, 999 - subtotal);

  const bestSellers = products.filter(p => p.badge === "best" || p.badge === "sale").slice(0, 4);
  
  const naList = products.filter(p => p.badge === "new" || p.id > 4);
  // Triple the array to completely eliminate any looping gaps on large screens
  const newArrivals = [...naList, ...naList.map(p => ({...p, id: p.id + 100})), ...naList.map(p => ({...p, id: p.id + 200}))];

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
          <a href="#" className="font-serif text-3xl font-semibold italic tracking-tight text-center">Juicé</a>
          <div className="flex items-center justify-end gap-4">
            <User className="hidden h-5 w-5 sm:block" strokeWidth={1.5} />
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
              <span className="font-serif text-2xl italic">Juicé</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close"><X /></button>
            </div>
            {nav.map((n) => (
              <details key={n.label} className="border-b py-3">
                <summary className="cursor-pointer font-medium">{n.label}</summary>
                {n.items.map((i) => <a key={i} href="#shop" onClick={() => setMenuOpen(false)} className="block py-1.5 pl-3 text-sm text-muted-foreground">{i}</a>)}
              </details>
            ))}
          </div>
        </div>
      )}

      {/* 1. Hero carousel */}
      <section className={`${s.bg} relative transition-colors duration-700`}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20">
          <div key={slide} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="pill bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">{s.tag}</span>
            <h1 className="mt-6 text-5xl font-medium leading-[1.05] md:text-7xl">{s.title}</h1>
            <p className="mt-5 max-w-md text-lg text-foreground/75">{s.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#shop" className="pill bg-foreground px-8 py-3.5 font-medium text-background transition hover:scale-105">Shop Now</a>
              <a href="#lines" className="pill bg-card px-8 py-3.5 font-medium transition hover:scale-105">Discover More</a>
            </div>
          </div>
          <div className="relative">
            <img key={s.img + slide} src={s.img} alt={s.title} width={1024} height={1024} className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-2xl animate-in fade-in zoom-in-95 duration-700" />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button aria-label="Previous" onClick={() => setSlide((slide + slides.length - 1) % slides.length)} className="pill bg-card p-2"><ChevronLeft className="h-4 w-4" /></button>
              <button aria-label="Next" onClick={() => setSlide((slide + 1) % slides.length)} className="pill bg-card p-2"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-6">
          {slides.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} className={`pill h-2 transition-all ${i === slide ? "w-8 bg-foreground" : "w-2 bg-foreground/30"}`} />
          ))}
        </div>
        <Wave fill="text-background" />
      </section>

      {/* 2. Best Sellers */}
      <section id="best-sellers" className="bg-background pt-10">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <h2 className="text-4xl md:text-5xl text-center">The <em>Bestsellers</em></h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2 md:px-0">
            {bestSellers.map((p) => (
              <Card key={p.id} p={p} add={add} wish={wish} setWish={setWish} pop />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
             <a href="#shop" className="border-b-2 border-foreground pb-1 font-medium hover:text-hot hover:border-hot transition-colors">VIEW ALL BESTSELLERS</a>
          </div>
        </div>
      </section>

      {/* 2b. New Arrivals */}
      <section id="new-arrivals" className="bg-background pt-4 pb-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8 border-t border-foreground/10 pt-16">
          <h2 className="text-4xl md:text-5xl text-center">New <em>Arrivals</em></h2>
        </div>
        <div className="mt-10 relative w-full overflow-hidden">
          <Carousel 
            opts={{ align: "start", loop: true, dragFree: true }} 
            plugins={[AutoScroll({ playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false, speed: 1.5 })] as any}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselContent className="py-4">
              {newArrivals.map((p) => (
                <CarouselItem key={p.id} className="pl-4 md:pl-6 basis-[85%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]">
                  <Card p={p} add={add} wish={wish} setWish={setWish} pop />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-8 mt-12 flex justify-center">
           <a href="#shop" className="border-b-2 border-foreground pb-1 font-medium hover:text-hot hover:border-hot transition-colors">VIEW ALL NEW ARRIVALS</a>
        </div>
      </section>

      {/* 3. 4-Grid Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {[
            { t: "EDP", img: hero, bg: "bg-pastel" },
            { t: "Attars", img: melon, bg: "bg-melon" },
            { t: "Gifting", img: peach, bg: "bg-peach-gradient" },
            { t: "Minis", img: vanilla, bg: "bg-cream" },
          ].map((c) => (
            <a key={c.t} href="#shop" className={`${c.bg} group overflow-hidden rounded-[2rem] relative aspect-square flex items-end p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ring-2 ring-transparent hover:ring-foreground/10`}>
              <img src={c.img} alt={c.t} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="text-3xl text-white relative z-10 font-serif italic drop-shadow-md group-hover:translate-x-1 transition-transform duration-500">{c.t}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* 4. Promo banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="bg-peach-gradient grid items-center gap-8 overflow-hidden rounded-[2.5rem] md:grid-cols-2">
          <div className="p-10 md:p-14">
            <span className="pill bg-sale px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-destructive-foreground">Limited · 25% off</span>
            <h2 className="mt-5 text-4xl leading-tight md:text-5xl">The Peach Nectar collection is <em>ripe</em>.</h2>
            <p className="mt-4 text-foreground/75">Sun-warmed peach, apricot and a hint of neroli. Bottled sunshine for every day.</p>
            <a href="#shop" className="pill mt-8 inline-block bg-foreground px-8 py-3.5 font-medium text-background hover:scale-105 transition-transform">Shop the line</a>
          </div>
          <img src={peach} alt="Peach Please perfume" loading="lazy" className="h-full max-h-[480px] w-full object-cover" />
        </div>
      </section>

      {/* 5. Shop by Scent (Stacked Cards Animation) */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
          <h2 className="text-center text-4xl md:text-5xl mb-12">Shop by <em>scent</em></h2>
          <div className="relative flex flex-col items-center w-full">
            {[
              { n: "Citrus", notes: "Zesty, green, wake-up energy. Features bright notes of Bergamot, Lime, and Mandarin to instantly refresh your senses.", i: hero, bg: "bg-kiwi" },
              { n: "Sweet", notes: "Juicy, playful & a little extra. A delicious blend of Watermelon, Strawberry, and soft Musk for an addictive trail.", i: melon, bg: "bg-melon" },
              { n: "Floral", notes: "Warm, golden, blooming fields. Elegant notes of Jasmine, Rose, and Neroli that evoke a sunny afternoon walk.", i: peach, bg: "bg-peach-gradient" },
              { n: "Gourmand", notes: "Rich, edible, cozy comfort. Decadent layers of Caramel, Cocoa, and Tonka Bean that smell good enough to eat.", i: vanilla, bg: "bg-cream" }
            ].map((s, idx, arr) => (
              <div 
                key={s.n} 
                className={`sticky w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[450px] border border-foreground/5 ${idx === arr.length - 1 ? 'mb-0' : 'mb-[15vh]'}`}
                style={{ 
                  zIndex: 10 + idx, 
                  top: `calc(120px + ${idx * 40}px)` 
                }}
              >
                 <div className={`${s.bg} w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center`}>
                    <h3 className="text-4xl md:text-5xl font-serif italic mb-6">{s.n}</h3>
                    <p className="text-lg text-foreground/80 leading-relaxed mb-8">{s.notes}</p>
                    <a href="#shop" className="pill w-fit bg-foreground px-8 py-3.5 font-medium text-background transition hover:scale-105">
                      Explore {s.n}
                    </a>
                 </div>
                 <div className={`${s.bg} w-full md:w-1/2 h-[300px] md:h-full relative`}>
                    <img src={s.i} alt={s.n} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Editor's Picks */}
      <Wave fill="text-pastel" flip />
      <section className="bg-pastel pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-center text-4xl md:text-5xl mb-10">Our Editor's <em>Picks</em></h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {products.slice(0, 4).reverse().map((p) => <Card key={p.id} p={{...p, id: p.id+10}} add={add} wish={wish} setWish={setWish} />)}
          </div>
        </div>
      </section>
      <Wave fill="text-pastel" />

      {/* 7. UGC / Heritage */}
      <section className="bg-background pt-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-center text-4xl md:text-5xl">#SmellJuicé</h2>
          <p className="mt-3 text-center text-foreground/75 mb-10">Real people, real spritzes. Tag us to be featured.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[hero, melon, peach, vanilla].map((img, i) => (
              <div key={i} className="relative overflow-hidden rounded-[1.75rem] group">
                <img src={img} alt="Customer post" loading="lazy" className="aspect-[3/4] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <span className="pill absolute bottom-3 left-3 bg-card/90 px-3 py-1 text-xs font-medium">@{["aanya.vibes", "rohan.daily", "mira_glows", "kabirspritz"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                const p = products.find((x) => x.id === +id)!;
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
    </div>
  );
}

function Card({ p, add, wish, setWish, pop }: { p: Product; add: (id: number) => void; wish: number[]; setWish: (f: (w: number[]) => number[]) => void; pop?: boolean }) {
  const liked = wish.includes(p.id);
  return (
    <div className={`group flex flex-col rounded-[2rem] bg-card p-3 shadow-sm transition-all duration-300 ${pop ? "hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.03] hover:ring-2 hover:ring-foreground/5 z-10 hover:z-20 relative bg-background" : "hover:-translate-y-1 hover:shadow-xl"}`}>
      <div className={`${p.bg} relative overflow-hidden rounded-[1.5rem]`}>
        <img src={p.img} alt={p.name} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3">{p.badge && <Badge kind={p.badge} />}</div>
        <button aria-label="Wishlist" onClick={() => setWish((w) => (liked ? w.filter((x) => x !== p.id) : [...w, p.id]))} className="pill absolute right-3 top-3 bg-card/90 p-2 transition-transform hover:scale-110">
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
          {p.was && <><span className="text-sm text-muted-foreground line-through">{inr(p.was)}</span><span className="text-xs font-semibold text-sale">-{Math.round((1 - p.price / p.was) * 100)}%</span></>}
        </div>
        <button onClick={() => add(p.id)} className="pill mt-auto w-full bg-primary py-2.5 text-sm font-medium transition hover:bg-kiwi md:mt-4">Add to bag</button>
      </div>
    </div>
  );
}

export default Index;
