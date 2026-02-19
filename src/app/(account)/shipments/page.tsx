"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface Shipment {
    id: string;
    tracking_number: string | null;
    carrier: string;
    status: string;
    shipping_tier: string;
    total_value: number;
    created_at: string;
    shipped_at: string | null;
    delivered_at: string | null;
    dealers: { display_name: string } | null;
}

interface EligiblePO {
    id: string;
    po_number: string;
    seller_lock_price: number;
    products: { name: string } | null;
}

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [eligiblePos, setEligiblePos] = useState<EligiblePO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [shipRes, poRes] = await Promise.all([
                supabase
                    .from("shipments")
                    .select("id, tracking_number, carrier, status, shipping_tier, total_value, created_at, shipped_at, delivered_at, dealers(display_name)")
                    .eq("seller_id", DEMO_USER_ID)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("purchase_orders")
                    .select("id, po_number, seller_lock_price, products(name)")
                    .eq("seller_id", DEMO_USER_ID)
                    .in("status", ["locked", "label_sent"])
                    .order("created_at", { ascending: false }),
            ]);

            setShipments((shipRes.data as unknown as Shipment[]) || []);
            setEligiblePos((poRes.data as unknown as EligiblePO[]) || []);
            setLoading(false);
        }
        load();
    }, []);

    const fmt = (n: number) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });
    const statusLabel = (s: string) => {
        const map: Record<string, string> = { label_created: "Label Created", in_transit: "In Transit", delivered: "Delivered" };
        return map[s] || s;
    };
    const statusType = (s: string) => {
        if (s === "delivered") return "complete";
        if (s === "in_transit") return "progress";
        return "pending";
    };
    const tierLabel = (t: string) => t.replaceAll("_", " ").replace(/\b\w/g, l => l.toUpperCase());

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
            <header className="mb-8">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Shipments
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Manage your shipping labels and track deliveries. Max $125,000 per shipment, fully insured.
                </p>
            </header>

            {/* ELIGIBLE PURCHASE ORDERS */}
            {eligiblePos.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Ready to Ship ({eligiblePos.length} POs)
                    </h2>
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                        <div className="divide-y divide-[#F5F5F5]">
                            {eligiblePos.map(po => (
                                <div key={po.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <input type="checkbox" className="w-4 h-4 accent-[#D4AF37]" />
                                        <div>
                                            <p className="text-sm font-bold text-black">{po.po_number}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{po.products?.name || "—"}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black price-green">{fmt(po.seller_lock_price)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#FAFAFA] border-t border-[#E4E4E4] px-6 py-4 flex justify-end">
                            <button className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-sm">
                                Create Shipment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SHIPMENT HISTORY */}
            <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                    Shipment History
                </h2>
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Dealer</th>
                                    <th className="px-6 py-4">Carrier / Tier</th>
                                    <th className="px-6 py-4 text-center">Tracking</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Value</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {shipments.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400 font-bold uppercase">No shipments yet</td></tr>
                                ) : shipments.map(s => (
                                    <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-5 text-[10px] font-mono text-gray-400">{s.id.slice(0, 8)}…</td>
                                        <td className="px-6 py-5 text-sm font-bold text-black">{s.dealers?.display_name || "—"}</td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-bold text-black">{s.carrier}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">{tierLabel(s.shipping_tier)}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            {s.tracking_number ? (
                                                <span className="text-[10px] font-mono font-bold text-blue-600">{s.tracking_number}</span>
                                            ) : (
                                                <span className="text-[10px] text-gray-300 font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`status-pill ${statusType(s.status) === "complete" ? "status-complete" : statusType(s.status) === "progress" ? "status-progress" : "status-pending-pill"}`}>
                                                {statusLabel(s.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-sm price-green">{fmt(s.total_value)}</td>
                                        <td className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 tabular-nums">
                                            {new Date(s.created_at).toLocaleDateString("en-US")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
