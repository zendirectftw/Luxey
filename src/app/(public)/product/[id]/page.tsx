"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { sampleProducts } from "@/data/products";
import LuxeyCTA from "@/components/LuxeyCTA";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
    const params = useParams();
    const product = sampleProducts.find((p) => p.id === params.id);
    const [mainImage, setMainImage] = useState(product?.image || "");
    const { addToCart } = useCart();

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto py-20 px-6 text-center">
                <h1 className="font-serif text-4xl uppercase mb-4">
                    Product Not Found
                </h1>
                <Link
                    href="/explore"
                    className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black"
                >
                    ← Back to Explore
                </Link>
            </div>
        );
    }

    // Simulated thumbnail variants
    const thumbnails = [product.image, product.image, product.image];

    return (
        <section className="max-w-7xl mx-auto w-full py-10 px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <Link href="/" className="hover:text-black transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link href="/explore" className="hover:text-black transition-colors">
                    Explore
                </Link>
                <span>/</span>
                <span className="text-black">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ═══ IMAGE GALLERY ═══ */}
                <div>
                    {/* Main Image */}
                    <div className="bg-[#FAFAFA] border border-[#E4E4E4] rounded-sm aspect-square flex items-center justify-center p-12 mb-4">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-contain mix-blend-multiply"
                            priority
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3">
                        {thumbnails.map((thumb, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(thumb)}
                                className={`w-20 h-20 border rounded-sm flex items-center justify-center p-2 transition-all ${mainImage === thumb && idx === 0
                                    ? "border-[#D4AF37] border-2"
                                    : "border-[#E4E4E4] opacity-50 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={thumb}
                                    alt={`${product.name} view ${idx + 1}`}
                                    width={60}
                                    height={60}
                                    className="object-contain mix-blend-multiply"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ═══ PRODUCT INFO ═══ */}
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl text-black tracking-tight uppercase leading-none mb-3">
                        {product.name}
                    </h1>

                    <div className="flex gap-4 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] px-3 py-1 rounded border border-[#E4E4E4]">
                            {product.weight}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] px-3 py-1 rounded border border-[#E4E4E4]">
                            {product.mint}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] px-3 py-1 rounded border border-[#E4E4E4]">
                            .9999 Fine
                        </span>
                    </div>

                    {/* Pricing Panel */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden mb-8">
                        <div className="grid grid-cols-2 divide-x divide-[#E4E4E4]">
                            <div className="p-6 text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Highest Bid
                                </p>
                                <p className="text-3xl font-black text-black tracking-tighter tabular-nums">
                                    {product.bid}
                                </p>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Lowest Ask
                                </p>
                                <p className="text-3xl font-black text-[#16a34a] tracking-tighter tabular-nums">
                                    {product.ask}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 border-t border-[#E4E4E4]">
                            <Link
                                href={`/checkout?product=${product.id}&action=sell`}
                                className="group relative py-5 text-center text-[11px] font-black uppercase tracking-widest bg-white hover:bg-black hover:text-[#D4AF37] transition-all duration-300 border-r border-[#E4E4E4]"
                            >
                                <span className="relative z-10">Sell</span>
                            </Link>
                            <button
                                onClick={() => addToCart(product, "buy")}
                                className="group relative py-5 text-center text-[11px] font-black uppercase tracking-widest bg-black text-white hover:text-[#D4AF37] transition-all duration-300"
                            >
                                <span className="relative z-10">Add to Cart</span>
                            </button>
                        </div>
                    </div>

                    {/* Specs */}
                    <div className="border-t border-[#E4E4E4] pt-8">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                            Product Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Metal
                                </p>
                                <p className="text-sm font-bold text-black uppercase">Gold</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Weight
                                </p>
                                <p className="text-sm font-bold text-black uppercase">
                                    {product.weight}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Purity
                                </p>
                                <p className="text-sm font-bold text-black uppercase">
                                    .9999 Fine
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Mint
                                </p>
                                <p className="text-sm font-bold text-black uppercase">
                                    {product.mint}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Category
                                </p>
                                <p className="text-sm font-bold text-black uppercase">
                                    {product.category}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    Condition
                                </p>
                                <p className="text-sm font-bold text-black uppercase">
                                    Brilliant Uncirculated
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-[#E4E4E4] pt-8 mt-8">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">
                            Description
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            This {product.name} is struck from {product.weight} of .9999 fine
                            gold by {product.mint}. Each piece comes in its original assay card
                            or capsule, ensuring authenticity and protection. Eligible for
                            storage in the Luxey Denver Vault or direct shipment to your door.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
