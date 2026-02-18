"use client";

import React, { useState } from "react";
import { useProfitProfiles, ProfitProfile } from "@/context/ProfitProfileContext";
import Link from "next/link";

interface EditFormData {
    name: string;
    salesTaxPct: number;
    luxeyTierFeePct: number;
    cardCashbackPct: number;
    otherCashbackPct: number;
    bigBoxRebatePct: number;
    shippingCost: number;
}

const EMPTY_FORM: EditFormData = {
    name: "",
    salesTaxPct: 0,
    luxeyTierFeePct: 0.65,
    cardCashbackPct: 0,
    otherCashbackPct: 0,
    bigBoxRebatePct: 0,
    shippingCost: 0,
};

export default function ProfitProfileManager() {
    const {
        profiles,
        addProfile,
        updateProfile,
        deleteProfile,
        setDefaultProfile,
    } = useProfitProfiles();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [formData, setFormData] = useState<EditFormData>(EMPTY_FORM);

    const startEdit = (profile: ProfitProfile) => {
        setEditingId(profile.id);
        setShowCreate(false);
        setFormData({
            name: profile.name,
            salesTaxPct: profile.salesTaxPct,
            luxeyTierFeePct: profile.luxeyTierFeePct,
            cardCashbackPct: profile.cardCashbackPct,
            otherCashbackPct: profile.otherCashbackPct,
            bigBoxRebatePct: profile.bigBoxRebatePct,
            shippingCost: profile.shippingCost,
        });
    };

    const startCreate = () => {
        setEditingId(null);
        setShowCreate(true);
        setFormData(EMPTY_FORM);
    };

    const save = () => {
        if (!formData.name.trim()) return;
        if (editingId) {
            updateProfile(editingId, formData);
            setEditingId(null);
        } else {
            const success = addProfile({ ...formData, isDefault: profiles.length === 0 });
            if (success) setShowCreate(false);
        }
    };

    const ProfileForm = () => (
        <div className="bg-[#FAFAFA] border border-[#E4E4E4] rounded-sm p-5 space-y-4">
            {/* Profile Name */}
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Profile Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    placeholder="e.g. 2% cash back and no rebate"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Sales Tax */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Sales Tax %
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={15}
                        step={0.1}
                        value={formData.salesTaxPct}
                        onChange={(e) =>
                            setFormData({ ...formData, salesTaxPct: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    />
                </div>

                {/* Luxey Tier Fee */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Luxey Tier Fee %
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.05}
                        value={formData.luxeyTierFeePct}
                        onChange={(e) =>
                            setFormData({ ...formData, luxeyTierFeePct: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    />
                </div>

                {/* CC Cash Back */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Credit Card Cash Back %
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.125}
                        value={formData.cardCashbackPct}
                        onChange={(e) =>
                            setFormData({ ...formData, cardCashbackPct: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    />
                </div>

                {/* Other Cash Back */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Other Cash Back %
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        value={formData.otherCashbackPct}
                        onChange={(e) =>
                            setFormData({ ...formData, otherCashbackPct: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    />
                </div>

                {/* Big Box Rebate */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Big Box Rebate %
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        value={formData.bigBoxRebatePct}
                        onChange={(e) =>
                            setFormData({ ...formData, bigBoxRebatePct: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    />
                </div>

                {/* Shipping Cost */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Shipping Cost $
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={formData.shippingCost}
                        onChange={(e) =>
                            setFormData({ ...formData, shippingCost: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-[#E4E4E4] rounded-sm text-sm font-bold bg-white focus:border-black focus:outline-none"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={() => {
                        setEditingId(null);
                        setShowCreate(false);
                    }}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 border border-[#E4E4E4] rounded-sm hover:border-black transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={save}
                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-black text-white rounded-sm hover:bg-gray-900 transition-colors"
                >
                    {editingId ? "Save Changes" : "Create Profile"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-[#E4E4E4] rounded-lg overflow-hidden shadow-sm mt-6">
            {/* Header */}
            <div className="p-6 border-b border-[#F5F5F5] flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-3xl text-black leading-none mb-1 tracking-tight uppercase">
                        Profit Profiles
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold tracking-tight uppercase">
                        {profiles.length} Profile{profiles.length !== 1 ? "s" : ""} · Max 4
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/big-box"
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37] rounded-sm hover:bg-[#D4AF37] hover:text-white transition-all"
                    >
                        🏪 View Big Box
                    </Link>
                    {profiles.length < 4 && !showCreate && (
                        <button
                            onClick={startCreate}
                            className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-[#D4AF37] text-white rounded-sm hover:bg-[#C5A028] transition-colors"
                        >
                            + Create Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Profile List */}
            <div className="p-6 space-y-4">
                {profiles.map((profile) => (
                    <div key={profile.id}>
                        {editingId === profile.id ? (
                            <ProfileForm />
                        ) : (
                            <div className="border border-[#E4E4E4] rounded-sm p-5 hover:border-gray-300 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-black uppercase tracking-wider">
                                            {profile.name}
                                        </h3>
                                        {profile.isDefault && (
                                            <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-sm">
                                                ★ Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => startEdit(profile)}
                                            className="p-1.5 text-gray-400 hover:text-black transition-colors"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                            </svg>
                                        </button>
                                        {!profile.isDefault && (
                                            <button
                                                onClick={() => deleteProfile(profile.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                            Sales Tax
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            {profile.salesTaxPct}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                            Luxey Tier
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            Gold ({profile.luxeyTierFeePct}%)
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                            CC Cash Back
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            {profile.cardCashbackPct}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                            Other Cash Back
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            {profile.otherCashbackPct}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                            Big Box Rebate
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            {profile.bigBoxRebatePct}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                            Shipping
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            ${profile.shippingCost}
                                        </span>
                                    </div>
                                </div>

                                {!profile.isDefault && (
                                    <button
                                        onClick={() => setDefaultProfile(profile.id)}
                                        className="mt-3 text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Create Form */}
                {showCreate && <ProfileForm />}
            </div>
        </div>
    );
}
