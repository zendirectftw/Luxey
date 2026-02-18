export const metadata = { title: "Status Tier | Luxey© MyAccount" };

const tiers = [
    { name: "Bronze", volume: "$25k", fee: "0.75%", commission: "15%", level: "1st level", current: false },
    { name: "Silver", volume: "$75k", fee: "0.70%", commission: "+10%", level: "2nd level", current: false },
    { name: "Gold", volume: "$150k", fee: "0.60%", commission: "+5%", level: "3rd level", current: true },
    { name: "Platinum", volume: "$300k", fee: "0.55%", commission: "+3%", level: "4th level", current: false },
    { name: "Titanium", volume: "$500k", fee: "0.50%", commission: "+2%", level: "5th level", current: false },
];

export default function StatusPage() {
    return (
        <div className="max-w-7xl mx-auto w-full py-10 px-6">
            <header className="mb-10">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Luxey Status
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Unlock lower fees and higher commissions based on your monthly selling volume.
                </p>
            </header>

            {/* HERO CARD */}
            <div className="status-hero-card mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                    <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">
                            YOUR CURRENT STATUS TIER:
                        </p>
                        <h2 className="font-serif text-8xl uppercase tracking-tighter italic color-gold leading-none pb-2">
                            Gold
                        </h2>
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                            Active until February 28th, 2026
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="volume-box">
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Volume Last Month</p>
                            <p className="text-2xl font-black text-white tracking-tighter">
                                $185,232 <span className="color-gold text-[10px] font-bold ml-1 uppercase">(Gold)</span>
                            </p>
                        </div>
                        <div className="volume-box border-[#D4AF37]/40 bg-zinc-900/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                            <p className="text-[9px] font-black uppercase tracking-widest color-gold mb-1">
                                Volume This Month So Far
                            </p>
                            <p className="text-2xl font-black text-white tracking-tighter">
                                $84,434 <span className="text-zinc-500 text-[10px] font-bold ml-1 uppercase">(Silver)</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-12 pt-8 border-t border-zinc-800 relative z-10">
                    <div className="flex justify-between items-end mb-4 text-left w-full">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest color-gold">
                                NEXT MILESTONE: MAINTAIN GOLD UNTIL END OF MARCH 2026.
                            </p>
                            <p className="text-sm font-medium text-zinc-400 mt-1 uppercase tracking-tight">
                                You need <span className="text-white font-black">$65,566</span> more to hit Gold Tier this month.
                            </p>
                        </div>
                        <p className="text-xs font-black tracking-widest text-white uppercase">$150,000</p>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: "56%" }} />
                    </div>
                </div>

                {/* Decorative bolt */}
                <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
                    <span className="text-[20rem] leading-none">⚡</span>
                </div>
            </div>

            {/* BENEFITS TABLE */}
            <section className="space-y-8">
                <h2 className="font-serif text-3xl uppercase tracking-tight">
                    REQUIREMENTS AND BENEFITS OF LUXEY STATUS
                </h2>
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Tier</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Required Monthly Volume</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Platform Fees (%)</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Commissions (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {tiers.map((tier) => (
                                <tr
                                    key={tier.name}
                                    className={`tier-row transition-all duration-300 ${tier.current ? "bg-amber-50/30 border-l-4 border-[#D4AF37]" : ""
                                        }`}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold text-sm uppercase ${tier.name === "Titanium" ? "text-zinc-400" : "text-black"} ${tier.current ? "font-black" : ""}`}>
                                                {tier.name}
                                            </span>
                                            {tier.current && (
                                                <span className="bg-[#D4AF37] text-black text-[8px] font-black px-1.5 py-0.5 rounded">
                                                    CURRENT
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-8 py-6 tabular-nums ${tier.current ? "font-black text-black" : "font-bold text-black"}`}>
                                        {tier.volume}
                                    </td>
                                    <td className={`px-8 py-6 ${tier.current ? "font-black text-black" : "font-medium text-gray-500"}`}>
                                        {tier.fee}
                                    </td>
                                    <td className="px-8 py-6 text-right font-black price-green">
                                        {tier.commission}{" "}
                                        <span className="text-[9px] text-gray-400 font-bold ml-1 uppercase">
                                            ({tier.level})
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Upgrade Policy */}
                <div className="max-w-full pt-4">
                    <p className="text-[10px] md:text-[11px] text-gray-400 leading-relaxed font-bold uppercase tracking-[0.12em] border-l-4 border-[#D4AF37] pl-8">
                        IF YOU QUALIFY FOR A HIGHER STATUS DURING THE MONTH, YOU WILL AUTOMATICALLY BE UPGRADED FOR THE REMAINDER OF THE MONTH AND THE ENTIRE NEXT MONTH.<br />
                        YOUR HIGHEST STATUS TIER EARNED WILL BE USED TO CALCULATE COMMISSION PAYOUTS FOR EACH MONTH.
                    </p>
                </div>
            </section>
        </div>
    );
}
