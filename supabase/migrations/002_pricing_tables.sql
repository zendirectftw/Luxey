-- =====================================================
-- LUXEY DATABASE SCHEMA — MIGRATION 002: PRICING TABLES
-- =====================================================

-- ─────────────────────────────────────────────────────
-- 6. SPOT PRICES (GoldAPI / Kitco scrape)
-- ─────────────────────────────────────────────────────

CREATE TABLE spot_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metal metal_type NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    source TEXT NOT NULL DEFAULT 'kitco_scrape',
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(metal, source)
);

-- ─────────────────────────────────────────────────────
-- 7. LIVE QUOTES (per dealer-product pair)
-- ─────────────────────────────────────────────────────

CREATE TABLE live_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    kitco_spot DECIMAL(12, 2),
    dealer_adjustment DECIMAL(10, 2) DEFAULT 0,
    premium DECIMAL(10, 2) DEFAULT 0,
    bid_price DECIMAL(12, 2) NOT NULL,
    ask_price DECIMAL(12, 2),
    effective_premium_vs_kitco DECIMAL(10, 2),
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dealer_id, product_id)
);

CREATE INDEX idx_live_quotes_product ON live_quotes(product_id);

-- ─────────────────────────────────────────────────────
-- 8. QUOTE HISTORY (append-only log)
-- ─────────────────────────────────────────────────────

CREATE TABLE quote_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    bid_price DECIMAL(12, 2) NOT NULL,
    ask_price DECIMAL(12, 2),
    spot_price DECIMAL(12, 2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quote_history_product_time ON quote_history(product_id, recorded_at);

-- ─────────────────────────────────────────────────────
-- 9. COMPETITORS
-- ─────────────────────────────────────────────────────

CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────
-- 10. COMPETITOR QUOTES
-- ─────────────────────────────────────────────────────

CREATE TABLE competitor_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    bid_price DECIMAL(12, 2),
    ask_price DECIMAL(12, 2),
    source_url TEXT,
    fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────
-- BEST QUOTES VIEW
-- ─────────────────────────────────────────────────────

CREATE VIEW best_quotes AS
SELECT
    product_id,
    MAX(bid_price) AS best_bid,
    MIN(ask_price) AS best_ask,
    MAX(bid_price) - MIN(ask_price) AS spread
FROM live_quotes
GROUP BY product_id;

-- ─────────────────────────────────────────────────────
-- INSERT INITIAL COMPETITORS
-- ─────────────────────────────────────────────────────

INSERT INTO competitors (name, website_url, is_active)
VALUES
    ('CollectPure', 'https://www.collectpure.com', TRUE),
    ('BullionGoldStore', 'https://www.bulliongoldstore.com', TRUE);
