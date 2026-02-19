"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Commission {
    id: string;
    user_id: string;
    amount: number;
    status: string;
    created_at: string;
    users: { full_name: string; tier: string } | null;
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

export default function PayoutsPage() {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("commissions")
                .select("id, user_id, amount, status, created_at, users(full_name, tier)")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setCommissions(data.map(c => ({
                    ...c,
                    users: Array.isArray(c.users) ? c.users[0] : c.users,
                })));
            }
            setLoading(false);
        }
        load();
    }, []);

    const pending = commissions.filter(c => c.status === "pending" || c.status === "approved");
    const completed = commissions.filter(c => c.status === "paid");

    const totalPending = pending.reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const totalPaid = completed.reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const totalAll = commissions.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Commissions & Payouts</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading commissions...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Commissions & Payouts</h2>
                <div className="flex gap-4">
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Export Report
                    </button>
                    <button className="px-8 py-2 text-[10px] font-black uppercase bg-black text-white hover:bg-zinc-800 transition-all tracking-widest">
                        Process Batch Payout
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Total Commissions", value: `$${totalAll.toLocaleString()}` },
                        { label: "Pending Payouts", value: `$${totalPending.toLocaleString()}` },
                        { label: "Total Paid", value: `$${totalPaid.toLocaleString()}` },
                        { label: "Active Earners", value: String(new Set(commissions.map(c => c.user_id)).size) },
                    ].map(s => (
                        <div key={s.label} className="admin-stat">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{s.label}</p>
                            <p className="text-4xl font-black tracking-tighter">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Pending Payouts */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden mb-10">
                    <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center bg-[#FAFAFA]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Pending Payouts</h3>
                        <span className="text-[10px] font-bold text-gray-400">{pending.length} awaiting action</span>
                    </div>
                    {pending.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-3xl mb-3">💰</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No pending payouts</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-3">
                                        <input type="checkbox" className="luxey-checkbox" style={{ width: 16, height: 16 }} />
                                    </th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3 text-center">Tier</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {pending.map((p) => (
                                    <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="luxey-checkbox" style={{ width: 16, height: 16 }} />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold uppercase">{p.users?.full_name || "—"}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(p.users?.tier || "")}`}>
                                                {p.users?.tier || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-black price-green">
                                            ${Number(p.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`status-pill ${p.status === "approved" ? "status-complete" : "status-progress"}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex gap-3 justify-end">
                                            <button className="text-[10px] font-bold text-green-600 hover:text-green-800 uppercase tracking-widest">
                                                Approve
                                            </button>
                                            <button className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest underline">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Completed Payouts */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center bg-[#FAFAFA]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Completed Payouts</h3>
                        <span className="text-[10px] font-bold text-gray-400">{completed.length} paid out</span>
                    </div>
                    {completed.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-3xl mb-3">✅</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No completed payouts yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Date Paid</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-center">Tier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {completed.map((p) => (
                                    <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold uppercase">{p.users?.full_name || "—"}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-black">${Number(p.amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(p.users?.tier || "")}`}>
                                                {p.users?.tier || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
