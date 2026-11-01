import React, { useState } from 'react';
import { Search, BookOpen, Send, Sparkles, Check, X } from 'lucide-react';
import { SignItem } from '../types.ts';
import { SIGN_DICTIONARY } from '../data/signData.ts';

interface SignDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSignForDemo: (sign: SignItem) => void;
  language: 'ar' | 'en';
}

export const SignDictionaryModal: React.FC<SignDictionaryModalProps> = ({
  isOpen,
  onClose,
  onSelectSignForDemo,
  language,
}) => {
  const isAr = language === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All Signs' },
    { id: 'alphabet_ar', labelAr: 'أبجدية الإشارة العربية (ArSL)', labelEn: 'Arabic Sign Alphabet' },
    { id: 'alphabet_asl', labelAr: 'أبجدية الإشارة الأمريكية (ASL)', labelEn: 'ASL Alphabet' },
    { id: 'greetings', labelAr: 'التحيات واللقاء', labelEn: 'Greetings' },
    { id: 'common', labelAr: 'إشارات يومية شائعة', labelEn: 'Everyday Signs' },
    { id: 'questions', labelAr: 'الأسئلة والاستفسارات', labelEn: 'Questions & Clarifications' },
  ];

  const filteredSigns = SIGN_DICTIONARY.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.labelAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.labelEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isAr ? 'قاموس لغة الإشارة البصري السريع' : 'Visual Sign Language Guide'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'اختر أي إشارة لعرضها فورياً على شاشة الاتصال مع شريكك'
                  : 'Select any sign to broadcast it instantly onto your video screen'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 sm:p-6 pb-2 border-b border-slate-800/80 space-y-3 bg-slate-900/60">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 rtl:right-3.5 ltr:left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث عن إشارة (مرحباً، شكراً، حرف الألف، A...)'
                  : 'Search for a sign (Hello, Thanks, Letter A...)'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Categories Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Signs Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSigns.map((item) => (
            <div
              key={item.id}
              className="group relative bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                    {item.glyph}
                  </span>
                  <button
                    onClick={() => {
                      onSelectSignForDemo(item);
                      onClose();
                    }}
                    className="min-h-[36px] px-2.5 py-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400 hover:text-slate-950 rounded-lg border border-amber-400/30 transition-colors flex items-center gap-1"
                    title={isAr ? 'عرض الإشارة على الشاشة' : 'Broadcast to screen'}
                  >
                    <Send className="w-3 h-3 rtl:rotate-180" />
                    <span>{isAr ? 'عرض بالمكالمة' : 'Show on Call'}</span>
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {isAr ? item.labelAr : item.labelEn}
                </h3>
                <p className="text-xs text-amber-400/90 font-medium mb-1.5">
                  {item.handshapeHint}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isAr ? item.descriptionAr : item.descriptionEn}
                </p>
              </div>
            </div>
          ))}

          {filteredSigns.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <p className="text-sm">
                {isAr ? 'لم يتم العثور على إشارات مطابقة للبحث' : 'No matching signs found'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>
            {isAr
              ? `إجمالي الإشارات المتوفرة: ${filteredSigns.length}`
              : `Total Available Signs: ${filteredSigns.length}`}
          </span>
          <button
            onClick={onClose}
            className="min-h-[40px] px-4 py-1.5 font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
