import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import logoImg from '../../assets/stocklink-logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#12181E] text-gray-300 pt-16 pb-12 border-t border-[#1A232C]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A232C]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block bg-white p-2 rounded-lg">
              <img src={logoImg} alt="StockLink" className="h-9 w-auto" />
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              StockLink is India's premier B2B Wholesale Marketplace & Price Discovery Platform. We connect verified retailers directly to certified manufacturers and primary wholesalers for guaranteed inventory, bulk tiers, and transparent market pricing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-[#DA9A2F] bg-[#1A232C] px-3 py-1.5 rounded-full border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#DA9A2F]" />
                <span>Verified Direct Mills & Wholesalers</span>
              </div>
            </div>
          </div>

          {/* Platform Discovery */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#DA9A2F] pl-2">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/price-discovery" className="hover:text-[#DA9A2F] transition-colors flex items-center gap-1">
                  Price Discovery Matrix
                  <ArrowUpRight className="w-3 h-3 text-[#DA9A2F]" />
                </Link>
              </li>
              <li>
                <Link to="/explore-suppliers" className="hover:text-[#DA9A2F] transition-colors">
                  Explore Suppliers
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#DA9A2F] transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#DA9A2F] transition-colors">
                  How StockLink Works
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-[#DA9A2F] transition-colors">
                  Core Capabilities
                </a>
              </li>
            </ul>
          </div>

          {/* For Retailers */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#DA9A2F] pl-2">
              For Retailers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/retailer/dashboard" className="hover:text-[#DA9A2F] transition-colors">
                  Retailer Overview
                </Link>
              </li>
              <li>
                <Link to="/retailer/compare-prices" className="hover:text-[#DA9A2F] transition-colors">
                  Multi-Supplier Compare
                </Link>
              </li>
              <li>
                <Link to="/retailer/cart" className="hover:text-[#DA9A2F] transition-colors">
                  Split Cart & MOQ Validation
                </Link>
              </li>
              <li>
                <Link to="/retailer/orders" className="hover:text-[#DA9A2F] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/register?role=retailer" className="text-[#DA9A2F] hover:underline transition-colors font-medium">
                  Register as Retailer
                </Link>
              </li>
            </ul>
          </div>

          {/* For Wholesalers */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#DA9A2F] pl-2">
              For Wholesalers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/wholesaler/dashboard" className="hover:text-[#DA9A2F] transition-colors">
                  Wholesaler Dashboard
                </Link>
              </li>
              <li>
                <Link to="/wholesaler/inventory" className="hover:text-[#DA9A2F] transition-colors">
                  Inventory Control Panel
                </Link>
              </li>
              <li>
                <Link to="/wholesaler/products/new" className="hover:text-[#DA9A2F] transition-colors">
                  Add New Product
                </Link>
              </li>
              <li>
                <Link to="/wholesaler/orders" className="hover:text-[#DA9A2F] transition-colors">
                  Incoming Orders
                </Link>
              </li>
              <li>
                <Link to="/register?role=wholesaler" className="text-[#DA9A2F] hover:underline transition-colors font-medium">
                  Join as Wholesaler
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact info and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#DA9A2F]" />
              support@stocklink.in
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#DA9A2F]" />
              +91 (022) 4890-1200
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#DA9A2F]" />
              B2B Commerce Tower, BKC, Mumbai 400051
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 StockLink Technologies. All rights reserved.</span>
            <span className="text-[#A3B2B1]">Brand: Slate #344453 | Golden Ochre #DA9A2F | Cool Gray #A3B2B1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
