"use client";

import { useState } from "react";

/* ── Sample downstream referral data ────────────────── */
const networkData: Record<string, { id: string; name: string; email: string; tier: string; joined: string; totalReferrals: number; network: Record<string, { id: string; name: string; email: string; status: string; volume: Record<string, string>; joined: string }[]> }> = {
    "CUS-10001": {
        id: "CUS-10001",
        name: "Jerrold Gardner",
        email: "jg@luxey.com",
        tier: "Gold",
        joined: "06/2024",
        totalReferrals: 18,
        network: {
            "1": [
                { id: "CUS-10003", name: "Sarah Connor", email: "sarah@email.com", status: "Active", volume: { "Jan 2026": "$42,180", "Dec 2025": "$38,400", "Nov 2025": "$35,200" }, joined: "08/2024" },
                { id: "CUS-10005", name: "James Park", email: "james@email.com", status: "Active", volume: { "Jan 2026": "$28,600", "Dec 2025": "$25,100", "Nov 2025": "$22,400" }, joined: "09/2024" },
                { id: "CUS-10012", name: "Emma Davis", email: "emma@email.com", status: "Inactive", volume: { "Jan 2026": "$0", "Dec 2025": "$8,200", "Nov 2025": "$12,600" }, joined: "11/2024" },
            ],
            "2": [
                { id: "CUS-10008", name: "Marcus Lee", email: "marcus@email.com", status: "Active", volume: { "Jan 2026": "$31,440", "Dec 2025": "$28,900", "Nov 2025": "$26,100" }, joined: "10/2024" },
                { id: "CUS-10010", name: "Lisa Chen", email: "lisa@email.com", status: "Active", volume: { "Jan 2026": "$18,750", "Dec 2025": "$15,300", "Nov 2025": "$14,900" }, joined: "11/2024" },
                { id: "CUS-10015", name: "Noah Williams", email: "noah@email.com", status: "Active", volume: { "Jan 2026": "$12,200", "Dec 2025": "$10,600", "Nov 2025": "$9,800" }, joined: "12/2024" },
            ],
            "3": [
                { id: "CUS-10042", name: "David Kim", email: "david@email.com", status: "Active", volume: { "Jan 2026": "$22,840", "Dec 2025": "$19,400", "Nov 2025": "$16,800" }, joined: "01/2026" },
                { id: "CUS-10035", name: "Olivia Grant", email: "olivia@email.com", status: "Active", volume: { "Jan 2026": "$14,300", "Dec 2025": "$11,200", "Nov 2025": "$8,600" }, joined: "12/2025" },
            ],
            "4": [
                { id: "CUS-10050", name: "Ryan Carter", email: "ryan@email.com", status: "Active", volume: { "Jan 2026": "$8,400", "Dec 2025": "$6,200", "Nov 2025": "$5,100" }, joined: "01/2026" },
                { id: "CUS-10048", name: "Maya Patel", email: "maya@email.com", status: "Active", volume: { "Jan 2026": "$6,900", "Dec 2025": "$5,800", "Nov 2025": "$4,200" }, joined: "01/2026" },
            ],
            "5": [
                { id: "CUS-10055", name: "Ethan Moore", email: "ethan@email.com", status: "New", volume: { "Jan 2026": "$3,200", "Dec 2025": "$0", "Nov 2025": "$0" }, joined: "01/2026" },
            ],
            "6": [
                { id: "CUS-10060", name: "Sophia Yang", email: "sophia@email.com", status: "New", volume: { "Jan 2026": "$1,800", "Dec 2025": "$0", "Nov 2025": "$0" }, joined: "01/2026" },
            ],
            "7": [
                { id: "CUS-10065", name: "Lucas Rivera", email: "lucas@email.com", status: "New", volume: { "Jan 2026": "$950", "Dec 2025": "$0", "Nov 2025": "$0" }, joined: "01/2026" },
            ],
        },
    },
};

const allCustomers = [
    { id: "CUS-10001", name: "Jerrold Gardner", email: "jg@luxey.com", directReferrals: 3, totalNetwork: 18 },
    { id: "CUS-10003", name: "Sarah Connor", email: "sarah@email.com", directReferrals: 3, totalNetwork: 8 },
    { id: "CUS-10008", name: "Marcus Lee", email: "marcus@email.com", directReferrals: 2, totalNetwork: 5 },
    { id: "CUS-10005", name: "James Park", email: "james@email.com", directReferrals: 1, totalNetwork: 2 },
    { id: "CUS-10042", name: "David Kim", email: "david@email.com", directReferrals: 2, totalNetwork: 4 },
    { id: "CUS-10035", name: "Olivia Grant", email: "olivia@email.com", directReferrals: 0, totalNetwork: 0 },
];

const months = ["Jan 2026", "Dec 2025", "Nov 2025", "Oct 2025", "Sep 2025"];

const tierColor = (tier: string) => {
    switch (tier) {
        case "Gold": return "bg-yellow-50 text-yellow-700";
        case "Silver": return "bg-gray-100 text-gray-600";
        case "Bronze": return "bg-orange-50 text-orange-700";
        default: return "bg-gray-50 text-gray-400";
    }
};

const statusColor = (status: string) => {
    switch (status) {
        case "Active": return "bg-green-50 text-green-700";
        case "Inactive": return "bg-red-50 text-red-600";
        case "New": return "bg-blue-50 text-blue-600";
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

/* Commission rate per level (% of fees generated) */
const commissionRate: Record<number, number> = { 1: 15, 2: 10, 3: 5, 4: 3, 5: 2, 6: 0, 7: 0 };

const calcCommission = (volume: string, level: number): number => {
    const vol = parseFloat(volume.replace(/[$,]/g, ""));
    return vol * (commissionRate[level] || 0) / 100;
};

export default function ReferralNetworkPage() {
    const [selectedId, setSelectedId] = useState("CUS-10001");
    const [selectedMonth, setSelectedMonth] = useState("Jan 2026");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

    const customer = networkData[selectedId] || networkData["CUS-10001"];

    const filteredCustomers = allCustomers.filter(
        c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalNetworkVolume = Object.values(customer.network).flat().reduce((sum, person) => {
        const vol = person.volume[selectedMonth] || "$0";
        return sum + parseFloat(vol.replace(/[$,]/g, ""));
    }, 0);

    const levelSummaries = Object.entries(customer.network).map(([level, people]) => {
        const levelVol = people.reduce((sum, p) => {
            const vol = p.volume[selectedMonth] || "$0";
            return sum + parseFloat(vol.replace(/[$,]/g, ""));
        }, 0);
        const activeCount = people.filter(p => p.status === "Active").length;
        return { level: parseInt(level), count: people.length, active: activeCount, volume: levelVol };
    });

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Referral Network</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Downstream — Referrals by Level</span>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-white border border-[#E4E4E4] px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest"
                    >
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Export CSV
                    </button>
                </div>
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
                                        onClick={() => setSelectedId(c.id)}
                                        className={`w-full text-left p-4 hover:bg-[#FAFAFA] transition-colors ${selectedId === c.id ? "bg-[#FAFAFA] border-l-4 border-l-[#D4AF37]" : ""}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-bold uppercase tracking-tight">{c.name}</span>
                                            <span className="text-[9px] font-black text-gray-400">{c.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 font-medium">{c.email}</span>
                                            <span className="text-[9px] font-bold text-gray-300">{c.directReferrals} direct · {c.totalNetwork} total</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Network View */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Hero Card */}
                        <div className="bg-black text-white p-8 rounded-sm shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Network Owner</p>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{customer.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-[#D4AF37]">{customer.id}</p>
                                    <p className="text-[10px] text-gray-400">{customer.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span>Tier: <span className="text-[#D4AF37]">{customer.tier}</span></span>
                                <span>Total Referrals: <span className="text-white">{customer.totalReferrals}</span></span>
                                <span>{selectedMonth} Volume: <span className="text-white">${totalNetworkVolume.toLocaleString()}</span></span>
                            </div>
                        </div>

                        {/* Level Summary Cards */}
                        <div className="grid grid-cols-8 gap-2">
                            <button
                                onClick={() => setExpandedLevel(null)}
                                className={`bg-white border rounded-sm p-3 text-center transition-all hover:shadow-md ${expandedLevel === null ? "border-black shadow-md" : "border-[#E4E4E4]"}`}
                            >
                                <div className="w-7 h-7 mx-auto rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center mb-2">
                                    ✦
                                </div>
                                <p className="text-lg font-black tracking-tight">{customer.totalReferrals}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">ALL</p>
                                <p className="text-[9px] font-bold text-green-600 mt-1">${totalNetworkVolume.toLocaleString()}</p>
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
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Referrals</p>
                                    <p className="text-[9px] font-bold text-green-600 mt-1">${ls.volume.toLocaleString()}</p>
                                </button>
                            ))}
                        </div>

                        {/* Level Detail Tables */}
                        {Object.entries(customer.network).map(([level, people]) => {
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
                                                    Level {level} — {lvl === 1 ? "Direct Referrals" : `${getOrdinal(lvl)} Level Referrals`}
                                                </h3>
                                                <p className="text-[9px] text-gray-400 font-bold">{people.length} {people.length === 1 ? "customer" : "customers"}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400">{selectedMonth}</span>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                <th className="px-5 py-3">Customer</th>
                                                <th className="px-5 py-3">ID</th>
                                                <th className="px-5 py-3">Email</th>
                                                <th className="px-5 py-3 text-center">Status</th>
                                                <th className="px-5 py-3 text-right">Volume</th>
                                                <th className="px-5 py-3 text-right">Commission ({commissionRate[lvl] || 0}%)</th>
                                                <th className="px-5 py-3">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F5F5F5]">
                                            {people.map((person) => {
                                                const comm = calcCommission(person.volume[selectedMonth] || "$0", lvl);
                                                return (
                                                    <tr key={person.id} className="hover:bg-[#FAFAFA] transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-[#E4E4E4] flex items-center justify-center text-[9px] font-black text-zinc-400 shrink-0">
                                                                    {person.name.split(" ").map(n => n[0]).join("")}
                                                                </div>
                                                                <span className="text-sm font-bold uppercase tracking-tight">{person.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3 text-xs font-bold">{person.id}</td>
                                                        <td className="px-5 py-3 text-xs text-gray-500">{person.email}</td>
                                                        <td className="px-5 py-3 text-center">
                                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${statusColor(person.status)}`}>
                                                                {person.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-right text-sm font-black price-green">
                                                            {person.volume[selectedMonth] || "$0"}
                                                        </td>
                                                        <td className="px-5 py-3 text-right text-sm font-black text-[#D4AF37]">
                                                            ${comm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-5 py-3 text-xs font-medium text-gray-400">{person.joined}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-black bg-[#FAFAFA]">
                                                <td colSpan={4} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest">Level {level} Totals</td>
                                                <td className="px-5 py-3 text-right text-sm font-black">
                                                    ${people.reduce((s, p) => s + parseFloat((p.volume[selectedMonth] || "$0").replace(/[$,]/g, "")), 0).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3 text-right text-sm font-black text-[#D4AF37]">
                                                    ${people.reduce((s, p) => s + calcCommission(p.volume[selectedMonth] || "$0", lvl), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-5 py-3"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

function getOrdinal(n: number): string {
    const ordinals: Record<number, string> = { 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th", 7: "7th" };
    return ordinals[n] || `${n}th`;
}
