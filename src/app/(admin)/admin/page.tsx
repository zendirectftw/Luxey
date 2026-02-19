"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
    totalCustomers: number;
    totalProducts: number;
    totalPOs: number;
    totalDealers: number;
}

interface RecentUser {
    id: string;
    full_name: string;
    email: string;
    tier: string;
    created_at: string;
}

interface RecentPO {
    id: string;
    po_number: string;
    total_value: number;
    status: string;
    created_at: string;
    users: { full_name: string } | null;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({ totalCustomers: 0, totalProducts: 0, totalPOs: 0, totalDealers: 0 });
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentPOs, setRecentPOs] = useState<RecentPO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [customersRes, productsRes, posRes, dealersRes, recentUsersRes, recentPOsRes] = await Promise.all([
                supabase.from("users").select("*", { count: "exact", head: true }).neq("referral_code", "LUXEY-HOUSE"),
                supabase.from("products").select("*", { count: "exact", head: true }),
                supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
                supabase.from("dealers").select("*", { count: "exact", head: true }),
                supabase.from("users").select("id, full_name, email, tier, created_at")
                    .neq("referral_code", "LUXEY-HOUSE")
                    .order("created_at", { ascending: false })
                    .limit(5),
                supabase.from("purchase_orders").select("id, po_number, total_value, status, created_at, users!purchase_orders_seller_id_fkey(full_name)")
                    .order("created_at", { ascending: false })
                    .limit(5),
            ]);

            setStats({
                totalCustomers: customersRes.count || 0,
                totalProducts: productsRes.count || 0,
                totalPOs: posRes.count || 0,
                totalDealers: dealersRes.count || 0,
            });

            if (recentUsersRes.data) setRecentUsers(recentUsersRes.data);
            if (recentPOsRes.data) {
                setRecentPOs(recentPOsRes.data.map(po => ({
                    ...po,
                    users: Array.isArray(po.users) ? po.users[0] : po.users,
                })));
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Admin Dashboard</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Admin Dashboard</h2>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin User</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Total Customers", value: stats.totalCustomers.toLocaleString() },
                        { label: "Active Products", value: stats.totalProducts.toLocaleString() },
                        { label: "Purchase Orders", value: stats.totalPOs.toLocaleString() },
                        { label: "Active Dealers", value: stats.totalDealers.toLocaleString() },
                    ].map((stat) => (
                        <div key={stat.label} className="admin-stat">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{stat.label}</p>
                            <p className="text-4xl font-black tracking-tighter mb-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center">
                            <h3 className="text-[11px] font-black uppercase tracking-widest">Recent Purchase Orders</h3>
                            <Link href="/admin/purchase-orders" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">View All →</Link>
                        </div>
                        {recentPOs.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-3xl mb-3">📋</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No purchase orders yet</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <th className="px-6 py-3">PO #</th>
                                        <th className="px-6 py-3">Seller</th>
                                        <th className="px-6 py-3 text-right">Value</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F5F5F5]">
                                    {recentPOs.map((o) => (
                                        <tr key={o.id} className="hover:bg-[#FAFAFA] transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold">{o.po_number}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{o.users?.full_name || "—"}</td>
                                            <td className="px-6 py-4 text-right text-sm font-black price-green">${Number(o.total_value).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`status-pill ${o.status === "seller_paid" ? "status-complete" :
                                                        o.status === "locked" ? "status-progress" :
                                                            o.status === "shipped" ? "status-released" :
                                                                "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    {o.status.replace(/_/g, " ")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* New Customers */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center">
                            <h3 className="text-[11px] font-black uppercase tracking-widest">New Customers</h3>
                            <Link href="/admin/customers" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">View All →</Link>
                        </div>
                        {recentUsers.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-3xl mb-3">👥</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No customers yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F5F5F5]">
                                {recentUsers.map((c) => (
                                    <div key={c.id} className="p-6 hover:bg-[#FAFAFA] transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-black text-xs text-zinc-400">
                                                {c.full_name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase">{c.full_name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{c.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            <span>Tier: <span className="text-black capitalize">{c.tier}</span></span>
                                            <span className="text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
