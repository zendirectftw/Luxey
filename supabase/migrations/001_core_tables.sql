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
