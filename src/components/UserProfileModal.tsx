import React, { useState } from 'react';
import { User, Calendar, ShieldCheck, Check, X, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { UserProfile, AccessibilitySettings } from '../types.ts';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  settings: AccessibilitySettings;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  settings,
}) => {
  const isAr = settings.language === 'ar';

  const [name, setName] = useState<string>(userProfile.name || '');
  const [birthDate, setBirthDate] = useState<string>(userProfile.birthDate || '2008-11-01');
  const [gender, setGender] = useState<'female' | 'male'>(userProfile.gender || 'male');
  const [matchGenderPreference, setMatchGenderPreference] = useState<'all' | 'female' | 'male'>(
    userProfile.matchGenderPreference || 'all'
  );
  const [is18PlusConfirmed, setIs18PlusConfirmed] = useState<boolean>(
    userProfile.is18PlusConfirmed ?? true
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Calculate age from birthDate
  const calculateAge = (dateString: string): number => {
    if (!dateString) return 18;
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(birthDate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال اسمك أو اسمك الإشاري' : 'Please enter your name');
      return;
    }

    if (currentAge < 18 || !is18PlusConfirmed) {
      setErrorMessage(
        isAr
          ? 'يجب أن يكون عمرك 18 عاماً فأكثر للدخول والتواصل في روليت الفيديو'
          : 'You must be 18 years or older to access the video roulette'
      );
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      name: name.trim(),
      birthDate,
      age: currentAge,
      gender,
      matchGenderPreference,
      is18PlusConfirmed: true,
      isRegistered: true,
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
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
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isAr ? 'ملف المشترك والتحقق من العمر' : 'Signer Profile & Age (18+)'}
              </h2>
              <p
                className={`text-xs ${
                  settings.ultraHighContrast ? 'text-white' : 'text-slate-400'
                }`}
              >
                {isAr
                  ? 'أدخل بياناتك لضبط تجربة روليت الفيديو الإشاري ومطابقة الشركاء'
                  : 'Set your profile details and video roulette preferences'}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. اسمك / Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'اسمك (أو اسمك الإشاري):' : 'Your Name (or Sign Name):'}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMessage('');
              }}
              placeholder={isAr ? 'مثال: أحمد الأصم / Ahmed' : 'e.g. Ahmed Deaf'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-medium transition-colors"
            />
          </div>

          {/* 2. تاريخ ميلادك / السن (18 عام) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'ما تاريخ ميلادك؟' : 'Date of Birth:'}</span>
              </label>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  currentAge >= 18
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isAr ? `العمر المحسوب: ${currentAge} عام` : `Age: ${currentAge} yrs`}
              </span>
            </div>

            <input
              type="date"
              value={birthDate}
              max="2008-11-01"
              onChange={(e) => {
                setBirthDate(e.target.value);
                setErrorMessage('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
            />

            {/* 18+ Confirmation checkbox */}
            <div className="pt-1 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="confirm18"
                checked={is18PlusConfirmed}
                onChange={(e) => setIs18PlusConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 text-amber-400 focus:ring-amber-400 focus:ring-offset-slate-950"
              />
              <label htmlFor="confirm18" className="text-xs text-slate-300 leading-snug cursor-pointer">
                {isAr
                  ? 'أؤكد أن عمري 18 عاماً فما فوق، وأوافق على إرشادات مجتمع الصم للتواصل المرئي المحترم والآمن.'
                  : 'I confirm that I am 18 years of age or older, and agree to respectful visual sign communication.'}
              </label>
            </div>
          </div>

          {/* 3. ما جنسك؟ (أنثى / ذكر) */}
          <div className="space-y-2">
            <label className="text-xs font-bold block">
              {isAr ? 'ما جنسك؟' : 'What is your gender?'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`min-h-[50px] p-3 rounded-2xl border-2 flex items-center justify-center gap-2.5 transition-all text-sm font-bold ${
                  gender === 'female'
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-lg shadow-pink-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">👩</span>
                <span>{isAr ? 'أنثى' : 'Female'}</span>
                {gender === 'female' && <Check className="w-4 h-4 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => setGender('male')}
                className={`min-h-[50px] p-3 rounded-2xl border-2 flex items-center justify-center gap-2.5 transition-all text-sm font-bold ${
                  gender === 'male'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">👨</span>
                <span>{isAr ? 'ذكر' : 'Male'}</span>
                {gender === 'male' && <Check className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>

          {/* 4. تفضيل المطابقة في الروليت */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <label className="text-xs font-bold text-slate-400 block">
              {isAr ? 'تفضيل البحث والمطابقة في الروليت الإشاري:' : 'Roulette Matching Preference:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMatchGenderPreference('all')}
                className={`min-h-[42px] px-2 py-1.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  matchGenderPreference === 'all'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'الجميع' : 'All'}
              </button>

              <button
                type="button"
                onClick={() => setMatchGenderPreference('female')}
                className={`min-h-[42px] px-2 py-1.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  matchGenderPreference === 'female'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'إناث فقط' : 'Females only'}
              </button>

              <button
                type="button"
                onClick={() => setMatchGenderPreference('male')}
                className={`min-h-[42px] px-2 py-1.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  matchGenderPreference === 'male'
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'ذكور فقط' : 'Males only'}
              </button>
            </div>
          </div>

          {/* Safety & Respect Note */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'منصة Deaf-11-ASL مخصصة للبالغين (18+) لتعزيز التواصل الإشاري الراقي والاحترام المتبادل دون حواجز.'
                : 'Deaf-11-ASL is intended for adults (18+) to foster dignified sign communication.'}
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'حفظ البيانات وبدء الروليت' : 'Save & Start Sign Roulette'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
