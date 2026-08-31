import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, ServiceItem, AdvocateProfile } from '../types';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedServiceForModal: ServiceItem | null;
  setSelectedServiceForModal: (service: ServiceItem | null) => void;
  selectedAdvocateForCall: AdvocateProfile | null;
  setSelectedAdvocateForCall: (advocate: AdvocateProfile | null) => void;
  isCallModalOpen: boolean;
  setIsCallModalOpen: (open: boolean) => void;
  callDurationMinutes: number;
  setCallDurationMinutes: (minutes: number) => void;
  startCallWithAdvocate: (advocate: AdvocateProfile, minutes?: number) => void;
  activePolicyModal: string | null;
  setActivePolicyModal: (policy: string | null) => void;
  isN8NModalOpen: boolean;
  setIsN8NModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'advocat_walla_cart_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [selectedAdvocateForCall, setSelectedAdvocateForCall] = useState<AdvocateProfile | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callDurationMinutes, setCallDurationMinutes] = useState(15);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);
  const [isN8NModalOpen, setIsN8NModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const startCallWithAdvocate = (advocate: AdvocateProfile, minutes: number = 15) => {
    setSelectedAdvocateForCall(advocate);
    setCallDurationMinutes(minutes);
    setIsCallModalOpen(true);
  };

  const addToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
    addToast(`"${service.name}" added to enquiry cart.`);
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
    addToast('Item removed from cart.', 'info');
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.service.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast('Cart cleared.', 'info');
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce(
    (acc, curr) => acc + curr.service.price * curr.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedServiceForModal,
        setSelectedServiceForModal,
        selectedAdvocateForCall,
        setSelectedAdvocateForCall,
        isCallModalOpen,
        setIsCallModalOpen,
        callDurationMinutes,
        setCallDurationMinutes,
        startCallWithAdvocate,
        activePolicyModal,
        setActivePolicyModal,
        isN8NModalOpen,
        setIsN8NModalOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
