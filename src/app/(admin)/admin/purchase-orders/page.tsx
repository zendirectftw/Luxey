"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PurchaseOrder {
    id: string;
    po_number: string;
    total_value: number;
    status: string;
    label_preference: string;
    created_at: string;
    users: { full_name: string; email: string } | null;
    dealers: { display_name: string } | null;
}

const statusStyle = (status: string) => {
    switch (status) {
        case "seller_paid": return "status-complete";
        case "funds_received": return "status-pill-gold";
        case "locked": return "status-progress";
        case "shipped": return "status-released";
        case "cancelled": return "bg-red-50 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

export default function AdminPurchaseOrdersPage() {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("purchase_orders")
                .select("id, po_number, total_value, status, label_preference, created_at, users!purchase_orders_seller_id_fkey(full_name, email), dealers(display_name)")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setOrders(data.map(po => ({
                    ...po,
                    users: Array.isArray(po.users) ? po.users[0] : po.users,
                    dealers: Array.isArray(po.dealers) ? po.dealers[0] : po.dealers,
                })));
            }
            setLoading(false);
        }
        load();
    }, []);

    const filtered = orders.filter(o => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false;
        if (search) {
            const s = search.toLowerCase();
            if (!o.po_number.toLowerCase().includes(s) && !(o.users?.full_name || "").toLowerCase().includes(s)) return false;
        }
        return true;
    });

    // Live stats
    const totalValue = orders.reduce((sum, o) => sum + Number(o.total_value || 0), 0);
    const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Purchase Orders</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading purchase orders...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Purchase Orders</h2>
                <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                    Export CSV
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total POs", value: String(orders.length) },
                        { label: "Locked", value: String(statusCounts["locked"] || 0) },
                        { label: "Shipped", value: String(statusCounts["shipped"] || 0) },
                        { label: "Total Value", value: `$${totalValue.toLocaleString()}` },
                    ].map(s => (
                        <div key={s.label} className="admin-stat text-center">
                            <p className="text-3xl font-black tracking-tighter mb-1">{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by PO#, seller..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-[#E4E4E4] rounded-sm text-sm font-medium outline-none focus:border-black transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest"
                    >
                        <option value="all">All Status</option>
                        <option value="locked">Locked</option>
                        <option value="funds_received">Funds Received</option>
                        <option value="shipped">Shipped</option>
                        <option value="seller_paid">Seller Paid</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-16 text-center">
                        <p className="text-4xl mb-4">📋</p>
                        <p className="text-sm font-bold uppercase tracking-tight mb-2">No Purchase Orders</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {orders.length === 0 ? "Purchase orders will appear here as sellers lock prices" : "No orders match current filters"}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">PO #</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Seller</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Dealer</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Value</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Label</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((o) => (
                                    <tr key={o.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="p-4 text-sm font-bold">{o.po_number}</td>
                                        <td className="p-4">
                                            <p className="text-xs font-bold uppercase">{o.users?.full_name || "—"}</p>
                                            <p className="text-[10px] text-gray-400">{o.users?.email || ""}</p>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-gray-600">{o.dealers?.display_name || "—"}</td>
                                        <td className="p-4 text-right text-sm font-black price-green">${Number(o.total_value).toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${o.label_preference === "immediate" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {o.label_preference}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-gray-500">
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`status-pill ${statusStyle(o.status)}`}>
                                                {o.status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/orders/${o.id}`} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
