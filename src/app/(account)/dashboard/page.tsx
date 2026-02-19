"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface UserData {
    full_name: string;
    tier: string;
    created_at: string;
}

interface Stats {
    totalItems: number;
    totalValue: number;
    referralCount: number;
    lifetimeCommissions: number;
    commissionThisMonth: number;
    commissionLastMonth: number;
    ordersThisMonth: number;
    orders3Months: number;
    orders6Months: number;
    orders12Months: number;
    valueThisMonth: number;
    value3Months: number;
    value6Months: number;
    value12Months: number;
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const now = new Date();
            const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
            const endLastMonth = startThisMonth;
            const start3 = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
            const start6 = new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString();
            const start12 = new Date(now.getFullYear(), now.getMonth() - 12, 1).toISOString();

            const [userRes, posRes, refRes, commRes, commThisRes, commLastRes] = await Promise.all([
                supabase.from("users").select("full_name, tier, created_at").eq("id", DEMO_USER_ID).single(),
                supabase.from("purchase_orders").select("seller_lock_price, created_at").eq("seller_id", DEMO_USER_ID),
                supabase.from("users").select("id").eq("referred_by", DEMO_USER_ID),
                supabase.from("commissions").select("amount").eq("beneficiary_id", DEMO_USER_ID),
                supabase.from("commissions").select("amount").eq("beneficiary_id", DEMO_USER_ID).gte("created_at", startThisMonth),
                supabase.from("commissions").select("amount").eq("beneficiary_id", DEMO_USER_ID).gte("created_at", startLastMonth).lt("created_at", endLastMonth),
            ]);

            setUser(userRes.data);

            const pos = posRes.data || [];
            const totalItems = pos.length;
            const totalValue = pos.reduce((s, p) => s + Number(p.seller_lock_price || 0), 0);

            const count = (arr: typeof pos, since: string) => arr.filter(p => p.created_at >= since).length;
            const sum = (arr: typeof pos, since: string) => arr.filter(p => p.created_at >= since).reduce((s, p) => s + Number(p.seller_lock_price || 0), 0);

            const lifetimeCommissions = (commRes.data || []).reduce((s, c) => s + Number(c.amount || 0), 0);
            const commissionThisMonth = (commThisRes.data || []).reduce((s, c) => s + Number(c.amount || 0), 0);
            const commissionLastMonth = (commLastRes.data || []).reduce((s, c) => s + Number(c.amount || 0), 0);

            setStats({
                totalItems,
                totalValue,
                referralCount: (refRes.data || []).length,
                lifetimeCommissions,
                commissionThisMonth,
                commissionLastMonth,
                ordersThisMonth: count(pos, startThisMonth),
                orders3Months: count(pos, start3),
                orders6Months: count(pos, start6),
                orders12Months: count(pos, start12),
                valueThisMonth: sum(pos, startThisMonth),
                value3Months: sum(pos, start3),
                value6Months: sum(pos, start6),
                value12Months: sum(pos, start12),
            });
            setLoading(false);
        }
        load();
    }, []);

    const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const tierLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    const lockerStats = [
        { label: "Total Items", value: String(stats?.totalItems || 0).padStart(2, "0") },
        { label: "Total Trays", value: String(Math.ceil((stats?.totalItems || 0) / 25)).padStart(2, "0") },
        { label: "Locker Total Value ($)", value: fmt(stats?.totalValue || 0), green: true },
        { label: "Total Change in Value ($)", value: "+$0", green: true, growth: "(—)", border: true },
    ];

    const activityLeft = [
        { period: "This Month", value: String(stats?.ordersThisMonth || 0).padStart(2, "0") },
        { period: "Past 3 Months", value: String(stats?.orders3Months || 0).padStart(2, "0") },
        { period: "Past 6 Months", value: String(stats?.orders6Months || 0).padStart(2, "0") },
        { period: "Past 12 Months", value: String(stats?.orders12Months || 0).padStart(2, "0"), bg: true },
    ];

    const activityRight = [
        { period: "This Month", value: fmt(stats?.valueThisMonth || 0) },
        { period: "Past 3 Months", value: fmt(stats?.value3Months || 0) },
        { period: "Past 6 Months", value: fmt(stats?.value6Months || 0) },
        { period: "Past 12 Months", value: fmt(stats?.value12Months || 0), bg: true },
    ];

    const earnings = [
        { label: "Number of Referrals", value: String(stats?.referralCount || 0), large: true },
        { label: "Commission This Month", value: fmt(stats?.commissionThisMonth || 0), green: true },
        { label: "Commission Last Month", value: fmt(stats?.commissionLastMonth || 0) },
        { label: "Lifetime Commissions", value: fmt(stats?.lifetimeCommissions || 0), featured: true },
    ];

    const firstName = user?.full_name?.split(" ")[0] || "User";
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-5xl text-black tracking-tight mb-1 uppercase">
                        {firstName}&apos;s Dashboard
                    </h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Member since — {memberSince}
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-[#E4E4E4] p-4 rounded-sm shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Current Status:
                    </span>
                    <span className="status-pill-gold">{tierLabel(user?.tier || "bronze")} TIER</span>
                </div>
            </header>

            {/* MY LOCKER OVERVIEW */}
            <div className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1">
                    My Locker Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {lockerStats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`stat-card ${stat.border ? "border-l-4 border-l-green-500" : ""}`}
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
            </div>

            {/* ACTIVITY GRID */}
            <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 py-3 border-b-2 border-black mb-1 ml-1">
                        TOTAL ORDERS AND LOCKS
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 py-3 border-b-2 border-black mb-1 ml-1">
                        ORDERS AND LOCKS - TOTAL $ MARKET VALUE
                    </div>

                    {activityLeft.map((left, i) => {
                        const right = activityRight[i];
                        return (
                            <div key={`row-${i}`} className="contents">
                                <div className={`stat-card flex justify-between items-center ${left.bg ? "bg-zinc-50" : ""}`}>
                                    <span className="text-[11px] font-black text-black uppercase tracking-widest">
                                        {left.period}
                                    </span>
                                    <span className="text-2xl font-black tracking-tighter">{left.value}</span>
                                </div>
                                <div className={`stat-card flex justify-between items-center border-l-4 border-l-green-500 ${right.bg ? "bg-zinc-50" : ""}`}>
                                    <span className="text-[11px] font-black text-black uppercase tracking-widest">
                                        {right.period}
                                    </span>
                                    <span className="text-2xl font-black price-green tracking-tighter">{right.value}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* EARNINGS & NETWORK */}
            <div className="border-t border-[#E4E4E4] pt-6 pb-12">
                <h2 className="font-serif text-3xl mb-6 uppercase tracking-tight">
                    Earnings &amp; Network
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {earnings.map((item) => (
                        <div
                            key={item.label}
                            className={
                                item.featured
                                    ? "stat-card bg-black border-black shadow-xl ring-2 ring-[#D4AF37] flex flex-col"
                                    : "stat-card"
                            }
                        >
                            <p
                                className={`text-[9px] font-black uppercase tracking-widest mb-4 ${item.featured ? "text-[#D4AF37]" : "text-gray-400"
                                    }`}
                            >
                                {item.label}
                            </p>
                            <div className="flex items-baseline">
                                <p
                                    className={`${item.large ? "text-4xl" : "text-3xl"} font-black tracking-tighter ${item.featured
                                        ? "text-[#D4AF37]"
                                        : item.green
                                            ? "price-green"
                                            : "text-black"
                                        }`}
                                >
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
