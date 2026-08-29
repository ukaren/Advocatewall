import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { N8NMainChatStation } from './components/N8NMainChatStation';
import { CallConsultationModal } from './components/CallConsultationModal';
import { N8NTelephonyModal } from './components/N8NTelephonyModal';
import { LegalPolicyModal } from './components/LegalPolicyModal';
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const {
    selectedAdvocateForCall,
    isCallModalOpen,
    setIsCallModalOpen,
    setSelectedAdvocateForCall,
    activePolicyModal,
    setActivePolicyModal,
    isN8NModalOpen,
    setIsN8NModalOpen
  } = useCart();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Modern Dedicated N8N Legal AI Chatbot Main Workstation */}
      <N8NMainChatStation />

      {/* Direct Advocate Call Consultation Modal (₹10/min) */}
      <CallConsultationModal
        advocate={isCallModalOpen ? selectedAdvocateForCall : null}
        onClose={() => {
          setIsCallModalOpen(false);
          setSelectedAdvocateForCall(null);
        }}
      />

      {/* Automated N8N Telephony Voice Call Webhook Modal */}
      <N8NTelephonyModal
        isOpen={isN8NModalOpen}
        onClose={() => setIsN8NModalOpen(false)}
      />

      {/* Legal & Privacy Policy Modal */}
      <LegalPolicyModal
        policyType={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
      />

      {/* Global Real-Time Feedback Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}


