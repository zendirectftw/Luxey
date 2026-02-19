"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID } from "@/lib/constants";
import AccountBreadcrumb from "@/components/AccountBreadcrumb";
import LuxeyCTA from "@/components/LuxeyCTA";
import ProfitProfileManager from "@/components/ProfitProfileManager";

interface UserProfile {
    full_name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form, setForm] = useState({
        first_name: "", last_name: "", phone: "", email: "",
        address_line1: "", city: "", state: "", zip: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("users")
                .select("full_name, email, phone, address_line1, address_line2, city, state, zip")
                .eq("id", DEMO_USER_ID)
                .single();

            if (data) {
                setProfile(data);
                const parts = (data.full_name || "").split(" ");
                setForm({
                    first_name: parts[0] || "",
                    last_name: parts.slice(1).join(" ") || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    address_line1: data.address_line1 || "",
                    city: data.city || "",
                    state: data.state || "",
                    zip: data.zip || "",
                });
            }
            setLoading(false);
        }
        load();
    }, []);

    const updateField = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const full_name = `${form.first_name} ${form.last_name}`.trim();
        await supabase
            .from("users")
            .update({
                full_name,
                email: form.email,
                phone: form.phone,
                address_line1: form.address_line1,
                city: form.city,
                state: form.state,
                zip: form.zip,
            })
            .eq("id", DEMO_USER_ID);

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto w-full py-6 px-6">
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full py-6 px-6">
            {/* BREADCRUMB */}
            <div className="mb-4">
                <AccountBreadcrumb page="Profile" />
            </div>

            <div className="bg-white border border-[#E4E4E4] rounded-lg overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-[#F5F5F5]">
                    <h2 className="font-serif text-3xl text-black leading-none mb-1 tracking-tight uppercase">
                        Profile Information
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold tracking-tight uppercase">
                        Update your contact and return address details.
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 py-6 space-y-6">
                    {saved && (
                        <div className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                            ✓ Profile saved successfully
                        </div>
                    )}

                    {/* Contact Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-1">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" value={form.last_name} onChange={(e) => updateField("last_name", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" className="form-input" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                        </div>
                    </div>

                    <div className="h-px bg-[#F5F5F5]" />

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl tracking-tight uppercase">
                            Return Shipping Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
                            <div className="md:col-span-4 space-y-1">
                                <label className="form-label">Street Address</label>
                                <input type="text" className="form-input" value={form.address_line1} onChange={(e) => updateField("address_line1", e.target.value)} />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="form-label">City</label>
                                <input type="text" className="form-input" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="form-label">State</label>
                                <input type="text" className="form-input" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="form-label">Zip</label>
                                <input type="text" className="form-input" value={form.zip} onChange={(e) => updateField("zip", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="bg-[#FAFAFA] p-6 border-t border-[#E4E4E4] flex justify-end items-center gap-4">
                    {saving && <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Saving...</span>}
                    <button onClick={handleSave} disabled={saving}>
                        <LuxeyCTA>SAVE CHANGES</LuxeyCTA>
                    </button>
                </div>
            </div>

            {/* Profit Profiles */}
            <ProfitProfileManager />
        </div>
    );
}
