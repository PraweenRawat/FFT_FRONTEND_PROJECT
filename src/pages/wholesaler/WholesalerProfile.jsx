import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Save 
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function WholesalerProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: user?.businessName || 'Apex Paper & Mill Works',
    name: user?.name || 'Rajesh Sharma',
    email: user?.email || 'wholesaler@stocklink.demo',
    phone: user?.phone || '+91 98201 44521',
    city: user?.city || 'Mumbai',
    state: user?.state || 'Maharashtra',
    address: user?.address || 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    gstin: user?.gstin || '27AAACA1234A1Z5',
    minOrderValue: 2000
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <DashboardLayout roleRequired="wholesaler">
      <div className="max-w-4xl space-y-6">
        <div>
          <span className="text-xs font-bold text-[#344453] bg-[#344453]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Distributor Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Wholesaler Profile & Warehouse Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Maintain your verified mill distributor details, industrial licenses, and minimum order rules.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Wholesaler specifications updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#CBD3DC] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-[#344453] text-[#DA9A2F] flex items-center justify-center font-bold text-lg">
              {formData.businessName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{formData.businessName}</h3>
              <span className="text-xs text-[#344453] bg-[#F6F9F9] px-2.5 py-0.5 rounded-full font-bold border border-[#C3CECE] flex items-center gap-1 w-fit mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DA9A2F]" />
                Primary Mill Distributor Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company / Mill Entity Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Managing Partner / Representative
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Dispatch / Orders Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Commercial Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum Dispatch Order Value (₹)
              </label>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Central Warehouse / Mill Logistics Depot Address
              </label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Live updates propagate across active browser sessions.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Save className="w-4 h-4 text-[#DA9A2F]" />
              <span>Update Wholesaler Settings</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
