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
  PRODUCTS: 'stocklink_products',
  ORDERS: 'stocklink_orders',
  SUPPLIERS: 'stocklink_suppliers'
};

// Initialize localStorage with initial mock datasets if not present
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
 * Helper to attempt backend fetch with transparent fallback to demo data
 */
async function apiFetch(endpoint, options = {}, fallbackFn) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s quick timeout for local API discovery

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { success: true, data, isLiveBackend: true };
    }
    
    // Non-200 response from live server
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || `API error ${res.status}`);
  } catch (error) {
    // If backend is not running or failed, gracefully fall back to local demo store
    if (fallbackFn) {
      const demoResult = await fallbackFn();
      return {
        success: true,
        data: demoResult,
        isLiveBackend: false,
        fallbackNotice: `Using local demo data (${error.message || 'backend unreachable'})`
      };
    }
    return {
      success: false,
      error: error.message || 'Unknown network error',
      isLiveBackend: false
    };
  }
}

export const api = {
  // PRODUCTS
  async getProducts(params = {}) {
    return apiFetch('/products', { method: 'GET' }, async () => {
      let products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query) ||
          p.supplierName.toLowerCase().includes(query)
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
      const product = products.find(p => p.id === id);
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
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found to update');
      products[index] = { ...products[index], ...updateData };
      saveStoredData(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    });
  },

  async deleteProduct(id) {
    return apiFetch(`/products/${id}`, { method: 'DELETE' }, async () => {
      let products = getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      products = products.filter(p => p.id !== id);
      saveStoredData(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, deletedId: id };
    });
  },

  // SUPPLIERS
  async getSuppliers(params = {}) {
    return apiFetch('/suppliers', { method: 'GET' }, async () => {
      let suppliers = getStoredData(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
      if (params.search) {
        const query = params.search.toLowerCase();
        suppliers = suppliers.filter(s => 
          s.name.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query) ||
          s.categories.some(c => c.toLowerCase().includes(query))
        );
      }
      if (params.category && params.category !== 'All') {
        suppliers = suppliers.filter(s => s.categories.includes(params.category));
      }
      return suppliers;
    });
  },

  async getSupplierById(id) {
    return apiFetch(`/suppliers/${id}`, { method: 'GET' }, async () => {
      const suppliers = getStoredData(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
      const supplier = suppliers.find(s => s.id === id);
      if (!supplier) throw new Error('Supplier not found');
      return supplier;
    });
  },

  // PRICE DISCOVERY
  async getPriceComparisonGroups() {
    return apiFetch('/price-discovery/groups', { method: 'GET' }, async () => {
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

  // ORDERS
  async getOrders(filter = {}) {
    return apiFetch('/orders', { method: 'GET' }, async () => {
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

  async updateOrderStatus(orderId, status) {
    return apiFetch(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }, async () => {
      const orders = getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const order = orders.find(o => o.id === orderId);
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
    return apiFetch(`/suppliers/${supplierId}/metrics`, { method: 'GET' }, async () => {
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
