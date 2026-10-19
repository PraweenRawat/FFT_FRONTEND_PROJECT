import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import SplitCartDrawer from './components/cart/SplitCartDrawer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import ExploreSuppliers from './pages/public/ExploreSuppliers';
import PublicPriceDiscovery from './pages/public/PublicPriceDiscovery';
import ProductCatalog from './pages/public/ProductCatalog';
import ProductDetails from './pages/public/ProductDetails';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Retailer Pages
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import RetailerComparePrices from './pages/retailer/RetailerComparePrices';
import RetailerCartPage from './pages/retailer/RetailerCartPage';
import RetailerOrders from './pages/retailer/RetailerOrders';
import RetailerProfile from './pages/retailer/RetailerProfile';

// Wholesaler Pages
import WholesalerDashboard from './pages/wholesaler/WholesalerDashboard';
import WholesalerInventory from './pages/wholesaler/WholesalerInventory';
import WholesalerAddProduct from './pages/wholesaler/WholesalerAddProduct';
import WholesalerEditProduct from './pages/wholesaler/WholesalerEditProduct';
import WholesalerOrders from './pages/wholesaler/WholesalerOrders';
import WholesalerProfile from './pages/wholesaler/WholesalerProfile';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Persistent Multi-Supplier Split Cart Drawer */}
        <SplitCartDrawer />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore-suppliers" element={<ExploreSuppliers />} />
          <Route path="/price-discovery" element={<PublicPriceDiscovery />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Retailer Routes */}
          <Route
            path="/retailer/dashboard"
            element={
              <ProtectedRoute roleRequired="retailer">
                <RetailerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/compare-prices"
            element={
              <ProtectedRoute roleRequired="retailer">
                <RetailerComparePrices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/products"
            element={
              <ProtectedRoute roleRequired="retailer">
                <ProductCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/suppliers"
            element={
              <ProtectedRoute roleRequired="retailer">
                <ExploreSuppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/cart"
            element={
              <ProtectedRoute roleRequired="retailer">
                <RetailerCartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/orders"
            element={
              <ProtectedRoute roleRequired="retailer">
                <RetailerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/profile"
            element={
              <ProtectedRoute roleRequired="retailer">
                <RetailerProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Wholesaler Routes */}
          <Route
            path="/wholesaler/dashboard"
            element={
              <ProtectedRoute roleRequired="wholesaler">
                <WholesalerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesaler/inventory"
            element={
              <ProtectedRoute roleRequired="wholesaler">
                <WholesalerInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesaler/products/new"
            element={
              <ProtectedRoute roleRequired="wholesaler">
                <WholesalerAddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesaler/products/:id/edit"
            element={
              <ProtectedRoute roleRequired="wholesaler">
                <WholesalerEditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesaler/orders"
            element={
              <ProtectedRoute roleRequired="wholesaler">
                <WholesalerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesaler/profile"
            element={
              <ProtectedRoute roleRequired="wholesaler">
                <WholesalerProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
