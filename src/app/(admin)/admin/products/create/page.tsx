"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    attributeGroups,
    weightLabelToOz,
    ozToWeightLabel,
    purityLabelToNumber,
    numberToPurityLabel,
    getAttributeGroup,
} from "@/lib/productAttributes";

interface StorageFile {
    name: string;
    url: string;
}

interface ProductImage {
    url: string;
    fileName: string;
    isDefault: boolean;
}

const formatDisplayName = (name: string) => {
    // Matches: timestamp (13 chars) - name
    const match = name.match(/^\d{13}-(.+)$/);
    return match ? match[1] : name;
};

export default function CreateProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [metal, setMetal] = useState("Gold");
    const [weightLabel, setWeightLabel] = useState("1 oz");
    const [purityLabel, setPurityLabel] = useState(".9999 Fine");
    const [mint, setMint] = useState("");
    const [category, setCategory] = useState("Bar");
    const [year, setYear] = useState("");
    const [isActive, setIsActive] = useState(false);

    // Dynamic attributes state
    const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchAttributes = async () => {
            const { data } = await supabase
                .from("attributes")
                .select("slug, attribute_values(value, display_order)");
            
            if (data) {
                const map: Record<string, string[]> = {};
                data.forEach((attr: any) => {
                    if (attr.attribute_values) {
                        map[attr.slug] = attr.attribute_values
                            .sort((a: any, b: any) => a.display_order - b.display_order)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((v: any) => v.value);
                    }
                });
                setDynamicAttributes(map);
            }
        };
        fetchAttributes();
    }, []);

    // Image management – storage bucket browser
    const [bucketFiles, setBucketFiles] = useState<StorageFile[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [selectedImages, setSelectedImages] = useState<ProductImage[]>([]);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [urlInput, setUrlInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const generateSlug = (name: string) =>
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const slug = generateSlug(name);

    // ─── Load bucket files on mount ─────────────────────
    useEffect(() => {
        async function loadBucketFiles() {
            setLoadingFiles(true);
            try {
                const res = await fetch("/api/admin/storage-list");
                const json = await res.json();
                if (json.files) {
                    setBucketFiles(json.files);
                }
            } catch {
                // silently fail — bucket picker just shows empty
            }
            setLoadingFiles(false);
        }
        loadBucketFiles();
    }, []);

    // ─── Image selection ────────────────────────────────
    const toggleImage = (file: StorageFile) => {
        setSelectedImages(prev => {
            const exists = prev.find(img => img.fileName === file.name);
            if (exists) {
                const next = prev.filter(img => img.fileName !== file.name);
                if (exists.isDefault && next.length > 0) next[0].isDefault = true;
                return next;
            }
            return [...prev, { url: file.url, fileName: file.name, isDefault: prev.length === 0 }];
        });
    };

    const setDefault = (index: number) => {
        setSelectedImages(prev => prev.map((img, i) => ({ ...img, isDefault: i === index })));
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => {
            const next = prev.filter((_, i) => i !== index);
            if (prev[index].isDefault && next.length > 0) next[0].isDefault = true;
            return next;
        });
    };

    // ─── Drag reorder ───────────────────────────────────
    const handleDragStart = (index: number) => setDragIdx(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === index) return;
        setSelectedImages(prev => {
            const next = [...prev];
            const [moved] = next.splice(dragIdx, 1);
            next.splice(index, 0, moved);
            return next;
        });
        setDragIdx(index);
    };
    const handleDragEnd = () => setDragIdx(null);

    // ─── File Upload (Drag & Drop) ─────────────────────
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);

        const newImages: ProductImage[] = [];
        const newBucketFiles: StorageFile[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith("image/")) continue;

                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Upload failed");

                newImages.push({
                    url: data.url,
                    fileName: data.name,
                    isDefault: false,
                });

                newBucketFiles.push({ name: data.name, url: data.url });
            }

            setSelectedImages(prev => {
                const combined = [...prev, ...newImages];
                // If no default was set, set the first new image as default (if it's the only one)
                if (prev.length === 0 && newImages.length > 0) {
                    combined[0].isDefault = true;
                }
                return combined;
            });

            // Optimistically update bucket files
            setBucketFiles(prev => [...newBucketFiles, ...prev]);
        } catch (err: any) {
            setError(err.message || "Failed to upload image");
        } finally {
            setUploading(false);
            setSaved(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    // ─── Add image by URL ──────────────────────────────
    const addImageFromUrl = () => {
        const url = urlInput.trim();
        if (!url) return;
        const fileName = url.split("/").pop()?.split("?")[0] || url;
        const alreadyAdded = selectedImages.some(img => img.url === url);
        if (!alreadyAdded) {
            setSelectedImages(prev => [...prev, { url, fileName, isDefault: prev.length === 0 }]);
        }
        setUrlInput("");
    };

    // ─── Auto-create dealer mappings + live_quotes ──────
    const createDealerMappings = useCallback(async (productId: string) => {
        const { data: dealers } = await supabase
            .from("dealers")
            .select("id, code, spot_offset")
            .eq("is_active", true);

        if (!dealers || dealers.length === 0) return;

        const mappings = dealers.map(d => ({
            dealer_id: d.id,
            product_id: productId,
            is_active: true,
        }));

        await supabase
            .from("dealer_product_mapping")
            .upsert(mappings, { onConflict: "dealer_id,product_id" });

        const weightOz = weightLabelToOz(weightLabel);
        const metalLower = metal.toLowerCase();
        const getPremium = (dealerCode: string) => {
            const basePremiums: Record<string, Record<string, number>> = {
                UGC: { gold_bulk: 0.80, gold_mid: 1.20, gold_1oz: 1.50, silver: 3.50, platinum: 2.50, other: 2.00 },
                APMEX: { gold_bulk: 1.20, gold_mid: 1.80, gold_1oz: 2.20, silver: 4.50, platinum: 3.50, other: 3.00 },
                AMARK: { gold_bulk: 1.50, gold_mid: 2.00, gold_1oz: 2.50, silver: 5.00, platinum: 4.00, other: 3.50 },
            };
            const p = basePremiums[dealerCode] || basePremiums.AMARK;
            if (metalLower === "gold" && weightOz >= 10) return p.gold_bulk;
            if (metalLower === "gold" && weightOz >= 3) return p.gold_mid;
            if (metalLower === "gold") return p.gold_1oz;
            if (metalLower === "silver") return p.silver;
            if (metalLower === "platinum") return p.platinum;
            return p.other;
        };

        const quotes = dealers.map(d => ({
            dealer_id: d.id,
            product_id: productId,
            kitco_spot: 0,
            dealer_adjustment: d.spot_offset,
            premium: getPremium(d.code),
            bid_price: 0,
            ask_price: 0,
            effective_premium_vs_kitco: getPremium(d.code),
        }));

        await supabase
            .from("live_quotes")
            .upsert(quotes, { onConflict: "dealer_id,product_id" });
    }, [metal, weightLabel]);

    // ─── Save product ───────────────────────────────────
    const handleSave = async (publish: boolean) => {
        if (!name.trim()) { setError("Product name is required"); return; }

        setSaving(true);
        setError(null);

        const defaultImage = selectedImages.find(img => img.isDefault);
        const imagesJson = selectedImages.map((img, i) => ({
            url: img.url,
            file_name: img.fileName,
            position: i,
            is_default: img.isDefault,
        }));

        const { data, error: insertError } = await supabase.from("products").insert({
            name: name.trim(),
            slug: generateSlug(name),
            metal: metal.toLowerCase(),
            category: category.toLowerCase().replace(" ", "_"),
            weight_oz: weightLabelToOz(weightLabel),
            purity: purityLabelToNumber(purityLabel),
            mint: mint || null,
            year: year ? parseInt(year) : null,
            image_url: defaultImage?.url || null,
            images: imagesJson,
            description: description.trim() || null,
            is_active: publish,
        }).select("id").single();

        if (insertError) {
            setError(insertError.message);
            setSaving(false);
            return;
        }

        if (data?.id) {
            await createDealerMappings(data.id);
        }

        setSaved(true);
        setTimeout(() => router.push("/admin/products"), 1000);
    };

    // ─── Attribute group lookups ─────────────────────────
    const metalGroup = getAttributeGroup("metal")!;
    const weightGroup = getAttributeGroup("weight_oz")!;
    const purityGroup = getAttributeGroup("purity")!;
    const mintGroup = getAttributeGroup("mint")!;
    const categoryGroup = getAttributeGroup("category")!;

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Management</h2>
                    <span className="text-gray-300">/</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Create New Listing</span>
                </div>
                <div className="flex items-center gap-3">
                    {error && (
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                            ✕ {error}
                        </span>
                    )}
                    {saved && (
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                            ✓ Product Created!
                        </span>
                    )}
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="px-8 py-2 text-[10px] font-black uppercase bg-black text-white shadow-lg hover:shadow-xl transition-all tracking-widest disabled:opacity-50"
                    >
                        {saving ? "Publishing..." : "Publish Product"}
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left: Primary Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* General Information */}
                            <div className="bg-white p-8 border border-[#E4E4E4] shadow-sm rounded-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">
                                    General Information
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1 oz PAMP Fortuna Gold Bar"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-input"
                                        />
                                        {name.trim() && (
                                            <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Slug: <span className="font-mono text-gray-600">{slug}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea
                                            rows={6}
                                            className="form-input"
                                            placeholder="Enter full product details and history..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specifications */}
                            <div className="bg-white p-8 border border-[#E4E4E4] shadow-sm rounded-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">
                                    Technical Specifications
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="form-label">Metal Type</label>
                                        <select className="form-input" value={metal} onChange={(e) => setMetal(e.target.value)}>
                                            {(dynamicAttributes["metal"] || metalGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Weight</label>
                                        <select className="form-input" value={weightLabel} onChange={(e) => setWeightLabel(e.target.value)}>
                                            {(dynamicAttributes["weight-classes"] || weightGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Purity</label>
                                        <select className="form-input" value={purityLabel} onChange={(e) => setPurityLabel(e.target.value)}>
                                            {(dynamicAttributes["purity"] || purityGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Mint</label>
                                        <select className="form-input" value={mint} onChange={(e) => setMint(e.target.value)}>
                                            <option value="">— Select —</option>
                                            {(dynamicAttributes["mint"] || mintGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Category</label>
                                        <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                                            {(dynamicAttributes["product-types"] || categoryGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Year</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 2026"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Images & Visibility */}
                        <div className="space-y-8">
                            {/* Store Visibility */}
                            <div className="bg-white p-8 border border-[#E4E4E4] shadow-sm rounded-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">Store Visibility</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-4 p-4 border border-gray-100 bg-gray-50 rounded-sm cursor-pointer hover:border-black transition-all">
                                        <input
                                            type="checkbox"
                                            className="luxey-checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                        />
                                        <div>
                                            <p className="text-[11px] font-black uppercase">Active / Visible</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Display to customers</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Product Gallery — Storage Bucket Picker */}
                            <div className="bg-white p-8 border border-[#E4E4E4] shadow-sm rounded-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">Product Gallery</h3>

                                {/* Dropzone */}
                                <div
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                    className={`relative border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all mb-6 ${
                                        isDragging ? "border-black bg-gray-50" : "border-[#E4E4E4] hover:border-gray-400"
                                    }`}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Uploading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-2xl mb-2">☁️</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">
                                                Drag & Drop or Click to Upload
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">
                                                Supports JPG, PNG, WEBP
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Selected images (reorderable) */}
                                {selectedImages.length > 0 && (
                                    <div className="space-y-2 mb-6">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                            Selected — drag to reorder, click ★ for default
                                        </p>
                                        <div className="space-y-2">
                                            {selectedImages.map((img, i) => (
                                                <div
                                                    key={img.fileName}
                                                    draggable
                                                    onDragStart={() => handleDragStart(i)}
                                                    onDragOver={(e) => handleDragOver(e, i)}
                                                    onDragEnd={handleDragEnd}
                                                    className={`flex items-center gap-3 p-3 border rounded-sm cursor-grab active:cursor-grabbing transition-all ${img.isDefault
                                                            ? "border-black bg-gray-50"
                                                            : "border-[#E4E4E4] hover:border-gray-400"
                                                        } ${dragIdx === i ? "opacity-50" : ""}`}
                                                >
                                                    <span className="text-gray-300 text-xs">⠿</span>
                                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0">
                                                        <Image
                                                            src={img.url}
                                                            alt={img.fileName}
                                                            width={40}
                                                            height={40}
                                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600 flex-1 truncate">
                                                        {formatDisplayName(img.fileName)}
                                                    </span>
                                                    <button
                                                        onClick={() => setDefault(i)}
                                                        className={`text-sm transition-colors ${img.isDefault ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                                                            }`}
                                                        title="Set as default"
                                                    >
                                                        ★
                                                    </button>
                                                    <button
                                                        onClick={() => removeImage(i)}
                                                        className="text-gray-300 hover:text-red-500 text-sm transition-colors"
                                                        title="Remove"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bucket file browser */}
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                        Storage Bucket — click to select
                                    </p>
                                    {loadingFiles ? (
                                        <div className="text-center py-8">
                                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading files...</p>
                                        </div>
                                    ) : bucketFiles.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-[#E4E4E4] rounded-sm">
                                            <p className="text-2xl mb-2">📁</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                No files in storage bucket
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">
                                                Upload images via Supabase Dashboard
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                            {bucketFiles.map(file => {
                                                const isSelected = selectedImages.some(img => img.fileName === file.name);
                                                return (
                                                    <button
                                                        key={file.name}
                                                        onClick={() => toggleImage(file)}
                                                        className={`group relative aspect-square bg-gray-50 border-2 rounded-sm p-1 transition-all ${isSelected
                                                                ? "border-black ring-1 ring-black"
                                                                : "border-[#E4E4E4] hover:border-gray-400"
                                                            }`}
                                                    >
                                                        <Image
                                                            src={file.url}
                                                            alt={file.name}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                        />
                                                        {isSelected && (
                                                            <div className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                                                                <span className="text-white text-[8px] font-black">✓</span>
                                                            </div>
                                                        )}
                                                        <p className="absolute bottom-0 left-0 right-0 bg-white/90 text-[7px] font-bold text-gray-500 text-center py-0.5 truncate px-1">
                                                            {formatDisplayName(file.name)}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* URL input */}
                                <div className="mt-4 pt-4 border-t border-[#E4E4E4]">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                        Or paste image URL
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="https://...supabase.co/storage/..."
                                            value={urlInput}
                                            onChange={e => setUrlInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && addImageFromUrl()}
                                            className="flex-1 text-[10px] border border-[#E4E4E4] px-3 py-2 font-mono focus:outline-none focus:border-black"
                                        />
                                        <button
                                            onClick={addImageFromUrl}
                                            className="px-3 py-2 text-[9px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
