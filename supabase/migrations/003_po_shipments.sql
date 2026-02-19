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
