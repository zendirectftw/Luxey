-- =====================================================
-- LUXEY — MIGRATION 007: Dealer-Product Pricing Seed
-- Seeds dealer_product_mapping and live_quotes
-- for the 3 existing dealers across all products
-- =====================================================

-- Helper: Get dealer IDs
-- UGC  = 'Upstate Gold and Coin'  (LUXEY - DENVER)
-- APMEX = 'APMEX'                 (LUXEY - OKC)
-- AMARK = 'A-MARK'                (LUXEY - VEGAS)

-- First, create the dealer-product mappings for all products × all dealers
INSERT INTO dealer_product_mapping (dealer_id, product_id, is_active)
SELECT d.id, p.id, TRUE
FROM dealers d
CROSS JOIN products p
WHERE d.is_active = TRUE
ON CONFLICT (dealer_id, product_id) DO NOTHING;

-- Now seed live_quotes with per-dealer, per-product adjustments
-- Each dealer has:
--   spot_offset (already in dealers table: -$5 for all 3)
--   Per-product premium: varies by product weight/type

-- ═══ UGC (Upstate Gold) — Tightest spreads ═══
INSERT INTO live_quotes (dealer_id, product_id, kitco_spot, dealer_adjustment, premium, bid_price, ask_price, effective_premium_vs_kitco)
SELECT
    d.id,
    p.id,
    0,          -- kitco_spot filled at runtime
    d.spot_offset,  -- dealer adjustment to spot (-$5)
    CASE
        WHEN p.metal = 'gold' AND p.weight_oz >= 10 THEN 0.80   -- bulk gold bars = low premium
        WHEN p.metal = 'gold' AND p.weight_oz >= 3  THEN 1.20   -- mid-weight gold
        WHEN p.metal = 'gold'                        THEN 1.50   -- 1oz gold coins/bars
        WHEN p.metal = 'silver'                      THEN 3.50   -- silver has higher %
        WHEN p.metal = 'platinum'                    THEN 2.50   -- platinum mid-range
        ELSE 2.00
    END,        -- premium %
    0,          -- bid_price filled at runtime
    0,          -- ask_price filled at runtime
    CASE
        WHEN p.metal = 'gold' AND p.weight_oz >= 10 THEN 0.80
        WHEN p.metal = 'gold' AND p.weight_oz >= 3  THEN 1.20
        WHEN p.metal = 'gold'                        THEN 1.50
        WHEN p.metal = 'silver'                      THEN 3.50
        WHEN p.metal = 'platinum'                    THEN 2.50
        ELSE 2.00
    END
FROM dealers d
CROSS JOIN products p
WHERE d.code = 'UGC'
ON CONFLICT (dealer_id, product_id) DO UPDATE SET
    dealer_adjustment = EXCLUDED.dealer_adjustment,
    premium = EXCLUDED.premium,
    effective_premium_vs_kitco = EXCLUDED.effective_premium_vs_kitco;

-- ═══ APMEX — Slightly wider spreads ═══
INSERT INTO live_quotes (dealer_id, product_id, kitco_spot, dealer_adjustment, premium, bid_price, ask_price, effective_premium_vs_kitco)
SELECT
    d.id,
    p.id,
    0,
    d.spot_offset,
    CASE
        WHEN p.metal = 'gold' AND p.weight_oz >= 10 THEN 1.20
        WHEN p.metal = 'gold' AND p.weight_oz >= 3  THEN 1.80
        WHEN p.metal = 'gold'                        THEN 2.20
        WHEN p.metal = 'silver'                      THEN 4.50
        WHEN p.metal = 'platinum'                    THEN 3.50
        ELSE 3.00
    END,
    0,
    0,
    CASE
        WHEN p.metal = 'gold' AND p.weight_oz >= 10 THEN 1.20
        WHEN p.metal = 'gold' AND p.weight_oz >= 3  THEN 1.80
        WHEN p.metal = 'gold'                        THEN 2.20
        WHEN p.metal = 'silver'                      THEN 4.50
        WHEN p.metal = 'platinum'                    THEN 3.50
        ELSE 3.00
    END
FROM dealers d
CROSS JOIN products p
WHERE d.code = 'APMEX'
ON CONFLICT (dealer_id, product_id) DO UPDATE SET
    dealer_adjustment = EXCLUDED.dealer_adjustment,
    premium = EXCLUDED.premium,
    effective_premium_vs_kitco = EXCLUDED.effective_premium_vs_kitco;

-- ═══ A-MARK — Widest spreads ═══
INSERT INTO live_quotes (dealer_id, product_id, kitco_spot, dealer_adjustment, premium, bid_price, ask_price, effective_premium_vs_kitco)
SELECT
    d.id,
    p.id,
    0,
    d.spot_offset,
    CASE
        WHEN p.metal = 'gold' AND p.weight_oz >= 10 THEN 1.50
        WHEN p.metal = 'gold' AND p.weight_oz >= 3  THEN 2.00
        WHEN p.metal = 'gold'                        THEN 2.50
        WHEN p.metal = 'silver'                      THEN 5.00
        WHEN p.metal = 'platinum'                    THEN 4.00
        ELSE 3.50
    END,
    0,
    0,
    CASE
        WHEN p.metal = 'gold' AND p.weight_oz >= 10 THEN 1.50
        WHEN p.metal = 'gold' AND p.weight_oz >= 3  THEN 2.00
        WHEN p.metal = 'gold'                        THEN 2.50
        WHEN p.metal = 'silver'                      THEN 5.00
        WHEN p.metal = 'platinum'                    THEN 4.00
        ELSE 3.50
    END
FROM dealers d
CROSS JOIN products p
WHERE d.code = 'AMARK'
ON CONFLICT (dealer_id, product_id) DO UPDATE SET
    dealer_adjustment = EXCLUDED.dealer_adjustment,
    premium = EXCLUDED.premium,
    effective_premium_vs_kitco = EXCLUDED.effective_premium_vs_kitco;
