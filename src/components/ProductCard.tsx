"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";

export interface Product {
    id: string;
    name: string;
    weight: string;
    weightLabel: string;
    mint: string;
    image: string;
    bid: string;
    ask: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { isFavorited, toggleFavorite } = useFavorites();
    const { addToCart } = useCart();
    const liked = isFavorited(product.id);

    return (
        <Link
            href={`/product/${product.id}`}
            className="group bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-[#D4AF37] block"
        >
            {/* Image */}
            <div className="relative aspect-square bg-[#FAFAFA] flex items-center justify-center p-6 overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={240}
                    height={240}
                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />

                {/* Heart Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product.id);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${liked
                        ? "bg-red-50 border-red-200 opacity-100"
                        : "bg-white border-[#E4E4E4] opacity-0 group-hover:opacity-100 hover:border-red-300"
                        }`}
                    aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={liked ? "#ef4444" : "none"}
                        stroke={liked ? "#ef4444" : "currentColor"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Quick Add to Cart */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, "buy");
                    }}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full border bg-white border-[#E4E4E4] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white hover:border-black transition-all"
                    aria-label="Add to cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                </button>
            </div>

            {/* Info */}
            <div className="p-4 border-t border-[#F5F5F5]">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-black leading-tight mb-1 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {product.weight} • {product.mint}
                </p>

                {/* Bid / Ask */}
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                            Bid
                        </p>
                        <p className="text-sm font-black text-black tracking-tighter tabular-nums">
                            {product.bid}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                            Ask
                        </p>
                        <p className="text-sm font-black text-[#16a34a] tracking-tighter tabular-nums">
                            {product.ask}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
