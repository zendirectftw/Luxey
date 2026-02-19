-- =====================================================
-- LUXEY DATABASE — MIGRATION 005: RLS POLICIES
-- =====================================================
-- For Phase 1, we disable RLS on admin-managed tables
-- since we don't have auth yet. Once Supabase Auth is
-- implemented, we'll add proper RLS policies.

-- Disable RLS on all tables for now (allows anon key access)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tree DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE dealers DISABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_product_mapping DISABLE ROW LEVEL SECURITY;
ALTER TABLE spot_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE competitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE shipments DISABLE ROW LEVEL SECURITY;
ALTER TABLE commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tier_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_monthly_volume DISABLE ROW LEVEL SECURITY;
ALTER TABLE platform_config DISABLE ROW LEVEL SECURITY;
