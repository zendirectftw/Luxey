"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ProfitProfile {
    id: string;
    name: string;
    salesTaxPct: number;       // 0-10
    luxeyTierFeePct: number;   // e.g. 0.65 for Gold tier
    cardCashbackPct: number;   // 0-5
    otherCashbackPct: number;  // 0-5
    bigBoxRebatePct: number;   // 0-2 (e.g. Costco Executive 2%)
    shippingCost: number;      // default 0
    isDefault: boolean;
}

interface ProfitProfileContextType {
    profiles: ProfitProfile[];
    defaultProfile: ProfitProfile;
    addProfile: (profile: Omit<ProfitProfile, "id">) => boolean;
    updateProfile: (id: string, updates: Partial<ProfitProfile>) => void;
    deleteProfile: (id: string) => void;
    setDefaultProfile: (id: string) => void;
}

const DEFAULT_PROFILES: ProfitProfile[] = [
    {
        id: "profile-1",
        name: "2% cash back and no rebate",
        salesTaxPct: 0,
        luxeyTierFeePct: 0.65,
        cardCashbackPct: 2.0,
        otherCashbackPct: 0,
        bigBoxRebatePct: 0,
        shippingCost: 0,
        isDefault: false,
    },
    {
        id: "profile-2",
        name: "4.625% cash back and no rebate",
        salesTaxPct: 0,
        luxeyTierFeePct: 0.65,
        cardCashbackPct: 2.625,
        otherCashbackPct: 0,
        bigBoxRebatePct: 2.0,
        shippingCost: 0,
        isDefault: false,
    },
    {
        id: "profile-3",
        name: "3% cash back and no rebate",
        salesTaxPct: 0,
        luxeyTierFeePct: 0.65,
        cardCashbackPct: 2.0,
        otherCashbackPct: 1.0,
        bigBoxRebatePct: 0,
        shippingCost: 0,
        isDefault: true,
    },
    {
        id: "profile-4",
        name: "2% cash back and 2% rebate",
        salesTaxPct: 0,
        luxeyTierFeePct: 0.65,
        cardCashbackPct: 2.0,
        otherCashbackPct: 0,
        bigBoxRebatePct: 2.0,
        shippingCost: 0,
        isDefault: false,
    },
];

const ProfitProfileContext = createContext<ProfitProfileContextType | undefined>(undefined);

export function ProfitProfileProvider({ children }: { children: ReactNode }) {
    const [profiles, setProfiles] = useState<ProfitProfile[]>(DEFAULT_PROFILES);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("luxey-profit-profiles");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Check if profiles have the new fields — if not, reset to defaults
                    if (parsed[0].luxeyTierFeePct !== undefined) {
                        setProfiles(parsed);
                    }
                }
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("luxey-profit-profiles", JSON.stringify(profiles));
    }, [profiles]);

    const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0];

    const addProfile = (profile: Omit<ProfitProfile, "id">): boolean => {
        if (profiles.length >= 4) return false;
        const newProfile: ProfitProfile = {
            ...profile,
            id: `profile-${Date.now()}`,
        };
        setProfiles((prev) => {
            // If this is the new default, unset others
            if (newProfile.isDefault) {
                return [...prev.map((p) => ({ ...p, isDefault: false })), newProfile];
            }
            return [...prev, newProfile];
        });
        return true;
    };

    const updateProfile = (id: string, updates: Partial<ProfitProfile>) => {
        setProfiles((prev) =>
            prev.map((p) => {
                if (p.id === id) return { ...p, ...updates };
                // If we're setting a new default, unset others
                if (updates.isDefault && p.id !== id) return { ...p, isDefault: false };
                return p;
            })
        );
    };

    const deleteProfile = (id: string) => {
        setProfiles((prev) => {
            const remaining = prev.filter((p) => p.id !== id);
            // If we deleted the default, make the first one default
            if (!remaining.some((p) => p.isDefault) && remaining.length > 0) {
                remaining[0].isDefault = true;
            }
            return remaining.length > 0 ? remaining : DEFAULT_PROFILES;
        });
    };

    const setDefaultProfile = (id: string) => {
        setProfiles((prev) =>
            prev.map((p) => ({ ...p, isDefault: p.id === id }))
        );
    };

    return (
        <ProfitProfileContext.Provider
            value={{ profiles, defaultProfile, addProfile, updateProfile, deleteProfile, setDefaultProfile }}
        >
            {children}
        </ProfitProfileContext.Provider>
    );
}

export function useProfitProfiles() {
    const context = useContext(ProfitProfileContext);
    if (!context) {
        throw new Error("useProfitProfiles must be used within a ProfitProfileProvider");
    }
    return context;
}
