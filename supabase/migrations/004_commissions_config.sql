-- =====================================================
-- LUXEY DATABASE SCHEMA — MIGRATION 004: COMMISSIONS & CONFIG
-- =====================================================

-- ─────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────

CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE transaction_type AS ENUM ('seller_payout', 'commission_payout', 'platform_fee', 'dealer_payment', 'shipping_fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- ─────────────────────────────────────────────────────
-- 13. COMMISSIONS
-- ─────────────────────────────────────────────────────

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID NOT NULL REFERENCES users(id),
    source_user_id UUID NOT NULL REFERENCES users(id),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
    level INT NOT NULL CHECK (level >= 1 AND level <= 7),
    commission_rate DECIMAL(5, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status commission_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commissions_beneficiary_status ON commissions(beneficiary_id, status);
CREATE INDEX idx_commissions_source_user ON commissions(source_user_id);

-- ─────────────────────────────────────────────────────
-- 14. TRANSACTIONS (financial ledger)
-- ─────────────────────────────────────────────────────

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    payment_method TEXT,
    status transaction_status DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);

-- ─────────────────────────────────────────────────────
-- 15. TIER CONFIG
-- ─────────────────────────────────────────────────────

CREATE TABLE tier_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    volume_requirement DECIMAL(12, 2) NOT NULL,
    platform_fee_pct DECIMAL(5, 2) NOT NULL,
    eligible_level INT NOT NULL CHECK (eligible_level >= 1 AND eligible_level <= 7),
    color TEXT DEFAULT '#000000',
    visibility tier_visibility DEFAULT 'public',
    sort_order INT NOT NULL
);

-- Seed tier data matching admin page defaults
INSERT INTO tier_config (name, volume_requirement, platform_fee_pct, eligible_level, color, visibility, sort_order)
VALUES
    ('Bronze',   25000,  0.75, 1, '#CD7F32', 'public', 1),
    ('Silver',   75000,  0.70, 2, '#C0C0C0', 'public', 2),
    ('Gold',     150000, 0.60, 3, '#D4AF37', 'public', 3),
    ('Platinum', 300000, 0.55, 4, '#A0B2C6', 'public', 4),
    ('Titanium', 500000, 0.50, 5, '#878787', 'public', 5),
    ('Diamond',  750000, 0.45, 6, '#B9F2FF', 'hidden', 6),
    ('Obsidian', 1000000, 0.40, 7, '#2D2D2D', 'hidden', 7);

-- ─────────────────────────────────────────────────────
-- 16. COMMISSION RATES
-- ─────────────────────────────────────────────────────

CREATE TABLE commission_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level INT NOT NULL UNIQUE CHECK (level >= 1 AND level <= 7),
    label TEXT NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Seed commission rates matching admin page defaults
INSERT INTO commission_rates (level, label, commission_rate, is_active)
VALUES
    (1, 'Direct Referrals',     15.0, TRUE),
    (2, '2nd Level Referrals',  10.0, TRUE),
    (3, '3rd Level Referrals',   5.0, TRUE),
    (4, '4th Level Referrals',   3.0, TRUE),
    (5, '5th Level Referrals',   2.0, TRUE),
    (6, '6th Level Referrals',   1.5, FALSE),
    (7, '7th Level Referrals',   1.0, FALSE);

-- ─────────────────────────────────────────────────────
-- 17. USER MONTHLY VOLUME
-- ─────────────────────────────────────────────────────

CREATE TABLE user_monthly_volume (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    sell_volume DECIMAL(12, 2) DEFAULT 0,
    tier_achieved user_tier DEFAULT 'bronze',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month)
);

CREATE INDEX idx_user_monthly_volume_user ON user_monthly_volume(user_id);

-- ─────────────────────────────────────────────────────
-- 18. PLATFORM CONFIG
-- ─────────────────────────────────────────────────────

CREATE TABLE platform_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed platform config with shipping and API settings
INSERT INTO platform_config (key, value, description)
VALUES
    ('shipping_free_threshold', '15000', 'Order value threshold for free shipping ($)'),
    ('shipping_2nd_day_threshold', '40000', 'Order value threshold for FedEx 2nd Day ($)'),
    ('shipping_flat_fee', '20', 'Flat shipping fee for orders below free threshold ($)'),
    ('max_shipment_value', '125000', 'Max shipment value for insurance purposes ($)'),
    ('spot_price_source', '"kitco_scrape"', 'Primary spot price source (kitco_scrape or goldapi)'),
    ('goldapi_key', '""', 'GoldAPI.io API key (sandbox for testing)'),
    ('ecabrella_api_url', '""', 'e-Cabrella API base URL'),
    ('ecabrella_api_key', '""', 'e-Cabrella API key');

-- ─────────────────────────────────────────────────────
-- REFERRAL TREE POPULATION FUNCTION
-- ─────────────────────────────────────────────────────

-- Automatically populates the referral_tree when a new user signs up
CREATE OR REPLACE FUNCTION populate_referral_tree()
RETURNS TRIGGER AS $$
DECLARE
    current_ancestor UUID;
    current_level INT := 1;
BEGIN
    -- Start with the user's direct referrer
    current_ancestor := NEW.referred_by;

    -- Walk up the chain for up to 7 levels
    WHILE current_ancestor IS NOT NULL AND current_level <= 7 LOOP
        INSERT INTO referral_tree (user_id, ancestor_id, level)
        VALUES (NEW.id, current_ancestor, current_level);

        -- Look up the next ancestor
        SELECT referred_by INTO current_ancestor
        FROM users
        WHERE id = current_ancestor;

        current_level := current_level + 1;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_populate_referral_tree
    AFTER INSERT ON users
    FOR EACH ROW
    WHEN (NEW.referred_by IS NOT NULL)
    EXECUTE FUNCTION populate_referral_tree();

-- ─────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER (for users table)
-- ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
