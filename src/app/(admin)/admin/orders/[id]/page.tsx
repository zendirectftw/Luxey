"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/* ── Sample order data ─────────────────────────────── */
const orders: Record<string, {
    id: string; customer: string; email: string; phone: string; date: string;
    status: string; payment: string; total: string; subtotal: string;
    shippingFee: string; platformFee: string; address: string;
    tracking: string; carrier: string; shipDate: string;
    items: { product: string; serial: string; qty: number; weight: string; price: string; status: string }[];
    timeline: { date: string; event: string; detail: string }[];
}> = {
    "EPO-32614": {
        id: "EPO-32614", customer: "Jerrold Gardner", email: "jg@luxey.com", phone: "+1 (555) 234-7890",
        date: "01/27/2026", status: "Processing", payment: "Wire Transfer",
        total: "$116,247.00", subtotal: "$115,412.00", shippingFee: "$185.00", platformFee: "$650.00",
        address: "4521 Maple Drive, Austin, TX 78701",
        tracking: "—", carrier: "FedEx Priority Overnight", shipDate: "—",
        items: [
            { product: "1 oz Gold Buffalo BU (2024)", serial: "BUF-2024-AX8821", qty: 5, weight: "5 oz", price: "$14,180.00", status: "Allocated" },
            { product: "1 oz Gold Eagle BU (2024)", serial: "EAG-2024-KM7742", qty: 5, weight: "5 oz", price: "$14,195.00", status: "Allocated" },
            { product: "100g Valcambi Gold Bar (2024)", serial: "VCB-2024-TT1293", qty: 3, weight: "300g", price: "$27,375.00", status: "Allocated" },
            { product: "1 oz PAMP Lady Fortuna (2023)", serial: "PMP-2023-QR3310", qty: 5, weight: "5 oz", price: "$14,207.50", status: "Pending" },
            { product: "1 kg PAMP Cast Gold Bar", serial: "PMP-KG-2024-AA01", qty: 1, weight: "1 kg", price: "$45,454.50", status: "Pending" },
        ],
        timeline: [
            { date: "01/27/2026 09:14 AM", event: "Order Placed", detail: "Purchase order submitted via web portal." },
            { date: "01/27/2026 09:15 AM", event: "Payment Initiated", detail: "Wire transfer of $116,247.00 initiated." },
            { date: "01/27/2026 11:30 AM", event: "Payment Verified", detail: "Wire cleared — funds received and confirmed." },
            { date: "01/27/2026 02:00 PM", event: "Inventory Allocated", detail: "13 of 19 items allocated from vault inventory." },
        ],
    },
};

const defaultOrder = orders["EPO-32614"];

const statusColor = (status: string) => {
    switch (status) {
        case "Complete": return "status-complete";
        case "Processing": return "status-progress";
        case "Shipped": return "status-released";
        case "Verified": return "bg-yellow-50 text-yellow-700";
        case "Cancelled": return "bg-red-50 text-red-600";
        case "Allocated": return "bg-green-50 text-green-700";
        case "Pending": return "bg-orange-50 text-orange-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const order = orders[id] || defaultOrder;

    const allocatedCount = order.items.filter(i => i.status === "Allocated").length;
    const totalItems = order.items.reduce((s, i) => s + i.qty, 0);

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Order Detail</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.id}</span>
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
                            <span className={`status-pill ${statusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <p className="text-3xl font-black tracking-tighter mb-1">{order.id}</p>
                        <p className="text-sm text-gray-400 mb-4">{order.date} · {order.payment}</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3">
                                <p className="text-[8px] font-black uppercase text-gray-500 mb-0.5">Items</p>
                                <p className="text-lg font-black">{totalItems}</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3">
                                <p className="text-[8px] font-black uppercase text-gray-500 mb-0.5">Allocated</p>
                                <p className="text-lg font-black text-green-400">{allocatedCount}/{order.items.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Customer</p>
                        <p className="text-lg font-black uppercase tracking-tight mb-1">{order.customer}</p>
                        <p className="text-xs text-gray-500 mb-1">{order.email}</p>
                        <p className="text-xs text-gray-500 mb-3">{order.phone}</p>
                        <div className="border-t border-[#F5F5F5] pt-3 mt-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Shipping Address</p>
                            <p className="text-xs font-bold text-gray-700">{order.address}</p>
                        </div>
                        <Link href={`/admin/customers/CUS-10001`} className="inline-block mt-3 text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors">
                            View Customer Profile →
                        </Link>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Shipping</p>
                        <div className="space-y-3">
                            {[
                                { label: "Carrier", value: order.carrier },
                                { label: "Tracking #", value: order.tracking },
                                { label: "Ship Date", value: order.shipDate },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{row.label}</span>
                                    <span className="text-xs font-bold">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#F5F5F5]">
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-sm">
                                <span className="text-lg">📦</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-yellow-700">FedEx Label Pending</p>
                                    <p className="text-[9px] text-yellow-600">Generate shipping label when ready</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden mb-8">
                    <div className="p-5 border-b border-[#E4E4E4] bg-[#FAFAFA]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Line Items</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-5 py-3">Product</th>
                                <th className="px-5 py-3">Serial</th>
                                <th className="px-5 py-3 text-center">Qty</th>
                                <th className="px-5 py-3 text-center">Weight</th>
                                <th className="px-5 py-3 text-right">Price</th>
                                <th className="px-5 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {order.items.map((item, i) => (
                                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="px-5 py-4 text-xs font-bold uppercase tracking-tight">{item.product}</td>
                                    <td className="px-5 py-4 text-[10px] font-mono text-gray-400">{item.serial}</td>
                                    <td className="px-5 py-4 text-center text-xs font-bold">{item.qty}</td>
                                    <td className="px-5 py-4 text-center text-xs font-medium text-gray-500">{item.weight}</td>
                                    <td className="px-5 py-4 text-right text-sm font-black price-green">{item.price}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`status-pill ${statusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Totals */}
                    <div className="border-t border-[#E4E4E4] bg-[#FAFAFA]">
                        <div className="flex flex-col items-end gap-2 px-5 py-4">
                            {[
                                { label: "Subtotal", value: order.subtotal },
                                { label: "Platform Fee", value: order.platformFee },
                                { label: "Shipping (Insured)", value: order.shippingFee },
                            ].map(row => (
                                <div key={row.label} className="flex items-center gap-8">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{row.label}</span>
                                    <span className="text-sm font-bold w-28 text-right">{row.value}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-8 pt-2 border-t border-[#E4E4E4] mt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                                <span className="text-xl font-black price-green w-28 text-right">{order.total}</span>
                            </div>
                        </div>
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
                                    <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 ${i === order.timeline.length - 1
                                            ? "bg-[#D4AF37] border-[#D4AF37]"
                                            : "bg-white border-[#E4E4E4]"
                                        }`} />
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{event.date}</p>
                                    <p className="text-sm font-black uppercase tracking-tight">{event.event}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{event.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
