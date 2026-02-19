"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface User {
    id: string;
    full_name: string;
    email: string;
    tier: string;
    kyc_status: string;
    referral_code: string;
    created_at: string;
}

const tierColor = (tier: string) => {
    switch (tier) {
        case "obsidian": return "bg-zinc-900 text-white";
        case "diamond": return "bg-cyan-50 text-cyan-700";
        case "titanium": return "bg-zinc-200 text-zinc-700";
        case "platinum": return "bg-blue-50 text-blue-600";
        case "gold": return "bg-yellow-50 text-yellow-700";
        case "silver": return "bg-gray-100 text-gray-600";
        case "bronze": return "bg-orange-50 text-orange-700";
        default: return "bg-gray-50 text-gray-400";
    }
};

const kycColor = (status: string) => {
    switch (status) {
        case "approved": return "status-complete";
        case "pending": return "status-progress";
        case "rejected": return "bg-red-50 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

export default function CustomersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tierFilter, setTierFilter] = useState("all");

    const loadUsers = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("id, full_name, email, tier, kyc_status, referral_code, created_at")
            .neq("referral_code", "LUXEY-HOUSE")
            .order("created_at", { ascending: false });

        if (!error && data) setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();

        // Real-time subscription — re-fetch on any users table change
        const channel = supabase
            .channel("admin-customers-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
                loadUsers();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = users.filter(u => {
        if (search) {
            const s = search.toLowerCase();
            if (!u.full_name.toLowerCase().includes(s) && !u.email.toLowerCase().includes(s) && !u.referral_code.toLowerCase().includes(s)) return false;
        }
        if (tierFilter !== "all" && u.tier !== tierFilter) return false;
        return true;
    });

    // Compute tier stats from live data
    const tierCounts = users.reduce((acc, u) => {
        acc[u.tier] = (acc[u.tier] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">All Customers</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading customers...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">All Customers</h2>
                <div className="flex gap-4">
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Export CSV
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Customers", value: String(users.length) },
                        { label: "Gold+", value: String((tierCounts["gold"] || 0) + (tierCounts["platinum"] || 0) + (tierCounts["titanium"] || 0) + (tierCounts["diamond"] || 0) + (tierCounts["obsidian"] || 0)) },
                        { label: "Silver", value: String(tierCounts["silver"] || 0) },
                        { label: "Bronze / New", value: String(tierCounts["bronze"] || 0) },
                    ].map(s => (
                        <div key={s.label} className="admin-stat text-center">
                            <p className="text-3xl font-black tracking-tighter mb-1">{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search customers by name, email, or referral code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-[#E4E4E4] rounded-sm text-sm font-medium outline-none focus:border-black transition-all"
                        />
                    </div>
                    <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest"
                    >
                        <option value="all">All Tiers</option>
                        <option value="obsidian">Obsidian</option>
                        <option value="diamond">Diamond</option>
                        <option value="titanium">Titanium</option>
                        <option value="platinum">Platinum</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                    </select>
                </div>

                {/* Empty State */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-16 text-center">
                        <p className="text-4xl mb-4">👥</p>
                        <p className="text-sm font-bold uppercase tracking-tight mb-2">
                            {users.length === 0 ? "No Customers Yet" : "No Customers Match Filters"}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {users.length === 0
                                ? "Customers will appear here as they sign up"
                                : "Try adjusting your search or tier filter"
                            }
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Tier</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">KYC</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Referral Code</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 shrink-0">
                                                    {c.full_name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold uppercase tracking-tight">{c.full_name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(c.tier)}`}>
                                                {c.tier}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`status-pill ${kycColor(c.kyc_status)}`}>
                                                {c.kyc_status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-mono font-bold text-gray-500">{c.referral_code}</td>
                                        <td className="p-4 text-xs font-medium text-gray-500">
                                            {new Date(c.created_at).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/customers/${c.id}`} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
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
