"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CustomerData {
    id: string;
    full_name: string;
    email: string;
    tier: string;
    kyc_status: string;
    referral_code: string;
    referred_by: string | null;
    created_at: string;
}

interface PurchaseOrder {
    id: string;
    po_number: string;
    total_value: number;
    status: string;
    created_at: string;
}

const tierColor = (tier: string) => {
    switch (tier) {
        case "obsidian": return "bg-zinc-900 text-white border-zinc-700";
        case "diamond": return "bg-cyan-50 text-cyan-700 border-cyan-200";
        case "titanium": return "bg-zinc-200 text-zinc-700 border-zinc-300";
        case "platinum": return "bg-blue-50 text-blue-600 border-blue-200";
        case "gold": return "bg-yellow-50 text-yellow-700 border-yellow-200";
        case "silver": return "bg-gray-100 text-gray-600 border-gray-200";
        case "bronze": return "bg-orange-50 text-orange-700 border-orange-200";
        default: return "bg-gray-50 text-gray-400 border-gray-200";
    }
};

const kycColor = (status: string) => {
    switch (status) {
        case "approved": return "bg-green-50 text-green-700";
        case "pending": return "bg-yellow-50 text-yellow-700";
        case "rejected": return "bg-red-50 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

const orderStatusColor = (status: string) => {
    switch (status) {
        case "seller_paid": case "complete": return "status-complete";
        case "locked": case "processing": return "status-progress";
        case "shipped": return "status-released";
        case "cancelled": return "bg-red-50 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

export default function CustomerDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [referralCount, setReferralCount] = useState(0);
    const [referrerName, setReferrerName] = useState<string>("—");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // Fetch customer
            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", id)
                .single();

            if (!userData) {
                setLoading(false);
                return;
            }
            setCustomer(userData);

            // Fetch POs for this user
            const { data: poData } = await supabase
                .from("purchase_orders")
                .select("id, po_number, total_value, status, created_at")
                .eq("seller_id", id)
                .order("created_at", { ascending: false });

            if (poData) setOrders(poData);

            // Fetch direct referral count
            const { count } = await supabase
                .from("referral_tree")
                .select("*", { count: "exact", head: true })
                .eq("ancestor_id", id)
                .eq("level", 1);

            setReferralCount(count || 0);

            // Fetch referrer name
            if (userData.referred_by) {
                const { data: ref } = await supabase
                    .from("users")
                    .select("full_name")
                    .eq("id", userData.referred_by)
                    .single();
                if (ref) setReferrerName(ref.full_name);
            }

            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Customer Detail</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading customer...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!customer) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <Link href="/admin/customers" className="text-gray-400 hover:text-black transition-colors mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Customer Not Found</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-sm font-bold uppercase tracking-tight mb-2">Customer Not Found</p>
                        <Link href="/admin/customers" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                            ← Back to Customers
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const totalVolume = orders.reduce((sum, o) => sum + Number(o.total_value || 0), 0);

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/customers" className="text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Customer Detail</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customer.id.slice(0, 8)}</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Hero Card */}
                <div className="bg-black text-white p-8 rounded-sm shadow-sm mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-black text-[#D4AF37]">
                                {customer.full_name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight">{customer.full_name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{customer.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded border ${tierColor(customer.tier)}`}>
                                {customer.tier} Tier
                            </span>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded ${kycColor(customer.kyc_status)}`}>
                                KYC: {customer.kyc_status}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: "Member Since", value: new Date(customer.created_at).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }) },
                            { label: "Total Volume", value: `$${totalVolume.toLocaleString()}` },
                            { label: "Total Orders", value: String(orders.length) },
                            { label: "Direct Referrals", value: String(referralCount) },
                            { label: "Referral Code", value: customer.referral_code },
                        ].map(stat => (
                            <div key={stat.label} className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-4">
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-lg font-black tracking-tighter">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Account Info */}
                    <div className="space-y-6">
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Account Details</h3>
                            </div>
                            <div className="divide-y divide-[#F5F5F5]">
                                {[
                                    { label: "Customer ID", value: customer.id.slice(0, 8) + "..." },
                                    { label: "Email", value: customer.email },
                                    { label: "Referral Code", value: customer.referral_code },
                                    { label: "Referred By", value: referrerName },
                                    { label: "KYC Status", value: customer.kyc_status },
                                ].map(row => (
                                    <div key={row.label} className="flex justify-between items-center px-5 py-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{row.label}</span>
                                        <span className="text-xs font-bold text-right capitalize">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { label: "View Referral Tree", href: "/admin/referral-tree", icon: "🌳" },
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
                    </div>

                    {/* Right: Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA] flex items-center justify-between">
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest">Order History</h3>
                                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">{orders.length} orders on record</p>
                                </div>
                            </div>
                            {orders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-3xl mb-3">📋</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No orders yet</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                            <th className="px-5 py-3">PO #</th>
                                            <th className="px-5 py-3">Date</th>
                                            <th className="px-5 py-3 text-right">Total</th>
                                            <th className="px-5 py-3 text-center">Status</th>
                                            <th className="px-5 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F5F5F5]">
                                        {orders.map(order => (
                                            <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                                                <td className="px-5 py-4 text-sm font-bold">{order.po_number}</td>
                                                <td className="px-5 py-4 text-xs font-medium text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm font-black price-green">
                                                    ${Number(order.total_value).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`status-pill ${orderStatusColor(order.status)}`}>
                                                        {order.status.replace(/_/g, " ")}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
