import React from 'react';
import { Scale, ShieldAlert, FileText, MessageSquare, Landmark, Feather } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

// Path to official uploaded brand logo image
const BRAND_LOGO_IMAGE = '/images/advocate-walla-logo.png';
const FALLBACK_LOGO_IMAGE = '/src/assets/images/advocate_walla_logo_1788187681550.jpg';

export interface AdvocateWallaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'glass';
  showSubtitle?: boolean;
  showDevnagriBadge?: boolean;
  useImageEmblem?: boolean;
  showFullImageBadge?: boolean;
  showPillarsBar?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AdvocateWallaLogo: React.FC<AdvocateWallaLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
  showDevnagriBadge = false,
  useImageEmblem = true,
  showFullImageBadge = false,
  showPillarsBar = false,
  className = '',
  onClick,
}) => {
  const isDark = variant === 'dark';

  // Dimension scaling
  const emblemSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const titleSizes = {
    xs: 'text-sm',
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const cursiveSizes = {
    xs: 'text-xs -mt-1',
    sm: 'text-sm sm:text-base -mt-1',
    md: 'text-base sm:text-lg -mt-1.5',
    lg: 'text-xl sm:text-2xl -mt-2',
    xl: 'text-2xl sm:text-3xl -mt-2.5',
  };

  const subSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px] sm:text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  };

  const Component = onClick ? 'button' : 'div';

  // Full Brand Showcase Card / Badge (Matches the exact layout of the uploaded image)
  if (showFullImageBadge) {
    return (
      <Component
        onClick={onClick}
        id="advocatewalla-full-brand-badge"
        className={`logo-container inline-block text-left group transition-all select-none ${
          onClick ? 'cursor-pointer hover:scale-101 focus:outline-none' : ''
        } ${className}`}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 bg-gradient-to-b from-slate-950 via-black to-slate-950 p-4 sm:p-6 text-center max-w-sm mx-auto">
          {/* Direct Brand Logo Image Preview */}
          <div className="relative mx-auto mb-3 max-w-[280px]">
            <img
              src={BRAND_LOGO_IMAGE}
              alt="Advocate Walla Brand Logo"
              className="advocate-walla-logo w-full h-auto object-contain rounded-xl shadow-md border border-amber-500/20"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src.includes('/images/advocate-walla-logo.png')) {
                  e.currentTarget.src = FALLBACK_LOGO_IMAGE;
                }
              }}
            />
          </div>

          {/* Optional Pillars & Slogan Bar */}
          {showPillarsBar && (
            <div className="mt-3 pt-3 border-t border-amber-500/30">
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="flex flex-col items-center">
                  <ShieldAlert className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-bold text-amber-200 uppercase tracking-tighter">Legal Advice</span>
                  <span className="text-[8px] text-amber-400/80 font-['Noto_Serif_Devanagari']">कानूनी सलाह</span>
                </div>
                <div className="flex flex-col items-center">
                  <FileText className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-bold text-amber-200 uppercase tracking-tighter">Document</span>
                  <span className="text-[8px] text-amber-400/80 font-['Noto_Serif_Devanagari']">दस्तावेज़ सहायता</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageSquare className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-bold text-amber-200 uppercase tracking-tighter">Case Guide</span>
                  <span className="text-[8px] text-amber-400/80 font-['Noto_Serif_Devanagari']">मार्गदर्शन</span>
                </div>
                <div className="flex flex-col items-center">
                  <Landmark className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-bold text-amber-200 uppercase tracking-tighter">Court Assist</span>
                  <span className="text-[8px] text-amber-400/80 font-['Noto_Serif_Devanagari']">कोर्ट सहायता</span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[8px] tracking-widest text-amber-300 font-semibold uppercase">
                <span>SIMPLE</span>
                <span className="text-amber-500">•</span>
                <span>TRUSTED</span>
                <span className="text-amber-500">•</span>
                <span>RIGHT GUIDANCE</span>
              </div>
            </div>
          )}
        </div>
      </Component>
    );
  }

  return (
    <Component
      onClick={onClick}
      id="advocatewalla-bilingual-logo"
      className={`logo-container inline-flex items-center gap-2.5 sm:gap-3 text-left group transition-all select-none ${
        onClick ? 'cursor-pointer focus:outline-none' : ''
      } ${className}`}
    >
      {/* Emblem / Seal Icon using uploaded brand graphic */}
      <div
        className={`relative ${emblemSizes[size]} rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-md border transition-transform duration-200 group-hover:scale-105 ${
          isDark
            ? 'bg-black border-amber-400/50 text-amber-400 ring-1 ring-amber-500/20'
            : 'bg-slate-950 border-amber-500/50 text-amber-400 ring-1 ring-amber-600/30'
        }`}
      >
        {useImageEmblem ? (
          <img
            src={BRAND_LOGO_IMAGE}
            alt="Advocate Walla Logo"
            className="advocate-walla-logo w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (e.currentTarget.src.includes('/images/advocate-walla-logo.png')) {
                e.currentTarget.src = FALLBACK_LOGO_IMAGE;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-slate-950 text-amber-400 p-1">
            <Scale className="w-5 h-5 text-amber-400 drop-shadow-md" />
          </div>
        )}

        {/* Subtle glowing golden border accent */}
        <div className="absolute inset-0 rounded-xl border border-amber-400/30 pointer-events-none" />
      </div>

      {/* Exact Brand Typography Lockup matching the Image */}
      <div className="flex flex-col justify-center min-w-0">
        {/* Main Line: "Advo" with lawyer neckband + "केट" in 3D Gold */}
        <div className="flex items-baseline leading-none tracking-normal">
          {/* "Advo" (White / Silver with Advocate White Neckband on 'A') */}
          <div className="relative inline-flex items-baseline font-black font-['Cinzel','Playfair_Display',serif]">
            {/* The 'A' with lawyer band */}
            <span
              className={`relative font-black tracking-tight ${titleSizes[size]} ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              A
              {/* Lawyer's white neckband / advocate collar tabs attached to A */}
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-[1px] pointer-events-none">
                <span className="w-[1.5px] sm:w-[2px] h-2 sm:h-2.5 bg-white border-[0.5px] border-slate-400/40 rounded-b-xs shadow-xs" />
                <span className="w-[1.5px] sm:w-[2px] h-2 sm:h-2.5 bg-white border-[0.5px] border-slate-400/40 rounded-b-xs shadow-xs" />
              </span>
            </span>

            {/* "dvo" */}
            <span
              className={`font-black tracking-tight ${titleSizes[size]} ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              dvo
            </span>
          </div>

          {/* "केट" in Rich 3D Golden Devanagari Typography */}
          <span
            className={`font-black font-['Noto_Serif_Devanagari','Rozha_One',serif] ${titleSizes[size]} ml-0.5 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 drop-shadow-[0_1px_2px_rgba(217,119,6,0.3)]`}
            style={{ fontFamily: "'Noto Serif Devanagari', 'Rozha One', serif" }}
          >
            केट
          </span>
        </div>

        {/* Cursive "Walla" in Calligraphy Script with Swoosh */}
        <div className="flex items-center">
          <span
            className={`font-['Great_Vibes','Alex_Brush',cursive] font-bold ${cursiveSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-wide drop-shadow-xs`}
            style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
          >
            Walla
          </span>
          <div className="h-[1px] flex-1 ml-1 bg-gradient-to-r from-amber-400/60 to-transparent self-center -mt-1 hidden sm:block" />
        </div>

        {/* Subtitle / Slogan Line: "— • कानूनी सलाह, सही समाधान • —" */}
        {showSubtitle && (
          <div className="flex items-center gap-1 leading-tight mt-0.5 whitespace-nowrap">
            <span className="text-amber-500 text-[9px] font-bold">•</span>
            <span
              className={`font-semibold font-['Noto_Serif_Devanagari'] ${subSizes[size]} ${
                isDark ? 'text-amber-300/90' : 'text-amber-700'
              }`}
            >
              कानूनी सलाह, सही समाधान
            </span>
            <span className="text-amber-500 text-[9px] font-bold">•</span>
          </div>
        )}
      </div>
    </Component>
  );
};

