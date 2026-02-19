"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface Referral {
    id: string;
    full_name: string;
    email: string;
    tier: string;
    created_at: string;
}

interface TierConfig {
    name: string;
    eligible_level: number;
}

interface CommissionRate {
    level: number;
    label: string;
    commission_rate: number;
}

export default function ReferralsPage() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [referralCode, setReferralCode] = useState("");
    const [tiers, setTiers] = useState<TierConfig[]>([]);
    const [rates, setRates] = useState<CommissionRate[]>([]);
    const [userTier, setUserTier] = useState("bronze");
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function load() {
            const [userRes, refRes, tierRes, rateRes] = await Promise.all([
                supabase.from("users").select("referral_code, tier").eq("id", DEMO_USER_ID).single(),
                supabase.from("users").select("id, full_name, email, tier, created_at").eq("referred_by", DEMO_USER_ID).order("created_at", { ascending: false }),
                supabase.from("tier_config").select("name, eligible_level").eq("visibility", "public").order("sort_order"),
                supabase.from("commission_rates").select("level, label, commission_rate").order("level"),
            ]);

            setReferralCode(userRes.data?.referral_code || "");
            setUserTier(userRes.data?.tier || "bronze");
            setReferrals(refRes.data || []);
            setTiers(tierRes.data || []);
            setRates(rateRes.data || []);
            setLoading(false);
        }
        load();
    }, []);

    const tierLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
    const link = typeof window !== "undefined" ? `${window.location.origin}/join?ref=${referralCode}` : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Determine eligible levels for current tier
    const currentTierConfig = tiers.find(t => t.name.toLowerCase() === userTier);
    const maxLevel = currentTierConfig?.eligible_level || 1;

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
            {/* HEADER */}
            <header className="mb-10">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Referrals
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Share your link and earn commissions from your referral network.
                </p>
            </header>

            {/* REFERRAL LINK */}
            <div className="bg-black p-8 rounded-sm shadow-lg mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                            Your Referral Link
                        </p>
                        <p className="text-white font-mono text-sm break-all">{link}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                            Code: <span className="text-white font-black">{referralCode}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="px-8 py-3 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#C4A030] transition-all rounded-sm whitespace-nowrap"
                    >
                        {copied ? "✓ Copied!" : "Copy Link"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: REFERRALS LIST */}
                <div className="lg:col-span-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Direct Referrals ({referrals.length})
                    </h2>
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                        {referrals.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    No referrals yet
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Share your link to start building your network.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F5F5F5]">
                                    {referrals.map(ref => (
                                        <tr key={ref.id} className="hover:bg-[#FAFAFA] transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-sm text-black">{ref.full_name}</p>
                                                <p className="text-[10px] font-mono text-gray-400">{ref.email}</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="status-pill-gold text-[9px]">{tierLabel(ref.tier)}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 tabular-nums">
                                                {new Date(ref.created_at).toLocaleDateString("en-US")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* RIGHT: COMMISSION STRUCTURE */}
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Your Commission Structure
                    </h2>
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                        <div className="p-4 bg-[#FAFAFA] border-b border-[#E4E4E4]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                As a <span className="text-black">{tierLabel(userTier)}</span> member
                            </p>
                        </div>
                        <div className="divide-y divide-[#F5F5F5]">
                            {rates.map(rate => {
                                const eligible = rate.level <= maxLevel;
                                return (
                                    <div
                                        key={rate.level}
                                        className={`px-5 py-4 flex justify-between items-center ${!eligible ? "opacity-30" : ""}`}
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-black uppercase">{rate.label}</p>
                                            <p className="text-[9px] text-gray-400 font-bold">Level {rate.level}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black ${eligible ? "price-green" : "text-gray-300"}`}>
                                                {rate.commission_rate}%
                                            </p>
                                            {!eligible && (
                                                <p className="text-[8px] font-black text-gray-400 uppercase">Locked</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
