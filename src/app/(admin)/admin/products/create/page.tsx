"use client";

import Image from "next/image";
import { useState } from "react";

const initialImages = [
    { url: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg", isDefault: true },
    { url: "https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint%20Rev.jpg", isDefault: false },
];

export default function CreateProductPage() {
    const [images, setImages] = useState(initialImages);
    const [imgUrl, setImgUrl] = useState("");

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

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-[#E4E4E4] flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Product Management</h2>
                    <span className="text-gray-300">/</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Create New Listing</span>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 text-[10px] font-black uppercase border border-[#E4E4E4] hover:bg-gray-50 transition-all tracking-widest">
                        Save Draft
                    </button>
                    <button className="px-8 py-2 text-[10px] font-black uppercase bg-black text-white shadow-lg hover:shadow-xl transition-all tracking-widest">
                        Publish Product
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
                                        <input type="text" placeholder="e.g. 1 oz PAMP Fortuna Gold Bar" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea rows={6} className="form-input" placeholder="Enter full product details and history..." />
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
                                        <select className="form-input">
                                            <option>Gold</option>
                                            <option>Silver</option>
                                            <option>Platinum</option>
                                            <option>Palladium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Weight</label>
                                        <input type="text" placeholder="e.g. 1 Troy Ounce" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Purity</label>
                                        <input type="text" placeholder="e.g. 0.9999 Fine" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Mint</label>
                                        <input type="text" placeholder="e.g. PAMP Suisse" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Product Type</label>
                                        <input type="text" placeholder="e.g. Minted Bar" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Series</label>
                                        <input type="text" placeholder="e.g. Lady Fortuna" className="form-input" />
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
                                        <input type="checkbox" className="luxey-checkbox" />
                                        <div>
                                            <p className="text-[11px] font-black uppercase">Featured Product</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Display in Home Scroller</p>
                                        </div>
                                    </label>
                                    <div className="p-4 border border-gray-100 rounded-sm">
                                        <label className="form-label">Assign Category</label>
                                        <select className="form-input text-xs font-bold uppercase">
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

                                    {/* Image Grid */}
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
