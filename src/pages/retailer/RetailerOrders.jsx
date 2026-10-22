import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Building2, 
  X,
  FileText
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';

export default function RetailerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalOrder, setActiveModalOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await api.getOrders({ status: statusFilter });
        if (res.success) setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const orderIdStr = (o.orderNumber || o.id || o._id || '').toLowerCase();
    const supplierStr = (o.supplierName || '').toLowerCase();
    return orderIdStr.includes(q) || supplierStr.includes(q);
  });

  return (
    <DashboardLayout roleRequired="retailer">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Procurement Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Purchase Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track wholesale orders, shipment statuses, and supplier fulfillment.
          </p>
        </div>

        {/* Filter controls */}
        <div className="bg-white p-4 rounded-2xl border border-[#CBD3DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID or Wholesaler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#344453]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            {['All', 'Pending', 'Processing', 'Dispatched', 'Delivered'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition font-semibold ${
                  statusFilter === st
                    ? 'bg-[#344453] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-[#CBD3DC] shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-semibold">Loading purchase orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-800">No matching orders found</p>
              <p className="text-xs text-gray-400 mt-1">Try switching status tabs.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#CBD3DC] bg-[#F6F9F9] text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-bold">Order ID</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Wholesaler Partner</th>
                    <th className="py-3 px-4 font-bold">Items Count</th>
                    <th className="py-3 px-4 font-bold">Order Value</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Invoice Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="py-3.5 px-4 text-gray-500">{order.date}</td>
                      <td className="py-3.5 px-4 font-bold text-[#344453] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#344453]" />
                        <span>{order.supplierName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} units ({order.items.length} lines)
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveModalOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PO</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {activeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#344453]" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Purchase Order Details</h3>
                    <p className="text-xs text-gray-400 font-mono">{activeModalOrder.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalOrder(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-[#F6F9F9] p-3 rounded-xl border border-[#C3CECE]">
                <div>
                  <span className="text-gray-400 block">Supplier / Mill:</span>
                  <span className="font-bold text-slate-900">{activeModalOrder.supplierName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Order Date:</span>
                  <span className="font-bold text-slate-900">{activeModalOrder.date}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Payment Terms:</span>
                  <span className="font-bold text-slate-900">{activeModalOrder.paymentStatus}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Fulfillment Status:</span>
                  <span className="font-bold text-emerald-700">{activeModalOrder.status}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Itemized Breakdown:</h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-xs">
                  {activeModalOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <p className="font-semibold text-slate-900">{it.productName}</p>
                        <p className="text-[11px] text-gray-500">{it.quantity} units @ ₹{it.unitPrice}</p>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(it.quantity * it.unitPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 flex justify-between items-center font-bold text-sm">
                    <span>Total Dispatched Value:</span>
                    <span className="text-base text-[#344453]">
                      ₹{activeModalOrder.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalOrder(null)}
                className="w-full py-2.5 bg-[#344453] hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close Modal
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
