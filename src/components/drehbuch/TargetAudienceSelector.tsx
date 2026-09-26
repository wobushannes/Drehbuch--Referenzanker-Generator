import React, { useState, useMemo } from 'react';
import {
  Users,
  Palette,
  Headphones,
  Home,
  ShieldCheck,
  Check,
  Briefcase,
  Activity,
  Heart,
  Laptop,
  Smile,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  SlidersHorizontal,
  BookmarkCheck,
} from 'lucide-react';
import { TargetAudience } from '../../types';
import { Language } from '../../utils/i18n';
import {
  TARGET_AUDIENCE_CATALOG,
  getTargetAudienceCatalog,
  generateAudienceProfileFallback,
} from '../../utils/targetAudienceCatalog';

interface TargetAudienceSelectorProps {
  selectedAudienceId: string;
  onSelectAudience: (audience: TargetAudience) => void;
  onApplyCtaToVideo: (ctaText: string) => void;
  currentCta?: string;
  customAudiences?: TargetAudience[];
  onAddCustomAudience?: (audience: TargetAudience) => void;
  onDeleteCustomAudience?: (id: string) => void;
  lmStudioEndpoint?: string;
  lmStudioModel?: string;
  lmStudioApiKey?: string;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
  language?: Language;
}

const AUDIENCE_ICONS: Record<string, React.ReactNode> = {
  'oeffentlicher-dienst': <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  management: <Briefcase className="w-4 h-4 text-indigo-600" />,
  'aerzte-medizin': <Activity className="w-4 h-4 text-teal-600" />,
  'ab-30-familie': <Heart className="w-4 h-4 text-rose-500" />,
  'freiberufler-tech': <Laptop className="w-4 h-4 text-blue-600" />,
  'best-ager': <Smile className="w-4 h-4 text-amber-600" />,
};

const ITEMS_PER_PAGE = 6;

export const TargetAudienceSelector: React.FC<TargetAudienceSelectorProps> = ({
  selectedAudienceId,
  onSelectAudience,
  onApplyCtaToVideo,
  currentCta,
  customAudiences = [],
  onAddCustomAudience,
  onDeleteCustomAudience,
  lmStudioEndpoint = 'http://localhost:1234/v1',
  lmStudioModel = 'local-model',
  lmStudioApiKey = '',
  onShowToast,
  language = 'DE',
}) => {
  // Combine localized catalog and custom audiences
  const allAudiences: TargetAudience[] = useMemo(() => {
    const baseCatalog = getTargetAudienceCatalog(language);
    return [...baseCatalog, ...customAudiences];
  }, [customAudiences, language]);

  // Current active audience object
  const currentAudience = useMemo(() => {
    const baseCatalog = getTargetAudienceCatalog(language);
    return (
      allAudiences.find((a) => a.id === selectedAudienceId) ||
      allAudiences[0] ||
      baseCatalog[0]
    );
  }, [allAudiences, selectedAudienceId, language]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(allAudiences.length / ITEMS_PER_PAGE));

  // Ensure valid page when list changes
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedAudiences = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return allAudiences.slice(start, start + ITEMS_PER_PAGE);
  }, [allAudiences, safeCurrentPage]);

  // Custom Audience Creator Dialog / State
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customForm, setCustomForm] = useState<{
    name: string;
    hint: string;
    badge: string;
    ageGroup: string;
    coreValues: string;
    psychology: string;
    colorSpectrum: string;
    soundAesthetic: string;
    architecturalFocus: string;
    callToActionStyle: string;
    sampleCallToAction: string;
  }>({
    name: '',
    hint: '',
    badge: '',
    ageGroup: '30 bis 50 Jahre',
    coreValues: '',
    psychology: '',
    colorSpectrum: '',
    soundAesthetic: '',
    architecturalFocus: '',
    callToActionStyle: '',
    sampleCallToAction: '',
  });

  // Handler: Request AI Suggestion from LM Studio (or smart fallback)
  const handleGenerateAiAudience = async () => {
    if (!customForm.name.trim()) {
      onShowToast?.('error', 'Bitte gib zuerst einen Namen für die Zielgruppe ein.');
      return;
    }

    setIsAiLoading(true);
    try {
      const resp = await fetch('/api/screenplay/suggest-audience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: lmStudioEndpoint,
          modelName: lmStudioModel,
          apiKey: lmStudioApiKey,
          name: customForm.name.trim(),
          hint: customForm.hint.trim(),
        }),
      });

      if (!resp.ok) {
        throw new Error(`Serverfehler (${resp.status})`);
      }

      const data = await resp.json();
      if (data && data.audience) {
        const aud = data.audience;
        setCustomForm((prev) => ({
          ...prev,
          badge: aud.badge || prev.badge,
          ageGroup: aud.ageGroup || prev.ageGroup,
          coreValues: Array.isArray(aud.coreValues) ? aud.coreValues.join(', ') : (aud.coreValues || prev.coreValues),
          psychology: aud.psychology || prev.psychology,
          colorSpectrum: aud.colorSpectrum || prev.colorSpectrum,
          soundAesthetic: aud.soundAesthetic || prev.soundAesthetic,
          architecturalFocus: aud.architecturalFocus || prev.architecturalFocus,
          callToActionStyle: aud.callToActionStyle || prev.callToActionStyle,
          sampleCallToAction: aud.sampleCallToAction || prev.sampleCallToAction,
        }));

        onShowToast?.(
          'success',
          data.source === 'lmstudio'
            ? 'LM Studio hat Ästhetik-Profil, Farbwelt & Sound vorgeschlagen!'
            : 'Intelligentes Zielgruppen-Profil erfolgreich erstellt!'
        );
      } else {
        throw new Error('Kein Profil erhalten.');
      }
    } catch (err: any) {
      console.warn('Fallback to client heuristic generator:', err);
      const fallback = generateAudienceProfileFallback(customForm.name, customForm.hint);
      setCustomForm((prev) => ({
        ...prev,
        badge: fallback.badge,
        ageGroup: fallback.ageGroup,
        coreValues: fallback.coreValues,
        psychology: fallback.psychology,
        colorSpectrum: fallback.colorSpectrum,
        soundAesthetic: fallback.soundAesthetic,
        architecturalFocus: fallback.architecturalFocus,
        callToActionStyle: fallback.callToActionStyle,
        sampleCallToAction: fallback.sampleCallToAction,
      }));
      onShowToast?.('info', 'Standard-Vorschlag angewendet (LM Studio offline oder nicht erreichbar).');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handler: Save custom audience
  const handleSaveCustomAudience = () => {
    if (!customForm.name.trim()) {
      onShowToast?.('error', 'Name der Zielgruppe erforderlich.');
      return;
    }

    const slug = customForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || 'custom';
    const newAudience: TargetAudience = {
      id: `custom-${slug}-${Date.now()}`,
      name: customForm.name.trim(),
      badge: customForm.badge.trim() || `Fokus: ${customForm.name.trim()}`,
      ageGroup: customForm.ageGroup.trim() || '30 bis 50 Jahre',
      coreValues: customForm.coreValues.trim() || 'Verlässlichkeit, Qualität, Planungssicherheit',
      psychology:
        customForm.psychology.trim() ||
        `Sucht maßgeschneiderte Lösungen für den individuellen Lebensstil von "${customForm.name}".`,
      colorSpectrum:
        customForm.colorSpectrum.trim() ||
        'Warmes Tageslicht, natürliche Materialien, harmonische Kontraste',
      soundAesthetic:
        customForm.soundAesthetic.trim() ||
        'Warme Akustik mit sanfter musikalischer Begleitung und dezenten Naturgeräuschen',
      architecturalFocus:
        customForm.architecturalFocus.trim() ||
        'Optimierte Raumaufteilung, zukunftssichere Energieeffizienz, großzügiges Wohngefühl',
      callToActionStyle: customForm.callToActionStyle.trim() || 'Direkt, wertschätzend, informativ',
      sampleCallToAction:
        customForm.sampleCallToAction.trim() ||
        `Verwirklichen Sie Ihren Wohntraum. Jetzt unverbindlich beraten lassen.`,
    };

    if (onAddCustomAudience) {
      onAddCustomAudience(newAudience);
    }
    onSelectAudience(newAudience);

    // Navigate to the page containing this new audience
    const nextTotal = allAudiences.length + 1;
    setCurrentPage(Math.ceil(nextTotal / ITEMS_PER_PAGE));

    setIsCreatingModalOpen(false);
    // Reset form
    setCustomForm({
      name: '',
      hint: '',
      badge: '',
      ageGroup: '30 bis 50 Jahre',
      coreValues: '',
      psychology: '',
      colorSpectrum: '',
      soundAesthetic: '',
      architecturalFocus: '',
      callToActionStyle: '',
      sampleCallToAction: '',
    });

    onShowToast?.('success', language === 'EN' ? `Target audience "${newAudience.name}" activated!` : `Zielgruppe "${newAudience.name}" aktiv übernommen!`);
  };

  const isEn = language === 'EN';

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              {isEn ? 'Target Audience Catalog & Aesthetics Control' : 'Zielgruppen-Katalog & Ästhetik-Steuerung'}
            </span>
            <span className="text-[11px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              {allAudiences.length} {isEn ? 'Audiences' : 'Zielgruppen'} &bull; {isEn ? `Page ${safeCurrentPage} of ${totalPages}` : `Seite ${safeCurrentPage} von ${totalPages}`}
            </span>
          </div>
          <h3 className="text-base font-bold text-zinc-900">
            {isEn ? 'Define & Select Video Target Audience' : 'Video-Zielgruppe festlegen & frei definieren'}
          </h3>
          <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed max-w-3xl">
            {isEn
              ? 'Select the film audience or define a custom target group. LM Studio and the prompt compiler align the entire video — color grading, lighting temperature, sound design, music, dialogue, and architectural priorities.'
              : 'Wähle das Publikum des Films oder definiere eine freie Zielgruppe. LM Studio und der Prompt-Compiler passen das komplette Video – inklusive Farbwelt, Lichttemperatur, Sounddesign, Musik, Dialoge und Architektur-Schwerpunkte – verbindlich auf diese Gruppe an.'}
          </p>
        </div>

        {/* Action Button: Create Custom Target Audience */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreatingModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? '+ Define Custom Audience (LM Studio)' : '+ Eigene Zielgruppe definieren (LM Studio)'}</span>
          </button>
        </div>
      </div>

      {/* Target Audience Quick Selector Cards (Paginated) */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {pagedAudiences.map((audience) => {
            const isSelected = audience.id === currentAudience.id;
            const isCustom = customAudiences.some((c) => c.id === audience.id);
            const icon =
              AUDIENCE_ICONS[audience.id] ||
              (isCustom ? (
                <Sparkles className="w-4 h-4 text-indigo-600" />
              ) : (
                <Users className="w-4 h-4 text-zinc-600" />
              ));

            return (
              <div
                key={audience.id}
                className={`relative p-3 rounded-xl border text-left transition flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-xs ring-2 ring-indigo-400/20'
                    : 'bg-zinc-50/60 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectAudience(audience)}
                  className="w-full text-left cursor-pointer focus:outline-hidden"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="p-1.5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
                      {icon}
                    </div>
                    <div className="flex items-center gap-1">
                      {isCustom && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 border border-indigo-200 px-1 py-0.2 rounded">
                          {isEn ? 'Custom' : 'Eigen'}
                        </span>
                      )}
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-tight line-clamp-2 ${
                      isSelected ? 'text-indigo-950' : 'text-zinc-800'
                    }`}
                  >
                    {audience.name}
                  </h4>
                </button>

                <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-600 truncate">
                    {audience.ageGroup}
                  </span>

                  {isCustom && onDeleteCustomAudience && (
                    <button
                      type="button"
                      title={isEn ? 'Delete audience' : 'Zielgruppe löschen'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomAudience(audience.id);
                        onShowToast?.('info', isEn ? `Audience "${audience.name}" removed.` : `Zielgruppe "${audience.name}" entfernt.`);
                      }}
                      className="text-zinc-500 hover:text-rose-600 transition p-1 rounded hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
            <div className="text-xs text-zinc-600">
              {isEn ? 'Showing ' : 'Zeige '}
              {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, allAudiences.length)}{' '}
              {isEn ? 'of ' : 'von '}
              {allAudiences.length} {isEn ? 'audiences' : 'Zielgruppen'}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Previous' : 'Zurück'}</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                      safeCurrentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
              >
                <span>{isEn ? 'Next' : 'Weiter'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Profile Details Panel */}
      <div className="bg-gradient-to-br from-indigo-50/40 via-white to-amber-50/30 border border-indigo-200/80 rounded-xl p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
              {AUDIENCE_ICONS[currentAudience.id] ? (
                React.cloneElement(AUDIENCE_ICONS[currentAudience.id] as React.ReactElement, {
                  className: 'w-4 h-4 text-white',
                })
              ) : (
                <Users className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-zinc-900">
                  {currentAudience.name}
                </h4>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded-full">
                  {currentAudience.badge}
                </span>
                {customAudiences.some((c) => c.id === currentAudience.id) && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    {isEn ? 'Custom defined via LM Studio' : 'Frei definiert via LM Studio'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                {isEn ? 'Age Group: ' : 'Altersgruppe: '}<strong className="text-zinc-800">{currentAudience.ageGroup}</strong> &bull; {isEn ? 'Core Values: ' : 'Kernwerte: '}{' '}
                {currentAudience.coreValues}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Multi-Dimension Aesthetic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pillar 1: Farbspektrum & Beleuchtung */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-900">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {isEn ? 'Color Spectrum & Light' : 'Farbspektrum & Licht'}
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {currentAudience.colorSpectrum}
            </p>
          </div>

          {/* Pillar 2: Sounddesign & Akustik */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-indigo-900">
              <Headphones className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {isEn ? 'Sound Design & Music' : 'Sounddesign & Musik'}
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {currentAudience.soundAesthetic}
            </p>
          </div>

          {/* Pillar 3: Architektur-Schwerpunkt */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-900">
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {isEn ? 'Architecture & Tactility' : 'Architektur & Haptik'}
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {currentAudience.architecturalFocus}
            </p>
          </div>

          {/* Pillar 4: Psychologie & Trigger */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {isEn ? 'Psychology & Triggers' : 'Psychologie & Trigger'}
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {currentAudience.psychology}
            </p>
          </div>
        </div>

        {/* Recommended Call-to-Action with 1-Click Apply */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                {isEn ? `Recommended Call-to-Action for ${currentAudience.name}:` : `Empfohlener Call-to-Action für ${currentAudience.name}:`}
              </span>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded">
                {isEn ? 'Tonality: ' : 'Tonalität: '}{currentAudience.callToActionStyle}
              </span>
            </div>
            <p className="text-xs font-bold text-amber-950">
              &bdquo;{currentAudience.sampleCallToAction}&ldquo;
            </p>
          </div>

          <button
            type="button"
            onClick={() => onApplyCtaToVideo(currentAudience.sampleCallToAction)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-lg text-xs transition cursor-pointer shadow-2xs shrink-0"
          >
            <span>{isEn ? 'Apply as Video CTA' : 'Als Video-CTA übernehmen'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal: Create Custom Audience with LM Studio */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    {isEn ? 'Define Custom Target Audience' : 'Freie Zielgruppe definieren'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {isEn ? 'LM Studio automatically suggests triggers, color palette, sound, and architecture.' : 'LM Studio schlägt automatisch Trigger, Farbwelt, Sound und Architektur vor.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingModalOpen(false)}
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Input Name & optional Hint */}
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">
                    {isEn ? 'Audience Name / Profession / Demographic *' : 'Zielgruppen-Name / Berufsfeld / Gruppe *'}
                  </label>
                  <input
                    type="text"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    placeholder={isEn ? 'e.g. Master Artisans & DIY Builders, DINKs, Eco-Architects...' : 'z.B. Junge Handwerksmeister & Selbermacher, DINKs, Öko-Bauherren...'}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-indigo-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">
                    {isEn ? 'Optional Custom Notes / Expectations' : 'Optionale Zusatznotizen / Erwartungen'}
                  </label>
                  <input
                    type="text"
                    value={customForm.hint}
                    onChange={(e) => setCustomForm({ ...customForm, hint: e.target.value })}
                    placeholder={isEn ? 'e.g. High degree of sweat equity, high value on cost certainty and timber architecture' : 'z.B. Hoher Anteil Eigenleistung, viel Wert auf Kostensicherheit und langlebige Holzkonstruktion'}
                    className="w-full text-xs px-3 py-2 bg-white border border-indigo-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-indigo-900">
                    {isEn ? 'Click to generate aesthetic attributes via local LM Studio model:' : 'Klicke auf den Button, damit das lokale Sprachmodell die Ästhetik-Attribute ermittelt:'}
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateAiAudience}
                    disabled={isAiLoading || !customForm.name.trim()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-2xs transition cursor-pointer shrink-0"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isEn ? 'LM Studio generating...' : 'LM Studio generiert...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isEn ? '✨ Suggest via LM Studio' : '✨ Von LM Studio vorschlagen lassen'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 2: Fine-Tuning of Attributes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                    {isEn ? 'Profile Details (LM Studio Preview & Polish)' : 'Profil-Details (LM Studio Vorschau & Feinschliff)'}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {isEn ? 'All fields editable' : 'Alle Felder editierbar'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      {isEn ? 'Focus Badge' : 'Fokus-Badge'}
                    </label>
                    <input
                      type="text"
                      value={customForm.badge}
                      onChange={(e) => setCustomForm({ ...customForm, badge: e.target.value })}
                      placeholder={isEn ? 'e.g. Focus: Artisanship & Reliability' : 'z.B. Fokus: Wertarbeit & Eigenleistung'}
                      className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      {isEn ? 'Age Group' : 'Altersgruppe'}
                    </label>
                    <input
                      type="text"
                      value={customForm.ageGroup}
                      onChange={(e) => setCustomForm({ ...customForm, ageGroup: e.target.value })}
                      placeholder={isEn ? 'e.g. 28 to 48 years' : 'z.B. 28 bis 48 Jahre'}
                      className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    {isEn ? 'Core Values (comma separated)' : 'Kernwerte (kommagetrennt)'}
                  </label>
                  <input
                    type="text"
                    value={customForm.coreValues}
                    onChange={(e) => setCustomForm({ ...customForm, coreValues: e.target.value })}
                    placeholder={isEn ? 'e.g. Craftsmanship, Hands-on, Cost certainty, Reliability' : 'z.B. Wertarbeit, Anpacken, Kostensicherheit, Verlässlichkeit'}
                    className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    {isEn ? 'Psychology & Triggers (What emotionally drives this audience?)' : 'Psychologie & Trigger (Was treibt die Zielgruppe emotional an?)'}
                  </label>
                  <textarea
                    rows={2}
                    value={customForm.psychology}
                    onChange={(e) => setCustomForm({ ...customForm, psychology: e.target.value })}
                    placeholder={isEn ? 'Desires, anxieties and subconscious motivations...' : 'Wünsche, Ängste und unbewusste Treiber beim Hausbau...'}
                    className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      {isEn ? 'Color Spectrum & Light Design' : 'Farbspektrum & Lichtführung'}
                    </label>
                    <textarea
                      rows={2}
                      value={customForm.colorSpectrum}
                      onChange={(e) => setCustomForm({ ...customForm, colorSpectrum: e.target.value })}
                      placeholder={isEn ? 'e.g. Earthy tones, dark larch timber, warm sunlight...' : 'z.B. Erdige Töne, dunkles Lärchenholz, helles Sonnenlicht...'}
                      className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      {isEn ? 'Sound Design & Musicality' : 'Sounddesign & Musikästhetik'}
                    </label>
                    <textarea
                      rows={2}
                      value={customForm.soundAesthetic}
                      onChange={(e) => setCustomForm({ ...customForm, soundAesthetic: e.target.value })}
                      placeholder={isEn ? 'e.g. Driving acoustic guitar, tactile sounds (timber, hardware)...' : 'z.B. Treibende Akustikgitarre, Haptikgeräusche (Holz, Klinke)...'}
                      className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      {isEn ? 'Architectural Focus & Structural Cues' : 'Architektur-Fokus & Bauteile'}
                    </label>
                    <input
                      type="text"
                      value={customForm.architecturalFocus}
                      onChange={(e) => setCustomForm({ ...customForm, architecturalFocus: e.target.value })}
                      placeholder={isEn ? 'e.g. Double garage, workshop studio, exposed rafters...' : 'z.B. Doppelgarage, Werkstattbereich, sichtbare Holzbalken...'}
                      className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      {isEn ? 'Call-to-Action Tonality' : 'Tonalität Call-to-Action'}
                    </label>
                    <input
                      type="text"
                      value={customForm.callToActionStyle}
                      onChange={(e) => setCustomForm({ ...customForm, callToActionStyle: e.target.value })}
                      placeholder={isEn ? 'e.g. Direct, honest, peer-to-peer' : 'z.B. Direkt, anpackend, ehrlich auf Augenhöhe'}
                      className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    {isEn ? 'Sample Call-to-Action (1 Sentence for Video Outro)' : 'Beispiel-Call-to-Action (1 Satz für Video-Outro)'}
                  </label>
                  <input
                    type="text"
                    value={customForm.sampleCallToAction}
                    onChange={(e) => setCustomForm({ ...customForm, sampleCallToAction: e.target.value })}
                    placeholder={isEn ? 'e.g. True quality for makers and professionals. Request your guidebook now.' : 'z.B. Echte Qualität für Selbermacher und Profis. Jetzt Planungshandbuch anfordern.'}
                    className="w-full text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-zinc-50/70">
              <button
                type="button"
                onClick={() => setIsCreatingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200/60 rounded-xl transition cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Abbrechen'}
              </button>

              <button
                type="button"
                onClick={handleSaveCustomAudience}
                disabled={!customForm.name.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{isEn ? 'Save & Apply Audience' : 'Zielgruppe speichern & aktivieren'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
