import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AdvocatesSection } from './components/AdvocatesSection';
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
import { CheckoutModal } from './components/CheckoutModal';
import { LegalPolicyModal } from './components/LegalPolicyModal';
import { N8NTelephonyModal } from './components/N8NTelephonyModal';
import { N8NChatWidget } from './components/N8NChatWidget';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/Toast';
import { ServiceItem } from './types';

const MainContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
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
      const sections = ['home', 'advocates', 'services', 'partner-join', 'constitution', 'why-us', 'how-it-works', 'about', 'faq', 'contact'];
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
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreServices={() => scrollToSection('services')}
          onExploreAdvocates={() => scrollToSection('advocates')}
          onWhyUsClick={() => scrollToSection('why-us')}
        />

        {/* Specialized Advocates Panel & On-Call Legal Counsel */}
        <AdvocatesSection />

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
      <FloatingWhatsApp />
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

