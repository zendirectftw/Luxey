-- =====================================================
-- LUXEY DEMO SEED DATA — MIGRATION 006
-- Creates a demo user with sample POs, commissions,
-- referrals, shipments, transactions, and volume data
-- =====================================================

-- ─────────────────────────────────────────────────────
-- DEMO USER: Jerrold Gardner
-- ─────────────────────────────────────────────────────

INSERT INTO users (id, email, full_name, phone, address_line1, city, state, zip, referral_code, referred_by, tier, kyc_status)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'jerrold@luxey.com',
    'Jerrold Gardner',
    '8018796505',
    '10114 Grouse Creek Circle',
    'Sandy',
    'UT',
    '84092',
    'JERROLD-GOLD',
    '00000000-0000-0000-0000-000000000001',  -- referred by HOUSE
    'gold',
    'verified'
);

-- ─────────────────────────────────────────────────────
-- REFERRAL USERS (direct referrals of Jerrold)
-- ─────────────────────────────────────────────────────

INSERT INTO users (id, email, full_name, referral_code, referred_by, tier, kyc_status)
VALUES
    ('00000000-0000-0000-0000-000000000010', 'john.smith@example.com', 'John Smith', 'JOHN-SMITH', '00000000-0000-0000-0000-000000000002', 'gold', 'verified'),
    ('00000000-0000-0000-0000-000000000011', 'sarah.connor@example.com', 'Sarah Connor', 'SARAH-CONNOR', '00000000-0000-0000-0000-000000000002', 'silver', 'verified'),
    ('00000000-0000-0000-0000-000000000012', 'michael.thorne@example.com', 'Michael Thorne', 'MICHAEL-THORNE', '00000000-0000-0000-0000-000000000002', 'bronze', 'verified'),
    ('00000000-0000-0000-0000-000000000013', 'elena.rodriguez@example.com', 'Elena Rodriguez', 'ELENA-RODRIGUEZ', '00000000-0000-0000-0000-000000000002', 'bronze', 'verified');

-- 2nd-level referrals (referred by John Smith)
INSERT INTO users (id, email, full_name, referral_code, referred_by, tier, kyc_status)
VALUES
    ('00000000-0000-0000-0000-000000000020', 'amy.chen@example.com', 'Amy Chen', 'AMY-CHEN', '00000000-0000-0000-0000-000000000010', 'bronze', 'verified'),
    ('00000000-0000-0000-0000-000000000021', 'bob.martinez@example.com', 'Bob Martinez', 'BOB-MARTINEZ', '00000000-0000-0000-0000-000000000010', 'bronze', 'verified'),
    ('00000000-0000-0000-0000-000000000022', 'carol.davis@example.com', 'Carol Davis', 'CAROL-DAVIS', '00000000-0000-0000-0000-000000000010', 'silver', 'verified');

-- ─────────────────────────────────────────────────────
-- SAMPLE PRODUCTS (if not already seeded)
-- ─────────────────────────────────────────────────────

INSERT INTO products (id, name, slug, metal, category, weight_oz, purity, mint, year, image_url, is_active)
VALUES
    ('00000000-0000-0000-0001-000000000001', '1 oz Gold Buffalo BU', 'gold-buffalo-1oz', 'gold', 'coin', 1.0000, 0.9999, 'United States Mint', 2024, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Buffalo%20Rev.jpg', TRUE),
    ('00000000-0000-0000-0001-000000000002', '1 oz Gold Eagle BU', 'gold-eagle-1oz', 'gold', 'coin', 1.0000, 0.9167, 'United States Mint', 2024, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold%20Eagle%20rev.jpg', TRUE),
    ('00000000-0000-0000-0001-000000000003', '1 oz PAMP Lady Fortuna', 'pamp-lady-fortuna-1oz', 'gold', 'bar', 1.0000, 0.9999, 'PAMP Suisse', 2023, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Pamp%20Footprint.jpg', TRUE),
    ('00000000-0000-0000-0001-000000000004', '100g Valcambi Gold Bar', 'valcambi-100g', 'gold', 'bar', 3.2151, 0.9999, 'Valcambi', 2024, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Valcambi%20100%20gm%20Gold%20Bar.png', TRUE),
    ('00000000-0000-0000-0001-000000000005', '1 oz Gold Krugerrand', 'gold-krugerrand-1oz', 'gold', 'coin', 1.0000, 0.9167, 'Rand Refinery', 2023, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Rand%20Refinery%201%20oz%20Gold%20Bar.png', TRUE),
    ('00000000-0000-0000-0001-000000000006', '1 oz Canadian Maple Leaf', 'gold-maple-leaf-1oz', 'gold', 'coin', 1.0000, 0.9999, 'Royal Canadian Mint', 2024, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Buffalo%20Rev.jpg', TRUE),
    ('00000000-0000-0000-0001-000000000007', '10 oz RCM Gold Bar', 'rcm-gold-10oz', 'gold', 'bar', 10.0000, 0.9999, 'Royal Canadian Mint', 2024, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Perth%20Mint%201%20oz%20Gold%20Bar.png', TRUE),
    ('00000000-0000-0000-0001-000000000008', '1 oz Austrian Philharmonic', 'gold-philharmonic-1oz', 'gold', 'coin', 1.0000, 0.9999, 'Austrian Mint', 2024, 'https://aouokhwqjizbcoutydig.supabase.co/storage/v1/object/public/product-image/Gold%20Eagle%20rev.jpg', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- SAMPLE SHIPMENTS
-- ─────────────────────────────────────────────────────

INSERT INTO shipments (id, seller_id, dealer_id, total_value, shipping_fee, shipping_tier, tracking_number, carrier, status, shipped_at, delivered_at)
VALUES
    ('00000000-0000-0000-0002-000000000001',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'UGC' LIMIT 1),
     116247.00, 0, 'next_day', '1Z999AA10123456784', 'UPS', 'in_transit', NOW() - INTERVAL '2 days', NULL),
    ('00000000-0000-0000-0002-000000000002',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'APMEX' LIMIT 1),
     121283.00, 0, '2nd_day', '9400111899223100001', 'USPS', 'delivered', NOW() - INTERVAL '10 days', NOW() - INTERVAL '7 days');

-- ─────────────────────────────────────────────────────
-- SAMPLE PURCHASE ORDERS
-- ─────────────────────────────────────────────────────

INSERT INTO purchase_orders (id, po_number, seller_id, dealer_id, product_id, quantity, serial_number, seller_lock_price, dealer_lock_price, platform_fee, status, shipment_id, locked_at, created_at)
VALUES
    -- Active / vault items (seller_paid = complete)
    ('00000000-0000-0000-0003-000000000001', 'LX-2026-00001',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'UGC' LIMIT 1),
     '00000000-0000-0000-0001-000000000001', 1, 'BUF-2024-AX8821',
     2836.00, 2780.00, 17.02, 'seller_paid',
     '00000000-0000-0000-0002-000000000001',
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    ('00000000-0000-0000-0003-000000000002', 'LX-2026-00002',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'UGC' LIMIT 1),
     '00000000-0000-0000-0001-000000000002', 1, 'EAG-2024-KM7742',
     2839.00, 2785.00, 17.03, 'seller_paid',
     '00000000-0000-0000-0002-000000000001',
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    ('00000000-0000-0000-0003-000000000003', 'LX-2026-00003',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'APMEX' LIMIT 1),
     '00000000-0000-0000-0001-000000000003', 1, 'PMP-2023-QR3310',
     2841.50, 2790.00, 17.05, 'seller_paid',
     '00000000-0000-0000-0002-000000000001',
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    ('00000000-0000-0000-0003-000000000004', 'LX-2026-00004',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'APMEX' LIMIT 1),
     '00000000-0000-0000-0001-000000000004', 1, 'VCB-2024-TT1293',
     9125.00, 8950.00, 54.75, 'seller_paid',
     '00000000-0000-0000-0002-000000000001',
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    ('00000000-0000-0000-0003-000000000005', 'LX-2026-00005',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'APMEX' LIMIT 1),
     '00000000-0000-0000-0001-000000000005', 1, 'KRG-2023-FL8800',
     2833.00, 2775.00, 17.00, 'seller_paid',
     '00000000-0000-0000-0002-000000000001',
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    -- Shipped item
    ('00000000-0000-0000-0003-000000000006', 'LX-2026-00006',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'APMEX' LIMIT 1),
     '00000000-0000-0000-0001-000000000006', 1, 'MPL-2023-JF5501',
     2830.00, 2770.00, 16.98, 'shipped',
     '00000000-0000-0000-0002-000000000002',
     NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

    -- Locked item (pending)
    ('00000000-0000-0000-0003-000000000007', 'LX-2026-00007',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'UGC' LIMIT 1),
     '00000000-0000-0000-0001-000000000007', 1, 'RCM-2024-BB6177',
     28360.00, 27800.00, 170.16, 'locked',
     NULL,
     NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

    -- Delivered / complete
    ('00000000-0000-0000-0003-000000000008', 'LX-2026-00008',
     '00000000-0000-0000-0000-000000000002',
     (SELECT id FROM dealers WHERE code = 'UGC' LIMIT 1),
     '00000000-0000-0000-0001-000000000008', 1, 'PHI-2024-ZN2251',
     2834.00, 2780.00, 17.00, 'seller_paid',
     '00000000-0000-0000-0002-000000000002',
     NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days');

-- ─────────────────────────────────────────────────────
-- SAMPLE COMMISSIONS
-- ─────────────────────────────────────────────────────

-- Commissions earned BY Jerrold from his referrals' sales
INSERT INTO commissions (beneficiary_id, source_user_id, purchase_order_id, level, commission_rate, amount, status, paid_at)
VALUES
    -- Level 1 commissions (direct referrals)
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010',
     '00000000-0000-0000-0003-000000000001', 1, 15.00, 784.80, 'paid', NOW() - INTERVAL '5 days'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011',
     '00000000-0000-0000-0003-000000000002', 1, 15.00, 523.20, 'paid', NOW() - INTERVAL '5 days'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012',
     '00000000-0000-0000-0003-000000000003', 1, 15.00, 215.00, 'pending', NULL),
    -- Level 2 commissions (indirect referrals)
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000020',
     '00000000-0000-0000-0003-000000000004', 2, 10.00, 1523.20, 'paid', NOW() - INTERVAL '5 days'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021',
     '00000000-0000-0000-0003-000000000005', 2, 10.00, 450.00, 'pending', NULL),
    -- Level 3 commission
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000022',
     '00000000-0000-0000-0003-000000000006', 3, 5.00, 261.60, 'paid', NOW() - INTERVAL '5 days');

-- ─────────────────────────────────────────────────────
-- SAMPLE TRANSACTIONS
-- ─────────────────────────────────────────────────────

INSERT INTO transactions (user_id, type, amount, reference_id, reference_type, payment_method, status, completed_at)
VALUES
    ('00000000-0000-0000-0000-000000000002', 'seller_payout', 57335.50, '00000000-0000-0000-0002-000000000001', 'shipment', 'wire_transfer', 'pending', NULL),
    ('00000000-0000-0000-0000-000000000002', 'seller_payout', 121283.00, '00000000-0000-0000-0002-000000000002', 'shipment', 'wire_transfer', 'completed', NOW() - INTERVAL '7 days'),
    ('00000000-0000-0000-0000-000000000002', 'commission_payout', 5069.60, NULL, 'commission', 'wire_transfer', 'completed', NOW() - INTERVAL '15 days'),
    ('00000000-0000-0000-0000-000000000002', 'seller_payout', 48200.00, NULL, 'shipment', 'wire_transfer', 'completed', NOW() - INTERVAL '25 days'),
    ('00000000-0000-0000-0000-000000000002', 'seller_payout', 95120.00, NULL, 'shipment', 'wire_transfer', 'completed', NOW() - INTERVAL '52 days'),
    ('00000000-0000-0000-0000-000000000002', 'commission_payout', 4210.00, NULL, 'commission', 'wire_transfer', 'completed', NOW() - INTERVAL '64 days');

-- ─────────────────────────────────────────────────────
-- SAMPLE MONTHLY VOLUME
-- ─────────────────────────────────────────────────────

INSERT INTO user_monthly_volume (user_id, month, sell_volume, tier_achieved)
VALUES
    ('00000000-0000-0000-0000-000000000002', '2026-01-01', 185232.00, 'gold'),
    ('00000000-0000-0000-0000-000000000002', '2025-12-01', 142500.00, 'silver'),
    ('00000000-0000-0000-0000-000000000002', '2025-11-01', 165000.00, 'gold'),
    ('00000000-0000-0000-0000-000000000002', '2026-02-01', 84434.00, 'silver');
