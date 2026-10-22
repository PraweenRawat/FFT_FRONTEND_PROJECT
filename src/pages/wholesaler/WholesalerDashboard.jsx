import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ClipboardList, 
  PlusCircle, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Store,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function WholesalerDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWholesalerData() {
      try {
        const supplierId = user?.id || user?._id || 'sup-001';
        const [metRes, prodRes, ordRes] = await Promise.all([
          api.getWholesalerMetrics(supplierId),
          api.getProducts({ supplierId }),
          api.getOrders({ supplierId })
        ]);
        if (metRes.success) setMetrics(metRes.data);
        if (prodRes.success) setProducts(prodRes.data);
        if (ordRes.success) setOrders(ordRes.data);
      } catch (err) {
        console.error('Wholesaler dashboard load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWholesalerData();
  }, [user]);

  const lowStockItems = products.filter(p => Number(p.stock) <= 10);

  return (
    <DashboardLayout roleRequired="wholesaler">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#344453] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DA9A2F] bg-white/10 px-3 py-1 rounded-full">
                Mill & Distributor Control Panel
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">
                {user?.businessName || 'Apex Paper & Mill Works'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Streamline direct wholesale dispatches, adjust volume discounts, manage stock levels, and review incoming retailer purchase orders in real-time.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/wholesaler/products/new"
                className="px-5 py-3 rounded-xl bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product Listing</span>
              </Link>
              <Link
                to="/wholesaler/inventory"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition"
              >
                <Package className="w-4 h-4 text-[#DA9A2F]" />
                <span>Inventory Control</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Reference METRIC CARDS (Exact design from our pages .jpeg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Revenue (Exact design in Golden Ochre) */}
          <div className="bg-[#DA9A2F] p-6 rounded-2xl shadow-sm text-slate-950 flex flex-col justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Total Revenue
            </span>
            <div className="my-2">
              <p className="text-4xl font-black tracking-tight">₹12.4L</p>
              <p className="text-xs text-slate-800 font-semibold mt-1">Gross trade settlements</p>
            </div>
            <span className="text-[11px] font-bold text-slate-900 bg-white/30 px-2 py-0.5 rounded w-fit">
              +14.2% this month
            </span>
          </div>

          {/* Low Stock Alerts (Exact design with red/warning alert) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                Low Stock Alerts
              </span>
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
            <div className="my-2">
              <p className="text-4xl font-black text-red-600">
                {metrics?.lowStockAlertsCount || lowStockItems.length || 4}
              </p>
              <p className="text-xs text-gray-500 mt-1">Products below safety buffer</p>
            </div>
            <Link 
              to="/wholesaler/inventory?filter=low-stock" 
              className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Restock inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Total Active Inventory Units */}
          <div className="bg-white p-6 rounded-2xl border border-[#CBD3DC] shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Inventory Units
            </span>
            <div className="my-2">
              <p className="text-3xl font-black text-[#344453]">
                {metrics?.totalInventoryUnits?.toLocaleString('en-IN') || '14,250'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Across all warehouse lots</p>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live stock synchronization active
            </span>
          </div>

          {/* Active Retailer Network */}
          <div className="bg-white p-6 rounded-2xl border border-[#CBD3DC] shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Retailers
            </span>
            <div className="my-2">
              <p className="text-3xl font-black text-slate-900">
                {metrics?.activeRetailersCount || 64}
              </p>
              <p className="text-xs text-gray-500 mt-1">Verified retail procurement accounts</p>
            </div>
            <span className="text-[11px] text-slate-600">
              Automated MOQ validation enabled
            </span>
          </div>
        </div>

        {/* Critical Low Stock Warning Banner if items exist */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-800">
                  Critical Low Inventory Alert ({lowStockItems.length} Products):
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  The following items have dipped below the 10-unit buffer threshold:{' '}
                  <strong>{lowStockItems.map(p => `${p.name} (${p.stock} left)`).join(', ')}</strong>.
                </p>
              </div>
            </div>
            <Link
              to="/wholesaler/inventory"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 text-center"
            >
              Update Stock Now
            </Link>
          </div>
        )}

        {/* Quick Inventory Table Preview */}
        <div className="bg-white rounded-3xl border border-[#CBD3DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Wholesale Inventory Preview</h2>
              <p className="text-xs text-gray-500">Live prices and MOQ settings currently visible to retailers</p>
            </div>
            <Link
              to="/wholesaler/inventory"
              className="text-xs font-bold text-[#344453] hover:underline flex items-center gap-1"
            >
              <span>Manage Full Inventory</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 bg-[#F6F9F9] text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-bold">Product Name</th>
                  <th className="py-2.5 px-4 font-bold">Category</th>
                  <th className="py-2.5 px-4 font-bold">Base Price</th>
                  <th className="py-2.5 px-4 font-bold">Stock Quantity</th>
                  <th className="py-2.5 px-4 font-bold">MOQ</th>
                  <th className="py-2.5 px-4 font-bold">Volume Tiers</th>
                  <th className="py-2.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span>{prod.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{prod.category}</td>
                    <td className="py-3 px-4 font-black text-[#344453] text-sm">₹{prod.basePrice}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stock <= 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {prod.stock} {prod.unit}s
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{prod.moq} {prod.unit}s</td>
                    <td className="py-3 px-4 text-gray-600">
                      {prod.tiers ? `${prod.tiers.length} discount tiers` : 'None'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/wholesaler/products/${prod.id}/edit`}
                        className="text-xs font-bold text-[#344453] hover:underline"
                      >
                        Edit Price/Stock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoming Orders Preview */}
        <div className="bg-white rounded-3xl border border-[#CBD3DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Incoming Retailer Purchase Orders</h2>
              <p className="text-xs text-gray-500">Orders placed by verified retail stores</p>
            </div>
            <Link
              to="/wholesaler/orders"
              className="text-xs font-bold text-[#344453] hover:underline"
            >
              View Order Processing Queue
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 bg-[#F6F9F9] text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-bold">Order ID</th>
                  <th className="py-2.5 px-4 font-bold">Retailer Client</th>
                  <th className="py-2.5 px-4 font-bold">Date</th>
                  <th className="py-2.5 px-4 font-bold">Total Amount</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{o.retailerName}</td>
                    <td className="py-3 px-4 text-gray-500">{o.date}</td>
                    <td className="py-3 px-4 font-black text-[#344453]">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
