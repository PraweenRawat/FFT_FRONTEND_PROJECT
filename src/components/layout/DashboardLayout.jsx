import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
  BarChart3, 
  ShoppingCart, 
  ClipboardList, 
  User, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut, 
  Store, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logoImg from '../../assets/stocklink-logo.png';

export default function DashboardLayout({ children, roleRequired }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role, switchDemoRole, logout } = useAuth();
  const { totalItemCount, setIsDrawerOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrent = (path) => location.pathname === path;

  const retailerNav = [
    { name: 'Dashboard Overview', path: '/retailer/dashboard', icon: LayoutDashboard },
    { name: 'Price Discovery Tool', path: '/retailer/compare-prices', icon: BarChart3, highlight: true },
    { name: 'Product Catalog', path: '/retailer/products', icon: Package },
    { name: 'Suppliers Directory', path: '/retailer/suppliers', icon: Building2 },
    { name: 'Split Cart & Checkout', path: '/retailer/cart', icon: ShoppingCart, badge: totalItemCount > 0 ? totalItemCount : null },
    { name: 'Purchase Orders', path: '/retailer/orders', icon: ClipboardList },
    { name: 'Business Profile', path: '/retailer/profile', icon: User },
  ];

  const wholesalerNav = [
    { name: 'Dashboard Overview', path: '/wholesaler/dashboard', icon: LayoutDashboard },
    { name: 'Inventory Control', path: '/wholesaler/inventory', icon: Package, highlight: true },
    { name: 'Add Product Listing', path: '/wholesaler/products/new', icon: PlusCircle },
    { name: 'Incoming Orders', path: '/wholesaler/orders', icon: ClipboardList, badge: '7' },
    { name: 'Wholesaler Profile', path: '/wholesaler/profile', icon: User },
    { name: 'Public Price Matrix', path: '/price-discovery', icon: BarChart3 },
  ];

  const currentNav = role === 'wholesaler' ? wholesalerNav : retailerNav;

  return (
    <div className="min-h-screen bg-[#F2F5F8] flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-72 bg-[#344453] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#475C6F] bg-[#24303C]">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg">
                <img src={logoImg} alt="StockLink" className="h-8 w-auto" />
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Profile Badge */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-[#24303C] border border-[#475C6F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-[#DA9A2F] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DA9A2F]" />
                {role === 'wholesaler' ? 'Wholesaler Portal' : 'Retailer Portal'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#DA9A2F]/20 text-[#FCEAC6]">
                Active
              </span>
            </div>
            <p className="font-bold text-sm text-white truncate">{user?.businessName || 'My Business'}</p>
            <p className="text-xs text-gray-300 truncate">{user?.name} ({user?.city})</p>
          </div>

          {/* Nav links */}
          <nav className="px-4 space-y-1.5">
            {currentNav.map((item) => {
              const active = isCurrent(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#DA9A2F] text-slate-950 font-bold shadow-sm'
                      : 'text-gray-200 hover:bg-[#475C6F]/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : item.highlight ? 'text-[#DA9A2F]' : 'text-gray-300'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      active ? 'bg-slate-900 text-white' : 'bg-[#DA9A2F] text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher & Sign Out */}
        <div className="p-4 border-t border-[#475C6F] bg-[#24303C]/50 space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block px-1">
              Test Other Role:
            </span>
            {role === 'wholesaler' ? (
              <button
                onClick={() => { switchDemoRole('retailer'); navigate('/retailer/dashboard'); }}
                className="w-full text-xs py-2 px-3 bg-[#475C6F] hover:bg-slate-600 rounded-lg text-white font-medium flex items-center justify-between transition"
              >
                <span>Switch to Retailer View</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#DA9A2F]" />
              </button>
            ) : (
              <button
                onClick={() => { switchDemoRole('wholesaler'); navigate('/wholesaler/dashboard'); }}
                className="w-full text-xs py-2 px-3 bg-[#475C6F] hover:bg-slate-600 rounded-lg text-white font-medium flex items-center justify-between transition"
              >
                <span>Switch to Wholesaler View</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#DA9A2F]" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/"
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Public Store
            </Link>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-xs text-red-300 hover:text-red-100 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {role === 'wholesaler' ? 'Supplier Portal' : 'Retailer Portal'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                {user?.businessName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'retailer' && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#EDF2F2] hover:bg-[#E9E6D8] text-slate-800 rounded-lg text-xs font-semibold border border-[#A3B2B1] transition"
              >
                <ShoppingCart className="w-4 h-4 text-[#344453]" />
                <span className="hidden sm:inline">Split Cart</span>
                <span className="bg-[#344453] text-white px-1.5 py-0.2 rounded-full text-[11px]">
                  {totalItemCount}
                </span>
              </button>
            )}

            {role === 'wholesaler' && (
              <Link
                to="/wholesaler/products/new"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold rounded-lg text-xs transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            )}
          </div>
        </header>

        {/* Demo Mode Notice Banner */}
        <div className="bg-[#F6F9F9] border-b border-[#C3CECE] px-4 sm:px-8 py-2 flex items-center justify-between text-xs text-[#554F37]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#344453] shrink-0" />
            <span>
              <strong>StockLink Development Environment:</strong> All pricing tiers, stock counts, and simulated orders update locally with instantaneous reactivity.
            </span>
          </div>
          <Link to="/price-discovery" className="underline font-semibold hover:text-[#344453] hidden md:inline">
            Open Market Comparison
          </Link>
        </div>

        {/* Child Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
