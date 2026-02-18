"use client";

import { useState } from "react";

const attributeGroups = [
    {
        name: "Metal Types",
        items: ["Gold", "Silver", "Platinum", "Palladium"],
    },
    {
        name: "Weight Classes",
        items: ["1/10 oz", "1/4 oz", "1/2 oz", "1 oz", "5 oz", "10 oz", "100g", "1 kg"],
    },
    {
        name: "Mints",
        items: ["PAMP Suisse", "Royal Canadian Mint", "Perth Mint", "U.S. Mint", "Royal Mint", "Rand Refinery", "Valcambi"],
    },
    {
        name: "Purity",
        items: [".9999 Fine", ".999 Fine", ".9167 Fine", ".900 Fine"],
    },
    {
        name: "Product Types",
        items: ["Coin", "Bar", "Round", "Cast Bar", "Minted Bar"],
    },
];

export default function AttributesPage() {
    const [groups, setGroups] = useState(attributeGroups);
    const [newValues, setNewValues] = useState<Record<string, string>>({});

    const addValue = (groupName: string) => {
        const val = newValues[groupName]?.trim();
        if (!val) return;
        setGroups(prev =>
            prev.map(g =>
                g.name === groupName ? { ...g, items: [...g.items, val] } : g
            )
        );
        setNewValues(prev => ({ ...prev, [groupName]: "" }));
    };

    const removeValue = (groupName: string, index: number) => {
        setGroups(prev =>
            prev.map(g =>
                g.name === groupName ? { ...g, items: g.items.filter((_, i) => i !== index) } : g
            )
        );
    };

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Attributes</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="max-w-5xl mx-auto space-y-8">
                    {groups.map((group) => (
                        <div key={group.name} className="bg-white border border-[#E4E4E4] shadow-sm rounded-sm overflow-hidden">
                            <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center bg-[#FAFAFA]">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">{group.name}</h3>
                                <span className="text-[10px] font-bold text-gray-400">{group.items.length} values</span>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {group.items.map((item, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider group"
                                        >
                                            {item}
                                            <button
                                                onClick={() => removeValue(group.name, i)}
                                                className="text-gray-300 hover:text-red-500 transition-colors text-base leading-none opacity-0 group-hover:opacity-100"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Add new ${group.name.toLowerCase().replace(/s$/, "")}...`}
                                        className="form-input text-xs flex-1"
                                        value={newValues[group.name] || ""}
                                        onChange={(e) =>
                                            setNewValues(prev => ({ ...prev, [group.name]: e.target.value }))
                                        }
                                        onKeyDown={(e) => e.key === "Enter" && addValue(group.name)}
                                    />
                                    <button
                                        onClick={() => addValue(group.name)}
                                        className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shrink-0"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
