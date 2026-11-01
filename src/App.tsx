/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  SignerProfile,
  AccessibilitySettings,
  VisualReaction,
  FloatingReaction,
  SignDialect,
  SignItem,
  UserProfile,
} from './types.ts';
import { SIGNERS_ROSTER, VISUAL_REACTIONS } from './data/signData.ts';
import { TopBar } from './components/TopBar.tsx';
import { VideoRouletteStream } from './components/VideoRouletteStream.tsx';
import { TouchReactionHUD } from './components/TouchReactionHUD.tsx';
import { SignDictionaryModal } from './components/SignDictionaryModal.tsx';
import { DirectSignRoom } from './components/DirectSignRoom.tsx';
import { CommunitySection } from './components/CommunitySection.tsx';
import { AccessibilityModal } from './components/AccessibilityModal.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { RegistrationAuthModal } from './components/RegistrationAuthModal.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'roulette' | 'dictionary' | 'community' | 'room'>('roulette');
  const [selectedDialect, setSelectedDialect] = useState<SignDialect>('all');
  const [currentSignerIndex, setCurrentSignerIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pinnedSigners, setPinnedSigners] = useState<string[]>(['signer-mariam']);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login' | 'forgot_password'>('register');
  const [activeSignDemo, setActiveSignDemo] = useState<SignItem | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [showStrobe, setShowStrobe] = useState<boolean>(false);

  // User profile & 18+ verification state (18 عام)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'أحمد',
    lastName: 'السمعان',
    name: 'أحمد السمعان',
    birthDate: '2008-11-01',
    age: 18,
    gender: 'male',
    phoneCountryCode: '+20',
    phoneCountryFlag: '🇪🇬',
    phoneNumber: '01095956350',
    governorate: 'القاهرة',
    address: 'المعادي، القاهرة',
    email: 'ahmed01095956350@gmail.com',
    matchGenderPreference: 'all',
    is18PlusConfirmed: true,
    isPhoneVerified: true,
    isRegistered: true,
  });

  // Accessible deaf-first settings
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    ultraHighContrast: false,
    handEnhance: true,
    visualStrobeAlert: true,
    haptics: true,
    mirrorCamera: true,
    handGuidelines: true,
    largeTouchTargets: true,
    language: 'ar',
  });

  // Sync ultraHighContrast class to document element for global theme override
  useEffect(() => {
    if (settings.ultraHighContrast) {
      document.documentElement.classList.add('ultra-bw-mode');
    } else {
      document.documentElement.classList.remove('ultra-bw-mode');
    }
  }, [settings.ultraHighContrast]);

  const isAr = settings.language === 'ar';

  // Filtered signers based on dialect and gender preference
  const filteredSigners = SIGNERS_ROSTER.filter((s) => {
    const matchesDialect = selectedDialect === 'all' || s.dialect === selectedDialect;
    const matchesGender =
      userProfile.matchGenderPreference === 'all' || s.gender === userProfile.matchGenderPreference;
    return matchesDialect && matchesGender;
  });

  const safeIndex = currentSignerIndex % (filteredSigners.length || 1);
  const currentSigner = filteredSigners[safeIndex] || SIGNERS_ROSTER[0];

  // Next Signer Roulette Action
  const handleNextSigner = useCallback(() => {
    setIsSearching(true);
    // Deaf haptic pulse
    if (settings.haptics && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }

    // Trigger visual connection strobe
    setShowStrobe(true);
    setTimeout(() => setShowStrobe(false), 900);

    setTimeout(() => {
      setCurrentSignerIndex((prev) => (prev + 1) % (filteredSigners.length || 1));
      setIsSearching(false);
    }, 700);
  }, [filteredSigners.length, settings.haptics]);

  // Handle reaction trigger
  const handleTriggerReaction = useCallback(
    (reaction: VisualReaction) => {
      // Haptic feedback for tactile communication
      if (settings.haptics && typeof navigator !== 'undefined' && navigator.vibrate) {
        if (reaction.isDeafApplause) {
          navigator.vibrate([80, 40, 80, 40, 120]);
        } else {
          navigator.vibrate([60, 30, 60]);
        }
      }

      // Brief visual strobe border
      if (settings.visualStrobeAlert) {
        setShowStrobe(true);
        setTimeout(() => setShowStrobe(false), 600);
      }

      // Spawn floating visual items across screen
      const count = reaction.isDeafApplause ? 4 : 2;
      const newItems: FloatingReaction[] = Array.from({ length: count }).map((_, idx) => ({
        id: `${reaction.id}-${Date.now()}-${idx}`,
        symbol: reaction.symbol,
        label: isAr ? reaction.labelAr : reaction.labelEn,
        x: 25 + Math.random() * 50,
        y: 30 + Math.random() * 40,
        scale: 0.9 + Math.random() * 0.4,
        isDeafApplause: reaction.isDeafApplause,
      }));

      setFloatingReactions((prev) => [...prev, ...newItems]);

      // Remove after animation finishes
      setTimeout(() => {
        setFloatingReactions((prev) =>
          prev.filter((item) => !newItems.some((n) => n.id === item.id))
        );
      }, 2000);
    },
    [isAr, settings.haptics, settings.visualStrobeAlert]
  );

  const handleTogglePinSigner = (signerId: string) => {
    setPinnedSigners((prev) =>
      prev.includes(signerId) ? prev.filter((id) => id !== signerId) : [...prev, signerId]
    );
  };

  const handleStartChatWithSigner = (signer: SignerProfile) => {
    const idx = filteredSigners.findIndex((s) => s.id === signer.id);
    if (idx !== -1) {
      setCurrentSignerIndex(idx);
    } else {
      setSelectedDialect('all');
      const allIdx = SIGNERS_ROSTER.findIndex((s) => s.id === signer.id);
      setCurrentSignerIndex(allIdx !== -1 ? allIdx : 0);
    }
    setActiveTab('roulette');
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 ${
        settings.ultraHighContrast ? 'ultra-bw-mode' : ''
      }`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Universal Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        setSettings={setSettings}
        onNextSigner={handleNextSigner}
        isSearching={isSearching}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'register');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full">
        {activeTab === 'roulette' && (
          <div className="flex-1 flex flex-col">
            <VideoRouletteStream
              currentSigner={currentSigner}
              isSearching={isSearching}
              onNextSigner={handleNextSigner}
              selectedDialect={selectedDialect}
              onSelectDialect={setSelectedDialect}
              settings={settings}
              setSettings={setSettings}
              floatingReactions={floatingReactions}
              showStrobe={showStrobe}
              onOpenDictionary={() => setIsDictionaryOpen(true)}
              pinnedSigners={pinnedSigners}
              onTogglePinSigner={handleTogglePinSigner}
              activeSignDemo={activeSignDemo}
              onClearSignDemo={() => setActiveSignDemo(null)}
            />

            {/* Tactile Visual Reaction HUD (Bottom thumb zone) */}
            <TouchReactionHUD
              reactions={VISUAL_REACTIONS}
              onTriggerReaction={handleTriggerReaction}
              language={settings.language}
              ultraHighContrast={settings.ultraHighContrast}
            />
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className="flex-1 p-4 sm:p-6">
            <SignDictionaryModal
              isOpen={true}
              onClose={() => setActiveTab('roulette')}
              onSelectSignForDemo={(sign) => {
                setActiveSignDemo(sign);
                setActiveTab('roulette');
              }}
              language={settings.language}
            />
          </div>
        )}

        {activeTab === 'room' && (
          <DirectSignRoom
            settings={settings}
            onEnterRoulette={() => setActiveTab('roulette')}
          />
        )}

        {activeTab === 'community' && (
          <CommunitySection
            settings={settings}
            pinnedSignerIds={pinnedSigners}
            onStartChatWithSigner={handleStartChatWithSigner}
          />
        )}
      </main>

      {/* Accessible Sign Dictionary Floating Drawer/Modal */}
      {isDictionaryOpen && activeTab !== 'dictionary' && (
        <SignDictionaryModal
          isOpen={isDictionaryOpen}
          onClose={() => setIsDictionaryOpen(false)}
          onSelectSignForDemo={(sign) => {
            setActiveSignDemo(sign);
            setIsDictionaryOpen(false);
          }}
          language={settings.language}
        />
      )}

      {/* Accessibility & Vision Settings Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      {/* User Profile & 18+ Verification Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        settings={settings}
      />

      {/* Registration & Auth (Create Account / OTP / Login) Modal */}
      <RegistrationAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        settings={settings}
        setSettings={setSettings}
        initialMode={authModalMode}
      />

      {/* Footer */}
      <footer
        className={`border-t px-6 py-4 text-xs flex flex-col md:flex-row items-center justify-between gap-4 ${
          settings.ultraHighContrast
            ? 'border-white bg-black text-white'
            : 'border-slate-900 bg-slate-950 text-slate-400'
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-extrabold text-white">Ahmed Deaf 11</span>
          <span aria-hidden="true">·</span>
          <span>Deaf-11-ASL.com</span>
          <span aria-hidden="true">·</span>
          <span>{isAr ? 'منصة الدردشة المرئية التفاعلية للصم' : 'Tactile Video Sign Roulette'}</span>
        </div>

        {/* Official Channels Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="https://whatsapp.com/channel/0029Va9IeCZKgsNkaPtijX1U"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors font-medium flex items-center gap-1"
          >
            <span>{isAr ? 'قناة واتساب' : 'WhatsApp'}</span>
          </a>

          <a
            href="https://www.instagram.com/ahmed_deaf_11?stkn=MTZzYnp0bGQxbm5pMA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition-colors font-medium flex items-center gap-1"
          >
            <span>{isAr ? 'إنستغرام' : 'Instagram'}</span>
          </a>

          <a
            href="https://www.messenger.com/channel/AhmedDeaf11"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors font-medium flex items-center gap-1"
          >
            <span>{isAr ? 'ماسنجر' : 'Messenger'}</span>
          </a>

          <a
            href="https://www.facebook.com/share/1C5afsHqUA/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors font-medium flex items-center gap-1"
          >
            <span>{isAr ? 'فيسبوك' : 'Facebook'}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
