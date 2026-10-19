import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Package,
  Layers
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function WholesalerAddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    canonicalName: 'A4 Paper Ream (75 GSM)',
    category: 'Office Supplies & Stationery',
    sku: '',
    unit: 'Ream',
    basePrice: '',
    stock: '',
    moq: '5',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const [tiers, setTiers] = useState([
    { minQty: 5, maxQty: 25, price: '' },
    { minQty: 26, maxQty: 75, price: '' }
  ]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Office Supplies & Stationery',
    'Packaging & Shipping',
    'FMCG & Groceries',
    'Electronics & Hardware'
  ];

  const canonicalOptions = [
    'A4 Paper Ream (75 GSM)',
    'Corrugated Box 12x10x8',
    'BOPP Packaging Tape 2-Inch',
    'Basmati Rice 25kg',
    'Custom / New Listing'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTierChange = (index, field, val) => {
    const updated = [...tiers];
    updated[index][field] = val ? Number(val) : '';
    setTiers(updated);
  };

  const addTier = () => {
    setTiers([...tiers, { minQty: 76, maxQty: null, price: '' }]);
  };

  const removeTier = (index) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.basePrice || !formData.stock || !formData.moq) {
      setError('Please fill in all mandatory product and pricing fields.');
      return;
    }

    const price = Number(formData.basePrice);
    const stock = Number(formData.stock);
    const moq = Number(formData.moq);

    if (price <= 0) {
      setError('Base unit price must be greater than zero.');
      return;
    }

    if (stock < 0) {
      setError('Inventory stock cannot be negative.');
      return;
    }

    if (moq <= 0) {
      setError('Minimum Order Quantity must be at least 1.');
      return;
    }

    setLoading(true);

    try {
      const validTiers = tiers
        .filter(t => t.price > 0 && t.minQty > 0)
        .map(t => ({
          minQty: Number(t.minQty),
          maxQty: t.maxQty ? Number(t.maxQty) : null,
          price: Number(t.price)
        }));

      const newProductPayload = {
        ...formData,
        basePrice: price,
        stock,
        moq,
        supplierId: user?.id || 'sup-001',
        supplierName: user?.businessName || 'Apex Paper & Mill Works',
        supplierLocation: `${user?.city || 'Mumbai'}, ${user?.state || 'MH'}`,
        tiers: validTiers
      };

      const res = await api.createProduct(newProductPayload);
      if (res.success) {
        navigate('/wholesaler/inventory');
      } else {
        setError(res.error || 'Failed to add product');
      }
    } catch (err) {
      setError(err.message || 'Error creating product listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout roleRequired="wholesaler">
      <div className="max-w-4xl space-y-6">
        <button
          onClick={() => navigate('/wholesaler/inventory')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#344453]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory Panel
        </button>

        <div>
          <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Wholesale Catalog Creator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Add New Product Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure wholesale specifications, MOQ thresholds, and automated volume discount tiers.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#CBD3DC] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#344453]" />
              Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. A4 Paper Ream (75 GSM - 500 Sheets)"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Marketplace Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price Discovery Grouping Match
                </label>
                <select
                  name="canonicalName"
                  value={formData.canonicalName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                >
                  {canonicalOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Packaging Unit *
                </label>
                <input
                  type="text"
                  name="unit"
                  required
                  placeholder="e.g. Ream, Bundle (25 pcs), Box, Roll"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SKU / Internal Barcode
                </label>
                <input
                  type="text"
                  name="sku"
                  placeholder="e.g. PAP-A4-75-NEW"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Description & Technical Specifications
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Specify GSM, bursting strength, certification, or material purity..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock Numbers */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Wholesale Base Rate & Inventory Buffers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  name="basePrice"
                  required
                  min="1"
                  step="0.01"
                  placeholder="220"
                  value={formData.basePrice}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
                <span className="text-[11px] text-gray-400">Standard single-unit rate</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Live Stock Units *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  placeholder="120"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
                <span className="text-[11px] text-gray-400">Available warehouse count</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Minimum Order (MOQ) *
                </label>
                <input
                  type="number"
                  name="moq"
                  required
                  min="1"
                  placeholder="5"
                  value={formData.moq}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
                <span className="text-[11px] text-gray-400">Minimum batch order</span>
              </div>
            </div>
          </div>

          {/* Volume Tiers Builder */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#DA9A2F]" />
                  Volume Tiered Pricing Schedule
                </h3>
                <p className="text-xs text-gray-500">Encourage larger bulk orders with progressive price discounts</p>
              </div>
              <button
                type="button"
                onClick={addTier}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-slate-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-2">
              {tiers.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs">
                  <span className="font-bold text-slate-500 w-16">Tier {idx + 1}:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-400">Min:</span>
                    <input
                      type="number"
                      value={tier.minQty}
                      onChange={(e) => handleTierChange(idx, 'minQty', e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-center font-bold"
                    />
                    <span className="text-gray-400">to Max:</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tier.maxQty || ''}
                      onChange={(e) => handleTierChange(idx, 'maxQty', e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-center font-bold"
                    />
                    <span className="text-gray-400">Rate (₹):</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                      className="w-24 px-2 py-1 bg-white border border-gray-300 rounded text-center font-bold text-[#344453]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Submit */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/wholesaler/inventory')}
              className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              {loading ? (
                <span>Publishing Listing...</span>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#DA9A2F]" />
                  <span>Publish Product Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
