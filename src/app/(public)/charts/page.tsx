"use client";

import React, { useState } from "react";
import type { Metadata } from "next";

const metals = [
    {
        name: "Gold",
        symbol: "XAU",
        price: "$2,441.30",
        change: "+$12.50",
        changePercent: "+0.51%",
        isUp: true,
        high: "$2,458.00",
        low: "$2,425.80",
        open: "$2,428.80",
    },
    {
        name: "Silver",
        symbol: "XAG",
        price: "$30.42",
        change: "+$0.38",
        changePercent: "+1.26%",
        isUp: true,
        high: "$30.85",
        low: "$29.95",
        open: "$30.04",
    },
    {
        name: "Platinum",
        symbol: "XPT",
        price: "$1,012.50",
        change: "-$8.20",
        changePercent: "-0.80%",
        isUp: false,
        high: "$1,025.00",
        low: "$1,008.00",
        open: "$1,020.70",
    },
    {
        name: "Palladium",
        symbol: "XPD",
        price: "$985.00",
        change: "-$15.40",
        changePercent: "-1.54%",
        isUp: false,
        high: "$1,005.00",
        low: "$980.00",
        open: "$1,000.40",
    },
];

const timeRanges = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export default function ChartsPage() {
    const [activeMetal, setActiveMetal] = useState("Gold");
    const [activeRange, setActiveRange] = useState("1D");

    const selected = metals.find((m) => m.name === activeMetal)!;

    return (
        <section className="max-w-7xl mx-auto w-full py-10 px-6">
            {/* Header */}
            <header className="mb-10">
                <h1 className="font-serif text-5xl md:text-6xl text-black tracking-tight uppercase leading-none mb-3">
                    Live Charts
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Real-time spot prices for gold, silver, platinum, and palladium
                </p>
            </header>

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
                        <p
                            className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeMetal === metal.name ? "text-[#D4AF37]" : "text-gray-400"}`}
                        >
                            {metal.symbol}
                        </p>
                        <p
                            className={`text-xl font-black tracking-tighter tabular-nums mb-1 ${activeMetal === metal.name ? "text-white" : "text-black"}`}
                        >
                            {metal.price}
                        </p>
                        <p
                            className={`text-[10px] font-black tracking-widest tabular-nums ${metal.isUp ? "text-green-500" : "text-red-500"}`}
                        >
                            {metal.change} ({metal.changePercent})
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
                                {selected.price}
                            </span>
                            <span
                                className={`text-sm font-black tracking-widest tabular-nums ${selected.isUp ? "text-green-500" : "text-red-500"}`}
                            >
                                {selected.change} ({selected.changePercent})
                            </span>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex gap-1">
                        {timeRanges.map((range) => (
                            <button
                                key={range}
                                onClick={() => setActiveRange(range)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${activeRange === range
                                        ? "bg-black text-white"
                                        : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Placeholder — will be replaced with real charting library */}
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] to-white relative">
                    {/* Simulated chart lines */}
                    <svg
                        viewBox="0 0 800 300"
                        className="w-full h-full px-6"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient
                                id="chartGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={selected.isUp ? "#16a34a" : "#dc2626"}
                                    stopOpacity="0.1"
                                />
                                <stop
                                    offset="100%"
                                    stopColor={selected.isUp ? "#16a34a" : "#dc2626"}
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[60, 120, 180, 240].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                y1={y}
                                x2="800"
                                y2={y}
                                stroke="#F5F5F5"
                                strokeWidth="1"
                            />
                        ))}
                        {/* Area */}
                        <path
                            d={
                                selected.isUp
                                    ? "M0,200 C100,180 200,190 300,160 C400,130 500,150 600,100 C700,80 750,90 800,70 L800,300 L0,300 Z"
                                    : "M0,100 C100,120 200,110 300,150 C400,170 500,160 600,200 C700,210 750,220 800,230 L800,300 L0,300 Z"
                            }
                            fill="url(#chartGradient)"
                        />
                        {/* Line */}
                        <path
                            d={
                                selected.isUp
                                    ? "M0,200 C100,180 200,190 300,160 C400,130 500,150 600,100 C700,80 750,90 800,70"
                                    : "M0,100 C100,120 200,110 300,150 C400,170 500,160 600,200 C700,210 750,220 800,230"
                            }
                            fill="none"
                            stroke={selected.isUp ? "#16a34a" : "#dc2626"}
                            strokeWidth="2.5"
                        />
                    </svg>
                </div>
            </div>

            {/* Market Data Table */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <th className="px-8 py-4">Metal</th>
                            <th className="px-8 py-4 text-right">Spot Price</th>
                            <th className="px-8 py-4 text-right">Change</th>
                            <th className="px-8 py-4 text-right hidden md:table-cell">
                                Open
                            </th>
                            <th className="px-8 py-4 text-right hidden md:table-cell">
                                High
                            </th>
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
                                    <p className="text-sm font-black uppercase tracking-wider">
                                        {metal.name}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        {metal.symbol}/USD
                                    </p>
                                </td>
                                <td className="px-8 py-5 text-right font-black text-base tracking-tighter tabular-nums">
                                    {metal.price}
                                </td>
                                <td
                                    className={`px-8 py-5 text-right font-black text-sm tracking-tighter tabular-nums ${metal.isUp ? "text-green-500" : "text-red-500"}`}
                                >
                                    {metal.change}
                                    <br />
                                    <span className="text-[10px]">{metal.changePercent}</span>
                                </td>
                                <td className="px-8 py-5 text-right font-medium text-gray-500 tracking-tighter tabular-nums hidden md:table-cell">
                                    {metal.open}
                                </td>
                                <td className="px-8 py-5 text-right font-medium text-gray-500 tracking-tighter tabular-nums hidden md:table-cell">
                                    {metal.high}
                                </td>
                                <td className="px-8 py-5 text-right font-medium text-gray-500 tracking-tighter tabular-nums hidden md:table-cell">
                                    {metal.low}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-[9px] font-bold text-gray-400 text-center mt-4 uppercase tracking-widest">
                Prices are for display purposes only. Live pricing will be integrated
                with a real-time market data feed.
            </p>
        </section>
    );
}
