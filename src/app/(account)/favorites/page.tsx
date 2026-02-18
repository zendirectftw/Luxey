"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { sampleProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function FavoritesPage() {
    const { favorites } = useFavorites();
    const favoritedProducts = sampleProducts.filter(p => favorites.has(p.id));

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

                {favoritedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {favoritedProducts.map(product => (
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
