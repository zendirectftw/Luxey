import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 15;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// ─── PREFERRED DEALER RULE ──────────────────────────
// Prefer APMEX (LUXEY - OKC) unless their bid is >5% lower than the best alternative
const PREFERRED_DEALER_CODE = "APMEX";
const PREFERRED_DEALER_THRESHOLD = 0.05; // 5%

interface DealerQuote {
    dealerId: string;
    dealerName: string;
    dealerCity: string;
    dealerCode: string;
    spotAdjustment: number;
    premiumPct: number;
    computedBid: number;
    computedAsk: number;
}

interface ProductPricing {
    productId: string;
    productName: string;
    productSlug: string;
    metal: string;
    weightOz: number;
    purity: number;
    imageUrl: string;
    category: string;
    mint: string | null;
    // Best price (winning dealer)
    bestBid: number;
    bestAsk: number;
    winningDealer: string;
    winningDealerCity: string;
    winningDealerCode: string;
    // All dealer quotes for comparison
    dealerQuotes: DealerQuote[];
    // Spot reference
    spotBid: number;
    spotAsk: number;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    // 1. Fetch current spot prices from our own API
    const baseUrl = request.url.split("/api/")[0];
    const spotRes = await fetch(`${baseUrl}/api/spot-prices`, {
        signal: AbortSignal.timeout(10000),
    });
    const spotData = await spotRes.json();

    // 2. Fetch products (optionally filtered by ID)
    let productsQuery = supabase
        .from("products")
        .select("id, name, slug, metal, category, weight_oz, purity, image_url, mint, is_active")
        .eq("is_active", true);

    if (productId) {
        productsQuery = productsQuery.eq("id", productId);
    }

    const { data: products, error: prodErr } = await productsQuery;
    if (prodErr || !products) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    // 3. Fetch all live_quotes with dealer join
    const productIds = products.map((p) => p.id);
    const { data: quotes } = await supabase
        .from("live_quotes")
        .select("*, dealers!inner(id, display_name, display_city, code, spot_offset)")
        .in("product_id", productIds);

    // 4. Compute per-product pricing across all dealers
    const result: ProductPricing[] = products.map((product) => {
        const metal = product.metal as "gold" | "silver" | "platinum" | "palladium";
        const metalSpot = spotData[metal];
        const spotBid = metalSpot?.bid || 0;
        const spotAsk = metalSpot?.ask || 0;
        const weightOz = parseFloat(product.weight_oz);
        const purity = parseFloat(product.purity);

        // Get all dealer quotes for this product
        const productQuotes = (quotes || []).filter((q) => q.product_id === product.id);

        const dealerQuotes: DealerQuote[] = productQuotes.map((q) => {
            const dealer = q.dealers as {
                id: string;
                display_name: string;
                display_city: string;
                code: string;
                spot_offset: number;
            };
            const adjustment = parseFloat(q.dealer_adjustment || "0");
            const premiumPct = parseFloat(q.premium || "0");

            // Bid = (kitco_bid + dealer_adjustment) × weight × purity × (1 - premium/100)
            // Ask = (kitco_ask + dealer_adjustment) × weight × purity × (1 + premium/100)
            const adjustedBidSpot = spotBid + adjustment;
            const adjustedAskSpot = spotAsk + adjustment;
            const computedBid = Math.round(adjustedBidSpot * weightOz * purity * (1 - premiumPct / 100) * 100) / 100;
            const computedAsk = Math.round(adjustedAskSpot * weightOz * purity * (1 + premiumPct / 100) * 100) / 100;

            return {
                dealerId: dealer.id,
                dealerName: dealer.display_name,
                dealerCity: dealer.display_city,
                dealerCode: dealer.code,
                spotAdjustment: adjustment,
                premiumPct,
                computedBid,
                computedAsk,
            };
        });

        // Sort by bid descending (highest bid = best for seller)
        dealerQuotes.sort((a, b) => b.computedBid - a.computedBid);

        // Apply dealer selection rule
        let winner = dealerQuotes[0]; // default: highest bid

        if (winner && dealerQuotes.length > 1) {
            const preferred = dealerQuotes.find((q) => q.dealerCode === PREFERRED_DEALER_CODE);
            if (preferred && preferred.dealerCode !== winner.dealerCode) {
                // Check if preferred is within threshold of the best
                const pctDiff = (winner.computedBid - preferred.computedBid) / winner.computedBid;
                if (pctDiff <= PREFERRED_DEALER_THRESHOLD) {
                    // Preferred dealer is close enough — use them
                    winner = preferred;
                }
            }
        }

        // Fallback: if no dealer quotes, compute from Kitco direct
        const fallbackBid = Math.round(spotBid * weightOz * purity * 100) / 100;
        const fallbackAsk = Math.round(spotAsk * weightOz * purity * 100) / 100;

        return {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            metal: product.metal,
            weightOz,
            purity,
            imageUrl: product.image_url,
            category: product.category,
            mint: product.mint,
            bestBid: winner?.computedBid || fallbackBid,
            bestAsk: winner?.computedAsk || fallbackAsk,
            winningDealer: winner?.dealerName || "Kitco Direct",
            winningDealerCity: winner?.dealerCity || "",
            winningDealerCode: winner?.dealerCode || "",
            dealerQuotes,
            spotBid,
            spotAsk,
        };
    });

    return NextResponse.json(
        {
            products: result,
            spotPrices: {
                gold: spotData.gold,
                silver: spotData.silver,
                platinum: spotData.platinum,
                palladium: spotData.palladium,
            },
            source: spotData.source,
            fetchedAt: spotData.fetchedAt,
        },
        {
            headers: {
                "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
            },
        }
    );
}
