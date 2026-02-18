export const metadata = { title: "Dashboard | Luxey© MyAccount" };

const lockerStats = [
    { label: "Total Items", value: "142" },
    { label: "Total Trays", value: "06" },
    { label: "Locker Total Value ($)", value: "$342,850", green: true },
    { label: "Total Change in Value ($)", value: "+$12,400", green: true, growth: "(+3.8%)", border: true },
];

const activityLeft = [
    { period: "This Month", value: "04", growth: "(+12%)", up: true },
    { period: "Past 3 Months", value: "12", growth: "(+2%)", up: true },
    { period: "Past 6 Months", value: "24", growth: "(+8%)", up: true },
    { period: "Past 12 Months", value: "56", growth: "(+22%)", up: true, bg: true },
];

const activityRight = [
    { period: "This Month", value: "$12,450", growth: "(+5.4%)", up: true },
    { period: "Past 3 Months", value: "$48,210", growth: "(-1.2%)", up: false },
    { period: "Past 6 Months", value: "$92,000", growth: "(+14.1%)", up: true },
    { period: "Past 12 Months", value: "$215,700", growth: "(+9.2%)", up: true, bg: true },
];

const earnings = [
    { label: "Number of Referrals", value: "18", growth: "(+2)", up: true, large: true },
    { label: "Commission This Month", value: "$1,240", growth: "(+18%)", up: true, green: true },
    { label: "Commission Last Month", value: "$850", growth: "(-4%)", up: false },
    { label: "Lifetime Commissions", value: "$148,200", growth: "(+100%)", featured: true },
];

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-5xl text-black tracking-tight mb-1 uppercase">
                        Jerrold&apos;s Dashboard
                    </h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Member since — September 2023
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-[#E4E4E4] p-4 rounded-sm shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Current Status:
                    </span>
                    <span className="status-pill-gold">GOLD TIER</span>
                </div>
            </header>

            {/* MY LOCKER OVERVIEW */}
            <div className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1">
                    My Locker Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {lockerStats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`stat-card ${stat.border ? "border-l-4 border-l-green-500" : ""}`}
                        >
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                {stat.label}
                            </p>
                            <div className="flex items-baseline">
                                <p className={`text-3xl font-black tracking-tighter ${stat.green ? "price-green" : ""}`}>
                                    {stat.value}
                                </p>
                                {stat.growth && (
                                    <span className="growth-up">{stat.growth}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTIVITY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-12">
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 py-3 border-b-2 border-black mb-1 ml-1">
                    TOTAL ORDERS AND LOCKS (% change)
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 py-3 border-b-2 border-black mb-1 ml-1">
                    ORDERS AND LOCKS - TOTAL $ MARKET VALUE (% change)
                </div>

                {activityLeft.map((item, i) => (
                    <div
                        key={`left-${item.period}`}
                        className={`stat-card flex justify-between items-center ${item.bg ? "bg-zinc-50" : ""}`}
                    >
                        <span className="text-[11px] font-black text-black uppercase tracking-widest">
                            {item.period}
                        </span>
                        <div className="flex items-center">
                            <span className="text-2xl font-black tracking-tighter">{item.value}</span>
                            <span className={item.up ? "growth-up" : "growth-down"}>{item.growth}</span>
                        </div>
                    </div>
                ))}

                {/* Re-render right column — interleaved grid handles this via CSS grid order */}
            </div>

            {/* Rebuild activity grid properly with interleaved layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-12 -mt-12 hidden md:grid">
                {/* This section intentionally left for the proper interleaved grid above */}
            </div>

            {/* Actually, let's do side-by-side rows properly */}
            <div className="-mt-12 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {activityLeft.map((left, i) => {
                        const right = activityRight[i];
                        return (
                            <div key={`row-${i}`} className="contents">
                                <div className={`stat-card flex justify-between items-center ${left.bg ? "bg-zinc-50" : ""}`}>
                                    <span className="text-[11px] font-black text-black uppercase tracking-widest">
                                        {left.period}
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-2xl font-black tracking-tighter">{left.value}</span>
                                        <span className={left.up ? "growth-up" : "growth-down"}>{left.growth}</span>
                                    </div>
                                </div>
                                <div className={`stat-card flex justify-between items-center border-l-4 border-l-green-500 ${right.bg ? "bg-zinc-50" : ""}`}>
                                    <span className="text-[11px] font-black text-black uppercase tracking-widest">
                                        {right.period}
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-2xl font-black price-green tracking-tighter">{right.value}</span>
                                        <span className={right.up ? "growth-up" : "growth-down"}>{right.growth}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* EARNINGS & NETWORK */}
            <div className="border-t border-[#E4E4E4] pt-6 pb-12">
                <h2 className="font-serif text-3xl mb-6 uppercase tracking-tight">
                    Earnings &amp; Network
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {earnings.map((item) => (
                        <div
                            key={item.label}
                            className={
                                item.featured
                                    ? "stat-card bg-black border-black shadow-xl ring-2 ring-[#D4AF37] flex flex-col"
                                    : "stat-card"
                            }
                        >
                            <p
                                className={`text-[9px] font-black uppercase tracking-widest mb-4 ${item.featured ? "text-[#D4AF37]" : "text-gray-400"
                                    }`}
                            >
                                {item.label}
                            </p>
                            <div className="flex items-baseline">
                                <p
                                    className={`${item.large ? "text-4xl" : "text-3xl"} font-black tracking-tighter ${item.featured
                                            ? "text-[#D4AF37]"
                                            : item.green
                                                ? "price-green"
                                                : "text-black"
                                        }`}
                                >
                                    {item.value}
                                </p>
                                <span
                                    className={
                                        item.featured
                                            ? "text-[#D4AF37] text-[10px] font-bold ml-2 opacity-80"
                                            : item.up
                                                ? "growth-up text-xs"
                                                : "growth-down"
                                    }
                                >
                                    {item.growth}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
