"use client";

import { useState } from "react";

/* ── Sample referral tree data ────────────────── */
const referralTree = {
    id: "CUS-10042",
    name: "David Kim",
    email: "david@email.com",
    tier: "Bronze",
    joined: "01/15/2026",
    level: 0,
    upline: [
        { level: 1, id: "CUS-10008", name: "Marcus Lee", email: "marcus@email.com", tier: "Silver", joined: "10/2024" },
        { level: 2, id: "CUS-10003", name: "Sarah Connor", email: "sarah@email.com", tier: "Gold", joined: "08/2024" },
        { level: 3, id: "CUS-10001", name: "Jerrold Gardner", email: "jg@luxey.com", tier: "Gold", joined: "06/2024" },
        { level: 4, id: "CUS-10000", name: "Michael Thorne", email: "mt@email.com", tier: "Silver", joined: "03/2024" },
        { level: 5, id: "CUS-09982", name: "Ana Torres", email: "ana@email.com", tier: "Bronze", joined: "01/2024" },
        { level: 6, id: "CUS-09940", name: "Rita Walsh", email: "rita@email.com", tier: "Bronze", joined: "11/2023" },
        { level: 7, id: "CUS-09901", name: "Frank Vega", email: "frank@email.com", tier: "Silver", joined: "08/2023" },
    ],
};

/* ── All customers for lookup ────────────────── */
const allCustomers = [
    { id: "CUS-10042", name: "David Kim", email: "david@email.com", referredBy: "CUS-10008", treeDepth: 7, joined: "01/2026" },
    { id: "CUS-10040", name: "Lisa Chen", email: "lisa@email.com", referredBy: "CUS-10003", treeDepth: 6, joined: "01/2026" },
    { id: "CUS-10038", name: "James Park", email: "james@email.com", referredBy: "CUS-10001", treeDepth: 5, joined: "01/2026" },
    { id: "CUS-10035", name: "Olivia Grant", email: "olivia@email.com", referredBy: "CUS-10008", treeDepth: 7, joined: "12/2025" },
    { id: "CUS-10030", name: "Noah Williams", email: "noah@email.com", referredBy: "CUS-10003", treeDepth: 6, joined: "12/2025" },
    { id: "CUS-10025", name: "Emma Davis", email: "emma@email.com", referredBy: "CUS-10001", treeDepth: 4, joined: "11/2025" },
    { id: "CUS-10020", name: "Liam Brown", email: "liam@email.com", referredBy: "CUS-10000", treeDepth: 3, joined: "10/2025" },
    { id: "CUS-10008", name: "Marcus Lee", email: "marcus@email.com", referredBy: "CUS-10003", treeDepth: 6, joined: "10/2024" },
];

const tierColor = (tier: string) => {
    switch (tier) {
        case "Gold": return "bg-yellow-50 text-yellow-700";
        case "Silver": return "bg-gray-100 text-gray-600";
        case "Bronze": return "bg-orange-50 text-orange-700";
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
        "border-l-cyan-500 bg-cyan-50/30",
    ];
    return colors[level] || colors[0];
};

export default function ReferralTreePage() {
    const [selectedCustomer, setSelectedCustomer] = useState(referralTree);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCustomers = allCustomers.filter(
        c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                        placeholder="Search by name, ID, email..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4E4] rounded-sm text-xs font-medium outline-none focus:border-black transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto divide-y divide-[#F5F5F5]">
                                {filteredCustomers.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCustomer({ ...referralTree, id: c.id, name: c.name, email: c.email })}
                                        className={`w-full text-left p-4 hover:bg-[#FAFAFA] transition-colors ${selectedCustomer.id === c.id ? "bg-[#FAFAFA] border-l-4 border-l-[#D4AF37]" : ""}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-bold uppercase tracking-tight">{c.name}</span>
                                            <span className="text-[9px] font-black text-gray-400">{c.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 font-medium">{c.email}</span>
                                            <span className="text-[9px] font-bold text-gray-300">{c.treeDepth} levels</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Referral Tree */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Selected Customer Card */}
                        <div className="bg-black text-white p-8 rounded-sm shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Selected Customer — Level 0</p>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{selectedCustomer.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-[#D4AF37]">{selectedCustomer.id}</p>
                                    <p className="text-[10px] text-gray-400">{selectedCustomer.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span>Tier: <span className="text-[#D4AF37]">{selectedCustomer.tier}</span></span>
                                <span>Joined: <span className="text-white">{selectedCustomer.joined}</span></span>
                                <span>Upline: <span className="text-white">{selectedCustomer.upline.length} levels</span></span>
                            </div>
                        </div>

                        {/* Upline Tree */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA] flex justify-between items-center">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Referral Upline Tree</h3>
                                <span className="text-[10px] font-bold text-gray-400">Commission eligible levels highlighted</span>
                            </div>

                            {/* Tree visualization */}
                            <div className="p-6 space-y-3">
                                {selectedCustomer.upline.map((person) => (
                                    <div
                                        key={person.id}
                                        className={`border-l-4 rounded-sm p-5 flex items-center justify-between ${levelColor(person.level)}`}
                                        style={{ marginLeft: `${(person.level - 1) * 12}px` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-[#E4E4E4] flex items-center justify-center text-[10px] font-black text-zinc-400 shrink-0">
                                                {person.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-0.5">
                                                    <span className="text-sm font-bold uppercase tracking-tight">{person.name}</span>
                                                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${tierColor(person.tier)}`}>
                                                        {person.tier}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                                    <span>{person.email}</span>
                                                    <span>•</span>
                                                    <span>{person.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E4E4E4] rounded text-[10px] font-black uppercase tracking-widest">
                                                Level {person.level}
                                            </span>
                                            <p className="text-[9px] text-gray-400 font-bold mt-1">{person.joined}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Network Table (flat view) */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#E4E4E4] bg-[#FAFAFA] flex justify-between items-center">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Upline Data — Exportable</h3>
                                <span className="text-[10px] font-bold text-gray-400">For commission calculations</span>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <th className="px-6 py-3 text-center">Level</th>
                                        <th className="px-6 py-3">Customer ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3 text-center">Tier</th>
                                        <th className="px-6 py-3">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F5F5F5]">
                                    {selectedCustomer.upline.map((person) => (
                                        <tr key={person.id} className="hover:bg-[#FAFAFA] transition-colors">
                                            <td className="px-6 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-[10px] font-black">
                                                    {person.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-xs font-bold">{person.id}</td>
                                            <td className="px-6 py-3 text-sm font-bold uppercase tracking-tight">{person.name}</td>
                                            <td className="px-6 py-3 text-xs text-gray-500">{person.email}</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(person.tier)}`}>
                                                    {person.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-xs font-medium text-gray-400">{person.joined}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
