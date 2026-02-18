export const metadata = { title: "Orders | Luxey© MyAccount" };

const orders = [
    { id: "ORD-88421", product: "1 oz Gold Buffalo BU (2024)", serial: "BUF-2024-AX8821", date: "01/27/2026", status: "In Vault", type: "vault", value: "$2,836.00" },
    { id: "ORD-88420", product: "1 oz Gold Eagle BU (2024)", serial: "EAG-2024-KM7742", date: "01/27/2026", status: "In Vault", type: "vault", value: "$2,839.00" },
    { id: "ORD-88419", product: "1 oz PAMP Lady Fortuna (2023)", serial: "PMP-2023-QR3310", date: "01/27/2026", status: "In Vault", type: "vault", value: "$2,841.50" },
    { id: "ORD-88418", product: "100g Valcambi Gold Bar (2024)", serial: "VCB-2024-TT1293", date: "01/27/2026", status: "In Vault", type: "vault", value: "$9,125.00" },
    { id: "ORD-88300", product: "1 oz Gold Maple Leaf (2023)", serial: "MPL-2023-JF5501", date: "01/19/2026", status: "Shipped", type: "shipped", value: "$2,830.00" },
    { id: "ORD-88205", product: "1 oz Krugerrand (2022)", serial: "KRG-2022-PL9010", date: "01/12/2026", status: "Complete", type: "complete", value: "$2,815.00" },
];

export default function OrdersPage() {
    return (
        <>
            {/* BREADCRUMB BAR */}
            <div className="bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-4">
                <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 items-center gap-2">
                    <span>User</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="text-black font-extrabold tracking-[0.1em]">Orders</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                <header className="mb-8">
                    <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                        Orders
                    </h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Individual product-level orders inside your purchase orders.
                    </p>
                </header>

                {/* SEARCH / FILTER */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search by order ID, product, or serial..." className="w-full pl-12 pr-6 py-4 bg-white border border-[#E4E4E4] rounded-sm focus:outline-none text-sm font-medium transition-all focus:border-black" />
                    </div>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>All Orders</option>
                        <option>Locker Assets</option>
                        <option>Shipped Items</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Serial</th>
                                    <th className="px-6 py-4 text-center">Placed On</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Market Value</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors group">
                                        <td className="px-6 py-5 font-bold text-sm text-black">{order.id}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-black uppercase tracking-tight">{order.product}</td>
                                        <td className="px-6 py-5 text-[10px] font-mono text-gray-400">{order.serial}</td>
                                        <td className="px-6 py-5 text-center text-[11px] font-bold text-gray-400 tabular-nums">{order.date}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`status-pill ${order.type === "vault" ? "status-pill-gold" :
                                                    order.type === "shipped" ? "status-progress" : "status-complete"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-sm price-green">{order.value}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button className="action-btn action-btn-primary">Details</button>
                                                {order.type === "vault" && (
                                                    <button className="action-btn">Sell</button>
                                                )}
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
