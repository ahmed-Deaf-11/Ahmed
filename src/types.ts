export type SignDialect = 'all' | 'arsl' | 'asl' | 'is';

export interface SignerProfile {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  flag: string;
  dialect: 'arsl' | 'asl' | 'is';
  dialectLabelAr: string;
  dialectLabelEn: string;
  avatarUrl: string;
  bioAr: string;
  bioEn: string;
  currentSign: string;
  topicAr: string;
  topicEn: string;
  experienceYears: number;
  activeStatus: 'online' | 'signing' | 'watching';
  gender: 'female' | 'male';
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  name: string;
  birthDate: string;
  age: number;
  gender: 'female' | 'male';
  phoneCountryCode: string;
  phoneCountryFlag: string;
  phoneNumber: string;
  governorate: string;
  address: string;
  email: string;
  password?: string;
  matchGenderPreference: 'all' | 'female' | 'male';
  is18PlusConfirmed: boolean;
  isPhoneVerified: boolean;
  isRegistered: boolean;
}

export interface VisualReaction {
  id: string;
  symbol: string;
  labelAr: string;
  labelEn: string;
  color: string;
  isDeafApplause?: boolean;
}

export interface FloatingReaction {
  id: string;
  symbol: string;
  label: string;
  x: number;
  y: number;
  scale: number;
  isDeafApplause?: boolean;
}

export interface SignItem {
  id: string;
  category: 'alphabet_ar' | 'alphabet_asl' | 'greetings' | 'common' | 'questions';
  labelAr: string;
  labelEn: string;
  glyph: string;
  descriptionAr: string;
  descriptionEn: string;
  handshapeHint: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  ultraHighContrast: boolean;
  handEnhance: boolean;
  visualStrobeAlert: boolean;
  haptics: boolean;
  mirrorCamera: boolean;
  handGuidelines: boolean;
  largeTouchTargets: boolean;
  language: 'ar' | 'en';
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawStroke {
  points: Point[];
  color: string;
  width: number;
}

export interface SocialChannel {
  id: string;
  nameAr: string;
  nameEn: string;
  handle: string;
  url: string;
  type: 'whatsapp' | 'messenger' | 'facebook' | 'instagram';
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  badgeEn: string;
  color: string;
}
