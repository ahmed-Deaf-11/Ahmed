import React from 'react';
import { VisualReaction } from '../types.ts';

interface TouchReactionHUDProps {
  reactions: VisualReaction[];
  onTriggerReaction: (reaction: VisualReaction) => void;
  language: 'ar' | 'en';
  ultraHighContrast?: boolean;
}

export const TouchReactionHUD: React.FC<TouchReactionHUDProps> = ({
  reactions,
  onTriggerReaction,
  language,
  ultraHighContrast,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 sm:p-3 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-300">
              {isAr ? 'شريط التفاعل الإشاري الحركي (لمس مباشر)' : 'Tactile Sign Reactions (Instant Touch)'}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-400">
            {isAr ? 'بدون كتابة أو صوت · اهتزاز لمسي مدمج' : 'Sound-Free & Typing-Free · Haptic Feedback'}
          </span>
        </div>

        {/* Reaction Buttons Horizontal Carousel / Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {reactions.map((reaction) => {
            const label = isAr ? reaction.labelAr : reaction.labelEn;
            const isSpecial = reaction.isDeafApplause;

            return (
              <button
                key={reaction.id}
                onClick={() => onTriggerReaction(reaction)}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 min-h-[52px] sm:min-h-[58px] active:scale-90 touch-manipulation border ${
                  ultraHighContrast
                    ? 'bg-black text-white border-2 border-white hover:bg-white hover:text-black font-extrabold'
                    : isSpecial
                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-500/10 border-amber-500/40 hover:border-amber-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                }`}
                title={label}
              >
                <span
                  className={`text-2xl sm:text-3xl leading-none transition-transform group-hover:scale-110 ${
                    isSpecial ? 'animate-deaf-applause' : ''
                  }`}
                >
                  {reaction.symbol}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium tracking-tight mt-1 truncate max-w-full text-center">
                  {label}
                </span>

                {isSpecial && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
