"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface PO {
    id: string;
    po_number: string;
    seller_lock_price: number;
    status: string;
    created_at: string;
    products: { name: string; image_url: string | null } | null;
}

export default function PurchaseOrdersPage() {
    const [pos, setPos] = useState<PO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("purchase_orders")
                .select("id, po_number, seller_lock_price, status, created_at, products(name, image_url)")
                .eq("seller_id", DEMO_USER_ID)
                .order("created_at", { ascending: false });

            setPos((data as unknown as PO[]) || []);
            setLoading(false);
        }
        load();
    }, []);

    const statusLabel = (s: string) => {
        if (s === "seller_paid" || s === "luxey_paid") return "Order Complete";
        if (s === "locked" || s === "label_sent") return "Check In Progress";
        if (s === "shipped" || s === "delivered") return "Shipped";
        return s;
    };

    const statusType = (s: string) => {
        if (s === "seller_paid" || s === "luxey_paid") return "complete";
        return "progress";
    };

    // Group POs by date for stats
    const placed = pos.length;
    const pending = pos.filter(p => p.status === "locked" || p.status === "label_sent" || p.status === "shipped").length;
    const completed = pos.filter(p => p.status === "seller_paid" || p.status === "luxey_paid" || p.status === "dealer_verified").length;

    const stats = [
        { label: "Placed Orders", value: String(placed).padStart(2, "0") },
        { label: "Pending Orders", value: String(pending).padStart(2, "0") },
        { label: "Completed Orders", value: String(completed).padStart(2, "0") },
        { label: "Cancelled Orders", value: "0", muted: true },
    ];

    const filtered = pos.filter(p => {
        if (filter === "pending" && statusType(p.status) !== "progress") return false;
        if (filter === "completed" && statusType(p.status) !== "complete") return false;
        if (search) {
            const q = search.toLowerCase();
            return p.po_number.toLowerCase().includes(q) || (p.products?.name || "").toLowerCase().includes(q);
        }
        return true;
    });

    const fmt = (n: number) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 0 });

    if (loading) {
        return (
            <>
                <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                    <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                        <span>User</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                        <span className="text-black font-extrabold tracking-[0.1em]">Purchase Orders</span>
                    </nav>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            {/* BREADCRUMB BAR */}
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4 flex justify-between items-center">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <span>User</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">Purchase Orders</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                {/* STAT CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-white border border-[#E4E4E4] p-6 rounded-sm shadow-sm ${stat.muted ? "bg-zinc-50 border-dashed" : ""}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stat.muted ? "text-gray-300" : "text-gray-400"}`}>{stat.label}</p>
                            <p className={`text-3xl font-black tracking-tighter ${stat.muted ? "text-gray-200" : ""}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* SEARCH / FILTER */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input type="text" placeholder="Search for a purchase order..." className="w-full pl-12 pr-6 py-4 bg-white border border-[#E4E4E4] rounded-sm focus:outline-none text-sm font-medium transition-all focus:border-black" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Show All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">ID</th>
                                    <th className="pl-16 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Product</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Total Payout</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Placed On</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400 font-bold uppercase">No purchase orders found</td></tr>
                                ) : filtered.map((po) => (
                                    <tr key={po.id} className="hover:bg-[#FAFAFA] transition-colors group">
                                        <td className="px-6 py-5 font-bold text-sm text-black">{po.po_number}</td>
                                        <td className="pl-16 pr-6 py-5">
                                            <span className={`status-pill ${statusType(po.status) === "complete" ? "status-complete" : "status-progress"}`}>
                                                {statusLabel(po.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="relative w-10 h-10 bg-[#F5F5F5] rounded border border-[#E4E4E4] flex items-center justify-center p-1.5 shadow-sm">
                                                {po.products?.image_url ? (
                                                    <Image src={po.products.image_url} alt="Product" width={40} height={40} className="object-contain mix-blend-multiply" />
                                                ) : (
                                                    <span className="text-gray-300 text-lg">📦</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-sm price-green">${fmt(po.seller_lock_price)}</td>
                                        <td className="px-6 py-5 text-center text-[11px] font-bold text-gray-400 tabular-nums uppercase">
                                            {new Date(po.created_at).toLocaleDateString("en-US")}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/po/${po.id}`} className="action-btn action-btn-primary">View Order</Link>
                                                <button className="action-btn">Packing Slip</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
