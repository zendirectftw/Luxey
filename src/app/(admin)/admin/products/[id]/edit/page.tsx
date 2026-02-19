"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface Product {
    id: string;
    name: string;
    slug: string;
    metal: string;
    category: string;
    weight_oz: number;
    purity: number;
    mint: string | null;
    year: number | null;
    image_url: string | null;
    description: string | null;
    images: { url: string; file_name: string; position: number; is_default: boolean }[] | null;
    is_active: boolean;
    updated_at: string | null;
    created_at: string;
}

const formatDisplayName = (name: string) => {
    // Matches: timestamp (13 chars) - name
    const match = name.match(/^\d{13}-(.+)$/);
    return match ? match[1] : name;
};

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form state matched to real DB columns
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [metal, setMetal] = useState("Gold");
    const [weightLabel, setWeightLabel] = useState("1 oz");
    const [purityLabel, setPurityLabel] = useState(".9999 Fine");
    const [mint, setMint] = useState("");
    const [category, setCategory] = useState("Bar");
    const [year, setYear] = useState("");
    const [isActive, setIsActive] = useState(true);

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

    // Image gallery state
    const [bucketFiles, setBucketFiles] = useState<StorageFile[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [selectedImages, setSelectedImages] = useState<ProductImage[]>([]);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [urlInput, setUrlInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);


    const metalGroup = getAttributeGroup("metal")!;
    const weightGroup = getAttributeGroup("weight_oz")!;
    const purityGroup = getAttributeGroup("purity")!;
    const mintGroup = getAttributeGroup("mint")!;
    const categoryGroup = getAttributeGroup("category")!;

    // ─── Load product ────────────────────────────────────
    useEffect(() => {
        async function load() {
            const { data, error: err } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (err || !data) {
                setLoading(false);
                return;
            }

            const p = data as Product;
            setProduct(p);
            setName(p.name || "");
            setDescription(p.description || "");
            setMetal(p.metal ? p.metal.charAt(0).toUpperCase() + p.metal.slice(1) : "Gold");
            setWeightLabel(ozToWeightLabel(p.weight_oz || 1));
            setPurityLabel(numberToPurityLabel(p.purity || 0.9999));
            setMint(p.mint || "");
            setCategory(p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Bar");
            setYear(p.year ? String(p.year) : "");
            setIsActive(p.is_active ?? true);

            // Restore previously selected images from saved JSON
            if (p.images && Array.isArray(p.images) && p.images.length > 0) {
                const restored: ProductImage[] = p.images
                    .sort((a, b) => a.position - b.position)
                    .map(img => ({
                        url: img.url,
                        fileName: img.file_name,
                        isDefault: img.is_default,
                    }));
                setSelectedImages(restored);
            } else if (p.image_url) {
                // Fallback for products created before images column existed
                setSelectedImages([{ url: p.image_url, fileName: "image", isDefault: true }]);
            }

            setLoading(false);
        }
        load();
    }, [id]);

    // ─── Load bucket files ────────────────────────────────
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

    // ─── Image management ─────────────────────────────────
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
        setSaved(false);
    };

    const setDefault = (index: number) => {
        setSelectedImages(prev => prev.map((img, i) => ({ ...img, isDefault: i === index })));
        setSaved(false);
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => {
            const next = prev.filter((_, i) => i !== index);
            if (prev[index].isDefault && next.length > 0) next[0].isDefault = true;
            return next;
        });
        setSaved(false);
    };

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
                if (prev.length === 0 && newImages.length > 0) {
                    combined[0].isDefault = true;
                }
                return combined;
            });

            // Optimistically update bucket files
            setBucketFiles(prev => [...newBucketFiles, ...prev]);
            setSaved(false);
        } catch (err: any) {
            setError(err.message || "Failed to upload image");
        } finally {
            setUploading(false);
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
            setSaved(false);
        }
        setUrlInput("");
    };

    // ─── Save ─────────────────────────────────────────────
    const handleSave = async () => {
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

        const { error: err } = await supabase
            .from("products")
            .update({
                name: name.trim(),
                metal: metal.toLowerCase() as "gold" | "silver" | "platinum" | "palladium",
                category: category.toLowerCase() as "coin" | "bar" | "round",
                weight_oz: weightLabelToOz(weightLabel),
                purity: purityLabelToNumber(purityLabel),
                mint: mint || null,
                year: year ? parseInt(year) : null,
                image_url: defaultImage?.url || null,
                images: imagesJson,
                description: description.trim() || null,
                is_active: isActive,
            })
            .eq("id", id);

        if (err) {
            setError(err.message);
        } else {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    // ─── Delete ───────────────────────────────────────────
    const handleDelete = async () => {
        setDeleting(true);
        const { error: err } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (err) {
            setError(err.message);
            setDeleting(false);
            setShowDeleteConfirm(false);
        } else {
            router.push("/admin/products");
        }
    };

    if (loading) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Management</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading product...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center px-10 shrink-0">
                    <Link href="/admin/products" className="text-gray-400 hover:text-black transition-colors mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Not Found</h2>
                </header>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                        <p className="text-4xl mb-4">📦</p>
                        <p className="text-sm font-bold uppercase tracking-tight mb-2">Product Not Found</p>
                        <Link href="/admin/products" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase underline tracking-widest">
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Toast notification */}
            <div
                className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 shadow-2xl transition-all duration-300 ${
                    saved
                        ? "translate-y-0 opacity-100 bg-black text-white"
                        : error
                        ? "translate-y-0 opacity-100 bg-red-600 text-white"
                        : "translate-y-4 opacity-0 pointer-events-none bg-black text-white"
                }`}
            >
                {saved && (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Changes saved</span>
                    </>
                )}
                {error && !saved && (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                        <button onClick={() => setError(null)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
                    </>
                )}
            </div>
            {/* Delete confirm overlay */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-10 max-w-sm w-full mx-4 shadow-2xl">
                        <p className="text-sm font-black uppercase tracking-tight mb-2">Delete Product?</p>
                        <p className="text-[11px] text-gray-500 mb-8">
                            This will permanently delete <span className="font-bold text-black">{product.name}</span> and cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2.5 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 text-[10px] font-black uppercase bg-red-600 text-white hover:bg-red-700 transition-all tracking-widest disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Management</h2>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Edit Product</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded ${isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {isActive ? "Active" : "Draft"}
                    </span>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-5 py-2 text-[10px] font-black uppercase border border-red-200 text-red-600 hover:bg-red-50 transition-all tracking-widest"
                    >
                        Delete
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-8 py-2 text-[10px] font-black uppercase shadow-lg hover:shadow-xl transition-all tracking-widest disabled:opacity-50 ${
                            saved ? "bg-green-600 text-white" : "bg-black text-white"
                        }`}
                    >
                        {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    {/* Meta Banner */}
                    <div className="flex items-center gap-4 px-6 py-3 bg-white border border-[#E4E4E4] rounded-sm shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Slug</span>
                        <span className="text-sm font-mono font-bold">{product.slug}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Last Modified</span>
                        <span className="text-xs font-bold text-gray-500">
                            {product.updated_at ? new Date(product.updated_at).toLocaleString() : new Date(product.created_at).toLocaleString()}
                        </span>
                    </div>

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
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); setSaved(false); }}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea
                                            rows={6}
                                            className="form-input"
                                            value={description}
                                            onChange={(e) => { setDescription(e.target.value); setSaved(false); }}
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
                                        <select
                                            className="form-input"
                                            value={metal}
                                            onChange={(e) => { setMetal(e.target.value); setSaved(false); }}
                                        >
                                            {(dynamicAttributes["metal"] || metalGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Weight</label>
                                        <select
                                            className="form-input"
                                            value={weightLabel}
                                            onChange={(e) => { setWeightLabel(e.target.value); setSaved(false); }}
                                        >
                                            {(dynamicAttributes["weight-classes"] || weightGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Purity</label>
                                        <select
                                            className="form-input"
                                            value={purityLabel}
                                            onChange={(e) => { setPurityLabel(e.target.value); setSaved(false); }}
                                        >
                                            {(dynamicAttributes["purity"] || purityGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Mint</label>
                                        <select
                                            className="form-input"
                                            value={mint}
                                            onChange={(e) => { setMint(e.target.value); setSaved(false); }}
                                        >
                                            <option value="">— Select —</option>
                                            {(dynamicAttributes["mint"] || mintGroup.items).map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-input"
                                            value={category}
                                            onChange={(e) => { setCategory(e.target.value); setSaved(false); }}
                                        >
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
                                            onChange={(e) => { setYear(e.target.value); setSaved(false); }}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visibility + Gallery */}
                        <div className="space-y-8">
                            {/* Store Visibility */}
                            <div className="bg-white p-8 border border-[#E4E4E4] shadow-sm rounded-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">Store Visibility</h3>
                                <label className="flex items-center gap-4 p-4 border border-gray-100 bg-gray-50 rounded-sm cursor-pointer hover:border-black transition-all">
                                    <input
                                        type="checkbox"
                                        className="luxey-checkbox"
                                        checked={isActive}
                                        onChange={(e) => { setIsActive(e.target.checked); setSaved(false); }}
                                    />
                                    <div>
                                        <p className="text-[11px] font-black uppercase">Active / Visible</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Display to customers</p>
                                    </div>
                                </label>
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
                                                        className={`text-sm transition-colors ${img.isDefault ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
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
