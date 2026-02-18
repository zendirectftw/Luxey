import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Purchase Orders | Luxey© MyAccount" };

const stats = [
    { label: "Placed Orders", value: "180" },
    { label: "Pending Orders", value: "04" },
    { label: "Completed Orders", value: "176" },
    { label: "Cancelled Orders", value: "0", muted: true },
];

const poData = [
    { id: "32614", status: "Check In Progress", items: 23, total: "116,247", date: "01/27/2026", type: "progress", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg" },
    { id: "32613", status: "Check In Progress", items: 26, total: "131,410", date: "01/27/2026", type: "progress", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Buffalo%20Rev.jpg" },
    { id: "32612", status: "Check In Progress", items: 26, total: "131,238", date: "01/27/2026", type: "progress", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Rand%20Refinery%201%20oz%20Gold%20Bar.png" },
    { id: "32611", status: "Check In Progress", items: 26, total: "131,238", date: "01/27/2026", type: "progress", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Valcambi%20100%20gm%20Gold%20Bar.png" },
    { id: "31758", status: "Order Complete", items: 26, total: "121,283", date: "01/19/2026", type: "complete", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg" },
];

export default function PurchaseOrdersPage() {
    return (
        <>
            {/* BREADCRUMB BAR */}
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4 flex justify-between items-center">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <span>User</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">Purchase Orders</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                {/* STAT CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`bg-white border border-[#E4E4E4] p-6 rounded-sm shadow-sm ${stat.muted ? "bg-zinc-50 border-dashed" : ""}`}
                        >
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stat.muted ? "text-gray-300" : "text-gray-400"}`}>
                                {stat.label}
                            </p>
                            <p className={`text-3xl font-black tracking-tighter ${stat.muted ? "text-gray-200" : ""}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* SEARCH / FILTER */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search for a purchase order..." className="w-full pl-12 pr-6 py-4 bg-white border border-[#E4E4E4] rounded-sm focus:outline-none text-sm font-medium transition-all focus:border-black" />
                    </div>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>Show All</option>
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">ID</th>
                                    <th className="pl-16 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Items</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Total Payout</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Placed On</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {poData.map((po) => (
                                    <tr key={po.id} className="hover:bg-[#FAFAFA] transition-colors group">
                                        <td className="px-6 py-5 font-bold text-sm text-black">#{po.id}</td>
                                        <td className="pl-16 pr-6 py-5">
                                            <span className={`status-pill ${po.type === "complete" ? "status-complete" : "status-progress"}`}>
                                                {po.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="relative w-10 h-10 bg-[#F5F5F5] rounded border border-[#E4E4E4] flex items-center justify-center p-1.5 shadow-sm">
                                                <Image src={po.img} alt="Product" width={40} height={40} className="object-contain mix-blend-multiply" />
                                                <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-black text-[#D4AF37] rounded-full flex items-center justify-center text-[9px] font-black border border-[#D4AF37] shadow-sm">
                                                    {po.items}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-sm price-green">${po.total}</td>
                                        <td className="px-6 py-5 text-center text-[11px] font-bold text-gray-400 tabular-nums uppercase">{po.date}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/po/${po.id}`} className="action-btn action-btn-primary">View Order</Link>
                                                <button className="action-btn">Packing Slip</button>
                                                <button className="action-btn">Track Shipment</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
