"use client";

import { useState } from "react";

const initialCategories = [
    {
        name: "Gold",
        subs: [
            { name: "Gold Coins", products: 12 },
            { name: "Gold Bars", products: 8 },
            { name: "Gold Rounds", products: 3 },
        ],
    },
    {
        name: "Silver",
        subs: [
            { name: "Silver Coins", products: 15 },
            { name: "Silver Bars", products: 6 },
        ],
    },
    {
        name: "Platinum",
        subs: [
            { name: "Platinum Coins", products: 4 },
        ],
    },
];

export default function CategoriesPage() {
    const [categories] = useState(initialCategories);
    const [newName, setNewName] = useState("");
    const [parentCat, setParentCat] = useState("None (Top Level)");

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Category Management</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="grid grid-cols-3 gap-8">
                    {/* Create Category */}
                    <div className="bg-white p-6 border border-[#E4E4E4] shadow-sm h-fit rounded-sm">
                        <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">New Category</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Palladium"
                                />
                            </div>
                            <div>
                                <label className="form-label">Parent Category</label>
                                <select
                                    className="form-input"
                                    value={parentCat}
                                    onChange={(e) => setParentCat(e.target.value)}
                                >
                                    <option>None (Top Level)</option>
                                    {categories.map(c => (
                                        <option key={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-widest mt-2 hover:bg-zinc-800 transition-all">
                                Create Category
                            </button>
                        </div>
                    </div>

                    {/* Category Tree */}
                    <div className="col-span-2 bg-white border border-[#E4E4E4] shadow-sm overflow-hidden rounded-sm">
                        <div className="p-4 bg-[#FAFAFA] border-b border-[#E4E4E4] flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest">Current Structures</span>
                            <span className="text-[10px] text-gray-400">Click to assign products</span>
                        </div>
                        <div className="p-6 space-y-4">
                            {categories.map((cat, idx) => (
                                <div key={cat.name} className="border border-gray-100 rounded-sm">
                                    <div className="p-3 bg-gray-50 flex justify-between items-center">
                                        <span className="text-sm font-bold uppercase tracking-tight">
                                            {idx + 1}. {cat.name}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="text-[9px] font-black uppercase text-gray-400 hover:text-black transition-colors">
                                                Add Sub
                                            </button>
                                            <button className="text-[9px] font-black uppercase text-red-400 hover:text-red-600 transition-colors">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    {cat.subs.length > 0 && (
                                        <div className="pl-8 p-3 space-y-2 border-t border-gray-100">
                                            {cat.subs.map((sub) => (
                                                <div key={sub.name} className="flex justify-between items-center text-xs py-1">
                                                    <span className="text-gray-600">— {sub.name}</span>
                                                    <span className="text-[10px] font-bold text-[#D4AF37]">
                                                        {sub.products} Products
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
