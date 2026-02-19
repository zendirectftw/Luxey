"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface OrderData {
    id: string;
    po_number: string;
    seller_lock_price: number;
    status: string;
    label_preference: string;
    created_at: string;
    users: { id: string; full_name: string; email: string } | null;
    dealers: { display_name: string } | null;
}

interface Shipment {
    id: string;
    tracking_number: string | null;
    carrier: string;
    shipped_at: string | null;
    status: string;
}

const statusColor = (status: string) => {
    switch (status) {
        case "seller_paid": case "complete": return "status-complete";
        case "locked": case "processing": case "funds_received": return "status-progress";
        case "shipped": return "status-released";
        case "cancelled": return "bg-red-50 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [order, setOrder] = useState<OrderData | null>(null);
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // Fetch PO with separate queries to avoid join syntax issues
            const { data: poData } = await supabase
                .from("purchase_orders")
                .select("id, po_number, seller_lock_price, status, label_preference, created_at, seller_id, dealer_id")
                .eq("id", id)
                .maybeSingle();

            if (!poData) {
                setLoading(false);
                return;
            }

            // Fetch user separately
            let userData = null;
            if (poData.seller_id) {
                const { data: u } = await supabase
                    .from("users")
                    .select("id, full_name, email")
                    .eq("id", poData.seller_id)
                    .maybeSingle();
                userData = u;
            }

            // Fetch dealer separately
            let dealerData = null;
            if (poData.dealer_id) {
                const { data: d } = await supabase
                    .from("dealers")
                    .select("display_name")
                    .eq("id", poData.dealer_id)
                    .maybeSingle();
                dealerData = d;
            }

            setOrder({
                ...poData,
                users: userData,
                dealers: dealerData,
            });

            // Fetch shipment if exists (maybeSingle won't throw if not found)
            const { data: shipData } = await supabase
                .from("shipments")
                .select("*")
                .eq("purchase_order_id", poData.id)
                .limit(1)
                .maybeSingle();

            if (shipData) setShipment(shipData);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Order Detail</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading order...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!order) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <Link href="/admin/orders" className="text-gray-400 hover:text-black transition-colors mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Order Not Found</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-sm font-bold uppercase tracking-tight mb-2">Order Not Found</p>
                        <Link href="/admin/orders" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                            ← Back to Orders
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Order Detail</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.po_number}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Print Invoice
                    </button>
                    <button className="px-5 py-2 text-[10px] font-black uppercase bg-[#D4AF37] text-black hover:bg-[#c9a432] transition-all tracking-widest">
                        Generate FedEx Label
                    </button>
                    <button className="px-5 py-2 text-[10px] font-black uppercase bg-black text-white hover:bg-zinc-800 transition-all tracking-widest">
                        Mark Shipped
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Top Info Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Order Summary Card */}
                    <div className="bg-black text-white p-6 rounded-sm shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order</p>
                            <span className={`status-pill ${statusColor(order.status)}`}>
                                {order.status.replace(/_/g, " ")}
                            </span>
                        </div>
                        <p className="text-3xl font-black tracking-tighter mb-1">{order.po_number}</p>
                            {new Date(order.created_at).toLocaleDateString()} · Label: {order.label_preference || "—"}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3">
                                <p className="text-[8px] font-black uppercase text-gray-500 mb-0.5">Total Value</p>
                                <p className="text-lg font-black price-green">${Number(order.seller_lock_price).toLocaleString()}</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3">
                                <p className="text-[8px] font-black uppercase text-gray-500 mb-0.5">Label</p>
                                <p className="text-lg font-black capitalize">{order.label_preference}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Customer</p>
                        <p className="text-lg font-black uppercase tracking-tight mb-1">{order.users?.full_name || "—"}</p>
                        <p className="text-xs text-gray-500 mb-3">{order.users?.email || ""}</p>
                        <div className="border-t border-[#F5F5F5] pt-3 mt-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Dealer</p>
                            <p className="text-xs font-bold text-gray-700">{order.dealers?.display_name || "—"}</p>
                        </div>
                        {order.users && (
                            <Link href={`/admin/customers/${order.users.id}`} className="inline-block mt-3 text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors">
                                View Customer Profile →
                            </Link>
                        )}
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Shipping</p>
                        <div className="space-y-3">
                            {[
                                { label: "Carrier", value: shipment?.carrier || "FedEx Priority Overnight" },
                                { label: "Tracking #", value: shipment?.tracking_number || "—" },
                                { label: "Ship Date", value: shipment?.shipped_at ? new Date(shipment.shipped_at).toLocaleDateString() : "—" },
                                { label: "Shipment Status", value: shipment?.status || "Pending" },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{row.label}</span>
                                    <span className="text-xs font-bold capitalize">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        {!shipment?.tracking_number && (
                            <div className="mt-4 pt-4 border-t border-[#F5F5F5]">
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-sm">
                                    <span className="text-lg">📦</span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-yellow-700">FedEx Label Pending</p>
                                        <p className="text-[9px] text-yellow-600">Generate shipping label when ready</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Order Timeline</h3>
                    </div>
                    <div className="p-6">
                        <div className="relative pl-8">
                            <div className="absolute left-3 top-2 bottom-2 w-px bg-[#E4E4E4]" />
                            <div className="relative mb-6">
                                <div className="absolute -left-5 w-4 h-4 rounded-full border-2 bg-[#D4AF37] border-[#D4AF37]" />
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                                <p className="text-sm font-black uppercase tracking-tight">Order Created</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Purchase order {order.po_number} created · Status: {order.status.replace(/_/g, " ")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
