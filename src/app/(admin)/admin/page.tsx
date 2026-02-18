export const metadata = { title: "Admin Dashboard | Luxey© Exchange" };

const stats = [
    { label: "Total Customers", value: "2,847", change: "+124", changeLabel: "this month" },
    { label: "Active Purchase Orders", value: "342", change: "+28", changeLabel: "this week" },
    { label: "Monthly Revenue", value: "$4.2M", change: "+12.3%", changeLabel: "vs last month" },
    { label: "Products Listed", value: "86", change: "+4", changeLabel: "new this week" },
];

const recentOrders = [
    { id: "EPO-32614", customer: "Jerrold Gardner", items: 23, value: "$116,247", date: "01/27/2026", status: "Processing" },
    { id: "EPO-32613", customer: "Sarah Connor", items: 26, value: "$131,410", date: "01/27/2026", status: "Verified" },
    { id: "EPO-32612", customer: "John Smith", items: 12, value: "$48,200", date: "01/26/2026", status: "Shipped" },
    { id: "EPO-32611", customer: "Elena Rodriguez", items: 18, value: "$95,120", date: "01/25/2026", status: "Complete" },
    { id: "EPO-32610", customer: "Michael Thorne", items: 8, value: "$22,840", date: "01/25/2026", status: "Processing" },
];

const recentCustomers = [
    { name: "Marcus Lee", email: "marcus@email.com", tier: "Gold", joined: "01/27/2026", volume: "$185,232" },
    { name: "Ana Torres", email: "ana@email.com", tier: "Silver", joined: "01/26/2026", volume: "$82,100" },
    { name: "David Kim", email: "david@email.com", tier: "Bronze", joined: "01/25/2026", volume: "$31,400" },
];

export default function AdminDashboardPage() {
    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Admin Dashboard</h2>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin User</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat) => (
                        <div key={stat.label} className="admin-stat">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{stat.label}</p>
                            <p className="text-4xl font-black tracking-tighter mb-1">{stat.value}</p>
                            <p className="text-[10px] font-bold text-green-600">
                                {stat.change} <span className="text-gray-400">{stat.changeLabel}</span>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center">
                            <h3 className="text-[11px] font-black uppercase tracking-widest">Recent Purchase Orders</h3>
                            <a href="/admin/orders" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">View All →</a>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-3">PO #</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3 text-center">Items</th>
                                    <th className="px-6 py-3 text-right">Value</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {recentOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold">{o.id}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">{o.customer}</td>
                                        <td className="px-6 py-4 text-center text-xs font-bold">{o.items}</td>
                                        <td className="px-6 py-4 text-right text-sm font-black price-green">{o.value}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`status-pill ${o.status === "Complete" ? "status-complete" :
                                                    o.status === "Processing" ? "status-progress" :
                                                        o.status === "Verified" ? "status-pill-gold" :
                                                            "status-released"
                                                }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* New Customers */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center">
                            <h3 className="text-[11px] font-black uppercase tracking-widest">New Customers</h3>
                            <a href="/admin/customers" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">View All →</a>
                        </div>
                        <div className="divide-y divide-[#F5F5F5]">
                            {recentCustomers.map((c) => (
                                <div key={c.name} className="p-6 hover:bg-[#FAFAFA] transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-black text-xs text-zinc-400">
                                            {c.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase">{c.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{c.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Tier: <span className="text-black">{c.tier}</span></span>
                                        <span className="price-green">{c.volume}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
