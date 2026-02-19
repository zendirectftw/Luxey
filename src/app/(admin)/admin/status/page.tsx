"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ── Types for DB data ────────────────── */
interface TierConfig {
    id: string;
    name: string;
    volume_requirement: number;
    platform_fee_pct: number;
    eligible_level: number;
    color: string;
    visibility: string;
    sort_order: number;
}

interface CommissionRate {
    id: string;
    level: number;
    label: string;
    commission_rate: number;
    is_active: boolean;
}

/* ── Map DB row → UI shape ────────────────── */
function mapTier(t: TierConfig) {
    return {
        id: t.id,
        sortOrder: t.sort_order,
        name: t.name,
        volumeReq: Number(t.volume_requirement),
        platformFee: Number(t.platform_fee_pct),
        eligibleLevel: t.eligible_level,
        commissionPct: 0,
        color: t.color,
        visibility: t.visibility,
    };
}

function mapCommission(c: CommissionRate) {
    return {
        id: c.id,
        level: c.level,
        label: c.label,
        pct: Number(c.commission_rate),
        isActive: c.is_active,
    };
}

export default function AdminStatusPage() {
    const [tiers, setTiers] = useState<ReturnType<typeof mapTier>[]>([]);
    const [commissions, setCommissions] = useState<ReturnType<typeof mapCommission>[]>([]);
    const [editingTier, setEditingTier] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ── Load data from Supabase on mount ────────────────── */
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);

            const [tierRes, commRes] = await Promise.all([
                supabase.from("tier_config").select("*").order("sort_order"),
                supabase.from("commission_rates").select("*").order("level"),
            ]);

            if (tierRes.error) {
                setError(`Failed to load tiers: ${tierRes.error.message}`);
                setLoading(false);
                return;
            }
            if (commRes.error) {
                setError(`Failed to load commissions: ${commRes.error.message}`);
                setLoading(false);
                return;
            }

            const mappedTiers = (tierRes.data as TierConfig[]).map(mapTier);
            const mappedComms = (commRes.data as CommissionRate[]).map(mapCommission);

            // Attach the commission pct to each tier based on eligible level
            mappedTiers.forEach(t => {
                const comm = mappedComms.find(c => c.level === t.eligibleLevel);
                t.commissionPct = comm?.pct || 0;
            });

            setTiers(mappedTiers);
            setCommissions(mappedComms);
            setLoading(false);
        }

        loadData();
    }, []);

    /* ── Update handlers ────────────────── */
    const updateTier = (id: string, field: string, value: string | number) => {
        setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
        setSaved(false);
    };

    const updateCommission = (level: number, pct: number) => {
        setCommissions(prev => prev.map(c => c.level === level ? { ...c, pct } : c));
        setSaved(false);
    };

    /* ── Save to Supabase ────────────────── */
    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            // Save tiers
            for (const tier of tiers) {
                const { error: tierErr } = await supabase
                    .from("tier_config")
                    .update({
                        name: tier.name,
                        volume_requirement: tier.volumeReq,
                        platform_fee_pct: tier.platformFee,
                        eligible_level: tier.eligibleLevel,
                        color: tier.color,
                    })
                    .eq("id", tier.id);

                if (tierErr) throw tierErr;
            }

            // Save commission rates
            for (const comm of commissions) {
                const { error: commErr } = await supabase
                    .from("commission_rates")
                    .update({
                        commission_rate: comm.pct,
                        label: comm.label,
                    })
                    .eq("id", comm.id);

                if (commErr) throw commErr;
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to save";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const totalMaxCommission = commissions.reduce((sum, c) => sum + c.pct, 0);

    /* ── Loading state ────────────────── */
    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Status & Commissions</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading configuration...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Status & Commissions</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tier Configuration</span>
                </div>
                <div className="flex items-center gap-3">
                    {error && (
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                            ✕ {error}
                        </span>
                    )}
                    {saved && (
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                            ✓ Saved Successfully
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${saving
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-black text-white hover:bg-zinc-800"
                            }`}
                    >
                        {saving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="admin-stat">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Status Tiers</p>
                        <p className="text-4xl font-black tracking-tighter mb-1">{tiers.length}</p>
                        <p className="text-[10px] font-bold text-gray-400">Active tiers configured</p>
                    </div>
                    <div className="admin-stat">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Commission Levels</p>
                        <p className="text-4xl font-black tracking-tighter mb-1">{commissions.length}</p>
                        <p className="text-[10px] font-bold text-gray-400">Referral payout levels</p>
                    </div>
                    <div className="admin-stat">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Max Total Commission</p>
                        <p className="text-4xl font-black tracking-tighter text-[#D4AF37] mb-1">{totalMaxCommission.toFixed(1)}%</p>
                        <p className="text-[10px] font-bold text-gray-400">Combined all levels</p>
                    </div>
                    <div className="admin-stat">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Min Platform Fee</p>
                        <p className="text-4xl font-black tracking-tighter mb-1">{tiers.length > 0 ? Math.min(...tiers.map(t => t.platformFee)) : 0}%</p>
                        <p className="text-[10px] font-bold text-gray-400">{tiers.length > 0 ? tiers[tiers.length - 1].name : ""} tier rate</p>
                    </div>
                </div>

                {/* ═════════════════════════════════════
                   SECTION 1: STATUS TIERS
                   ═════════════════════════════════════ */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden mb-10">
                    <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA] flex items-center justify-between">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest">Status Tiers</h3>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">Configure volume requirements, platform fees, and eligible referral levels for each status tier</p>
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Click any row to edit</span>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-6 py-3 w-8 text-center">#</th>
                                <th className="px-6 py-3">Tier Name</th>
                                <th className="px-6 py-3 text-right">Volume Requirement</th>
                                <th className="px-6 py-3 text-right">Platform Fee (%)</th>
                                <th className="px-6 py-3 text-center">Eligible Referral Level</th>
                                <th className="px-6 py-3 text-right">Commission (%)</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {tiers.map((tier) => (
                                <tr
                                    key={tier.id}
                                    className={`transition-all ${editingTier === tier.id ? "bg-yellow-50/50" : "hover:bg-[#FAFAFA]"}`}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <div
                                            className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-[10px] font-black text-white"
                                            style={{ backgroundColor: tier.color }}
                                        >
                                            {tier.sortOrder}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingTier === tier.id ? (
                                            <input
                                                type="text"
                                                value={tier.name}
                                                onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                                                className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold uppercase tracking-tight focus:border-black outline-none"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold uppercase tracking-tight">{tier.name}</span>
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                                                {tier.visibility === "hidden" && (
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Hidden</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingTier === tier.id ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-xs font-bold text-gray-400">$</span>
                                                <input
                                                    type="number"
                                                    value={tier.volumeReq}
                                                    onChange={(e) => updateTier(tier.id, "volumeReq", parseInt(e.target.value) || 0)}
                                                    className="w-32 px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold text-right focus:border-black outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-sm font-bold">${tier.volumeReq.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingTier === tier.id ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={tier.platformFee}
                                                    onChange={(e) => updateTier(tier.id, "platformFee", parseFloat(e.target.value) || 0)}
                                                    className="w-24 px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold text-right focus:border-black outline-none"
                                                />
                                                <span className="text-xs font-bold text-gray-400">%</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-600">{tier.platformFee}%</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {editingTier === tier.id ? (
                                            <select
                                                value={tier.eligibleLevel}
                                                onChange={(e) => updateTier(tier.id, "eligibleLevel", parseInt(e.target.value))}
                                                className="px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold focus:border-black outline-none"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7].map(l => (
                                                    <option key={l} value={l}>Level {l}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 rounded text-[10px] font-black uppercase tracking-widest">
                                                Level {tier.eligibleLevel}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingTier === tier.id ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    value={tier.commissionPct}
                                                    onChange={(e) => updateTier(tier.id, "commissionPct", parseFloat(e.target.value) || 0)}
                                                    className="w-24 px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold text-right focus:border-black outline-none"
                                                />
                                                <span className="text-xs font-bold text-gray-400">%</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-black text-[#D4AF37]">{tier.commissionPct}%</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setEditingTier(editingTier === tier.id ? null : tier.id)}
                                            className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-sm transition-all ${editingTier === tier.id
                                                ? "bg-black text-white border-black"
                                                : "border-[#E4E4E4] hover:border-black hover:bg-black hover:text-white"
                                                }`}
                                        >
                                            {editingTier === tier.id ? "Done" : "Edit"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ═════════════════════════════════════
                   SECTION 2: REFERRAL COMMISSION RATES
                   ═════════════════════════════════════ */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden mb-10">
                    <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA] flex items-center justify-between">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest">Referral Commission Rates</h3>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">Set the commission payout percentage for each referral level — paid as % of platform fees generated</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#D4AF37]">
                            Total: {totalMaxCommission.toFixed(1)}% max payout
                        </span>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-7 gap-4">
                            {commissions.map((c) => (
                                <div
                                    key={c.level}
                                    className={`border rounded-sm p-5 text-center hover:border-black transition-all group ${!c.isActive ? "border-orange-200 bg-orange-50/30" : "border-[#E4E4E4]"
                                        }`}
                                >
                                    <div className={`w-10 h-10 mx-auto rounded-full text-white text-sm font-black flex items-center justify-center mb-3 ${!c.isActive ? "bg-gray-400" : "bg-black"
                                        }`}>
                                        {c.level}
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                                    {!c.isActive && (
                                        <p className="text-[7px] font-black uppercase tracking-widest text-orange-500 mb-2">Hidden Level</p>
                                    )}
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={c.pct}
                                            onChange={(e) => updateCommission(c.level, parseFloat(e.target.value) || 0)}
                                            className="w-full text-center px-2 py-2 border border-[#E4E4E4] rounded-sm text-xl font-black focus:border-black outline-none transition-all"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-300">%</span>
                                    </div>
                                    <p className="text-[8px] font-bold text-gray-300 mt-2 uppercase tracking-wider">of fees generated</p>
                                </div>
                            ))}
                        </div>

                        {/* Visual bar representation */}
                        <div className="mt-8 pt-6 border-t border-[#F5F5F5]">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Commission Distribution</p>
                            <div className="flex items-center gap-1 h-10 rounded-sm overflow-hidden">
                                {commissions.map((c) => {
                                    const width = totalMaxCommission > 0 ? (c.pct / totalMaxCommission) * 100 : 0;
                                    const colors = ["bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-purple-500", "bg-pink-500"];
                                    return (
                                        <div
                                            key={c.level}
                                            className={`${colors[c.level - 1]} h-full flex items-center justify-center text-white text-[9px] font-black transition-all ${!c.isActive ? "opacity-50" : ""
                                                }`}
                                            style={{ width: `${width}%` }}
                                            title={`Level ${c.level}: ${c.pct}%${!c.isActive ? " (Hidden)" : ""}`}
                                        >
                                            {c.pct > 2 ? `L${c.level}: ${c.pct}%` : ""}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] font-bold text-gray-400">Level 1 (Direct)</span>
                                <span className="text-[9px] font-bold text-gray-400">Level 7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════
                   SECTION 3: COMBINED PREVIEW
                   ═════════════════════════════════════ */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#E4E4E4] bg-black">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">Live Preview — Customer-Facing Status Table</h3>
                        <p className="text-[9px] text-gray-500 font-bold mt-1">How this configuration will appear to customers</p>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E4E4E4] bg-[#FAFAFA] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-6 py-3">Status Tier</th>
                                <th className="px-6 py-3 text-right">Required Monthly Volume</th>
                                <th className="px-6 py-3 text-right">Platform Fee</th>
                                <th className="px-6 py-3 text-center">Unlocks Through</th>
                                <th className="px-6 py-3 text-right">Commission at This Level</th>
                                <th className="px-6 py-3 text-right">Cumulative Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {tiers.map((tier, idx) => {
                                const cumulative = commissions
                                    .filter(c => c.level <= tier.eligibleLevel)
                                    .reduce((sum, c) => sum + c.pct, 0);
                                return (
                                    <tr key={tier.id} className={`hover:bg-[#FAFAFA] transition-colors ${tier.visibility === "hidden" ? "opacity-50" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                                                <span className="text-sm font-bold uppercase tracking-tight">{tier.name}</span>
                                                {tier.visibility === "hidden" && (
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-500">🔒</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold">${tier.volumeReq.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-500">{tier.platformFee}%</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 rounded text-[10px] font-black uppercase tracking-widest">
                                                Level {tier.eligibleLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-[#D4AF37]">
                                                {idx === 0 ? "" : "+"}{commissions.find(c => c.level === tier.eligibleLevel)?.pct || 0}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black price-green">{cumulative.toFixed(1)}%</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-black text-white">
                                <td colSpan={5} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                                    Maximum Total Commission (All Levels Unlocked)
                                </td>
                                <td className="px-6 py-4 text-right text-xl font-black text-[#D4AF37]">
                                    {totalMaxCommission.toFixed(1)}%
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}
