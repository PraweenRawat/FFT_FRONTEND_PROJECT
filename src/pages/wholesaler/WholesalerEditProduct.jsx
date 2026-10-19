import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Package
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';

export default function WholesalerEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await api.getProductById(id);
        if (res.success && res.data) {
          setFormData(res.data);
          setTiers(res.data.tiers || []);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTierChange = (index, field, val) => {
    const updated = [...tiers];
    updated[index][field] = val ? Number(val) : '';
    setTiers(updated);
  };

  const addTier = () => {
    setTiers([...tiers, { minQty: 100, maxQty: null, price: '' }]);
  };

  const removeTier = (index) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const price = Number(formData.basePrice);
    const stock = Number(formData.stock);
    const moq = Number(formData.moq);

    if (price <= 0 || stock < 0 || moq <= 0) {
      setError('Please provide valid positive numbers for price, stock, and MOQ.');
      return;
    }

    setSaving(true);

    try {
      const validTiers = tiers
        .filter(t => t.price > 0 && t.minQty > 0)
        .map(t => ({
          minQty: Number(t.minQty),
          maxQty: t.maxQty ? Number(t.maxQty) : null,
          price: Number(t.price)
        }));

      const updatePayload = {
        ...formData,
        basePrice: price,
        stock,
        moq,
        tiers: validTiers
      };

      const res = await api.updateProduct(id, updatePayload);
      if (res.success) {
        navigate('/wholesaler/inventory');
      } else {
        setError(res.error || 'Failed to update product');
      }
    } catch (err) {
      setError(err.message || 'Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout roleRequired="wholesaler">
        <div className="p-20 text-center text-gray-500">
          <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs font-semibold">Loading product data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !formData) {
    return (
      <DashboardLayout roleRequired="wholesaler">
        <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-slate-800">Product Unavailable</h2>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
          <button
            onClick={() => navigate('/wholesaler/inventory')}
            className="mt-4 px-4 py-2 bg-[#344453] text-white text-xs font-bold rounded-lg"
          >
            Back to Inventory
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
            Edit Catalog Listing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Modify Product: {formData.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Updated rates and stock quantities will instantly synchronize with retailer search queries.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#CBD3DC] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Base Unit Rate (₹)
              </label>
              <input
                type="number"
                name="basePrice"
                required
                min="1"
                step="0.01"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Warehouse Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum Order Quantity (MOQ)
              </label>
              <input
                type="number"
                name="moq"
                required
                min="1"
                value={formData.moq}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Packaging Unit
              </label>
              <input
                type="text"
                name="unit"
                required
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>
          </div>

          {/* Volume Tiers Builder */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#DA9A2F]" />
                  Volume Tier Schedule
                </h3>
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
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              {saving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#DA9A2F]" />
                  <span>Update Product Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
