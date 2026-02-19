"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface User {
    id: string;
    full_name: string;
    email: string;
    tier: string;
    referral_code: string;
    created_at: string;
}

interface DownlineEntry {
    level: number;
    user: User;
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

const levelColor = (level: number) => {
    const colors = [
        "border-l-green-500",
        "border-l-blue-500",
        "border-l-yellow-500",
        "border-l-orange-500",
        "border-l-red-500",
        "border-l-purple-500",
        "border-l-pink-500",
    ];
    return colors[level - 1] || colors[0];
};

const levelBg = (level: number) => {
    const colors = [
        "bg-green-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-orange-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-pink-500",
    ];
    return colors[level - 1] || colors[0];
};

function getOrdinal(n: number): string {
    const ordinals: Record<number, string> = { 1: "Direct", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th" };
    return ordinals[n] || `${n}th`;
}

export default function ReferralNetworkPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [downline, setDownline] = useState<DownlineEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [netLoading, setNetLoading] = useState(false);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("users")
                .select("id, full_name, email, tier, referral_code, created_at")
                .neq("referral_code", "LUXEY-HOUSE")
                .order("full_name");

            if (data) {
                setUsers(data);
                if (data.length > 0) {
                    setSelectedUser(data[0]);
                    loadDownline(data[0].id);
                }
            }
            setLoading(false);
        }
        load();
    }, []);

    async function loadDownline(userId: string) {
        setNetLoading(true);
        // referral_tree: user_id is the downstream user, ancestor_id is the upstream user
        // To get downstream network: find all where ancestor_id = userId
        const { data: treeData } = await supabase
            .from("referral_tree")
            .select("level, user_id")
            .eq("ancestor_id", userId)
            .order("level");

        if (treeData && treeData.length > 0) {
            const userIds = treeData.map(t => t.user_id);
            const { data: userData } = await supabase
                .from("users")
                .select("id, full_name, email, tier, referral_code, created_at")
                .in("id", userIds);

            const userMap = new Map(userData?.map(u => [u.id, u]) || []);

            const entries: DownlineEntry[] = treeData
                .map(t => ({
                    level: t.level,
                    user: userMap.get(t.user_id)!,
                }))
                .filter(e => e.user);

            setDownline(entries);
        } else {
            setDownline([]);
        }
        setNetLoading(false);
    }

    const selectUser = (user: User) => {
        setSelectedUser(user);
        setExpandedLevel(null);
        loadDownline(user.id);
    };

    const filteredUsers = users.filter(
        c => c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.referral_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group downline by level
    const levelGroups = downline.reduce((acc, entry) => {
        if (!acc[entry.level]) acc[entry.level] = [];
        acc[entry.level].push(entry);
        return acc;
    }, {} as Record<number, DownlineEntry[]>);

    const levelSummaries = Object.entries(levelGroups).map(([level, entries]) => ({
        level: parseInt(level),
        count: entries.length,
    })).sort((a, b) => a.level - b.level);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Referral Network</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Referral Network</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Downstream — Referrals by Level</span>
                </div>
                <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                    Export CSV
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Customer Lookup */}
                    <div className="space-y-6">
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Customer Lookup</h3>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, code..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4E4] rounded-sm text-xs font-medium outline-none focus:border-black transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto divide-y divide-[#F5F5F5]">
                                {filteredUsers.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => selectUser(c)}
                                        className={`w-full text-left p-4 hover:bg-[#FAFAFA] transition-colors ${selectedUser?.id === c.id ? "bg-[#FAFAFA] border-l-4 border-l-[#D4AF37]" : ""}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-bold uppercase tracking-tight">{c.full_name}</span>
                                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${tierColor(c.tier)}`}>
                                                {c.tier}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 font-medium">{c.email}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Network View */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedUser && (
                            <>
                                {/* Customer Hero Card */}
                                <div className="bg-black text-white p-8 rounded-sm shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Network Owner</p>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">{selectedUser.full_name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-[#D4AF37]">{selectedUser.referral_code}</p>
                                            <p className="text-[10px] text-gray-400">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Tier: <span className="text-[#D4AF37] capitalize">{selectedUser.tier}</span></span>
                                        <span>Total Referrals: <span className="text-white">{downline.length}</span></span>
                                        <span>Levels Active: <span className="text-white">{levelSummaries.length}</span></span>
                                    </div>
                                </div>

                                {/* Level Summary Cards */}
                                {netLoading ? (
                                    <div className="text-center py-8">
                                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading network...</p>
                                    </div>
                                ) : downline.length === 0 ? (
                                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-12 text-center">
                                        <p className="text-3xl mb-3">🔗</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No downstream referrals found</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-8 gap-2">
                                            <button
                                                onClick={() => setExpandedLevel(null)}
                                                className={`bg-white border rounded-sm p-3 text-center transition-all hover:shadow-md ${expandedLevel === null ? "border-black shadow-md" : "border-[#E4E4E4]"}`}
                                            >
                                                <div className="w-7 h-7 mx-auto rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center mb-2">
                                                    ✦
                                                </div>
                                                <p className="text-lg font-black tracking-tight">{downline.length}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">ALL</p>
                                            </button>
                                            {levelSummaries.map((ls) => (
                                                <button
                                                    key={ls.level}
                                                    onClick={() => setExpandedLevel(expandedLevel === ls.level ? null : ls.level)}
                                                    className={`bg-white border rounded-sm p-3 text-center transition-all hover:shadow-md ${expandedLevel === ls.level ? "border-black shadow-md" : "border-[#E4E4E4]"}`}
                                                >
                                                    <div className={`w-7 h-7 mx-auto rounded-full text-white text-[10px] font-black flex items-center justify-center mb-2 ${levelBg(ls.level)}`}>
                                                        {ls.level}
                                                    </div>
                                                    <p className="text-lg font-black tracking-tight">{ls.count}</p>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">L{ls.level}</p>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Level Detail Tables */}
                                        {Object.entries(levelGroups).map(([level, entries]) => {
                                            const lvl = parseInt(level);
                                            if (expandedLevel !== null && expandedLevel !== lvl) return null;

                                            return (
                                                <div key={level} className={`bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden border-l-4 ${levelColor(lvl)}`}>
                                                    <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA] flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-8 h-8 rounded-full text-white text-[11px] font-black flex items-center justify-center ${levelBg(lvl)}`}>
                                                                {level}
                                                            </span>
                                                            <div>
                                                                <h3 className="text-[11px] font-black uppercase tracking-widest">
                                                                    Level {level} — {getOrdinal(lvl)} Referrals
                                                                </h3>
                                                                <p className="text-[9px] text-gray-400 font-bold">{entries.length} {entries.length === 1 ? "customer" : "customers"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                                <th className="px-5 py-3">Customer</th>
                                                                <th className="px-5 py-3">Email</th>
                                                                <th className="px-5 py-3 text-center">Tier</th>
                                                                <th className="px-5 py-3">Referral Code</th>
                                                                <th className="px-5 py-3">Joined</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-[#F5F5F5]">
                                                            {entries.map((entry) => (
                                                                <tr key={entry.user.id} className="hover:bg-[#FAFAFA] transition-colors">
                                                                    <td className="px-5 py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-[#E4E4E4] flex items-center justify-center text-[9px] font-black text-zinc-400 shrink-0">
                                                                                {entry.user.full_name.split(" ").map(n => n[0]).join("")}
                                                                            </div>
                                                                            <span className="text-sm font-bold uppercase tracking-tight">{entry.user.full_name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3 text-xs text-gray-500">{entry.user.email}</td>
                                                                    <td className="px-5 py-3 text-center">
                                                                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${tierColor(entry.user.tier)}`}>
                                                                            {entry.user.tier}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3 text-xs font-mono font-bold text-gray-500">{entry.user.referral_code}</td>
                                                                    <td className="px-5 py-3 text-xs font-medium text-gray-400">
                                                                        {new Date(entry.user.created_at).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
