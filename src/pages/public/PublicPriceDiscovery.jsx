import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  HelpCircle, 
  Sparkles, 
  TrendingDown, 
  Layers, 
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import PriceComparisonMatrix from '../../components/price/PriceComparisonMatrix';
import { api } from '../../services/api';

export default function PublicPriceDiscovery() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await api.getPriceComparisonGroups();
        if (res.success) {
          setGroups(res.data);
        }
      } catch (err) {
        console.error('Failed to load comparison groups:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FA]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#344453]/10 border border-[#344453]/20 text-xs font-bold text-[#344453]">
              <BarChart3 className="w-3.5 h-3.5 text-[#DA9A2F]" />
              <span>Core Platform Differentiator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Wholesale Price Discovery & Benchmark Engine
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              In wholesale commerce, prices fluctuate based on order volume, supplier capacity, and minimum order requirements. StockLink normalizes equivalent commodities across mills and master distributors so you can trade with absolute confidence.
            </p>
          </div>

          {/* How Price Discovery Works Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-[#CBD3DC] flex items-start gap-3">
              <div className="p-2 bg-[#344453]/10 text-[#344453] rounded-lg shrink-0">
                <TrendingDown className="w-5 h-5 text-[#344453]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">1. Spot Base Price Spreads</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  See the lowest listed benchmark price and calculate relative premium/discount percentages.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD3DC] flex items-start gap-3">
              <div className="p-2 bg-[#344453]/10 text-[#344453] rounded-lg shrink-0">
                <Layers className="w-5 h-5 text-[#344453]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">2. Real Volume Tiers</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Suppliers offer progressive discounts for larger volumes. Our calculator models your exact batch size.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD3DC] flex items-start gap-3">
              <div className="p-2 bg-[#344453]/10 text-[#344453] rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#344453]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">3. MOQ & Stock Safeguards</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Automated checks highlight whether a supplier's minimum order is too high for your capital flow.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Matrix */}
          {loading ? (
            <div className="bg-white p-16 rounded-2xl border border-gray-200 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm font-semibold text-slate-700">Loading price discovery matrix...</p>
            </div>
          ) : (
            <PriceComparisonMatrix groups={groups} standalone={true} />
          )}

          {/* Methodology Explainer */}
          <div className="mt-12 bg-white rounded-2xl border border-[#CBD3DC] p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#344453]" />
              Price Discovery Methodology & Standards
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All comparable items listed within StockLink's Price Discovery Engine undergo strict parameter matching. For instance, in our <strong>A4 Copier Paper</strong> group, each listing is verified to possess identical technical specifications: 75 GSM weight, 500 sheets per wrapped ream, 96%+ ISO brightness, and standard commercial cut tolerances.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-700">
              <div className="p-3 bg-[#F6F9F9] rounded-xl border border-[#C3CECE]">
                <strong className="block font-bold text-slate-900 mb-1">Standardized Unit Pricing</strong>
                Normalized to per-ream, per-bundle, per-kg, or per-tube units to eliminate confusing wholesale packaging variations.
              </div>
              <div className="p-3 bg-[#F6F9F9] rounded-xl border border-[#C3CECE]">
                <strong className="block font-bold text-slate-900 mb-1">Verified Supplier Guarantee</strong>
                Only GSTIN-registered businesses with active physical warehousing facilities are approved to publish live rates.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
