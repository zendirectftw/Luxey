"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Product {
    id: string;
    name: string;
    description: string;
    metal_type: string;
    weight_label: string;
    purity: string;
    mint: string;
    product_type: string;
    series: string;
    category: string;
    is_featured: boolean;
    is_active: boolean;
    sku: string;
    image_url: string | null;
    updated_at: string;
}

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({
        name: "", description: "", metal_type: "Gold", weight_label: "", purity: "",
        mint: "", product_type: "", series: "", category: "Gold Bars",
        is_featured: false, is_active: true, sku: "", image_url: "",
    });
    const [imgUrl, setImgUrl] = useState("");
    const [images, setImages] = useState<{ url: string; isDefault: boolean }[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            setProduct(data);
            setForm({
                name: data.name || "",
                description: data.description || "",
                metal_type: data.metal_type || "Gold",
                weight_label: data.weight_label || "",
                purity: data.purity || "",
                mint: data.mint || "",
                product_type: data.product_type || "",
                series: data.series || "",
                category: data.category || "Gold Bars",
                is_featured: data.is_featured || false,
                is_active: data.is_active || false,
                sku: data.sku || "",
                image_url: data.image_url || "",
            });

            // Initialize image gallery
            if (data.image_url) {
                setImages([{ url: data.image_url, isDefault: true }]);
            }

            setLoading(false);
        }
        load();
    }, [id]);

    const updateField = (field: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const addImage = () => {
        if (!imgUrl.trim()) return;
        setImages(prev => [...prev, { url: imgUrl, isDefault: prev.length === 0 }]);
        setImgUrl("");
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const next = prev.filter((_, i) => i !== index);
            if (prev[index].isDefault && next.length > 0) next[0].isDefault = true;
            return next;
        });
    };

    const setDefault = (index: number) => {
        setImages(prev => prev.map((img, i) => ({ ...img, isDefault: i === index })));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        const defaultImage = images.find(img => img.isDefault);

        const { error: err } = await supabase
            .from("products")
            .update({
                name: form.name,
                description: form.description,
                metal_type: form.metal_type,
                weight_label: form.weight_label,
                purity: form.purity,
                mint: form.mint,
                product_type: form.product_type,
                series: form.series,
                category: form.category,
                is_featured: form.is_featured,
                is_active: form.is_active,
                sku: form.sku,
                image_url: defaultImage?.url || null,
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

    const handleDeactivate = async () => {
        const { error: err } = await supabase
            .from("products")
            .update({ is_active: false })
            .eq("id", id);

        if (!err) {
            setForm(prev => ({ ...prev, is_active: false }));
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
                    {saved && (
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">✓ Saved</span>
                    )}
                    {error && (
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{error}</span>
                    )}
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded ${form.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {form.is_active ? "Active" : "Draft"}
                    </span>
                    <button
                        onClick={handleDeactivate}
                        className="px-5 py-2 text-[10px] font-black uppercase border border-red-200 text-red-600 hover:bg-red-50 transition-all tracking-widest"
                    >
                        Deactivate
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-2 text-[10px] font-black uppercase bg-black text-white shadow-lg hover:shadow-xl transition-all tracking-widest disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    {/* SKU Banner */}
                    <div className="flex items-center gap-4 px-6 py-3 bg-white border border-[#E4E4E4] rounded-sm shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">SKU</span>
                        <span className="text-sm font-mono font-bold">{form.sku}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Last Modified</span>
                        <span className="text-xs font-bold text-gray-500">
                            {product.updated_at ? new Date(product.updated_at).toLocaleString() : "—"}
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
                                            value={form.name}
                                            onChange={(e) => updateField("name", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea
                                            rows={6}
                                            className="form-input"
                                            value={form.description}
                                            onChange={(e) => updateField("description", e.target.value)}
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
                                            value={form.metal_type}
                                            onChange={(e) => updateField("metal_type", e.target.value)}
                                        >
                                            <option>Gold</option>
                                            <option>Silver</option>
                                            <option>Platinum</option>
                                            <option>Palladium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Weight</label>
                                        <input
                                            type="text"
                                            value={form.weight_label}
                                            onChange={(e) => updateField("weight_label", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Purity</label>
                                        <input
                                            type="text"
                                            value={form.purity}
                                            onChange={(e) => updateField("purity", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Mint</label>
                                        <input
                                            type="text"
                                            value={form.mint}
                                            onChange={(e) => updateField("mint", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Product Type</label>
                                        <input
                                            type="text"
                                            value={form.product_type}
                                            onChange={(e) => updateField("product_type", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Series</label>
                                        <input
                                            type="text"
                                            value={form.series}
                                            onChange={(e) => updateField("series", e.target.value)}
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
                                            checked={form.is_featured}
                                            onChange={(e) => updateField("is_featured", e.target.checked)}
                                        />
                                        <div>
                                            <p className="text-[11px] font-black uppercase">Featured Product</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Display in Home Scroller</p>
                                        </div>
                                    </label>
                                    <div className="p-4 border border-gray-100 rounded-sm">
                                        <label className="form-label">Assign Category</label>
                                        <select
                                            className="form-input text-xs font-bold uppercase"
                                            value={form.category}
                                            onChange={(e) => updateField("category", e.target.value)}
                                        >
                                            <option>Gold Bars</option>
                                            <option>Gold Coins</option>
                                            <option>Silver Bullion</option>
                                        </select>
                                    </div>
                                    <div className="p-4 border border-gray-100 rounded-sm">
                                        <label className="form-label">SKU</label>
                                        <input
                                            type="text"
                                            value={form.sku}
                                            onChange={(e) => updateField("sku", e.target.value)}
                                            className="form-input text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Product Gallery */}
                            <div className="bg-white p-8 border border-[#E4E4E4] shadow-sm rounded-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">Product Gallery</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Paste Image URL"
                                            className="form-input text-xs"
                                            value={imgUrl}
                                            onChange={(e) => setImgUrl(e.target.value)}
                                        />
                                        <button
                                            onClick={addImage}
                                            className="bg-black text-white px-4 text-sm font-bold shrink-0"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        {images.map((img, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setDefault(i)}
                                                className={`img-card cursor-pointer group ${img.isDefault ? "is-default" : ""}`}
                                            >
                                                <div className="default-badge">DEFAULT</div>
                                                <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                                                    <Image
                                                        src={img.url}
                                                        alt="Product"
                                                        width={120}
                                                        height={120}
                                                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                    />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-[9px] text-gray-400 uppercase font-black text-center mt-4">
                                        Click an image to set as default
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
