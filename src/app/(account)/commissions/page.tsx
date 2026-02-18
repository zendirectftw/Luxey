export const metadata = { title: "Commissions | Luxey© MyAccount" };

const tiers = [
    { name: "1st Level Network", sub: "Direct Referrals", referrals: "03", fees: "$5,232.00", payout: "15%", earnings: "$784.80" },
    { name: "2nd Level Network", sub: "Indirect Referrals", referrals: "07", fees: "$15,232.00", payout: "10%", earnings: "$1,523.20" },
    { name: "3rd Level Network", sub: "Extended Network", referrals: "07", fees: "$55,232.00", payout: "5%", earnings: "$2,761.60" },
];

const priorMonths = [
    { month: "December 2025", amount: "+$4,210.00" },
    { month: "November 2025", amount: "+$3,850.40" },
];

export default function CommissionsPage() {
    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="mb-10">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-4 uppercase leading-none">
                    Commission Summary
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                    LUXEY PAYS UP TO 35% OF PLATFORM FEES GENERATED FROM YOUR REFERRAL NETWORK PAID MONTHLY.{" "}
                    (<a href="#" className="underline hover:text-black transition-colors">learn more</a>)
                </p>
            </header>

            {/* CURRENT MONTH CARD */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm mb-12">
                {/* Month Header */}
                <div className="p-8 border-b border-[#F5F5F5] bg-[#FAFAFA] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="font-serif text-3xl uppercase tracking-tighter mb-1">January 2026</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Luxey Status:</span>
                            <span className="status-pill-gold">GOLD MEMBER</span>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Expected Payout Date</p>
                        <p className="text-sm font-bold text-black uppercase">
                            February 15th, 2026{" "}
                            <span className="ml-2 text-green-600 tracking-widest font-black text-[10px] border border-green-200 bg-green-50 px-2 py-0.5 rounded">
                                PAID
                            </span>
                        </p>
                    </div>
                </div>

                {/* Tier Breakdown Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                <th className="px-8 py-4">Commission Tier</th>
                                <th className="px-8 py-4 text-center">Referrals</th>
                                <th className="px-8 py-4 text-right">Fees Generated</th>
                                <th className="px-8 py-4 text-right">Payout %</th>
                                <th className="px-8 py-4 text-right">Your Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {tiers.map((tier) => (
                                <tr key={tier.name} className="commission-row transition-all">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-black uppercase tracking-tight">{tier.name}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{tier.sub}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-black text-base">{tier.referrals}</td>
                                    <td className="px-8 py-6 text-right font-medium text-gray-500 tracking-tighter">{tier.fees}</td>
                                    <td className="px-8 py-6 text-right font-black text-black">{tier.payout}</td>
                                    <td className="px-8 py-6 text-right font-black text-lg price-green tracking-tighter">{tier.earnings}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-black text-white">
                                <td colSpan={4} className="px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                                    TOTAL MONTHLY COMMISSIONS
                                </td>
                                <td className="px-8 py-6 text-right font-black text-2xl tracking-tighter text-[#D4AF37]">
                                    $5,069.60
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* PRIOR MONTHS */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-[#E4E4E4] pb-2">
                    Prior Months Commissions
                </h3>
                {priorMonths.map((pm) => (
                    <button
                        key={pm.month}
                        className="w-full text-left p-5 bg-white border border-[#E4E4E4] rounded flex justify-between items-center group hover:border-[#D4AF37] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">
                                {pm.month}
                            </span>
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                {pm.amount}
                            </span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-300 group-hover:text-[#D4AF37] transition-all"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}
