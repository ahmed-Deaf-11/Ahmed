import React, { useState } from 'react';
import {
  Users,
  Heart,
  Shield,
  Globe,
  Sparkles,
  MessageSquareOff,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Tv,
} from 'lucide-react';
import { AccessibilitySettings, SignerProfile, SocialChannel } from '../types.ts';
import { SIGNERS_ROSTER, OFFICIAL_CHANNELS } from '../data/signData.ts';

interface CommunitySectionProps {
  settings: AccessibilitySettings;
  pinnedSignerIds: string[];
  onStartChatWithSigner: (signer: SignerProfile) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  settings,
  pinnedSignerIds,
  onStartChatWithSigner,
}) => {
  const isAr = settings.language === 'ar';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pinnedSigners = SIGNERS_ROSTER.filter((s) => pinnedSignerIds.includes(s.id));

  const handleCopyLink = (channel: SocialChannel) => {
    navigator.clipboard.writeText(channel.url);
    setCopiedId(channel.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-12 animate-in fade-in duration-200">
      {/* Hero Banner Area */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src="/src/assets/images/deaf_visual_hero_1793521667888.jpg"
            alt="Deaf Community Visual Communication"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black w-max mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deaf-11-ASL.com</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              {isAr
                ? 'الشبكة العالمية الأولى للتواصل المرئي الإشاري الحر'
                : 'The World’s First Visual-First Sign Language Roulette'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              {isAr
                ? 'منصة تفاعلية باللمس تعمل بروليت الفيديو المباشر لربط مجتمع الصم وضعاف السمع في الوطن العربي والعالم دون أي حاجة للصوت أو الدردشة النصية، بلغة الإشارة العربية (ArSL) والأمريكية (ASL) والدولية (IS).'
                : 'A touch-driven video roulette linking deaf and visual communicators across the Arab world and globally, free from sound barriers and text typing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Community Channels (Ahmed Deaf 11) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'القنوات والشبكات الرسمية' : 'Official Community Channels'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isAr
                ? 'قنوات ومجتمعات التواصل لـ Ahmed Deaf 11'
                : 'Ahmed Deaf 11 Official Channels'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isAr
                ? 'انضم إلى القنوات الرسمية على واتساب وإنستغرام وفيسبوك وماسنجر لمتابعة المحتوى الإشاري والفعاليات'
                : 'Connect via official WhatsApp, Instagram, Facebook, and Messenger communities'}
            </p>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_CHANNELS.map((channel) => {
            const isCopied = copiedId === channel.id;

            return (
              <div
                key={channel.id}
                className={`group relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                  settings.ultraHighContrast
                    ? 'bg-black text-white border-2 border-white'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-xl'
                }`}
              >
                <div>
                  {/* Badge & Type indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      style={{
                        backgroundColor: settings.ultraHighContrast ? '#ffffff' : `${channel.color}20`,
                        color: settings.ultraHighContrast ? '#000000' : channel.color,
                        borderColor: settings.ultraHighContrast ? '#ffffff' : `${channel.color}40`,
                      }}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border"
                    >
                      {isAr ? channel.badgeAr : channel.badgeEn}
                    </span>

                    <button
                      onClick={() => handleCopyLink(channel)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        settings.ultraHighContrast
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={isAr ? 'نسخ الرابط' : 'Copy link'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Channel Title */}
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {isAr ? channel.nameAr : channel.nameEn}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 block mb-2">
                    {channel.handle}
                  </span>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {isAr ? channel.descriptionAr : channel.descriptionEn}
                  </p>
                </div>

                {/* Join CTA */}
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full min-h-[44px] py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md ${
                    settings.ultraHighContrast
                      ? 'bg-white text-black hover:bg-slate-200 border-2 border-white'
                      : 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white border border-slate-700'
                  }`}
                >
                  <span>{isAr ? 'متابعة / انضمام' : 'Join Channel'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned Contacts / Favorited Signers */}
      {pinnedSigners.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-xl font-bold text-white">
                {isAr ? 'الأصدقاء والشخصيات المثبتة' : 'Pinned Signer Connections'}
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {isAr ? `${pinnedSigners.length} شريك مثبت` : `${pinnedSigners.length} Pinned`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pinnedSigners.map((signer) => (
              <div
                key={signer.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-amber-400/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={signer.avatarUrl}
                    alt={signer.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{signer.flag}</span>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? signer.nameAr : signer.nameEn}
                      </h4>
                    </div>
                    <span className="text-xs text-amber-400 font-medium">
                      {isAr ? signer.dialectLabelAr : signer.dialectLabelEn}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onStartChatWithSigner(signer)}
                  className="min-h-[40px] px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-transform active:scale-95"
                >
                  {isAr ? 'اتصال مرئي' : 'Sign Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <MessageSquareOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? '100% بصري حركي بدون نصوص' : 'Zero Text & Zero Audio Reliance'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'صممت المنصة للتواصل الطبيعي الحقيقي بلغة اليدين، تعابير الوجه، وأزرار التفاعل اللمسي السريع والتصفيق الإشاري.'
              : 'Built for genuine native sign expression through hand gestures, facial nuance, and tactile visual reactions.'}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'ربط عربي وعالمي موحد' : 'Pan-Arab & Global Inclusion'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'دعم متكامل للغة الإشارة العربية المشتركة، لغة الإشارة الأمريكية ASL، والإشارة الدولية لتمكين الصم من بناء صداقات عابرة للحدود.'
              : 'Full support for Arabic Sign Language (ArSL), American Sign Language (ASL), and International Signs (IS).'}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'بيئة آمنة وواعية باحتياجات الصم' : 'Accessible & Respectful Space'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'تنبيهات فلاشية بصرية بديلة لأصوات الرنين، وتعزيز لتباين حركة اليدين، ودليل مدمج لإطار الإشارة المثالي.'
              : 'Visual strobe rings replacing audible rings, hand contrast boosters, and optimal signing framing guides.'}
          </p>
        </div>
      </div>
    </div>
  );
};
