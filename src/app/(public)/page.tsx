"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { sampleProducts, categories, weightFilters } from "@/data/products";
import { useFavorites } from "@/context/FavoritesContext";

const heroSlides = [
    {
        title: "1 oz PAMP Lady Fortuna",
        subtitle: "The World's Most Trusted Gold Bar",
        image: "/hero-pamp-fortuna.png",
        cta: "View Product",
        href: "/product/pamp-fortuna-1oz",
    },
    {
        title: "American Gold Eagle",
        subtitle: "America's Premier Gold Bullion Coin",
        image: "/hero-gold-eagle.png",
        cta: "View Product",
        href: "/product/gold-eagle-1oz",
    },
    {
        title: "Canadian Gold Maple Leaf",
        subtitle: ".9999 Fine Gold — Purest in the World",
        image: "/hero-maple-leaf.png",
        cta: "View Product",
        href: "/product/canadian-maple-1oz",
    },
];

export default function HomePage() {
    const [slideIndex, setSlideIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeWeight, setActiveWeight] = useState<string | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { isFavorited, count: favCount } = useFavorites();

    // Auto-advance slider
    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % heroSlides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Filter products
    const filteredProducts = sampleProducts.filter((p) => {
        const matchesCategory =
            activeCategory === "All" || p.category === activeCategory;
        const matchesWeight =
            !activeWeight || p.weightLabel === activeWeight;
        const matchesFavorites =
            !showFavoritesOnly || isFavorited(p.id);
        const matchesSearch = p.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesWeight && matchesFavorites && matchesSearch;
    });

    return (
        <>
            {/* ═══ HERO SECTION ═══ */}
            <section className="relative bg-black overflow-hidden">
                <div className="relative h-[420px] md:h-[480px]">
                    <div
                        className="flex transition-transform duration-700 ease-in-out h-full"
                        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                    >
                        {heroSlides.map((slide, idx) => (
                            <div
                                key={idx}
                                className="min-w-full h-full flex items-center justify-between px-8 md:px-20"
                            >
                                <div className="max-w-lg z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                                        Featured Product
                                    </p>
                                    <h1 className="font-serif text-4xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
                                        {slide.title}
                                    </h1>
                                    <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider mb-8">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.href}
                                        className="inline-block bg-[#D4AF37] text-black px-8 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-[#C4A030] transition-colors"
                                    >
                                        {slide.cta}
                                    </Link>
                                </div>
                                <div className="hidden md:flex items-center justify-center flex-1">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        width={320}
                                        height={320}
                                        className="object-contain drop-shadow-2xl border-2 border-[#D4AF37]/60 rounded-lg"
                                        priority={idx === 0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSlideIndex(idx)}
                                className={`w-8 h-1 rounded-full transition-all duration-300 ${idx === slideIndex ? "bg-[#D4AF37] w-12" : "bg-zinc-600"}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ BRAND BAR ═══ */}
            <div className="bg-[#D4AF37] py-3 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-black">
                        The Ideal Way to Invest in Physical Gold and Precious Metals
                    </p>
                </div>
            </div>

            {/* ═══ MARKETPLACE SECTION ═══ */}
            <section className="max-w-7xl mx-auto w-full py-10 px-6">
                {/* Filters + Search */}
                <div className="flex flex-wrap gap-2 mb-8 items-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setActiveWeight(null);
                                setShowFavoritesOnly(false);
                            }}
                            className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-sm ${activeCategory === cat && !activeWeight && !showFavoritesOnly
                                ? "bg-black text-white"
                                : "bg-white text-gray-600 border border-[#E4E4E4] hover:border-black"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}

                    {/* Separator */}
                    <div className="h-6 w-px bg-[#E4E4E4] mx-1 shrink-0" />

                    {/* Weight Filters */}
                    {weightFilters.map((wf) => (
                        <button
                            key={wf}
                            onClick={() => {
                                if (activeWeight === wf) {
                                    setActiveWeight(null);
                                } else {
                                    setActiveWeight(wf);
                                    setActiveCategory("All");
                                    setShowFavoritesOnly(false);
                                }
                            }}
                            className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-sm ${activeWeight === wf
                                ? "bg-black text-white"
                                : "bg-white text-gray-600 border border-[#E4E4E4] hover:border-black"
                                }`}
                        >
                            {wf}
                        </button>
                    ))}

                    {/* Separator */}
                    <div className="h-6 w-px bg-[#E4E4E4] mx-1 shrink-0" />

                    {/* Big Box Link */}
                    <Link
                        href="/big-box"
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-sm bg-white text-gray-600 border border-[#E4E4E4] hover:border-black"
                    >
                        Big Box
                    </Link>

                    {/* Favorites Filter */}
                    <button
                        onClick={() => {
                            setShowFavoritesOnly(!showFavoritesOnly);
                            if (!showFavoritesOnly) {
                                setActiveCategory("All");
                                setActiveWeight(null);
                            }
                        }}
                        className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all ${showFavoritesOnly
                            ? "bg-red-50 border-red-300 text-red-500"
                            : "bg-white border-[#E4E4E4] text-gray-400 hover:border-red-300 hover:text-red-400"
                            }`}
                        aria-label="Show favorites"
                        title={`Favorites${favCount > 0 ? ` (${favCount})` : ""}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={showFavoritesOnly ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>

                    {/* Search — pushed to right */}
                    <div className="relative w-full md:w-60 md:ml-auto shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#E4E4E4] rounded-sm text-sm font-medium focus:border-black focus:outline-none transition-colors bg-white"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                            No products found
                        </p>
                    </div>
                )}

                {/* View All CTA */}
                <div className="text-center mt-10">
                    <Link
                        href="/explore"
                        className="inline-block border-2 border-black text-black px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                        View All Products
                    </Link>
                </div>
            </section>

            {/* ═══ SPEED PROMISE SECTION ═══ */}
            <section className="bg-black py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                            The Luxey Difference
                        </p>
                        <h3 className="font-serif text-4xl md:text-5xl text-white uppercase tracking-tight leading-none">
                            Built for Speed
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 border border-zinc-800 rounded-sm hover:border-[#D4AF37] transition-colors">
                            <div className="text-4xl mb-4">🏷️</div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                Fastest Labels
                            </h4>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                Shipping labels generated instantly upon sale confirmation.
                                No waiting.
                            </p>
                        </div>
                        <div className="text-center p-8 border border-zinc-800 rounded-sm hover:border-[#D4AF37] transition-colors">
                            <div className="text-4xl mb-4">💰</div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                Fastest Payouts
                            </h4>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                Real-Time Payments (RTP) — funds hit your account the moment
                                verification completes.
                            </p>
                        </div>
                        <div className="text-center p-8 border border-zinc-800 rounded-sm hover:border-[#D4AF37] transition-colors">
                            <div className="text-4xl mb-4">🏆</div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                Easiest Sourcing
                            </h4>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                Browse, bid, buy — the simplest precious metals marketplace
                                ever built.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
