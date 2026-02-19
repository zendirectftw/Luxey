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

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("name");

            if (!error && data) setProducts(data);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = products.filter(p => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (metalFilter !== "all" && p.metal !== metalFilter) return false;
        if (statusFilter === "active" && !p.is_active) return false;
        if (statusFilter === "draft" && p.is_active) return false;
        return true;
    });

    const categoryLabel = (cat: string) => {
        return cat.charAt(0).toUpperCase() + cat.slice(1) + "s";
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
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest"
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
                        className="bg-white border border-[#E4E4E4] px-6 rounded-sm text-xs font-bold uppercase tracking-widest"
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
                                        <td className="p-4 text-xs font-medium text-gray-600">{product.metal.charAt(0).toUpperCase() + product.metal.slice(1)} {categoryLabel(product.category)}</td>
                                        <td className="p-4 text-xs font-medium text-gray-600 capitalize">{product.metal}</td>
                                        <td className="p-4 text-xs font-medium text-gray-600">{product.weight_oz} oz</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${product.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {product.is_active ? "Active" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/products/${product.id}/edit`} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                                                Edit
                                            </Link>
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
