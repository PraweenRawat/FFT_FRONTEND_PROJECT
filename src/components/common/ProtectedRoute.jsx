import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, VALID_ROLES } from '../../context/AuthContext';
import { ShieldAlert, ArrowRight, Store, Building2, LogIn } from 'lucide-react';

export default function ProtectedRoute({ children, roleRequired }) {
  const { user, isAuthenticated, role, switchDemoRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Unauthenticated users -> Redirect to /login with state.from
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Corrupt or unlisted role -> Purge session & redirect to login
  if (!VALID_ROLES.includes(role)) {
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-based restriction check (e.g. Retailer visiting Wholesaler route or vice-versa)
  if (roleRequired && role !== roleRequired) {
    return (
      <div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#CBD3DC] shadow-lg text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Access Restricted
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Role Mismatch
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This route is restricted to <strong>{roleRequired === 'wholesaler' ? 'Wholesalers & Mill Distributors' : 'Retail Store Operators'}</strong>.
            </p>
            <div className="mt-2 p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-200 text-left space-y-1">
              <div>Current Account: <strong className="text-slate-800">{user.businessName}</strong></div>
              <div>Active Role: <span className="font-semibold capitalize text-[#344453]">{role}</span></div>
              <div>Required Role: <span className="font-semibold capitalize text-[#DA9A2F]">{roleRequired}</span></div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                switchDemoRole(roleRequired);
                navigate(location.pathname, { replace: true });
              }}
              className="w-full py-3 bg-[#DA9A2F] hover:bg-[#C68722] text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Switch to {roleRequired === 'wholesaler' ? 'Wholesaler Demo' : 'Retailer Demo'} & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                navigate(role === 'wholesaler' ? '/wholesaler/dashboard' : '/retailer/dashboard');
              }}
              className="w-full py-2.5 bg-[#344453] hover:bg-[#24303C] text-white font-bold text-xs rounded-xl transition"
            >
              Return to My {role === 'wholesaler' ? 'Wholesaler' : 'Retailer'} Portal
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/login', { state: { from: location } });
              }}
              className="w-full py-2 text-xs text-red-600 hover:text-red-700 font-semibold flex items-center justify-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in with a different account</span>
            </button>
          </div>

          <div className="border-t border-gray-100 pt-3 text-[10px] text-gray-400">
            Note: Client-side route protection. Backend endpoints independently enforce role authorizations.
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized -> Render requested page
  return children;
}
