import Link from "next/link";

export const metadata = { title: "Purchase Orders | Luxey© Admin" };

const stats = [
    { label: "Total POs", value: "1,842" },
    { label: "Awaiting Verification", value: "34" },
    { label: "In Transit", value: "12" },
    { label: "Month Intake Value", value: "$2.8M" },
];

const purchaseOrders = [
    { id: "EPO-32614", customer: "Jerrold Gardner", email: "jg@email.com", items: 23, total: "$116,247.00", date: "01/27/2026", status: "Received", verified: true },
    { id: "EPO-32613", customer: "Sarah Connor", email: "sc@email.com", items: 26, total: "$131,410.00", date: "01/27/2026", status: "Verifying", verified: false },
    { id: "EPO-32612", customer: "John Smith", email: "js@email.com", items: 12, total: "$48,200.00", date: "01/26/2026", status: "In Transit", verified: false },
    { id: "EPO-32611", customer: "Elena Rodriguez", email: "er@email.com", items: 18, total: "$95,120.00", date: "01/25/2026", status: "Settled", verified: true },
    { id: "EPO-32610", customer: "Michael Thorne", email: "mt@email.com", items: 8, total: "$22,840.00", date: "01/25/2026", status: "Verifying", verified: false },
    { id: "EPO-32609", customer: "David Kim", email: "dk@email.com", items: 15, total: "$74,560.00", date: "01/24/2026", status: "Settled", verified: true },
    { id: "EPO-32608", customer: "Ana Torres", email: "at@email.com", items: 5, total: "$18,920.00", date: "01/24/2026", status: "Rejected", verified: false },
    { id: "EPO-32607", customer: "Marcus Lee", email: "ml@email.com", items: 20, total: "$102,340.00", date: "01/23/2026", status: "Received", verified: true },
];

const statusStyle = (status: string) => {
    switch (status) {
        case "Settled": return "status-complete";
        case "Received": return "status-released";
        case "Verifying": return "status-progress";
        case "In Transit": return "status-pill-gold";
        case "Rejected": return "bg-red-50 text-red-600";
        default: return "bg-gray-100 text-gray-600";
    }
};

export default function AdminPurchaseOrdersPage() {
    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Purchase Orders</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inbound — Customers selling to Luxey</span>
                </div>
                <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                    Export CSV
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((s) => (
                        <div key={s.label} className="admin-stat text-center">
                            <p className="text-3xl font-black tracking-tighter mb-1">{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input type="text" placeholder="Search by PO#, customer name..." className="w-full pl-12 pr-6 py-3 bg-white border border-[#E4E4E4] rounded-sm text-sm font-medium outline-none focus:border-black transition-all" />
                    </div>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>All Status</option>
                        <option>Verifying</option>
                        <option>In Transit</option>
                        <option>Received</option>
                        <option>Settled</option>
                        <option>Rejected</option>
                    </select>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>All Verification</option>
                        <option>Verified</option>
                        <option>Unverified</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">PO #</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Seller</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Items</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Value</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Submitted</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Verified</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {purchaseOrders.map((po) => (
                                <tr key={po.id} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="p-4 text-sm font-bold">{po.id}</td>
                                    <td className="p-4">
                                        <p className="text-xs font-bold uppercase">{po.customer}</p>
                                        <p className="text-[10px] text-gray-400">{po.email}</p>
                                    </td>
                                    <td className="p-4 text-center text-xs font-bold">{po.items}</td>
                                    <td className="p-4 text-right text-sm font-black price-green">{po.total}</td>
                                    <td className="p-4 text-xs font-medium text-gray-500">{po.date}</td>
                                    <td className="p-4 text-center">
                                        {po.verified ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg>
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`status-pill ${statusStyle(po.status)}`}>
                                            {po.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex gap-3 justify-end">
                                        {!po.verified && po.status !== "Rejected" && (
                                            <button className="text-[10px] font-bold text-green-600 hover:text-green-800 uppercase tracking-widest">
                                                Verify
                                            </button>
                                        )}
                                        <Link href={`/po/${po.id}`} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
