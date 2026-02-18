export const metadata = { title: "Customers | Luxey© Admin" };

const customers = [
    { name: "Jerrold Gardner", email: "jg@luxey.com", tier: "Gold", referrals: 12, joined: "06/2024", totalVolume: "$1,247,320", status: "Active" },
    { name: "Sarah Connor", email: "sc@email.com", tier: "Gold", referrals: 8, joined: "08/2024", totalVolume: "$985,400", status: "Active" },
    { name: "Marcus Lee", email: "ml@email.com", tier: "Silver", referrals: 5, joined: "10/2024", totalVolume: "$412,100", status: "Active" },
    { name: "Elena Rodriguez", email: "er@email.com", tier: "Silver", referrals: 3, joined: "11/2024", totalVolume: "$285,230", status: "Active" },
    { name: "David Kim", email: "dk@email.com", tier: "Bronze", referrals: 1, joined: "01/2025", totalVolume: "$68,420", status: "Active" },
    { name: "Ana Torres", email: "at@email.com", tier: "Bronze", referrals: 2, joined: "12/2024", totalVolume: "$92,100", status: "Active" },
    { name: "Michael Thorne", email: "mt@email.com", tier: "Bronze", referrals: 0, joined: "01/2026", totalVolume: "$31,800", status: "Pending" },
    { name: "Rita Walsh", email: "rw@email.com", tier: "None", referrals: 0, joined: "01/2026", totalVolume: "$0", status: "New" },
];

const tierColor = (tier: string) => {
    switch (tier) {
        case "Gold": return "bg-yellow-50 text-yellow-700";
        case "Silver": return "bg-gray-100 text-gray-600";
        case "Bronze": return "bg-orange-50 text-orange-700";
        default: return "bg-gray-50 text-gray-400";
    }
};

export default function CustomersPage() {
    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">All Customers</h2>
                <div className="flex gap-4">
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Export CSV
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Customers", value: "2,847" },
                        { label: "Gold Tier", value: "124" },
                        { label: "Silver Tier", value: "486" },
                        { label: "Bronze / New", value: "2,237" },
                    ].map(s => (
                        <div key={s.label} className="admin-stat text-center">
                            <p className="text-3xl font-black tracking-tighter mb-1">{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input type="text" placeholder="Search customers by name or email..." className="w-full pl-12 pr-6 py-3 bg-white border border-[#E4E4E4] rounded-sm text-sm font-medium outline-none focus:border-black transition-all" />
                    </div>
                    <select className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest">
                        <option>All Tiers</option>
                        <option>Gold</option>
                        <option>Silver</option>
                        <option>Bronze</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Tier</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Referrals</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total Volume</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((c) => (
                                <tr key={c.email} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 shrink-0">
                                                {c.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-tight">{c.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${tierColor(c.tier)}`}>
                                            {c.tier}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-xs font-bold">{c.referrals}</td>
                                    <td className="p-4 text-xs font-medium text-gray-500">{c.joined}</td>
                                    <td className="p-4 text-right text-sm font-black price-green">{c.totalVolume}</td>
                                    <td className="p-4 text-center">
                                        <span className={`status-pill ${c.status === "Active" ? "status-complete" :
                                                c.status === "Pending" ? "status-progress" :
                                                    "bg-blue-50 text-blue-700"
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                            View
                                        </button>
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
