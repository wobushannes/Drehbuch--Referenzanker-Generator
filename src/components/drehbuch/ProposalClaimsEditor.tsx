import React, { useState, useEffect } from 'react';
import {
  ConceptProposal,
  WindowClaimTypography,
  ClaimFontStyle,
  ClaimAnimation,
  ClaimPlacement,
} from '../../types';
import {
  Type,
  Sparkles,
  Check,
  Edit2,
  X,
  PenTool,
  Film,
  Move,
  Clock,
  Sparkle,
  Layers,
  ChevronRight,
} from 'lucide-react';

export interface ProposalClaimsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ConceptProposal | null;
  proposalIndex?: number;
  onUpdateWindowClaim: (
    proposalId: string,
    windowNumber: number,
    newClaim: string,
    newTypography?: WindowClaimTypography
  ) => void;
  onUpdateProposalCta: (
    proposalId: string,
    newCta: string,
    newTypography?: WindowClaimTypography
  ) => void;
  isPressed?: boolean;
  language?: 'DE' | 'EN';
}

const getFontOptions = (isEn: boolean) => [
  {
    id: 'blockschrift' as ClaimFontStyle,
    label: isEn ? 'Modern Clean Sans' : 'Moderne Blockschrift',
    sub: isEn ? 'Clean Sans-Serif • Contemporary, direct & objective' : 'Clean Sans-Serif • Zeitgemäß, direkt & sachlich',
    sample: isEn ? 'MODERN ARCHITECTURE' : 'MODERNE ARCHITEKTUR',
  },
  {
    id: 'handschrift' as ClaimFontStyle,
    label: isEn ? 'Elegant Cursive Script' : 'Elegante Handschrift',
    sub: isEn ? 'Cursive Script • Emotional, exclusive & personal' : 'Cursive Script • Emotional, exklusiv & persönlich',
    sample: isEn ? 'Created exclusively for you' : 'Exklusiv für Sie kreiert',
    isCursive: true,
  },
  {
    id: 'serif' as ClaimFontStyle,
    label: isEn ? 'Editorial Serif' : 'Editorial Serif',
    sub: isEn ? 'Classic Elegance • Dining, pleasure & heritage' : 'Klassische Eleganz • Gastronomie, Genuss & Kultur',
    sample: isEn ? 'Finest Culinary Art & Taste' : 'Feinste Kulinarik & Genuss',
  },
  {
    id: 'condensed_bold' as ClaimFontStyle,
    label: isEn ? 'Condensed Bold' : 'Condensed Bold',
    sub: isEn ? 'Cinema Poster • Powerful, dramatic & gripping' : 'Kino-Plakat • Kraftvoll, dramatisch & packend',
    sample: isEn ? 'THE RECKONING BEGINS' : 'DIE ABRECHNUNG BEGINNT',
  },
];

const getAnimationOptions = (isEn: boolean) => [
  { id: 'blur_reveal' as ClaimAnimation, label: isEn ? 'Blur-Reveal' : 'Blur-Reveal', desc: isEn ? 'Resolves smoothly into focus from depth of field' : 'Fokussiert aus Tiefenunschärfe in den Fokus' },
  { id: 'fade_in' as ClaimAnimation, label: isEn ? 'Gentle Fade-In' : 'Sanfter Fade-In', desc: isEn ? 'Soft, organic opacity dissolve' : 'Weiches, organisches Einblenden' },
  { id: 'typewriter' as ClaimAnimation, label: isEn ? 'Typewriter' : 'Schreibmaschine', desc: isEn ? 'Rhythmic letter-by-letter reveal' : 'Buchstaben-Aufbau im Takt' },
  { id: 'hard_cut' as ClaimAnimation, label: isEn ? 'Hard Cut' : 'Harter Schnitt', desc: isEn ? 'Instant visual pop on the musical beat' : 'Direkter visueller Akzent auf den Beat' },
];

const getPlacementOptions = (isEn: boolean) => [
  { id: 'lower_third' as ClaimPlacement, label: isEn ? 'Lower Third' : 'Unteres Drittel', desc: isEn ? 'Classic cinema broadcast bar' : 'Klassische Kino-Bauchbinde' },
  { id: 'center' as ClaimPlacement, label: isEn ? 'Center' : 'Bildmitte', desc: isEn ? 'Maximum hero visual impact' : 'Maximaler Hero-Fokus' },
  { id: 'top_third' as ClaimPlacement, label: isEn ? 'Top Third' : 'Oberes Drittel', desc: isEn ? 'Keeps bottom action unobstructed' : 'Freie Sicht auf Details unten' },
  { id: 'lower_right' as ClaimPlacement, label: isEn ? 'Lower Right' : 'Unten rechts', desc: isEn ? 'Subtle brand signature tag' : 'Dezente Markensignatur' },
];

export const ProposalClaimsEditor: React.FC<ProposalClaimsEditorModalProps> = ({
  isOpen,
  onClose,
  proposal,
  proposalIndex = 0,
  onUpdateWindowClaim,
  onUpdateProposalCta,
  isPressed = false,
  language = 'DE',
}) => {
  const isEn = language === 'EN';
  const FONT_OPTIONS = getFontOptions(isEn);
  const ANIMATION_OPTIONS = getAnimationOptions(isEn);
  const PLACEMENT_OPTIONS = getPlacementOptions(isEn);
  // Selected tab: 1..windowCount or 0 for Outro CTA
  const [selectedTab, setSelectedTab] = useState<number>(1);

  // Local state for each window: claim text + typography
  const [windowEdits, setWindowEdits] = useState<
    Record<
      number,
      {
        claimText: string;
        fontStyle: ClaimFontStyle;
        animation: ClaimAnimation;
        placement: ClaimPlacement;
        hasCursiveAccent: boolean;
        cursiveNote: string;
      }
    >
  >({});

  // Local state for CTA
  const [ctaEdit, setCtaEdit] = useState<{
    text: string;
    fontStyle: ClaimFontStyle;
    animation: ClaimAnimation;
    placement: ClaimPlacement;
    hasCursiveAccent: boolean;
    cursiveNote: string;
  }>({
    text: '',
    fontStyle: 'blockschrift',
    animation: 'blur_reveal',
    placement: 'center',
    hasCursiveAccent: true,
    cursiveNote: '',
  });

  // Initialize state when modal opens or proposal changes
  useEffect(() => {
    if (!proposal) return;

    const wMap: Record<number, any> = {};
    proposal.windowBreakdown.forEach((w) => {
      const typo = w.claimTypography;
      wMap[w.windowNumber] = {
        claimText: w.claimOrCta || '',
        fontStyle: typo?.fontStyle || (w.windowNumber % 2 === 0 ? 'serif' : 'blockschrift'),
        animation: typo?.animation || 'blur_reveal',
        placement: typo?.placement || (w.windowNumber === proposal.windowBreakdown.length ? 'center' : 'lower_third'),
        hasCursiveAccent: Boolean(typo?.hasCursiveAccent),
        cursiveNote: typo?.cursiveNote || '',
      };
    });
    setWindowEdits(wMap);

    const ctaTypo = proposal.callToActionTypography;
    setCtaEdit({
      text: proposal.callToAction || '',
      fontStyle: ctaTypo?.fontStyle || 'blockschrift',
      animation: ctaTypo?.animation || 'blur_reveal',
      placement: ctaTypo?.placement || 'center',
      hasCursiveAccent: ctaTypo?.hasCursiveAccent !== undefined ? ctaTypo.hasCursiveAccent : true,
      cursiveNote: ctaTypo?.cursiveNote || 'Exklusiv reservieren',
    });

    setSelectedTab(1);
  }, [proposal, isOpen]);

  if (!isOpen || !proposal) return null;

  const currentWindowConfig = proposal.windowBreakdown.find((w) => w.windowNumber === selectedTab);
  const currentWindowEdit = windowEdits[selectedTab] || {
    claimText: '',
    fontStyle: 'blockschrift',
    animation: 'blur_reveal',
    placement: 'lower_third',
    hasCursiveAccent: false,
    cursiveNote: '',
  };

  const handleUpdateCurrentWindow = (fields: Partial<typeof currentWindowEdit>) => {
    setWindowEdits((prev) => ({
      ...prev,
      [selectedTab]: {
        ...prev[selectedTab],
        ...fields,
      },
    }));
  };

  const handleUpdateCtaField = (fields: Partial<typeof ctaEdit>) => {
    setCtaEdit((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const handleSaveAll = () => {
    // Save all windows
    proposal.windowBreakdown.forEach((w) => {
      const edit = windowEdits[w.windowNumber];
      if (edit) {
        onUpdateWindowClaim(proposal.id, w.windowNumber, edit.claimText.trim(), {
          fontStyle: edit.fontStyle,
          animation: edit.animation,
          placement: edit.placement,
          hasCursiveAccent: edit.hasCursiveAccent,
          cursiveNote: edit.hasCursiveAccent ? edit.cursiveNote.trim() : '',
        });
      }
    });

    // Save CTA
    onUpdateProposalCta(proposal.id, ctaEdit.text.trim(), {
      fontStyle: ctaEdit.fontStyle,
      animation: ctaEdit.animation,
      placement: ctaEdit.placement,
      hasCursiveAccent: ctaEdit.hasCursiveAccent,
      cursiveNote: ctaEdit.hasCursiveAccent ? ctaEdit.cursiveNote.trim() : '',
    });

    onClose();
  };

  // Live Cinema Box
  const activeText = selectedTab === 0 ? ctaEdit.text : currentWindowEdit.claimText;
  const activeFont = selectedTab === 0 ? ctaEdit.fontStyle : currentWindowEdit.fontStyle;
  const activeAnimation = selectedTab === 0 ? ctaEdit.animation : currentWindowEdit.animation;
  const activePlacement = selectedTab === 0 ? ctaEdit.placement : currentWindowEdit.placement;
  const activeHasCursive = selectedTab === 0 ? ctaEdit.hasCursiveAccent : currentWindowEdit.hasCursiveAccent;
  const activeCursiveNote = selectedTab === 0 ? ctaEdit.cursiveNote : currentWindowEdit.cursiveNote;

  const alignClass =
    activePlacement === 'center'
      ? 'items-center justify-center text-center'
      : activePlacement === 'top_third'
      ? 'items-center justify-start text-center pt-3'
      : activePlacement === 'lower_right'
      ? 'items-end justify-end text-right pr-6 pb-3'
      : 'items-center justify-end text-center pb-4';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header Bar - Clean and direct at the top edge */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white flex items-center justify-between gap-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Type className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 px-2 py-0.5 rounded">
                  {isEn ? `Proposal ${proposalIndex + 1}` : `Vorschlag ${proposalIndex + 1}`}
                </span>
                <span className="font-bold text-sm text-white truncate">
                  {isEn ? 'Claims & Typography Directing' : 'Claims & Typografie-Regie'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 truncate mt-0.5">
                {proposal.title} &bull; {proposal.windowBreakdown.length} {isEn ? 'Windows • On-screen styling' : 'Windows à On-Screen Gestaltung'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer shrink-0"
            title={isEn ? 'Close' : 'Schließen'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs - Horizontally organized, clearly separated */}
        <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mr-1 shrink-0">
            {isEn ? 'Select scene:' : 'Szene wählen:'}
          </span>

          {proposal.windowBreakdown.map((win) => {
            const isTabActive = selectedTab === win.windowNumber;
            const wEdit = windowEdits[win.windowNumber];
            const hasText = Boolean(wEdit?.claimText && wEdit.claimText.trim());

            return (
              <button
                key={win.windowNumber}
                type="button"
                onClick={() => setSelectedTab(win.windowNumber)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                <span>W{win.windowNumber}</span>
                <span className="truncate max-w-[120px] font-normal opacity-90 hidden sm:inline">
                  {win.title}
                </span>
                {hasText && (
                  <span
                    className={`w-2 h-2 rounded-full ${isTabActive ? 'bg-amber-300' : 'bg-emerald-500'}`}
                    title={isEn ? 'Claim configured' : 'Claim hinterlegt'}
                  />
                )}
              </button>
            );
          })}

          <div className="h-4 w-px bg-zinc-300 mx-1 shrink-0" />

          {/* Outro CTA Tab */}
          <button
            type="button"
            onClick={() => setSelectedTab(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedTab === 0
                ? 'bg-amber-500 text-zinc-950 shadow-xs'
                : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300'
            }`}
          >
            <Sparkle className="w-3.5 h-3.5" />
            <span>Outro Call-to-Action</span>
          </button>
        </div>

        {/* Modal Main Body - 2 Columns on Desktop */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Controls (Col 7) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Scene Context info */}
              {selectedTab !== 0 && currentWindowConfig && (
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                    <span>{isEn ? `Scene W${currentWindowConfig.windowNumber} Context` : `Szene W${currentWindowConfig.windowNumber} Kontext`}</span>
                    <span>{currentWindowConfig.cameraMovement}</span>
                  </div>
                  <p className="font-semibold text-zinc-900">{currentWindowConfig.title}</p>
                  {currentWindowConfig.dialogueSnippet && (
                    <p className="text-indigo-700 italic font-mono text-[11px]">
                      &bdquo;{currentWindowConfig.dialogueSnippet}&ldquo;
                    </p>
                  )}
                </div>
              )}

              {/* Text Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                  <span>
                    {selectedTab === 0
                      ? (isEn ? 'Final Call-to-Action (Outro Text):' : 'Finaler Call-to-Action (Outro Text):')
                      : (isEn ? `On-Screen Claim for Window ${selectedTab}:` : `On-Screen Claim für Window ${selectedTab}:`)}
                  </span>
                  <span className="text-[10px] font-normal text-zinc-600">
                    {selectedTab === 0
                      ? (isEn ? 'Displayed at the end of video' : 'Wird am Ende eingeblendet')
                      : (isEn ? 'Displayed during the scene' : 'Wird während der Szene eingeblendet')}
                  </span>
                </label>
                <input
                  type="text"
                  value={selectedTab === 0 ? ctaEdit.text : currentWindowEdit.claimText}
                  onChange={(e) => {
                    if (selectedTab === 0) {
                      handleUpdateCtaField({ text: e.target.value });
                    } else {
                      handleUpdateCurrentWindow({ claimText: e.target.value });
                    }
                  }}
                  placeholder={
                    selectedTab === 0
                      ? (isEn ? 'e.g. Tour our model home now & schedule your consultation' : 'z.B. Jetzt Musterhaus besichtigen & Beratungstermin vereinbaren')
                      : (isEn ? 'e.g. Masterful Craftsmanship & Modern Timber Architecture' : `z.B. Frische Zutaten & Meisterhafte Handwerkskunst`)
                  }
                  className="w-full text-xs sm:text-sm bg-white border border-zinc-300 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none transition shadow-2xs font-medium"
                />
              </div>

              {/* Schriftart: Handschrift vs. Blockschrift */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                  <span>{isEn ? 'Font Style & Typography Character:' : 'Schriftart & Typografie-Charakter:'}</span>
                  <span className="text-[10px] font-normal text-indigo-700 font-semibold">
                    {isEn ? 'Cursive vs. Clean Sans' : 'Handschrift vs. Blockschrift'}
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FONT_OPTIONS.map((f) => {
                    const isSelected =
                      (selectedTab === 0 ? ctaEdit.fontStyle : currentWindowEdit.fontStyle) === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          if (selectedTab === 0) {
                            handleUpdateCtaField({ fontStyle: f.id });
                          } else {
                            handleUpdateCurrentWindow({ fontStyle: f.id });
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-400/30'
                            : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                            <PenTool
                              className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-zinc-400'}`}
                            />
                            <span>{f.label}</span>
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-zinc-500 mb-2 leading-tight">{f.sub}</span>
                        <div
                          className={`text-xs py-1 px-2 rounded ${
                            f.isCursive
                              ? 'font-serif italic text-amber-900 bg-amber-50/70 border border-amber-200'
                              : f.id === 'serif'
                              ? 'font-serif font-medium text-emerald-900 bg-emerald-50/70 border border-emerald-200'
                              : f.id === 'condensed_bold'
                              ? 'font-sans font-black uppercase text-rose-900 bg-rose-50/70 border border-rose-200'
                              : 'font-sans font-bold uppercase text-indigo-900 bg-indigo-50/70 border border-indigo-200'
                          }`}
                          style={f.isCursive ? { fontFamily: 'Georgia, cursive', fontStyle: 'italic' } : undefined}
                        >
                          &bdquo;{f.sample}&ldquo;
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Einblendung & Platzierung */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Animation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800 block">
                    {isEn ? 'Animation / Reveal:' : 'Einblendung (Animation):'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ANIMATION_OPTIONS.map((a) => {
                      const isSelected =
                        (selectedTab === 0 ? ctaEdit.animation : currentWindowEdit.animation) === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            if (selectedTab === 0) {
                              handleUpdateCtaField({ animation: a.id });
                            } else {
                              handleUpdateCurrentWindow({ animation: a.id });
                            }
                          }}
                          className={`p-2 rounded-lg border text-left text-[11px] transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-400'
                              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <span className="block">{a.label}</span>
                          <span className="text-[9px] text-zinc-500 line-clamp-1">{a.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Placement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800 block">
                    {isEn ? 'Screen Placement:' : 'Platzierung im Bild:'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PLACEMENT_OPTIONS.map((p) => {
                      const isSelected =
                        (selectedTab === 0 ? ctaEdit.placement : currentWindowEdit.placement) === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            if (selectedTab === 0) {
                              handleUpdateCtaField({ placement: p.id });
                            } else {
                              handleUpdateCurrentWindow({ placement: p.id });
                            }
                          }}
                          className={`p-2 rounded-lg border text-left text-[11px] transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-400'
                              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <span className="block">{p.label}</span>
                          <span className="text-[9px] text-zinc-500 line-clamp-1">{p.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Handschrift-Akzent Note */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedTab === 0 ? ctaEdit.hasCursiveAccent : currentWindowEdit.hasCursiveAccent}
                    onChange={(e) => {
                      if (selectedTab === 0) {
                        handleUpdateCtaField({ hasCursiveAccent: e.target.checked });
                      } else {
                        handleUpdateCurrentWindow({ hasCursiveAccent: e.target.checked });
                      }
                    }}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-amber-950">
                    {isEn
                      ? 'Display handwritten cursive accent note above claim'
                      : 'Handschriftlichen Akzent-Zusatz (Cursive Note) über dem Claim anzeigen'}
                  </span>
                </label>

                {(selectedTab === 0 ? ctaEdit.hasCursiveAccent : currentWindowEdit.hasCursiveAccent) && (
                  <div className="pl-6 pt-1 space-y-1">
                    <input
                      type="text"
                      value={selectedTab === 0 ? ctaEdit.cursiveNote : currentWindowEdit.cursiveNote}
                      onChange={(e) => {
                        if (selectedTab === 0) {
                          handleUpdateCtaField({ cursiveNote: e.target.value });
                        } else {
                          handleUpdateCurrentWindow({ cursiveNote: e.target.value });
                        }
                      }}
                      placeholder={isEn ? 'e.g. Haute Cuisine, Since 1994, Turnkey, Exclusive reservation...' : 'z.B. Haute Cuisine, Seit 1994, Schlüsselfertig, Exklusiv reservieren...'}
                      className="w-full text-xs bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-amber-800 italic block">
                      {isEn
                        ? 'Rendered as an elegant cursive flourish right above the primary text.'
                        : 'Wird als eleganter, geschwungener Akzent direkt über dem Haupttext eingeblendet.'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Cinema Player Preview (Col 5) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isEn ? 'Cinema Preview (Simulated Screen)' : 'Kino-Vorschau (Simulierter Screen)'}</span>
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">16:9 MiniMax Frame</span>
              </div>

              {/* Simulated 16:9 Video Player Screen */}
              <div className="relative w-full aspect-video rounded-2xl bg-zinc-950 border border-zinc-800 p-4 overflow-hidden shadow-xl flex flex-col justify-between text-white select-none">
                {/* Ambient scene lighting simulation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-radial from-indigo-950/20 via-transparent to-black pointer-events-none" />

                {/* Top overlay timecode & camera info */}
                <div className="relative flex items-center justify-between text-[10px] text-zinc-400 font-mono border-b border-zinc-800/80 pb-1">
                  <span className="text-amber-400 font-bold">
                    {selectedTab === 0 ? 'OUTRO' : `W${selectedTab} • REC`}
                  </span>
                  <span className="text-zinc-500 truncate max-w-[150px]">
                    {activeFont} &bull; {activeAnimation}
                  </span>
                </div>

                {/* Simulated Visual Claim rendered in CSS */}
                <div className={`relative flex-1 flex flex-col ${alignClass} px-2`}>
                  {activeHasCursive && activeCursiveNote && (
                    <span
                      className="text-xs sm:text-sm text-amber-300 italic tracking-wider font-serif mb-1 drop-shadow-md"
                      style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                    >
                      ✦ {activeCursiveNote}
                    </span>
                  )}

                  {activeText ? (
                    <div
                      className={`transition-all duration-300 drop-shadow-lg max-w-full break-words ${
                        activeFont === 'handschrift'
                          ? 'font-serif italic text-amber-100 text-sm sm:text-base tracking-wide'
                          : activeFont === 'serif'
                          ? 'font-serif font-semibold text-zinc-100 text-xs sm:text-sm tracking-tight'
                          : activeFont === 'condensed_bold'
                          ? 'font-sans font-black uppercase text-rose-100 text-xs sm:text-sm tracking-tighter'
                          : 'font-sans font-bold uppercase text-white text-xs sm:text-sm tracking-wider'
                      }`}
                      style={
                        activeFont === 'handschrift'
                          ? { fontFamily: 'Georgia, "Playfair Display", cursive', fontStyle: 'italic' }
                          : undefined
                      }
                    >
                      &bdquo;{activeText}&ldquo;
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">
                      {isEn ? '(No text entered • Please enter claim on the left)' : '(Kein Text eingetragen • Bitte links Claim erfassen)'}
                    </span>
                  )}
                </div>

                {/* Bottom player controls bar simulation */}
                <div className="relative flex items-center justify-between text-[9px] text-zinc-500 font-mono border-t border-zinc-800/80 pt-1">
                  <span>POSITION: {activePlacement.toUpperCase()}</span>
                  <span>ANIMATION: {activeAnimation.toUpperCase()}</span>
                </div>
              </div>

              {/* Generated Prompt Directive Preview */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono space-y-1">
                <span className="text-amber-400 font-bold block">
                  LLM PROMPT-DIREKTIVE (MINIMAX H3):
                </span>
                <p className="line-clamp-3 text-zinc-400">
                  {activeText
                    ? `On-screen typography: "${activeText}" rendered in ${
                        activeFont === 'handschrift'
                          ? 'elegant handwritten cursive script'
                          : activeFont === 'serif'
                          ? 'sophisticated editorial serif font'
                          : activeFont === 'condensed_bold'
                          ? 'dramatic bold cinematic title typography'
                          : 'crisp modern clean block sans-serif'
                      }, ${
                        activeAnimation === 'blur_reveal'
                          ? 'smoothly resolving into focus from optical depth of field'
                          : activeAnimation === 'fade_in'
                          ? 'soft organic opacity fade'
                          : activeAnimation === 'typewriter'
                          ? 'typewriter text reveal'
                          : 'direct hard cut'
                      }, positioned at ${activePlacement.replace('_', ' ')}.`
                    : (isEn ? '(No on-screen claim active)' : '(Kein On-Screen Claim aktiv)')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-zinc-600 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isEn
                ? 'Changes flow directly into single-line windows & LLM prompts.'
                : 'Änderungen fließen direkt in die Single-Line Windows & LLM-Prompts ein.'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-xl transition cursor-pointer shadow-2xs"
            >
              {isEn ? 'Cancel' : 'Abbrechen'}
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEn ? 'Apply & Save' : 'Übernehmen & Speichern'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
