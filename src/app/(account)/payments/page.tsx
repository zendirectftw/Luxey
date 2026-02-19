"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    payment_method: string | null;
    status: string;
    completed_at: string | null;
    created_at: string;
    reference_type: string | null;
}

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", DEMO_USER_ID)
                .order("created_at", { ascending: false });

            setTransactions(data || []);
            setLoading(false);
        }
        load();
    }, []);

    const fmt = (n: number) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

    const typeLabel = (t: string) => {
        const map: Record<string, string> = {
            seller_payout: "Seller Payout", commission_payout: "Commission Payout",
            platform_fee: "Platform Fee", dealer_payment: "Dealer Payment", shipping_fee: "Shipping Fee",
        };
        return map[t] || t;
    };

    const totalPayments = transactions.length;
    const totalAmount = transactions.reduce((s, t) => s + Number(t.amount), 0);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            <header className="mb-8">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Payments
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    All payouts from verified purchase orders and commissions. RTP payments arrive in seconds.
                </p>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="stat-card">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Total Payments</p>
                    <p className="text-4xl font-black tracking-tighter">{String(totalPayments).padStart(2, "0")}</p>
                </div>
                <div className="stat-card border-l-4 border-l-green-500">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Total Dollar Payments</p>
                    <p className="text-4xl font-black tracking-tighter price-green">{fmt(totalAmount)}</p>
                </div>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-center">Method</th>
                                <th className="px-6 py-4 text-right">Payment ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {transactions.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400 font-bold uppercase">No payments yet</td></tr>
                            ) : transactions.map((t) => (
                                <tr key={t.id} className="payment-row transition-all hover:bg-[#FAFAFA]">
                                    <td className="px-6 py-5 text-[11px] font-bold text-gray-400 tabular-nums uppercase">
                                        {new Date(t.created_at).toLocaleDateString("en-US")}
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-sm price-green">{fmt(t.amount)}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`status-pill ${t.status === "completed" ? "status-complete" : "status-pending-pill"}`}>
                                            {t.status === "completed" ? "Complete" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-black">{typeLabel(t.type)}</td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xs font-bold text-gray-500">
                                                {(t.payment_method || "wire_transfer").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                            {t.type === "seller_payout" && (
                                                <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-0.5 rounded border border-green-100 uppercase tracking-wider">
                                                    ⚡ RTP
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right text-[10px] font-mono text-gray-400">{t.id.slice(0, 12)}…</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
