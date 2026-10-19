# StockLink - B2B Wholesale Marketplace & Price Discovery Platform

StockLink connects retail stores directly with certified mill manufacturers and primary distributors. It eliminates intermediaries, provides real-time warehouse inventory visibility, and features an interactive Price Discovery engine that normalizes bulk commodity rates with automated MOQ enforcement.

---

## 🎨 Official Brand Identity & Design System

### 1. Logo Asset
- **Asset Location**: `src/assets/stocklink-logo.png`
- **Original Asset**: `logo .png` in root folder
- **Usage**: Displayed across public navigation, footer, login/register portals, and role dashboards.

### 2. Official Brand Color Palette
- **Slate (`#344453`)**: Structural elements, primary headings, navigation, core dark buttons, and brand badges.
- **Golden Ochre (`#DA9A2F`)**: Primary interactive buttons, highlights, active navigation indicators, and call-to-action cards.
- **Cool Gray (`#A3B2B1`)**: Secondary surfaces, subtle borders, background fills, and badge borders.
- **Supporting Accents**: Emerald (`#10B981`) for lowest benchmark pricing; Crimson (`#EF4444`) for critical low-stock and MOQ alerts; Off-White/Charcoal (`#F9F9FB` / `#12181E`) for crisp typography.

---

## 🚀 Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom brand theme tokens & CSS variables
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State Management**:
  - `AuthContext`: Multi-role state (`retailer` / `wholesaler`) with local storage persistence and 1-click preview switchers.
  - `CartContext`: Split multi-supplier cart with live tiered pricing calculation and per-wholesaler MOQ validation.
- **API Architecture**: Centralized HTTP client (`src/services/api.js`) targeting `VITE_API_BASE_URL` with automatic fallback to persistent demonstration data.

---

## 🗺️ Complete Routing Structure

### Public Pages
| Route | Description |
|---|---|
| `/` | Landing page with Hero, Value Cards, 6 Core Features, How It Works, Benefits, and Price Discovery Preview |
| `/explore-suppliers` | Public directory of GSTIN-verified manufacturers with search and category filters |
| `/price-discovery` | Dedicated market benchmark matrix with quantity simulation, spreads, and percent calculations |
| `/products` | Searchable product catalog with tiered rates and live stock filters |
| `/products/:id` | Product detail view with specifications, tiered schedule, and comparable listings |
| `/login` | Dual-role authentication with password visibility toggle and 1-click demo pre-fill |
| `/register` | Business registration with role toggle, tax registration, and warehouse address |

### Retailer Portal
| Route | Description |
|---|---|
| `/retailer/dashboard` | Procurement overview with spend metrics, active orders, and live price spread highlights |
| `/retailer/compare-prices`| Full interactive price comparison tool with simulated bulk volume pricing |
| `/retailer/products` | Retailer product catalog with direct "Add to Cart" and MOQ validation |
| `/retailer/suppliers` | Verified mill suppliers directory |
| `/retailer/cart` | Split Cart grouping items by wholesaler, checking MOQs, and generating separate POs |
| `/retailer/orders` | Purchase order ledger with status filters and itemized invoice details modal |
| `/retailer/profile` | Retailer business details and receiving warehouse delivery address |

### Wholesaler Portal
| Route | Description |
|---|---|
| `/wholesaler/dashboard` | Wholesaler dashboard with Total Revenue (**₹12.4L**), Low Stock Alerts (**4**), and inventory preview |
| `/wholesaler/inventory` | Inventory Control Panel matching reference design with search, low-stock filter, and delete modal |
| `/wholesaler/products/new` | Add product listing with input validation against negative numbers and volume tier builder |
| `/wholesaler/products/:id/edit` | Modify product pricing, live warehouse stock counts, and tiered pricing |
| `/wholesaler/orders` | Incoming retailer purchase orders with real-time status updates (Pending -> Delivered) |
| `/wholesaler/profile` | Wholesaler warehouse depot details, GSTIN, and minimum order rules |

---

## ⚡ How to Run the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Navigate to the project directory
cd D:\FFT_CAPSTONE_FRONTEND

# Install dependencies (already executed)
npm install
```

### Running Development Server
```bash
npm run dev
```
The application will launch at: `http://localhost:5173/`

### Building for Production
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### Environment Configuration
Configure your backend endpoint inside `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
If the backend is not yet running, StockLink automatically operates in **Transparent Demo Mode** with complete offline reactivity and localStorage persistence.
