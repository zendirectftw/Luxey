
-- Create attributes table
CREATE TABLE IF NOT EXISTS attributes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attribute_values table
CREATE TABLE IF NOT EXISTS attribute_values (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    slug TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attribute_id, value)
);

-- Initial Seed Data form Attributes
INSERT INTO attributes (name, slug) VALUES 
('Metal', 'metal'),
('Weight', 'weight-classes'),
('Purity', 'purity'),
('Mint', 'mint'),
('Product Type', 'product-types')
ON CONFLICT (slug) DO NOTHING;

-- 1. Seed Metals
WITH attr AS (SELECT id FROM attributes WHERE slug = 'metal')
INSERT INTO attribute_values (attribute_id, value, slug, display_order)
SELECT id, val, lower(regexp_replace(val, '[^a-zA-Z0-9]+', '-', 'g')), ord
FROM attr, (VALUES 
    ('Gold', 1),
    ('Silver', 2),
    ('Platinum', 3),
    ('Palladium', 4)
) AS v(val, ord)
ON CONFLICT (attribute_id, value) DO NOTHING;

-- 2. Seed Weights
WITH attr AS (SELECT id FROM attributes WHERE slug = 'weight-classes')
INSERT INTO attribute_values (attribute_id, value, slug, display_order)
SELECT id, val, lower(regexp_replace(val, '[^a-zA-Z0-9]+', '-', 'g')), ord
FROM attr, (VALUES 
    ('1/10 oz', 1),
    ('1/4 oz', 2),
    ('1/2 oz', 3),
    ('1 oz', 4),
    ('2 oz', 5),
    ('5 oz', 6),
    ('10 oz', 7),
    ('1 kg', 8),
    ('1g', 9),
    ('2g', 10),
    ('5g', 11),
    ('100g', 12)
) AS v(val, ord)
ON CONFLICT (attribute_id, value) DO NOTHING;

-- 3. Seed Purity
WITH attr AS (SELECT id FROM attributes WHERE slug = 'purity')
INSERT INTO attribute_values (attribute_id, value, slug, display_order)
SELECT id, val, lower(regexp_replace(val, '[^a-zA-Z0-9]+', '-', 'g')), ord
FROM attr, (VALUES 
    ('.9999 Fine', 1),
    ('.999 Fine', 2),
    ('.9167 Fine', 3),
    ('.900 Fine', 4)
) AS v(val, ord)
ON CONFLICT (attribute_id, value) DO NOTHING;

-- 4. Seed Mints
WITH attr AS (SELECT id FROM attributes WHERE slug = 'mint')
INSERT INTO attribute_values (attribute_id, value, slug, display_order)
SELECT id, val, lower(regexp_replace(val, '[^a-zA-Z0-9]+', '-', 'g')), ord
FROM attr, (VALUES 
    ('PAMP Suisse', 1),
    ('Royal Canadian Mint', 2),
    ('Perth Mint', 3),
    ('U.S. Mint', 4),
    ('Royal Mint', 5),
    ('Rand Refinery', 6),
    ('Valcambi', 7)
) AS v(val, ord)
ON CONFLICT (attribute_id, value) DO NOTHING;

-- 5. Seed Product Types
WITH attr AS (SELECT id FROM attributes WHERE slug = 'product-types')
INSERT INTO attribute_values (attribute_id, value, slug, display_order)
SELECT id, val, lower(regexp_replace(val, '[^a-zA-Z0-9]+', '-', 'g')), ord
FROM attr, (VALUES 
    ('Coin', 1),
    ('Bar', 2),
    ('Round', 3),
    ('Cast Bar', 4),
    ('Minted Bar', 5)
) AS v(val, ord)
ON CONFLICT (attribute_id, value) DO NOTHING;
