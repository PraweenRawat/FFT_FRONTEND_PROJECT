import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  ArrowRight, 
  Building2, 
  Store, 
  BarChart3, 
  Search, 
  User, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logoImg from '../../assets/stocklink-logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, role, logout, switchDemoRole } = useAuth();
  const { totalItemCount, setIsDrawerOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDE4E4] shadow-xs">
      {/* Demo Mode Alert Banner */}
      <div className="bg-[#344453] text-white px-4 py-1 text-xs text-center flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#DA9A2F] animate-pulse"></span>
            <span className="font-medium text-[#FCEAC6]">B2B Marketplace & Price Discovery Platform</span>
            <span className="hidden md:inline text-gray-300">| Direct Wholesale & Real-Time Stock Engine</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-gray-300">Quick Preview:</span>
            <button
              onClick={() => { switchDemoRole('retailer'); navigate('/retailer/dashboard'); }}
              className={`text-xs px-2 py-0.5 rounded transition ${role === 'retailer' ? 'bg-[#DA9A2F] text-slate-900 font-bold' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
            >
              Retailer View
            </button>
            <button
              onClick={() => { switchDemoRole('wholesaler'); navigate('/wholesaler/dashboard'); }}
              className={`text-xs px-2 py-0.5 rounded transition ${role === 'wholesaler' ? 'bg-[#DA9A2F] text-slate-900 font-bold' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
            >
              Wholesaler View
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logoImg} 
              alt="StockLink Logo" 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation Links (inspired by navbar.png reference) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/explore-suppliers"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/explore-suppliers')
                  ? 'text-[#344453] bg-[#EDF2F2] font-semibold'
                  : 'text-slate-700 hover:text-[#344453] hover:bg-gray-100'
              }`}
            >
              Explore Suppliers
            </Link>

            <Link
              to="/price-discovery"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                isCurrent('/price-discovery')
                  ? 'text-[#344453] bg-[#EDF2F2] font-semibold'
                  : 'text-slate-700 hover:text-[#344453] hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#DA9A2F]" />
              Price Discovery
            </Link>

            <Link
              to="/products"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/products')
                  ? 'text-[#344453] bg-[#EDF2F2] font-semibold'
                  : 'text-slate-700 hover:text-[#344453] hover:bg-gray-100'
              }`}
            >
              Product Catalog
            </Link>

            <a
              href="/#how-it-works"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#344453] hover:bg-gray-100 rounded-md transition-colors"
            >
              How It Works
            </a>

            {isAuthenticated && (
              <Link
                to={role === 'wholesaler' ? '/wholesaler/dashboard' : '/retailer/dashboard'}
                className="px-3 py-2 text-sm font-semibold text-[#344453] hover:bg-[#EDF2F2] rounded-md transition-colors flex items-center gap-1.5"
              >
                {role === 'wholesaler' ? (
                  <>
                    <Building2 className="w-4 h-4 text-[#344453]" />
                    Wholesaler Portal
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-[#344453]" />
                    My Retailer Hub
                  </>
                )}
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Split Cart Drawer Trigger (for retailers) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-[#344453] hover:bg-[#EDF2F2] rounded-full transition-colors flex items-center justify-center"
              title="Open Split Cart Drawer"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DA9A2F] text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 hover:border-[#A3B2B1] bg-white transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs pr-1">
                    <p className="font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user?.businessName || user?.name}
                    </p>
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EDF2F2] text-[#344453] uppercase tracking-wider">
                        {user?.role} Account
                      </span>
                    </div>

                    <Link
                      to={user?.role === 'wholesaler' ? '/wholesaler/dashboard' : '/retailer/dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                    >
                      Dashboard Overview
                    </Link>

                    <Link
                      to={user?.role === 'wholesaler' ? '/wholesaler/profile' : '/retailer/profile'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                    >
                      Business Profile
                    </Link>

                    {user?.role === 'retailer' && (
                      <Link
                        to="/retailer/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                      >
                        Order History
                      </Link>
                    )}

                    {user?.role === 'wholesaler' && (
                      <Link
                        to="/wholesaler/inventory"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                      >
                        Inventory Control
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#344453] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#344453] hover:bg-[#24303C] rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 text-[#DA9A2F]" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-slate-700 hover:bg-gray-100 rounded-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DA9A2F] text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/explore-suppliers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-gray-50 rounded-md"
          >
            Explore Suppliers
          </Link>
          <Link
            to="/price-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-gray-50 rounded-md"
          >
            Price Discovery Tool
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-gray-50 rounded-md"
          >
            Product Catalog
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-gray-50 rounded-md"
          >
            How It Works
          </a>

          {isAuthenticated ? (
            <div className="border-t border-gray-100 pt-3">
              <div className="px-3 py-2 bg-gray-50 rounded-lg mb-2">
                <p className="font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.businessName} ({user?.role})</p>
              </div>
              <Link
                to={user?.role === 'wholesaler' ? '/wholesaler/dashboard' : '/retailer/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-[#344453]"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-slate-700 border border-gray-300 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#344453] rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
