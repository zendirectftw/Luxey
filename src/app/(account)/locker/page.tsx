import Image from "next/image";

export const metadata = { title: "My Locker | Luxey© Secure Custody" };

const portfolioStats = [
    { label: "Total Items in Custody", value: "142" },
    { label: "Total Trays Secured", value: "06" },
    { label: "Portfolio Total Value", value: "$342,850", green: true },
    { label: "Total Change in Value", value: "+$12,400", green: true, growth: "+3.8%" },
];

interface Slot {
    occupied: boolean;
    desc?: string;
    serial?: string;
    value?: string;
    img?: string;
}

const traySlots: Slot[] = [
    { occupied: true, desc: "1 oz Gold Buffalo BU (2024)", serial: "BUF-2024-AX8821", value: "$2,836.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Buffalo%20Rev.jpg" },
    { occupied: true, desc: "1 oz Gold Eagle BU (2024)", serial: "EAG-2024-KM7742", value: "$2,839.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold%20Eagle%20rev.jpg" },
    { occupied: true, desc: "1 oz PAMP Lady Fortuna (2023)", serial: "PMP-2023-QR3310", value: "$2,841.50", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg" },
    { occupied: true, desc: "100g Valcambi Gold Bar (2024)", serial: "VCB-2024-TT1293", value: "$9,125.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Valcambi%20100%20gm%20Gold%20Bar.png" },
    { occupied: true, desc: "1 oz Gold Krugerrand (2023)", serial: "KRG-2023-FL8800", value: "$2,833.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Rand%20Refinery%201%20oz%20Gold%20Bar.png" },
    { occupied: true, desc: "10 oz RCM Gold Bar (2024)", serial: "RCM-2024-BB6177", value: "$28,360.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Perth%20Mint%201%20oz%20Gold%20Bar.png" },
    { occupied: true, desc: "1 oz Austrian Philharmonic (2024)", serial: "PHI-2024-ZN2251", value: "$2,834.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold%20Eagle%20rev.jpg" },
    { occupied: true, desc: "1 oz Canadian Maple Leaf (2024)", serial: "MPL-2024-VV0012", value: "$2,838.00", img: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Buffalo%20Rev.jpg" },
    ...Array.from({ length: 17 }, () => ({ occupied: false })),
];

export default function LockerPage() {
    const trayValue = traySlots.filter(s => s.occupied).reduce((acc) => acc, "$54,506.50");

    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="mb-8">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    My Locker
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Secure custody for your precious metals — verified, insured, and always accessible.
                </p>
            </header>

            {/* PORTFOLIO STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {portfolioStats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`stat-card ${stat.growth ? "border-l-4 border-l-green-500" : ""}`}
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

            {/* TRAY SELECTOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <select className="luxey-select bg-white border border-[#E4E4E4] px-6 py-3 pr-12 rounded-sm text-sm font-bold uppercase tracking-widest">
                        <option>Tray A — Gold Coins</option>
                        <option>Tray B — Gold Bars</option>
                        <option>Tray C — Silver</option>
                    </select>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Tray Market Value: <span className="text-black text-base font-black ml-1">$54,506.50</span>
                    </div>
                </div>
                <button className="vault-action-btn">Sell Tray</button>
            </div>

            {/* 25-SLOT TRAY GRID */}
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                <div className="grid grid-cols-5">
                    {traySlots.map((slot, i) => (
                        <div
                            key={i}
                            className={`slot-row border border-[#F5F5F5] p-4 min-h-[160px] flex flex-col justify-between ${!slot.occupied ? "slot-empty bg-[#FAFAFA]" : ""
                                }`}
                        >
                            {/* Slot Label */}
                            <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">
                                A-{String(i + 1).padStart(2, "0")}
                            </div>

                            {slot.occupied ? (
                                <>
                                    <div className="flex-1 flex items-center justify-center mb-2">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded border border-[#E4E4E4] p-1 flex items-center justify-center">
                                            <Image
                                                src={slot.img!}
                                                alt={slot.desc!}
                                                width={40}
                                                height={40}
                                                className="object-contain mix-blend-multiply"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-black uppercase tracking-tight leading-tight line-clamp-2">
                                            {slot.desc}
                                        </p>
                                        <p className="text-[8px] font-mono text-gray-300">{slot.serial}</p>
                                        <p className="text-xs font-black price-green">{slot.value}</p>
                                        <button className="vault-action-btn text-[8px] py-1.5 px-3 w-full mt-1">
                                            Sell
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-gray-200 text-xl">+</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                        Buy to Fill
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
