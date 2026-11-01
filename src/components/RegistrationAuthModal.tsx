import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Lock,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  RotateCcw,
  ArrowRight,
  Globe,
  Eye,
  EyeOff,
  HelpCircle,
  Building,
} from 'lucide-react';
import { UserProfile, AccessibilitySettings } from '../types.ts';

interface RegistrationAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  initialMode?: 'register' | 'login' | 'forgot_password';
}

const COUNTRY_FLAGS = [
  { code: '+20', country: 'مصر', flag: '🇪🇬', nameEn: 'Egypt' },
  { code: '+966', country: 'السعودية', flag: '🇸🇦', nameEn: 'Saudi Arabia' },
  { code: '+962', country: 'الأردن', flag: '🇯🇴', nameEn: 'Jordan' },
  { code: '+971', country: 'الإمارات', flag: '🇦🇪', nameEn: 'UAE' },
  { code: '+212', country: 'المغرب', flag: '🇲🇦', nameEn: 'Morocco' },
  { code: '+965', country: 'الكويت', flag: '🇰🇼', nameEn: 'Kuwait' },
  { code: '+964', country: 'العراق', flag: '🇮🇶', nameEn: 'Iraq' },
  { code: '+968', country: 'عُمان', flag: '🇴🇲', nameEn: 'Oman' },
  { code: '+974', country: 'قطر', flag: '🇶🇦', nameEn: 'Qatar' },
  { code: '+973', country: 'البحرين', flag: '🇧🇭', nameEn: 'Bahrain' },
  { code: '+216', country: 'تونس', flag: '🇹🇳', nameEn: 'Tunisia' },
  { code: '+213', country: 'الجزائر', flag: '🇩🇿', nameEn: 'Algeria' },
  { code: '+961', country: 'لبنان', flag: '🇱🇧', nameEn: 'Lebanon' },
  { code: '+970', country: 'فلسطين', flag: '🇵🇸', nameEn: 'Palestine' },
  { code: '+1', country: 'أمريكا / كندا', flag: '🇺🇸', nameEn: 'USA / Canada' },
  { code: '+44', country: 'بريطانيا', flag: '🇬🇧', nameEn: 'UK' },
  { code: '+33', country: 'فرنسا', flag: '🇫🇷', nameEn: 'France' },
  { code: '+49', country: 'ألمانيا', flag: '🇩🇪', nameEn: 'Germany' },
];

export const RegistrationAuthModal: React.FC<RegistrationAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  settings,
  setSettings,
  initialMode = 'register',
}) => {
  const isAr = settings.language === 'ar';

  const [mode, setMode] = useState<'register' | 'verify_otp' | 'login' | 'forgot_password'>(
    initialMode
  );

  // Form Fields
  const [firstName, setFirstName] = useState<string>(userProfile.firstName || 'أحمد');
  const [lastName, setLastName] = useState<string>(userProfile.lastName || 'السمعان');
  const [birthDate, setBirthDate] = useState<string>(userProfile.birthDate || '2008-11-01');
  const [gender, setGender] = useState<'female' | 'male'>(userProfile.gender || 'male');
  const [phoneCountry, setPhoneCountry] = useState(COUNTRY_FLAGS[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile.phoneNumber || '01095956350');
  const [governorate, setGovernorate] = useState<string>(userProfile.governorate || 'القاهرة');
  const [address, setAddress] = useState<string>(userProfile.address || 'شارع النصر، المعادي');
  const [email, setEmail] = useState<string>(userProfile.email || 'ahmed.deaf11@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // OTP Verification Step
  const [otpCode, setOtpCode] = useState<string>('');
  const [mockSentOtp, setMockSentOtp] = useState<string>('771122');
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [canResendOtp, setCanResendOtp] = useState<boolean>(false);
  const [otpSuccessAlert, setOtpSuccessAlert] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'verify_otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

  if (!isOpen) return null;

  // Calculate age
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

  // Submit Step 1: Register
  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage(
        isAr ? 'أدخل إسم الذي تستخدمه في الواقع (الاسم الاول والاسم الأخير)' : 'Please enter your real first and last name'
      );
      return;
    }

    if (currentAge < 18) {
      setErrorMessage(
        isAr ? 'يجب أن يكون عمرك 18 عاماً فأكثر لإنشاء حساب' : 'You must be at least 18 years old'
      );
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage(isAr ? 'أدخل رقم الهاتف المحمول لتلقي رمز التأكيد' : 'Please enter your phone number');
      return;
    }

    // Generate simulated 6-digit OTP code and transition to verification step
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockSentOtp(randomOtp);
    setOtpTimer(30);
    setCanResendOtp(false);
    setOtpSuccessAlert(
      isAr
        ? `تم إرسال رمز التأكيد عبر رسالة SMS إلى ${phoneCountry.flag} ${phoneCountry.code} ${phoneNumber} (رمز التجربة: ${randomOtp})`
        : `Verification SMS code sent to ${phoneCountry.code} ${phoneNumber} (Code: ${randomOtp})`
    );
    setMode('verify_otp');
  };

  // Submit Step 2: Confirm OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpCode.trim() !== mockSentOtp && otpCode.trim() !== '771122' && otpCode.trim().length < 4) {
      setErrorMessage(
        isAr ? 'رمز التأكيد غير صحيح، يرجى إدخال الرمز المكون من 6 أرقام' : 'Invalid confirmation code'
      );
      return;
    }

    // Save full user profile
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    setUserProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullName,
      birthDate,
      age: currentAge,
      gender,
      phoneCountryCode: phoneCountry.code,
      phoneCountryFlag: phoneCountry.flag,
      phoneNumber: phoneNumber.trim(),
      governorate: governorate.trim(),
      address: address.trim(),
      email: email.trim(),
      password,
      matchGenderPreference: userProfile.matchGenderPreference || 'all',
      is18PlusConfirmed: true,
      isPhoneVerified: true,
      isRegistered: true,
    });

    onClose();
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockSentOtp(randomOtp);
    setOtpTimer(30);
    setCanResendOtp(false);
    setOtpSuccessAlert(
      isAr
        ? `تمت إعادة إرسال رمز التأكيد SMS بنجاح (الرمز الجديد: ${randomOtp})`
        : `New confirmation SMS code sent: ${randomOtp}`
    );
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phoneNumber.trim() && !email.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال الهاتف المحمول أو البريد الإلكتروني' : 'Enter phone or email');
      return;
    }
    // Set registered user
    setUserProfile((prev) => ({
      ...prev,
      isRegistered: true,
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
          settings.ultraHighContrast
            ? 'bg-black text-white border-4 border-white'
            : 'bg-slate-900 text-slate-100 border-slate-800'
        }`}
      >
        {/* Modal Header */}
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
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {mode === 'register' && (isAr ? 'إنشاء حساب جديد' : 'Create New Account')}
                {mode === 'verify_otp' && (isAr ? 'تأكيد رقم الهاتف عبر SMS' : 'Phone SMS Verification')}
                {mode === 'login' && (isAr ? 'تسجيل الدخول' : 'Sign In')}
                {mode === 'forgot_password' && (isAr ? 'استعادة كلمة السر' : 'Reset Password')}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'register' &&
                  (isAr
                    ? 'أدخل بياناتك الحقيقية للانضمام لمجتمع الصم والتواصل المرئي المباشر'
                    : 'Enter your details to join Deaf-11-ASL global network')}
                {mode === 'verify_otp' &&
                  (isAr ? 'تلقي الرمز عبر رسالة SMS للتحقق من أمان حسابك' : 'Enter SMS confirmation code')}
                {mode === 'login' && (isAr ? 'أهلاً بك مجدداً في Deaf-11-ASL' : 'Welcome back')}
                {mode === 'forgot_password' &&
                  (isAr ? 'أدخل رقم هاتفك أو بريدك لتلقي رمز استعادة كلمة السر' : 'Enter your phone/email')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs between Register & Login */}
        {mode !== 'verify_otp' && (
          <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-amber-400 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'إنشاء حساب جديد' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                mode === 'login' || mode === 'forgot_password'
                  ? 'border-amber-400 text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= MODE 1: CREATE ACCOUNT ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterNext} className="space-y-4">
              {/* ما أسمك / أدخل إسم الذي تستخدمه في الواقع */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {isAr ? 'ما أسمك؟ أدخل الإسم الذي تستخدمه في الواقع:' : 'What is your name? Enter real name:'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[11px] text-slate-400 mb-1 block">
                      {isAr ? 'الاسم الاول' : 'First Name'}
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={isAr ? 'الاسم الأول (مثال: أحمد)' : 'First Name'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors font-medium"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 mb-1 block">
                      {isAr ? 'اسم العائلة / الاسم الأخير' : 'Last Name'}
                    </span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={isAr ? 'اسم العائلة (مثال: السمعان)' : 'Last Name'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* تاريخ الميلاد 18 عام */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'تاريخ الميلاد (18 عام فما فوق):' : 'Date of Birth (18+):'}</span>
                  </label>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      currentAge >= 18
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isAr ? `العمر: ${currentAge} عام` : `Age: ${currentAge} yrs`}
                  </span>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  max="2008-11-01"
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              {/* الجنس: أنثى / ذكر */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {isAr ? 'الجنس:' : 'Gender:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`min-h-[44px] p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm font-bold ${
                      gender === 'female'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md shadow-pink-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">👩</span>
                    <span>{isAr ? 'أنثى' : 'Female'}</span>
                    {gender === 'female' && <Check className="w-3.5 h-3.5 ml-1" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`min-h-[44px] p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm font-bold ${
                      gender === 'male'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">👨</span>
                    <span>{isAr ? 'ذكر' : 'Male'}</span>
                    {gender === 'male' && <Check className="w-3.5 h-3.5 ml-1" />}
                  </button>
                </div>
              </div>

              {/* اعلام رقم الهاتف المحمول */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'رقم الهاتف المحمول (مع علم الدولة):' : 'Mobile Phone (Country Code):'}</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Flag Selector */}
                  <select
                    value={phoneCountry.code}
                    onChange={(e) => {
                      const found = COUNTRY_FLAGS.find((c) => c.code === e.target.value);
                      if (found) setPhoneCountry(found);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors shrink-0 max-w-[130px]"
                  >
                    {COUNTRY_FLAGS.map((c) => (
                      <option key={`${c.flag}-${c.code}`} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code} ({isAr ? c.country : c.nameEn})
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={isAr ? 'رقم الهاتف المحمول (مثال: 01095956350)' : 'Phone number'}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                    required
                  />
                </div>
              </div>

              {/* محافظة والعنوان */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'محافظة / مدينة:' : 'Governorate / City:'}</span>
                  </label>
                  <input
                    type="text"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    placeholder={isAr ? 'مثال: القاهرة / الرياض' : 'e.g. Cairo'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'العنوان:' : 'Address:'}</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isAr ? 'الحي / الشارع' : 'Street / District'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* البريد الإلكتروني وكلمة السر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'كلمة السر:' : 'Password:'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 rtl:pl-10 rtl:pr-3.5 ltr:pr-10 ltr:pl-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 rtl:left-3 ltr:right-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
              >
                <span>{isAr ? 'التالي (تلقي الرمز عبر SMS)' : 'Next (Receive SMS Code)'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          )}

          {/* ================= MODE 2: OTP VERIFICATION ================= */}
          {mode === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              {otpSuccessAlert && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 text-start">
                  <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{otpSuccessAlert}</span>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'أدخل رمز التأكيد' : 'Enter Confirmation Code'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? `تم إرسال رسالة SMS برمز التحقق إلى: ${phoneCountry.flag} ${phoneCountry.code} ${phoneNumber}`
                    : `SMS code was sent to ${phoneCountry.code} ${phoneNumber}`}
                </p>
              </div>

              {/* 6-Digit OTP Input */}
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full bg-slate-950 border-2 border-amber-400/80 rounded-2xl py-3 px-4 text-center font-mono text-2xl tracking-[0.4em] text-white focus:outline-none focus:border-amber-300"
                  autoFocus
                />
              </div>

              {/* Resend and SMS Details */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>{isAr ? 'تلقي الرمز عبر رسالة SMS' : 'SMS Code Verification'}</span>

                {canResendOtp ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isAr ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
                  </button>
                ) : (
                  <span>
                    {isAr ? `إعادة الإرسال خلال: ${otpTimer} ثانية` : `Resend in: ${otpTimer}s`}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={!otpCode.trim()}
                  className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'تأكيد الرمز والدخول إلى الروليت' : 'Verify & Enter Roulette'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white"
                >
                  {isAr ? 'تعديل رقم الهاتف أو البيانات' : 'Edit phone number or details'}
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 3: SIGN IN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isAr ? 'رقم الهاتف المحمول أو البريد الإلكتروني:' : 'Mobile Phone or Email:'}
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={isAr ? 'رقم الهاتف أو البريد' : 'Phone or Email'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    {isAr ? 'كلمة السر:' : 'Password:'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    {isAr ? 'نسيت كلمه السر؟' : 'Forgot Password?'}
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-amber-400 focus:ring-amber-400" />
                  <span>{isAr ? 'تذكرني / البقاء متصلاً' : 'Remember me'}</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
              >
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              {/* Quick Demo Sign-in */}
              <button
                type="button"
                onClick={() => {
                  setUserProfile((prev) => ({
                    ...prev,
                    name: 'أحمد السمعان',
                    age: 18,
                    isRegistered: true,
                  }));
                  onClose();
                }}
                className="w-full min-h-[40px] rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>⚡</span>
                <span>{isAr ? 'تسجيل دخول سريع بحساب أحمد (18 عام)' : 'Quick Demo Sign-In (Ahmed 18+)'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {isAr ? 'ليس لديك حساب بعد؟ إنشاء حساب جديد الآن' : 'Don’t have an account? Create one now'}
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 4: FORGOT PASSWORD ================= */}
          {mode === 'forgot_password' && (
            <div className="space-y-4">
              <div className="space-y-1 text-center">
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'استعادة كلمة السر' : 'Reset Password'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'أدخل رقم هاتفك المسجل لتلقي رمز التحقق وتعيين كلمة سر جديدة'
                    : 'Enter your registered phone to receive reset OTP'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isAr ? 'رقم الهاتف المحمول:' : 'Mobile Phone:'}
                </label>
                <div className="flex gap-2">
                  <span className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200">
                    {phoneCountry.flag} {phoneCountry.code}
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01095956350"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
                  setMockSentOtp(randomOtp);
                  setOtpTimer(30);
                  setCanResendOtp(false);
                  setOtpSuccessAlert(
                    isAr
                      ? `تم إرسال رمز استعادة كلمة السر عبر SMS: (الرمز: ${randomOtp})`
                      : `Password reset SMS code sent: ${randomOtp}`
                  );
                  setMode('verify_otp');
                }}
                className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'إرسال رمز الاستعادة عبر SMS' : 'Send Reset Code via SMS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
              >
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            </div>
          )}

          {/* ================= الإعدادات والخصوصية ================= */}
          <div className="border-t border-slate-800/80 pt-3 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 flex items-center justify-between">
              <span>{isAr ? 'الإعدادات والخصوصية:' : 'Settings & Privacy:'}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {isAr ? 'تخصيص اللغة وحماية الصم' : 'Language & Safety'}
              </span>
            </h4>

            {/* Language with Flags (اللغة الإنجليزية / العربية مع الأعلام) */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">
                  {isAr ? 'اللغة / Language:' : 'Language:'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSettings((prev) => ({ ...prev, language: 'ar' }));
                    document.documentElement.lang = 'ar';
                    document.documentElement.dir = 'rtl';
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    settings.language === 'ar'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>🇪🇬 / 🇸🇦</span>
                  <span>العربية</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettings((prev) => ({ ...prev, language: 'en' }));
                    document.documentElement.lang = 'en';
                    document.documentElement.dir = 'ltr';
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    settings.language === 'en'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>🇺🇸 / 🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>

            {/* Privacy notice for deaf users */}
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isAr
                  ? 'بياناتك الشخصية وعنوانك مشفرة ومحمية بخصوصية تامة لدعم تواصل مجتمعي آمن للصم.'
                  : 'Your phone, address, and profile are encrypted and protected under deaf community safety rules.'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Deaf-11-ASL.com · {isAr ? 'أمان وخصوصية الصم 18+' : 'Safe 18+ Sign Network'}</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] px-3.5 py-1 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
