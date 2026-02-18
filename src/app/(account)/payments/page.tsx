export const metadata = { title: "Payments | Luxey© MyAccount" };

const payments = [
    { id: "PAY-112842", date: "01/27/2026", amount: "$57,335.50", status: "Pending", type: "pending", desc: "PO #32614 — 23 items verified", account: "Chase ••4821", rtp: true },
    { id: "PAY-112700", date: "01/19/2026", amount: "$121,283.00", status: "Complete", type: "complete", desc: "PO #31758 — 26 items verified", account: "Chase ••4821", rtp: true },
    { id: "PAY-112550", date: "01/15/2026", amount: "$5,069.60", status: "Complete", type: "complete", desc: "Commission Payout — January 2026", account: "Chase ••4821", rtp: false },
    { id: "PAY-112200", date: "01/05/2026", amount: "$48,200.00", status: "Complete", type: "complete", desc: "PO #31600 — 12 items verified", account: "Chase ••4821", rtp: true },
    { id: "PAY-111800", date: "12/28/2025", amount: "$95,120.00", status: "Complete", type: "complete", desc: "PO #31450 — 18 items verified", account: "Chase ••4821", rtp: true },
    { id: "PAY-111600", date: "12/15/2025", amount: "$4,210.00", status: "Complete", type: "complete", desc: "Commission Payout — December 2025", account: "Chase ••4821", rtp: false },
];

export default function PaymentsPage() {
    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            <header className="mb-8">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Payments
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    All payouts from verified purchase orders and commissions. RTP payments arrive in seconds.
                </p>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="stat-card">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Total Payments</p>
                    <p className="text-4xl font-black tracking-tighter">06</p>
                </div>
                <div className="stat-card border-l-4 border-l-green-500">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Total Dollar Payments</p>
                    <p className="text-4xl font-black tracking-tighter price-green">$331,218.10</p>
                </div>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-center">Account</th>
                                <th className="px-6 py-4 text-right">Payment ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {payments.map((p) => (
                                <tr key={p.id} className="payment-row transition-all hover:bg-[#FAFAFA]">
                                    <td className="px-6 py-5 text-[11px] font-bold text-gray-400 tabular-nums uppercase">{p.date}</td>
                                    <td className="px-6 py-5 text-right font-black text-sm price-green">{p.amount}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`status-pill ${p.type === "complete" ? "status-complete" : "status-pending-pill"}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-black">{p.desc}</td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xs font-bold text-gray-500">{p.account}</span>
                                            {p.rtp && (
                                                <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-0.5 rounded border border-green-100 uppercase tracking-wider">
                                                    ⚡ RTP
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right text-[10px] font-mono text-gray-400">{p.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
