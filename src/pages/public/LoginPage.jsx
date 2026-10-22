import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Store, 
  Building2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Info
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/stocklink-logo.png';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Inspect if redirected from a protected route
  const fromLocation = location.state?.from;
  const redirectPath = fromLocation?.pathname || (typeof fromLocation === 'string' ? fromLocation : null);

  // Automatically adapt default role tab to the attempted path
  const inferredRoleFromPath = redirectPath?.startsWith('/wholesaler') 
    ? 'wholesaler' 
    : redirectPath?.startsWith('/retailer') 
    ? 'retailer' 
    : searchParams.get('role') === 'wholesaler' 
    ? 'wholesaler' 
    : 'retailer';

  const [role, setRole] = useState(inferredRoleFromPath);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const validateEmail = (mail) => {
    return /\S+@\S+\.\S+/.test(mail);
  };

  const getDestination = (authenticatedRole) => {
    if (redirectPath && typeof redirectPath === 'string') {
      const isRetailerPath = redirectPath.startsWith('/retailer');
      const isWholesalerPath = redirectPath.startsWith('/wholesaler');

      // If the authenticated role is authorized for the attempted path, return there
      if (authenticatedRole === 'retailer' && isRetailerPath) {
        return redirectPath;
      }
      if (authenticatedRole === 'wholesaler' && isWholesalerPath) {
        return redirectPath;
      }
      if (!isRetailerPath && !isWholesalerPath) {
        return redirectPath;
      }
    }
    // Default fallback to role dashboard
    return authenticatedRole === 'wholesaler' ? '/wholesaler/dashboard' : '/retailer/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please provide your business email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(role, email, password);
      if (result.success) {
        const destination = getDestination(result.user?.role || role);
        setSuccess(`Authenticated as ${result.user?.role === 'wholesaler' ? 'Wholesaler' : 'Retailer'}! Directing to ${destination}...`);
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 400);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'retailer') {
      setEmail('retailer@stocklink.demo');
      setPassword('demo1234password');
    } else {
      setEmail('wholesaler@stocklink.demo');
      setPassword('demo1234password');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FA]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#CBD3DC] shadow-lg">
          {/* Top Logo and Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <img src={logoImg} alt="StockLink" className="h-10 mx-auto w-auto" />
            </Link>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to StockLink
            </h2>
            <p className="text-xs text-gray-500">
              Access your wholesale procurement and inventory portal
            </p>
          </div>

          {/* Notice if user was redirected from a protected route */}
          {redirectPath && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 animate-in fade-in">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Required:</span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Please sign in to proceed to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">{redirectPath}</code>.
                </p>
              </div>
            </div>
          )}

          {/* Role Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F2F5F8] rounded-xl border border-[#CBD3DC]">
            <button
              type="button"
              onClick={() => { setRole('retailer'); setError(''); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === 'retailer'
                  ? 'bg-white text-[#344453] shadow-xs'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <Store className="w-4 h-4 text-[#344453]" />
              <span>Retailer</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('wholesaler'); setError(''); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === 'wholesaler'
                  ? 'bg-white text-[#344453] shadow-xs'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#344453]" />
              <span>Wholesaler</span>
            </button>
          </div>

          {/* Quick Demo Pre-fill Pill */}
          <div className="p-3 bg-[#F6F9F9] border border-[#C3CECE] rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#344453]">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#DA9A2F]" />
                Demo Credentials:
              </span>
              <span className="text-[10px] text-gray-500">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoFill('retailer')}
                className={`py-1.5 px-2 rounded border text-[11px] font-bold text-center transition ${
                  role === 'retailer'
                    ? 'bg-[#DA9A2F] text-slate-950 border-[#DA9A2F]'
                    : 'bg-white hover:bg-gray-100 border-gray-200 text-slate-700'
                }`}
              >
                Demo Retailer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('wholesaler')}
                className={`py-1.5 px-2 rounded border text-[11px] font-bold text-center transition ${
                  role === 'wholesaler'
                    ? 'bg-[#DA9A2F] text-slate-950 border-[#DA9A2F]'
                    : 'bg-white hover:bg-gray-100 border-gray-200 text-slate-700'
                }`}
              >
                Demo Wholesaler
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] font-semibold text-gray-400">
                  Demo: any password
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#344453]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#344453] hover:bg-[#24303C] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In as {role === 'wholesaler' ? 'Wholesaler' : 'Retailer'}</span>
                  <ArrowRight className="w-4 h-4 text-[#DA9A2F]" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
            Don't have a verified account yet?{' '}
            <Link to={`/register?role=${role}`} className="font-bold text-[#344453] hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
