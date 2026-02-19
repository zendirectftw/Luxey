"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
    id: string;
    name: string;
    slug: string;
    metal: string;
    category: string;
    category_id: string | null;
    categories: { name: string } | null; // Joined category
    weight_oz: number;
    purity: number;
    mint: string;
    year: number | null;
    image_url: string;
    is_active: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [metalFilter, setMetalFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        async function load() {
            // Fetch products with their linked category name
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name)")
                .order("name");

            if (!error && data) {
                // Map the joined data
                setProducts(data as any);
            }
            setLoading(false);
        }
        load();
    }, []);

    const filtered = products.filter(p => {
        // Search filter (name, category name, metal, mint)
        if (search) {
            const query = search.toLowerCase();
            const catName = p.categories?.name.toLowerCase() || "";
            const matchesSearch = 
                p.name.toLowerCase().includes(query) ||
                catName.includes(query) ||
                p.metal.toLowerCase().includes(query) ||
                (p.mint && p.mint.toLowerCase().includes(query));
            
            if (!matchesSearch) return false;
        }

        // Metal filter
        if (metalFilter !== "all" && p.metal.toLowerCase() !== metalFilter.toLowerCase()) return false;

        // Status filter
        if (statusFilter === "active" && !p.is_active) return false;
        if (statusFilter === "draft" && p.is_active) return false;

        return true;
    });

    const handleDelete = async (id: string) => {
        setDeleting(true);
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            // FK constraint = product is referenced by purchase orders
            const isFKError = error.message?.includes("foreign key") || error.code === "23503";
            showToast(
                isFKError
                    ? "Cannot delete — this product is linked to purchase orders."
                    : `Delete failed: ${error.message}`,
                "error"
            );
        } else {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast("Product deleted.");
        }
        setConfirmDeleteId(null);
        setDeleting(false);
    };

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Inventory</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading products...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-sm shadow-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                    toast.type === "success" ? "bg-black text-white" : "bg-red-600 text-white"
                }`}>
                    {toast.msg}
                </div>
            )}
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Inventory</h2>
                <Link
                    href="/admin/products/create"
                    className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all"
                >
                    + New Product
                </Link>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-[#E4E4E4] rounded-sm text-sm font-medium outline-none focus:border-black transition-all"
                        />
                    </div>
                    <select
                        value={metalFilter}
                        onChange={(e) => setMetalFilter(e.target.value)}
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                        <option value="all">All Metals</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="platinum">Platinum</option>
                        <option value="palladium">Palladium</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                {/* Empty State */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm p-16 text-center">
                        <p className="text-4xl mb-4">📦</p>
                        <p className="text-sm font-bold uppercase tracking-tight mb-2">
                            {products.length === 0 ? "No Products Yet" : "No Products Match Filters"}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                            {products.length === 0
                                ? "Add your first product to start building your catalog"
                                : "Try adjusting your search or filters"
                            }
                        </p>
                        {products.length === 0 && (
                            <Link
                                href="/admin/products/create"
                                className="inline-block px-8 py-2.5 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all"
                            >
                                + Add First Product
                            </Link>
                        )}
                    </div>
                ) : (
                    /* Table */
                    <div className="bg-white border border-[#E4E4E4] rounded-sm shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E4]">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Metal</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 p-1 flex-shrink-0">
                                                {product.image_url ? (
                                                    <Image src={product.image_url} alt={product.name} width={32} height={32} className="w-full h-full object-contain mix-blend-multiply" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold">IMG</div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-tight">{product.name}</span>
                                        </td>
                                        
                                        {/* Dynamic Category Column */}
                                        <td className="p-4 text-xs font-medium text-gray-600">
                                            {product.categories ? (
                                                <span className="bg-gray-100 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                                    {product.categories.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-[10px]">Uncategorized</span>
                                            )}
                                        </td>
                                        
                                        <td className="p-4 text-xs font-medium text-gray-600 capitalize">{product.metal}</td>
                                        <td className="p-4 text-xs font-medium text-gray-600">{product.weight_oz} oz</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${product.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {product.is_active ? "Active" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <Link href={`/admin/products/${product.id}/edit`} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                                    Edit
                                                </Link>
                                                {confirmDeleteId === product.id ? (
                                                    <span className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            disabled={deleting}
                                                            title="Confirm delete"
                                                            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            title="Cancel"
                                                            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDeleteId(product.id)}
                                                        title="Delete product"
                                                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
