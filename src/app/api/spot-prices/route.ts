import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 15; // ISR: cache for 15s

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MetalPrice {
    bid: number;
    ask: number;
    change: number;
    changePct: number;
    low: number;
    high: number;
}

interface SpotPricesResponse {
    gold: MetalPrice;
    silver: MetalPrice;
    platinum: MetalPrice;
    palladium: MetalPrice;
    source: string;
    fetchedAt: string;
}

const EMPTY_METAL: MetalPrice = { bid: 0, ask: 0, change: 0, changePct: 0, low: 0, high: 0 };

// Kitco is a Next.js app. The precious-metals page embeds price data
// in a __NEXT_DATA__ JSON blob. We use the "allMetalsQuote" query which
// has full bid, ask, high, low, change, changePct for each metal.
async function scrapeKitco(): Promise<Partial<SpotPricesResponse>> {
    try {
        const res = await fetch("https://www.kitco.com/price/precious-metals", {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; Luxey/1.0)" },
            signal: AbortSignal.timeout(10000),
        });
        const html = await res.text();

        // Extract __NEXT_DATA__ JSON
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
        if (!nextDataMatch) return {};

        const nextData = JSON.parse(nextDataMatch[1]);

        // Navigate to the dehydrated queries
        const queries = nextData?.props?.pageProps?.dehydratedState?.queries;
        if (!queries || !Array.isArray(queries)) return {};

        // Find the allMetalsQuote query — has bid, ask, high, low, change, changePct
        const allMetalsQuery = queries.find(
            (q: { queryHash?: string }) => q.queryHash?.includes("allMetalsQuote")
        );
        if (!allMetalsQuery?.state?.data) return {};

        const data = allMetalsQuery.state.data;
        const results: Partial<SpotPricesResponse> = {};

        const metalMap: { key: keyof SpotPricesResponse; dataKey: string }[] = [
            { key: "gold", dataKey: "gold" },
            { key: "silver", dataKey: "silver" },
            { key: "platinum", dataKey: "platinum" },
            { key: "palladium", dataKey: "palladium" },
        ];

        for (const { key, dataKey } of metalMap) {
            const metalData = data[dataKey]?.results?.[0];
            if (metalData && metalData.bid > 0) {
                (results as Record<string, MetalPrice>)[key as string] = {
                    bid: metalData.bid,
                    ask: metalData.ask,
                    change: metalData.change || 0,
                    changePct: metalData.changePercentage || 0,
                    low: metalData.low || 0,
                    high: metalData.high || 0,
                };
            }
        }

        return results;
    } catch (e) {
        console.error("Kitco scrape error:", e);
        return {};
    }
}

// ─── GOLDAPI FALLBACK ────────────────────────────────
async function fetchGoldApi(): Promise<Partial<SpotPricesResponse>> {
    const apiKey = process.env.GOLDAPI_KEY;
    if (!apiKey) return {};

    const metals = [
        { key: "gold", symbol: "XAU" },
        { key: "silver", symbol: "XAG" },
        { key: "platinum", symbol: "XPT" },
        { key: "palladium", symbol: "XPD" },
    ];

    const results: Partial<SpotPricesResponse> = {};

    for (const { key, symbol } of metals) {
        try {
            const res = await fetch(`https://www.goldapi.io/api/${symbol}/USD`, {
                headers: {
                    "x-access-token": apiKey,
                    "Content-Type": "application/json",
                },
                signal: AbortSignal.timeout(5000),
            });
            const data = await res.json();
            if (data.price) {
                (results as Record<string, MetalPrice>)[key] = {
                    bid: data.price,
                    ask: data.ask || data.price,
                    change: data.ch || 0,
                    changePct: data.chp || 0,
                    low: data.low_price || data.price,
                    high: data.high_price || data.price,
                };
            }
        } catch {
            // continue
        }
    }

    return results;
}

// ─── PERSIST TO SUPABASE ─────────────────────────────
async function persistSpotPrices(prices: SpotPricesResponse) {
    const metalMap: { key: keyof SpotPricesResponse; dbMetal: string }[] = [
        { key: "gold", dbMetal: "gold" },
        { key: "silver", dbMetal: "silver" },
        { key: "platinum", dbMetal: "platinum" },
        { key: "palladium", dbMetal: "palladium" },
    ];

    const now = prices.fetchedAt;

    for (const { key, dbMetal } of metalMap) {
        const metal = prices[key] as MetalPrice;
        if (metal.bid > 0) {
            // Upsert current spot_prices (latest values)
            await supabase
                .from("spot_prices")
                .upsert(
                    { metal: dbMetal, price: metal.bid, source: prices.source + "_bid", fetched_at: now },
                    { onConflict: "metal,source" }
                );
            await supabase
                .from("spot_prices")
                .upsert(
                    { metal: dbMetal, price: metal.ask, source: prices.source + "_ask", fetched_at: now },
                    { onConflict: "metal,source" }
                );

            // Append to spot_price_history (every scrape is logged)
            await supabase.from("spot_price_history").insert({
                metal: dbMetal,
                bid: metal.bid,
                ask: metal.ask,
                change: metal.change,
                change_pct: metal.changePct,
                low: metal.low,
                high: metal.high,
                source: prices.source,
                recorded_at: now,
            });
        }
    }
}

// ─── MAIN HANDLER ────────────────────────────────────
export async function GET() {
    let source = "kitco";
    let prices = await scrapeKitco();

    const hasKitco = prices.gold && (prices.gold as MetalPrice).bid > 0;

    if (!hasKitco) {
        source = "goldapi";
        prices = await fetchGoldApi();
    }

    const response: SpotPricesResponse = {
        gold: (prices.gold as MetalPrice) || EMPTY_METAL,
        silver: (prices.silver as MetalPrice) || EMPTY_METAL,
        platinum: (prices.platinum as MetalPrice) || EMPTY_METAL,
        palladium: (prices.palladium as MetalPrice) || EMPTY_METAL,
        source,
        fetchedAt: new Date().toISOString(),
    };

    // Persist to Supabase (fire and forget)
    persistSpotPrices(response).catch(() => { });

    return NextResponse.json(response, {
        headers: {
            "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
        },
    });
}
