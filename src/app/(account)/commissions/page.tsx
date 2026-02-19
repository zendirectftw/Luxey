"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface Commission {
    id: string;
    level: number;
    commission_rate: number;
    amount: number;
    status: string;
    created_at: string;
    paid_at: string | null;
}

interface CommissionRate {
    level: number;
    label: string;
    commission_rate: number;
}

export default function CommissionsPage() {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [rates, setRates] = useState<CommissionRate[]>([]);
    const [userTier, setUserTier] = useState("bronze");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [commRes, rateRes, userRes] = await Promise.all([
                supabase.from("commissions").select("*").eq("beneficiary_id", DEMO_USER_ID).order("created_at", { ascending: false }),
                supabase.from("commission_rates").select("level, label, commission_rate").order("level"),
                supabase.from("users").select("tier").eq("id", DEMO_USER_ID).single(),
            ]);

            setCommissions(commRes.data || []);
            setRates(rateRes.data || []);
            setUserTier(userRes.data?.tier || "bronze");
            setLoading(false);
        }
        load();
    }, []);

    const tierLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
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

    // Group commissions by level for the current month
    const now = new Date();
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const thisMonthComms = commissions.filter(c => c.created_at >= startThisMonth);

    // Build tier breakdown
    const levelLabels: Record<number, string> = {
        1: "1st Level Network", 2: "2nd Level Network", 3: "3rd Level Network",
        4: "4th Level Network", 5: "5th Level Network", 6: "6th Level Network", 7: "7th Level Network",
    };
    const levelSubs: Record<number, string> = {
        1: "Direct Referrals", 2: "Indirect Referrals", 3: "Extended Network",
        4: "4th Level", 5: "5th Level", 6: "6th Level", 7: "7th Level",
    };

    // Group this month's commissions by level
    const levelGroups = thisMonthComms.reduce((acc, c) => {
        if (!acc[c.level]) acc[c.level] = { count: 0, total: 0, rate: c.commission_rate };
        acc[c.level].count++;
        acc[c.level].total += Number(c.amount);
        return acc;
    }, {} as Record<number, { count: number; total: number; rate: number }>);

    const tiers = Object.entries(levelGroups).map(([level, data]) => ({
        name: levelLabels[Number(level)] || `Level ${level}`,
        sub: levelSubs[Number(level)] || "",
        referrals: String(data.count).padStart(2, "0"),
        fees: fmt(data.total / (data.rate / 100)),
        payout: data.rate + "%",
        earnings: fmt(data.total),
    }));

    const totalMonthly = thisMonthComms.reduce((s, c) => s + Number(c.amount), 0);

    // Prior months
    const priorMonths: { month: string; amount: string }[] = [];
    const monthGroups = commissions.reduce((acc, c) => {
        const d = new Date(c.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (c.created_at < startThisMonth) {
            acc[key] = (acc[key] || 0) + Number(c.amount);
        }
        return acc;
    }, {} as Record<string, number>);

    Object.entries(monthGroups)
        .sort(([a], [b]) => b.localeCompare(a))
        .forEach(([key, total]) => {
            const [y, m] = key.split("-");
            const monthName = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
            priorMonths.push({ month: monthName, amount: "+" + fmt(total) });
        });

    const currentMonthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="mb-10">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-4 uppercase leading-none">
                    Commission Summary
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                    LUXEY PAYS UP TO 35% OF PLATFORM FEES GENERATED FROM YOUR REFERRAL NETWORK PAID MONTHLY.{" "}
                    (<a href="#" className="underline hover:text-black transition-colors">learn more</a>)
                </p>
            </header>

            {/* CURRENT MONTH CARD */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm mb-12">
                {/* Month Header */}
                <div className="p-8 border-b border-[#F5F5F5] bg-[#FAFAFA] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="font-serif text-3xl uppercase tracking-tighter mb-1">{currentMonthName}</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Luxey Status:</span>
                            <span className="status-pill-gold">{tierLabel(userTier)} MEMBER</span>
                        </div>
                    </div>
                </div>

                {/* Tier Breakdown Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                <th className="px-8 py-4">Commission Tier</th>
                                <th className="px-8 py-4 text-center">Referrals</th>
                                <th className="px-8 py-4 text-right">Fees Generated</th>
                                <th className="px-8 py-4 text-right">Payout %</th>
                                <th className="px-8 py-4 text-right">Your Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {tiers.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-8 text-center text-sm text-gray-400 font-bold uppercase">No commissions this month yet</td></tr>
                            ) : tiers.map((tier) => (
                                <tr key={tier.name} className="commission-row transition-all">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-black uppercase tracking-tight">{tier.name}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{tier.sub}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-black text-base">{tier.referrals}</td>
                                    <td className="px-8 py-6 text-right font-medium text-gray-500 tracking-tighter">{tier.fees}</td>
                                    <td className="px-8 py-6 text-right font-black text-black">{tier.payout}</td>
                                    <td className="px-8 py-6 text-right font-black text-lg price-green tracking-tighter">{tier.earnings}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-black text-white">
                                <td colSpan={4} className="px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                                    TOTAL MONTHLY COMMISSIONS
                                </td>
                                <td className="px-8 py-6 text-right font-black text-2xl tracking-tighter text-[#D4AF37]">
                                    {fmt(totalMonthly)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* PRIOR MONTHS */}
            {priorMonths.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-[#E4E4E4] pb-2">
                        Prior Months Commissions
                    </h3>
                    {priorMonths.map((pm) => (
                        <button
                            key={pm.month}
                            className="w-full text-left p-5 bg-white border border-[#E4E4E4] rounded flex justify-between items-center group hover:border-[#D4AF37] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">
                                    {pm.month}
                                </span>
                                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                    {pm.amount}
                                </span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-[#D4AF37] transition-all"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
