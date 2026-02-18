"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/* ── Sample order data ─────────────────────────── */
const orders: Record<string, {
    id: string; product: string; serial: string; date: string; value: string;
    status: string; weight: string; purity: string; mint: string;
    purchasePrice: string; currentPrice: string; gain: string; gainPct: string;
    poId: string; location: string;
    tracking: { carrier: string; number: string; eta: string };
    timeline: { date: string; event: string; detail: string; done: boolean }[];
}> = {
    "ORD-88421": {
        id: "ORD-88421", product: "1 oz Gold Buffalo BU (2024)", serial: "BUF-2024-AX8821",
        date: "01/27/2026", value: "$2,836.00", status: "In Vault",
        weight: "1 Troy Ounce", purity: "0.9999 Fine Gold", mint: "United States Mint",
        purchasePrice: "$2,780.00", currentPrice: "$2,836.00", gain: "+$56.00", gainPct: "+2.01%",
        poId: "EPO-32614", location: "Luxey© Vault — Austin, TX",
        tracking: { carrier: "—", number: "—", eta: "—" },
        timeline: [
            { date: "01/27/2026 09:14 AM", event: "Purchased", detail: "Included in PO EPO-32614.", done: true },
            { date: "01/27/2026 11:30 AM", event: "Payment Confirmed", detail: "Wire transfer verified.", done: true },
            { date: "01/27/2026 02:00 PM", event: "Allocated", detail: "Serial BUF-2024-AX8821 assigned.", done: true },
            { date: "01/27/2026 04:30 PM", event: "Stored in Vault", detail: "Secured at Luxey© Vault, Austin, TX.", done: true },
        ],
    },
    "ORD-88300": {
        id: "ORD-88300", product: "1 oz Gold Maple Leaf (2023)", serial: "MPL-2023-JF5501",
        date: "01/19/2026", value: "$2,830.00", status: "Shipped",
        weight: "1 Troy Ounce", purity: "0.9999 Fine Gold", mint: "Royal Canadian Mint",
        purchasePrice: "$2,810.00", currentPrice: "$2,830.00", gain: "+$20.00", gainPct: "+0.71%",
        poId: "EPO-32590", location: "In Transit",
        tracking: { carrier: "FedEx Priority Overnight", number: "7489 2847 3920", eta: "01/21/2026" },
        timeline: [
            { date: "01/19/2026 10:00 AM", event: "Purchased", detail: "Included in PO EPO-32590.", done: true },
            { date: "01/19/2026 12:00 PM", event: "Payment Confirmed", detail: "Wire transfer verified.", done: true },
            { date: "01/19/2026 03:00 PM", event: "Allocated", detail: "Serial MPL-2023-JF5501 assigned.", done: true },
            { date: "01/20/2026 09:00 AM", event: "Shipped", detail: "FedEx Priority Overnight — tracking 7489 2847 3920.", done: true },
            { date: "01/21/2026", event: "Estimated Delivery", detail: "Signature required upon delivery.", done: false },
        ],
    },
};

const defaultOrder = orders["ORD-88421"];

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const order = orders[id] || defaultOrder;

    return (
        <>
            {/* BREADCRUMB */}
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <Link href="/dashboard" className="hover:text-black transition-colors">User</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <Link href="/orders" className="hover:text-black transition-colors">Orders</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">{order.id}</span>
                </nav>
            </div>

            <div className="max-w-5xl mx-auto w-full py-8 px-6">
                {/* Header */}
                <header className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="font-serif text-4xl text-black tracking-tight uppercase leading-none mb-2">
                            {order.product}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            {order.id} · Serial: {order.serial}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {order.status === "In Vault" && (
                            <>
                                <button className="action-btn action-btn-primary">Request Shipment</button>
                                <button className="action-btn">Sell</button>
                            </>
                        )}
                        {order.status === "Shipped" && (
                            <button className="action-btn action-btn-primary">Track Package</button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Product Info + Tracking */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Details Card */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Product Details</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {[
                                        { label: "Metal", value: "Gold" },
                                        { label: "Weight", value: order.weight },
                                        { label: "Purity", value: order.purity },
                                        { label: "Mint", value: order.mint },
                                        { label: "Serial Number", value: order.serial },
                                        { label: "Purchase Order", value: order.poId },
                                    ].map(field => (
                                        <div key={field.label}>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">{field.label}</p>
                                            <p className="text-sm font-bold">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shipping / Tracking */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">
                                    {order.status === "Shipped" ? "Shipping & Tracking" : "Location"}
                                </h3>
                            </div>
                            <div className="p-6">
                                {order.status === "Shipped" ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                                            <span className="text-2xl">🚚</span>
                                            <div>
                                                <p className="text-xs font-black uppercase">In Transit — {order.tracking.carrier}</p>
                                                <p className="text-sm font-mono font-bold text-blue-700 mt-0.5">{order.tracking.number}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Carrier</p>
                                                <p className="text-sm font-bold">{order.tracking.carrier}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Tracking</p>
                                                <p className="text-sm font-mono font-bold">{order.tracking.number}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Est. Delivery</p>
                                                <p className="text-sm font-bold">{order.tracking.eta}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-yellow-50/50 border border-yellow-100 rounded-sm">
                                        <span className="text-2xl">🏦</span>
                                        <div>
                                            <p className="text-xs font-black uppercase text-yellow-800">{order.location}</p>
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
                                    {order.timeline.map((event, i) => (
                                        <div key={i} className="relative mb-6 last:mb-0">
                                            <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 ${event.done
                                                    ? "bg-[#D4AF37] border-[#D4AF37]"
                                                    : "bg-white border-gray-300"
                                                }`} />
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{event.date}</p>
                                            <p className={`text-sm font-black uppercase tracking-tight ${!event.done ? "text-gray-300" : ""}`}>
                                                {event.event}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${!event.done ? "text-gray-300" : "text-gray-500"}`}>{event.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Value + Status */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-black text-white p-6 rounded-sm shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Status</p>
                            <span className={`inline-block px-3 py-1.5 text-[10px] font-black uppercase rounded ${order.status === "In Vault" ? "bg-yellow-500/20 text-[#D4AF37]" :
                                    order.status === "Shipped" ? "bg-blue-500/20 text-blue-400" :
                                        "bg-green-500/20 text-green-400"
                                }`}>
                                {order.status}
                            </span>
                            <div className="mt-6 pt-4 border-t border-zinc-800">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Purchase Date</p>
                                <p className="text-lg font-black">{order.date}</p>
                            </div>
                        </div>

                        {/* Market Value */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Market Valuation</p>
                            <p className="text-3xl font-black tracking-tighter price-green mb-1">{order.currentPrice}</p>
                            <p className="text-[10px] font-bold text-gray-400 mb-4">Current market value</p>

                            <div className="space-y-3 border-t border-[#F5F5F5] pt-4">
                                <div className="flex justify-between">
                                    <span className="text-[9px] font-black uppercase text-gray-400">Purchase Price</span>
                                    <span className="text-sm font-bold">{order.purchasePrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[9px] font-black uppercase text-gray-400">Current Value</span>
                                    <span className="text-sm font-bold price-green">{order.currentPrice}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-[#F5F5F5]">
                                    <span className="text-[9px] font-black uppercase text-gray-400">Unrealized Gain</span>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-green-600">{order.gain}</p>
                                        <p className="text-[10px] font-bold text-green-500">{order.gainPct}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Actions</p>
                            <div className="space-y-2">
                                {order.status === "In Vault" && (
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
                                    href={`/purchase-orders`}
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
