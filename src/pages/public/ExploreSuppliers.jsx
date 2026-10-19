import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Star, 
  Search, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Package, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { api } from '../../services/api';

export default function ExploreSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Office Supplies & Stationery',
    'Packaging & Shipping',
    'FMCG & Groceries',
    'Electronics & Hardware'
  ];

  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(true);
      try {
        const res = await api.getSuppliers({
          search: searchQuery,
          category: selectedCategory
        });
        if (res.success) {
          setSuppliers(res.data);
        }
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchSuppliers();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FA]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Direct Mill Directory
              </span>
              <span className="text-xs text-gray-500">• {suppliers.length} Registered Wholesalers</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Verified Wholesale Suppliers
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Connect directly with mill manufacturers and verified primary distributors. Eliminate brokers and source inventory at true wholesale rates.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#CBD3DC] shadow-xs mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search input */}
              <div className="md:col-span-7 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by supplier name, city, or product category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453] focus:border-transparent"
                />
              </div>

              {/* Category dropdown */}
              <div className="md:col-span-5 flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Category Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-gray-400 font-semibold shrink-0">Popular:</span>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                    selectedCategory === c
                      ? 'bg-[#344453] text-white font-bold'
                      : 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Suppliers Grid */}
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm font-semibold">Loading verified suppliers...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 max-w-lg mx-auto">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No suppliers found</h3>
              <p className="text-xs text-gray-500 mt-1">
                Try clearing your search query or choosing another category.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 bg-[#344453] text-white text-xs font-bold rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold text-lg shrink-0">
                          {supplier.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                            {supplier.name}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{supplier.city}, {supplier.state}</span>
                          </p>
                        </div>
                      </div>

                      {supplier.verified && (
                        <span className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0" title="GSTIN & Mill Verified">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* About */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {supplier.about}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5">
                      {supplier.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[11px] font-semibold bg-[#EDF2F2] text-[#344453] px-2 py-0.5 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Business Details */}
                    <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-400">GSTIN:</span>
                        <span className="font-mono font-medium text-slate-800">{supplier.gstin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min. Order Value:</span>
                        <span className="font-bold text-[#344453]">₹{supplier.minOrderValue?.toLocaleString('en-IN') || '2,000'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Rating:</span>
                        <span className="flex items-center gap-1 text-slate-800 font-bold">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {supplier.rating} ({supplier.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="bg-[#F6F9F9] px-6 py-3 border-t border-[#DDE4E4] flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {supplier.phone}
                    </span>
                    <Link
                      to={`/products?supplierId=${supplier.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#344453] hover:text-[#DA9A2F] transition"
                    >
                      <span>View Products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
