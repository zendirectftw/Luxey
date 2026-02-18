import LuxeyCTA from "@/components/LuxeyCTA";

export const metadata = { title: "Referrals | Luxey© MyAccount" };

const referrals = [
    { name: "John Smith", initials: "JS", date: "February 02, 2026", tier: "Gold Tier", pillClass: "pill-gold" },
    { name: "Sarah Connor", initials: "SC", date: "January 12, 2026", tier: "Silver Tier", pillClass: "pill-silver" },
    { name: "Michael Thorne", initials: "MT", date: "December 20, 2025", tier: "Bronze Tier", pillClass: "pill-bronze" },
    { name: "Elena Rodriguez", initials: "ER", date: "December 05, 2025", tier: "Bronze Tier", pillClass: "pill-bronze" },
];

const commissionTiers = [
    { name: "Bronze", volume: "$25k required monthly volume", pct: "15%", desc: "of Direct Referrals' fees generated", colorClass: "color-bronze", opacity: "" },
    { name: "Silver", volume: "$75k required monthly volume", pct: "+10%", desc: "of 2nd-level Referrals' fees generated", colorClass: "color-silver", opacity: "" },
    { name: "Gold", volume: "$150k required monthly volume", pct: "+5%", desc: "of 3rd-level Referrals' fees generated", colorClass: "color-gold", opacity: "" },
    { name: "Platinum", volume: "$300k required monthly volume", pct: "+3%", desc: "of 4th-level Referrals' fees generated", colorClass: "color-platinum", opacity: "opacity-60" },
    { name: "Titanium", volume: "$500k required monthly volume", pct: "+2%", desc: "of 5th-level Referrals' fees generated", colorClass: "color-titanium", opacity: "opacity-40" },
];

export default function ReferralsPage() {
    return (
        <div className="max-w-7xl mx-auto w-full py-10 px-6">
            <header className="mb-10">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Referral Network
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    GET PAID MONTHLY TO PROMOTE LUXEY.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6 text-left">
                    {/* Referral Code */}
                    <div className="bg-white border border-[#E4E4E4] p-8 rounded-sm shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                            Manage Your Referral Code
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">
                                    Custom Referral Code
                                </label>
                                <input
                                    type="text"
                                    defaultValue="JERROLD-GOLD"
                                    className="w-full p-3 border border-[#E4E4E4] rounded font-bold uppercase focus:border-[#D4AF37] outline-none"
                                />
                            </div>
                            <LuxeyCTA>UPDATE CODE</LuxeyCTA>
                        </div>
                    </div>

                    {/* Invitation Link */}
                    <div className="bg-white border border-[#E4E4E4] p-8 rounded-sm shadow-sm text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                            Personal Invitation Link
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="flex-1 bg-zinc-50 p-4 border border-[#E4E4E4] rounded font-mono text-sm text-zinc-500 overflow-hidden text-ellipsis">
                                https://luxey.com/ref/jerrold-gold
                            </div>
                            <button className="px-6 py-4 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                Copy Link
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center border-t border-gray-100 pt-6">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">
                                Share Link:
                            </span>
                            {/* Social Icons */}
                            {["Facebook", "Instagram", "TikTok"].map((social) => (
                                <button
                                    key={social}
                                    className="w-10 h-10 rounded border border-[#E4E4E4] flex items-center justify-center hover:border-black transition-colors"
                                    aria-label={social}
                                >
                                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">
                                            {social[0]}
                                        </text>
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: BEST PRACTICES */}
                <div className="lg:col-span-1">
                    <div className="bg-black text-white p-10 rounded-sm border-t-4 border-[#D4AF37] shadow-2xl h-full flex flex-col text-left">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-8 italic">
                            REFERRAL BEST PRACTICES
                        </h3>
                        <p className="text-[11px] leading-relaxed font-bold uppercase tracking-widest text-zinc-400 mb-10">
                            Please make sure anyone you refer to Luxey receives proper instructions about how to be successful and avoid pitfalls.
                        </p>
                        <ul className="text-[10px] space-y-6 font-black uppercase tracking-[0.15em] text-zinc-300">
                            <li className="flex gap-4">
                                <span className="text-[#D4AF37]">01</span>
                                <span>MAKE SURE REFERRALS REVIEW<br /><span className="text-zinc-500">(STARTER GUIDE)</span></span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#D4AF37]">02</span>
                                <span>HOW TO CALCULATE<br />PROFITABLE BUYS</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#D4AF37]">03</span>
                                <span>VERIFY SHIPPING AND<br />PACKAGING METHODS</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#D4AF37]">04</span>
                                <span>EXPLAIN LUXEY<br />STATUS TIERS</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* DIRECT REFERRALS TABLE */}
            <section className="border-t border-[#E4E4E4] pt-12 mb-20 text-left">
                <h2 className="font-serif text-3xl mb-8 uppercase tracking-tight">Direct Referrals</h2>
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                <th className="px-8 py-5">Referral Name</th>
                                <th className="px-8 py-5">Date Joined</th>
                                <th className="px-8 py-5 text-right">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {referrals.map((ref) => (
                                <tr key={ref.name} className="hover:bg-[#FAFAFA] transition-colors">
                                    <td className="px-8 py-6 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-black text-xs text-zinc-400">
                                            {ref.initials}
                                        </div>
                                        <span className="font-bold text-sm text-black uppercase">{ref.name}</span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest tabular-nums">
                                        {ref.date}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`status-pill ${ref.pillClass}`}>{ref.tier}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* COMMISSION STRUCTURE */}
            <section className="border-t-2 border-black pt-12 pb-24 text-left">
                <p className="text-[11px] md:text-sm font-black uppercase tracking-widest text-zinc-500 mb-10 border-b border-zinc-100 pb-4">
                    The higher your LUXEY Status, the more commissions you are eligible to earn up to 35% of platform fees generated.
                </p>
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black text-[11px] font-black uppercase tracking-widest">
                                <th className="px-8 py-5 text-[#D4AF37]">Status Tier</th>
                                <th className="px-8 py-5 text-right text-[#D4AF37]">Eligible Commission Breakdown</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {commissionTiers.map((ct) => (
                                <tr key={ct.name} className={`hover:bg-zinc-50 transition-colors ${ct.opacity}`}>
                                    <td className="px-8 py-6 uppercase tracking-tighter">
                                        <span className={`font-black text-xl ${ct.colorClass}`}>{ct.name}</span>
                                        <span className="text-[10px] font-bold text-gray-300 ml-2">({ct.volume})</span>
                                    </td>
                                    <td className="px-8 py-6 text-right tracking-tighter">
                                        <span className={`font-black text-xl ${ct.colorClass}`}>{ct.pct}</span>
                                        <span className="text-gray-400 font-bold uppercase text-[10px] ml-2 tracking-widest italic">
                                            {ct.desc}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
