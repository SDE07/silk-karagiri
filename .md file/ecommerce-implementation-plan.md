# Silk Karagiri — Full E-Commerce Implementation Plan
> Stack: **Next.js 16 (App Router)** · **TypeScript** · **TailwindCSS v4** · **Radix UI / shadcn** · **Framer Motion** · **GSAP**
> Brand palette: Deep Crimson `#6b1426` · Gold `#b8862b` · Dark Teal `#004e5e` · Vanilla Custard `#fdf7ec`

---

## Current State Audit

| Already Built | Status |
|---|---|
| `app/products/page.tsx` | Exists — renders `ProductHero3DSection` only |
| `ProductHero3DSection` | ✅ 3D GLB viewer + 12 Glass Folders + `ProductDetailPage` showcase |
| `ProductCard` | ✅ Card with Add-to-Bag, badge, rating |
| `CartContext` + `CartDrawer` | ✅ localStorage-persisted cart |
| `app/api/products/route.ts` | ✅ GET with category + search filter |
| `productService` | Exists (service layer ready) |
| Types: `Product`, `CartItem` | ✅ |
| Fonts (Cormorant, Marcellus, Montserrat) | ✅ |
| Layout (Navbar, Footer, Announcement, Curtain intro) | ✅ |

---

## What We Are Building

```
/products                  → Full product listing page (already has hero, needs grid + filters)
/products/[slug]           → Individual product detail page (deep link)
/checkout                  → Checkout flow (address → payment → confirmation)
/account                   → Customer login / register / orders  //not required to this  user login not used full theis 
/admin                     → Admin panel (login-gated)
  /admin/dashboard         → Stats overview
  /admin/products          → Product CRUD table
  /admin/products/new      → Add product (with image upload)
  /admin/products/[id]     → Edit product
  /admin/orders            → Orders table (filter by status/date)
  /admin/coupons           → Coupon CRUD
  /admin/settings          → Site settings
  also important thing to see the admin panel is also  gated by the  user visited then if possible 
```

---

## Section 1 — Data Layer & Models

**Goal:** Centralise all data shapes before touching any UI.

### 1.1 Extend `Product` type

**File:** `src/types/product.types.ts`

```ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string;
  fabric?: string;
  motif?: string;
  border?: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  inStock: boolean;
  images: string[];          // array (was single image)
  image: string;             // cover — first of images
  badge?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  sku?: string;
  collectionSlug?: string;   // links back to SAREE_COLLECTIONS
  createdAt?: string;
  updatedAt?: string;
}
```

### 1.2 New types

**File:** `src/types/order.types.ts`

```ts
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;       // e.g. "SK-2026-0001"
  customerId?: string;
  guestEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

**File:** `src/types/coupon.types.ts`

```ts
export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  id: string;
  code: string;                    // e.g. "SILK20"
  type: CouponType;
  value: number;                   // 20 → 20% off or ₹20 off
  minOrderValue?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}
```

**File:** `src/types/admin.types.ts`

```ts
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;           // % vs last period
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  lowStockCount: number;
  totalCustomers: number;
  customersChange: number;
}
```

### 1.3 Storage strategy

Since there is no DB yet, use **JSON-file store** under `data/` (swappable to Prisma/Supabase later):

```
src/
  data/
    collections.data.ts   ← existing
    products.data.ts       ← NEW (seed from SAREE_COLLECTIONS)
    orders.data.ts         ← NEW (starts empty, written on checkout)
    coupons.data.ts        ← NEW
    admin-users.data.ts    ← NEW (hashed passwords)
```

**Files involved:**
- `src/services/product.service.ts` — update to read `products.data.ts`
- `src/services/order.service.ts` — NEW
- `src/services/coupon.service.ts` — NEW
- `src/services/auth.service.ts` — NEW (simple JWT cookie, no external auth library)

---

## Section 2 — Products Page (Full E-Commerce Grid)

**File:** `app/products/page.tsx`
**Goal:** Below the existing `ProductHero3DSection`, add a proper filterable product grid.

### 2.1 Layout

```
[ ProductHero3DSection ]         ← keep as-is
──────────────────────────────────
FILTERS  (left sidebar on lg, top drawer on mobile)
  • Category chips
  • Price range slider
  • Sort: Newest / Price ↑ / Price ↓ / Rating
  • Fabric filter (Silk / Chiffon / Organza / Khaddi)
  • In-stock toggle

PRODUCT GRID  (right, 2-col mobile / 3-col lg / 4-col xl)
  [ ProductCard ] × N
  Pagination / Load More
```

### 2.2 Components to create

| Component | Path | Notes |
|---|---|---|
| `ProductFilters` | `src/components/product/ProductFilters.tsx` | Sidebar + mobile drawer |
| `ProductGrid` | `src/components/product/ProductGrid.tsx` | Responsive grid, skeleton loading |
| `ProductSortBar` | `src/components/product/ProductSortBar.tsx` | Sort + result count |
| `PriceRangeSlider` | `src/components/ui/price-range-slider.tsx` | Dual-thumb range |
| `FilterChip` | `src/components/ui/filter-chip.tsx` | Toggle chip |

### 2.3 URL-based state

Filters stored in URL search params so sharing/bookmark works:
`/products?category=Sarees&fabric=Silk&minPrice=20000&maxPrice=40000&sort=price_asc`

### 2.4 Server Component approach

`app/products/page.tsx` → Server Component reads `searchParams`, calls `productService` directly (no fetch round-trip).
`ProductFilters` + `ProductGrid` → Client Components (interactivity).

---

## Section 3 — Individual Product Detail Page

**File:** `app/products/[slug]/page.tsx`
**Goal:** Deep-linkable page for each saree.

### 3.1 Layout

```
Breadcrumb: Home > Products > Sarees > [Product Name]

LEFT (60%)                        RIGHT (40%)
  Image gallery                     Product name (Cormorant, xl)
  • Main image (tall)               Subtitle / tagline
  • Thumbnail strip                 ★ Rating  |  Review count
  • On Model / Actual toggle        ──────────────────────
  • Zoom on hover                   Price  ~~Original~~  Badge
                                    ──────────────────────
                                    Colourway selector (look thumbs)
                                    Qty stepper
                                    [Add to Bag]  [Buy Now]
                                    ──────────────────────
                                    Fabric · Motif · Border chips
                                    Description / Story (EB Garamond)
                                    ──────────────────────
                                    Silk Mark Certified  |  Free shipping >₹5000
                                    Share buttons
```

### 3.2 Tabs below fold

| Tab | Content |
|---|---|
| **Details** | Fabric, care instructions, dimensions |
| **Reviews** | Star breakdown + review cards |
| **Delivery** | Pincode check, estimated delivery |

### 3.3 Related products strip

Horizontal scroll of `ProductCard` from same category.

### 3.4 Components

| Component | Path |
|---|---|
| `ProductImageGallery` | `src/components/product/ProductImageGallery.tsx` |
| `ColourwaySelector` | `src/components/product/ColourwaySelector.tsx` |
| `QuantityStepper` | `src/components/ui/quantity-stepper.tsx` |
| `ProductTabs` | `src/components/product/ProductTabs.tsx` |
| `ReviewCard` | `src/components/product/ReviewCard.tsx` |
| `PincodeChecker` | `src/components/product/PincodeChecker.tsx` |

---

## Section 4 — Checkout Flow

**Files:** `app/checkout/page.tsx`, `app/checkout/success/page.tsx`

### 4.1 Steps

```
Step 1: Cart Review
  Items list, qty edit, remove, coupon code input → [Apply]
  Subtotal / Discount / Shipping / Total

Step 2: Shipping Address
  Form: Name, Phone, Address Line 1, Line 2, City, State, Pincode
  Save address to localStorage for returning customers

Step 3: Payment
  [ Pay with UPI ]  [ Pay on Delivery ]  (Razorpay integration ready slot)
  Order summary sidebar (sticky)

Step 4: Confirmation
  Order number, summary, "Continue Shopping"
  Confetti animation (canvas-confetti or CSS)
```

### 4.2 Coupon validation

`POST /api/coupons/validate` → returns discount amount or error message.

### 4.3 Order creation

`POST /api/orders` → writes to `orders.data.ts` (JSON file) → returns order ID.

### 4.4 Components

| Component | Path |
|---|---|
| `CheckoutStepper` | `src/components/checkout/CheckoutStepper.tsx` |
| `CartReview` | `src/components/checkout/CartReview.tsx` |
| `AddressForm` | `src/components/checkout/AddressForm.tsx` |
| `PaymentStep` | `src/components/checkout/PaymentStep.tsx` |
| `OrderConfirmation` | `src/components/checkout/OrderConfirmation.tsx` |
| `CouponInput` | `src/components/checkout/CouponInput.tsx` |
| `OrderSummaryCard` | `src/components/checkout/OrderSummaryCard.tsx` |

---

## Section 5 — Admin Panel

> All routes under `/admin` are protected by a middleware JWT cookie check.

### 5.1 Admin Authentication

**Files:**
- `app/admin/login/page.tsx` — Login page
- `src/middleware.ts` — Route protection
- `app/api/admin/auth/route.ts` — POST login, POST logout
- `src/lib/admin-auth.ts` — JWT sign/verify helpers

**Login page design:**
```
Centered card on dark silk-texture background
  Silk Karagiri crest logo (large)
  "Admin Panel" in Cormorant Garamond
  Email input
  Password input (show/hide toggle)
  [Sign In] → crimson gradient button
```

On successful login → set `silk_admin_token` cookie (HTTP-only, 24h) → redirect to `/admin/dashboard`.

### 5.2 Admin Layout

**File:** `app/admin/layout.tsx`

```
┌─────────┬──────────────────────────────────────┐
│ SIDEBAR │  TOPBAR                              │
│         ├──────────────────────────────────────│
│ • Dashboard      PAGE CONTENT                 │
│ • Products                                    │
│ • Orders                                      │
│ • Coupons                                     │
│ • Settings                                    │
│                                               │
│ [Logout]                                      │
└─────────┴──────────────────────────────────────┘
```

**Components:**
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminTopbar.tsx`
- `src/components/admin/AdminLayout.tsx`

---

### 5.3 Dashboard (`/admin/dashboard`)

**File:** `app/admin/dashboard/page.tsx`

#### Stat cards row

| Card | Metric | Sub-info |
|---|---|---|
| Total Revenue | Rs X,XX,XXX | +12% vs last 30d |
| Total Orders | 248 | +8 this week |
| Products | 12 collections | 2 low stock |
| Customers | 186 | +5 new today |

#### Charts

1. **Revenue chart** — Line chart, last 30 days
2. **Orders by status** — Donut chart (pending / confirmed / shipped / delivered)
3. **Top selling collections** — Horizontal bar chart by units sold

#### Recent orders table (last 10)

| Order # | Customer | Total | Status | Date | Actions |
|---|---|---|---|---|---|
| SK-2026-0248 | Priya M. | Rs 28,500 | Shipped | 16 Oct | View |

#### Components

- `src/components/admin/StatCard.tsx`
- `src/components/admin/RevenueChart.tsx`
- `src/components/admin/OrdersDonut.tsx`
- `src/components/admin/RecentOrdersTable.tsx`
- `src/components/admin/ActivityFeed.tsx`

---

### 5.4 Products Section (`/admin/products`)

**File:** `app/admin/products/page.tsx`

#### Products Table columns

| Col | Notes |
|---|---|
| Image | 48×48 thumbnail |
| Name | Sortable, searchable |
| SKU | |
| Category | |
| Price | |
| Stock | Toggle in-stock / out-of-stock |
| Actions | Edit · Delete |

#### Add / Edit Product form sections

```
SECTION 1 — PRODUCT IMAGES
  Upload grid (drag-drop, reorder, remove)
  Supports multiple images per product

SECTION 2 — PRODUCT INFO
  Name, Slug (auto), Category, Fabric, Motif, Border,
  Description, Story

SECTION 3 — PRICING & INVENTORY
  Price, Original Price, In Stock toggle, SKU

SECTION 4 — METADATA
  Badge, Collection link, Rating

  [Cancel]  [Save Product]
```

**Image upload:** Client FileReader → base64 preview → `POST /api/admin/upload` → saves to `public/images/products/[slug]/`

#### Components

- `src/components/admin/ProductTable.tsx`
- `src/components/admin/ProductForm.tsx`
- `src/components/admin/ImageUploadGrid.tsx`
- `src/components/admin/ProductFilterBar.tsx`

#### API routes

- `GET /api/admin/products` — paginated list
- `POST /api/admin/products` — create
- `PUT /api/admin/products/[id]` — update
- `DELETE /api/admin/products/[id]` — soft-delete
- `POST /api/admin/upload` — image upload

---

### 5.5 Orders Section (`/admin/orders`)

**File:** `app/admin/orders/page.tsx`

#### Orders Table

| Col | Notes |
|---|---|
| Order # | Clickable → detail drawer |
| Customer | Name + phone |
| Items | Count + first product |
| Total | Rs formatted |
| Payment | Paid / Pending badge |
| Status | Dropdown (change inline) |
| Date | dd MMM yyyy |
| Actions | View · Invoice |

#### Filters

Date range picker · Status filter · Payment filter · Search by order # or name

#### Filter combinations

| Filter | Behaviour |
|---|---|
| Status = "pending" | Unconfirmed orders |
| Date = "this week" | 7-day rolling window |
| Payment = "COD" | Pay-on-delivery orders |
| Search = "SK-0248" | Exact order match |

#### Order Detail Drawer

Customer info, items with images, pricing breakdown, shipping address, status timeline, action buttons.

#### Components

- `src/components/admin/OrdersTable.tsx`
- `src/components/admin/OrderFilters.tsx`
- `src/components/admin/OrderDetailDrawer.tsx`
- `src/components/admin/OrderStatusBadge.tsx`
- `src/components/admin/OrderTimeline.tsx`

#### API routes

- `GET /api/admin/orders` — paginated + filtered
- `GET /api/admin/orders/[id]`
- `PATCH /api/admin/orders/[id]` — update status

---

### 5.6 Coupons Section (`/admin/coupons`)

**File:** `app/admin/coupons/page.tsx`

#### Coupons Table

| Col | Notes |
|---|---|
| Code | Bold, copyable |
| Type | Percentage / Fixed / Free Shipping badge |
| Value | "20%" or "Rs 500 off" |
| Usage | "48 / 100 uses" progress bar |
| Min Order | Rs |
| Expires | Date or "No expiry" |
| Active | Toggle switch |
| Actions | Edit · Delete |

#### Add / Edit Coupon Modal fields

- Code (with "Generate Random" button)
- Type (Percentage / Fixed / Free Shipping)
- Value
- Min Order Value
- Max Discount Cap
- Usage Limit (blank = unlimited)
- Expiry Date
- Active toggle

#### Public API

- `POST /api/coupons/validate` — validates code, returns discount

#### Admin API

- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/[id]`
- `DELETE /api/admin/coupons/[id]`

#### Components

- `src/components/admin/CouponsTable.tsx`
- `src/components/admin/CouponModal.tsx`
- `src/components/admin/UsageBar.tsx`

---

## Section 6 — Middleware & Auth Protection

**File:** `src/middleware.ts`

Protects all `/admin` routes except `/admin/login`.
No valid `silk_admin_token` cookie → redirect to `/admin/login`.

JWT helpers in `src/lib/admin-auth.ts` using `jose` (edge-compatible, no extra package beyond what Next.js recommends).

---

## Section 7 — API Routes Summary

```
app/api/
  products/route.ts                 ← existing GET (category, search)
  orders/route.ts                   ← POST create order
  coupons/validate/route.ts         ← POST validate coupon
  admin/
    auth/route.ts                   ← POST login, DELETE logout
    products/route.ts               ← GET list, POST create
    products/[id]/route.ts          ← GET, PUT, DELETE
    orders/route.ts                 ← GET list (paginated + filtered)
    orders/[id]/route.ts            ← GET detail, PATCH status
    coupons/route.ts                ← GET, POST
    coupons/[id]/route.ts           ← PUT, DELETE
    upload/route.ts                 ← POST image upload
    stats/route.ts                  ← GET dashboard stats
```

---

## Section 8 — Admin Design Tokens

The admin panel uses a separate colour set from the storefront — dark sidebar on a warm content area.

```css
--admin-sidebar-bg:   #1a0a0e;    /* deep crimson-black */
--admin-sidebar-text: #e8d5b5;    /* warm ivory */
--admin-sidebar-active: #6b1426;  /* crimson */
--admin-content-bg:   #fdf7ec;    /* vanilla custard */
--admin-card-bg:      #fff9f0;
--admin-border:       #e8d5b5;
```

Typography reuses existing font variables: `font-heading-main` (Cormorant) for page titles, `font-ui` (Montserrat) for table data and buttons.

---

## Section 9 — Sprint Plan

| Sprint | Tasks | Files |
|---|---|---|
| S1 | Types, data seeds, services | `src/types/`, `src/data/`, `src/services/` |
| S2 | Products page grid + filters | `app/products/page.tsx`, ProductFilters, ProductGrid |
| S3 | Product detail [slug] page | `app/products/[slug]/page.tsx`, gallery, tabs |
| S4 | Checkout + coupon + order API | `app/checkout/`, order/coupon API routes |
| S5 | Admin login + middleware | `app/admin/login/`, `src/middleware.ts` |
| S6 | Admin dashboard | `app/admin/dashboard/`, stat cards, charts |
| S7 | Admin products CRUD + image upload | `app/admin/products/`, ImageUploadGrid |
| S8 | Admin orders table + filters | `app/admin/orders/`, OrderDetailDrawer |
| S9 | Admin coupons CRUD | `app/admin/coupons/`, CouponModal |
| S10 | Polish: animations, mobile, SEO | All pages |

---

## Section 10 — Full File Map

```
app/
  products/
    page.tsx                        ← extend: add grid below hero
    [slug]/page.tsx                 ← NEW: product detail page
  checkout/
    page.tsx                        ← NEW
    success/page.tsx                ← NEW
  admin/
    layout.tsx                      ← NEW (sidebar + topbar, no storefront nav)
    login/page.tsx                  ← NEW
    dashboard/page.tsx              ← NEW
    products/
      page.tsx                      ← NEW: table
      new/page.tsx                  ← NEW: add form
      [id]/page.tsx                 ← NEW: edit form
    orders/page.tsx                 ← NEW
    coupons/page.tsx                ← NEW
    settings/page.tsx               ← NEW
  api/
    orders/route.ts                 ← NEW
    coupons/validate/route.ts       ← NEW
    admin/
      auth/route.ts                 ← NEW
      products/route.ts             ← NEW
      products/[id]/route.ts        ← NEW
      orders/route.ts               ← NEW
      orders/[id]/route.ts          ← NEW
      coupons/route.ts              ← NEW
      coupons/[id]/route.ts         ← NEW
      upload/route.ts               ← NEW
      stats/route.ts                ← NEW

src/
  middleware.ts                     ← NEW
  types/
    product.types.ts                ← extend
    order.types.ts                  ← NEW
    coupon.types.ts                 ← NEW
    admin.types.ts                  ← NEW
  data/
    products.data.ts                ← NEW (seeded from collections)
    orders.data.ts                  ← NEW
    coupons.data.ts                 ← NEW
  services/
    order.service.ts                ← NEW
    coupon.service.ts               ← NEW
    auth.service.ts                 ← NEW
  lib/
    admin-auth.ts                   ← NEW
  components/
    product/
      ProductFilters.tsx            ← NEW
      ProductGrid.tsx               ← NEW
      ProductSortBar.tsx            ← NEW
      ProductImageGallery.tsx       ← NEW
      ColourwaySelector.tsx         ← NEW
      ProductTabs.tsx               ← NEW
      ReviewCard.tsx                ← NEW
      PincodeChecker.tsx            ← NEW
    checkout/
      CheckoutStepper.tsx           ← NEW
      CartReview.tsx                ← NEW
      AddressForm.tsx               ← NEW
      PaymentStep.tsx               ← NEW
      OrderConfirmation.tsx         ← NEW
      CouponInput.tsx               ← NEW
      OrderSummaryCard.tsx          ← NEW
    admin/
      AdminSidebar.tsx              ← NEW
      AdminTopbar.tsx               ← NEW
      StatCard.tsx                  ← NEW
      RevenueChart.tsx              ← NEW
      OrdersDonut.tsx               ← NEW
      RecentOrdersTable.tsx         ← NEW
      ActivityFeed.tsx              ← NEW
      ProductTable.tsx              ← NEW
      ProductForm.tsx               ← NEW
      ImageUploadGrid.tsx           ← NEW
      ProductFilterBar.tsx          ← NEW
      OrdersTable.tsx               ← NEW
      OrderFilters.tsx              ← NEW
      OrderDetailDrawer.tsx         ← NEW
      OrderStatusBadge.tsx          ← NEW
      OrderTimeline.tsx             ← NEW
      CouponsTable.tsx              ← NEW
      CouponModal.tsx               ← NEW
      UsageBar.tsx                  ← NEW
    ui/
      price-range-slider.tsx        ← NEW
      filter-chip.tsx               ← NEW
      quantity-stepper.tsx          ← NEW
```

---

## Section 11 — Key Architectural Decisions

1. **No external auth library** — `jose`-based JWT in HTTP-only cookie. Small bundle, readable code.
2. **JSON file store first** — service layer has a clean interface; swapping to Supabase/Prisma later only changes the service internals, not routes or UI.
3. **Admin route separation** — `/admin/*` has its own `layout.tsx` (no storefront Navbar/Footer). Middleware bails to `/admin/login` before the layout renders — no flash.
4. **Image upload** — Files saved to `public/images/products/[slug]/`. No S3/Cloudinary dependency in first version.
5. **Coupon validation is server-only** — `POST /api/coupons/validate` rate-limited by IP (in-memory Map) to prevent brute-force.
6. **Cart stays client-side** — existing `CartContext` + localStorage kept. Orders only persisted on server at checkout submission.

---

*Last updated: 2026-10-17 · Silk Karagiri E-Commerce Plan*
