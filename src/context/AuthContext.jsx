import React, { createContext, useContext, useState, useEffect } from 'react';

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

/**
 * Validates the raw JSON string from localStorage.
 * Ensures the object has a valid role and required fields.
 * If invalid or tampered with, purges the storage key and returns null.
 */
function validateAndParseStoredUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.id === 'string' &&
      typeof parsed.role === 'string' &&
      VALID_ROLES.includes(parsed.role)
    ) {
      return parsed;
    }
  } catch (err) {
    console.warn('[StockLink RBAC] Corrupted session in localStorage. Clearing:', err);
  }

  // Purge invalid or tampered session
  try {
    localStorage.removeItem('stocklink_user');
  } catch {}
  return null;
}

export const AuthProvider = ({ children }) => {
  // Initialize user strictly from localStorage; if empty or invalid, user is NULL (unauthenticated)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('stocklink_user');
      return validateAndParseStoredUser(stored);
    } catch {
      return null;
    }
  });

  const [isDemoMode] = useState(true);

  // Sync state changes with localStorage
  useEffect(() => {
    if (user && VALID_ROLES.includes(user.role)) {
      try {
        localStorage.setItem('stocklink_user', JSON.stringify(user));
      } catch (err) {
        console.error('[StockLink RBAC] Failed to persist session:', err);
      }
    } else {
      try {
        localStorage.removeItem('stocklink_user');
      } catch {}
    }
  }, [user]);

  // Listen for external storage changes (e.g. manual edit in DevTools or across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'stocklink_user') {
        const validated = validateAndParseStoredUser(e.newValue);
        setUser(validated);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (role, email, password) => {
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role '${role}'. Role must be 'retailer' or 'wholesaler'.`);
    }

    const demoProfile = DEMO_USERS[role] || {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      businessName: `${email.split('@')[0]} Enterprises`,
      email,
      role
    };

    setUser(demoProfile);
    try {
      localStorage.setItem('stocklink_user', JSON.stringify(demoProfile));
    } catch {}
    return { success: true, user: demoProfile };
  };

  const register = (registrationData) => {
    if (!VALID_ROLES.includes(registrationData.role)) {
      throw new Error(`Invalid registration role '${registrationData.role}'.`);
    }

    const newUser = {
      id: `${registrationData.role === 'wholesaler' ? 'sup' : 'ret'}-${Date.now()}`,
      name: registrationData.fullName,
      businessName: registrationData.businessName,
      email: registrationData.email,
      phone: registrationData.phone,
      role: registrationData.role,
      city: registrationData.city || 'Mumbai',
      state: registrationData.state || 'Maharashtra',
      address: registrationData.address || '',
      gstin: registrationData.gstin || ''
    };

    setUser(newUser);
    try {
      localStorage.setItem('stocklink_user', JSON.stringify(newUser));
    } catch {}
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('stocklink_user');
    } catch {}
  };

  const switchDemoRole = (targetRole) => {
    if (VALID_ROLES.includes(targetRole) && DEMO_USERS[targetRole]) {
      const selected = DEMO_USERS[targetRole];
      setUser(selected);
      try {
        localStorage.setItem('stocklink_user', JSON.stringify(selected));
      } catch {}
      return selected;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && VALID_ROLES.includes(user?.role),
        role: user?.role || null,
        login,
        register,
        logout,
        switchDemoRole,
        isDemoMode
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
