"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";

interface OrderData {
    id: string;
    po_number: string;
    serial_number: string | null;
    seller_lock_price: number;
    dealer_lock_price: number;
    status: string;
    locked_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    verified_at: string | null;
    paid_at: string | null;
    created_at: string;
    products: { name: string; weight_oz: number; purity: number; mint: string; metal: string; image_url: string | null } | null;
    dealers: { display_name: string; display_city: string | null } | null;
    shipments: { tracking_number: string | null; carrier: string; status: string; shipped_at: string | null } | null;
}

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("purchase_orders")
                .select(`
                    id, po_number, serial_number, seller_lock_price, dealer_lock_price, status,
                    locked_at, shipped_at, delivered_at, verified_at, paid_at, created_at,
                    products(name, weight_oz, purity, mint, metal, image_url),
                    dealers(display_name, display_city),
                    shipments(tracking_number, carrier, status, shipped_at)
                `)
                .eq("id", id)
                .eq("seller_id", DEMO_USER_ID)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setOrder(data as unknown as OrderData);
            }
            setLoading(false);
        }
        load();
    }, [id]);

    const statusLabel = (s: string) => {
        const map: Record<string, string> = {
            locked: "Locked", label_sent: "Label Sent", shipped: "Shipped",
            delivered: "Delivered", dealer_verified: "Verified",
            luxey_paid: "Paid", seller_paid: "In Vault",
        };
        return map[s] || s;
    };

    const fmt = (n: number) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

    if (loading) {
        return (
            <>
                <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                    <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                        <Link href="/dashboard" className="hover:text-black transition-colors">User</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                        <Link href="/orders" className="hover:text-black transition-colors">Orders</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                        <span className="text-black font-extrabold tracking-[0.1em]">Loading…</span>
                    </nav>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            </>
        );
    }

    if (notFound) {
        return (
            <>
                <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                    <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                        <Link href="/dashboard" className="hover:text-black transition-colors">User</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                        <Link href="/orders" className="hover:text-black transition-colors">Orders</Link>
                    </nav>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Order Not Found</p>
                    <Link href="/orders" className="action-btn action-btn-primary">Back to Orders</Link>
                </div>
            </>
        );
    }

    // Build timeline
    const timeline: { date: string; event: string; detail: string; done: boolean }[] = [];
    if (order!.locked_at) timeline.push({ date: new Date(order!.locked_at).toLocaleString("en-US"), event: "Purchased", detail: `Included in ${order!.po_number}.`, done: true });
    if (order!.locked_at) timeline.push({ date: new Date(order!.locked_at).toLocaleString("en-US"), event: "Payment Confirmed", detail: "Lock price confirmed.", done: true });
    if (order!.serial_number) timeline.push({ date: new Date(order!.locked_at || order!.created_at).toLocaleString("en-US"), event: "Allocated", detail: `Serial ${order!.serial_number} assigned.`, done: true });
    if (order!.shipped_at) timeline.push({ date: new Date(order!.shipped_at).toLocaleString("en-US"), event: "Shipped", detail: `${order!.shipments?.carrier || "Carrier"} — ${order!.shipments?.tracking_number || "pending"}.`, done: true });
    if (order!.delivered_at) timeline.push({ date: new Date(order!.delivered_at).toLocaleString("en-US"), event: "Delivered", detail: "Item delivered and verified.", done: true });
    if (order!.paid_at) timeline.push({ date: new Date(order!.paid_at).toLocaleString("en-US"), event: "Stored in Vault", detail: `Secured at ${order!.dealers?.display_name || "Luxey Vault"}.`, done: true });
    if (order!.status === "shipped" && !order!.delivered_at) timeline.push({ date: "—", event: "Estimated Delivery", detail: "Signature required upon delivery.", done: false });

    const isVault = order!.status === "seller_paid";
    const isShipped = order!.status === "shipped" || order!.status === "delivered";

    const product = order!.products;
    const weightDisplay = product ? (product.weight_oz === 1 ? "1 Troy Ounce" : `${product.weight_oz} Troy Ounce${product.weight_oz > 1 ? "s" : ""}`) : "—";
    const metalDisplay = product?.metal ? product.metal.charAt(0).toUpperCase() + product.metal.slice(1) : "—";
    const purityDisplay = product?.purity ? `${product.purity.toFixed(4)} Fine ${metalDisplay}` : "—";

    return (
        <>
            {/* BREADCRUMB */}
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <Link href="/dashboard" className="hover:text-black transition-colors">User</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <Link href="/orders" className="hover:text-black transition-colors">Orders</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">{order!.po_number}</span>
                </nav>
            </div>

            <div className="max-w-5xl mx-auto w-full py-8 px-6">
                {/* Header */}
                <header className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="font-serif text-4xl text-black tracking-tight uppercase leading-none mb-2">
                            {product?.name || "Order"}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            {order!.po_number} · Serial: {order!.serial_number || "—"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {isVault && (
                            <>
                                <button className="action-btn action-btn-primary">Request Shipment</button>
                                <button className="action-btn">Sell</button>
                            </>
                        )}
                        {isShipped && (
                            <button className="action-btn action-btn-primary">Track Package</button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Product Info + Tracking + Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Details */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Product Details</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {[
                                        { label: "Metal", value: metalDisplay },
                                        { label: "Weight", value: weightDisplay },
                                        { label: "Purity", value: purityDisplay },
                                        { label: "Mint", value: product?.mint || "—" },
                                        { label: "Serial Number", value: order!.serial_number || "—" },
                                        { label: "Purchase Order", value: order!.po_number },
                                    ].map(field => (
                                        <div key={field.label}>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">{field.label}</p>
                                            <p className="text-sm font-bold">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shipping / Location */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">
                                    {isShipped ? "Shipping & Tracking" : "Location"}
                                </h3>
                            </div>
                            <div className="p-6">
                                {isShipped && order!.shipments ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                                            <span className="text-2xl">🚚</span>
                                            <div>
                                                <p className="text-xs font-black uppercase">In Transit — {order!.shipments.carrier}</p>
                                                <p className="text-sm font-mono font-bold text-blue-700 mt-0.5">{order!.shipments.tracking_number || "Pending"}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Carrier</p>
                                                <p className="text-sm font-bold">{order!.shipments.carrier}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Tracking</p>
                                                <p className="text-sm font-mono font-bold">{order!.shipments.tracking_number || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Status</p>
                                                <p className="text-sm font-bold capitalize">{order!.shipments.status.replace(/_/g, " ")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-yellow-50/50 border border-yellow-100 rounded-sm">
                                        <span className="text-2xl">🏦</span>
                                        <div>
                                            <p className="text-xs font-black uppercase text-yellow-800">{order!.dealers?.display_name || "Luxey Vault"} — {order!.dealers?.display_city || ""}</p>
                                            <p className="text-[10px] text-yellow-600 font-bold mt-0.5">Secured, insured, and audited storage</p>
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
                                    {timeline.map((event, i) => (
                                        <div key={i} className="relative mb-6 last:mb-0">
                                            <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 ${event.done ? "bg-[#D4AF37] border-[#D4AF37]" : "bg-white border-gray-300"}`} />
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{event.date}</p>
                                            <p className={`text-sm font-black uppercase tracking-tight ${!event.done ? "text-gray-300" : ""}`}>{event.event}</p>
                                            <p className={`text-xs mt-0.5 ${!event.done ? "text-gray-300" : "text-gray-500"}`}>{event.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Value + Status + Actions */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-black text-white p-6 rounded-sm shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Status</p>
                            <span className={`inline-block px-3 py-1.5 text-[10px] font-black uppercase rounded ${isVault ? "bg-yellow-500/20 text-[#D4AF37]" : isShipped ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                                {statusLabel(order!.status)}
                            </span>
                            <div className="mt-6 pt-4 border-t border-zinc-800">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Purchase Date</p>
                                <p className="text-lg font-black">{new Date(order!.created_at).toLocaleDateString("en-US")}</p>
                            </div>
                        </div>

                        {/* Market Value */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Market Valuation</p>
                            <p className="text-3xl font-black tracking-tighter price-green mb-1">{fmt(order!.seller_lock_price)}</p>
                            <p className="text-[10px] font-bold text-gray-400 mb-4">Lock price at time of sale</p>
                            <div className="space-y-3 border-t border-[#F5F5F5] pt-4">
                                <div className="flex justify-between">
                                    <span className="text-[9px] font-black uppercase text-gray-400">Your Lock Price</span>
                                    <span className="text-sm font-bold">{fmt(order!.seller_lock_price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[9px] font-black uppercase text-gray-400">Dealer Lock Price</span>
                                    <span className="text-sm font-bold">{fmt(order!.dealer_lock_price)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Actions</p>
                            <div className="space-y-2">
                                {isVault && (
                                    <>
                                        <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all rounded-sm">
                                            Request Shipment
                                        </button>
                                        <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:bg-gray-50 transition-all rounded-sm">
                                            Sell This Asset
                                        </button>
                                    </>
                                )}
                                <Link
                                    href="/purchase-orders"
                                    className="block text-center w-full py-3 text-[10px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:bg-gray-50 transition-all rounded-sm"
                                >
                                    View Purchase Order
                                </Link>
                                <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors">
                                    Download Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
