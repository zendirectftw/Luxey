"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/* ── Sample customer data ────────────────── */
const customers: Record<string, {
    id: string; name: string; email: string; phone: string; tier: string;
    joined: string; status: string; address: string; totalVolume: string;
    monthlyVolume: string; referralCode: string; referredBy: string;
    directReferrals: number; totalNetwork: number; totalCommissions: string;
    orders: { id: string; date: string; items: number; total: string; status: string }[];
    notes: { date: string; author: string; text: string }[];
}> = {
    "CUS-10001": {
        id: "CUS-10001", name: "Jerrold Gardner", email: "jg@luxey.com", phone: "+1 (555) 234-7890",
        tier: "Gold", joined: "06/15/2024", status: "Active",
        address: "4521 Maple Drive, Austin, TX 78701",
        totalVolume: "$1,247,320", monthlyVolume: "$185,232", referralCode: "JERROLD-GOLD",
        referredBy: "—", directReferrals: 3, totalNetwork: 18, totalCommissions: "$42,680",
        orders: [
            { id: "EPO-32614", date: "01/27/2026", items: 23, total: "$116,247.00", status: "Processing" },
            { id: "EPO-32590", date: "01/20/2026", items: 15, total: "$68,920.00", status: "Complete" },
            { id: "EPO-32540", date: "01/10/2026", items: 8, total: "$42,180.00", status: "Complete" },
            { id: "EPO-32410", date: "12/18/2025", items: 30, total: "$152,340.00", status: "Complete" },
            { id: "EPO-32301", date: "12/02/2025", items: 12, total: "$55,800.00", status: "Complete" },
        ],
        notes: [
            { date: "01/25/2026", author: "Admin", text: "Customer inquired about platinum tier qualification timeline." },
            { date: "01/10/2026", author: "System", text: "Status tier renewed — Gold maintained for February 2026." },
            { date: "12/15/2025", author: "Admin", text: "Verified identity documents. KYC approved." },
        ],
    },
};

const defaultCustomer = customers["CUS-10001"];

const tierColor = (tier: string) => {
    switch (tier) {
        case "Gold": return "bg-yellow-50 text-yellow-700 border-yellow-200";
        case "Silver": return "bg-gray-100 text-gray-600 border-gray-200";
        case "Bronze": return "bg-orange-50 text-orange-700 border-orange-200";
        case "Platinum": return "bg-blue-50 text-blue-600 border-blue-200";
        case "Titanium": return "bg-zinc-100 text-zinc-600 border-zinc-300";
        default: return "bg-gray-50 text-gray-400 border-gray-200";
    }
};

const statusColor = (status: string) => {
    switch (status) {
        case "Active": return "bg-green-50 text-green-700";
        case "Inactive": return "bg-red-50 text-red-600";
        case "New": return "bg-blue-50 text-blue-600";
        case "Suspended": return "bg-orange-50 text-orange-700";
        default: return "bg-gray-50 text-gray-400";
    }
};

const orderStatusColor = (status: string) => {
    switch (status) {
        case "Complete": return "status-complete";
        case "Processing": return "status-progress";
        case "Shipped": return "status-released";
        default: return "bg-gray-100 text-gray-500";
    }
};

export default function CustomerDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const customer = customers[id] || defaultCustomer;

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/customers" className="text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Customer Detail</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customer.id}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Send Email
                    </button>
                    <button className="px-5 py-2 text-[10px] font-black uppercase bg-black text-white hover:bg-zinc-800 transition-all tracking-widest">
                        Edit Customer
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Hero Card */}
                <div className="bg-black text-white p-8 rounded-sm shadow-sm mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-black text-[#D4AF37]">
                                {customer.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight">{customer.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{customer.email} · {customer.phone}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{customer.address}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded border ${tierColor(customer.tier)}`}>
                                {customer.tier} Tier
                            </span>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded ${statusColor(customer.status)}`}>
                                {customer.status}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {[
                            { label: "Member Since", value: customer.joined },
                            { label: "Total Volume", value: customer.totalVolume },
                            { label: "Monthly Volume", value: customer.monthlyVolume },
                            { label: "Direct Referrals", value: String(customer.directReferrals) },
                            { label: "Total Network", value: String(customer.totalNetwork) },
                            { label: "Total Commissions", value: customer.totalCommissions },
                        ].map(stat => (
                            <div key={stat.label} className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-4">
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-lg font-black tracking-tighter">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Account Info + Notes */}
                    <div className="space-y-6">
                        {/* Account Details */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Account Details</h3>
                            </div>
                            <div className="divide-y divide-[#F5F5F5]">
                                {[
                                    { label: "Customer ID", value: customer.id },
                                    { label: "Email", value: customer.email },
                                    { label: "Phone", value: customer.phone },
                                    { label: "Address", value: customer.address },
                                    { label: "Referral Code", value: customer.referralCode },
                                    { label: "Referred By", value: customer.referredBy },
                                ].map(row => (
                                    <div key={row.label} className="flex justify-between items-center px-5 py-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{row.label}</span>
                                        <span className="text-xs font-bold text-right">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { label: "View Referral Tree", href: "/admin/referral-tree", icon: "🌳" },
                                    { label: "View Referral Network", href: "/admin/referral-network", icon: "🔗" },
                                    { label: "View Commission History", href: "/admin/payouts", icon: "💰" },
                                ].map(action => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#FAFAFA] transition-colors group"
                                    >
                                        <span className="text-base">{action.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
                                            {action.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA] flex items-center justify-between">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Notes & Activity</h3>
                                <button className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors">
                                    + Add Note
                                </button>
                            </div>
                            <div className="divide-y divide-[#F5F5F5]">
                                {customer.notes.map((note, i) => (
                                    <div key={i} className="px-5 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black text-gray-400">{note.date}</span>
                                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${note.author === "System" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-600"
                                                }`}>
                                                {note.author}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">{note.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA] flex items-center justify-between">
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest">Order History</h3>
                                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">{customer.orders.length} orders on record</p>
                                </div>
                                <button className="px-4 py-1.5 text-[9px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                                    Export
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <th className="px-5 py-3">PO #</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3 text-center">Items</th>
                                        <th className="px-5 py-3 text-right">Total</th>
                                        <th className="px-5 py-3 text-center">Status</th>
                                        <th className="px-5 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F5F5F5]">
                                    {customer.orders.map(order => (
                                        <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                                            <td className="px-5 py-4 text-sm font-bold">{order.id}</td>
                                            <td className="px-5 py-4 text-xs font-medium text-gray-500">{order.date}</td>
                                            <td className="px-5 py-4 text-center text-xs font-bold">{order.items}</td>
                                            <td className="px-5 py-4 text-right text-sm font-black price-green">{order.total}</td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`status-pill ${orderStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link href={`/admin/orders/${order.id}`} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                                    View
                                                </Link>
                                            </td>
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
