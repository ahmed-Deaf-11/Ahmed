import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  FlipHorizontal,
  Sun,
  Maximize2,
  Bookmark,
  BookmarkCheck,
  PenTool,
  BookOpen,
  VolumeX,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Hand,
  Check,
  Scan,
} from 'lucide-react';
import {
  SignerProfile,
  AccessibilitySettings,
  FloatingReaction,
  SignDialect,
  SignItem,
} from '../types.ts';
import { TouchCanvasOverlay } from './TouchCanvasOverlay.tsx';

interface VideoRouletteStreamProps {
  currentSigner: SignerProfile;
  isSearching: boolean;
  onNextSigner: () => void;
  selectedDialect: SignDialect;
  onSelectDialect: (dialect: SignDialect) => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  floatingReactions: FloatingReaction[];
  showStrobe: boolean;
  onOpenDictionary: () => void;
  pinnedSigners: string[];
  onTogglePinSigner: (signerId: string) => void;
  activeSignDemo: SignItem | null;
  onClearSignDemo: () => void;
}

export const VideoRouletteStream: React.FC<VideoRouletteStreamProps> = ({
  currentSigner,
  isSearching,
  onNextSigner,
  selectedDialect,
  onSelectDialect,
  settings,
  setSettings,
  floatingReactions,
  showStrobe,
  onOpenDictionary,
  pinnedSigners,
  onTogglePinSigner,
  activeSignDemo,
  onClearSignDemo,
}) => {
  const isAr = settings.language === 'ar';
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isSwappedLayout, setIsSwappedLayout] = useState<boolean>(false);
  const [isDrawActive, setIsDrawActive] = useState<boolean>(false);
  const [lightAssistActive, setLightAssistActive] = useState<boolean>(false);

  const isPinned = pinnedSigners.includes(currentSigner.id);

  // Initialize camera
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    async function startCamera() {
      if (!cameraActive) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false, // Strict soundless platform
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
            localVideoRef.current.play().catch(() => {});
          }
          setHasCameraPermission(true);
        } else {
          setHasCameraPermission(false);
        }
      } catch (err) {
        console.warn('Camera access unavailable or declined:', err);
        setHasCameraPermission(false);
      }
    }

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  return (
    <div className="relative w-full flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Light Assist Halo (Screen Flashlight for low-light hand illumination) */}
      {lightAssistActive && (
        <div className="absolute inset-0 pointer-events-none z-20 border-[24px] sm:border-[36px] border-white/90 shadow-[inset_0_0_80px_rgba(255,255,255,0.8)]" />
      )}

      {/* Visual Strobe Indicator (replaces audio phone ringing / notifications) */}
      {showStrobe && settings.visualStrobeAlert && (
        <div className="absolute inset-0 pointer-events-none z-20 border-[8px] sm:border-[12px] border-amber-400 animate-visual-strobe" />
      )}

      {/* Top Dialect Bar & Status Controls */}
      <div className="relative z-20 px-3 sm:px-6 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 ml-1">
            {isAr ? 'فلتر الإشارة:' : 'Dialect:'}
          </span>

          <button
            onClick={() => onSelectDialect('all')}
            className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedDialect === 'all'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {isAr ? 'جميع الإشارات' : 'All Dialects'}
          </button>

          <button
            onClick={() => onSelectDialect('arsl')}
            className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedDialect === 'arsl'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {isAr ? 'الإشارة العربية (ArSL)' : 'Arabic Sign (ArSL)'}
          </button>

          <button
            onClick={() => onSelectDialect('asl')}
            className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedDialect === 'asl'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {isAr ? 'الأمريكية (ASL)' : 'American (ASL)'}
          </button>

          <button
            onClick={() => onSelectDialect('is')}
            className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedDialect === 'is'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {isAr ? 'الإشارة الدولية (IS)' : 'International (IS)'}
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsDrawActive(!isDrawActive)}
            className={`min-h-[38px] px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              isDrawActive
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
            title={isAr ? 'الرسم بالأصبع على الفيديو' : 'Draw with finger on video'}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'رسم باللمس' : 'Draw'}</span>
          </button>

          <button
            onClick={onOpenDictionary}
            className="min-h-[38px] px-3 py-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title={isAr ? 'فتح قاموس الإشارات' : 'Open sign dictionary'}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isAr ? 'دليل الإشارات' : 'Sign Guide'}</span>
          </button>

          <button
            onClick={() => onTogglePinSigner(currentSigner.id)}
            className={`min-h-[38px] px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
              isPinned
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isAr ? 'تثبيت جهة الاتصال' : 'Pin Signer Contact'}
          >
            {isPinned ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Dual-Video Grid Workspace */}
      <div className="relative flex-1 w-full min-h-[460px] lg:min-h-[580px] bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-4">
        {/* Active Sign Demo Overlay (when user taps a sign from dictionary) */}
        {activeSignDemo && (
          <div className="absolute top-4 left-4 right-4 z-20 max-w-md mx-auto bg-slate-900/95 border-2 border-amber-400 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeSignDemo.glyph}</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-400">
                    {isAr ? activeSignDemo.labelAr : activeSignDemo.labelEn}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? activeSignDemo.handshapeHint : activeSignDemo.descriptionEn}
                  </p>
                </div>
              </div>
              <button
                onClick={onClearSignDemo}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
              {isAr ? activeSignDemo.descriptionAr : activeSignDemo.descriptionEn}
            </p>
          </div>
        )}

        {/* Video Containers Container */}
        <div className="relative w-full h-full max-w-6xl rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-center items-center">
          {/* Main Focus Video */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
                <div className="relative w-20 h-20 rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
                  <Hand className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">
                    {isAr ? 'جاري الاتصال بشريك إشاري...' : 'Matching with a Deaf Signer...'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? 'البحث في شبكة Deaf-11 العالمية عن متحدثي لغة الإشارة'
                      : 'Connecting to global visual communicators'}
                  </p>
                </div>
              </div>
            ) : isSwappedLayout ? (
              /* User Camera is in Main Screen */
              <div className="relative w-full h-full flex items-center justify-center">
                {hasCameraPermission ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      settings.mirrorCamera ? '-scale-x-100' : ''
                    } ${settings.handEnhance ? 'hand-high-contrast' : ''} ${
                      settings.ultraHighContrast ? 'bw-video-feed' : ''
                    }`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <CameraOff className="w-12 h-12 text-slate-600 mb-2" />
                    <p className="text-sm font-semibold">
                      {isAr ? 'الكاميرا المحلية غير مفعلة' : 'Camera is inactive'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      {isAr
                        ? 'يرجى السماح بالوصول للكاميرا لنقل إشارات يديك بوضوح تام'
                        : 'Please grant camera access to stream your sign gestures'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Remote Signer is in Main Screen */
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentSigner.avatarUrl}
                  alt={currentSigner.nameEn}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.04] ${
                    settings.ultraHighContrast ? 'bw-video-feed' : ''
                  }`}
                />

                {/* Subtle visual sign pulse halo around signer */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                {/* Partner Metadata Pill-Free Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800">
                  <div className="relative">
                    <span className="text-xl">{currentSigner.flag}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {isAr ? currentSigner.nameAr : currentSigner.nameEn}
                      </h3>
                      <span className="text-xs text-amber-400 font-semibold">
                        {isAr ? currentSigner.dialectLabelAr : currentSigner.dialectLabelEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{isAr ? currentSigner.countryAr : currentSigner.countryEn}</span>
                      <span aria-hidden="true">·</span>
                      <span>{isAr ? currentSigner.topicAr : currentSigner.topicEn}</span>
                    </div>
                  </div>
                </div>

                {/* Signing Hand Action Indicator */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <Hand className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="font-semibold text-white">
                    {currentSigner.currentSign}
                  </span>
                </div>
              </div>
            )}

            {/* Hand Boundary Guidelines (Signing Comfort Zone Box) */}
            {settings.handGuidelines && !isSearching && (
              <div className="absolute inset-x-12 sm:inset-x-24 inset-y-8 sm:inset-y-16 border-2 border-dashed border-amber-400/40 rounded-3xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400/80 bg-slate-950/60 px-2 py-0.5 rounded w-max">
                  <Scan className="w-3.5 h-3.5 mr-1" />
                  <span>
                    {isAr ? 'نطاق حركة اليدين والوجه الأمثل' : 'Optimal Sign & Face Zone'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400/80 bg-slate-950/60 px-2 py-0.5 rounded self-center">
                  {isAr ? 'حافظ على وضوح حركة أصابعك داخل الإطار' : 'Keep fingers visible within bounds'}
                </div>
              </div>
            )}

            {/* Picture-in-Picture (PiP) Window for the other camera feed */}
            <div
              onClick={() => setIsSwappedLayout(!isSwappedLayout)}
              className="absolute bottom-4 right-4 z-20 w-36 sm:w-56 h-28 sm:h-40 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-400/70 shadow-2xl cursor-pointer hover:border-amber-300 transition-transform active:scale-95 group"
              title={isAr ? 'انقر للتبديل للشاشة الرئيسية' : 'Click to swap main view'}
            >
              {!isSwappedLayout ? (
                /* PiP shows Local Camera */
                <div className="relative w-full h-full bg-slate-950">
                  {hasCameraPermission ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${
                        settings.mirrorCamera ? '-scale-x-100' : ''
                      } ${settings.handEnhance ? 'hand-high-contrast' : ''} ${
                        settings.ultraHighContrast ? 'bw-video-feed' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400 text-xs">
                      <CameraOff className="w-5 h-5 text-slate-500 mb-1" />
                      <span>{isAr ? 'كاميرتك' : 'Your Cam'}</span>
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>{isAr ? 'أنت (مباشر)' : 'You (Live)'}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                  </div>
                </div>
              ) : (
                /* PiP shows Remote Signer */
                <div className="relative w-full h-full bg-slate-950">
                  <img
                    src={currentSigner.avatarUrl}
                    alt={currentSigner.nameEn}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${
                      settings.ultraHighContrast ? 'bw-video-feed' : ''
                    }`}
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-white font-bold flex items-center gap-1">
                    <span>{currentSigner.flag}</span>
                    <span>{isAr ? currentSigner.nameAr : currentSigner.nameEn}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                  </div>
                </div>
              )}
            </div>

            {/* Floating Visual Reactions (flying emojis & applause hands across screen) */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {floatingReactions.map((reaction) => (
                <div
                  key={reaction.id}
                  style={{
                    left: `${reaction.x}%`,
                    top: `${reaction.y}%`,
                    transform: `scale(${reaction.scale})`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex flex-col items-center ${
                    reaction.isDeafApplause ? 'animate-deaf-applause' : 'animate-bounce'
                  }`}
                >
                  <span className="text-4xl sm:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {reaction.symbol}
                  </span>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-white text-[11px] font-bold border border-white/20 whitespace-nowrap shadow-lg">
                    {reaction.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Touch Drawing Canvas Overlay */}
            <TouchCanvasOverlay
              isActive={isDrawActive}
              onClose={() => setIsDrawActive(false)}
              language={settings.language}
            />
          </div>

          {/* Quick Camera & Video Enhancement Controls Strip */}
          <div className="w-full px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`min-h-[38px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  cameraActive
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:text-white'
                    : 'bg-rose-950/40 border-rose-900 text-rose-400'
                }`}
                title={isAr ? 'تشغيل/إيقاف الكاميرا' : 'Toggle Camera'}
              >
                {cameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {cameraActive ? (isAr ? 'الكاميرا قيد العمل' : 'Camera On') : (isAr ? 'الكاميرا معطلة' : 'Camera Off')}
                </span>
              </button>

              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, mirrorCamera: !prev.mirrorCamera }))
                }
                className={`min-h-[38px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  settings.mirrorCamera
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                title={isAr ? 'مرآة الكاميرا' : 'Mirror Camera'}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'مرآة' : 'Mirror'}</span>
              </button>

              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, handEnhance: !prev.handEnhance }))
                }
                className={`min-h-[38px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  settings.handEnhance
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                title={isAr ? 'تعزيز تباين اليدين' : 'Hand Contrast Booster'}
              >
                <Hand className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'وضوح اليدين' : 'Hand Enhance'}</span>
              </button>

              <button
                onClick={() => setLightAssistActive(!lightAssistActive)}
                className={`min-h-[38px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  lightAssistActive
                    ? 'bg-yellow-400 text-slate-950 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                title={isAr ? 'إضاءة الشاشة المساعدة' : 'Screen Flashlight'}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'إضاءة الشاشة' : 'Light Assist'}</span>
              </button>

              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, handGuidelines: !prev.handGuidelines }))
                }
                className={`min-h-[38px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  settings.handGuidelines
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                title={isAr ? 'إطار تحديد اليدين' : 'Hand Framing Guide'}
              >
                <Scan className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'إطار الإشارة' : 'Sign Frame'}</span>
              </button>
            </div>

            {/* Next Signer Roulette Action */}
            <button
              onClick={onNextSigner}
              disabled={isSearching}
              className="min-h-[44px] px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{isAr ? 'شريك جديد' : 'Next Partner'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
