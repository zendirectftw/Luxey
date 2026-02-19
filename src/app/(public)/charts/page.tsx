"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSpotPrices } from "@/context/SpotPriceContext";

const METAL_CONFIG = [
    { key: "gold" as const, name: "Gold", symbol: "XAU", tvSymbol: "OANDA:XAUUSD" },
    { key: "silver" as const, name: "Silver", symbol: "XAG", tvSymbol: "OANDA:XAGUSD" },
    { key: "platinum" as const, name: "Platinum", symbol: "XPT", tvSymbol: "OANDA:XPTUSD" },
    { key: "palladium" as const, name: "Palladium", symbol: "XPD", tvSymbol: "OANDA:XPDUSD" },
];

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "3Y" | "ALL";
const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "3Y", "ALL"];

// Map our time ranges to TradingView intervals
const TV_INTERVALS: Record<string, string> = {
    "1W": "D",    // daily candles for 1 week
    "1M": "D",    // daily candles for 1 month
    "3M": "W",    // weekly candles for 3 months
    "1Y": "W",    // weekly candles for 1 year
    "3Y": "M",    // monthly candles for 3 years
    "ALL": "M",   // monthly candles for all time
};

const TV_RANGE: Record<string, string> = {
    "1W": "5D",
    "1M": "1M",
    "3M": "3M",
    "1Y": "12M",
    "3Y": "36M",
    "ALL": "60M",
};

function formatUSD(val: number): string {
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── TradingView Widget ──────────────────────────────
function TradingViewChart({ symbol, interval, range }: { symbol: string; interval: string; range: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            interval: interval,
            range: range,
            timezone: "America/Denver",
            theme: "light",
            style: "2",           // line chart
            locale: "en",
            backgroundColor: "rgba(255, 255, 255, 1)",
            gridColor: "rgba(245, 245, 245, 1)",
            hide_top_toolbar: true,
            hide_legend: false,
            save_image: false,
            hide_volume: true,
            support_host: "https://www.tradingview.com",
        });

        containerRef.current.appendChild(script);
    }, [symbol, interval, range]);

    return (
        <div
            style={{ position: "relative", height: "400px", width: "100%", overflow: "hidden" }}
            ref={containerRef}
        >
            <style>{`
                .tradingview-widget-container,
                .tradingview-widget-container__widget,
                .tradingview-widget-container > div,
                .tradingview-widget-container iframe {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
            <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }} />
        </div>
    );
}

// ─── 1D SVG Chart (our Kitco data) ──────────────────
function IntraDayChart({ isUp }: { isUp: boolean }) {
    return (
        <div className="h-[400px] flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] to-white relative">
            <svg viewBox="0 0 800 300" className="w-full h-full px-6" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isUp ? "#16a34a" : "#dc2626"} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={isUp ? "#16a34a" : "#dc2626"} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[60, 120, 180, 240].map((y) => (
                    <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#F5F5F5" strokeWidth="1" />
                ))}
                <path
                    d={isUp
                        ? "M0,200 C100,180 200,190 300,160 C400,130 500,150 600,100 C700,80 750,90 800,70 L800,300 L0,300 Z"
                        : "M0,100 C100,120 200,110 300,150 C400,170 500,160 600,200 C700,210 750,220 800,230 L800,300 L0,300 Z"
                    }
                    fill="url(#chartGradient)"
                />
                <path
                    d={isUp
                        ? "M0,200 C100,180 200,190 300,160 C400,130 500,150 600,100 C700,80 750,90 800,70"
                        : "M0,100 C100,120 200,110 300,150 C400,170 500,160 600,200 C700,210 750,220 800,230"
                    }
                    fill="none"
                    stroke={isUp ? "#16a34a" : "#dc2626"}
                    strokeWidth="2.5"
                />
            </svg>
        </div>
    );
}

export default function ChartsPage() {
    const { prices, loading } = useSpotPrices();
    const [activeMetal, setActiveMetal] = useState("Gold");
    const [activeRange, setActiveRange] = useState<TimeRange>("1D");

    const metals = METAL_CONFIG.map((m) => {
        const mp = prices?.[m.key];
        return {
            ...m,
            bid: mp?.bid || 0,
            ask: mp?.ask || 0,
            change: mp?.change || 0,
            changePct: mp?.changePct || 0,
            low: mp?.low || 0,
            high: mp?.high || 0,
            isUp: (mp?.change || 0) >= 0,
        };
    });

    const selected = metals.find((m) => m.name === activeMetal)!;
    const is1D = activeRange === "1D";

    return (
        <section className="max-w-7xl mx-auto w-full py-10 px-6">
            {/* Header */}
            <header className="mb-10">
                <h1 className="font-serif text-5xl md:text-6xl text-black tracking-tight uppercase leading-none mb-3">
                    Live Charts
                </h1>
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Live spot prices · Updated every 15 seconds
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="animate-pulse">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-sm" />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Spot Price Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {metals.map((metal) => (
                            <button
                                key={metal.name}
                                onClick={() => setActiveMetal(metal.name)}
                                className={`p-5 rounded-sm border text-left transition-all ${activeMetal === metal.name
                                    ? "border-[#D4AF37] bg-black text-white shadow-lg"
                                    : "border-[#E4E4E4] bg-white hover:border-black"
                                    }`}
                            >
                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeMetal === metal.name ? "text-[#D4AF37]" : "text-gray-400"
                                    }`}>
                                    {metal.symbol}
                                </p>
                                <p className={`text-xl font-black tracking-tighter tabular-nums mb-1 ${activeMetal === metal.name ? "text-white" : "text-black"
                                    }`}>
                                    {formatUSD(metal.bid)}
                                </p>
                                <p className={`text-[10px] font-black tracking-widest tabular-nums ${metal.isUp ? "text-green-500" : "text-red-500"
                                    }`}>
                                    {metal.isUp ? "+" : ""}{formatUSD(metal.change)} ({metal.isUp ? "+" : ""}{metal.changePct.toFixed(2)}%)
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm mb-10">
                        {/* Chart Header */}
                        <div className="p-6 border-b border-[#F5F5F5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-wider text-black">
                                    {selected.name} ({selected.symbol})
                                </h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-2xl font-black tracking-tighter tabular-nums">
                                        {formatUSD(selected.bid)}
                                    </span>
                                    <span className={`text-sm font-black tracking-widest tabular-nums ${selected.isUp ? "text-green-500" : "text-red-500"
                                        }`}>
                                        {selected.isUp ? "+" : ""}{formatUSD(selected.change)} ({selected.isUp ? "+" : ""}{selected.changePct.toFixed(2)}%)
                                    </span>
                                </div>
                            </div>

                            {/* Time Range Selector */}
                            <div className="flex gap-1">
                                {timeRanges.map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setActiveRange(range)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${activeRange === range ? "bg-black text-white" : "text-gray-500 hover:text-black"
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart: 1D = our SVG, otherwise TradingView */}
                        {is1D ? (
                            <IntraDayChart isUp={selected.isUp} />
                        ) : (
                            <TradingViewChart
                                symbol={selected.tvSymbol}
                                interval={TV_INTERVALS[activeRange]}
                                range={TV_RANGE[activeRange]}
                            />
                        )}
                    </div>

                    {/* Market Data Table with Bid/Ask */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="px-8 py-4">Metal</th>
                                    <th className="px-8 py-4 text-right">Bid</th>
                                    <th className="px-8 py-4 text-right">Ask</th>
                                    <th className="px-8 py-4 text-right">Change</th>
                                    <th className="px-8 py-4 text-right hidden md:table-cell">High</th>
                                    <th className="px-8 py-4 text-right hidden md:table-cell">Low</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {metals.map((metal) => (
                                    <tr
                                        key={metal.name}
                                        className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                                        onClick={() => setActiveMetal(metal.name)}
                                    >
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-black uppercase tracking-wider">{metal.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{metal.symbol}/USD</p>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-base tracking-tighter tabular-nums">
                                            {formatUSD(metal.bid)}
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-base tracking-tighter tabular-nums text-[#16a34a]">
                                            {formatUSD(metal.ask)}
                                        </td>
                                        <td className={`px-8 py-5 text-right font-black text-sm tracking-tighter tabular-nums ${metal.isUp ? "text-green-500" : "text-red-500"
                                            }`}>
                                            {metal.isUp ? "+" : ""}{formatUSD(metal.change)}
                                            <br />
                                            <span className="text-[10px]">{metal.isUp ? "+" : ""}{metal.changePct.toFixed(2)}%</span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-medium text-gray-500 tracking-tighter tabular-nums hidden md:table-cell">
                                            {formatUSD(metal.high)}
                                        </td>
                                        <td className="px-8 py-5 text-right font-medium text-gray-500 tracking-tighter tabular-nums hidden md:table-cell">
                                            {formatUSD(metal.low)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-[9px] font-bold text-gray-400 text-center mt-4 uppercase tracking-widest">
                        Prices from Kitco · {prices?.fetchedAt ? new Date(prices.fetchedAt).toLocaleString() : ""}
                    </p>
                </>
            )}
        </section>
    );
}
