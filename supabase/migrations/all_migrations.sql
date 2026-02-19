-- =====================================================
-- LUXEY DATABASE SCHEMA — MIGRATION 001: CORE TABLES
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────

CREATE TYPE metal_type AS ENUM ('gold', 'silver', 'platinum', 'palladium');
CREATE TYPE product_category AS ENUM ('coin', 'bar', 'round');
CREATE TYPE user_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'titanium', 'diamond', 'obsidian');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE dealer_auth_method AS ENUM ('api_key', 'oauth', 'session');
CREATE TYPE fetch_method_type AS ENUM ('api', 'scrape', 'screenshot');
CREATE TYPE tier_visibility AS ENUM ('public', 'hidden');

-- ─────────────────────────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────────────────────────

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id),
    tier user_tier DEFAULT 'bronze',
    kyc_status kyc_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for referral code lookups
CREATE INDEX idx_users_referral_code ON users(referral_code);

-- ─────────────────────────────────────────────────────
-- 2. REFERRAL TREE
-- ─────────────────────────────────────────────────────

CREATE TABLE referral_tree (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ancestor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INT NOT NULL CHECK (level >= 1 AND level <= 7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, level)
);

CREATE INDEX idx_referral_tree_user ON referral_tree(user_id);
CREATE INDEX idx_referral_tree_ancestor ON referral_tree(ancestor_id);

-- ─────────────────────────────────────────────────────
-- 3. PRODUCTS
-- ─────────────────────────────────────────────────────

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    metal metal_type NOT NULL,
    category product_category NOT NULL,
    weight_oz DECIMAL(10, 4) NOT NULL,
    purity DECIMAL(6, 4) DEFAULT 0.9999,
    mint TEXT,
    year INT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_metal ON products(metal);

-- ─────────────────────────────────────────────────────
-- 4. DEALERS
-- ─────────────────────────────────────────────────────

CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    display_city TEXT,
    code TEXT UNIQUE NOT NULL,
    api_base_url TEXT,
    api_key_encrypted TEXT,
    auth_method dealer_auth_method,
    spot_offset DECIMAL(10, 2) DEFAULT 0,
    shipping_address JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────
-- 5. DEALER PRODUCT MAPPING
-- ─────────────────────────────────────────────────────

CREATE TABLE dealer_product_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    dealer_sku_id TEXT,
    dealer_product_url TEXT,
    fetch_method fetch_method_type DEFAULT 'api',
    scrape_config JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(dealer_id, product_id)
);

-- ─────────────────────────────────────────────────────
-- INSERT HOUSE USER (for organic signups)
-- ─────────────────────────────────────────────────────

INSERT INTO users (id, email, full_name, referral_code, tier, kyc_status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'house@luxey.com',
    'LUXEY HOUSE',
    'LUXEY-HOUSE',
    'obsidian',
    'verified'
);

-- ─────────────────────────────────────────────────────
-- INSERT INITIAL DEALERS
-- ─────────────────────────────────────────────────────

INSERT INTO dealers (name, display_name, display_city, code, spot_offset, shipping_address, is_active)
VALUES
    ('Upstate Gold and Coin', 'LUXEY - DENVER', 'Denver, CO', 'UGC', -5.00, '{"street": "", "city": "Denver", "state": "CO", "zip": ""}', TRUE),
    ('APMEX', 'LUXEY - OKC', 'Oklahoma City, OK', 'APMEX', -5.00, '{"street": "", "city": "Oklahoma City", "state": "OK", "zip": ""}', TRUE),
    ('A-MARK', 'LUXEY - VEGAS', 'Las Vegas, NV', 'AMARK', -5.00, '{"street": "", "city": "Las Vegas", "state": "NV", "zip": ""}', TRUE);
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
-- =====================================================
-- LUXEY DATABASE SCHEMA — MIGRATION 003: PO & SHIPMENTS
-- =====================================================

-- ─────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────

CREATE TYPE po_status AS ENUM (
    'locked',
    'label_sent',
    'shipped',
    'delivered',
    'dealer_verified',
    'luxey_paid',
    'seller_paid'
);

CREATE TYPE label_preference AS ENUM ('immediate', 'deferred');

CREATE TYPE shipping_tier AS ENUM ('standard', '2nd_day', 'next_day');

CREATE TYPE shipment_status AS ENUM ('label_created', 'in_transit', 'delivered');

-- ─────────────────────────────────────────────────────
-- 12. SHIPMENTS (must create before POs due to FK)
-- ─────────────────────────────────────────────────────

CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id),
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    total_value DECIMAL(12, 2) DEFAULT 0,
    shipping_fee DECIMAL(8, 2) DEFAULT 0,
    shipping_tier shipping_tier DEFAULT 'standard',
    tracking_number TEXT,
    carrier TEXT DEFAULT 'FedEx',
    label_url TEXT,
    packing_slip_url TEXT,
    insurance_value DECIMAL(12, 2),
    ecabrella_shipment_id TEXT,
    insurance_policy_id TEXT,
    status shipment_status DEFAULT 'label_created',
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Hard block: max $125,000 per shipment
    CONSTRAINT check_max_shipment_value CHECK (total_value <= 125000)
);

CREATE INDEX idx_shipments_seller ON shipments(seller_id);
CREATE INDEX idx_shipments_dealer ON shipments(dealer_id);

-- ─────────────────────────────────────────────────────
-- 11. PURCHASE ORDERS
-- ─────────────────────────────────────────────────────

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number TEXT UNIQUE NOT NULL,
    dealer_epo_number TEXT,
    seller_id UUID NOT NULL REFERENCES users(id),
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT DEFAULT 1,
    serial_number TEXT,
    seller_lock_price DECIMAL(12, 2) NOT NULL,
    dealer_lock_price DECIMAL(12, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0,
    shipping_fee DECIMAL(8, 2) DEFAULT 0,
    luxey_margin DECIMAL(10, 2) DEFAULT 0,
    label_preference label_preference DEFAULT 'immediate',
    status po_status DEFAULT 'locked',
    shipment_id UUID REFERENCES shipments(id),
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    label_generated_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_po_seller_status ON purchase_orders(seller_id, status);
CREATE INDEX idx_po_dealer_status ON purchase_orders(dealer_id, status);
CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_shipment ON purchase_orders(shipment_id);

-- ─────────────────────────────────────────────────────
-- PO NUMBER SEQUENCE
-- ─────────────────────────────────────────────────────

CREATE SEQUENCE po_number_seq START 1;

-- Function to auto-generate PO numbers
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.po_number := 'LX-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('po_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_po_number
    BEFORE INSERT ON purchase_orders
    FOR EACH ROW
    WHEN (NEW.po_number IS NULL OR NEW.po_number = '')
    EXECUTE FUNCTION generate_po_number();
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
