import React, { useState } from 'react';
import { 
  CheckCircle2, 
  TrendingDown, 
  AlertCircle, 
  ShoppingCart, 
  ArrowUpDown, 
  HelpCircle, 
  Sparkles, 
  Building2, 
  Layers,
  Calculator,
  Percent
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function PriceComparisonMatrix({ 
  groups = [], 
  selectedGroupId, 
  onSelectGroup,
  standalone = false 
}) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(25);
  const [sortBy, setSortBy] = useState('price-asc'); // 'price-asc', 'stock-desc', 'moq-asc', 'total-asc'
  const { addToCart, setIsDrawerOpen } = useCart();
  const [addedProductId, setAddedProductId] = useState(null);

  const currentGroup = groups[activeGroupIndex] || groups[0];

  if (!currentGroup || !currentGroup.products || currentGroup.products.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
        <p className="text-gray-500">No comparable product groups available.</p>
      </div>
    );
  }

  // Find lowest base unit price among group
  const basePrices = currentGroup.products.map(p => p.basePrice);
  const minBasePrice = Math.min(...basePrices);

  // Helper to compute effective unit price at selected quantity
  const getEffectivePrice = (product, qty) => {
    if (!product.tiers || product.tiers.length === 0) return product.basePrice;
    for (const tier of product.tiers) {
      if (qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)) {
        return tier.price;
      }
    }
    return product.basePrice;
  };

  // Enhance each product with calculations for the simulation
  const enhancedList = currentGroup.products.map(prod => {
    const effectivePrice = getEffectivePrice(prod, orderQuantity);
    const absDiffBase = prod.basePrice - minBasePrice;
    const pctDiffBase = minBasePrice > 0 ? ((absDiffBase / minBasePrice) * 100).toFixed(1) : 0;
    const totalOrderCost = effectivePrice * orderQuantity;
    const isBelowMoq = orderQuantity < prod.moq;
    const isStockShortage = orderQuantity > prod.stock;
    const isLowestBase = prod.basePrice === minBasePrice;

    return {
      ...prod,
      effectivePrice,
      absDiffBase,
      pctDiffBase,
      totalOrderCost,
      isBelowMoq,
      isStockShortage,
      isLowestBase
    };
  });

  // Calculate lowest simulated total cost among valid suppliers (meeting MOQ & stock)
  const validTotalCosts = enhancedList
    .filter(p => !p.isBelowMoq && !p.isStockShortage)
    .map(p => p.totalOrderCost);
  const minTotalCost = validTotalCosts.length > 0 ? Math.min(...validTotalCosts) : null;

  // Sorting
  const sortedList = [...enhancedList].sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
    if (sortBy === 'total-asc') return a.totalOrderCost - b.totalOrderCost;
    if (sortBy === 'stock-desc') return b.stock - a.stock;
    if (sortBy === 'moq-asc') return a.moq - b.moq;
    return 0;
  });

  const handleAddToCart = (product) => {
    addToCart(product, Math.max(orderQuantity, product.moq));
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#CBD3DC] shadow-sm overflow-hidden">
      {/* Header bar with group tabs */}
      <div className="bg-[#344453] text-white p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DA9A2F] text-slate-950 uppercase tracking-wide">
                Price Discovery Engine
              </span>
              <span className="text-xs text-gray-300">Live Trade Comparison</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              {currentGroup.canonicalName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
              {currentGroup.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs bg-[#24303C] border border-[#475C6F] px-3 py-1.5 rounded-lg text-gray-200">
              Sample Dataset: <strong>{currentGroup.products.length} Mill Distributors</strong>
            </span>
          </div>
        </div>

        {/* Group Selector Pills */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {groups.map((grp, idx) => (
            <button
              key={grp.canonicalName}
              onClick={() => {
                setActiveGroupIndex(idx);
                if (onSelectGroup) onSelectGroup(grp);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                idx === activeGroupIndex
                  ? 'bg-[#DA9A2F] text-slate-950 shadow-sm'
                  : 'bg-[#24303C] text-gray-200 hover:bg-[#475C6F]'
              }`}
            >
              {grp.canonicalName}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Control Bar */}
      <div className="bg-[#F6F9F9] border-b border-[#C3CECE] p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Quantity Simulation Input */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#344453]" />
                Simulate Bulk Purchase Quantity:
              </label>
              <span className="text-xs font-bold text-[#344453] bg-[#DDE4E4] px-2 py-0.5 rounded">
                Target: {orderQuantity} {currentGroup.products[0]?.unit || 'units'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                className="w-full h-2 bg-[#C3CECE] rounded-lg appearance-none cursor-pointer accent-[#344453]"
              />
              <input
                type="number"
                min="1"
                max="1000"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-2 py-1.5 text-center font-bold text-sm bg-white border border-[#A3B2B1] rounded-lg shadow-inner focus:outline-none focus:border-[#344453]"
              />
            </div>
            <p className="text-[11px] text-gray-500">
              Adjust quantity to inspect automated tiered bulk discounts and MOQ eligibility per supplier.
            </p>
          </div>

          {/* Sort Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#344453]" />
              Sort Suppliers:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-[#A3B2B1] rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[#344453]"
            >
              <option value="price-asc">Lowest Base Price First</option>
              <option value="total-asc">Lowest Simulated Total Cost</option>
              <option value="stock-desc">Highest Stock Availability</option>
              <option value="moq-asc">Lowest Minimum Order Quantity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Table / Cards */}
      <div className="p-4 sm:p-6">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#CBD3DC] text-[11px] uppercase tracking-wider text-slate-500 bg-[#F7F5F8]">
                <th className="py-3 px-4 rounded-tl-lg font-bold">Wholesaler / Supplier</th>
                <th className="py-3 px-4 font-bold">Base Unit Price</th>
                <th className="py-3 px-4 font-bold">Price Spread vs Lowest</th>
                <th className="py-3 px-4 font-bold">MOQ & Stock Status</th>
                <th className="py-3 px-4 font-bold">Volume Pricing Tiers</th>
                <th className="py-3 px-4 font-bold">Estimated Cost ({orderQuantity} units)</th>
                <th className="py-3 px-4 rounded-tr-lg text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {sortedList.map((item) => {
                const isBestOverall = minTotalCost !== null && item.totalOrderCost === minTotalCost && !item.isBelowMoq && !item.isStockShortage;
                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors hover:bg-[#F9F8FA] ${
                      item.isLowestBase ? 'bg-emerald-50/30' : ''
                    } ${isBestOverall ? 'bg-[#FFF8F5]' : ''}`}
                  >
                    {/* Supplier Name & Location */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#ECE8ED] text-[#344453] flex items-center justify-center font-bold text-sm shrink-0">
                          <Building2 className="w-4 h-4 text-[#344453]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{item.supplierName}</p>
                          <p className="text-xs text-gray-500">{item.supplierLocation}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {item.isLowestBase && (
                              <span className="badge-lowest-price text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Lowest Base Unit Price
                              </span>
                            )}
                            {isBestOverall && (
                              <span className="bg-[#DA9A2F] text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                                <Sparkles className="w-3 h-3" />
                                Best Deal for {orderQuantity} units
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Base Unit Price */}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="text-base font-extrabold text-[#344453]">
                        ₹{item.basePrice}
                      </div>
                      <span className="text-[11px] text-gray-400 font-normal">per {item.unit}</span>
                    </td>

                    {/* Price Spread */}
                    <td className="py-4 px-4">
                      {item.isLowestBase ? (
                        <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>Market Benchmark (₹{minBasePrice})</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-amber-700">
                            +₹{item.absDiffBase} <span className="text-[10px] font-normal text-gray-500">higher</span>
                          </p>
                          <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-0.5">
                            <Percent className="w-3 h-3 text-amber-600" />
                            +{item.pctDiffBase}% vs lowest
                          </p>
                        </div>
                      )}
                    </td>

                    {/* MOQ & Stock */}
                    <td className="py-4 px-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">MOQ:</span>
                          <span className={`font-bold px-1.5 py-0.2 rounded ${
                            item.isBelowMoq ? 'bg-red-100 text-red-700 font-extrabold' : 'bg-gray-100 text-slate-800'
                          }`}>
                            {item.moq} {item.unit}s
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Available:</span>
                          <span className={`font-bold ${
                            item.isStockShortage ? 'text-red-600' : 'text-emerald-700'
                          }`}>
                            {item.stock} in stock
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tiered Pricing */}
                    <td className="py-4 px-4 text-xs">
                      {item.tiers && item.tiers.length > 0 ? (
                        <div className="space-y-1">
                          {item.tiers.map((t, i) => {
                            const isTierActive = orderQuantity >= t.minQty && (t.maxQty === null || orderQuantity <= t.maxQty);
                            return (
                              <div 
                                key={i}
                                className={`text-[11px] px-2 py-0.5 rounded flex items-center justify-between gap-2 ${
                                  isTierActive 
                                    ? 'bg-[#DA9A2F]/30 text-slate-900 font-bold border border-[#DA9A2F]' 
                                    : 'text-gray-600'
                                }`}
                              >
                                <span>{t.minQty}{t.maxQty ? `-${t.maxQty}` : '+'} units:</span>
                                <span>₹{t.price}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Standard flat rate</span>
                      )}
                    </td>

                    {/* Simulated Total Cost */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-extrabold text-slate-900">
                        ₹{item.totalOrderCost.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        (₹{item.effectivePrice} effective/unit)
                      </div>
                      {item.isBelowMoq && (
                        <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                          ⚠️ Below MOQ threshold ({item.moq})
                        </span>
                      )}
                      {item.isStockShortage && (
                        <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                          ⚠️ Exceeds stock ({item.stock})
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.isStockShortage}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ml-auto ${
                          item.isStockShortage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : addedProductId === item.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#344453] hover:bg-[#24303C] text-white shadow-xs'
                        }`}
                      >
                        {addedProductId === item.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 text-[#DA9A2F]" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {sortedList.map((item) => {
            const isBestOverall = minTotalCost !== null && item.totalOrderCost === minTotalCost && !item.isBelowMoq && !item.isStockShortage;
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBestOverall 
                    ? 'border-[#DA9A2F] bg-[#FFF8F5] ring-2 ring-[#DA9A2F]/30' 
                    : item.isLowestBase 
                    ? 'border-emerald-300 bg-emerald-50/20' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.supplierName}</h3>
                    <p className="text-xs text-gray-500">{item.supplierLocation}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#344453]">₹{item.basePrice}</span>
                    <span className="text-xs text-gray-400 block">/ {item.unit}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 my-2.5">
                  {item.isLowestBase && (
                    <span className="badge-lowest-price text-[10px] font-bold px-2 py-0.5 rounded">
                      Lowest Listed Base Price
                    </span>
                  )}
                  {isBestOverall && (
                    <span className="bg-[#DA9A2F] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Best Deal ({orderQuantity} units)
                    </span>
                  )}
                  {!item.isLowestBase && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      +₹{item.absDiffBase} (+{item.pctDiffBase}%) vs benchmark
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-gray-100 my-2">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Minimum Order:</span>
                    <span className={`font-bold ${item.isBelowMoq ? 'text-red-600' : 'text-slate-700'}`}>
                      {item.moq} {item.unit}s
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Live Stock:</span>
                    <span className={`font-bold ${item.isStockShortage ? 'text-red-600' : 'text-emerald-700'}`}>
                      {item.stock} {item.unit}s
                    </span>
                  </div>
                </div>

                {/* Bulk tier indicator */}
                {item.tiers && item.tiers.length > 0 && (
                  <div className="mb-3 text-[11px] bg-gray-50 p-2 rounded-lg">
                    <span className="font-semibold text-slate-700 block mb-1">Volume Tiers:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.tiers.map((t, idx) => (
                        <span 
                          key={idx}
                          className={`px-1.5 py-0.5 rounded ${
                            orderQuantity >= t.minQty && (t.maxQty === null || orderQuantity <= t.maxQty)
                              ? 'bg-[#DA9A2F] text-slate-950 font-bold'
                              : 'bg-white text-gray-600 border border-gray-200'
                          }`}
                        >
                          {t.minQty}{t.maxQty ? `-${t.maxQty}` : '+'}: ₹{t.price}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Est. for {orderQuantity} units:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{item.totalOrderCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.isStockShortage}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#344453] hover:bg-[#24303C] text-white flex items-center gap-1.5 shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-[#DA9A2F]" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {item.isBelowMoq && (
                  <p className="text-[11px] font-semibold text-red-600 mt-2">
                    ⚠️ Order quantity is lower than wholesaler MOQ ({item.moq} units).
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Insight Box */}
        <div className="mt-6 p-4 rounded-xl bg-[#EDF2F2] border border-[#A3B2B1] text-xs text-[#344453] flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#344453] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Price Discovery Trade-off Analysis:</h4>
            <p>
              Note that the supplier with the lowest unit base price (e.g. <strong>₹210</strong>) may demand higher Minimum Order Quantities (10 units). For smaller spot orders, suppliers with lower MOQs can minimize capital lockup even if their headline base price is nominally higher.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
