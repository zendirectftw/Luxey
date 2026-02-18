"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { bigBoxProducts, BigBoxProduct } from "@/data/bigBoxProducts";
import { useProfitProfiles, ProfitProfile } from "@/context/ProfitProfileContext";

type SortKey = "name" | "onlineAvail" | "onlinePrice" | "inStoreAvail" | "inStorePrice" | "onlineProfit" | "inStoreProfit";
type SortDir = "asc" | "desc";

function calcProfit(
    purchasePrice: number,
    profile: ProfitProfile,
    product: BigBoxProduct,
) {
    // Retail Cost = Big Box Price × (1 + sales tax rate)
    const retailCost = purchasePrice * (1 + profile.salesTaxPct / 100);

    // Luxey Payout = highest bid price (after tier fee)
    const luxeyPayout = product.bgsPrice * (1 - profile.luxeyTierFeePct / 100);

    // Buying Cost = Retail Cost - Luxey Payout (the spread you "lose")
    const buyingCost = retailCost - luxeyPayout;
    const buyingCostPct = retailCost > 0 ? (buyingCost / retailCost) * 100 : 0;

    // Rewards/Cashback (CC cashback on total charged, rebate on pre-tax)
    const ccCashback = retailCost * (profile.cardCashbackPct / 100);
    const otherCashback = retailCost * (profile.otherCashbackPct / 100);
    const bigBoxRebate = purchasePrice * (profile.bigBoxRebatePct / 100);
    const totalRewards = ccCashback + otherCashback + bigBoxRebate;

    // Profit = Rewards - Buying Cost
    const profit = totalRewards - buyingCost;
    const profitPct = retailCost > 0 ? (profit / retailCost) * 100 : 0;

    return {
        retailCost,
        luxeyPayout,
        buyingCost,
        buyingCostPct,
        ccCashback,
        otherCashback,
        bigBoxRebate,
        totalRewards,
        profit,
        profitPct,
    };
}

function ProfitBadge({ profit, pct }: { profit: number; pct: number }) {
    const isPositive = profit >= 0;
    const isMarginal = Math.abs(pct) < 1;

    return (
        <div className="text-right">
            <div
                className={`text-sm font-black tracking-tighter tabular-nums ${isPositive ? "text-green-600" : "text-red-500"
                    }`}
            >
                {isPositive ? "+" : ""}${Math.abs(profit).toFixed(2)}
            </div>
            <div
                className={`text-[10px] font-black tracking-wider ${isPositive
                    ? "text-green-500"
                    : isMarginal
                        ? "text-amber-500"
                        : "text-red-400"
                    }`}
            >
                ({isPositive ? "+" : ""}{pct.toFixed(1)}%)
            </div>
        </div>
    );
}

function ProfitWithTooltip({
    product,
    profile,
    purchasePrice,
    channel,
}: {
    product: BigBoxProduct;
    profile: ProfitProfile;
    purchasePrice: number;
    channel: "online" | "inStore";
}) {
    const calc = calcProfit(purchasePrice, profile, product);
    const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex items-center justify-end gap-2">
            <ProfitBadge profit={calc.profit} pct={calc.profitPct} />
            {/* Eye icon with hover tooltip */}
            <div className="relative group">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300 group-hover:text-gray-600 transition-colors cursor-help"
                >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                </svg>

                {/* Tooltip popover */}
                <div className="absolute right-0 bottom-full mb-2 w-72 bg-white border border-[#E4E4E4] rounded-sm p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-1.5 border-b border-[#E4E4E4]">
                        {channel === "online" ? "Online" : "In-Store"} Breakdown
                    </h4>

                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 font-bold">Retail Cost</span>
                        <span className="font-black tabular-nums">${fmt(calc.retailCost)}</span>
                    </div>
                    {profile.salesTaxPct > 0 && (
                        <div className="text-[9px] pl-3 text-gray-400">
                            Base ${fmt(purchasePrice)} + {profile.salesTaxPct}% tax
                        </div>
                    )}

                    <div className="h-px bg-[#F0F0F0]" />

                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 font-bold">Luxey Payout</span>
                        <span className="font-black tabular-nums">${fmt(calc.luxeyPayout)}</span>
                    </div>

                    <div className="h-px bg-[#F0F0F0]" />

                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 font-bold">Buying Cost</span>
                        <span className={`font-black tabular-nums ${calc.buyingCost > 0 ? "text-red-500" : "text-green-600"}`}>
                            ${fmt(Math.abs(calc.buyingCost))} ({calc.buyingCostPct.toFixed(1)}%)
                        </span>
                    </div>

                    <div className="h-px bg-[#F0F0F0]" />

                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 font-bold">Rewards/Cashback</span>
                        <span className="font-black tabular-nums text-green-600">${fmt(calc.totalRewards)}</span>
                    </div>
                    <div className="pl-3 space-y-0.5">
                        {calc.ccCashback > 0 && (
                            <div className="flex justify-between text-[9px]">
                                <span className="text-gray-400">CC {profile.cardCashbackPct}%</span>
                                <span className="text-green-500 font-bold tabular-nums">${fmt(calc.ccCashback)}</span>
                            </div>
                        )}
                        {calc.otherCashback > 0 && (
                            <div className="flex justify-between text-[9px]">
                                <span className="text-gray-400">Other {profile.otherCashbackPct}%</span>
                                <span className="text-green-500 font-bold tabular-nums">${fmt(calc.otherCashback)}</span>
                            </div>
                        )}
                        {calc.bigBoxRebate > 0 && (
                            <div className="flex justify-between text-[9px]">
                                <span className="text-gray-400">Rebate {profile.bigBoxRebatePct}%</span>
                                <span className="text-green-500 font-bold tabular-nums">${fmt(calc.bigBoxRebate)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t-2 border-black pt-2 flex justify-between text-[11px]">
                        <span className="font-black">Profit</span>
                        <span className={`font-black tabular-nums ${calc.profit >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {calc.profit >= 0 ? "+" : ""}${fmt(Math.abs(calc.profit))} ({calc.profitPct >= 0 ? "+" : ""}{calc.profitPct.toFixed(1)}%)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AvailabilityDot({ available }: { available: boolean }) {
    return (
        <div className="flex items-center justify-center">
            <div
                className={`w-3 h-3 rounded-full ${available
                    ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                    : "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.3)]"
                    }`}
                title={available ? "Available" : "Unavailable"}
            />
        </div>
    );
}

export default function BigBoxPage() {
    const { profiles, defaultProfile } = useProfitProfiles();
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const activeProfile =
        profiles.find((p) => p.id === activeProfileId) || defaultProfile;

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sortedProducts = [...bigBoxProducts].sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        switch (sortKey) {
            case "name":
                return a.name.localeCompare(b.name) * dir;
            case "onlineAvail":
                return (Number(b.onlineAvailable) - Number(a.onlineAvailable)) * dir;
            case "inStoreAvail":
                return (Number(b.inStoreAvailable) - Number(a.inStoreAvailable)) * dir;
            case "onlinePrice":
                return (a.onlinePrice - b.onlinePrice) * dir;
            case "inStorePrice":
                return (a.inStorePrice - b.inStorePrice) * dir;
            case "onlineProfit":
                return (
                    calcProfit(a.onlinePrice, activeProfile, a).profit -
                    calcProfit(b.onlinePrice, activeProfile, b).profit
                ) * dir;
            case "inStoreProfit":
                return (
                    calcProfit(a.inStorePrice, activeProfile, a).profit -
                    calcProfit(b.inStorePrice, activeProfile, b).profit
                ) * dir;
            default:
                return 0;
        }
    });

    const SortHeader = ({
        label,
        sortKeyValue,
        className = "",
    }: {
        label: string;
        sortKeyValue: SortKey;
        className?: string;
    }) => (
        <button
            onClick={() => toggleSort(sortKeyValue)}
            className={`text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1 ${className}`}
        >
            {label}
            {sortKey === sortKeyValue && (
                <span className="text-black">{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
        </button>
    );

    return (
        <section className="max-w-7xl mx-auto w-full py-10 px-6">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href="/explore"
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                ← Explore
                            </Link>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-black tracking-tight uppercase leading-none mb-2">
                            Big Box
                        </h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Buy at Costco · Sell on Luxey · See your profit
                        </p>
                    </div>

                    {/* Profile Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Profit Profile
                        </span>
                        <div className="relative">
                            <select
                                value={activeProfile.id}
                                onChange={(e) => setActiveProfileId(e.target.value)}
                                className="appearance-none bg-white border-2 border-[#E4E4E4] rounded-sm pl-4 pr-10 py-2.5 text-sm font-black uppercase tracking-wider focus:border-black focus:outline-none transition-colors min-w-[200px] cursor-pointer"
                            >
                                {profiles.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                        {p.isDefault ? " ★" : ""}
                                    </option>
                                ))}
                            </select>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                        <Link
                            href="/profile"
                            className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors whitespace-nowrap"
                        >
                            Manage
                        </Link>
                    </div>
                </div>

                {/* Active Profile Summary */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-sm">
                        Gold Tier {activeProfile.luxeyTierFeePct}%
                    </span>
                    {activeProfile.cardCashbackPct > 0 && (
                        <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-sm">
                            CC {activeProfile.cardCashbackPct}%
                        </span>
                    )}
                    {activeProfile.otherCashbackPct > 0 && (
                        <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-sm">
                            Other CB {activeProfile.otherCashbackPct}%
                        </span>
                    )}
                    {activeProfile.bigBoxRebatePct > 0 && (
                        <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-sm">
                            Rebate {activeProfile.bigBoxRebatePct}%
                        </span>
                    )}
                </div>
            </header>

            {/* Product Table */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-[3fr_50px_0.8fr_50px_0.8fr_0.8fr_0.8fr] gap-4 items-center px-6 py-4 bg-[#FAFAFA] border-b border-[#E4E4E4]">
                    <SortHeader label="Product" sortKeyValue="name" />
                    <SortHeader label="Online" sortKeyValue="onlineAvail" className="justify-center" />
                    <SortHeader label="Online Price" sortKeyValue="onlinePrice" />
                    <SortHeader label="In-Store" sortKeyValue="inStoreAvail" className="justify-center" />
                    <SortHeader label="In-Store Price" sortKeyValue="inStorePrice" />
                    <SortHeader
                        label="Online Profit"
                        sortKeyValue="onlineProfit"
                        className="justify-end"
                    />
                    <SortHeader
                        label="In-Store Profit"
                        sortKeyValue="inStoreProfit"
                        className="justify-end"
                    />
                </div>

                {/* Rows */}
                {sortedProducts.map((product) => {
                    return (
                        <div key={product.id} className="border-b border-[#F5F5F5] last:border-b-0">
                            <div
                                className="w-full grid grid-cols-[3fr_50px_0.8fr_50px_0.8fr_0.8fr_0.8fr] gap-4 items-center px-6 py-5 hover:bg-[#FAFAFA] transition-colors"
                            >
                                {/* Product */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#FAFAFA] border border-[#E4E4E4] rounded flex items-center justify-center p-1 flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-black leading-tight line-clamp-2">
                                            {product.name}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                            SKU: {product.sku} · {product.weight} · {product.lastChecked}
                                        </p>
                                    </div>
                                </div>

                                {/* Online Available */}
                                <AvailabilityDot available={product.onlineAvailable} />

                                {/* Online Price */}
                                <div>
                                    <span className={`text-sm font-black tracking-tighter tabular-nums ${!product.onlineAvailable ? "text-gray-300" : ""}`}>
                                        ${product.onlinePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                {/* In-Store Available */}
                                <AvailabilityDot available={product.inStoreAvailable} />

                                {/* In-Store Price */}
                                <div>
                                    <span className={`text-sm font-black tracking-tighter tabular-nums ${!product.inStoreAvailable ? "text-gray-300" : ""}`}>
                                        ${product.inStorePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                {/* Online Profit with Tooltip */}
                                <ProfitWithTooltip
                                    product={product}
                                    profile={activeProfile}
                                    purchasePrice={product.onlinePrice}
                                    channel="online"
                                />

                                {/* In-Store Profit with Tooltip */}
                                <ProfitWithTooltip
                                    product={product}
                                    profile={activeProfile}
                                    purchasePrice={product.inStorePrice}
                                    channel="inStore"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* How We Calculate */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-sm p-6">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-blue-800 mb-2">
                            Buying Profit Calculator
                        </h3>
                        <p className="text-xs font-bold text-blue-700 mb-2">
                            Profit = Rewards/Cashback − Buying Cost
                        </p>
                        <ul className="text-xs text-blue-600 font-medium space-y-1">
                            <li>
                                <strong>Retail Cost:</strong> The Big Box price × (1 + sales tax rate)
                            </li>
                            <li>
                                <strong>Luxey Payout:</strong> The highest bid price on Luxey (after tier fee)
                            </li>
                            <li>
                                <strong>Buying Cost:</strong> Retail Cost − Luxey Payout (the price spread)
                            </li>
                            <li>
                                <strong>Rewards/Cashback:</strong> Cash back you receive from the purchase (CC + other + rebates)
                            </li>
                            <li>
                                <strong>Profit:</strong> Rewards/Cashback − Buying Cost. Positive = you make money!
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
