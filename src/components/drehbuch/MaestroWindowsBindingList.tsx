import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  Info,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Home,
  Box,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import { ConfigReference } from '../../types';
import { getMaestro216Bindings, generateMaestroSlotsMappingText } from '../../utils/windowPromptFormatter';

interface MaestroWindowsBindingListProps {
  references: ConfigReference[];
  projectTitle?: string;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
  language?: 'DE' | 'EN';
}

export const MaestroWindowsBindingList: React.FC<MaestroWindowsBindingListProps> = ({
  references,
  projectTitle = 'Drehbuch Projekt',
  onShowToast,
  language = 'DE',
}) => {
  const isEn = language === 'EN';
  const [copiedSlotIndex, setCopiedSlotIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const bindings = getMaestro216Bindings(references);
  const rawTextMapping = generateMaestroSlotsMappingText(references, projectTitle);

  if (bindings.length === 0) {
    return null;
  }

  const handleCopySlot = (slotIdx: number, label: string) => {
    navigator.clipboard.writeText(label);
    setCopiedSlotIndex(slotIdx);
    onShowToast?.(
      'success',
      isEn
        ? `Maestro 2.1.6 label "${label}" copied!`
        : `Maestro 2.1.6 Label "${label}" kopiert!`
    );
    setTimeout(() => setCopiedSlotIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(rawTextMapping);
    setCopiedAll(true);
    onShowToast?.(
      'success',
      isEn
        ? 'All Maestro 2.1.6 slot labels copied to clipboard!'
        : 'Alle Maestro 2.1.6 Slot-Labels in die Zwischenablage kopiert!'
    );
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-stone-100 shadow-md space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            M2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {isEn
                  ? 'Maestro 2.1.6 Reference & Label Binding Slot Output'
                  : 'Maestro 2.1.6 Referenz- & Label-Binding Listenausgabe'}
              </h3>
              <span className="text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                {bindings.length} {isEn ? 'active slots' : 'aktive Slots'}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {isEn
                ? 'These precise labels must be entered in Maestro 2.1.6 for their respective reference slots:'
                : 'Diese genauen Labels müssen in Maestro 2.1.6 für die jeweiligen Referenz-Slots eingetragen werden:'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition shadow-sm cursor-pointer"
            title={isEn ? 'Copy all slot assignments as plain text' : 'Alle Slot-Zuordnungen als Textliste kopieren'}
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? (isEn ? 'All copied!' : 'Alle kopiert!') : (isEn ? 'Copy all labels' : 'Alle Labels kopieren')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            title={isExpanded ? (isEn ? 'Collapse table' : 'Tabelle einklappen') : (isEn ? 'Expand table' : 'Tabelle ausklappen')}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Structured Binding Table / Cards */}
      {isExpanded && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bindings.map((b) => {
              const isHuman = b.category === 'human';
              const isBuilding = b.category === 'building';
              const isLogo = b.category === 'logo';
              const isObject = b.category === 'object';

              const categoryBorder = isHuman
                ? 'border-blue-500/30 bg-blue-950/20'
                : isBuilding
                ? 'border-amber-500/30 bg-amber-950/20'
                : isLogo
                ? 'border-indigo-500/30 bg-indigo-950/20'
                : 'border-emerald-500/30 bg-emerald-950/20';

              const categoryBadge = isHuman
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : isBuilding
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : isLogo
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

              const categoryLabel = isHuman
                ? (isEn ? 'Human' : 'Mensch')
                : isBuilding
                ? (isEn ? 'Building & Floorplan' : 'Haus & Grundriss')
                : isLogo
                ? (isEn ? 'Logo (25%)' : 'Logo (25%)')
                : (isEn ? 'Prop' : 'Prop');

              return (
                <div
                  key={b.slotIndex}
                  className={`border rounded-xl p-3 flex flex-col justify-between space-y-2.5 transition hover:border-amber-400/60 ${categoryBorder}`}
                >
                  <div>
                    {/* Header: Slot + Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-stone-800 text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center">
                          #{b.slotIndex}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded border ${categoryBadge}`}>
                          {categoryLabel}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-stone-300 bg-stone-800/80 px-2 py-0.5 rounded border border-stone-700">
                        {b.promptTag}
                      </span>
                    </div>

                    {/* Image & Reference Name */}
                    <div className="flex items-center gap-2.5 mt-2">
                      {b.photoUrl ? (
                        <img
                          src={b.photoUrl}
                          alt={b.referenceName}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone-800 text-stone-400 flex items-center justify-center shrink-0 border border-stone-700 text-xs font-mono">
                          Ref
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{b.referenceName}</h4>
                        <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{b.roleOrAction}</p>
                      </div>
                    </div>
                  </div>

                  {/* The Crucial Maestro 2.1.6 Naming Field with 1-Click Copy */}
                  <div className="bg-stone-950/80 border border-stone-800 rounded-lg p-2 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-bold text-amber-400/90 tracking-wider block">
                        {isEn ? 'Enter in Maestro 2.1.6:' : 'In Maestro 2.1.6 eintragen:'}
                      </span>
                      <span className="font-mono text-xs font-bold text-white block truncate select-all">
                        {b.maestroLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopySlot(b.slotIndex, b.maestroLabel)}
                      className="p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer shrink-0"
                      title={isEn ? 'Copy exact label for Maestro 2.1.6' : 'Exaktes Label für Maestro 2.1.6 kopieren'}
                    >
                      {copiedSlotIndex === b.slotIndex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Hint on How to use in Maestro */}
          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                <strong>{isEn ? 'Rule for Maestro 2.1.6:' : 'Regel für Maestro 2.1.6:'}</strong>{' '}
                {isEn
                  ? <>In Maestro, enter the exact yellow label (e.g., <code className="text-amber-300 font-mono">@Subject...</code>) for each slot. In the prompt below, the tag (e.g., <code className="text-amber-300 font-mono">&lt;Subject 2&gt;</code>) then binds with 100% reliability.</>
                  : <>Trage in Maestro für jeden Slot exakt das gelbe Label (z. B. <code className="text-amber-300 font-mono">@Subject...</code>) ein. Im Prompt unten verknüpft sich das Tag (z. B. <code className="text-amber-300 font-mono">&lt;Subject 2&gt;</code>) dann 100% verlässlich.</>}
              </span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 whitespace-nowrap hidden sm:inline">
              {isEn ? 'Logo: 25% opacity bottom right' : 'Logo: 25% Deckkraft rechts unten'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
