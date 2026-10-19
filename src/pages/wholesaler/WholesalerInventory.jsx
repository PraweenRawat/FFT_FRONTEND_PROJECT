import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowUpDown,
  X
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';

export default function WholesalerInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(searchParams.get('filter') === 'low-stock');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const categories = [
    'All',
    'Office Supplies & Stationery',
    'Packaging & Shipping',
    'FMCG & Groceries',
    'Electronics & Hardware'
  ];

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        supplierId: 'sup-001',
        search: searchQuery,
        category: selectedCategory,
        lowStockOnly
      });
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, lowStockOnly]);

  const handleDelete = async (id) => {
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setActionSuccess('Product removed from active catalog.');
        setDeleteConfirmId(null);
        fetchInventory();
        setTimeout(() => setActionSuccess(''), 2500);
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  return (
    <DashboardLayout roleRequired="wholesaler">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Warehouse Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Inventory Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage live wholesale product rates, minimum order batch quantities, volume tiers, and buffer stock.
            </p>
          </div>

          <Link
            to="/wholesaler/products/new"
            className="px-5 py-2.5 bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product Listing</span>
          </Link>
        </div>

        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="bg-white p-4 rounded-2xl border border-[#CBD3DC] shadow-xs space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inventory by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#344453]"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-[#344453]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Low stock toggle */}
            <div className="md:col-span-3 flex items-center">
              <button
                onClick={() => setLowStockOnly(!lowStockOnly)}
                className={`w-full py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition ${
                  lowStockOnly
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <AlertTriangle className={`w-3.5 h-3.5 ${lowStockOnly ? 'text-red-600' : 'text-gray-400'}`} />
                <span>Show Low Stock (≤10) Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Control Table (Exact Layout from reference image) */}
        <div className="bg-white rounded-3xl border border-[#CBD3DC] shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-semibold">Updating inventory matrix...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-800">No inventory products found</p>
              <p className="text-xs text-gray-400 mt-1">Try resetting your filter or click Add Product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#CBD3DC] bg-[#F6F9F9] text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-bold">Product Name</th>
                    <th className="py-3 px-4 font-bold">Category</th>
                    <th className="py-3 px-4 font-bold">Base Price</th>
                    <th className="py-3 px-4 font-bold">Stock Level</th>
                    <th className="py-3 px-4 font-bold">MOQ</th>
                    <th className="py-3 px-4 font-bold">Tiered Pricing Schedule</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(prod => {
                    const isLow = prod.stock <= 10;
                    return (
                      <tr key={prod.id} className="hover:bg-gray-50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            <div>
                              <p className="line-clamp-1">{prod.name}</p>
                              <span className="text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">{prod.category}</td>
                        <td className="py-3.5 px-4 font-black text-sm text-[#344453]">
                          ₹{prod.basePrice} <span className="text-[10px] font-normal text-gray-400">/{prod.unit}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                            isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isLow && <AlertTriangle className="w-3 h-3" />}
                            {prod.stock} {prod.unit}s
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {prod.moq} {prod.unit}s
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {prod.tiers && prod.tiers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {prod.tiers.map((t, idx) => (
                                <span key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-700">
                                  {t.minQty}-{t.maxQty || '∞'}: ₹{t.price}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Flat rate</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/wholesaler/products/${prod.id}/edit`}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#344453] hover:text-white text-slate-700 transition"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteConfirmId(prod.id)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white text-gray-400 transition"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Remove Product Listing?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  This product will be immediately delisted from the live marketplace and price discovery matrix.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
