import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Trash2, 
  Plus, 
  Minus, 
  AlertTriangle, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck,
  CreditCard,
  Truck
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function RetailerCartPage() {
  const { 
    cartItems, 
    groupedBySupplier, 
    totalItemCount, 
    totalEstimatedCost, 
    hasAnyMoqViolation, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrders, setCreatedOrders] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Trade Credit');

  const supplierEntries = Object.values(groupedBySupplier);

  const handleCheckout = async () => {
    if (hasAnyMoqViolation) {
      alert('Cannot checkout with MOQ violations. Please increase quantities to meet wholesaler requirements.');
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const checkoutPayload = {
        items: cartItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        })),
        shippingAddress: user?.address || 'Plot 18, Commercial Street, Shivajinagar, Pune 411005',
        paymentMethod: paymentTerms,
        idempotencyKey
      };

      const res = await api.checkout(checkoutPayload);
      if (res.success) {
        const orders = res.data?.orders || [res.data];
        setCreatedOrders(orders);
        clearCart();
        setCheckoutModalOpen(true);
      } else {
        alert('Checkout failed: ' + (res.error || 'Server validation failed'));
      }
    } catch (err) {
      alert('Order placement error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout roleRequired="retailer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Multi-Vendor Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Split Wholesale Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Orders are automatically grouped and routed to individual mill suppliers with MOQ validation.
          </p>
        </div>

        {cartItems.length === 0 && !checkoutModalOpen ? (
          <div className="bg-white p-12 sm:p-16 rounded-3xl border border-[#CBD3DC] text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F6F9F9] flex items-center justify-center mx-auto text-[#344453]">
              <ShoppingBag className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your wholesale cart is empty</h2>
            <p className="text-xs text-gray-500">
              Explore suppliers or use our Price Discovery tool to compare bulk rates across verified distributors.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/retailer/products"
                className="px-5 py-2.5 bg-[#344453] text-white text-xs font-bold rounded-xl"
              >
                Browse Catalog
              </Link>
              <Link
                to="/retailer/compare-prices"
                className="px-5 py-2.5 bg-[#DA9A2F] text-slate-950 text-xs font-bold rounded-xl"
              >
                Price Discovery Matrix
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Grouped by supplier */}
            <div className="lg:col-span-8 space-y-6">
              {hasAnyMoqViolation && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-800">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Minimum Order Quantity (MOQ) Action Required:</strong>
                    <span>One or more items do not meet the minimum batch requirements set by the wholesaler. Adjust quantities below to proceed with order routing.</span>
                  </div>
                </div>
              )}

              {supplierEntries.map(group => (
                <div 
                  key={group.supplierId}
                  className="bg-white rounded-2xl border border-[#CBD3DC] shadow-xs overflow-hidden"
                >
                  {/* Supplier Header */}
                  <div className="bg-[#F6F9F9] px-6 py-4 border-b border-[#DDE4E4] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{group.supplierName}</h3>
                        <span className="text-[11px] text-gray-500">PO will be dispatched to this mill separately</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Supplier Subtotal:</span>
                      <span className="text-base font-extrabold text-[#344453]">
                        ₹{group.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100 p-4 sm:p-6 space-y-4">
                    {group.items.map(item => {
                      const isMoqViolated = item.quantity < item.moq;
                      return (
                        <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>Rate: <strong>₹{item.unitPrice}</strong> / {item.unit}</span>
                                <span>•</span>
                                <span className={isMoqViolated ? 'text-red-600 font-bold' : ''}>
                                  MOQ: {item.moq} {item.unit}s
                                </span>
                              </div>
                              {isMoqViolated && (
                                <p className="text-[11px] font-bold text-red-600 flex items-center gap-1 mt-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Short by {item.moq - item.quantity} {item.unit}s to meet MOQ
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-2 hover:bg-gray-200 text-slate-700 transition"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                className="w-12 text-center text-xs font-bold bg-white py-1.5 focus:outline-none border-x border-gray-300"
                              />
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-2 hover:bg-gray-200 text-slate-700 transition"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right min-w-[90px]">
                              <span className="text-base font-extrabold text-slate-900 block">
                                ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-gray-400 hover:text-red-500 p-1.5 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#CBD3DC] p-6 shadow-xs space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#344453]" />
                Purchase Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Number of Wholesalers:</span>
                  <span className="font-bold text-slate-800">{supplierEntries.length} vendor POs</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Order Units:</span>
                  <span className="font-bold text-slate-800">{totalItemCount} units</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Freight:</span>
                  <span className="text-emerald-700 font-semibold">Included (FOB Warehouse)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-gray-100">
                  <span>Total Payable:</span>
                  <span className="text-xl text-[#344453]">₹{totalEstimatedCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Terms selection */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Commercial Payment Terms:
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-300 p-2.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#344453]"
                >
                  <option value="Net 30 Trade Credit">Net 30 Trade Credit (Verified Retailer)</option>
                  <option value="RTGS / NEFT Direct Transfer">RTGS / NEFT Direct Bank Transfer</option>
                  <option value="Letter of Credit (LC)">Commercial Letter of Credit (LC)</option>
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                </select>
              </div>

              {/* Delivery Address Preview */}
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#344453]" />
                  Delivery Destination:
                </span>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {user?.address || 'Plot 18, Commercial Street, Shivajinagar, Pune 411005'}
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting || hasAnyMoqViolation}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                  hasAnyMoqViolation
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-gray-400 text-white'
                    : 'bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950'
                }`}
              >
                {isSubmitting ? (
                  <span>Generating Split POs...</span>
                ) : (
                  <>
                    <span>Confirm & Route {supplierEntries.length} POs</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-gray-400">
                Each supplier will instantly receive the dispatched order within their respective Wholesaler Control Panel.
              </p>
            </div>
          </div>
        )}

        {/* Order Confirmation Modal */}
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Wholesale Orders Dispatched!
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Your purchase orders were successfully split and transmitted to {createdOrders.length} wholesale partners.
                </p>
              </div>

              <div className="space-y-2.5 text-left bg-gray-50 p-4 rounded-2xl text-xs">
                {createdOrders.map(ord => (
                  <div key={ord.orderNumber || ord.id || ord._id} className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{ord.supplierName}</p>
                      <p className="text-gray-400 font-mono text-[11px]">{ord.orderNumber || ord.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#344453]">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                      <span className="block text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    navigate('/retailer/orders');
                  }}
                  className="w-full py-3 bg-[#344453] hover:bg-[#24303C] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Track in Purchase Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
