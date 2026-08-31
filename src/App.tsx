import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AdvocatesSection } from './components/AdvocatesSection';
import { NewCriminalLawsSection } from './components/NewCriminalLawsSection';
import { LegalNoticeGeneratorSection } from './components/LegalNoticeGeneratorSection';
import { JoinAdvocatePartnerSection } from './components/JoinAdvocatePartnerSection';
import { ConstitutionSection } from './components/ConstitutionSection';
import { ServiceGrid } from './components/ServiceGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQAccordion } from './components/FAQAccordion';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { CallConsultationModal } from './components/CallConsultationModal';
import { StampDutyFeeCalculatorModal } from './components/StampDutyFeeCalculatorModal';
import { CheckoutModal } from './components/CheckoutModal';
import { LegalPolicyModal } from './components/LegalPolicyModal';
import { N8NTelephonyModal } from './components/N8NTelephonyModal';
import { N8NChatWidget } from './components/N8NChatWidget';
import { ToastContainer } from './components/Toast';
import { ServiceItem } from './types';
import { ADVOCATES_LIST } from './data/advocates';

const MainContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);
  const {
    selectedServiceForModal,
    setSelectedServiceForModal,
    selectedAdvocateForCall,
    setSelectedAdvocateForCall,
    isCallModalOpen,
    setIsCallModalOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    activePolicyModal,
    setActivePolicyModal,
    isN8NModalOpen,
    setIsN8NModalOpen,
    addToast,
    startCallWithAdvocate
  } = useCart();

  // Smooth scroll handler
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      const navHeight = 75;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home', 
        'advocates', 
        'new-criminal-laws', 
        'notice-generator', 
        'services', 
        'partner-join', 
        'constitution', 
        'why-us', 
        'how-it-works', 
        'about', 
        'faq', 
        'contact'
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950 font-sans">
      {/* Sticky Header Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenStampModal={() => setIsStampModalOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreServices={() => scrollToSection('services')}
          onExploreAdvocates={() => scrollToSection('advocates')}
          onWhyUsClick={() => scrollToSection('why-us')}
          onExploreBns={() => scrollToSection('new-criminal-laws')}
          onExploreNotices={() => scrollToSection('notice-generator')}
        />

        {/* Specialized Advocates Panel & On-Call Legal Counsel */}
        <AdvocatesSection />

        {/* 1. New Criminal Laws 2024-2026: BNS, BNSS & BSA Section Converter & Comparative Law Analyzer */}
        <NewCriminalLawsSection 
          onOpenCallModal={() => startCallWithAdvocate(ADVOCATES_LIST[0], 15)}
        />

        {/* 2. Instant Court-Ready Statutory Legal Notice & Draft Generator */}
        <LegalNoticeGeneratorSection
          onOpenCallModal={() => startCallWithAdvocate(ADVOCATES_LIST[0], 15)}
          onShowToast={(msg) => addToast(msg, 'success')}
        />

        {/* Services Marketplace Grid */}
        <ServiceGrid
          onViewDetails={(service: ServiceItem) =>
            setSelectedServiceForModal(service)
          }
        />

        {/* Advocate Business Partner Enrollment & Document Attachment Portal */}
        <JoinAdvocatePartnerSection />

        {/* Indian Constitution Rules & Legal Articles Reference Explorer */}
        <ConstitutionSection />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* How It Works (4-step Process) */}
        <HowItWorks
          onExploreServices={() => scrollToSection('services')}
        />

        {/* About Advocate */}
        <AboutSection />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* FAQ Accordion */}
        <FAQAccordion />

        {/* Contact & Chamber Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenPolicy={(policy) => setActivePolicyModal(policy)}
      />

      {/* Interactive Drawers, Modals & Floating Buttons */}
      <CartDrawer
        onExploreServices={() => scrollToSection('services')}
      />

      <ServiceDetailModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
      />

      <CallConsultationModal
        advocate={isCallModalOpen ? selectedAdvocateForCall : null}
        onClose={() => {
          setIsCallModalOpen(false);
          setSelectedAdvocateForCall(null);
        }}
      />

      <StampDutyFeeCalculatorModal
        isOpen={isStampModalOpen}
        onClose={() => setIsStampModalOpen(false)}
        onOpenCallModal={() => startCallWithAdvocate(ADVOCATES_LIST[0], 15)}
      />

      <CheckoutModal
        onClose={() => setIsCheckoutOpen(false)}
      />

      <LegalPolicyModal
        policyType={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
      />

      <N8NTelephonyModal
        isOpen={isN8NModalOpen}
        onClose={() => setIsN8NModalOpen(false)}
      />

      <N8NChatWidget />

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


