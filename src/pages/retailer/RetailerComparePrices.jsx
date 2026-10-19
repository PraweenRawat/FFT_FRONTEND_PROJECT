import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PriceComparisonMatrix from '../../components/price/PriceComparisonMatrix';
import { api } from '../../services/api';

export default function RetailerComparePrices() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await api.getPriceComparisonGroups();
        if (res.success) setGroups(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  return (
    <DashboardLayout roleRequired="retailer">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Retailer Procurement Tools
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Price Discovery & Multi-Supplier Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Benchmark equivalent commodities across competing wholesale suppliers. Simulate bulk volumes to unlock tiered price discounts and ensure MOQ compliance.
          </p>
        </div>

        {loading ? (
          <div className="bg-white p-16 rounded-2xl border border-gray-200 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#344453] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-700">Loading live price discovery matrix...</p>
          </div>
        ) : (
          <PriceComparisonMatrix groups={groups} standalone={true} />
        )}
      </div>
    </DashboardLayout>
  );
}
