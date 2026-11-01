import React, { useState } from 'react';
import { Copy, Check, Users, Sparkles, Video, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AccessibilitySettings } from '../types.ts';

interface DirectSignRoomProps {
  settings: AccessibilitySettings;
  onEnterRoulette: () => void;
}

export const DirectSignRoom: React.FC<DirectSignRoomProps> = ({
  settings,
  onEnterRoulette,
}) => {
  const isAr = settings.language === 'ar';
  const [roomCode, setRoomCode] = useState<string>('ASL-11-GLOBAL');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://deaf-11-asl.com/room/${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setJoinedRoom(inputCode.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>{isAr ? 'غرفة الإشارة الخاصة المباشرة' : 'Direct Private Sign Room'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isAr
            ? 'تواصل مباشر عبر الفيديو مع صديقك دون قيود'
            : 'Direct Video Sign Communication With Your Peer'}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          {isAr
            ? 'شارك رابط غرفتك الخاصة للتواصل الإشاري البصري بتقنية الفيديو عالي الوضوح بدون صوت وبدون كتابة نصية معزز بالتفاعل اللمسي التام.'
            : 'Share your private room link for high-definition, sound-free sign video communication with integrated tactile feedback.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create / Share Room Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'غرفتك الخاصة الجاهزة' : 'Your Dedicated Sign Room'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'رمز اتصال فوري مشفر ومباشر' : 'Instant encrypted direct connection code'}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <span className="font-mono font-bold text-amber-400 text-base sm:text-lg tracking-wider">
                {roomCode}
              </span>
              <button
                onClick={handleCopy}
                className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          <button
            onClick={onEnterRoulette}
            className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/10"
          >
            <Video className="w-4 h-4" />
            <span>{isAr ? 'بدء تشغيل كاميرا الغرفة' : 'Launch Sign Room Cam'}</span>
          </button>
        </div>

        {/* Join Existing Room Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'الانضمام لغرفة صديق' : 'Join a Friend’s Room'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'أدخل رمز الغرفة التي شاركها معك' : 'Enter the room code shared with you'}
                </p>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="مثال: ASL-CAIRO-99"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors uppercase"
              />

              <button
                type="submit"
                disabled={!inputCode.trim()}
                className="w-full min-h-[48px] rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/10"
              >
                <span>{isAr ? 'دخول الغرفة والتواصل' : 'Connect to Room'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>

          {joinedRoom && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? `متصل بالغرفة: ${joinedRoom}` : `Connected to: ${joinedRoom}`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
