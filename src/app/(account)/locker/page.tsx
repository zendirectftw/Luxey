"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface VaultItem {
    id: string;
    po_number: string;
    serial_number: string | null;
    seller_lock_price: number;
    products: { name: string; image_url: string | null } | null;
}

export default function LockerPage() {
    const [items, setItems] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("purchase_orders")
                .select("id, po_number, serial_number, seller_lock_price, products(name, image_url)")
                .eq("seller_id", DEMO_USER_ID)
                .eq("status", "seller_paid")
                .order("created_at", { ascending: false });

            setItems((data as unknown as VaultItem[]) || []);
            setLoading(false);
        }
        load();
    }, []);

    const fmt = (n: number) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    const totalValue = items.reduce((s, i) => s + Number(i.seller_lock_price), 0);
    const totalItems = items.length;
    const totalTrays = Math.ceil(totalItems / 25);

    // Build 25-slot tray from the first 25 items
    const SLOTS = 25;
    const traySlots = Array.from({ length: SLOTS }, (_, i) => {
        const item = items[i];
        if (item) {
            return {
                occupied: true,
                desc: item.products?.name || "Unknown",
                serial: item.serial_number || "—",
                value: fmt(item.seller_lock_price),
                img: item.products?.image_url || null,
            };
        }
        return { occupied: false, desc: undefined, serial: undefined, value: undefined, img: null };
    });

    const trayValue = items.slice(0, SLOTS).reduce((s, i) => s + Number(i.seller_lock_price), 0);

    const portfolioStats = [
        { label: "Total Items in Custody", value: String(totalItems).padStart(3, "0") },
        { label: "Total Trays Secured", value: String(totalTrays).padStart(2, "0") },
        { label: "Portfolio Total Value", value: fmt(totalValue), green: true },
        { label: "Total Change in Value", value: "+$0", green: true, growth: "(—)" },
    ];

    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="mb-8">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    My Locker
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Secure custody for your precious metals — verified, insured, and always accessible.
                </p>
            </header>

            {/* PORTFOLIO STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {portfolioStats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`stat-card ${stat.growth ? "border-l-4 border-l-green-500" : ""}`}
                    >
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                            {stat.label}
                        </p>
                        <div className="flex items-baseline">
                            <p className={`text-3xl font-black tracking-tighter ${stat.green ? "price-green" : ""}`}>
                                {stat.value}
                            </p>
                            {stat.growth && (
                                <span className="growth-up">{stat.growth}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* TRAY SELECTOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <select className="luxey-select bg-white border border-[#E4E4E4] px-6 py-3 pr-12 rounded-sm text-sm font-bold uppercase tracking-widest">
                        <option>Tray A — Items 1-25</option>
                        {totalTrays > 1 && <option>Tray B — Items 26-50</option>}
                        {totalTrays > 2 && <option>Tray C — Items 51-75</option>}
                    </select>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Tray Market Value: <span className="text-black text-base font-black ml-1">{fmt(trayValue)}</span>
                    </div>
                </div>
                <button className="vault-action-btn">Sell Tray</button>
            </div>

            {/* 25-SLOT TRAY GRID */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                <div className="grid grid-cols-5">
                    {traySlots.map((slot, i) => (
                        <div
                            key={i}
                            className={`slot-row border border-[#F5F5F5] p-4 min-h-[160px] flex flex-col justify-between ${!slot.occupied ? "slot-empty bg-[#FAFAFA]" : ""
                                }`}
                        >
                            {/* Slot Label */}
                            <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">
                                A-{String(i + 1).padStart(2, "0")}
                            </div>

                            {slot.occupied ? (
                                <>
                                    <div className="flex-1 flex items-center justify-center mb-2">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded border border-[#E4E4E4] p-1 flex items-center justify-center">
                                            {slot.img ? (
                                                <Image
                                                    src={slot.img}
                                                    alt={slot.desc || "Product"}
                                                    width={40}
                                                    height={40}
                                                    className="object-contain mix-blend-multiply"
                                                />
                                            ) : (
                                                <span className="text-gray-300 text-lg">🪙</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-black uppercase tracking-tight leading-tight line-clamp-2">
                                            {slot.desc}
                                        </p>
                                        <p className="text-[8px] font-mono text-gray-300">{slot.serial}</p>
                                        <p className="text-xs font-black price-green">{slot.value}</p>
                                        <button className="vault-action-btn text-[8px] py-1.5 px-3 w-full mt-1">
                                            Sell
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-gray-200 text-xl">+</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                        Buy to Fill
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
