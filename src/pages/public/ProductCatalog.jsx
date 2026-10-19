import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  BarChart3, 
  Building2, 
  Package, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpDown,
  Check,
  Eye
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedSupplierId, setSelectedSupplierId] = useState(searchParams.get('supplierId') || '');
  const [sortBy, setSortBy] = useState('price-asc');
  const [suppliers, setSuppliers] = useState([]);
  const [addedId, setAddedId] = useState(null);

  const { addToCart, setIsDrawerOpen } = useCart();

  const categories = [
    'All',
    'Office Supplies & Stationery',
    'Packaging & Shipping',
    'FMCG & Groceries',
    'Electronics & Hardware'
  ];

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const res = await api.getSuppliers();
        if (res.success) setSuppliers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadSuppliers();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          search: searchQuery,
          category: selectedCategory,
          supplierId: selectedSupplierId,
          sort: sortBy
        });
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedSupplierId, sortBy]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.moq);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSupplierId('');
    setSortBy('price-asc');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FA]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Bulk Wholesale Catalog
                </span>
                <span className="text-xs text-gray-500">• {products.length} Products Available</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Explore Wholesale Products
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Direct procurement with tiered volume discounts and live inventory validation.
              </p>
            </div>

            <Link
              to="/price-discovery"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white text-xs font-bold transition shadow-xs self-start md:self-auto"
            >
              <BarChart3 className="w-4 h-4 text-[#DA9A2F]" />
              <span>Launch Price Discovery Matrix</span>
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD3DC] shadow-xs mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="lg:col-span-5 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title, SKU, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>

              {/* Category */}
              <div className="lg:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                >
                  <option value="All">All Categories</option>
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Supplier Filter */}
              <div className="lg:col-span-2">
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="lg:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock-desc">Highest Stock</option>
                </select>
              </div>
            </div>

            {/* Quick Pills & Clear */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-gray-400 font-semibold">Filter:</span>
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                      selectedCategory === c
                        ? 'bg-[#344453] text-white font-bold'
                        : 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedCategory !== 'All' || selectedSupplierId) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm font-semibold">Fetching products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 max-w-lg mx-auto">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No matching products</h3>
              <p className="text-xs text-gray-500 mt-1">
                Try loosening your search filters or browse other categories.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-[#344453] text-white text-xs font-bold rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => {
                const isLowStock = product.stock <= 10;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#CBD3DC] shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Top image & badges */}
                    <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                          {product.category}
                        </span>
                        {product.canonicalName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DA9A2F] text-slate-950 flex items-center gap-1 shadow-xs">
                            <BarChart3 className="w-3 h-3" />
                            Comparable Listing
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLowStock 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-emerald-500 text-white'
                        }`}>
                          {isLowStock ? `Only ${product.stock} Left` : `${product.stock} in Stock`}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                          <Building2 className="w-3 h-3 text-[#344453]" />
                          <span className="truncate">{product.supplierName}</span>
                        </div>

                        <Link to={`/products/${product.id}`} className="block">
                          <h3 className="font-bold text-slate-900 text-sm hover:text-[#344453] transition line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Pricing and MOQ block */}
                      <div className="bg-[#F6F9F9] p-2.5 rounded-xl border border-[#DDE4E4] space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-gray-500">Base Unit Rate:</span>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-[#344453]">
                              ₹{product.basePrice}
                            </span>
                            <span className="text-[11px] text-gray-400"> / {product.unit}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-200">
                          <span>Minimum Order:</span>
                          <span className="font-bold text-slate-800">{product.moq} {product.unit}s</span>
                        </div>
                      </div>

                      {/* Tiered preview */}
                      {product.tiers && product.tiers.length > 0 && (
                        <div className="text-[11px] text-gray-500 flex items-center justify-between">
                          <span>Volume Tiers:</span>
                          <span className="font-semibold text-slate-700">
                            Up to ₹{product.tiers[product.tiers.length - 1].price}/{product.unit}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="py-2 px-2 text-center text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`py-2 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                          addedId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 shadow-2xs'
                        }`}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add {product.moq}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
