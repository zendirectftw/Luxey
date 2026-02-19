-- =====================================================
-- LUXEY — MIGRATION 008: Spot Price History (append-only log)
-- Records every Kitco/GoldAPI scrape with timestamp
-- =====================================================

CREATE TABLE spot_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metal metal_type NOT NULL,
    bid DECIMAL(12, 2) NOT NULL,
    ask DECIMAL(12, 2) NOT NULL,
    change DECIMAL(10, 3),
    change_pct DECIMAL(8, 4),
    low DECIMAL(12, 2),
    high DECIMAL(12, 2),
    source TEXT NOT NULL DEFAULT 'kitco',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_spot_history_metal_time ON spot_price_history(metal, recorded_at DESC);
CREATE INDEX idx_spot_history_recorded ON spot_price_history(recorded_at DESC);
