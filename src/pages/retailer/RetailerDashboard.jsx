import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Building2, 
  BarChart3, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function RetailerDashboard() {
  const { user } = useAuth();
  const { totalItemCount, totalEstimatedCost } = useCart();
  const [orders, setOrders] = useState([]);
  const [comparisonGroups, setComparisonGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, compRes] = await Promise.all([
          api.getOrders(),
          api.getPriceComparisonGroups()
        ]);
        if (ordersRes.success) setOrders(ordersRes.data);
        if (compRes.success) setComparisonGroups(compRes.data);
      } catch (err) {
        console.error('Failed to load retailer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalSpend = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <DashboardLayout roleRequired="retailer">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#344453] to-[#24303C] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA9A2F] bg-white/10 px-3 py-1 rounded-full">
              Retailer Procurement Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.name || 'Retail Partner'}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              Compare live mill rates across verified wholesale suppliers, review multi-vendor purchase orders, and optimize inventory acquisition costs.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/retailer/compare-prices"
                className="px-4 py-2.5 rounded-xl bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-slate-950" />
                <span>Open Price Discovery Matrix</span>
              </Link>
              <Link
                to="/retailer/products"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition"
              >
                <Package className="w-4 h-4 text-[#DA9A2F]" />
                <span>Browse Wholesale Catalog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-2xl border border-[#CBD3DC] shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Active Orders</span>
              <p className="text-2xl font-black text-slate-900">{activeOrdersCount}</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                In Transit & Processing
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#344453]/10 text-[#344453] flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-2xl border border-[#CBD3DC] shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Spend</span>
              <p className="text-2xl font-black text-[#344453]">
                ₹{totalSpend.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-gray-400">Across {orders.length} orders</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-2xl border border-[#CBD3DC] shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Cart Reserve</span>
              <p className="text-2xl font-black text-[#DA9A2F]">
                {totalItemCount} <span className="text-xs font-normal text-gray-500">units</span>
              </p>
              <span className="text-[11px] text-slate-600">
                Est. ₹{totalEstimatedCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FDF8ED] text-[#DA9A2F] flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-2xl border border-[#CBD3DC] shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Verified Mills</span>
              <p className="text-2xl font-black text-slate-900">6</p>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Direct procurement
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F6F9F9] text-[#344453] flex items-center justify-center border border-[#C3CECE]">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Core Price Discovery Spotlight on Dashboard */}
        <div className="bg-white rounded-3xl border border-[#CBD3DC] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#DA9A2F] text-slate-950 font-extrabold text-[10px] uppercase">
                  Featured Price Spread
                </span>
                <span className="text-xs text-gray-400">Live Trade Benchmarking</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                A4 Paper Reams (75 GSM) Price Discovery
              </h2>
            </div>

            <Link
              to="/retailer/compare-prices"
              className="text-xs font-bold text-[#344453] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore All Product Groups</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/30 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Lowest Listed Base Rate
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">Zenith Stationery Hub</h3>
                <p className="text-xs text-gray-500">Ahmedabad, Gujarat</p>
                <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                  <p>MOQ: <strong>10 reams</strong></p>
                  <p>In Stock: <strong>80 units</strong></p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-800">₹210</span>
                <span className="text-[10px] text-gray-400 block">/ ream</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-700 bg-gray-100 px-2 py-0.5 rounded">
                  Balanced MOQ & Stock
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">Apex Paper & Mill Works</h3>
                <p className="text-xs text-gray-500">Mumbai, Maharashtra</p>
                <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                  <p>MOQ: <strong>5 reams</strong></p>
                  <p>In Stock: <strong>120 units</strong></p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#344453]">₹220</span>
                <span className="text-[10px] text-gray-400 block">/ ream</span>
                <span className="text-[10px] text-amber-700 font-semibold block mt-1">+4.8% spread</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-700 bg-gray-100 px-2 py-0.5 rounded">
                  Highest Live Warehouse Stock
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">Bharat Wholesale Distributors</h3>
                <p className="text-xs text-gray-500">Delhi NCR</p>
                <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                  <p>MOQ: <strong>3 reams</strong></p>
                  <p>In Stock: <strong>200 units</strong></p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-800">₹235</span>
                <span className="text-[10px] text-gray-400 block">/ ream</span>
                <span className="text-[10px] text-amber-700 font-semibold block mt-1">+11.9% spread</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchase Orders Table */}
        <div className="bg-white rounded-3xl border border-[#CBD3DC] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Purchase Orders</h2>
              <p className="text-xs text-gray-500">Latest multi-vendor procurement dispatches</p>
            </div>
            <Link
              to="/retailer/orders"
              className="text-xs font-bold text-[#344453] hover:underline"
            >
              View Full History
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50">
                  <th className="py-2.5 px-3 font-bold rounded-l-lg">Order ID</th>
                  <th className="py-2.5 px-3 font-bold">Date</th>
                  <th className="py-2.5 px-3 font-bold">Wholesaler / Supplier</th>
                  <th className="py-2.5 px-3 font-bold">Items Summary</th>
                  <th className="py-2.5 px-3 font-bold">Total Amount</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 font-bold rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{order.id}</td>
                    <td className="py-3 px-3 text-gray-500">{order.date}</td>
                    <td className="py-3 px-3 font-bold text-[#344453]">{order.supplierName}</td>
                    <td className="py-3 px-3 text-gray-600">
                      {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/retailer/orders"
                        className="text-xs font-bold text-[#344453] hover:underline"
                      >
                        Inspect
                      </Link>
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
