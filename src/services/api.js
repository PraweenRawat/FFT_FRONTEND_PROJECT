import { 
  INITIAL_PRODUCTS, 
  INITIAL_SUPPLIERS, 
  INITIAL_ORDERS, 
  WHOLESALER_METRICS, 
  COMPARISON_PRODUCTS 
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Local storage keys for persistent demo interaction
const STORAGE_KEYS = {
  TOKEN: 'stocklink_token',
  USER: 'stocklink_user',
  PRODUCTS: 'stocklink_products',
  ORDERS: 'stocklink_orders',
  SUPPLIERS: 'stocklink_suppliers'
};

const getAuthToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
};

const getStoredData = (key, defaultData) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage, using fallback:`, err);
    return defaultData;
  }
};

const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

/**
 * Shared HTTP request helper with token injection, timeout, and strict error propagation.
 * IMPORTANT: Real backend HTTP errors (400, 401, 403, 404, 500) remain errors.
 * Mock fallback is engaged ONLY when the server cannot be reached on the network.
 */
async function apiFetch(endpoint, options = {}, fallbackFn = null) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
  } catch (networkError) {
    clearTimeout(timeoutId);

    // Network offline / backend unreachable -> Engage demo fallback if provided
    if (fallbackFn) {
      try {
        const demoResult = await fallbackFn();
        return {
          success: true,
          data: demoResult,
          isLiveBackend: false,
          isDemoMode: true,
          fallbackNotice: 'Operating in offline client demo mode (Backend unreachable)'
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: fallbackError.message,
          isLiveBackend: false
        };
      }
    }

    return {
      success: false,
      error: `Network error: Could not reach backend server at ${API_BASE_URL}. (${networkError.message})`,
      isLiveBackend: false
    };
  }

  clearTimeout(timeoutId);

  // Parse response
  let responseData;
  try {
    responseData = await response.json();
  } catch {
    responseData = { message: response.statusText };
  }

  // 1. Success HTTP status
  if (response.ok) {
    return {
      success: true,
      data: responseData,
      isLiveBackend: true,
      status: response.status
    };
  }

  // 2. HTTP Error (400, 401, 403, 404, 409, 500) -> NEVER convert to fallback!
  const errorMessage = responseData?.message || responseData?.error || `API error ${response.status}: ${response.statusText}`;
  return {
    success: false,
    status: response.status,
    error: errorMessage,
    data: responseData,
    isLiveBackend: true
  };
}

export const api = {
  // SYSTEM HEALTH
  async getHealth() {
    return apiFetch('/health', { method: 'GET' });
  },

  // AUTHENTICATION
  async login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(registrationData) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    });
  },

  async getMe() {
    return apiFetch('/auth/me', { method: 'GET' });
  },

  // PRODUCTS
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('search', params.search);
    if (params.category && params.category !== 'All') queryParams.set('category', params.category);
    if (params.supplierId) queryParams.set('supplierId', params.supplierId);
    if (params.lowStockOnly) queryParams.set('lowStockOnly', 'true');
    if (params.sort) queryParams.set('sort', params.sort);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return apiFetch(`/products${queryString}`, { method: 'GET' }, async () => {
      let products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query) ||
          (p.supplierName && p.supplierName.toLowerCase().includes(query))
        );
      }
      
      if (params.category && params.category !== 'All') {
        products = products.filter(p => p.category === params.category);
      }
      
      if (params.supplierId) {
        products = products.filter(p => p.supplierId === params.supplierId);
      }
      
      if (params.lowStockOnly) {
        products = products.filter(p => p.stock <= 10);
      }

      if (params.sort === 'price-asc') {
        products.sort((a, b) => a.basePrice - b.basePrice);
      } else if (params.sort === 'price-desc') {
        products.sort((a, b) => b.basePrice - a.basePrice);
      } else if (params.sort === 'stock-desc') {
        products.sort((a, b) => b.stock - a.stock);
      }

      return products;
    });
  },

  async getProductById(id) {
    return apiFetch(`/products/${id}`, { method: 'GET' }, async () => {
      const products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const product = products.find(p => p.id === id || p._id === id);
      if (!product) throw new Error(`Product with ID "${id}" not found`);
      return product;
    });
  },

  async createProduct(productData) {
    return apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }, async () => {
      const products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const newProduct = {
        ...productData,
        id: `prod-${Date.now()}`,
        sku: productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      };
      products.unshift(newProduct);
      saveStoredData(STORAGE_KEYS.PRODUCTS, products);
      return newProduct;
    });
  },

  async updateProduct(id, updateData) {
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }, async () => {
      const products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const index = products.findIndex(p => p.id === id || p._id === id);
      if (index === -1) throw new Error('Product not found to update');
      products[index] = { ...products[index], ...updateData };
      saveStoredData(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    });
  },

  async deleteProduct(id) {
    return apiFetch(`/products/${id}`, { method: 'DELETE' }, async () => {
      let products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      products = products.filter(p => p.id !== id && p._id !== id);
      saveStoredData(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, deletedId: id };
    });
  },

  // SUPPLIERS
  async getSuppliers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('search', params.search);
    if (params.category && params.category !== 'All') queryParams.set('category', params.category);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return apiFetch(`/suppliers${queryString}`, { method: 'GET' }, async () => {
      let suppliers = getStoredData(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
      if (params.search) {
        const query = params.search.toLowerCase();
        suppliers = suppliers.filter(s => 
          s.name.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query) ||
          s.categories?.some(c => c.toLowerCase().includes(query))
        );
      }
      if (params.category && params.category !== 'All') {
        suppliers = suppliers.filter(s => s.categories?.includes(params.category));
      }
      return suppliers;
    });
  },

  async getSupplierById(id) {
    return apiFetch(`/suppliers/${id}`, { method: 'GET' }, async () => {
      const suppliers = getStoredData(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
      const supplier = suppliers.find(s => s.id === id || s._id === id);
      if (!supplier) throw new Error('Supplier not found');
      return supplier;
    });
  },

  // PRICE DISCOVERY
  async getPriceComparisonGroups(quantity = 20) {
    return apiFetch(`/price-discovery/groups?quantity=${quantity}`, { method: 'GET' }, async () => {
      const products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return COMPARISON_PRODUCTS.map(group => {
        const groupProducts = products.filter(p => group.productIds.includes(p.id));
        return {
          ...group,
          products: groupProducts
        };
      });
    });
  },

  // ORDERS & CHECKOUT
  async checkout(checkoutPayload) {
    return apiFetch('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutPayload)
    }, async () => {
      // In-memory offline fallback
      const orders = getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const newOrder = {
        id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        retailerName: 'Demo Retailer Store',
        items: checkoutPayload.items,
        totalAmount: 12000,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };
      orders.unshift(newOrder);
      saveStoredData(STORAGE_KEYS.ORDERS, orders);
      return { success: true, orders: [newOrder] };
    });
  },

  async getOrders(filter = {}) {
    const queryParams = new URLSearchParams();
    if (filter.status && filter.status !== 'All') queryParams.set('status', filter.status);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return apiFetch(`/orders${queryString}`, { method: 'GET' }, async () => {
      let orders = getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      if (filter.supplierId) {
        orders = orders.filter(o => o.supplierId === filter.supplierId);
      }
      if (filter.retailerId) {
        orders = orders.filter(o => o.retailerId === filter.retailerId);
      }
      if (filter.status && filter.status !== 'All') {
        orders = orders.filter(o => o.status === filter.status);
      }
      return orders;
    });
  },

  async createOrder(orderData) {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, async () => {
      const orders = getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const newOrder = {
        ...orderData,
        id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        paymentStatus: orderData.paymentMethod || 'Awaiting Confirmation'
      };
      orders.unshift(newOrder);
      saveStoredData(STORAGE_KEYS.ORDERS, orders);
      return newOrder;
    });
  },

  async updateOrderStatus(orderId, status, note = '') {
    return apiFetch(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note })
    }, async () => {
      const orders = getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        order.status = status;
        saveStoredData(STORAGE_KEYS.ORDERS, orders);
        return order;
      }
      throw new Error('Order not found');
    });
  },

  // WHOLESALER METRICS
  async getWholesalerMetrics(supplierId = 'sup-001') {
    const endpoint = supplierId ? `/suppliers/${supplierId}/metrics` : '/suppliers/metrics';
    return apiFetch(endpoint, { method: 'GET' }, async () => {
      const products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS).filter(p => p.supplierId === supplierId);
      const orders = getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS).filter(o => o.supplierId === supplierId);

      const totalInventoryUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
      const lowStockAlertsCount = products.filter(p => Number(p.stock) <= 10).length;

      return {
        ...WHOLESALER_METRICS,
        totalProductsCount: products.length || WHOLESALER_METRICS.totalProductsCount,
        totalInventoryUnits: totalInventoryUnits || WHOLESALER_METRICS.totalInventoryUnits,
        lowStockAlertsCount: lowStockAlertsCount,
        pendingOrdersCount: orders.filter(o => o.status === 'Pending').length
      };
    });
  }
};
