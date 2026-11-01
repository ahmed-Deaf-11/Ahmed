import React from 'react';
import { Eye, Sun, Sliders, Check, X, ShieldAlert, Sparkles, Hand, Vibrate } from 'lucide-react';
import { AccessibilitySettings } from '../types.ts';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  const isAr = settings.language === 'ar';

  if (!isOpen) return null;

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
          settings.ultraHighContrast
            ? 'bg-black text-white border-4 border-white'
            : 'bg-slate-900 text-slate-100 border-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b ${
            settings.ultraHighContrast ? 'border-white bg-black' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                settings.ultraHighContrast
                  ? 'bg-white text-black border-white'
                  : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
              }`}
            >
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isAr ? 'إعدادات إمكانية الوصول والرؤية' : 'Vision & Accessibility Settings'}
              </h2>
              <p
                className={`text-xs ${
                  settings.ultraHighContrast ? 'text-white font-medium' : 'text-slate-400'
                }`}
              >
                {isAr
                  ? 'تخصيص كامل لراحة الصم وضعاف البصر والتواصل الحركي'
                  : 'Tailored for deaf and low-vision signers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
              settings.ultraHighContrast
                ? 'bg-black text-white hover:bg-white hover:text-black border-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Vision & Tactile Controls */}
          <div className="space-y-3">
            {/* Hand Silhouette Booster */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Hand className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-sm font-semibold">
                    {isAr ? 'معزز تباين حركة اليدين' : 'Hand Contrast Booster'}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {isAr
                      ? 'يبرز ملامح الأصابع وحواف اليدين'
                      : 'Sharpens finger outlines on video'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.handEnhance}
                onClick={() => toggleSetting('handEnhance')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  settings.handEnhance
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {settings.handEnhance ? (isAr ? 'مُفعّل' : 'ON') : (isAr ? 'مُعطل' : 'OFF')}
              </button>
            </div>

            {/* Visual Strobe Alert */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-yellow-400" />
                <div>
                  <span className="text-sm font-semibold">
                    {isAr ? 'التنبيه الفلاشي البصري (بديل الرنين)' : 'Visual Strobe Alert (No Audio)'}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'فلاش ضوئي عند الاتصال والتفاعل' : 'Screen halo flash on incoming cues'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.visualStrobeAlert}
                onClick={() => toggleSetting('visualStrobeAlert')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  settings.visualStrobeAlert
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {settings.visualStrobeAlert ? (isAr ? 'مُفعّل' : 'ON') : (isAr ? 'مُعطل' : 'OFF')}
              </button>
            </div>

            {/* Tactile Haptics */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-sm font-semibold">
                    {isAr ? 'الاهتزاز اللمسي المباشر' : 'Tactile Haptic Feedback'}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'نبضات اهتزازية للأزرار وتصفيق الصم' : 'Haptic vibration pulses on reactions'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.haptics}
                onClick={() => toggleSetting('haptics')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  settings.haptics
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {settings.haptics ? (isAr ? 'مُفعّل' : 'ON') : (isAr ? 'مُعطل' : 'OFF')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            settings.ultraHighContrast ? 'border-white bg-black' : 'border-slate-800 bg-slate-950/80'
          }`}
        >
          <span className="text-xs">
            {settings.ultraHighContrast
              ? (isAr ? 'وضع الأسود والأبيض الصريح نشط' : 'Ultra B&W mode active')
              : (isAr ? 'إمكانية وصول متوافقة مع WCAG AAA' : 'WCAG AAA High Contrast Ready')}
          </span>
          <button
            onClick={onClose}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs font-extrabold transition-colors border ${
              settings.ultraHighContrast
                ? 'bg-white text-black border-white hover:bg-slate-200'
                : 'bg-amber-400 text-slate-950 border-transparent hover:bg-amber-300'
            }`}
          >
            {isAr ? 'حفظ وإغلاق' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
