export const metadata = { title: "Commissions & Payouts | Luxey© Admin" };

const pendingPayouts = [
    { customer: "Jerrold Gardner", tier: "Gold", period: "Jan 2026", earned: "$4,247.00", status: "Pending Review" },
    { customer: "Sarah Connor", tier: "Gold", period: "Jan 2026", earned: "$3,812.00", status: "Pending Review" },
    { customer: "Marcus Lee", tier: "Silver", period: "Jan 2026", earned: "$1,240.00", status: "Pending Review" },
    { customer: "Elena Rodriguez", tier: "Silver", period: "Jan 2026", earned: "$985.00", status: "Approved" },
    { customer: "David Kim", tier: "Bronze", period: "Jan 2026", earned: "$412.00", status: "Approved" },
];

const completedPayouts = [
    { customer: "Jerrold Gardner", period: "Dec 2025", earned: "$3,920.00", paid: "01/05/2026", method: "Wire Transfer" },
    { customer: "Sarah Connor", period: "Dec 2025", earned: "$3,610.00", paid: "01/05/2026", method: "Wire Transfer" },
    { customer: "Marcus Lee", period: "Dec 2025", earned: "$1,080.00", paid: "01/05/2026", method: "RTP" },
    { customer: "Elena Rodriguez", period: "Dec 2025", earned: "$892.00", paid: "01/06/2026", method: "Wire Transfer" },
    { customer: "David Kim", period: "Dec 2025", earned: "$345.00", paid: "01/06/2026", method: "RTP" },
    { customer: "Ana Torres", period: "Dec 2025", earned: "$210.00", paid: "01/06/2026", method: "Wire Transfer" },
];

export default function PayoutsPage() {
    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Commissions & Payouts</h2>
                <div className="flex gap-4">
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Export Report
                    </button>
                    <button className="px-8 py-2 text-[10px] font-black uppercase bg-black text-white hover:bg-zinc-800 transition-all tracking-widest">
                        Process Batch Payout
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Total Commissions (MTD)", value: "$48,240" },
                        { label: "Pending Payouts", value: "$10,696" },
                        { label: "Paid This Month", value: "$37,544" },
                        { label: "Active Earners", value: "186" },
                    ].map(s => (
                        <div key={s.label} className="admin-stat">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{s.label}</p>
                            <p className="text-4xl font-black tracking-tighter">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Pending Payouts */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden mb-10">
                    <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center bg-[#FAFAFA]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Pending Payouts</h3>
                        <span className="text-[10px] font-bold text-gray-400">{pendingPayouts.length} awaiting action</span>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-6 py-3">
                                    <input type="checkbox" className="luxey-checkbox" style={{ width: 16, height: 16 }} />
                                </th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3 text-center">Tier</th>
                                <th className="px-6 py-3">Period</th>
                                <th className="px-6 py-3 text-right">Earned</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {pendingPayouts.map((p, i) => (
                                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="luxey-checkbox" style={{ width: 16, height: 16 }} />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold uppercase">{p.customer}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${p.tier === "Gold" ? "bg-yellow-50 text-yellow-700" :
                                                p.tier === "Silver" ? "bg-gray-100 text-gray-600" :
                                                    "bg-orange-50 text-orange-700"
                                            }`}>
                                            {p.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{p.period}</td>
                                    <td className="px-6 py-4 text-right text-sm font-black price-green">{p.earned}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`status-pill ${p.status === "Approved" ? "status-complete" : "status-progress"
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex gap-3 justify-end">
                                        <button className="text-[10px] font-bold text-green-600 hover:text-green-800 uppercase tracking-widest">
                                            Approve
                                        </button>
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest underline">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Completed Payouts */}
                <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center bg-[#FAFAFA]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Completed Payouts</h3>
                        <select className="bg-white border border-[#E4E4E4] px-4 py-1 rounded-sm text-xs font-bold uppercase tracking-widest">
                            <option>December 2025</option>
                            <option>November 2025</option>
                            <option>October 2025</option>
                        </select>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Period</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3">Date Paid</th>
                                <th className="px-6 py-3 text-center">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {completedPayouts.map((p, i) => (
                                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold uppercase">{p.customer}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{p.period}</td>
                                    <td className="px-6 py-4 text-right text-sm font-black">{p.earned}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{p.paid}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${p.method === "RTP" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {p.method}
                                        </span>
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
