"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product.types";
import { Order, OrderStatus } from "@/types/order.types";
import { Coupon } from "@/types/coupon.types";
import { initialProducts } from "@/data/products.data";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  subcategories: string[];
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  announcementText: string;
  isAnnouncementActive: boolean;
  silkRatePerDrape: number;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  categories: CategoryItem[];
  settings: StoreSettings;
  // Product actions
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  // Coupon actions
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount" | "createdAt">) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  // Order actions
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  // Category actions
  addCategory: (name: string, subcategories: string[]) => void;
  toggleCategoryStatus: (id: string) => void;
  // Settings actions
  updateSettings: (updates: Partial<StoreSettings>) => void;
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "SILK15",
    type: "percentage",
    value: 15,
    minOrderValue: 5000,
    maxDiscountAmount: 3000,
    usageLimit: 100,
    usedCount: 14,
    expiresAt: "2026-12-31",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "coup-2",
    code: "ROYALZARI",
    type: "fixed",
    value: 2500,
    minOrderValue: 25000,
    usageLimit: 50,
    usedCount: 28,
    expiresAt: "2026-11-30",
    isActive: true,
    createdAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "coup-3",
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    minOrderValue: 2000,
    usedCount: 65,
    isActive: true,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "coup-4",
    code: "BRIDALFEST",
    type: "percentage",
    value: 20,
    minOrderValue: 35000,
    maxDiscountAmount: 8000,
    usageLimit: 30,
    usedCount: 30,
    expiresAt: "2026-08-31",
    isActive: false,
    createdAt: "2026-03-01T00:00:00Z",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "SK-2026-0042",
    isGuest: true,
    customerName: "Radhika Kulkarni",
    customerPhone: "+91 98201 44821",
    customerEmail: "radhika.k@gmail.com",
    items: [
      {
        productId: "silk-01",
        name: "Kanjivaram Pure Gold Zari Saree",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        price: 32000,
        quantity: 1,
        sku: "SK-KANJ-01",
      },
    ],
    subtotal: 32000,
    discount: 2500,
    shipping: 0,
    total: 29500,
    couponCode: "ROYALZARI",
    status: "delivered",
    paymentMethod: "upi",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Radhika Kulkarni",
      phone: "+91 98201 44821",
      line1: "Flat 402, Royal Palms, Prabhat Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
      country: "India",
    },
    createdAt: "2026-10-15T14:22:00Z",
    updatedAt: "2026-10-16T18:00:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "SK-2026-0043",
    isGuest: true,
    customerName: "Meenakshi Sundaram",
    customerPhone: "+91 94441 22904",
    customerEmail: "meena.sundaram@outlook.com",
    items: [
      {
        productId: "silk-02",
        name: "Banarasi Raw Silk Jacquard Saree",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        price: 24500,
        quantity: 1,
        sku: "SK-BANAR-02",
      },
    ],
    subtotal: 24500,
    discount: 0,
    shipping: 0,
    total: 24500,
    status: "shipped",
    paymentMethod: "card",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Meenakshi Sundaram",
      phone: "+91 94441 22904",
      line1: "12, Besant Nagar 4th Avenue",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600090",
      country: "India",
    },
    createdAt: "2026-10-16T10:15:00Z",
    updatedAt: "2026-10-16T16:30:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "SK-2026-0044",
    isGuest: true,
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 98902 33119",
    items: [
      {
        productId: "silk-06",
        name: "Tailored Royal Silk Kurta Set",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        price: 14999,
        quantity: 1,
        sku: "SK-KURTA-06",
      },
    ],
    subtotal: 14999,
    discount: 2250,
    shipping: 0,
    total: 12749,
    couponCode: "SILK15",
    status: "confirmed",
    paymentMethod: "upi",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Ananya Deshmukh",
      phone: "+91 98902 33119",
      line1: "Bungalow 7, Koregaon Park Lane 3",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      country: "India",
    },
    createdAt: "2026-10-17T08:45:00Z",
    updatedAt: "2026-10-17T09:00:00Z",
  },
  {
    id: "ord-4",
    orderNumber: "SK-2026-0045",
    isGuest: true,
    customerName: "Priyanka Sharma",
    customerPhone: "+91 98110 55432",
    items: [
      {
        productId: "silk-01",
        name: "Kanjivaram Pure Gold Zari Saree",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        price: 32000,
        quantity: 1,
        sku: "SK-KANJ-01",
      },
      {
        productId: "silk-04",
        name: "Mulberry Silk Twill Stole",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        price: 5800,
        quantity: 1,
        sku: "SK-MULB-04",
      },
    ],
    subtotal: 37800,
    discount: 0,
    shipping: 0,
    total: 37800,
    status: "pending",
    paymentMethod: "cod",
    paymentStatus: "pending",
    shippingAddress: {
      name: "Priyanka Sharma",
      phone: "+91 98110 55432",
      line1: "A-24, Vasant Vihar",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110057",
      country: "India",
    },
    createdAt: "2026-10-17T10:12:00Z",
    updatedAt: "2026-10-17T10:12:00Z",
  },
];

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Sarees",
    slug: "sarees",
    itemCount: 12,
    subcategories: ["Kanjivaram Silk", "Banarasi Brocade", "Double Warp Soft Silk", "Kora Organza", "Chanderi Katan"],
    isActive: true,
  },
  {
    id: "cat-2",
    name: "Scarves & Stoles",
    slug: "scarves",
    itemCount: 8,
    subcategories: ["Tussar Hand-Painted", "Mulberry Silk Twill", "Matka Stoles"],
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Fabrics & Yardage",
    slug: "fabrics",
    itemCount: 6,
    subcategories: ["Chanderi Brocade", "Raw Silk Plain", "Zari Tissue"],
    isActive: true,
  },
  {
    id: "cat-4",
    name: "Apparel & Kurtas",
    slug: "apparel",
    itemCount: 4,
    subcategories: ["Royal Kurta Sets", "Silk Nehru Jackets", "Heritage Tunics"],
    isActive: true,
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: "Silk Karagiri",
  tagline: "Pure Handloom Heritage Silks",
  contactEmail: "care@silkkaragiri.com",
  contactPhone: "+91 800-SILK-CARE",
  whatsappNumber: "+91 98200 12345",
  freeShippingThreshold: 5000,
  announcementText: "Complimentary Silk Mark Authentication & Insured Express Delivery across India",
  isAnnouncementActive: true,
  silkRatePerDrape: 28500,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") return initialProducts;
    try {
      const saved = localStorage.getItem("silk_admin_products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return INITIAL_ORDERS;
    try {
      const saved = localStorage.getItem("silk_admin_orders");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    if (typeof window === "undefined") return INITIAL_COUPONS;
    try {
      const saved = localStorage.getItem("silk_admin_coupons");
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (typeof window === "undefined") return INITIAL_CATEGORIES;
    try {
      const saved = localStorage.getItem("silk_admin_categories");
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (typeof window === "undefined") return INITIAL_SETTINGS;
    try {
      const saved = localStorage.getItem("silk_admin_settings");
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("silk_admin_products", JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("silk_admin_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("silk_admin_coupons", JSON.stringify(coupons));
    } catch {}
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem("silk_admin_categories", JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem("silk_admin_settings", JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Product Actions
  const addProduct = (prod: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...prod,
      id: `silk-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Coupon Actions
  const addCoupon = (c: Omit<Coupon, "id" | "usedCount" | "createdAt">) => {
    const newCoupon: Coupon = {
      ...c,
      id: `coup-${Date.now().toString(36)}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Order Actions
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
  };

  // Category Actions
  const addCategory = (name: string, subcategories: string[]) => {
    const newCat: CategoryItem = {
      id: `cat-${Date.now().toString(36)}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      itemCount: 0,
      subcategories,
      isActive: true,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Settings Actions
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        coupons,
        categories,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        updateOrderStatus,
        addCategory,
        toggleCategoryStatus,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

const defaultAdminValue: AdminContextType = {
  products: initialProducts,
  orders: INITIAL_ORDERS,
  coupons: INITIAL_COUPONS,
  categories: INITIAL_CATEGORIES,
  settings: INITIAL_SETTINGS,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  toggleProductStock: () => {},
  addCoupon: () => {},
  updateCoupon: () => {},
  deleteCoupon: () => {},
  toggleCouponStatus: () => {},
  updateOrderStatus: () => {},
  addCategory: () => {},
  toggleCategoryStatus: () => {},
  updateSettings: () => {},
};

export function useAdmin() {
  const context = useContext(AdminContext);
  return context || defaultAdminValue;
}
