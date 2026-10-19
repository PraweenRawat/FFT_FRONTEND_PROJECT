// Mock Data Store for StockLink B2B Wholesale Marketplace & Price Discovery Platform
// All data clearly identified as demonstration data for offline and local testing

export const INITIAL_SUPPLIERS = [
  {
    id: "sup-001",
    name: "Apex Paper & Mill Works",
    owner: "Rajesh Sharma",
    email: "sales@apexpaper.in",
    phone: "+91 98201 44521",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093",
    gstin: "27AAACA1234A1Z5",
    rating: 4.8,
    reviewCount: 142,
    categories: ["Office Supplies & Stationery", "Packaging & Shipping"],
    verified: true,
    minOrderValue: 2000,
    about: "Apex Paper has been a premier wholesale distributor of high-yield paper goods, printing substrates, and bulk office stationery for over 18 years."
  },
  {
    id: "sup-002",
    name: "Zenith Stationery Hub",
    owner: "Vikram Singhania",
    email: "contact@zenithhub.com",
    phone: "+91 94150 88219",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Block B, GIDC Commercial Zone, Naroda, Ahmedabad 382330",
    gstin: "24AABCS9876K1Z2",
    rating: 4.6,
    reviewCount: 98,
    categories: ["Office Supplies & Stationery", "Packaging & Shipping"],
    verified: true,
    minOrderValue: 2500,
    about: "Specialists in direct mill-to-retailer stationary supply with competitive pricing on bulk commercial printing reams and packaging tapes."
  },
  {
    id: "sup-003",
    name: "Bharat Wholesale Distributors",
    owner: "Anil Agarwal",
    email: "orders@bharatwholesale.org",
    phone: "+91 98112 33490",
    city: "Delhi NCR",
    state: "Delhi",
    address: "Khasra 312, Okhla Phase II, New Delhi 110020",
    gstin: "07AAACB5544C1Z9",
    rating: 4.9,
    reviewCount: 310,
    categories: ["Office Supplies & Stationery", "FMCG & Groceries", "Packaging & Shipping"],
    verified: true,
    minOrderValue: 1500,
    about: "North India's trusted fast-moving wholesale logistics network delivering large quantities of commodities, paper goods, and bulk provisions."
  },
  {
    id: "sup-004",
    name: "SwiftPack Solutions",
    owner: "Pooja Hegde",
    email: "b2b@swiftpack.co.in",
    phone: "+91 80221 66782",
    city: "Bengaluru",
    state: "Karnataka",
    address: "7th Main, Peenya Industrial Area Phase 1, Bengaluru 560058",
    gstin: "29AABCS3321D1Z4",
    rating: 4.7,
    reviewCount: 175,
    categories: ["Packaging & Shipping"],
    verified: true,
    minOrderValue: 3000,
    about: "End-to-end industrial packaging distributor specializing in corrugated cartons, protective bubble wraps, and heavy-duty carton sealing adhesives."
  },
  {
    id: "sup-005",
    name: "Kaveri Agro Commodities",
    owner: "S. Swaminathan",
    email: "wholesale@kaveriagro.com",
    phone: "+91 94440 12890",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Wholesale Grain Market Complex, Koyambedu, Chennai 600107",
    gstin: "33AABCK8844E1Z1",
    rating: 4.9,
    reviewCount: 220,
    categories: ["FMCG & Groceries"],
    verified: true,
    minOrderValue: 5000,
    about: "Direct-from-mandis supplier providing certified Grade-A Basmati rice, premium edible oils, and pulses to thousands of retail stores across South India."
  },
  {
    id: "sup-006",
    name: "VoltCore Electrical Supplies",
    owner: "Manish Chawla",
    email: "sales@voltcore.in",
    phone: "+91 98300 44912",
    city: "Kolkata",
    state: "West Bengal",
    address: "Ezra Street, Commercial Hub, Kolkata 700001",
    gstin: "19AABCV7711F1Z8",
    rating: 4.5,
    reviewCount: 84,
    categories: ["Electronics & Hardware"],
    verified: true,
    minOrderValue: 3500,
    about: "Authorized B2B distributor of commercial electrical components, industrial CAT6 network cables, and heavy-duty surge protected power distribution boards."
  }
];

export const INITIAL_PRODUCTS = [
  // Equivalent Products for Price Discovery: A4 Paper Ream (75 GSM, 500 Sheets)
  {
    id: "prod-101",
    name: "A4 Paper Ream (75 GSM - 500 Sheets)",
    canonicalName: "A4 Paper Ream (75 GSM)",
    category: "Office Supplies & Stationery",
    sku: "PAP-A4-75-APX",
    description: "Premium high-opacity bright white multipurpose copy paper. Jam-free performance for laser printers, inkjet, and high-speed digital copiers.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    unit: "Ream",
    basePrice: 220,
    stock: 120,
    moq: 5,
    supplierId: "sup-001",
    supplierName: "Apex Paper & Mill Works",
    supplierLocation: "Mumbai, MH",
    tiers: [
      { minQty: 5, maxQty: 25, price: 220 },
      { minQty: 26, maxQty: 75, price: 208 },
      { minQty: 76, maxQty: null, price: 196 }
    ],
    specifications: {
      "GSM": "75 GSM",
      "Sheets per Ream": "500",
      "Brightness": "98% ISO",
      "Compatible With": "Laser, Copier, Inkjet"
    }
  },
  {
    id: "prod-102",
    name: "A4 Copier Paper Ream (75 GSM Eco White)",
    canonicalName: "A4 Paper Ream (75 GSM)",
    category: "Office Supplies & Stationery",
    sku: "PAP-A4-75-ZNT",
    description: "Eco-conscious elemental chlorine-free (ECF) A4 copier paper. Consistent surface smoothness engineered for low toner consumption.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    unit: "Ream",
    basePrice: 210,
    stock: 80,
    moq: 10,
    supplierId: "sup-002",
    supplierName: "Zenith Stationery Hub",
    supplierLocation: "Ahmedabad, GJ",
    tiers: [
      { minQty: 10, maxQty: 30, price: 210 },
      { minQty: 31, maxQty: 60, price: 200 },
      { minQty: 61, maxQty: null, price: 188 }
    ],
    specifications: {
      "GSM": "75 GSM",
      "Sheets per Ream": "500",
      "Brightness": "96% ISO",
      "Compatible With": "High-Speed Copiers, Laser"
    }
  },
  {
    id: "prod-103",
    name: "Commercial A4 Paper Ream 75 GSM - Ultra",
    canonicalName: "A4 Paper Ream (75 GSM)",
    category: "Office Supplies & Stationery",
    sku: "PAP-A4-75-BHR",
    description: "Heavy-duty commercial grade A4 sheets for legal, corporate, and billing usage. Moisture-barrier shrink-wrapped to preserve quality.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    unit: "Ream",
    basePrice: 235,
    stock: 200,
    moq: 3,
    supplierId: "sup-003",
    supplierName: "Bharat Wholesale Distributors",
    supplierLocation: "Delhi NCR",
    tiers: [
      { minQty: 3, maxQty: 20, price: 235 },
      { minQty: 21, maxQty: 80, price: 218 },
      { minQty: 81, maxQty: null, price: 205 }
    ],
    specifications: {
      "GSM": "75 GSM",
      "Sheets per Ream": "500",
      "Brightness": "100% ISO",
      "Compatible With": "All Print Equipment"
    }
  },

  // Packaging: Corrugated Shipping Box 12x10x8 inch
  {
    id: "prod-104",
    name: "3-Ply Corrugated Shipping Box (12x10x8\")",
    canonicalName: "Corrugated Box 12x10x8",
    category: "Packaging & Shipping",
    sku: "PKG-BOX-12108-SWF",
    description: "Durable 3-ply brown kraft corrugated boxes. Ideal for retail shipping, e-commerce dispatches, and warehouse stackability.",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    unit: "Bundle (25 pcs)",
    basePrice: 380,
    stock: 140,
    moq: 4,
    supplierId: "sup-004",
    supplierName: "SwiftPack Solutions",
    supplierLocation: "Bengaluru, KA",
    tiers: [
      { minQty: 4, maxQty: 15, price: 380 },
      { minQty: 16, maxQty: 40, price: 350 },
      { minQty: 41, maxQty: null, price: 325 }
    ],
    specifications: {
      "Dimensions": "12 x 10 x 8 Inches",
      "Ply": "3-Ply Fluted",
      "Bursting Strength": "12-14 BF",
      "Pieces Per Bundle": "25"
    }
  },
  {
    id: "prod-105",
    name: "Standard Shipping Master Carton (12x10x8\")",
    canonicalName: "Corrugated Box 12x10x8",
    category: "Packaging & Shipping",
    sku: "PKG-BOX-12108-APX",
    description: "Recyclable heavy kraft shipping container designed for secure B2B product logistics and courier transit.",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    unit: "Bundle (25 pcs)",
    basePrice: 410,
    stock: 95,
    moq: 2,
    supplierId: "sup-001",
    supplierName: "Apex Paper & Mill Works",
    supplierLocation: "Mumbai, MH",
    tiers: [
      { minQty: 2, maxQty: 10, price: 410 },
      { minQty: 11, maxQty: 30, price: 375 },
      { minQty: 31, maxQty: null, price: 340 }
    ],
    specifications: {
      "Dimensions": "12 x 10 x 8 Inches",
      "Ply": "3-Ply Reinforced",
      "Bursting Strength": "16 BF",
      "Pieces Per Bundle": "25"
    }
  },

  // Packaging Tape: Heavy-Duty Brown Packaging Tape 2-inch x 65m
  {
    id: "prod-106",
    name: "BOPP Brown Packaging Tape (2\" x 65m) - Pack of 6",
    canonicalName: "BOPP Packaging Tape 2-Inch",
    category: "Packaging & Shipping",
    sku: "PKG-TPE-B265-SWF",
    description: "High tack pressure-sensitive acrylic adhesive brown sealing tape. Excellent grip on recycled corrugated cartons.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
    unit: "Tube (6 Rolls)",
    basePrice: 240,
    stock: 220,
    moq: 5,
    supplierId: "sup-004",
    supplierName: "SwiftPack Solutions",
    supplierLocation: "Bengaluru, KA",
    tiers: [
      { minQty: 5, maxQty: 20, price: 240 },
      { minQty: 21, maxQty: 50, price: 220 },
      { minQty: 51, maxQty: null, price: 198 }
    ],
    specifications: {
      "Width": "48mm (2 Inches)",
      "Length": "65 Meters",
      "Micron Thickness": "45 Micron",
      "Quantity": "6 Rolls per Pack"
    }
  },
  {
    id: "prod-107",
    name: "Industrial Brown Carton Sealing Tape 48mm x 65m",
    canonicalName: "BOPP Packaging Tape 2-Inch",
    category: "Packaging & Shipping",
    sku: "PKG-TPE-B265-ZNT",
    description: "Tear-resistant BOPP film with solvent-free adhesive. Temperature resistant for cargo and road transport.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
    unit: "Tube (6 Rolls)",
    basePrice: 225,
    stock: 160,
    moq: 8,
    supplierId: "sup-002",
    supplierName: "Zenith Stationery Hub",
    supplierLocation: "Ahmedabad, GJ",
    tiers: [
      { minQty: 8, maxQty: 25, price: 225 },
      { minQty: 26, maxQty: 60, price: 210 },
      { minQty: 61, maxQty: null, price: 190 }
    ],
    specifications: {
      "Width": "48mm",
      "Length": "65 Meters",
      "Micron Thickness": "42 Micron",
      "Quantity": "6 Rolls per Pack"
    }
  },

  // FMCG: Premium Traditional Basmati Rice 25kg
  {
    id: "prod-108",
    name: "Royal Heritage Basmati Rice (25kg Bag)",
    canonicalName: "Basmati Rice 25kg",
    category: "FMCG & Groceries",
    sku: "FMC-RCE-BAS25-KVR",
    description: "Aged 2 years, extra-long slender grains with authentic rich aroma. Fluffy non-sticky elongation post-cooking.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    unit: "25kg Bag",
    basePrice: 2450,
    stock: 75,
    moq: 2,
    supplierId: "sup-005",
    supplierName: "Kaveri Agro Commodities",
    supplierLocation: "Chennai, TN",
    tiers: [
      { minQty: 2, maxQty: 10, price: 2450 },
      { minQty: 11, maxQty: 30, price: 2320 },
      { minQty: 31, maxQty: null, price: 2200 }
    ],
    specifications: {
      "Weight": "25 Kilograms",
      "Aging": "24 Months",
      "Grain Length": "8.3mm Avg",
      "Packaging": "Woven Polypropylene Bag"
    }
  },
  {
    id: "prod-109",
    name: "Classic Select Long Grain Basmati Rice 25kg",
    canonicalName: "Basmati Rice 25kg",
    category: "FMCG & Groceries",
    sku: "FMC-RCE-BAS25-BHR",
    description: "Direct procurement from Punjab plains. Cleaned, sorted, and free from impurities. Highest re-order rate among hotel suppliers.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    unit: "25kg Bag",
    basePrice: 2390,
    stock: 110,
    moq: 5,
    supplierId: "sup-003",
    supplierName: "Bharat Wholesale Distributors",
    supplierLocation: "Delhi NCR",
    tiers: [
      { minQty: 5, maxQty: 15, price: 2390 },
      { minQty: 16, maxQty: 40, price: 2280 },
      { minQty: 41, maxQty: null, price: 2150 }
    ],
    specifications: {
      "Weight": "25 Kilograms",
      "Aging": "18 Months",
      "Grain Length": "8.1mm Avg",
      "Packaging": "Laminated Food-Grade Sack"
    }
  },

  // Electronics: CAT6 UTP Solid Copper Cable Box (305m)
  {
    id: "prod-110",
    name: "CAT6 UTP Solid Bare Copper Cable (305m Roll)",
    canonicalName: "CAT6 Cable 305m Box",
    category: "Electronics & Hardware",
    sku: "ELC-CAB-CAT6-VLT",
    description: "Gigabit Ethernet Cat6 solid copper structured network cabling. Fluke certified with PVC fire-retardant outer jacket.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    unit: "Box (305m)",
    basePrice: 4200,
    stock: 35,
    moq: 2,
    supplierId: "sup-006",
    supplierName: "VoltCore Electrical Supplies",
    supplierLocation: "Kolkata, WB",
    tiers: [
      { minQty: 2, maxQty: 8, price: 4200 },
      { minQty: 9, maxQty: 20, price: 3950 },
      { minQty: 21, maxQty: null, price: 3750 }
    ],
    specifications: {
      "Conductor": "100% Solid Bare Copper (23 AWG)",
      "Bandwidth": "250 MHz",
      "Length": "305 Meters (1000 ft)",
      "Certification": "RoHS, ISO9001, CE"
    }
  },

  // Low stock product for wholesaler inventory demo
  {
    id: "prod-111",
    name: "Thermal POS Billing Paper Rolls 3-Inch (Pack of 50)",
    canonicalName: "Thermal POS Rolls 3-Inch",
    category: "Office Supplies & Stationery",
    sku: "PAP-POS-3IN-APX",
    description: "BPA-free thermal cashier receipt rolls with clear print contrast and end-of-roll warning stripes.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    unit: "Box (50 Rolls)",
    basePrice: 950,
    stock: 4, // LOW STOCK! Threshold is <= 10
    moq: 2,
    supplierId: "sup-001",
    supplierName: "Apex Paper & Mill Works",
    supplierLocation: "Mumbai, MH",
    tiers: [
      { minQty: 2, maxQty: 10, price: 950 },
      { minQty: 11, maxQty: 25, price: 890 },
      { minQty: 26, maxQty: null, price: 820 }
    ],
    specifications: {
      "Width": "79mm (3-1/8\")",
      "Diameter": "50mm",
      "Core Size": "12mm",
      "Thermal Sensitivity": "High"
    }
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-2026-9041",
    date: "2026-10-15",
    retailerId: "ret-001",
    retailerName: "Metro Superstore & Stationery",
    retailerCity: "Pune, MH",
    supplierId: "sup-001",
    supplierName: "Apex Paper & Mill Works",
    items: [
      { productId: "prod-101", productName: "A4 Paper Ream (75 GSM - 500 Sheets)", quantity: 20, unitPrice: 220, total: 4400 },
      { productId: "prod-105", productName: "Standard Shipping Master Carton (12x10x8\")", quantity: 6, unitPrice: 410, total: 2460 }
    ],
    totalAmount: 6860,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingAddress: "Plot 18, Commercial Street, Shivajinagar, Pune 411005"
  },
  {
    id: "ORD-2026-9042",
    date: "2026-10-16",
    retailerId: "ret-001",
    retailerName: "Metro Superstore & Stationery",
    retailerCity: "Pune, MH",
    supplierId: "sup-002",
    supplierName: "Zenith Stationery Hub",
    items: [
      { productId: "prod-102", productName: "A4 Copier Paper Ream (75 GSM Eco White)", quantity: 35, unitPrice: 200, total: 7000 },
      { productId: "prod-107", productName: "Industrial Brown Carton Sealing Tape 48mm x 65m", quantity: 12, unitPrice: 225, total: 2700 }
    ],
    totalAmount: 9700,
    status: "Dispatched",
    paymentStatus: "Net 30 Terms",
    shippingAddress: "Plot 18, Commercial Street, Shivajinagar, Pune 411005"
  },
  {
    id: "ORD-2026-9043",
    date: "2026-10-16",
    retailerId: "ret-001",
    retailerName: "Metro Superstore & Stationery",
    retailerCity: "Pune, MH",
    supplierId: "sup-005",
    supplierName: "Kaveri Agro Commodities",
    items: [
      { productId: "prod-108", productName: "Royal Heritage Basmati Rice (25kg Bag)", quantity: 15, unitPrice: 2320, total: 34800 }
    ],
    totalAmount: 34800,
    status: "Processing",
    paymentStatus: "Paid",
    shippingAddress: "Plot 18, Commercial Street, Shivajinagar, Pune 411005"
  },
  {
    id: "ORD-2026-9044",
    date: "2026-10-17",
    retailerId: "ret-002",
    retailerName: "CityMart Retail Chain",
    retailerCity: "Nashik, MH",
    supplierId: "sup-001",
    supplierName: "Apex Paper & Mill Works",
    items: [
      { productId: "prod-101", productName: "A4 Paper Ream (75 GSM - 500 Sheets)", quantity: 50, unitPrice: 208, total: 10400 }
    ],
    totalAmount: 10400,
    status: "Pending",
    paymentStatus: "Awaiting Bank Transfer",
    shippingAddress: "Shop 4, Market Yard, Nashik 422001"
  }
];

export const WHOLESALER_METRICS = {
  totalRevenueFormatted: "₹12.4L", // Exact reference metric from our pages .jpeg!
  totalRevenueRaw: 1240000,
  totalProductsCount: 48,
  totalInventoryUnits: 14250,
  lowStockAlertsCount: 4,
  pendingOrdersCount: 7,
  activeRetailersCount: 64
};

export const COMPARISON_PRODUCTS = [
  {
    canonicalName: "A4 Paper Ream (75 GSM)",
    category: "Office Supplies & Stationery",
    description: "Compare identical 75 GSM 500-sheet white copier paper reams across registered paper mills & wholesalers.",
    productIds: ["prod-101", "prod-102", "prod-103"]
  },
  {
    canonicalName: "Corrugated Box 12x10x8",
    category: "Packaging & Shipping",
    description: "Compare standardized 3-ply corrugated shipping carton bundles (25 units per bundle).",
    productIds: ["prod-104", "prod-105"]
  },
  {
    canonicalName: "BOPP Packaging Tape 2-Inch",
    category: "Packaging & Shipping",
    description: "Compare commercial 48mm x 65m brown carton sealing adhesive rolls (tube of 6).",
    productIds: ["prod-106", "prod-107"]
  },
  {
    canonicalName: "Basmati Rice 25kg",
    category: "FMCG & Groceries",
    description: "Compare 25kg aged traditional long-grain Basmati rice sacks from primary agricultural mandis.",
    productIds: ["prod-108", "prod-109"]
  }
];
