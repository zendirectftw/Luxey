"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface Order {
    id: string;
    po_number: string;
    serial_number: string | null;
    seller_lock_price: number;
    status: string;
    created_at: string;
    products: { name: string } | null;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("purchase_orders")
                .select("id, po_number, serial_number, seller_lock_price, status, created_at, products(name)")
                .eq("seller_id", DEMO_USER_ID)
                .order("created_at", { ascending: false });

            setOrders((data as unknown as Order[]) || []);
            setLoading(false);
        }
        load();
    }, []);

    const statusLabel = (s: string) => {
        const map: Record<string, string> = {
            locked: "Locked", label_sent: "Label Sent", shipped: "Shipped",
            delivered: "Delivered", dealer_verified: "Verified",
            luxey_paid: "Paid", seller_paid: "In Vault",
        };
        return map[s] || s;
    };

    const statusType = (s: string) => {
        if (s === "seller_paid") return "vault";
        if (s === "shipped" || s === "delivered") return "shipped";
        if (s === "locked" || s === "label_sent") return "pending";
        return "complete";
    };

    const filtered = orders.filter(o => {
        if (filter === "vault" && o.status !== "seller_paid") return false;
        if (filter === "shipped" && o.status !== "shipped" && o.status !== "delivered") return false;
        if (search) {
            const q = search.toLowerCase();
            return o.po_number.toLowerCase().includes(q) ||
                (o.serial_number || "").toLowerCase().includes(q) ||
                (o.products?.name || "").toLowerCase().includes(q);
        }
        return true;
    });

    const fmt = (n: number) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

    if (loading) {
        return (
            <>
                <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                    <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                        <span>User</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                        <span className="text-black font-extrabold tracking-[0.1em]">Orders</span>
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
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <span>User</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">Orders</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                <header className="mb-8">
                    <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                        Orders
                    </h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Individual product-level orders inside your purchase orders.
                    </p>
                </header>

                {/* SEARCH / FILTER */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by order ID, product, or serial..."
                            className="w-full pl-12 pr-6 py-4 bg-white border border-[#E4E4E4] rounded-sm focus:outline-none text-sm font-medium transition-all focus:border-black"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="vault">Locker Assets</option>
                        <option value="shipped">Shipped Items</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Serial</th>
                                    <th className="px-6 py-4 text-center">Placed On</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Market Value</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400 font-bold uppercase">No orders found</td></tr>
                                ) : filtered.map((order) => {
                                    const type = statusType(order.status);
                                    return (
                                        <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors group">
                                            <td className="px-6 py-5 font-bold text-sm text-black">{order.po_number}</td>
                                            <td className="px-6 py-5 text-xs font-bold text-black uppercase tracking-tight">{order.products?.name || "—"}</td>
                                            <td className="px-6 py-5 text-[10px] font-mono text-gray-400">{order.serial_number || "—"}</td>
                                            <td className="px-6 py-5 text-center text-[11px] font-bold text-gray-400 tabular-nums">
                                                {new Date(order.created_at).toLocaleDateString("en-US")}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`status-pill ${type === "vault" ? "status-pill-gold" : type === "shipped" ? "status-progress" : "status-complete"}`}>
                                                    {statusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right font-black text-sm price-green">{fmt(order.seller_lock_price)}</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Link href={`/orders/${order.id}`} className="action-btn action-btn-primary">Details</Link>
                                                    {type === "vault" && (
                                                        <button className="action-btn">Sell</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
