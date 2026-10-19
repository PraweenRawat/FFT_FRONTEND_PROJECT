import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  BarChart3, 
  Plus, 
  Minus,
  Sparkles,
  Info
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comparables, setComparables] = useState([]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { addToCart, setIsDrawerOpen } = useCart();

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProductById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setQuantity(res.data.moq || 1);

          // Find comparable products
          if (res.data.canonicalName) {
            const allRes = await api.getProducts();
            if (allRes.success) {
              const matched = allRes.data.filter(
                p => p.canonicalName === res.data.canonicalName && p.id !== res.data.id
              );
              setComparables(matched);
            }
          }
        } else {
          setError(res.error || 'Product not found');
        }
      } catch (err) {
        setError(err.message || 'Error loading product details');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="animate-spin w-10 h-10 border-4 border-[#344453] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm font-semibold text-slate-700">Loading wholesale specifications...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md p-8 bg-gray-50 rounded-2xl border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#344453] text-white text-xs font-bold rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Dynamic pricing evaluation based on tiered brackets
  const getDynamicPrice = (qty) => {
    if (!product.tiers || product.tiers.length === 0) return product.basePrice;
    for (const tier of product.tiers) {
      if (qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)) {
        return tier.price;
      }
    }
    return product.basePrice;
  };

  const currentUnitPrice = getDynamicPrice(quantity);
  const estimatedTotalCost = currentUnitPrice * quantity;
  const isBelowMoq = quantity < (product.moq || 1);
  const isStockExceeded = quantity > product.stock;

  const handleAddToCart = () => {
    if (isBelowMoq || isStockExceeded) return;
    addToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FA]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#344453] mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to previous page
          </button>

          {/* Main Product Card */}
          <div className="bg-white rounded-3xl border border-[#CBD3DC] shadow-xs overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
              {/* Product Image Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stock status indicator */}
                <div className="p-4 rounded-xl bg-[#F6F9F9] border border-[#DDE4E4] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${product.stock <= 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="font-bold text-slate-800">
                      {product.stock <= 10 ? `Critical Low Stock (${product.stock} units)` : `In Stock: ${product.stock} ${product.unit}s`}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    MOQ: <strong>{product.moq} {product.unit}s</strong>
                  </span>
                </div>
              </div>

              {/* Product Info & Pricing Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#344453] bg-[#EDF2F2] px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#344453]" />
                      <span className="font-bold text-slate-800">{product.supplierName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{product.supplierLocation}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Bulk Tier Pricing Matrix */}
                <div className="bg-[#F6F9F9] rounded-2xl border border-[#CBD3DC] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#DA9A2F]" />
                      Tiered Bulk Pricing Schedule
                    </h3>
                    <span className="text-[11px] text-gray-500">Auto-applies at checkout</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {product.tiers && product.tiers.map((tier, i) => {
                      const isActive = quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty);
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border transition ${
                            isActive
                              ? 'bg-[#DA9A2F]/20 border-[#DA9A2F] ring-2 ring-[#DA9A2F]/30'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <span className="text-[11px] font-semibold text-gray-500 block">
                            {tier.minQty} - {tier.maxQty ? `${tier.maxQty}` : 'Max'} {product.unit}s
                          </span>
                          <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                            ₹{tier.price}
                          </span>
                          <span className="text-[10px] text-gray-400">/ {product.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Quantity Calculator */}
                <div className="p-5 rounded-2xl bg-white border border-[#CBD3DC] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Specify Order Quantity:
                    </label>
                    <span className="text-xs text-gray-500">
                      Required MOQ: <strong>{product.moq} {product.unit}s</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-200 text-slate-700 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20 text-center font-bold text-base bg-white py-2 focus:outline-none border-x border-gray-300"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-3 hover:bg-gray-200 text-slate-700 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 text-right">
                      <span className="text-xs text-gray-500 block">Total Estimated Cost:</span>
                      <span className="text-2xl font-black text-[#344453]">
                        ₹{estimatedTotalCost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        (₹{currentUnitPrice} / {product.unit})
                      </span>
                    </div>
                  </div>

                  {/* Validation Alerts */}
                  {isBelowMoq && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Order quantity ({quantity}) is below the required MOQ of {product.moq} {product.unit}s.</span>
                    </div>
                  )}

                  {isStockExceeded && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Quantity exceeds currently available warehouse inventory ({product.stock} units).</span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isBelowMoq || isStockExceeded}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                        isBelowMoq || isStockExceeded
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : addedSuccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950'
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Added to Split Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 text-slate-950" />
                          <span>Add {quantity} {product.unit}s to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="px-4 py-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-slate-700 font-bold text-xs"
                      title="View Cart"
                    >
                      View Cart
                    </button>
                  </div>
                </div>

                {/* Technical Specifications */}
                {product.specifications && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Technical Specifications:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="p-2 bg-gray-50 rounded-lg flex justify-between">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-semibold text-slate-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alternative Comparable Suppliers Section */}
          {comparables.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#DA9A2F]" />
                    Comparable Listings in Price Discovery
                  </h3>
                  <p className="text-xs text-gray-500">
                    Alternative verified wholesalers supplying equivalent {product.canonicalName}
                  </p>
                </div>

                <Link
                  to="/price-discovery"
                  className="text-xs font-bold text-[#344453] hover:underline flex items-center gap-1"
                >
                  <span>Open Full Comparison Matrix</span>
                  <BarChart3 className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparables.map(comp => (
                  <div
                    key={comp.id}
                    className="p-4 bg-white rounded-2xl border border-[#CBD3DC] shadow-2xs hover:shadow-xs transition flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{comp.supplierName}</h4>
                      <p className="text-xs text-gray-500">{comp.supplierLocation}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-[#344453]">
                          ₹{comp.basePrice} / {comp.unit}
                        </span>
                        <span className="text-[10px] text-gray-400">MOQ: {comp.moq}</span>
                      </div>
                    </div>

                    <Link
                      to={`/products/${comp.id}`}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#344453] hover:bg-slate-700 text-white"
                    >
                      Compare
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
