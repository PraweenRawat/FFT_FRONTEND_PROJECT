import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Building2, 
  AlertTriangle, 
  ArrowRight, 
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function SplitCartDrawer() {
  const { 
    cartItems, 
    groupedBySupplier, 
    totalItemCount, 
    totalEstimatedCost, 
    hasAnyMoqViolation,
    updateQuantity, 
    removeFromCart, 
    isDrawerOpen, 
    setIsDrawerOpen 
  } = useCart();
  
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const supplierEntries = Object.values(groupedBySupplier);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#344453] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#DA9A2F]" />
              <div>
                <h2 className="text-lg font-bold">Split Wholesale Cart</h2>
                <p className="text-xs text-[#FCEAC6]">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} across {supplierEntries.length} {supplierEntries.length === 1 ? 'wholesaler' : 'wholesalers'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#EDF2F2] flex items-center justify-center text-[#344453]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Your cart is empty</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Browse verified suppliers or use our Price Discovery tool to compare bulk rates.
                </p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/products');
                  }}
                  className="px-4 py-2 bg-[#344453] text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                {/* Notice if MOQ is violated */}
                {hasAnyMoqViolation && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Minimum Order Quantity (MOQ) Alert:</span>
                      <p>Some items are currently below the wholesaler's required MOQ threshold. Please adjust quantities before checkout.</p>
                    </div>
                  </div>
                )}

                {/* Groups by Supplier */}
                {supplierEntries.map(group => (
                  <div 
                    key={group.supplierId} 
                    className="border border-[#CBD3DC] rounded-xl overflow-hidden shadow-xs bg-white"
                  >
                    {/* Supplier Group Header */}
                    <div className="bg-[#F8F6F9] px-4 py-3 border-b border-[#CBD3DC] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#344453]" />
                        <span className="font-bold text-sm text-slate-800 truncate max-w-[200px]">
                          {group.supplierName}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#344453] bg-[#CBD3DC]/50 px-2 py-0.5 rounded">
                        Subtotal: ₹{group.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Items for this Supplier */}
                    <div className="divide-y divide-gray-100 p-2">
                      {group.items.map(item => {
                        const isMoqViolated = item.quantity < item.moq;
                        return (
                          <div key={item.productId} className="p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0" 
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                    No Pic
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 leading-tight">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-slate-700">
                                      ₹{item.unitPrice} <span className="text-gray-400 font-normal">/ {item.unit}</span>
                                    </span>
                                    <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                      MOQ: {item.moq} {item.unit}s
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-gray-400 hover:text-red-500 p-1 transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Quantity Adjuster & Item Total */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="p-1 px-2 hover:bg-gray-200 text-slate-700 transition"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                  className="w-12 text-center text-xs font-bold bg-white py-1 focus:outline-none border-x border-gray-300"
                                />
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="p-1 px-2 hover:bg-gray-200 text-slate-700 transition"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="text-sm font-bold text-[#344453]">
                                  ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            {/* MOQ Warning */}
                            {isMoqViolated && (
                              <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3" />
                                Requires minimum order of {item.moq} {item.unit}s (short by {item.moq - item.quantity})
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#F8F6F9] border-t border-[#CBD3DC] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Suppliers Involved:</span>
                  <span className="font-medium text-slate-800">{supplierEntries.length} separate orders</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Quantity:</span>
                  <span className="font-medium text-slate-800">{totalItemCount} units</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-gray-200">
                  <span>Estimated Total:</span>
                  <span className="text-lg text-[#344453]">₹{totalEstimatedCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/retailer/cart');
                  }}
                  className="w-full py-3 bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Review & Split Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-gray-500">
                  Wholesale orders are automatically separated and routed to respective vendor portals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
