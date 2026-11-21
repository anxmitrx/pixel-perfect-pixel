import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Star, Heart, ShoppingBag, Sparkles } from "lucide-react";

import hero from "@/assets/hero-kiwi.jpg";
import melon from "@/assets/p-watermelon.jpg";
import peach from "@/assets/p-peach.jpg";
import vanilla from "@/assets/p-vanilla.jpg";

import kiwiVideo from "@/assets/vdos/kiwi.mp4";
import watermelonVideo from "@/assets/vdos/watermelon.mp4";
import peachVideo from "@/assets/vdos/peach.mp4";
import ambreVideo from "@/assets/vdos/ambre.mp4";

export interface Product {
  id: number;
  name: string;
  notes: string;
  image: string;
  video?: string | undefined;
  price: number;
  originalPrice?: number | undefined;
  discount?: string | undefined;
  rating: number;
  reviews: number;
  badge?: ("Bestseller" | "Sale" | "New") | undefined;
  category: "EDP" | "Attar" | "Gifting";
  accentColor: string;
}

export const BESTSELLER_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kiwi Crush",
    notes: "Kiwi · Lime · Green tea",
    image: hero,
    video: kiwiVideo,
    price: 1299,
    rating: 4.8,
    reviews: 412,
    badge: "Bestseller",
    category: "EDP",
    accentColor: "from-lime-100 to-emerald-200",
  },
];

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface BestsellersFramerMotionProps {
  products?: Product[] | undefined;
  onAddToCart?: ((p: Product) => void) | undefined;
  onToggleWishlist?: ((id: number) => void) | undefined;
}

function BestsellerCard({
  product,
  onAddToCart,
  onToggleWishlist,
  smoothY,
  smoothScale,
  smoothShadow,
}: {
  product: Product;
  onAddToCart?: ((p: Product) => void) | undefined;
  onToggleWishlist?: ((id: number) => void) | undefined;
  smoothY: MotionValue<number>;
  smoothScale: MotionValue<number>;
  smoothShadow: MotionValue<string>;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      style={{
        y: smoothY,
        scale: smoothScale,
        boxShadow: smoothShadow,
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="relative z-10 group flex flex-col rounded-[2rem] bg-white p-3.5 transition-colors duration-300 hover:ring-2 hover:ring-stone-900/5"
    >
      {/* Product Video / Image Stage */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${product.accentColor}`}
      >
        {product.video ? (
          <video
            src={product.video}
            poster={product.image}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute left-3.5 top-3.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-sm ${
                product.badge === "Bestseller"
                  ? "bg-[#ff3366]"
                  : product.badge === "Sale"
                  ? "bg-[#ff4d36]"
                  : "bg-[#2563eb]"
              }`}
            >
              {product.badge === "Bestseller" && <Sparkles className="h-3 w-3" />}
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={`Wishlist ${product.name}`}
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
            onToggleWishlist?.(product.id);
          }}
          className="absolute right-3.5 top-3.5 rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-md transition-all hover:scale-115 hover:bg-white active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-[#ff3366] text-[#ff3366]" : "text-stone-700"
            }`}
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col px-2.5 pb-1 pt-4">
        <span className="w-fit rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
          {product.category}
        </span>

        <h3 className="mt-2 font-serif text-xl font-medium tracking-tight text-stone-900">
          {product.name}
        </h3>

        <p className="mt-0.5 font-sans text-xs tracking-wide text-stone-500">
          {product.notes}
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-800">
          <Star className="h-3.5 w-3.5 fill-stone-900 text-stone-900" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-stone-400">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-stone-900">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-stone-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
              <span className="text-xs font-bold text-[#ef4444]">
                {product.discount}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#c7f284] py-3 text-sm font-semibold text-stone-900 shadow-sm transition-all duration-300 hover:bg-[#b8e86c] hover:shadow-md active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to bag
        </button>
      </div>
    </motion.div>
  );
}

export default function BestsellersFramerMotion({
  products = BESTSELLER_PRODUCTS,
  onAddToCart,
  onToggleWishlist,
}: BestsellersFramerMotionProps) {
  // 1. Scroll Tracking on the section element
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 2. The "Lift and Settle" Bell Curve Math:
  // Starts flat at 0, lifts to -60px at center (0.4 - 0.6), drops back to 0 at end (1.0)
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, -60, -60, 0]);

  // Scales from 1.0 -> 1.05 at center -> 1.0 at end
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 1.05, 1.05, 1]);

  // Dynamic box-shadow peaking at center to enhance 3D elevation
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [
      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
      "0 28px 50px -12px rgba(0, 0, 0, 0.22), 0 14px 24px -8px rgba(0, 0, 0, 0.12)",
      "0 28px 50px -12px rgba(0, 0, 0, 0.22), 0 14px 24px -8px rgba(0, 0, 0, 0.12)",
      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
    ]
  );

  // 3. Smooth Spring Wrappers
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="best-sellers"
      className="relative bg-[#FAF7F2] pt-32 pb-28 md:pt-40 md:pb-36"
      aria-label="The Bestsellers Collection"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-serif text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            The <span className="italic">Bestsellers</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-stone-500 sm:text-base">
            Handcrafted fruit extractions and artisanal scents designed to turn heads.
          </p>
        </div>

        {/* Product Cards Grid: relative z-10 and ample padding prevents top clipping */}
        <div
          className={`relative z-10 mt-16 grid gap-6 lg:gap-7 ${
            products.length === 1
              ? "max-w-sm mx-auto grid-cols-1"
              : products.length === 2
              ? "max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2"
              : products.length === 3
              ? "max-w-5xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {products.slice(0, 4).map((product) => (
            <BestsellerCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              smoothY={smoothY}
              smoothScale={smoothScale}
              smoothShadow={shadow}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href="#shop"
            className="group inline-flex items-center gap-2 border-b-2 border-stone-900 pb-1 text-sm font-semibold tracking-wider text-stone-900 transition-colors hover:border-[#ff3366] hover:text-[#ff3366]"
          >
            VIEW ALL BESTSELLERS
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
