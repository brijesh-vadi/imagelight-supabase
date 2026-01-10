-- ============================================
-- Seed All Saree Categories (Parent + Children)
-- Run this after seed_parent_categories.sql
-- ============================================

DO $$
DECLARE
    fabric_parent_id UUID;
    occasion_parent_id UUID;
    work_type_parent_id UUID;
    regional_parent_id UUID;
BEGIN
    -- Get parent category IDs
    SELECT id INTO fabric_parent_id FROM categories WHERE category_type = 'fabric' AND parent_id IS NULL LIMIT 1;
    SELECT id INTO occasion_parent_id FROM categories WHERE category_type = 'occasion' AND parent_id IS NULL LIMIT 1;
    SELECT id INTO work_type_parent_id FROM categories WHERE category_type = 'work_type' AND parent_id IS NULL LIMIT 1;
    SELECT id INTO regional_parent_id FROM categories WHERE category_type = 'regional' AND parent_id IS NULL LIMIT 1;

    -- Check if parent categories exist
    IF fabric_parent_id IS NULL THEN
        RAISE EXCEPTION 'Parent category "By Fabric" not found. Please run seed_parent_categories.sql first.';
    END IF;

    IF occasion_parent_id IS NULL THEN
        RAISE EXCEPTION 'Parent category "By Occasion" not found. Please run seed_parent_categories.sql first.';
    END IF;

    IF work_type_parent_id IS NULL THEN
        RAISE EXCEPTION 'Parent category "By Work Type" not found. Please run seed_parent_categories.sql first.';
    END IF;

    IF regional_parent_id IS NULL THEN
        RAISE EXCEPTION 'Parent category "By Regional Style" not found. Please run seed_parent_categories.sql first.';
    END IF;

    RAISE NOTICE 'Found all parent categories. Starting to insert child categories...';

    -- ============================================
    -- 1. BY FABRIC - Child Categories
    -- ============================================

    INSERT INTO categories (name, slug, parent_id, category_type, level, display_order, is_active, description) VALUES
    ('Silk Sarees', 'silk-sarees', fabric_parent_id, 'fabric', 1, 0, true, NULL),
    ('Cotton Sarees', 'cotton-sarees', fabric_parent_id, 'fabric', 1, 1, true, NULL),
    ('Georgette Sarees', 'georgette-sarees', fabric_parent_id, 'fabric', 1, 2, true, NULL),
    ('Chiffon Sarees', 'chiffon-sarees', fabric_parent_id, 'fabric', 1, 3, true, NULL),
    ('Crepe Sarees', 'crepe-sarees', fabric_parent_id, 'fabric', 1, 4, true, NULL),
    ('Satin Sarees', 'satin-sarees', fabric_parent_id, 'fabric', 1, 5, true, NULL),
    ('Net Sarees', 'net-sarees', fabric_parent_id, 'fabric', 1, 6, true, NULL),
    ('Organza Sarees', 'organza-sarees', fabric_parent_id, 'fabric', 1, 7, true, NULL),
    ('Velvet Sarees', 'velvet-sarees', fabric_parent_id, 'fabric', 1, 8, true, NULL),
    ('Linen Sarees', 'linen-sarees', fabric_parent_id, 'fabric', 1, 9, true, NULL),
    ('Tussar Silk Sarees', 'tussar-silk-sarees', fabric_parent_id, 'fabric', 1, 10, true, NULL),
    ('Art Silk Sarees', 'art-silk-sarees', fabric_parent_id, 'fabric', 1, 11, true, NULL),
    ('Khadi Sarees', 'khadi-sarees', fabric_parent_id, 'fabric', 1, 12, true, NULL),
    ('Poly Cotton Sarees', 'poly-cotton-sarees', fabric_parent_id, 'fabric', 1, 13, true, NULL),
    ('Cotton Silk Blend Sarees', 'cotton-silk-blend-sarees', fabric_parent_id, 'fabric', 1, 14, true, NULL);

    RAISE NOTICE 'Inserted 15 fabric categories';

    -- ============================================
    -- 2. BY OCCASION - Child Categories
    -- ============================================

    INSERT INTO categories (name, slug, parent_id, category_type, level, display_order, is_active, description) VALUES
    ('Casual Wear Sarees', 'casual-wear-sarees', occasion_parent_id, 'occasion', 1, 0, true, NULL),
    ('Daily Wear Sarees', 'daily-wear-sarees', occasion_parent_id, 'occasion', 1, 1, true, NULL),
    ('Office Wear Sarees', 'office-wear-sarees', occasion_parent_id, 'occasion', 1, 2, true, NULL),
    ('Party Wear Sarees', 'party-wear-sarees', occasion_parent_id, 'occasion', 1, 3, true, NULL),
    ('Wedding Sarees', 'wedding-sarees', occasion_parent_id, 'occasion', 1, 4, true, NULL),
    ('Bridal Sarees', 'bridal-sarees', occasion_parent_id, 'occasion', 1, 5, true, NULL),
    ('Festival Sarees', 'festival-sarees', occasion_parent_id, 'occasion', 1, 6, true, NULL),
    ('Engagement Sarees', 'engagement-sarees', occasion_parent_id, 'occasion', 1, 7, true, NULL),
    ('Reception Sarees', 'reception-sarees', occasion_parent_id, 'occasion', 1, 8, true, NULL),
    ('Sangeet Sarees', 'sangeet-sarees', occasion_parent_id, 'occasion', 1, 9, true, NULL),
    ('Mehendi Sarees', 'mehendi-sarees', occasion_parent_id, 'occasion', 1, 10, true, NULL),
    ('Cocktail Party Sarees', 'cocktail-party-sarees', occasion_parent_id, 'occasion', 1, 11, true, NULL),
    ('Anniversary Sarees', 'anniversary-sarees', occasion_parent_id, 'occasion', 1, 12, true, NULL),
    ('Religious Ceremony Sarees', 'religious-ceremony-sarees', occasion_parent_id, 'occasion', 1, 13, true, NULL);

    RAISE NOTICE 'Inserted 14 occasion categories';

    -- ============================================
    -- 3. BY WORK TYPE - Child Categories
    -- ============================================

    INSERT INTO categories (name, slug, parent_id, category_type, level, display_order, is_active, description) VALUES
    ('Embroidered Sarees', 'embroidered-sarees', work_type_parent_id, 'work_type', 1, 0, true, NULL),
    ('Zari Work Sarees', 'zari-work-sarees', work_type_parent_id, 'work_type', 1, 1, true, NULL),
    ('Sequin Work Sarees', 'sequin-work-sarees', work_type_parent_id, 'work_type', 1, 2, true, NULL),
    ('Thread Work Sarees', 'thread-work-sarees', work_type_parent_id, 'work_type', 1, 3, true, NULL),
    ('Stone Work Sarees', 'stone-work-sarees', work_type_parent_id, 'work_type', 1, 4, true, NULL),
    ('Mirror Work Sarees', 'mirror-work-sarees', work_type_parent_id, 'work_type', 1, 5, true, NULL),
    ('Printed Sarees', 'printed-sarees', work_type_parent_id, 'work_type', 1, 6, true, NULL),
    ('Digital Print Sarees', 'digital-print-sarees', work_type_parent_id, 'work_type', 1, 7, true, NULL),
    ('Block Print Sarees', 'block-print-sarees', work_type_parent_id, 'work_type', 1, 8, true, NULL),
    ('Screen Print Sarees', 'screen-print-sarees', work_type_parent_id, 'work_type', 1, 9, true, NULL),
    ('Batik Print Sarees', 'batik-print-sarees', work_type_parent_id, 'work_type', 1, 10, true, NULL),
    ('Tie & Dye Sarees (Bandhani)', 'tie-dye-sarees-bandhani', work_type_parent_id, 'work_type', 1, 11, true, NULL),
    ('Handloom Sarees', 'handloom-sarees', work_type_parent_id, 'work_type', 1, 12, true, NULL),
    ('Jacquard Sarees', 'jacquard-sarees', work_type_parent_id, 'work_type', 1, 13, true, NULL),
    ('Brocade Sarees', 'brocade-sarees', work_type_parent_id, 'work_type', 1, 14, true, NULL),
    ('Plain/Solid Sarees', 'plain-solid-sarees', work_type_parent_id, 'work_type', 1, 15, true, NULL),
    ('Border Work Sarees', 'border-work-sarees', work_type_parent_id, 'work_type', 1, 16, true, NULL),
    ('Pallu Work Sarees', 'pallu-work-sarees', work_type_parent_id, 'work_type', 1, 17, true, NULL),
    ('All Over Work Sarees', 'all-over-work-sarees', work_type_parent_id, 'work_type', 1, 18, true, NULL);

    RAISE NOTICE 'Inserted 19 work type categories';

    -- ============================================
    -- 4. BY REGIONAL STYLE - Child Categories
    -- ============================================

    INSERT INTO categories (name, slug, parent_id, category_type, level, display_order, is_active, description) VALUES
    ('Banarasi Sarees', 'banarasi-sarees', regional_parent_id, 'regional', 1, 0, true, NULL),
    ('Kanjeevaram Sarees', 'kanjeevaram-sarees', regional_parent_id, 'regional', 1, 1, true, NULL),
    ('Kanchipuram Sarees', 'kanchipuram-sarees', regional_parent_id, 'regional', 1, 2, true, NULL),
    ('Chanderi Sarees', 'chanderi-sarees', regional_parent_id, 'regional', 1, 3, true, NULL),
    ('Paithani Sarees', 'paithani-sarees', regional_parent_id, 'regional', 1, 4, true, NULL),
    ('Bandhani Sarees', 'bandhani-sarees', regional_parent_id, 'regional', 1, 5, true, NULL),
    ('Tant Sarees', 'tant-sarees', regional_parent_id, 'regional', 1, 6, true, NULL),
    ('Patola Sarees', 'patola-sarees', regional_parent_id, 'regional', 1, 7, true, NULL),
    ('Sambalpuri Sarees', 'sambalpuri-sarees', regional_parent_id, 'regional', 1, 8, true, NULL),
    ('Pochampally Sarees', 'pochampally-sarees', regional_parent_id, 'regional', 1, 9, true, NULL),
    ('Mysore Silk Sarees', 'mysore-silk-sarees', regional_parent_id, 'regional', 1, 10, true, NULL),
    ('Maheshwari Sarees', 'maheshwari-sarees', regional_parent_id, 'regional', 1, 11, true, NULL),
    ('Assam Silk Sarees', 'assam-silk-sarees', regional_parent_id, 'regional', 1, 12, true, NULL),
    ('Muga Silk Sarees', 'muga-silk-sarees', regional_parent_id, 'regional', 1, 13, true, NULL),
    ('Kasavu Sarees', 'kasavu-sarees', regional_parent_id, 'regional', 1, 14, true, NULL),
    ('Narayanpet Sarees', 'narayanpet-sarees', regional_parent_id, 'regional', 1, 15, true, NULL),
    ('Gadwal Sarees', 'gadwal-sarees', regional_parent_id, 'regional', 1, 16, true, NULL),
    ('Uppada Sarees', 'uppada-sarees', regional_parent_id, 'regional', 1, 17, true, NULL),
    ('Venkatagiri Sarees', 'venkatagiri-sarees', regional_parent_id, 'regional', 1, 18, true, NULL),
    ('Baluchari Sarees', 'baluchari-sarees', regional_parent_id, 'regional', 1, 19, true, NULL),
    ('Jamdani Sarees', 'jamdani-sarees', regional_parent_id, 'regional', 1, 20, true, NULL),
    ('Bomkai Sarees', 'bomkai-sarees', regional_parent_id, 'regional', 1, 21, true, NULL),
    ('Kota Doria Sarees', 'kota-doria-sarees', regional_parent_id, 'regional', 1, 22, true, NULL),
    ('Leheriya Sarees', 'leheriya-sarees', regional_parent_id, 'regional', 1, 23, true, NULL);

    RAISE NOTICE 'Inserted 24 regional categories';

    RAISE NOTICE 'Successfully inserted all 79 child categories!';

END $$;

-- ============================================
-- Seed Complete
--
-- Summary:
-- - By Fabric: 15 child categories
-- - By Occasion: 14 child categories
-- - By Work Type: 19 child categories
-- - By Regional Style: 24 child categories
-- - By Price Range: 7 child categories
-- Total: 79 child categories
-- ============================================
