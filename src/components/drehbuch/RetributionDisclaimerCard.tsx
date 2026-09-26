import React from 'react';
import { Flame, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RetributionDisclaimerCardProps {
  isAccepted: boolean;
  onToggleAccept: (accepted: boolean) => void;
  genreTitle?: string;
  language?: 'DE' | 'EN';
}

export const RetributionDisclaimerCard: React.FC<RetributionDisclaimerCardProps> = ({
  isAccepted,
  onToggleAccept,
  genreTitle = 'Rache & Vergeltung / Dark Retribution',
  language = 'DE',
}) => {
  const isEn = language === 'EN';

  return (
    <div
      className={`rounded-2xl border transition-all p-4 sm:p-5 ${
        isAccepted
          ? 'bg-zinc-900 border-zinc-700 shadow-md text-zinc-100'
          : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950 border-red-500/80 shadow-lg text-white ring-2 ring-red-500/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isAccepted
                ? 'bg-zinc-800 text-amber-400 border border-zinc-700'
                : 'bg-red-900/70 text-red-300 border border-red-500 animate-pulse'
            }`}
          >
            <Flame className="w-5 h-5" />
          </div>

          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/40 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {isEn ? 'Mandatory Disclaimer • ' : 'Pflicht-Disclaimer • '}{genreTitle}
              </span>
              {isAccepted ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {isEn ? 'Confirmed & Unlocked' : 'Bestätigt & Freigeschaltet'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {isEn ? 'Confirmation Required' : 'Bestätigung erforderlich'}
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-white">
              {isEn
                ? 'Safety & Model Policy for Fictional Action & Destruction Sequences'
                : 'Sicherheits- & Modell-Richtlinie für fiktive Action- & Zerstörungsszenen'}
            </h4>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {isEn
                ? 'This genre is designed for stylized fictional cinema sequences featuring high-octane dark action (e.g., supernatural entities, burning steeds in Ghostrider aesthetic, crater impacts and destroyed cityscapes).'
                : 'Dieses Genre ist für übersteigerte, fiktionale Filmsequenzen mit spektakulärer Dark-Action ausgelegt (z. B. übernatürliche Gestalten, brennende Reittiere im Ghostrider-Stil, spektakuläre Krater-Landungen und zerstörte Straßenkulissen).'}
            </p>

            <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <p>
                <strong className="text-zinc-200">
                  {isEn ? 'Notice on Uncensored / Heretic LLM Models (LM Studio):' : 'Hinweis zu Uncensored / Heretic LLM-Modellen (LM Studio):'}
                </strong>{' '}
                {isEn
                  ? 'The generated prompts serve solely artistic, fictional cinema and VFX visualization purposes.'
                  : 'Die generierten Prompts dienen rein künstlerischen, fiktiven Film- und VFX-Visualisierungen.'}
              </p>
              <p>
                {isEn
                  ? 'You commit not to defame or harm real living persons and to adhere to applicable safety and usage laws.'
                  : 'Du verpflichtest dich, keine real existierenden Personen zu schädigen und geltende Sicherheits- und Nutzungsgesetze einzuhalten.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Checkbox Bar */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={isAccepted}
            onChange={(e) => onToggleAccept(e.target.checked)}
            className="w-5 h-5 text-red-600 rounded border-zinc-600 bg-zinc-800 focus:ring-red-500 cursor-pointer mt-0.5 sm:mt-0"
          />
          <span className="text-xs font-bold text-zinc-100 group-hover:text-white transition">
            {isEn
              ? 'I confirm this is a fictional cinema project and accept full responsibility for model tests & prompt execution.'
              : 'Ich bestätige, dass dies ein fiktives Filmprojekt ist, und übernehme die volle Verantwortung für Modell-Tests & Prompts.'}
          </span>
        </label>

        <div className="shrink-0 text-[11px] font-mono">
          {isAccepted ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {isEn ? 'Activated' : 'Aktiviert'}
            </span>
          ) : (
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {isEn ? 'Checkbox must be checked' : 'Häkchen muss gesetzt sein'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
