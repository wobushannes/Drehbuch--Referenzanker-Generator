import React from 'react';
import { Zap, Sparkles, Activity, ShieldAlert, CheckCircle2, ChevronRight, Droplets, Flame, Waves, Eye } from 'lucide-react';

interface UltraPhysicsCardProps {
  enabled?: boolean;
  onToggle: (enabled: boolean) => void;
  language?: 'DE' | 'EN';
}

export const UltraPhysicsCard: React.FC<UltraPhysicsCardProps> = ({ enabled = true, onToggle, language = 'DE' }) => {
  const isEn = language === 'EN';

  return (
    <div
      className={`rounded-2xl border transition-all p-5 shadow-xs ${
        enabled
          ? 'bg-gradient-to-br from-amber-950/90 via-zinc-900 to-zinc-950 text-white border-amber-500/40 ring-1 ring-amber-500/20'
          : 'bg-white border-zinc-200 text-zinc-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 ${
                enabled
                  ? 'bg-amber-400 text-zinc-950'
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>{isEn ? 'Kinetics & Causality Engine' : 'Kinetik & Kausalitäts-Engine'}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                enabled ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              MiniMax H3 • Maestro 2.1.6
            </span>
          </div>

          <h3 className="text-sm font-bold flex items-center gap-2">
            <span>
              {isEn
                ? 'Physical Causal Chain, Micro-Haptics & Subsurface Light'
                : 'Physikalische Kausalkette, Mikro-Haptik & Subsurface-Licht'}
            </span>
          </h3>

          <p className={`text-xs leading-relaxed ${enabled ? 'text-zinc-300' : 'text-zinc-500'}`}>
            {isEn ? (
              <>
                Forces the AI video model toward <strong>authentic physical presence</strong>: Every movement is inextricably linked with{' '}
                <span className={enabled ? 'text-amber-300 font-semibold' : 'font-semibold'}>
                  breath reaction, muscle contraction, haptic contact, and rim-light reflections
                </span>{' '}
                (eliminating lifeless statue poses).
              </>
            ) : (
              <>
                Zwingt das KI-Videomodell zu <strong>echter Körperphysik</strong>: Jede Bewegung wird unlösbar mit einer{' '}
                <span className={enabled ? 'text-amber-300 font-semibold' : 'font-semibold'}>
                  Atemreaktion, Muskelkontraktion, haptischem Kontakt und Streiflicht-Reflexionen
                </span>{' '}
                gekoppelt (keine leblosen Statuen-Figuren mehr).
              </>
            )}
          </p>
        </div>

        {/* Big Switch Toggle */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enabled ? 'bg-amber-500' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Feature Pills when enabled */}
      {enabled && (
        <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-start gap-2">
            <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-white">
                {isEn ? 'Causal Chain Reaction' : 'Kausale Kettenreaktion'}
              </div>
              <div className="text-[10px] text-zinc-400">
                {isEn ? 'Contact → Muscle pulse → Breath → Micro-texture' : 'Kontakt → Muskelreaktion → Atemzug → Textur'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-start gap-2">
            <Droplets className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-white">
                {isEn ? 'Specular Rim-Light' : 'Specular Streiflicht'}
              </div>
              <div className="text-[10px] text-zinc-400">
                {isEn ? 'Gleaming highlights on skin, leather & dew (anti-plastic)' : 'Glanzlichter auf Haut, Leder, Moos & Tau gegen Plastik-Look'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-start gap-2">
            <Waves className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-white">
                {isEn ? '4-Stage Dramaturgy' : '4-Stufen Dramaturgie'}
              </div>
              <div className="text-[10px] text-zinc-400">
                {isEn ? 'Strict rhythmic escalation (0-4s / 4-9s / 9-13s / 13-15s)' : 'Exakte Rhythmus-Steigerung (0-4s / 4-9s / 9-13s / 13-15s)'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-start gap-2">
            <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-white">
                {isEn ? 'Intense Eye-Lock' : 'Intense Eye-Lock'}
              </div>
              <div className="text-[10px] text-zinc-400">
                {isEn ? 'Camera as physical entity with direct gaze contact' : 'Kamera als physischer Körper mit direktem Blickkontakt'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
