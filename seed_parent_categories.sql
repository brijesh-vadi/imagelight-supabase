-- ============================================
-- Seed Parent Categories for Saree Platform
-- These are the 5 main category types that all other categories fall under
-- ============================================

-- 1. By Fabric
INSERT INTO public.categories (
  name,
  slug,
  description,
  parent_id,
  level,
  category_type,
  display_order,
  is_active
) VALUES (
  'By Fabric',
  'by-fabric',
  'Categorize sarees based on the primary fabric material used in their construction. Choose from silk, cotton, georgette, chiffon, and many more fabric types.',
  NULL,
  0,
  'fabric',
  0,
  true
);

-- 2. By Occasion
INSERT INTO public.categories (
  name,
  slug,
  description,
  parent_id,
  level,
  category_type,
  display_order,
  is_active
) VALUES (
  'By Occasion',
  'by-occasion',
  'Sarees categorized by the event or occasion they are best suited for. Find the perfect saree for weddings, parties, festivals, casual wear, and more.',
  NULL,
  0,
  'occasion',
  1,
  true
);

-- 3. By Work Type
INSERT INTO public.categories (
  name,
  slug,
  description,
  parent_id,
  level,
  category_type,
  display_order,
  is_active
) VALUES (
  'By Work Type',
  'by-work-type',
  'Categorize sarees based on the type of work, embellishment, or design technique used. Includes embroidered, printed, handloom, zari work, and more.',
  NULL,
  0,
  'work_type',
  2,
  true
);

-- 4. By Regional Style
INSERT INTO public.categories (
  name,
  slug,
  description,
  parent_id,
  level,
  category_type,
  display_order,
  is_active
) VALUES (
  'By Regional Style',
  'by-regional-style',
  'Traditional sarees categorized by their region of origin and distinctive weaving or design style. Explore Banarasi, Kanjeevaram, Chanderi, Paithani, and many more regional specialties.',
  NULL,
  0,
  'regional',
  3,
  true
);
