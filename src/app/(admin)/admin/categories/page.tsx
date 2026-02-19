"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    products: { count: number }[];
}

interface CategoryWithCount extends Category {
    product_count: number;
    children: CategoryWithCount[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [newName, setNewName] = useState("");
    const [newParentId, setNewParentId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = async () => {
        setLoading(true);
        // Fetch categories with product count
        const { data, error } = await supabase
            .from("categories")
            .select("*, products(count)");

        if (error) {
            console.error("Error fetching categories:", error);
            setError(error.message);
        } else {
            // Transform data to tree
            const rawCats = (data || []).map((c: any) => ({
                ...c,
                product_count: c.products?.[0]?.count || 0,
                children: []
            }));

            const tree: CategoryWithCount[] = [];
            const map = new Map<string, CategoryWithCount>();

            // First pass: create nodes
            rawCats.forEach((c: CategoryWithCount) => {
                map.set(c.id, c);
            });

            // Second pass: link children
            rawCats.forEach((c: CategoryWithCount) => {
                if (c.parent_id && map.has(c.parent_id)) {
                    map.get(c.parent_id)!.children.push(c);
                } else {
                    tree.push(c);
                }
            });
            
            // Sort keys
            const metalOrder = ["Gold", "Silver", "Platinum", "Palladium"];
            tree.sort((a, b) => {
                const idxA = metalOrder.indexOf(a.name);
                const idxB = metalOrder.indexOf(b.name);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.name.localeCompare(b.name);
            });

            setCategories(tree);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setIsSubmitting(true);

        const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const parentId = newParentId || null;

        const { error } = await supabase.from("categories").insert({
            name: newName,
            slug,
            parent_id: parentId
        });

        if (error) {
            alert(error.message);
        } else {
            setNewName("");
            setNewParentId("");
            fetchCategories();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the category.")) return;

        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            fetchCategories();
        }
    };

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0 sticky top-0 z-10">
                <h1 className="text-xs font-black uppercase tracking-[0.2em]">category Management</h1>
            </header>

            <div className="flex-1 bg-[#FAFAFA] p-10 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center p-10">
                         <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-8 max-w-6xl mx-auto">
                        
                        {/* LEFT COLUMN: Add New Category */}
                        <div className="col-span-4">
                            <div className="bg-white border border-[#E4E4E4] shadow-sm rounded-sm p-6 sticky top-8">
                                <h2 className="text-[11px] font-black uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
                                    {newParentId ? `Add Sub-Category for ${categories.find(c => c.id === newParentId)?.name}` : "Add New Category"}
                                </h2>
                                
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                            Name
                                        </label>
                                        <input 
                                            ref={nameInputRef}
                                            className="w-full bg-[#FAFAFA] border border-[#E4E4E4] px-4 py-3 text-xs font-medium focus:outline-none focus:border-black transition-colors placeholder-gray-300" 
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            placeholder={newParentId ? "e.g. Coins" : "e.g. Gold"}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                            Parent Category
                                        </label>
                                        <select 
                                            className="w-full bg-[#FAFAFA] border border-[#E4E4E4] px-4 py-3 text-xs font-medium focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                                            value={newParentId}
                                            onChange={e => setNewParentId(e.target.value)}
                                        >
                                            <option value="">— None (Top Level) —</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <p className="mt-2 text-[9px] text-gray-400 leading-relaxed">
                                                                                    </p>
                                    </div>

                                    <button 
                                        onClick={handleCreate}
                                        disabled={!newName.trim() || isSubmitting}
                                        className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        {isSubmitting ? "Creating..." : newParentId ? "Add Sub-Category" : "Create Category"}
                                    </button>
                                    
                                    {newParentId && (
                                        <button 
                                            onClick={() => setNewParentId("")}
                                            className="w-full text-[9px] text-gray-400 hover:text-black mt-2 underline transition-colors"
                                        >
                                            Cancel Sub-Category Mode
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Current Structures */}
                        <div className="col-span-8">
                            <div className="bg-white border border-[#E4E4E4] shadow-sm rounded-sm p-8 min-h-[500px]">
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                    <h2 className="text-[11px] font-black uppercase tracking-widest">Current Structures</h2>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hidden sm:inline">
                                        Click to assign products
                                    </span>
                                </div>

                                <div className="space-y-8">
                                    {categories.map((parent, index) => (
                                        <div key={parent.id} className="group pb-6 border-b border-dashed border-gray-100 last:border-0 last:pb-0">
                                            {/* Parent Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-black">{index + 1}.</span>
                                                    <span className="text-sm font-black uppercase text-black">{parent.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button 
                                                        onClick={() => {
                                                            setNewParentId(parent.id);
                                                            setNewName("");
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            setTimeout(() => nameInputRef.current?.focus(), 100);
                                                        }}
                                                        className="text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        Add Sub
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(parent.id)}
                                                        className="text-[9px] font-black uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="pl-8 space-y-2 border-l-2 border-gray-50 ml-2">
                                                {parent.children.length === 0 ? (
                                                    <p className="text-[10px] text-gray-300 italic py-2 pl-2">No sub-categories yet.</p>
                                                ) : (
                                                    parent.children.map(child => (
                                                        <div key={child.id} className="flex items-center justify-between group/child py-2 pl-2 hover:bg-gray-50 rounded-sm transition-colors -ml-2 pr-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-gray-300 text-xs">—</span>
                                                                <span className="text-xs text-gray-600 font-bold">{child.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[9px] font-black text-yellow-500 uppercase tracking-wider">
                                                                    {child.product_count} Products
                                                                </span>
                                                                <button 
                                                                    onClick={() => handleDelete(child.id)}
                                                                    className="text-[9px] font-bold text-gray-300 hover:text-red-500 transition-all uppercase tracking-widest"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
