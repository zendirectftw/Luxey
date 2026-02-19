"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/* ══════════════════════════════════════════════
   Types
══════════════════════════════════════════════ */
interface Dealer {
    id: string;
    name: string;
    display_name: string;
    display_city: string;
    code: string;
    spot_offset: number;
    shipping_address: { street?: string; city?: string; state?: string; zip?: string } | null;
    is_active: boolean;
    created_at: string;
}

interface Mapping {
    id: string;
    dealer_id: string;
    product_id: string;
    dealer_sku_id: string | null;
    dealer_product_url: string | null;
    fetch_method: string;
    is_active: boolean;
    dealer_name?: string;
    product_name?: string;
}

type DealerForm = {
    name: string; display_name: string; display_city: string;
    code: string; spot_offset: string;
};

type MappingForm = {
    dealer_id: string; product_id: string;
    dealer_sku_id: string; dealer_product_url: string; fetch_method: string;
};

const EMPTY_DEALER: DealerForm = { name: "", display_name: "", display_city: "", code: "", spot_offset: "0" };
const EMPTY_MAPPING: MappingForm = { dealer_id: "", product_id: "", dealer_sku_id: "", dealer_product_url: "", fetch_method: "api" };

/* ══════════════════════════════════════════════
   Mappings sub-component (with pagination)
══════════════════════════════════════════════ */
function MappingsTab({
    mappings, mappingPage, setMappingPage, pageSize,
    openEditMapping, toggleMapping, setConfirmDeleteMapping,
}: {
    mappings: Mapping[];
    mappingPage: number;
    setMappingPage: (p: number) => void;
    pageSize: number;
    openEditMapping: (mp: Mapping) => void;
    toggleMapping: (mp: Mapping) => void;
    setConfirmDeleteMapping: (mp: Mapping) => void;
}) {
    const totalPages = Math.max(1, Math.ceil(mappings.length / pageSize));
    const safePageSize = pageSize > 0 ? pageSize : 10;
    const pageStart = (mappingPage - 1) * safePageSize;
    const paginated = mappings.slice(pageStart, pageStart + safePageSize);

    return (
        <div>
            <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-x-auto">
                <table className="w-full min-w-[860px]">
                    <thead>
                        <tr className="border-b border-[#E4E4E4] bg-[#FAFAFA]">
                            {["Dealer", "Product", "SKU / URL", "Fetch Method", "Status", "Actions"].map(h => (
                                <th key={h} className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mappings.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-16 text-[10px] font-black uppercase tracking-widest text-gray-400">No mappings found</td></tr>
                        ) : paginated.map((mp, idx) => (
                            <tr key={mp.id} className={`border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors ${idx === paginated.length - 1 ? "border-b-0" : ""}`}>
                                <td className="p-4">
                                    <p className="text-[11px] font-black uppercase tracking-wider text-black whitespace-nowrap">{mp.dealer_name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold">{mp.dealer_id.slice(0, 8)}…</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-xs font-bold text-gray-700 max-w-[200px] truncate">{mp.product_name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold">{mp.product_id.slice(0, 8)}…</p>
                                </td>
                                <td className="p-4 text-[10px] text-gray-500 max-w-[150px] truncate">{mp.dealer_sku_id ?? mp.dealer_product_url ?? "—"}</td>
                                <td className="p-4">
                                    <span className="bg-[#F5F5F5] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">{mp.fetch_method}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap ${mp.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {mp.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2 items-center">
                                        <button onClick={() => openEditMapping(mp)} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border border-[#E4E4E4] hover:border-black transition-all whitespace-nowrap">Edit</button>
                                        <button onClick={() => toggleMapping(mp)} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all whitespace-nowrap ${mp.is_active ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
                                            {mp.is_active ? "Disable" : "Enable"}
                                        </button>
                                        <button onClick={() => setConfirmDeleteMapping(mp)} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border border-red-200 text-red-600 hover:bg-red-50 transition-all whitespace-nowrap">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination bar */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Showing {pageStart + 1}–{Math.min(pageStart + safePageSize, mappings.length)} of {mappings.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setMappingPage(Math.max(1, mappingPage - 1))}
                            disabled={mappingPage === 1}
                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                            <button
                                key={pg}
                                onClick={() => setMappingPage(pg)}
                                className={`w-8 h-8 text-[9px] font-black transition-all ${mappingPage === pg ? "bg-black text-white" : "border border-[#E4E4E4] hover:border-black text-gray-600"}`}
                            >
                                {pg}
                            </button>
                        ))}
                        <button
                            onClick={() => setMappingPage(Math.min(totalPages, mappingPage + 1))}
                            disabled={mappingPage === totalPages}
                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════
   Page
══════════════════════════════════════════════ */
export default function DealersPage() {
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"dealers" | "mappings">("dealers");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [saving, setSaving] = useState(false);

    /* Pagination */
    const MAPPING_PAGE_SIZE = 10;
    const [mappingPage, setMappingPage] = useState(1);

    /* Dealer modal */
    const [dealerModal, setDealerModal] = useState<"add" | "edit" | null>(null);
    const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
    const [dealerForm, setDealerForm] = useState<DealerForm>(EMPTY_DEALER);
    const [confirmDeleteDealer, setConfirmDeleteDealer] = useState<Dealer | null>(null);

    /* Mapping modal */
    const [mappingModal, setMappingModal] = useState<"add" | "edit" | null>(null);
    const [editingMapping, setEditingMapping] = useState<Mapping | null>(null);
    const [mappingForm, setMappingForm] = useState<MappingForm>(EMPTY_MAPPING);
    const [confirmDeleteMapping, setConfirmDeleteMapping] = useState<Mapping | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    /* ── Load data ── */
    const loadAll = useCallback(async () => {
        setLoading(true);
        const [{ data: d }, { data: m }, { data: p }] = await Promise.all([
            supabase.from("dealers").select("*").order("created_at", { ascending: true }),
            supabase.from("dealer_product_mapping").select("*").order("dealer_id").range(0, 9999),
            supabase.from("products").select("id, name").order("name"),
        ]);
        const dealerList: Dealer[] = d ?? [];
        const productList = p ?? [];
        const mappingList: Mapping[] = (m ?? []).map(mp => ({
            ...mp,
            dealer_name: dealerList.find(dl => dl.id === mp.dealer_id)?.display_name ?? mp.dealer_id.slice(0, 8),
            product_name: productList.find(pr => pr.id === mp.product_id)?.name ?? mp.product_id.slice(0, 8),
        }));
        setDealers(dealerList);
        setProducts(productList);
        setMappings(mappingList);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadAll();
        const ch = supabase
            .channel("dealers-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "dealers" }, loadAll)
            .on("postgres_changes", { event: "*", schema: "public", table: "dealer_product_mapping" }, loadAll)
            .subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [loadAll]);

    /* ═══════════════════════════════════════
       DEALER CRUD
    ═══════════════════════════════════════ */
    const openAddDealer = () => { setDealerForm(EMPTY_DEALER); setEditingDealer(null); setDealerModal("add"); };
    const openEditDealer = (d: Dealer) => {
        setDealerForm({ name: d.name, display_name: d.display_name, display_city: d.display_city, code: d.code, spot_offset: String(d.spot_offset) });
        setEditingDealer(d);
        setDealerModal("edit");
    };

    const saveDealer = async () => {
        if (!dealerForm.name || !dealerForm.display_name || !dealerForm.code) {
            showToast("Name, Display Name, and Code are required.", "error"); return;
        }
        setSaving(true);
        const payload = {
            name: dealerForm.name,
            display_name: dealerForm.display_name,
            display_city: dealerForm.display_city,
            code: dealerForm.code.toUpperCase(),
            spot_offset: Number(dealerForm.spot_offset) || 0,
        };
        const { error } = dealerModal === "edit" && editingDealer
            ? await supabase.from("dealers").update(payload).eq("id", editingDealer.id)
            : await supabase.from("dealers").insert({ ...payload, is_active: true });
        setSaving(false);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { showToast(dealerModal === "edit" ? "Dealer updated." : "Dealer added."); setDealerModal(null); loadAll(); }
    };

    const deleteDealer = async (dealer: Dealer) => {
        const { error } = await supabase.from("dealers").delete().eq("id", dealer.id);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { showToast("Dealer deleted."); setConfirmDeleteDealer(null); loadAll(); }
    };

    const toggleDealer = async (dealer: Dealer) => {
        const { error } = await supabase.from("dealers").update({ is_active: !dealer.is_active }).eq("id", dealer.id);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { setDealers(prev => prev.map(d => d.id === dealer.id ? { ...d, is_active: !d.is_active } : d)); }
    };

    /* ═══════════════════════════════════════
       MAPPING CRUD
    ═══════════════════════════════════════ */
    const openAddMapping = () => { setMappingForm(EMPTY_MAPPING); setEditingMapping(null); setMappingModal("add"); };
    const openEditMapping = (mp: Mapping) => {
        setMappingForm({ dealer_id: mp.dealer_id, product_id: mp.product_id, dealer_sku_id: mp.dealer_sku_id ?? "", dealer_product_url: mp.dealer_product_url ?? "", fetch_method: mp.fetch_method });
        setEditingMapping(mp);
        setMappingModal("edit");
    };

    const saveMapping = async () => {
        if (!mappingForm.dealer_id || !mappingForm.product_id) {
            showToast("Dealer and Product are required.", "error"); return;
        }
        setSaving(true);
        const payload = {
            dealer_id: mappingForm.dealer_id,
            product_id: mappingForm.product_id,
            dealer_sku_id: mappingForm.dealer_sku_id || null,
            dealer_product_url: mappingForm.dealer_product_url || null,
            fetch_method: mappingForm.fetch_method,
        };
        const { error } = mappingModal === "edit" && editingMapping
            ? await supabase.from("dealer_product_mapping").update(payload).eq("id", editingMapping.id)
            : await supabase.from("dealer_product_mapping").insert({ ...payload, is_active: true });
        setSaving(false);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { showToast(mappingModal === "edit" ? "Mapping updated." : "Mapping added."); setMappingModal(null); loadAll(); }
    };

    const deleteMapping = async (mp: Mapping) => {
        const { error } = await supabase.from("dealer_product_mapping").delete().eq("id", mp.id);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { showToast("Mapping deleted."); setConfirmDeleteMapping(null); loadAll(); }
    };

    const toggleMapping = async (mp: Mapping) => {
        const { error } = await supabase.from("dealer_product_mapping").update({ is_active: !mp.is_active }).eq("id", mp.id);
        if (error) showToast(`Failed: ${error.message}`, "error");
        else { setMappings(prev => prev.map(m => m.id === mp.id ? { ...m, is_active: !m.is_active } : m)); }
    };

    /* ── Stat helpers ── */
    const activeCount = dealers.filter(d => d.is_active).length;
    const mappingActiveCount = mappings.filter(m => m.is_active).length;

    /* ── Shared input class ── */
    const inp = "w-full border border-[#E4E4E4] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors";
    const lbl = "block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1";

    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
        <div className="p-8 max-w-7xl mx-auto">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-sm shadow-lg text-[11px] font-black uppercase tracking-widest ${toast.type === "success" ? "bg-black text-white" : "bg-red-600 text-white"}`}>
                    {toast.msg}
                </div>
            )}

            {/* ═══ DEALER MODAL ═══ */}
            {dealerModal && (
                <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl">
                        <div className="px-6 py-5 border-b border-[#E4E4E4] flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-widest">{dealerModal === "edit" ? "Edit Dealer" : "Add Dealer"}</h2>
                            <button onClick={() => setDealerModal(null)} className="text-gray-400 hover:text-black text-xl">×</button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={lbl}>Internal Name *</label>
                                <input className={inp} value={dealerForm.name} onChange={e => setDealerForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. APMEX" />
                            </div>
                            <div className="col-span-2">
                                <label className={lbl}>Display Name *</label>
                                <input className={inp} value={dealerForm.display_name} onChange={e => setDealerForm(f => ({ ...f, display_name: e.target.value }))} placeholder="e.g. LUXEY - OKC" />
                            </div>
                            <div>
                                <label className={lbl}>Code *</label>
                                <input className={inp} value={dealerForm.code} onChange={e => setDealerForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. APMEX" />
                            </div>
                            <div>
                                <label className={lbl}>Spot Offset</label>
                                <input type="number" className={inp} value={dealerForm.spot_offset} onChange={e => setDealerForm(f => ({ ...f, spot_offset: e.target.value }))} />
                            </div>
                            <div className="col-span-2">
                                <label className={lbl}>Display City</label>
                                <input className={inp} value={dealerForm.display_city} onChange={e => setDealerForm(f => ({ ...f, display_city: e.target.value }))} placeholder="e.g. Oklahoma City, OK" />
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3 justify-end">
                            <button onClick={() => setDealerModal(null)} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:border-black transition-colors">Cancel</button>
                            <button onClick={saveDealer} disabled={saving} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors disabled:opacity-50">
                                {saving ? "Saving..." : dealerModal === "edit" ? "Update" : "Add Dealer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ MAPPING MODAL ═══ */}
            {mappingModal && (
                <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl">
                        <div className="px-6 py-5 border-b border-[#E4E4E4] flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-widest">{mappingModal === "edit" ? "Edit Mapping" : "Add Mapping"}</h2>
                            <button onClick={() => setMappingModal(null)} className="text-gray-400 hover:text-black text-xl">×</button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={lbl}>Dealer *</label>
                                <select className={inp} value={mappingForm.dealer_id} onChange={e => setMappingForm(f => ({ ...f, dealer_id: e.target.value }))}>
                                    <option value="">Select dealer…</option>
                                    {dealers.map(d => <option key={d.id} value={d.id}>{d.display_name}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className={lbl}>Product *</label>
                                <select className={inp} value={mappingForm.product_id} onChange={e => setMappingForm(f => ({ ...f, product_id: e.target.value }))}>
                                    <option value="">Select product…</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={lbl}>Fetch Method</label>
                                <select className={inp} value={mappingForm.fetch_method} onChange={e => setMappingForm(f => ({ ...f, fetch_method: e.target.value }))}>
                                    <option value="api">API</option>
                                    <option value="scrape">Scrape</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className={lbl}>Dealer SKU ID</label>
                                <input className={inp} value={mappingForm.dealer_sku_id} onChange={e => setMappingForm(f => ({ ...f, dealer_sku_id: e.target.value }))} placeholder="optional" />
                            </div>
                            <div className="col-span-2">
                                <label className={lbl}>Dealer Product URL</label>
                                <input className={inp} value={mappingForm.dealer_product_url} onChange={e => setMappingForm(f => ({ ...f, dealer_product_url: e.target.value }))} placeholder="https://…" />
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3 justify-end">
                            <button onClick={() => setMappingModal(null)} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:border-black transition-colors">Cancel</button>
                            <button onClick={saveMapping} disabled={saving} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors disabled:opacity-50">
                                {saving ? "Saving..." : mappingModal === "edit" ? "Update" : "Add Mapping"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ DELETE CONFIRM - DEALER ═══ */}
            {confirmDeleteDealer && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-sm shadow-2xl p-6 text-center">
                        <p className="text-sm font-bold mb-1">Delete dealer?</p>
                        <p className="text-xs text-gray-500 mb-6">&quot;{confirmDeleteDealer.display_name}&quot; will be permanently removed.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setConfirmDeleteDealer(null)} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:border-black transition-colors">Cancel</button>
                            <button onClick={() => deleteDealer(confirmDeleteDealer)} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ DELETE CONFIRM - MAPPING ═══ */}
            {confirmDeleteMapping && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-sm shadow-2xl p-6 text-center">
                        <p className="text-sm font-bold mb-1">Delete mapping?</p>
                        <p className="text-xs text-gray-500 mb-6">{confirmDeleteMapping.dealer_name} → {confirmDeleteMapping.product_name}</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setConfirmDeleteMapping(null)} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-[#E4E4E4] hover:border-black transition-colors">Cancel</button>
                            <button onClick={() => deleteMapping(confirmDeleteMapping)} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="font-serif text-4xl uppercase tracking-tight text-black mb-1">Dealers</h1>
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Manage dealer profiles and product mappings</p>
                </div>
                <button
                    onClick={activeTab === "dealers" ? openAddDealer : openAddMapping}
                    className="px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                    + {activeTab === "dealers" ? "Add Dealer" : "Add Mapping"}
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Dealers", value: dealers.length },
                    { label: "Active Dealers", value: activeCount },
                    { label: "Total Mappings", value: mappings.length },
                    { label: "Active Mappings", value: mappingActiveCount },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white border border-[#E4E4E4] rounded-sm p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
                        <p className="text-3xl font-black tracking-tighter text-black tabular-nums">{value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-[#E4E4E4]">
                {(["dealers", "mappings"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setMappingPage(1); }}
                        className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
                    >
                        {tab === "dealers" ? `Dealers (${dealers.length})` : `Product Mappings (${mappings.length})`}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading…</p>
                </div>
            ) : activeTab === "dealers" ? (

                /* ════════════════ DEALERS TABLE ════════════════ */
                <div className="bg-white border border-[#E4E4E4] rounded-sm overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-[#E4E4E4] bg-[#FAFAFA]">
                                {["Display Name", "Internal Name", "Code", "City", "Spot Offset", "Address", "Status", "Actions"].map(h => (
                                    <th key={h} className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dealers.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-16 text-[10px] font-black uppercase tracking-widest text-gray-400">No dealers found</td></tr>
                            ) : dealers.map((dealer, idx) => (
                                <tr key={dealer.id} className={`border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors ${idx === dealers.length - 1 ? "border-b-0" : ""}`}>
                                    <td className="p-4">
                                        <p className="text-sm font-black uppercase tracking-wider text-black whitespace-nowrap">{dealer.display_name}</p>
                                        <p className="text-[9px] text-gray-400 font-bold">{dealer.id.slice(0, 8)}…</p>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-gray-700 whitespace-nowrap">{dealer.name}</td>
                                    <td className="p-4">
                                        <span className="bg-[#F5F5F5] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">{dealer.code}</span>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-gray-600 whitespace-nowrap">{dealer.display_city}</td>
                                    <td className="p-4">
                                        <span className={`text-sm font-black tabular-nums ${dealer.spot_offset < 0 ? "text-red-500" : "text-green-600"}`}>
                                            {dealer.spot_offset >= 0 ? "+" : ""}{dealer.spot_offset}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[10px] text-gray-500 whitespace-nowrap">
                                        {dealer.shipping_address ? `${dealer.shipping_address.city ?? "—"}, ${dealer.shipping_address.state ?? ""}` : "—"}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap ${dealer.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {dealer.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center">
                                            <button onClick={() => openEditDealer(dealer)} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border border-[#E4E4E4] hover:border-black transition-all whitespace-nowrap">Edit</button>
                                            <button onClick={() => toggleDealer(dealer)} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all whitespace-nowrap ${dealer.is_active ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
                                                {dealer.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                            <button onClick={() => setConfirmDeleteDealer(dealer)} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border border-red-200 text-red-600 hover:bg-red-50 transition-all whitespace-nowrap">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            ) : (

                /* ════════════════ MAPPINGS TABLE ════════════════ */
                <MappingsTab
                    mappings={mappings}
                    mappingPage={mappingPage}
                    setMappingPage={setMappingPage}
                    pageSize={MAPPING_PAGE_SIZE}
                    openEditMapping={openEditMapping}
                    toggleMapping={toggleMapping}
                    setConfirmDeleteMapping={setConfirmDeleteMapping}
                />
            )}
        </div>
        </div>
    );
}
