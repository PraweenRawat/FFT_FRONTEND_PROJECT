import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Store, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  Layers, 
  Zap, 
  Package, 
  Clock, 
  Users, 
  FileCheck,
  Search,
  Sparkles
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import PriceComparisonMatrix from '../../components/price/PriceComparisonMatrix';
import { api } from '../../services/api';
import logoImg from '../../assets/stocklink-logo.png';

export default function LandingPage() {
  const [comparisonGroups, setComparisonGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getPriceComparisonGroups();
        if (res.success) {
          setComparisonGroups(res.data);
        }
      } catch (err) {
        console.error('Failed to load comparison groups:', err);
      } finally {
        setLoadingGroups(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-[#F2F5F8] to-white border-b border-[#DDE4E4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#344453]/10 border border-[#344453]/20 text-xs font-bold text-[#344453]">
                <Sparkles className="w-3.5 h-3.5 text-[#DA9A2F]" />
                <span>Next-Generation B2B Wholesale Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Wholesale Smarter. <br className="hidden sm:inline" />
                <span className="text-[#344453]">Compare Prices.</span> <br className="hidden sm:inline" />
                <span className="text-[#DA9A2F] underline decoration-[#344453] decoration-wavy decoration-2">
                  Grow Your Business.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover trusted suppliers, compare wholesale prices, check stock availability, and make smarter purchasing decisions with StockLink.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/explore-suppliers"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#DA9A2F]" />
                  <span>Explore Suppliers</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Register Your Business</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#DDE4E4] max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#344453]">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Mill Wholesalers</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#DA9A2F]">Zero</p>
                  <p className="text-xs text-slate-500 font-medium">Ghosting on Stock</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#344453]">₹12.4L+</p>
                  <p className="text-xs text-slate-500 font-medium">Trade Volumes Daily</p>
                </div>
              </div>
            </div>

            {/* Right Graphic / Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#344453] to-[#DA9A2F] opacity-30 blur-xl"></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl border border-[#CBD3DC] p-6 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#344453] text-white flex items-center justify-center font-bold text-xs">
                        SL
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Live Price Spread Sample</h4>
                        <p className="text-[11px] text-gray-500">A4 Copy Paper (75 GSM)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Live Spread
                    </span>
                  </div>

                  {/* 3 Supplier Snapshot comparison cards */}
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-slate-800">Zenith Stationery Hub</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">Lowest Unit Base Price</p>
                        <span className="text-[10px] text-gray-500">MOQ: 10 units • Stock: 80</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-emerald-800">₹210</span>
                        <span className="text-[10px] text-gray-400 block">/ ream</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-slate-800">Apex Paper & Mill Works</p>
                        <p className="text-[11px] text-gray-500">Balance of MOQ & Stock</p>
                        <span className="text-[10px] text-gray-500">MOQ: 5 units • Stock: 120</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#344453]">₹220</span>
                        <span className="text-[10px] text-gray-400 block">/ ream</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-slate-800">Bharat Distributors</p>
                        <p className="text-[11px] text-gray-500">Highest Live Stock</p>
                        <span className="text-[10px] text-gray-500">MOQ: 3 units • Stock: 200</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-700">₹235</span>
                        <span className="text-[10px] text-gray-400 block">/ ream</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/price-discovery"
                    className="w-full py-2.5 bg-[#EDF2F2] hover:bg-[#E9E6D8] text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-[#A3B2B1]"
                  >
                    <span>Inspect Full Interactive Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#344453]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE HIGHLIGHT CARDS (as featured in our pages .jpeg) */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">ZERO GHOSTING</h3>
              <p className="text-sm text-gray-600">
                Direct wholesaler inventory counts verified through automated stock reconciliation. No phantom listings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">LIVE INVENTORY</h3>
              <p className="text-sm text-gray-600">
                Know exact stock quantities before placing orders. Automated MOQ validation safeguards your supply line.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">SMART PRICE COMPARE</h3>
              <p className="text-sm text-gray-600">
                Compare price spreads, bulk discount tiers, and overall order costs across multiple verified suppliers instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE 6 FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#F6F9F9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#344453] bg-[#A3B2B1]/30 px-3 py-1 rounded-full">
              Enterprise B2B Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Built for Modern Wholesale Commerce
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything retailers and distributors need to eliminate intermediaries, identify market-clearing rates, and trade efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Smart Price Discovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Benchmark identical products across competing manufacturers. Automatically calculate absolute price differences and percentage spreads to secure the best bulk rate.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Supplier Discovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Directly discover registered, GSTIN-verified manufacturers and regional master distributors without tedious phone calling or physical market visits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center mb-5">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Inventory Visibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transparent stock counts updated continuously. Avoid fulfillment cancellations with real-time stock reservations and low-stock threshold monitoring.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Bulk Ordering & Split Cart</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add products from multiple suppliers into one unified cart. StockLink automatically segregates and validates MOQ per supplier for frictionless checkout.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center mb-5">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">5. Dedicated Business Dashboards</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Role-tailored interfaces for retailers to monitor purchase orders and spend, and for wholesalers to manage product listings and track revenue metrics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">6. Wholesale Efficiency</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automate volume pricing tiers (1-10 units, 11-50 units, 51+ units). Wholesalers update price lists in seconds without manually re-sending PDF catalogs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#344453] bg-[#A3B2B1]/30 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How StockLink Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Four streamlined steps to connect wholesale supply with retail demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#344453] text-white flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Register Your Business</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign up as either a Retailer looking for inventory, or a Wholesaler managing bulk catalog supply.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#344453] text-white flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Discover Suppliers & Items</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore thousands of verified catalog items across Stationery, Packaging, FMCG, and Hardware.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#344453] text-white flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Compare Prices & Stock</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use our Price Discovery Engine to compare equivalent products, check MOQ, and view tier pricing.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-[#F2F5F8] border border-[#CBD3DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-black text-sm">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">Place Wholesale Orders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidate requirements into a Split Cart with automated supplier routing and order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED PRICE DISCOVERY PREVIEW SECTION */}
      <section className="py-20 bg-[#F2F5F8] border-b border-[#DDE4E4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#344453] bg-[#DA9A2F]/30 px-3 py-1 rounded-full">
              Core Platform Feature
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive Price Discovery Preview
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Test drive the live price spread engine below. Adjust the purchase quantity slider to see tiered discounts update in real-time.
            </p>
          </div>

          {loadingGroups ? (
            <div className="p-12 text-center text-gray-500">Loading comparison matrix...</div>
          ) : (
            <PriceComparisonMatrix groups={comparisonGroups} />
          )}
        </div>
      </section>

      {/* RETAILER & WHOLESALER BENEFITS DUAL COLUMNS */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Retailer Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#F2F5F8] to-[#F6F9F9] border border-[#CBD3DC] space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                The Hyperlocal Revolution for Retailers
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Stop spending hours calling multiple wholesale traders. StockLink gives you single-screen market transparency.
              </p>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Guaranteed transparent prices:</strong> Never overpay compared to local competitors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Minimum Order Quantity clarity:</strong> Know exact batch requirements upfront.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Multi-supplier split cart:</strong> Order from 5 suppliers simultaneously in one checkout.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/register?role=retailer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white font-bold text-sm transition"
                >
                  <span>Start as a Retailer</span>
                  <ArrowRight className="w-4 h-4 text-[#DA9A2F]" />
                </Link>
              </div>
            </div>

            {/* Wholesaler Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#F6F9F9] to-[#F2F5F8] border border-[#A3B2B1] space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Streamlined Efficiency for Wholesalers
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Expand your reach to thousands of verified retailers while automating inventory control and tiered pricing policies.
              </p>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dynamic Tier Pricing:</strong> Set auto-discounts for 10+, 50+, or 100+ unit orders.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Low-Stock Automation:</strong> Real-time threshold alerts prevent stockouts and backorders.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Direct Orders:</strong> Clean incoming order queues with pre-validated MOQ rules.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/register?role=wholesaler"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-sm transition"
                >
                  <span>Join as Wholesaler</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-[#344453] text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-3xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DA9A2F] bg-white/10 px-3 py-1 rounded-full">
            Ready to Fix Your B2B Wholesale Headaches?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Connect. Compare. Scale Your Wholesale Operations.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Join hundreds of forward-thinking retailers and mill distributors who rely on StockLink for transparent bulk pricing and stock assurance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/explore-suppliers"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-sm shadow-lg transition"
            >
              Get Wholesale Access
            </Link>
            <Link
              to="/register?role=wholesaler"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              Register Your Inventory
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
