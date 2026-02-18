"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* ── Sample product to edit ─────────────────────────── */
const existingProduct = {
    name: "1 oz PAMP Lady Fortuna Gold Bar",
    description: "The iconic PAMP Suisse Lady Fortuna gold bar features the Roman goddess of fortune on the obverse, with the PAMP Suisse logo and weight/purity details on the reverse. Each bar comes with a unique serial number and CertiPAMP assay card sealed in tamper-evident packaging.",
    metalType: "Gold",
    weight: "1 Troy Ounce",
    purity: "0.9999 Fine",
    mint: "PAMP Suisse",
    productType: "Minted Bar",
    series: "Lady Fortuna",
    category: "Gold Bars",
    featured: true,
    sku: "PAMP-LF-1OZ-AU",
    status: "Active",
};

const initialImages = [
    { url: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg", isDefault: true },
    { url: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint%20Rev.jpg", isDefault: false },
];

export default function EditProductPage() {
    const [images, setImages] = useState(initialImages);
    const [imgUrl, setImgUrl] = useState("");
    const [saved, setSaved] = useState(false);

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

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

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
                    <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-700 rounded">
                        {existingProduct.status}
                    </span>
                    <button className="px-5 py-2 text-[10px] font-black uppercase border border-red-200 text-red-600 hover:bg-red-50 transition-all tracking-widest">
                        Deactivate
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2 text-[10px] font-black uppercase bg-black text-white shadow-lg hover:shadow-xl transition-all tracking-widest"
                    >
                        Save Changes
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    {/* SKU Banner */}
                    <div className="flex items-center gap-4 px-6 py-3 bg-white border border-[#E4E4E4] rounded-sm shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">SKU</span>
                        <span className="text-sm font-mono font-bold">{existingProduct.sku}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Last Modified</span>
                        <span className="text-xs font-bold text-gray-500">01/15/2026 at 3:42 PM</span>
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
                                        <input type="text" defaultValue={existingProduct.name} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea rows={6} className="form-input" defaultValue={existingProduct.description} />
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
                                        <select className="form-input" defaultValue={existingProduct.metalType}>
                                            <option>Gold</option>
                                            <option>Silver</option>
                                            <option>Platinum</option>
                                            <option>Palladium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Weight</label>
                                        <input type="text" defaultValue={existingProduct.weight} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Purity</label>
                                        <input type="text" defaultValue={existingProduct.purity} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Mint</label>
                                        <input type="text" defaultValue={existingProduct.mint} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Product Type</label>
                                        <input type="text" defaultValue={existingProduct.productType} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Series</label>
                                        <input type="text" defaultValue={existingProduct.series} className="form-input" />
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
                                        <input type="checkbox" className="luxey-checkbox" defaultChecked={existingProduct.featured} />
                                        <div>
                                            <p className="text-[11px] font-black uppercase">Featured Product</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Display in Home Scroller</p>
                                        </div>
                                    </label>
                                    <div className="p-4 border border-gray-100 rounded-sm">
                                        <label className="form-label">Assign Category</label>
                                        <select className="form-input text-xs font-bold uppercase" defaultValue={existingProduct.category}>
                                            <option>Gold Bars</option>
                                            <option>Gold Coins</option>
                                            <option>Silver Bullion</option>
                                        </select>
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
