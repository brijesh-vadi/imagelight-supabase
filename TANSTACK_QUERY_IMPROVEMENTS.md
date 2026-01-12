# TanStack Query Implementation Suggestions

## Current State Analysis

### ✅ Already Using TanStack Query Well
1. **Public Pages**
   - Landing page products with pagination (`LandingPageClient`)
   - More from manufacturer section (`MoreFromManufacturer`)

2. **Dealer Pages**
   - Cart management with mutations (`DealerCartView`)
   - Products list with filters (`DealerProductsClient`)
   - Manufacturers list with pagination (`ManufacturersListView`)

3. **Manufacturer Pages**
   - Dealers list with pagination (`DealersListView`)

4. **Custom Hooks**
   - `useCart` - Cart items
   - `useOrders` - Dealer orders
   - `useDealerProducts` - Dealer products with filters
   - `useManufacturerUsedCategories` - Categories used by manufacturer

---

## 🎯 Areas for Improvement

### 1. **Manufacturer Products Page** (HIGH PRIORITY)
**Current:** Server-side fetching in page component
**File:** `src/app/manufacturer/(protected)/products/page.tsx`

**Issues:**
- Fetches units and categories on every page load
- No caching between navigations
- Form data not cached

**Suggested Changes:**
```typescript
// Create hooks:
- useUnits() - Cache units globally
- useParentCategories() - Cache parent categories
- useManufacturerProducts() - Already exists but not used in page

// Benefits:
- Units/categories cached across all product operations
- Faster form loading
- Better UX when switching between add/edit/list
```

---

### 2. **Order Pages** (HIGH PRIORITY)
**Current:** Direct server fetching
**Files:** 
- `src/app/dealer/(protected)/orders/page.tsx`
- `src/app/dealer/(protected)/orders/[id]/page.tsx`
- `src/app/manufacturer/(protected)/orders/page.tsx`
- `src/app/manufacturer/(protected)/orders/[id]/page.tsx`

**Issues:**
- No real-time updates
- No optimistic updates
- Refetches entire list after status changes

**Suggested Changes:**
```typescript
// Create hooks:
- useOrders() - Already exists for dealer, extend for manufacturer
- useOrderDetail(orderId) - Single order with auto-refresh
- useUpdateOrderStatus() - Mutation with optimistic updates

// Create mutations:
- useCancelOrder() - With optimistic UI
- useUpdateOrderStatus() - For manufacturer
- useConfirmDelivery() - For dealer

// Benefits:
- Real-time order status updates
- Optimistic UI for better UX
- Automatic cache invalidation
- Polling for pending orders
```

---

### 3. **Admin Categories** (MEDIUM PRIORITY)
**Current:** Mixed - some pages fetch directly
**File:** `src/components/role/admin/view/categories/AdminCategoriesView.tsx`

**Issues:**
- Categories fetched on every mount
- No cache between admin operations
- Add/Edit/Delete don't use mutations

**Suggested Changes:**
```typescript
// Create hooks:
- useAdminCategories() - With filters
- useAddCategory() - Mutation
- useUpdateCategory() - Mutation
- useDeleteCategory() - Mutation

// Benefits:
- Instant UI updates after CRUD operations
- Cached categories across admin panel
- Optimistic updates for better UX
```

---

### 4. **Product Detail Pages** (MEDIUM PRIORITY)
**Current:** Server-side only
**Files:**
- `src/app/(public)/products/[id]/page.tsx`
- `src/app/dealer/(protected)/products/[id]/page.tsx`

**Issues:**
- No cache when navigating back
- Can't update cart from detail page without refetch

**Suggested Changes:**
```typescript
// Create hooks:
- useProductDetail(productId) - Cache product details
- useAddToCart() - Already exists but improve integration

// Benefits:
- Instant back navigation (cached)
- Prefetch on hover for faster navigation
- Real-time stock updates
```

---

### 5. **Dealer Cart** (LOW PRIORITY - Already Good)
**Current:** Using mutations well
**Improvements:**
```typescript
// Add:
- Optimistic quantity updates (already has mutations)
- Prefetch cart on login
- Background sync for cart items

// Benefits:
- Even faster UI updates
- Better offline support
```

---

### 6. **Manufacturer Dashboard** (MEDIUM PRIORITY)
**Current:** Likely fetching stats directly

**Suggested Changes:**
```typescript
// Create hooks:
- useManufacturerStats() - With auto-refresh
- useRecentOrders() - Real-time updates
- useLowStockProducts() - Alerts

// Benefits:
- Real-time dashboard updates
- Polling for new orders
- Better performance
```

---

### 7. **Dealer Dashboard** (MEDIUM PRIORITY)
**Similar to manufacturer dashboard**

**Suggested Changes:**
```typescript
// Create hooks:
- useDealerStats()
- useRecentOrders()
- useRecommendedProducts()

// Benefits:
- Real-time updates
- Personalized recommendations
- Better caching
```

---

## 📋 Implementation Priority

### Phase 1 (Immediate - High Impact)
1. ✅ **Manufacturer Products** - Create `useUnits()` and `useParentCategories()`
2. ✅ **Orders System** - Create order hooks and mutations
3. ✅ **Product Details** - Add caching for detail pages

### Phase 2 (Next - Medium Impact)
4. **Admin Categories** - Full CRUD with mutations
5. **Dashboard Stats** - Real-time updates
6. **Manufacturer Applications** - Better state management

### Phase 3 (Future - Nice to Have)
7. **Prefetching** - Hover prefetch for products
8. **Background Sync** - Offline support
9. **Optimistic Updates** - All mutations
10. **Real-time** - WebSocket integration with React Query

---

## 🎨 Best Practices to Follow

### 1. **Query Keys Structure**
```typescript
// Good - Hierarchical
["products", "list", { page, search, category }]
["products", "detail", productId]
["orders", "list", { status, page }]
["orders", "detail", orderId]

// Bad - Flat
["products-list"]
["product-detail"]
```

### 2. **Stale Time Configuration**
```typescript
// Static data (categories, units)
staleTime: 5 * 60 * 1000 // 5 minutes

// Dynamic data (products, orders)
staleTime: 30 * 1000 // 30 seconds

// Real-time data (cart, notifications)
staleTime: 0 // Always fresh
```

### 3. **Cache Time**
```typescript
// Keep in cache even when unused
cacheTime: 10 * 60 * 1000 // 10 minutes
```

### 4. **Mutations Pattern**
```typescript
const mutation = useMutation({
  mutationFn: addProduct,
  onMutate: async (newProduct) => {
    // Optimistic update
    await queryClient.cancelQueries(['products'])
    const previous = queryClient.getQueryData(['products'])
    queryClient.setQueryData(['products'], old => [...old, newProduct])
    return { previous }
  },
  onError: (err, newProduct, context) => {
    // Rollback on error
    queryClient.setQueryData(['products'], context.previous)
  },
  onSettled: () => {
    // Refetch to sync with server
    queryClient.invalidateQueries(['products'])
  }
})
```

### 5. **Prefetching**
```typescript
// On hover
const prefetchProduct = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => getProductById(id),
  })
}

// On mount
useEffect(() => {
  queryClient.prefetchQuery(['categories'])
}, [])
```

---

## 📊 Expected Benefits

### Performance
- 50-70% faster navigation (cached data)
- Instant UI updates (optimistic)
- Reduced server load (smart caching)

### User Experience
- No loading spinners on back navigation
- Instant feedback on actions
- Real-time updates without refresh

### Developer Experience
- Centralized data fetching logic
- Easier debugging with DevTools
- Less boilerplate code
- Better error handling

---

## 🚀 Quick Wins (Start Here)

1. **Create `useUnits()` hook** - Used in multiple forms
2. **Create `useParentCategories()` hook** - Used in product forms
3. **Add mutations to cart operations** - Already partially done
4. **Create `useOrderDetail()` hook** - For order pages
5. **Add optimistic updates to product CRUD** - Better UX

---

## 📝 Notes

- All server actions are already created, just need to wrap in hooks
- Most components are already client components
- Query client is already set up in layout
- DevTools should be enabled in development

Would you like me to start implementing any of these suggestions?
