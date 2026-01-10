# Saree Categories Structure

This document outlines all the categories available for the saree B2B platform. Categories are organized in a parent-child hierarchy.

---

## 1. By Fabric (Parent Category)

**Description:** Categorize sarees based on the primary fabric material used in their construction.

### Child Categories:
- Silk Sarees
- Cotton Sarees
- Georgette Sarees
- Chiffon Sarees
- Crepe Sarees
- Satin Sarees
- Net Sarees
- Organza Sarees
- Velvet Sarees
- Linen Sarees
- Tussar Silk Sarees
- Art Silk Sarees
- Khadi Sarees
- Poly Cotton Sarees
- Cotton Silk Blend Sarees

---

## 2. By Occasion (Parent Category)

**Description:** Sarees categorized by the event or occasion they are best suited for.

### Child Categories:
- Casual Wear Sarees
- Daily Wear Sarees
- Office Wear Sarees
- Party Wear Sarees
- Wedding Sarees
- Bridal Sarees
- Festival Sarees
- Engagement Sarees
- Reception Sarees  
- Sangeet Sarees
- Mehendi Sarees
- Cocktail Party Sarees
- Anniversary Sarees
- Religious Ceremony Sarees

---

## 3. By Work Type (Parent Category)

**Description:** Categorize sarees based on the type of work, embellishment, or design technique used.

### Child Categories:
- Embroidered Sarees
- Zari Work Sarees
- Sequin Work Sarees
- Thread Work Sarees
- Stone Work Sarees
- Mirror Work Sarees
- Printed Sarees
- Digital Print Sarees
- Block Print Sarees
- Screen Print Sarees
- Batik Print Sarees
- Tie & Dye Sarees (Bandhani)
- Handloom Sarees
- Jacquard Sarees
- Brocade Sarees
- Plain/Solid Sarees
- Border Work Sarees
- Pallu Work Sarees
- All Over Work Sarees

---

## 4. By Regional Style (Parent Category)

**Description:** Traditional sarees categorized by their region of origin and distinctive weaving/design style.

### Child Categories:
- Banarasi Sarees (Uttar Pradesh)
- Kanjeevaram Sarees (Tamil Nadu)
- Kanchipuram Sarees (Tamil Nadu)
- Chanderi Sarees (Madhya Pradesh)
- Paithani Sarees (Maharashtra)
- Bandhani Sarees (Gujarat/Rajasthan)
- Tant Sarees (West Bengal)
- Patola Sarees (Gujarat)
- Sambalpuri Sarees (Odisha)
- Pochampally Sarees (Telangana)
- Mysore Silk Sarees (Karnataka)
- Maheshwari Sarees (Madhya Pradesh)
- Assam Silk Sarees (Assam)
- Muga Silk Sarees (Assam)
- Kasavu Sarees (Kerala)
- Narayanpet Sarees (Telangana)
- Gadwal Sarees (Telangana)
- Uppada Sarees (Andhra Pradesh)
- Venkatagiri Sarees (Andhra Pradesh)
- Baluchari Sarees (West Bengal)
- Jamdani Sarees (West Bengal)
- Bomkai Sarees (Odisha)
- Kota Doria Sarees (Rajasthan)
- Leheriya Sarees (Rajasthan)

## Sample SQL Insert Statements:

```sql
-- Parent Category: By Fabric
INSERT INTO categories (name, slug, description, category_type, level, display_order)
VALUES (
  'By Fabric',
  'by-fabric',
  'Categorize sarees based on the primary fabric material used in their construction.',
  'fabric',
  0,
  0
);

-- Child Category: Silk Sarees
INSERT INTO categories (name, slug, parent_id, category_type, level, display_order)
VALUES (
  'Silk Sarees',
  'silk-sarees',
  '<parent-category-id>',
  'fabric',
  1,
  0
);
```

---

## Total Categories:
- **Parent Categories:** 5
- **Child Categories:** ~100+
- **Total:** 105+ categories

This structure provides comprehensive categorization while maintaining simplicity and ease of navigation for both manufacturers and dealers.
