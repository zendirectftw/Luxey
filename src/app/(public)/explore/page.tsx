"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { sampleProducts, categories, weightFilters } from "@/data/products";
import { useFavorites } from "@/context/FavoritesContext";

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeWeight, setActiveWeight] = useState<string | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const { isFavorited, count: favCount } = useFavorites();

    const filteredProducts = sampleProducts
        .filter((p) => {
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
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price-asc")
                return (
                    parseFloat(a.ask.replace(/[$,]/g, "")) -
                    parseFloat(b.ask.replace(/[$,]/g, ""))
                );
            if (sortBy === "price-desc")
                return (
                    parseFloat(b.ask.replace(/[$,]/g, "")) -
                    parseFloat(a.ask.replace(/[$,]/g, ""))
                );
            return 0;
        });

    return (
        <section className="max-w-7xl mx-auto w-full py-10 px-6">
            {/* Header */}
            <header className="mb-10">
                <h1 className="font-serif text-5xl md:text-6xl text-black tracking-tight uppercase leading-none mb-3">
                    Marketplace
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Explore our catalog of certified precious metals
                </p>
            </header>

            {/* Controls Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 items-center">
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

                    {/* Big Box Link */}
                    <Link
                        href="/big-box"
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-sm bg-white text-gray-600 border border-[#E4E4E4] hover:border-black flex items-center gap-1.5"
                    >
                        🏪 Big Box
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
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
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
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-[#E4E4E4] rounded-sm text-sm font-medium focus:border-black focus:outline-none transition-colors bg-white"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 border border-[#E4E4E4] rounded-sm text-[10px] font-black uppercase tracking-widest bg-white focus:border-black focus:outline-none"
                    >
                        <option value="name">Name A-Z</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                {filteredProducts.length} Product
                {filteredProducts.length !== 1 ? "s" : ""} Found
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                        No products match your search
                    </p>
                    <button
                        onClick={() => {
                            setActiveCategory("All");
                            setSearchQuery("");
                        }}
                        className="mt-4 text-[11px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </section>
    );
}
