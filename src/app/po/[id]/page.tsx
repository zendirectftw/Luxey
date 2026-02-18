import LuxeyLogo from "@/components/LuxeyLogo";

export const metadata = { title: "EPO-32614 | Luxey© Official Purchase Order" };

const items = [
    { slot: "A-01", desc: "1 oz Gold Buffalo BU", year: "2024", serial: "BUF-2024-AX8821", spot: "$2,836.00", qty: 1, total: "$2,836.00" },
    { slot: "A-02", desc: "1 oz Gold Eagle BU", year: "2024", serial: "EAG-2024-KM7742", spot: "$2,839.00", qty: 1, total: "$2,839.00" },
    { slot: "A-03", desc: "1 oz PAMP Suisse Lady Fortuna", year: "2023", serial: "PMP-2023-QR3310", spot: "$2,841.50", qty: 1, total: "$2,841.50" },
    { slot: "A-04", desc: "100g Valcambi Gold Bar", year: "2024", serial: "VCB-2024-TT1293", spot: "$9,125.00", qty: 1, total: "$9,125.00" },
    { slot: "A-05", desc: "1 oz Gold Krugerrand", year: "2023", serial: "KRG-2023-FL8800", spot: "$2,833.00", qty: 2, total: "$5,666.00" },
    { slot: "A-06", desc: "10 oz Royal Canadian Mint Bar", year: "2024", serial: "RCM-2024-BB6177", spot: "$28,360.00", qty: 1, total: "$28,360.00" },
    { slot: "A-07", desc: "1 oz Austrian Philharmonic", year: "2024", serial: "PHI-2024-ZN2251", spot: "$2,834.00", qty: 2, total: "$5,668.00" },
];

export default function PODetailPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* UTILITY BAR */}
            <div className="sticky top-0 z-50 bg-black text-white px-6 py-3 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <LuxeyLogo size={32} variant="dark" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                        Official Purchase Order
                    </span>
                </div>
                <button className="luxey-cta group text-xs" onClick={undefined}>
                    DOWNLOAD PO
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="cta-bolt-circle" />
                        <span className="cta-bolt">⚡</span>
                    </div>
                </button>
            </div>

            {/* PAPER DOCUMENT */}
            <div className="po-paper print:shadow-none print:border-none">
                <div className="watermark">LUXEY</div>

                {/* HEADER */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex items-center gap-3">
                        <LuxeyLogo size={48} variant="dark" />
                        <div>
                            <span className="font-serif text-4xl font-bold tracking-tighter uppercase block leading-none">
                                Luxey<span className="text-sm align-super">©</span>
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 block mt-0.5">
                                Gold &amp; Precious Metals Exchange
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="font-serif text-3xl tracking-tighter uppercase mb-1">Purchase Order</h1>
                        <p className="text-lg font-black tracking-tighter">EPO-32614</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                            January 27, 2026
                        </p>
                    </div>
                </div>

                {/* ADDRESS BLOCKS */}
                <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
                    <div className="border-l-4 border-[#D4AF37] pl-4 py-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Ship From</p>
                        <p className="text-sm font-bold text-black leading-relaxed">
                            Jerrold Gardner<br />
                            10114 Grouse Creek Circle<br />
                            Sandy, UT 84092<br />
                            <span className="text-[10px] text-gray-400 font-bold">United States</span>
                        </p>
                    </div>
                    <div className="border-l-4 border-black pl-4 py-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Ship To — Luxey Verification Center</p>
                        <p className="text-sm font-bold text-black leading-relaxed">
                            Luxey© Processing Dept.<br />
                            1600 Broadway, Suite 2600<br />
                            Denver, CO 80202<br />
                            <span className="text-[10px] text-gray-400 font-bold">United States</span>
                        </p>
                    </div>
                </div>

                {/* SPOT PRICE BAR */}
                <div className="bg-black text-white px-6 py-3 mb-0.5 flex justify-between items-center text-xs font-bold relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                        Today&apos;s Spot Pricing Snapshot
                    </span>
                    <div className="flex gap-6 text-[10px] uppercase tracking-wider">
                        <span>Gold: <span className="text-[#D4AF37] font-black">$2,836/oz</span></span>
                        <span>Silver: <span className="text-white font-black">$31.50/oz</span></span>
                        <span>Platinum: <span className="text-white font-black">$1,028/oz</span></span>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="border border-[#E4E4E4] mb-8 relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[8px] font-black uppercase tracking-widest text-gray-500">
                                <th className="px-4 py-3">Slot</th>
                                <th className="px-4 py-3">Product Description</th>
                                <th className="px-4 py-3 text-center">Year</th>
                                <th className="px-4 py-3">Serial / ID</th>
                                <th className="px-4 py-3 text-right">Spot Value</th>
                                <th className="px-4 py-3 text-center">Qty</th>
                                <th className="px-4 py-3 text-right">Line Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F5]">
                            {items.map((item) => (
                                <tr key={item.serial} className="hover:bg-[#FAFAFA] transition-all">
                                    <td className="px-4 py-3 text-[10px] font-black text-gray-400">{item.slot}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-black uppercase tracking-tight">{item.desc}</td>
                                    <td className="px-4 py-3 text-center text-xs font-bold text-gray-400">{item.year}</td>
                                    <td className="px-4 py-3 text-[10px] font-mono text-gray-400">{item.serial}</td>
                                    <td className="px-4 py-3 text-right text-xs font-medium text-gray-500">{item.spot}</td>
                                    <td className="px-4 py-3 text-center text-xs font-black text-black">{item.qty}</td>
                                    <td className="px-4 py-3 text-right text-xs font-black text-black tabular-nums">{item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TOTALS */}
                <div className="flex justify-end mb-8 relative z-10">
                    <div className="w-72">
                        <div className="flex justify-between py-2 border-b border-[#F5F5F5] text-xs font-bold text-gray-500">
                            <span className="uppercase tracking-widest text-[10px]">Total Items</span>
                            <span className="text-black">09</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#F5F5F5] text-xs font-bold text-gray-500">
                            <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                            <span className="text-black">$57,335.50</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#F5F5F5] text-xs font-bold text-gray-500">
                            <span className="uppercase tracking-widest text-[10px]">Luxey Fee (0.60%)</span>
                            <span className="text-black">−$344.01</span>
                        </div>
                        <div className="flex justify-between py-4 border-t-2 border-black mt-2 bg-black -mx-4 px-8">
                            <span className="text-[#D4AF37] text-sm font-black uppercase tracking-widest">Total Payout</span>
                            <span className="text-[#D4AF37] text-xl font-black tracking-tighter">$56,991.49</span>
                        </div>
                    </div>
                </div>

                {/* TERMS */}
                <div className="border-t border-[#E4E4E4] pt-4 mt-8 relative z-10">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Terms &amp; Conditions</p>
                    <div className="text-[9px] text-gray-400 leading-relaxed space-y-1 font-medium">
                        <p>1. This purchase order is subject to Luxey&apos;s Standard Verification Protocol (SVP).</p>
                        <p>2. Payout will be issued within 3 business days after all items pass verification.</p>
                        <p>3. Items that fail verification will be returned at seller&apos;s expense within 7 business days.</p>
                        <p>4. Spot prices shown are locked at time of order creation and are not subject to market fluctuation.</p>
                        <p>5. By shipping items against this PO, the seller agrees to Luxey&apos;s Terms of Service.</p>
                    </div>
                </div>

                {/* FOOTER STAMP */}
                <div className="flex justify-between items-end mt-12 pt-6 border-t border-[#E4E4E4] relative z-10">
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                        <p>Luxey© Gold &amp; Precious Metals Exchange</p>
                        <p>1600 Broadway, Suite 2600, Denver, CO 80202</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Document ID EPO-32614</p>
                        <p className="text-[8px] text-gray-200 font-bold mt-0.5">Generated 01/27/2026 — Luxey Verified ⚡</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
