"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface MetalPrice {
    bid: number;
    ask: number;
    change: number;
    changePct: number;
    low: number;
    high: number;
}

export interface SpotPrices {
    gold: MetalPrice;
    silver: MetalPrice;
    platinum: MetalPrice;
    palladium: MetalPrice;
    source: string;
    fetchedAt: string;
}

type MetalKey = "gold" | "silver" | "platinum" | "palladium";

interface SpotPriceContextValue {
    prices: SpotPrices | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
    /**
     * Per-product bid/ask: Kitco bid/ask × weight × purity
     */
    calcProductPricing: (
        metal: MetalKey,
        weightOz: number,
        purity?: number,
    ) => { bid: number; ask: number; spotBid: number; spotAsk: number } | null;
    formatUSD: (value: number) => string;
}

const EMPTY_METAL: MetalPrice = { bid: 0, ask: 0, change: 0, changePct: 0, low: 0, high: 0 };

const SpotPriceContext = createContext<SpotPriceContextValue>({
    prices: null,
    loading: true,
    error: null,
    refresh: () => { },
    calcProductPricing: () => null,
    formatUSD: () => "",
});

export function SpotPriceProvider({ children }: { children: React.ReactNode }) {
    const [prices, setPrices] = useState<SpotPrices | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrices = useCallback(async () => {
        try {
            const res = await fetch("/api/spot-prices");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: SpotPrices = await res.json();
            setPrices(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch prices");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 15_000);
        return () => clearInterval(interval);
    }, [fetchPrices]);

    /**
     * Calculate per-product bid/ask directly from Kitco's bid/ask spot prices.
     * Formula: product_bid = kitco_bid_per_oz × weight_oz × purity
     *          product_ask = kitco_ask_per_oz × weight_oz × purity
     */
    const calcProductPricing = useCallback(
        (metal: MetalKey, weightOz: number, purity = 0.9999) => {
            if (!prices) return null;
            const metalPrice = prices[metal];
            if (!metalPrice || metalPrice.bid <= 0) return null;

            return {
                bid: Math.round(metalPrice.bid * weightOz * purity * 100) / 100,
                ask: Math.round(metalPrice.ask * weightOz * purity * 100) / 100,
                spotBid: metalPrice.bid,
                spotAsk: metalPrice.ask,
            };
        },
        [prices]
    );

    const formatUSD = useCallback((value: number) => {
        if (value >= 1000) {
            return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, []);

    return (
        <SpotPriceContext.Provider value={{ prices, loading, error, refresh: fetchPrices, calcProductPricing, formatUSD }}>
            {children}
        </SpotPriceContext.Provider>
    );
}

export function useSpotPrices() {
    return useContext(SpotPriceContext);
}
