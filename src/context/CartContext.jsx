import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('stocklink_cart');
      return stored ? JSON.parse(stored) : [
        // Seed initial items for immediate retailer exploration
        {
          productId: "prod-101",
          name: "A4 Paper Ream (75 GSM - 500 Sheets)",
          supplierId: "sup-001",
          supplierName: "Apex Paper & Mill Works",
          basePrice: 220,
          unitPrice: 220,
          quantity: 10,
          moq: 5,
          stock: 120,
          unit: "Ream",
          image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
          tiers: [
            { minQty: 5, maxQty: 25, price: 220 },
            { minQty: 26, maxQty: 75, price: 208 },
            { minQty: 76, maxQty: null, price: 196 }
          ]
        },
        {
          productId: "prod-106",
          name: "BOPP Brown Packaging Tape (2\" x 65m) - Pack of 6",
          supplierId: "sup-004",
          supplierName: "SwiftPack Solutions",
          basePrice: 240,
          unitPrice: 240,
          quantity: 8,
          moq: 5,
          stock: 220,
          unit: "Tube (6 Rolls)",
          image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
          tiers: [
            { minQty: 5, maxQty: 20, price: 240 },
            { minQty: 21, maxQty: 50, price: 220 },
            { minQty: 51, maxQty: null, price: 198 }
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('stocklink_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate dynamic price based on tiered pricing structure
  const getDynamicPrice = (product, quantity) => {
    if (!product.tiers || product.tiers.length === 0) return product.basePrice;
    for (const tier of product.tiers) {
      if (quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)) {
        return tier.price;
      }
    }
    return product.basePrice;
  };

  const addToCart = (product, quantityToAdd = null) => {
    const qty = quantityToAdd !== null ? quantityToAdd : (product.moq || 1);
    
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.productId === product.id || i.productId === product.productId);
      
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + qty;
        const finalPrice = getDynamicPrice(product, newQty);
        
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: finalPrice
        };
        return updated;
      } else {
        const finalPrice = getDynamicPrice(product, qty);
        return [
          ...prevItems,
          {
            productId: product.id || product.productId,
            name: product.name,
            supplierId: product.supplierId,
            supplierName: product.supplierName,
            basePrice: product.basePrice,
            unitPrice: finalPrice,
            quantity: Math.max(qty, product.moq || 1),
            moq: product.moq || 1,
            stock: product.stock,
            unit: product.unit || 'Unit',
            image: product.image,
            tiers: product.tiers || []
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.productId === productId) {
          const clampedQty = Math.min(newQuantity, item.stock || newQuantity);
          const dynamicPrice = getDynamicPrice(item, clampedQty);
          return {
            ...item,
            quantity: clampedQty,
            unitPrice: dynamicPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Group cart items by supplier
  const groupedBySupplier = cartItems.reduce((acc, item) => {
    const sId = item.supplierId;
    if (!acc[sId]) {
      acc[sId] = {
        supplierId: sId,
        supplierName: item.supplierName,
        items: [],
        subtotal: 0,
        hasMoqViolations: false
      };
    }
    acc[sId].items.push(item);
    acc[sId].subtotal += item.unitPrice * item.quantity;
    if (item.quantity < item.moq) {
      acc[sId].hasMoqViolations = true;
    }
    return acc;
  }, {});

  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalEstimatedCost = cartItems.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  const hasAnyMoqViolation = Object.values(groupedBySupplier).some(g => g.hasMoqViolations);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        groupedBySupplier,
        totalItemCount,
        totalEstimatedCost,
        hasAnyMoqViolation,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
