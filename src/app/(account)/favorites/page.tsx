"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

interface Product {
    id: string;
    name: string;
    slug: string;
    metal: string;
    category: string;
    weight_oz: number;
    purity: number;
    mint: string | null;
    year: number | null;
    image_url: string | null;
    is_active: boolean;
}

export default function FavoritesPage() {
    const { favorites } = useFavorites();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .order("name");

            setProducts(data || []);
            setLoading(false);
        }
        load();
    }, []);

    const favoritedProducts = products.filter(p => favorites.has(p.id));

    // Map to ProductCard expected shape
    const mappedProducts = favoritedProducts.map(p => ({
        id: p.id,
        name: p.name,
        weight: `${p.weight_oz} oz`,
        weightLabel: `${p.weight_oz} Troy Ounce`,
        mint: p.mint || "",
        image: p.image_url || "",
        bid: "—",
        ask: "—",
        category: p.category,
    }));

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto w-full py-8 px-6">
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    return (
        <>
            {/* BREADCRUMB */}
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">Favorites</span>
                </nav>
            </div>

            <section className="max-w-7xl mx-auto w-full py-8 px-6">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="font-serif text-4xl md:text-5xl text-black tracking-tight uppercase leading-none mb-2">
                        My Favorites
                    </h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {favoritedProducts.length} saved product{favoritedProducts.length !== 1 ? "s" : ""}
                    </p>
                </header>

                {mappedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {mappedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-[#E4E4E4] rounded-sm">
                        <div className="text-5xl mb-4">♡</div>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
                            No favorites yet
                        </p>
                        <p className="text-xs text-gray-400 mb-6 max-w-sm mx-auto">
                            Click the heart icon on any product to save it here for quick access.
                        </p>
                        <Link
                            href="/explore"
                            className="inline-block px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                )}
            </section>
        </>
    );
}
