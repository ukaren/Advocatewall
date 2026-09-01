import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown, Compass } from 'lucide-react';

interface ScrollNavigationControlsProps {
  sectionIds?: string[];
}

export const ScrollNavigationControls: React.FC<ScrollNavigationControlsProps> = ({
  sectionIds = [
    'home',
    'advocates',
    'health-checkup',
    'emergency-rights',
    'ecourts-guide',
    'new-criminal-laws',
    'notice-generator',
    'payment-gateway',
    'services',
    'constitution',
    'partner-join',
    'why-us',
    'faq',
    'contact'
  ]
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? Math.min(100, Math.max(0, Math.round((currentScroll / totalScroll) * 100))) : 0;
      setScrollProgress(progress);

      // Determine active section based on scroll position
      const scrollMiddle = window.scrollY + window.innerHeight / 3;
      let activeIndex = 0;

      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollMiddle >= top && scrollMiddle < top + height) {
            activeIndex = i;
            break;
          } else if (scrollMiddle >= top) {
            activeIndex = i;
          }
        }
      }
      setCurrentSectionIndex(activeIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const scrollToPreviousOrTop = () => {
    if (window.scrollY < 200) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentSectionIndex > 0) {
      const prevId = sectionIds[currentSectionIndex - 1];
      const prevEl = document.getElementById(prevId);
      if (prevEl) {
        prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
  };

  const scrollToNextOrBottom = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= totalScroll - 100) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      return;
    }

    if (currentSectionIndex < sectionIds.length - 1) {
      const nextId = sectionIds[currentSectionIndex + 1];
      const nextEl = document.getElementById(nextId);
      if (nextEl) {
        nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div
      id="scroll-navigation-dock"
      className="fixed bottom-24 right-4 sm:right-6 z-40 flex flex-col items-center gap-1.5"
    >
      {/* Floating Pill Container */}
      <div className="flex flex-col items-center bg-slate-900/90 text-white p-1.5 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:bg-slate-900">
        {/* Scroll Up Button */}
        <button
          onClick={scrollToPreviousOrTop}
          onDoubleClick={scrollToTop}
          aria-label="Scroll Up"
          title="Scroll Up (Previous Section / Top)"
          className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-xs"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Scroll Progress Indicator & Quick Indicator */}
        <div
          onClick={scrollToTop}
          title={`Page scroll: ${scrollProgress}%. Click to jump to Top`}
          className="py-1 px-1.5 text-center cursor-pointer select-none group"
        >
          <span className="text-[10px] font-mono font-bold text-amber-400 block group-hover:text-amber-300">
            {scrollProgress}%
          </span>
          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-tighter block group-hover:text-white">
            {scrollProgress === 100 ? 'End' : scrollProgress === 0 ? 'Top' : 'Scroll'}
          </span>
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={scrollToNextOrBottom}
          onDoubleClick={scrollToBottom}
          aria-label="Scroll Down"
          title="Scroll Down (Next Section / Bottom)"
          className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-xs"
        >
          <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Floating Up/Down Indicator Label for Quick Clue on Hover */}
      <div className="hidden sm:block text-[9px] font-semibold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 backdrop-blur-xs">
        ↑ Up • Down ↓
      </div>
    </div>
  );
};
