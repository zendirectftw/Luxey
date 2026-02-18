import LuxeyCTA from "@/components/LuxeyCTA";

export const metadata = { title: "Shipping Manager | Luxey© MyAccount" };

const poChecklist = [
    { id: "32614", items: 23, value: "$116,247", date: "01/27/2026", checked: true },
    { id: "32613", items: 26, value: "$131,410", date: "01/27/2026", checked: true },
    { id: "32612", items: 26, value: "$131,238", date: "01/27/2026", checked: false },
    { id: "32611", items: 26, value: "$131,238", date: "01/27/2026", checked: false },
];

const shipmentHistory = [
    { id: "SH-20260127-A", pos: "32614, 32613", items: 49, tracking: "1Z999AA10123456784", carrier: "UPS", date: "01/27/2026", status: "In Transit", type: "transit" },
    { id: "SH-20260119-A", pos: "31758", items: 26, tracking: "9400111899223100001", carrier: "USPS", date: "01/19/2026", status: "Delivered", type: "delivered" },
    { id: "SH-20260105-A", pos: "31600", items: 12, tracking: "7489200210029000183", carrier: "FedEx", date: "01/05/2026", status: "Received", type: "received" },
];

export default function ShipmentsPage() {
    return (
        <div className="max-w-7xl mx-auto w-full py-8 px-6">
            {/* HEADER */}
            <header className="mb-8">
                <h1 className="font-serif text-5xl text-black tracking-tight mb-2 uppercase leading-none">
                    Shipping Manager
                </h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Combine your purchase orders into a single shipment for cost-effective delivery.
                </p>
            </header>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                {/* LEFT: PO CHECKLIST */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                        <div className="bg-[#FAFAFA] p-5 border-b border-[#E4E4E4]">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Select Purchase Orders for This Shipment
                            </h3>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-3 w-12"></th>
                                    <th className="px-6 py-3">PO #</th>
                                    <th className="px-6 py-3 text-center">Items</th>
                                    <th className="px-6 py-3 text-right">Value</th>
                                    <th className="px-6 py-3 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {poChecklist.map((po) => (
                                    <tr key={po.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-5">
                                            <input
                                                type="checkbox"
                                                defaultChecked={po.checked}
                                                className="w-5 h-5 rounded border-2 border-[#E4E4E4] accent-[#D4AF37] cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-5 font-bold text-sm text-black">EPO-{po.id}</td>
                                        <td className="px-6 py-5 text-center text-sm font-bold">{po.items}</td>
                                        <td className="px-6 py-5 text-right font-black text-sm price-green">{po.value}</td>
                                        <td className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 tabular-nums">{po.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: CREATE SHIPMENT */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-8 space-y-6 sticky top-24">
                        <h3 className="font-serif text-2xl uppercase tracking-tight">Create Shipment</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-[#F5F5F5]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">POs Selected</span>
                                <span className="font-black text-black">2</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-[#F5F5F5]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Items</span>
                                <span className="font-black text-black">49</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-double border-black bg-zinc-50 px-4 -mx-4 rounded">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Shipment Value</span>
                                <span className="font-black text-lg price-green">$247,657</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-[10px] font-bold text-gray-400 leading-relaxed bg-[#FAFAFA] p-4 rounded border border-[#F5F5F5]">
                            <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 accent-[#D4AF37]" />
                            <span className="uppercase tracking-wider">
                                I confirm these items are properly packaged and insured for the declared value.
                            </span>
                        </div>

                        <LuxeyCTA>CREATE SHIPMENT</LuxeyCTA>
                    </div>
                </div>
            </div>

            {/* SHIPPING HISTORY */}
            <div className="border-t border-[#E4E4E4] pt-8">
                <h2 className="font-serif text-3xl mb-6 uppercase tracking-tight">Shipping History</h2>
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4] text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">Shipment ID</th>
                                    <th className="px-6 py-4">POs Included</th>
                                    <th className="px-6 py-4 text-center">Items</th>
                                    <th className="px-6 py-4">Tracking #</th>
                                    <th className="px-6 py-4 text-center">Carrier</th>
                                    <th className="px-6 py-4 text-center">Date</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F5]">
                                {shipmentHistory.map((sh) => (
                                    <tr key={sh.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-5 font-bold text-sm text-black">{sh.id}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-gray-500">{sh.pos}</td>
                                        <td className="px-6 py-5 text-center font-bold text-black">{sh.items}</td>
                                        <td className="px-6 py-5 text-[10px] font-mono text-gray-400">{sh.tracking}</td>
                                        <td className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest">{sh.carrier}</td>
                                        <td className="px-6 py-5 text-center text-[11px] font-bold text-gray-400 tabular-nums">{sh.date}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`status-pill ${sh.type === "transit" ? "status-progress" :
                                                    sh.type === "delivered" ? "status-complete" : "status-pill-gold"
                                                }`}>
                                                {sh.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="action-btn action-btn-primary">Track</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
