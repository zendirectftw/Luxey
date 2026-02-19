"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AttributeValue {
    id: string;
    value: string;
    display_order: number;
}

interface AttributeGroup {
    id: string;
    name: string;
    slug: string;
    items: AttributeValue[];
}

export default function AttributesPage() {
    const [groups, setGroups] = useState<AttributeGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [newValues, setNewValues] = useState<Record<string, string>>({});
    const [newAttributeName, setNewAttributeName] = useState("");
    const [isCreatingAttribute, setIsCreatingAttribute] = useState(false);

    // Fetch initial data
    const fetchAttributes = async () => {
        setLoading(true);
        const { data: attributes, error: attrError } = await supabase
            .from("attributes")
            .select("*, attribute_values(id, value, display_order)")
            .order("name");

        if (attrError) {
            console.error("Error fetching attributes:", attrError);
        } else {
            // Transform to UI structure
            const mapped: AttributeGroup[] = attributes.map((a: any) => ({
                id: a.id,
                name: a.name,
                slug: a.slug,
                items: (a.attribute_values || []).sort((a: any, b: any) => a.display_order - b.display_order)
            }));
            setGroups(mapped);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const addAttribute = async () => {
        if (!newAttributeName.trim()) return;
        
        const slug = newAttributeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        
        const { error } = await supabase.from("attributes").insert({
            name: newAttributeName.trim(),
            slug
        });

        if (error) {
            alert(error.message);
        } else {
            setNewAttributeName("");
            setIsCreatingAttribute(false);
            fetchAttributes();
        }
    };

    const deleteAttribute = async (id: string, name: string) => {
        if (!confirm(`Delete attribute "${name}" and all its values?`)) return;
        
        const { error } = await supabase.from("attributes").delete().eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            fetchAttributes();
        }
    };

    const addValue = async (groupId: string, groupName: string) => {
        const val = newValues[groupName]?.trim();
        if (!val) return;

        // Optimistic update? No, let's just refetch or push to state for simplicity first.
        const currentGroup = groups.find(g => g.id === groupId);
        const nextOrder = (currentGroup?.items.length || 0) + 1;
        const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const { error } = await supabase.from("attribute_values").insert({
            attribute_id: groupId,
            value: val,
            slug,
            display_order: nextOrder
        });

        if (error) {
            alert(error.message);
        } else {
            setNewValues(prev => ({ ...prev, [groupName]: "" }));
            fetchAttributes();
        }
    };

    const removeValue = async (valueId: string) => {
        if (!confirm("Remove this value?")) return;

        const { error } = await supabase.from("attribute_values").delete().eq("id", valueId);
        if (error) {
            alert(error.message);
        } else {
            fetchAttributes();
        }
    };

    return (
        <>
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0 sticky top-0 z-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Attributes</h2>
                <button
                    onClick={() => setIsCreatingAttribute(true)}
                    className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                    + New Attribute Group
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                {/* Create Attribute Form */}
                {isCreatingAttribute && (
                    <div className="max-w-5xl mx-auto mb-8 bg-white border border-black p-6 shadow-md animate-in slide-in-from-top-2">
                        <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Create New Attribute Group</h3>
                        <div className="flex gap-4">
                            <input 
                                autoFocus
                                value={newAttributeName}
                                onChange={e => setNewAttributeName(e.target.value)}
                                placeholder="e.g. Gemstone Type"
                                className="flex-1 border border-[#E4E4E4] px-4 text-sm font-medium outline-none focus:border-black"
                                onKeyDown={e => e.key === "Enter" && addAttribute()}
                            />
                            <button 
                                onClick={addAttribute}
                                className="bg-black text-white px-6 text-[10px] font-black uppercase tracking-widest"
                            >
                                Create
                            </button>
                            <button 
                                onClick={() => setIsCreatingAttribute(false)}
                                className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-black"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center mt-20">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center mt-20 text-gray-400">
                        <p className="text-sm font-bold uppercase tracking-widest">No attributes found.</p>
                        <p className="text-[10px] mt-2">Tables might be empty or missing.</p>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto space-y-8">
                        {groups.map((group) => (
                            <div key={group.id} className="bg-white border border-[#E4E4E4] shadow-sm rounded-sm overflow-hidden">
                                <div className="p-6 border-b border-[#E4E4E4] flex justify-between items-center bg-[#FAFAFA]">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest">{group.name}</h3>
                                        <span className="text-[10px] font-bold text-gray-400">ID: {group.slug}</span>
                                    </div>
                                    <button 
                                        onClick={() => deleteAttribute(group.id, group.name)}
                                        className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        Delete Group
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {group.items.length === 0 && (
                                            <p className="text-[10px] text-gray-300 italic">No values yet.</p>
                                        )}
                                        {group.items.map((item) => (
                                            <span
                                                key={item.id}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider group relative pr-8"
                                            >
                                                {item.value}
                                                <button
                                                    onClick={() => removeValue(item.id)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors text-base leading-none opacity-0 group-hover:opacity-100"
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
                                            className="w-full border border-[#E4E4E4] px-4 py-3 text-xs font-medium focus:outline-none focus:border-black transition-colors"
                                            value={newValues[group.name] || ""}
                                            onChange={(e) =>
                                                setNewValues(prev => ({ ...prev, [group.name]: e.target.value }))
                                            }
                                            onKeyDown={(e) => e.key === "Enter" && addValue(group.id, group.name)}
                                        />
                                        <button
                                            onClick={() => addValue(group.id, group.name)}
                                            className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shrink-0"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
