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

interface UplineEntry {
    level: number;
    ancestor: User;
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
        "border-l-blue-500 bg-blue-50/30",
        "border-l-green-500 bg-green-50/30",
        "border-l-yellow-500 bg-yellow-50/30",
        "border-l-orange-500 bg-orange-50/30",
        "border-l-red-500 bg-red-50/30",
        "border-l-purple-500 bg-purple-50/30",
        "border-l-pink-500 bg-pink-50/30",
    ];
    return colors[level - 1] || colors[0];
};

export default function ReferralTreePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [upline, setUpline] = useState<UplineEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(false);

    const loadUsers = async () => {
        const { data } = await supabase
            .from("users")
            .select("id, full_name, email, tier, referral_code, created_at")
            .neq("referral_code", "LUXEY-HOUSE")
            .order("full_name");

        if (data) {
            setUsers(data);
            if (data.length > 0 && !selectedUser) {
                setSelectedUser(data[0]);
                loadUpline(data[0].id);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();

        // Real-time: refresh user list on any user table change
        const channel = supabase
            .channel("referral-tree-users-rt")
            .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
                loadUsers();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadUpline(userId: string) {
        setTreeLoading(true);
        const { data: treeData } = await supabase
            .from("referral_tree")
            .select("level, ancestor_id")
            .eq("user_id", userId)
            .order("level");

        if (treeData && treeData.length > 0) {
            const ancestorIds = treeData.map(t => t.ancestor_id);
            const { data: ancestorData } = await supabase
                .from("users")
                .select("id, full_name, email, tier, referral_code, created_at")
                .in("id", ancestorIds);

            const ancestorMap = new Map(ancestorData?.map(u => [u.id, u]) || []);

            const entries: UplineEntry[] = treeData
                .map(t => ({
                    level: t.level,
                    ancestor: ancestorMap.get(t.ancestor_id)!,
                }))
                .filter(e => e.ancestor);

            setUpline(entries);
        } else {
            setUpline([]);
        }
        setTreeLoading(false);
    }

    const selectUser = (user: User) => {
        setSelectedUser(user);
        loadUpline(user.id);
    };

    const filteredUsers = users.filter(
        c => c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.referral_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Referral Tree</h2>
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
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Referral Tree</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">7-Level Upline Tree</span>
                </div>
                <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                    Export Tree Data
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
                                {filteredUsers.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No customers found</p>
                                    </div>
                                ) : (
                                    filteredUsers.map((c) => (
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
                                                <span className="text-[9px] font-bold text-gray-300">{c.referral_code}</span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Referral Tree */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedUser && (
                            <>
                                {/* Selected Customer Card */}
                                <div className="bg-black text-white p-8 rounded-sm shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Selected Customer — Level 0</p>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">{selectedUser.full_name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-[#D4AF37]">{selectedUser.referral_code}</p>
                                            <p className="text-[10px] text-gray-400">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Tier: <span className="text-[#D4AF37] capitalize">{selectedUser.tier}</span></span>
                                        <span>Joined: <span className="text-white">{new Date(selectedUser.created_at).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })}</span></span>
                                        <span>Upline: <span className="text-white">{upline.length} levels</span></span>
                                    </div>
                                </div>

                                {/* Upline Tree */}
                                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA] flex justify-between items-center">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest">Referral Upline Tree</h3>
                                        <span className="text-[10px] font-bold text-gray-400">Commission eligible levels highlighted</span>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        {treeLoading ? (
                                            <div className="text-center py-8">
                                                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading tree...</p>
                                            </div>
                                        ) : upline.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-3xl mb-3">🌳</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No upline found — this user was not referred</p>
                                            </div>
                                        ) : (
                                            upline.map((entry) => (
                                                <div
                                                    key={entry.ancestor.id}
                                                    className={`border-l-4 rounded-sm p-5 flex items-center justify-between ${levelColor(entry.level)}`}
                                                    style={{ marginLeft: `${(entry.level - 1) * 12}px` }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-white border border-[#E4E4E4] flex items-center justify-center text-[10px] font-black text-zinc-400 shrink-0">
                                                            {entry.ancestor.full_name.split(" ").map(n => n[0]).join("")}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-0.5">
                                                                <span className="text-sm font-bold uppercase tracking-tight">{entry.ancestor.full_name}</span>
                                                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${tierColor(entry.ancestor.tier)}`}>
                                                                    {entry.ancestor.tier}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                                                <span>{entry.ancestor.email}</span>
                                                                <span>•</span>
                                                                <span>{entry.ancestor.referral_code}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E4E4E4] rounded text-[10px] font-black uppercase tracking-widest">
                                                            Level {entry.level}
                                                        </span>
                                                        <p className="text-[9px] text-gray-400 font-bold mt-1">
                                                            {new Date(entry.ancestor.created_at).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Upline Data Table */}
                                {upline.length > 0 && (
                                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA] flex justify-between items-center">
                                            <h3 className="text-[11px] font-black uppercase tracking-widest">Upline Data — Exportable</h3>
                                            <span className="text-[10px] font-bold text-gray-400">For commission calculations</span>
                                        </div>
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                    <th className="px-6 py-3 text-center">Level</th>
                                                    <th className="px-6 py-3">Referral Code</th>
                                                    <th className="px-6 py-3">Name</th>
                                                    <th className="px-6 py-3">Email</th>
                                                    <th className="px-6 py-3 text-center">Tier</th>
                                                    <th className="px-6 py-3">Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#F5F5F5]">
                                                {upline.map((entry) => (
                                                    <tr key={entry.ancestor.id} className="hover:bg-[#FAFAFA] transition-colors">
                                                        <td className="px-6 py-3 text-center">
                                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-[10px] font-black">
                                                                {entry.level}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-xs font-mono font-bold">{entry.ancestor.referral_code}</td>
                                                        <td className="px-6 py-3 text-sm font-bold uppercase tracking-tight">{entry.ancestor.full_name}</td>
                                                        <td className="px-6 py-3 text-xs text-gray-500">{entry.ancestor.email}</td>
                                                        <td className="px-6 py-3 text-center">
                                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(entry.ancestor.tier)}`}>
                                                                {entry.ancestor.tier}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-xs font-medium text-gray-400">
                                                            {new Date(entry.ancestor.created_at).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
