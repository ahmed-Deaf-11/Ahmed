import React from 'react';
import { Globe, Video, BookOpen, PenTool, Sparkles, VolumeX, Eye, Sliders, User, LogIn } from 'lucide-react';
import { AccessibilitySettings, UserProfile } from '../types.ts';

interface TopBarProps {
  activeTab: 'roulette' | 'dictionary' | 'community' | 'room';
  setActiveTab: (tab: 'roulette' | 'dictionary' | 'community' | 'room') => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onNextSigner: () => void;
  isSearching: boolean;
  onOpenAccessibility: () => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAuth: (mode?: 'register' | 'login') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  setSettings,
  onNextSigner,
  isSearching,
  onOpenAccessibility,
  userProfile,
  onOpenProfile,
  onOpenAuth,
}) => {
  const isAr = settings.language === 'ar';

  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href="#roulette"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('roulette');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
            11
          </span>
          <span className="font-extrabold">Deaf-11-ASL</span>
        </a>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          <VolumeX className="w-3 h-3 text-amber-400" />
          <span>{isAr ? 'مرئي 100% بدون صوت' : '100% Visual · Sound-Free'}</span>
        </span>
      </div>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('roulette')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'roulette' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : 'hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{isAr ? 'روليت الفيديو الإشاري' : 'Sign Roulette'}</span>
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'dictionary' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : 'hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'قاموس الإشارات والأبجدية' : 'Sign Dictionary'}</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'community' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : 'hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'مجتمع Deaf-11' : 'Deaf-11 Network'}</span>
        </button>

        <button
          onClick={() => setActiveTab('room')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'room' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : 'hover:text-white'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>{isAr ? 'غرفة الإشارة المباشرة' : 'Direct Sign Room'}</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action + compact accessibility toggles */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Sign In Trigger Button */}
        <button
          onClick={() => onOpenAuth('login')}
          className={`min-h-[44px] px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border ${
            settings.ultraHighContrast
              ? 'bg-black text-white border-white hover:bg-white hover:text-black'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800 hover:border-slate-700'
          }`}
          title={isAr ? 'تسجيل الدخول' : 'Sign In'}
        >
          <LogIn className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
        </button>

        {/* Registration / Create Account Modal Trigger */}
        <button
          onClick={() => onOpenAuth('register')}
          className={`min-h-[44px] px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border ${
            settings.ultraHighContrast
              ? 'bg-black text-white border-white hover:bg-white hover:text-black'
              : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border-amber-400/30'
          }`}
          title={isAr ? 'إنشاء حساب جديد' : 'Create Account'}
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isAr ? 'إنشاء حساب' : 'Register'}</span>
        </button>

        {/* User Profile & 18+ Verification Trigger */}
        <button
          onClick={onOpenProfile}
          className={`min-h-[44px] px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border ${
            settings.ultraHighContrast
              ? 'bg-black text-white border-white hover:bg-white hover:text-black'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
          }`}
          title={isAr ? 'ملف المشترك والتحقق من العمر (18+)' : 'Profile & Age Verification (18+)'}
        >
          <span className="text-base">{userProfile.gender === 'female' ? '👩' : '👨'}</span>
          <span className="max-w-[80px] truncate hidden sm:inline">{userProfile.name}</span>
          <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-mono">18+</span>
        </button>

        {/* Accessibility Settings Trigger */}
        <button
          onClick={onOpenAccessibility}
          className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1"
          title={isAr ? 'إعدادات إمكانية الوصول والرؤية' : 'Vision & Accessibility Settings'}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">{isAr ? 'الوصول' : 'Access'}</span>
        </button>

        {/* Language switcher */}
        <button
          onClick={() => {
            const nextLang = settings.language === 'ar' ? 'en' : 'ar';
            setSettings((prev) => ({ ...prev, language: nextLang }));
            document.documentElement.lang = nextLang;
            document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
          }}
          className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1"
          title={isAr ? 'تبديل اللغة' : 'Switch Language'}
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{settings.language.toUpperCase()}</span>
        </button>

        {/* Primary CTA */}
        <button
          onClick={onNextSigner}
          disabled={isSearching}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-transform flex items-center gap-1.5 shadow-md shadow-amber-500/10 whitespace-nowrap shrink-0 disabled:opacity-50"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <span>{isSearching ? (isAr ? 'جاري البحث...' : 'Finding...') : (isAr ? 'الشريك التالي' : 'Next Signer')}</span>
        </button>
      </div>
    </header>
  );
};
