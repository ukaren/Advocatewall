import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WalletAccount, WalletTransaction, WalletCategory } from '../types';

interface WalletContextType {
  account: WalletAccount;
  balance: number;
  transactions: WalletTransaction[];
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  openWalletWithTopup: (amount?: number) => void;
  targetTopupAmount: number;
  setTargetTopupAmount: (amount: number) => void;
  topupWallet: (
    amount: number,
    method: 'razorpay' | 'upi' | 'bank_transfer',
    referenceId?: string
  ) => { success: boolean; message: string; transactionId: string };
  deductWallet: (
    amount: number,
    description: string,
    category: WalletCategory,
    details?: {
      advocateName?: string;
      durationMinutes?: number;
      referenceId?: string;
    }
  ) => { success: boolean; message: string; transactionId?: string };
  hasSufficientBalance: (amount: number) => boolean;
  updateHolderInfo: (name: string, phone: string) => void;
  resetWalletToDefault: () => void;
}

const WALLET_STORAGE_KEY = 'advocat_walla_wallet_v2';

const createDefaultAccount = (): WalletAccount => {
  const initialTransaction: WalletTransaction = {
    id: `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}`,
    type: 'credit',
    amount: 150,
    description: 'Welcome Legal Consultation Credit (15 Min Free Calling Allowance)',
    category: 'welcome_bonus',
    timestamp: new Date().toISOString(),
    referenceId: 'BONUS-AW-2026',
    paymentMethod: 'promotional',
    status: 'completed',
  };

  return {
    walletId: `AW-WAL-${Math.floor(100000 + Math.random() * 900000)}`,
    holderName: 'Valued Citizen Client',
    holderPhone: '+91 98765 43210',
    balance: 150,
    currency: 'INR',
    createdAt: new Date().toISOString(),
    status: 'active',
    totalCredited: 150,
    totalDebited: 0,
    transactions: [initialTransaction],
  };
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<WalletAccount>(() => {
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.balance === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load wallet from localStorage:', e);
    }
    return createDefaultAccount();
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [targetTopupAmount, setTargetTopupAmount] = useState(300);

  // Persist wallet state
  useEffect(() => {
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(account));
    } catch (e) {
      console.warn('Could not save wallet state:', e);
    }
  }, [account]);

  const openWalletWithTopup = (amount: number = 300) => {
    setTargetTopupAmount(amount);
    setIsWalletModalOpen(true);
  };

  const hasSufficientBalance = (amount: number): boolean => {
    return account.balance >= amount;
  };

  const topupWallet = (
    amount: number,
    method: 'razorpay' | 'upi' | 'bank_transfer',
    referenceId?: string
  ): { success: boolean; message: string; transactionId: string } => {
    if (amount <= 0) {
      return {
        success: false,
        message: 'Top-up amount must be greater than ₹0.',
        transactionId: '',
      };
    }

    const txId = `TXN-TOP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: WalletTransaction = {
      id: txId,
      type: 'credit',
      amount,
      description: `Wallet Recharge via ${
        method === 'razorpay' ? 'Razorpay Gateway' : method === 'upi' ? 'Direct UPI' : 'Bank Transfer'
      }`,
      category: method === 'razorpay' ? 'topup_razorpay' : method === 'upi' ? 'topup_upi' : 'topup_bank',
      timestamp: new Date().toISOString(),
      referenceId: referenceId || `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentMethod: method,
      status: 'completed',
    };

    setAccount((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      totalCredited: prev.totalCredited + amount,
      transactions: [newTx, ...prev.transactions],
    }));

    return {
      success: true,
      message: `₹${amount.toLocaleString('en-IN')} added to your Legal Wallet successfully!`,
      transactionId: txId,
    };
  };

  const deductWallet = (
    amount: number,
    description: string,
    category: WalletCategory,
    details?: {
      advocateName?: string;
      durationMinutes?: number;
      referenceId?: string;
    }
  ): { success: boolean; message: string; transactionId?: string } => {
    if (account.balance < amount) {
      return {
        success: false,
        message: `Insufficient wallet balance. Required: ₹${amount}, Available: ₹${account.balance}.`,
      };
    }

    const txId = `TXN-DEB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: WalletTransaction = {
      id: txId,
      type: 'debit',
      amount,
      description,
      category,
      timestamp: new Date().toISOString(),
      referenceId: details?.referenceId || `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: 'wallet_balance',
      status: 'completed',
      advocateName: details?.advocateName,
      durationMinutes: details?.durationMinutes,
    };

    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      totalDebited: prev.totalDebited + amount,
      transactions: [newTx, ...prev.transactions],
    }));

    return {
      success: true,
      message: `₹${amount.toLocaleString('en-IN')} debited from your Legal Wallet.`,
      transactionId: txId,
    };
  };

  const updateHolderInfo = (name: string, phone: string) => {
    setAccount((prev) => ({
      ...prev,
      holderName: name || prev.holderName,
      holderPhone: phone || prev.holderPhone,
    }));
  };

  const resetWalletToDefault = () => {
    const defaultAcc = createDefaultAccount();
    setAccount(defaultAcc);
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(defaultAcc));
    } catch {
      // ignore
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        balance: account.balance,
        transactions: account.transactions,
        isWalletModalOpen,
        setIsWalletModalOpen,
        openWalletWithTopup,
        targetTopupAmount,
        setTargetTopupAmount,
        topupWallet,
        deductWallet,
        hasSufficientBalance,
        updateHolderInfo,
        resetWalletToDefault,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
