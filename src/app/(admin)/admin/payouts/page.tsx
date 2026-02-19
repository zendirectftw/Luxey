"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ── Real schema:
   id, beneficiary_id, source_user_id, purchase_order_id,
   level, commission_rate, amount, status, paid_at, created_at
────────────────────────────────────────────────────────── */

interface Commission {
    id: string;
    beneficiary_id: string;
    source_user_id: string;
    purchase_order_id: string | null;
    level: number;
    commission_rate: number;
    amount: number;
    status: string;
    paid_at: string | null;
    created_at: string;
    beneficiary: { full_name: string; tier: string } | null;
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

const levelLabel = (level: number) => {
    const labels: Record<number, string> = { 1: "Direct", 2: "L2", 3: "L3", 4: "L4", 5: "L5", 6: "L6", 7: "L7" };
    return labels[level] ?? `L${level}`;
};

export default function PayoutsPage() {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [processing, setProcessing] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadCommissions = async () => {
        // Fetch commissions, then separately fetch beneficiary user data
        const { data, error } = await supabase
            .from("commissions")
            .select("id, beneficiary_id, source_user_id, purchase_order_id, level, commission_rate, amount, status, paid_at, created_at")
            .order("created_at", { ascending: false });

        if (error || !data) {
            setLoading(false);
            return;
        }

        // Fetch user info for beneficiaries
        const uniqueIds = [...new Set(data.map(c => c.beneficiary_id).filter(Boolean))];
        let userMap: Record<string, { full_name: string; tier: string }> = {};

        if (uniqueIds.length > 0) {
            const { data: users } = await supabase
                .from("users")
                .select("id, full_name, tier")
                .in("id", uniqueIds);

            if (users) {
                userMap = Object.fromEntries(users.map(u => [u.id, { full_name: u.full_name, tier: u.tier }]));
            }
        }

        setCommissions(data.map(c => ({
            ...c,
            beneficiary: userMap[c.beneficiary_id] ?? null,
        })));
        setLoading(false);
    };

    useEffect(() => {
        loadCommissions();

        const channel = supabase
            .channel("payouts-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "commissions" }, () => {
                loadCommissions();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Approve single ── */
    const handleApprove = async (id: string) => {
        setProcessing(id);
        const { error } = await supabase.from("commissions").update({ status: "approved" }).eq("id", id);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { showToast("Commission approved ✓"); await loadCommissions(); }
        setProcessing(null);
    };

    /* ── Mark paid single ── */
    const handleMarkPaid = async (id: string) => {
        setProcessing(id);
        const now = new Date().toISOString();
        const { error } = await supabase.from("commissions").update({ status: "paid", paid_at: now }).eq("id", id);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else {
            showToast("Marked as paid ✓");
            setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
            await loadCommissions();
        }
        setProcessing(null);
    };

    /* ── Batch payout ── */
    const handleBatchPayout = async () => {
        const approved = pending.filter(c => c.status === "approved");
        const targets = selectedIds.size > 0 ? [...selectedIds] : approved.map(c => c.id);

        if (targets.length === 0) {
            showToast("No approved commissions to process — approve some first.", "error");
            return;
        }

        setProcessing("batch");
        const now = new Date().toISOString();
        const { error } = await supabase.from("commissions").update({ status: "paid", paid_at: now }).in("id", targets);
        if (error) showToast(`Batch failed: ${error.message}`, "error");
        else { showToast(`${targets.length} payout(s) processed ✓`); setSelectedIds(new Set()); await loadCommissions(); }
        setProcessing(null);
    };

    /* ── Checkbox helpers ── */
    const toggleSelect = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleAll = (ids: string[]) => {
        if (ids.every(id => selectedIds.has(id)))
            setSelectedIds(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n; });
        else
            setSelectedIds(prev => { const n = new Set(prev); ids.forEach(id => n.add(id)); return n; });
    };

    const pending = commissions.filter(c => c.status === "pending" || c.status === "approved");
    const completed = commissions.filter(c => c.status === "paid");
    const totalPending = pending.reduce((s, c) => s + Number(c.amount || 0), 0);
    const totalPaid = completed.reduce((s, c) => s + Number(c.amount || 0), 0);
    const totalAll = commissions.reduce((s, c) => s + Number(c.amount || 0), 0);
    const pendingIds = pending.map(c => c.id);
    const allSelected = pendingIds.length > 0 && pendingIds.every(id => selectedIds.has(id));

    if (loading) return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Commissions &amp; Payouts</h2>
            </header>
            <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading commissions...</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-sm shadow-lg text-[11px] font-black uppercase tracking-widest transition-all ${toast.type === "success" ? "bg-black text-white" : "bg-red-600 text-white"}`}>
                    {toast.msg}
                </div>
            )}

            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Commissions &amp; Payouts</h2>
                <div className="flex gap-4 items-center">
                    {selectedIds.size > 0 && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedIds.size} selected</span>
                    )}
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Export Report
                    </button>
                    <button
                        onClick={handleBatchPayout}
                        disabled={processing === "batch"}
                        className={`px-8 py-2 text-[10px] font-black uppercase transition-all tracking-widest ${processing === "batch" ? "bg-gray-400 text-white cursor-not-allowed" : "bg-black text-white hover:bg-zinc-800"}`}
                    >
                        {processing === "batch" ? "Processing..." : selectedIds.size > 0 ? `Pay Selected (${selectedIds.size})` : "Process Batch Payout"}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Total Commissions", value: `$${totalAll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                        { label: "Pending Payouts", value: `$${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                        { label: "Total Paid", value: `$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                        { label: "Active Earners", value: String(new Set(commissions.map(c => c.beneficiary_id)).size) },
                    ].map(s => (
                        <div key={s.label} className="admin-stat">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{s.label}</p>
                            <p className="text-3xl font-black tracking-tighter">{s.value}</p>
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
                                        <input type="checkbox" checked={allSelected} onChange={() => toggleAll(pendingIds)} style={{ width: 16, height: 16 }} />
                                    </th>
                                    <th className="px-6 py-3">Beneficiary</th>
                                    <th className="px-6 py-3 text-center">Tier</th>
                                    <th className="px-6 py-3 text-center">Level</th>
                                    <th className="px-6 py-3 text-right">Rate</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {pending.map(p => (
                                    <tr key={p.id} className={`hover:bg-[#FAFAFA] transition-colors ${selectedIds.has(p.id) ? "bg-yellow-50/40" : ""}`}>
                                        <td className="px-6 py-4">
                                            <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} style={{ width: 16, height: 16 }} />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold uppercase">{p.beneficiary?.full_name ?? "—"}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(p.beneficiary?.tier ?? "")}`}>
                                                {p.beneficiary?.tier ?? "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 text-[10px] font-black">
                                                {levelLabel(p.level)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs font-bold text-[#D4AF37]">{p.commission_rate}%</td>
                                        <td className="px-6 py-4 text-right text-sm font-black price-green">${Number(p.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`status-pill ${p.status === "approved" ? "status-complete" : "status-progress"}`}>{p.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-3 justify-end">
                                                {p.status === "pending" && (
                                                    <button onClick={() => handleApprove(p.id)} disabled={processing === p.id}
                                                        className="text-[10px] font-bold text-green-600 hover:text-green-800 uppercase tracking-widest disabled:opacity-50">
                                                        {processing === p.id ? "..." : "Approve"}
                                                    </button>
                                                )}
                                                {p.status === "approved" && (
                                                    <button onClick={() => handleMarkPaid(p.id)} disabled={processing === p.id}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest disabled:opacity-50">
                                                        {processing === p.id ? "..." : "Mark Paid"}
                                                    </button>
                                                )}
                                            </div>
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
                        <span className="text-[10px] font-bold text-gray-400">{completed.length} paid out · ${totalPaid.toFixed(2)} total</span>
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
                                    <th className="px-6 py-3">Beneficiary</th>
                                    <th className="px-6 py-3 text-center">Tier</th>
                                    <th className="px-6 py-3 text-center">Level</th>
                                    <th className="px-6 py-3 text-right">Rate</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3">Date Paid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {completed.map(p => (
                                    <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold uppercase">{p.beneficiary?.full_name ?? "—"}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(p.beneficiary?.tier ?? "")}`}>
                                                {p.beneficiary?.tier ?? "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 text-[10px] font-black">
                                                {levelLabel(p.level)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs font-bold text-[#D4AF37]">{p.commission_rate}%</td>
                                        <td className="px-6 py-4 text-right text-sm font-black">${Number(p.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                            {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}
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
