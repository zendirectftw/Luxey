"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface DealerQuote {
    dealerId: string;
    dealerName: string;
    dealerCity: string;
    dealerCode: string;
    spotAdjustment: number;
    premiumPct: number;
    computedBid: number;
    computedAsk: number;
}

interface ProductPricing {
    productId: string;
    productName: string;
    productSlug: string;
    metal: string;
    weightOz: number;
    purity: number;
    imageUrl: string;
    category: string;
    mint: string | null;
    bestBid: number;
    bestAsk: number;
    winningDealer: string;
    winningDealerCity: string;
    winningDealerCode: string;
    dealerQuotes: DealerQuote[];
    spotBid: number;
    spotAsk: number;
}

function formatUSD(val: number): string {
    if (val >= 1000) return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function weightDisplay(oz: number): string {
    if (oz === 1) return "1 Troy Oz";
    if (oz === 10) return "10 Troy Oz";
    const grams = Math.round(oz * 31.1035);
    if (grams === 100) return "100 Grams";
    return `${oz} Troy Oz`;
}

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<ProductPricing | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        let active = true;

        async function fetchProduct() {
            try {
                const res = await fetch(`/api/product-prices?productId=${params.id}`);
                const data = await res.json();
                if (active && data.products?.[0]) {
                    setProduct(data.products[0]);
                    setLastUpdated(new Date(data.fetchedAt).toLocaleTimeString());
                }
            } catch { /* ignore */ } finally {
                if (active) setLoading(false);
            }
        }

        fetchProduct();
        const interval = setInterval(fetchProduct, 15_000);
        return () => { active = false; clearInterval(interval); };
    }, [params.id]);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto py-20 px-6 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-72 mx-auto mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
                </div>
            </section>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto py-20 px-6 text-center">
                <h1 className="font-serif text-4xl uppercase mb-4">Product Not Found</h1>
                <Link href="/explore" className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black">
                    ← Back to Explore
                </Link>
            </div>
        );
    }

    const mainImage = product.imageUrl || "";
    const purityLabel = product.purity >= 0.9999 ? ".9999 Fine" : `.${Math.round(product.purity * 10000)} Fine`;
    const wt = weightDisplay(product.weightOz);
    const metalLabel = product.metal.charAt(0).toUpperCase() + product.metal.slice(1);

    // Prepare card-compatible product for cart
    const cartProduct = {
        id: product.productId,
        name: product.productName,
        weight: wt,
        weightLabel: wt,
        mint: product.mint || "",
        image: mainImage,
        bid: formatUSD(product.bestBid),
        ask: formatUSD(product.bestAsk),
        category: product.category,
    };

    return (
        <section className="max-w-7xl mx-auto w-full py-10 px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <span>/</span>
                <Link href="/explore" className="hover:text-black transition-colors">Explore</Link>
                <span>/</span>
                <span className="text-black">{product.productName}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ═══ IMAGE GALLERY ═══ */}
                <div>
                    <div className="bg-[#FAFAFA] border border-[#E4E4E4] rounded-sm aspect-square flex items-center justify-center p-12 mb-4">
                        <Image
                            src={mainImage}
                            alt={product.productName}
                            width={400}
                            height={400}
                            className="object-contain mix-blend-multiply"
                            priority
                        />
                    </div>
                    <div className="flex gap-3">
                        {[mainImage, mainImage, mainImage].map((thumb, idx) => (
                            <button
                                key={idx}
                                className={`w-20 h-20 border rounded-sm flex items-center justify-center p-2 transition-all ${idx === 0 ? "border-[#D4AF37] border-2" : "border-[#E4E4E4] opacity-50 hover:opacity-100"
                                    }`}
                            >
                                <Image src={thumb} alt={`View ${idx + 1}`} width={60} height={60} className="object-contain mix-blend-multiply" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ═══ PRODUCT INFO ═══ */}
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl text-black tracking-tight uppercase leading-none mb-3">
                        {product.productName}
                    </h1>

                    <div className="flex gap-4 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] px-3 py-1 rounded border border-[#E4E4E4]">
                            {wt}
                        </span>
                        {product.mint && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] px-3 py-1 rounded border border-[#E4E4E4]">
                                {product.mint}
                            </span>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] px-3 py-1 rounded border border-[#E4E4E4]">
                            {purityLabel}
                        </span>
                    </div>

                    {/* Pricing Panel */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden mb-4">
                        <div className="grid grid-cols-2 divide-x divide-[#E4E4E4]">
                            <div className="p-6 text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Highest Bid
                                </p>
                                <p className="text-3xl font-black text-black tracking-tighter tabular-nums">
                                    {formatUSD(product.bestBid)}
                                </p>
                                <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                    via {product.winningDealer}
                                </p>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Lowest Ask
                                </p>
                                <p className="text-3xl font-black text-[#16a34a] tracking-tighter tabular-nums">
                                    {formatUSD(product.bestAsk)}
                                </p>
                                <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                    via {product.winningDealer}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 border-t border-[#E4E4E4]">
                            <Link
                                href={`/checkout?product=${product.productId}&action=sell`}
                                className="group relative py-5 text-center text-[11px] font-black uppercase tracking-widest bg-white hover:bg-black hover:text-[#D4AF37] transition-all duration-300 border-r border-[#E4E4E4]"
                            >
                                <span className="relative z-10">Sell</span>
                            </Link>
                            <button
                                onClick={() => addToCart(cartProduct, "buy")}
                                className="group relative py-5 text-center text-[11px] font-black uppercase tracking-widest bg-black text-white hover:text-[#D4AF37] transition-all duration-300"
                            >
                                <span className="relative z-10">Add to Cart</span>
                            </button>
                        </div>
                    </div>

                    {/* Live Update Notice */}
                    <div className="flex items-center gap-2 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                            Live pricing · Updated {lastUpdated} · Source: Kitco
                        </p>
                    </div>

                    {/* ═══ DEALER COMPARISON TABLE — hidden ═══ */}
                    {/* {product.dealerQuotes.length > 0 && (
                        <div className="border-t border-[#E4E4E4] pt-8 mb-8">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                Dealer Comparison
                            </h3>
                            <div className="border border-[#E4E4E4] rounded-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                            <th className="text-left py-3 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Dealer</th>
                                            <th className="text-right py-3 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Spot Adj.</th>
                                            <th className="text-right py-3 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Premium</th>
                                            <th className="text-right py-3 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Bid</th>
                                            <th className="text-right py-3 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Ask</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.dealerQuotes.map((dq, idx) => (
                                            <tr
                                                key={dq.dealerId}
                                                className={`border-b border-[#F5F5F5] ${dq.dealerCode === product.winningDealerCode
                                                    ? "bg-[#FDFBF3]"
                                                    : ""
                                                    } ${idx === product.dealerQuotes.length - 1 ? "border-b-0" : ""}`}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {dq.dealerCode === product.winningDealerCode && (
                                                            <span className="text-[8px] font-black bg-[#D4AF37] text-white px-1.5 py-0.5 rounded uppercase">
                                                                Best
                                                            </span>
                                                        )}
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-black">
                                                            {dq.dealerName}
                                                        </span>
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {dq.dealerCity}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4 text-right text-[11px] font-bold tabular-nums">
                                                    <span className={dq.spotAdjustment < 0 ? "text-red-500" : "text-green-600"}>
                                                        {dq.spotAdjustment >= 0 ? "+" : ""}{formatUSD(dq.spotAdjustment)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right text-[11px] font-bold tabular-nums text-gray-600">
                                                    {dq.premiumPct.toFixed(1)}%
                                                </td>
                                                <td className="py-3 px-4 text-right text-sm font-black tabular-nums text-black tracking-tighter">
                                                    {formatUSD(dq.computedBid)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-sm font-black tabular-nums text-[#16a34a] tracking-tighter">
                                                    {formatUSD(dq.computedAsk)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-2">
                                Spot: Bid {formatUSD(product.spotBid)}/oz · Ask {formatUSD(product.spotAsk)}/oz
                            </p>
                        </div>
                    )} */}

                    {/* Specs */}
                    <div className="border-t border-[#E4E4E4] pt-8">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                            Product Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Metal</p>
                                <p className="text-sm font-bold text-black uppercase">{metalLabel}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Weight</p>
                                <p className="text-sm font-bold text-black uppercase">{wt}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Purity</p>
                                <p className="text-sm font-bold text-black uppercase">{purityLabel}</p>
                            </div>
                            {product.mint && (
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Mint</p>
                                    <p className="text-sm font-bold text-black uppercase">{product.mint}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Category</p>
                                <p className="text-sm font-bold text-black uppercase">{product.category.replace("_", " ")}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Condition</p>
                                <p className="text-sm font-bold text-black uppercase">Brilliant Uncirculated</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-[#E4E4E4] pt-8 mt-8">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">
                            Description
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            This {product.productName} is struck from {wt} of {purityLabel}{" "}
                            {metalLabel.toLowerCase()}{product.mint ? ` by ${product.mint}` : ""}. Each piece comes in its original assay card
                            or capsule, ensuring authenticity and protection. Eligible for
                            storage in the Luxey Denver Vault or direct shipment to your door.
                        </p>
                    </div>
                </div>
            </div>

        </section>
    );
}
