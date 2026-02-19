
-- 011_seed_aligned_categories.sql

-- 1. Ensure Top-Level Categories (Metals) exist
INSERT INTO categories (name, slug, description, parent_id)
VALUES 
('Gold', 'gold', 'Gold Products', NULL),
('Silver', 'silver', 'Silver Products', NULL),
('Platinum', 'platinum', 'Platinum Products', NULL),
('Palladium', 'palladium', 'Palladium Products', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Sub-Categories (Metal + Type)
DO $$
DECLARE
    m RECORD;
    t TEXT;
    type_slug TEXT;
BEGIN
    FOR m IN SELECT id, name, slug FROM categories WHERE parent_id IS NULL LOOP
        -- Define types to generate subcategories for
        FOREACH t IN ARRAY ARRAY['Coin', 'Bar', 'Round', 'Cast Bar', 'Minted Bar'] LOOP
            
            -- specific slug logic: gold-coins, gold-cast-bars
            type_slug := m.slug || '-' || lower(regexp_replace(t, '[^a-zA-Z0-9]+', '-', 'g')) || 's';
            
            INSERT INTO categories (name, slug, description, parent_id)
            VALUES (
                m.name || ' ' || t || 's',  -- e.g. "Gold Coins"
                type_slug,                   -- e.g. "gold-coins"
                m.name || ' ' || t || 's',
                m.id
            )
            ON CONFLICT (slug) DO NOTHING;
            
        END LOOP;
    END LOOP;
END $$;
