import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const VALID_ROLES = ['retailer', 'wholesaler'];

export const DEMO_USERS = {
  retailer: {
    id: 'ret-001',
    name: 'Pooja Verma',
    businessName: 'Metro Superstore & Stationery',
    email: 'retailer@stocklink.demo',
    phone: '+91 98201 11223',
    role: 'retailer',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Plot 18, Commercial Street, Shivajinagar, Pune 411005',
    gstin: '27AABCM4567P1Z3'
  },
  wholesaler: {
    id: 'sup-001',
    name: 'Rajesh Sharma',
    businessName: 'Apex Paper & Mill Works',
    email: 'wholesaler@stocklink.demo',
    phone: '+91 98201 44521',
    role: 'wholesaler',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    gstin: '27AAACA1234A1Z5'
  }
};

function validateAndParseStoredUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      (parsed.id || parsed._id) &&
      VALID_ROLES.includes(parsed.role)
    ) {
      return parsed;
    }
  } catch (err) {
    console.warn('[StockLink RBAC] Corrupted session in localStorage. Clearing:', err);
  }

  try {
    localStorage.removeItem('stocklink_user');
    localStorage.removeItem('stocklink_token');
  } catch {}
  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('stocklink_user');
      return validateAndParseStoredUser(stored);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('stocklink_token') || null;
    } catch {
      return null;
    }
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Verify token on mount with GET /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const currentToken = localStorage.getItem('stocklink_token');
      if (currentToken) {
        try {
          const res = await api.getMe();
          if (isMounted) {
            if (res.success && res.data?.user) {
              const verifiedUser = res.data.user;
              setUser(verifiedUser);
              setIsLiveBackend(true);
              localStorage.setItem('stocklink_user', JSON.stringify(verifiedUser));
            } else if (res.status === 401) {
              // Token expired or invalid
              console.warn('[StockLink Auth] Token validation failed, clearing session.');
              localStorage.removeItem('stocklink_token');
              localStorage.removeItem('stocklink_user');
              setUser(null);
              setToken(null);
            }
          }
        } catch {
          // Keep cached user if network temporarily failed
        }
      }
      if (isMounted) setIsLoadingAuth(false);
    };

    verifySession();
    return () => { isMounted = false; };
  }, []);

  // Listen for storage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'stocklink_user') {
        const validated = validateAndParseStoredUser(e.newValue);
        setUser(validated);
      }
      if (e.key === 'stocklink_token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (role, email, password) => {
    if (role && !VALID_ROLES.includes(role)) {
      return { success: false, error: `Invalid role '${role}'. Must be 'retailer' or 'wholesaler'.` };
    }

    try {
      const res = await api.login(email, password);

      if (res.success && res.data?.token && res.data?.user) {
        const authUser = res.data.user;
        const authToken = res.data.token;

        setUser(authUser);
        setToken(authToken);
        setIsLiveBackend(res.isLiveBackend ?? true);

        localStorage.setItem('stocklink_user', JSON.stringify(authUser));
        localStorage.setItem('stocklink_token', authToken);

        return { success: true, user: authUser, token: authToken };
      }

      // If backend was unreachable and returned demo result
      if (!res.isLiveBackend) {
        const demoUser = DEMO_USERS[role] || {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          businessName: `${email.split('@')[0]} Enterprises`,
          email,
          role: role || 'retailer'
        };

        setUser(demoUser);
        localStorage.setItem('stocklink_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser, isDemo: true };
      }

      return {
        success: false,
        error: res.error || 'Invalid credentials'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Authentication failed'
      };
    }
  };

  const register = async (registrationData) => {
    if (!VALID_ROLES.includes(registrationData.role)) {
      return { success: false, error: `Invalid registration role '${registrationData.role}'.` };
    }

    try {
      const res = await api.register(registrationData);

      if (res.success && res.data?.user && res.data?.token) {
        const authUser = res.data.user;
        const authToken = res.data.token;

        setUser(authUser);
        setToken(authToken);
        setIsLiveBackend(res.isLiveBackend ?? true);

        localStorage.setItem('stocklink_user', JSON.stringify(authUser));
        localStorage.setItem('stocklink_token', authToken);

        return { success: true, user: authUser, token: authToken };
      }

      if (!res.isLiveBackend) {
        const fallbackUser = {
          id: `${registrationData.role === 'wholesaler' ? 'sup' : 'ret'}-${Date.now()}`,
          name: registrationData.fullName,
          businessName: registrationData.businessName,
          email: registrationData.email,
          phone: registrationData.phone,
          role: registrationData.role,
          city: registrationData.city || 'Mumbai',
          state: registrationData.state || 'Maharashtra'
        };

        setUser(fallbackUser);
        localStorage.setItem('stocklink_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser, isDemo: true };
      }

      return {
        success: false,
        error: res.error || 'Registration failed'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('stocklink_user');
      localStorage.removeItem('stocklink_token');
    } catch {}
  };

  const switchDemoRole = async (targetRole) => {
    if (VALID_ROLES.includes(targetRole) && DEMO_USERS[targetRole]) {
      const creds = DEMO_USERS[targetRole];
      // Attempt login with real seed credentials
      const res = await login(targetRole, creds.email, 'demo1234password');
      if (res.success) return res.user;

      // Fallback
      setUser(creds);
      localStorage.setItem('stocklink_user', JSON.stringify(creds));
      return creds;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && VALID_ROLES.includes(user?.role),
        role: user?.role || null,
        isLoadingAuth,
        isLiveBackend,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
