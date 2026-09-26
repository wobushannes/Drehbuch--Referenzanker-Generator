import React, { useState } from 'react';
import {
  Camera,
  Video,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Layers,
  Film,
  X,
  Eye,
  RotateCw,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  CAMERA_MOVEMENT_CATALOG,
  CameraMovementPreset,
  getCameraMovementCatalog,
  getRecommendedCameraMovement,
} from '../../utils/cameraCatalog';
import { WindowConfig, TargetAudience } from '../../types';
import { Language } from '../../utils/i18n';

interface GeneratedCameraPlanItem {
  windowIndex: number;
  movementTitle: string;
  movementPrompt: string;
  lensAndRig?: string;
  dramaturgyReason?: string;
}

interface CameraDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  windows: WindowConfig[];
  targetAudience?: TargetAudience;
  targetAudienceName?: string;
  onApplyCameraMovementToWindow: (windowIndex: number, movementPrompt: string) => void;
  onApplyCameraPlanToAll: (cameraPlan: { windowIndex: number; movementPrompt: string }[]) => void;
  lmStudioEndpoint?: string;
  lmStudioModel?: string;
  lmStudioApiKey?: string;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  language?: Language;
}

export const CameraDirectorModal: React.FC<CameraDirectorModalProps> = ({
  isOpen,
  onClose,
  windows,
  targetAudience,
  targetAudienceName,
  onApplyCameraMovementToWindow,
  onApplyCameraPlanToAll,
  lmStudioEndpoint,
  lmStudioModel,
  lmStudioApiKey,
  onShowToast,
  language = 'DE',
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'library'>('ai');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [targetWindowIndex, setTargetWindowIndex] = useState<number>(0);
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState<boolean>(false);
  const [aiDirectorVision, setAiDirectorVision] = useState<string>('');
  const [aiCameraPlan, setAiCameraPlan] = useState<GeneratedCameraPlanItem[] | null>(null);

  if (!isOpen) return null;

  const isEn = language === 'EN';
  const catalog = getCameraMovementCatalog(language);

  const categories = [
    { id: 'all', label: isEn ? 'All Movements' : 'Alle Bewegungen' },
    { id: 'drone', label: isEn ? 'Drone & Wide' : 'Drohne & Totale' },
    { id: 'orbit', label: isEn ? 'Architectural Orbit' : 'Architektur-Orbit' },
    { id: 'steadicam', label: isEn ? 'Steadicam Walkthrough' : 'Steadicam-Walkthrough' },
    { id: 'dolly', label: isEn ? 'Dolly & Slider' : 'Dolly & Slider' },
    { id: 'macro', label: isEn ? '100mm Macro Haptics' : '100mm Macro Haptik' },
    { id: 'crane', label: isEn ? 'Crane & Sunset Outro' : 'Kran & Sunset Outro' },
  ];

  const filteredPresets = catalog.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  // Call LM Studio for Camera Plan
  const handleGenerateAiCameraPlan = async () => {
    setIsGeneratingAiPlan(true);
    try {
      const resp = await fetch('/api/screenplay/suggest-camera-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: lmStudioEndpoint || 'http://localhost:1234/v1',
          modelName: lmStudioModel || 'local-model',
          apiKey: lmStudioApiKey || '',
          windowCount: windows.length || 4,
          targetAudience,
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      if (data.success && Array.isArray(data.cameraPlan)) {
        setAiDirectorVision(data.directorVision || '');
        setAiCameraPlan(data.cameraPlan);
        onShowToast(
          'success',
          data.source === 'lmstudio'
            ? 'Cineastische Kamera-Dramaturgie via LM Studio generiert!'
            : 'Kamera-Dramaturgie erfolgreich erstellt!'
        );
      } else {
        throw new Error(data.error || 'Fehler beim Erstellen der Kameraführung');
      }
    } catch (err: any) {
      console.error('Camera generation failed:', err);
      onShowToast('error', `Kamera-Generierung fehlgeschlagen: ${err.message}`);
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  // Apply AI Camera Plan to all windows
  const handleApplyAiPlanToAll = () => {
    if (!aiCameraPlan) return;
    const plan = aiCameraPlan.map((item, idx) => ({
      windowIndex: item.windowIndex !== undefined ? item.windowIndex : idx,
      movementPrompt: item.movementPrompt,
    }));
    onApplyCameraPlanToAll(plan);
    onShowToast('success', `LM Studio Kamera-Dramaturgie auf alle ${windows.length} Windows angewendet!`);
    onClose();
  };

  // Default auto-recommendation fallback
  const handleAutoApplyAllDefault = () => {
    const plan = windows.map((w, idx) => {
      const rec = getRecommendedCameraMovement(w.windowNumber, windows.length, w.visualFocus);
      return {
        windowIndex: idx,
        movementPrompt: rec.suggestedPrompt,
      };
    });

    onApplyCameraPlanToAll(plan);
    onShowToast('success', `Klassische Kameraführung auf alle ${windows.length} Windows angewendet!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-gradient-to-r from-amber-500/10 via-zinc-100 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900">
                  {isEn ? 'Cinematic Camera Director (Camera Movement)' : 'Cineastischer Kamera-Director (Camführung)'}
                </h2>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full font-mono">
                  {isEn ? '35mm / Drone / 100mm Macro' : '35mm / Drohne / 100mm Macro'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {isEn
                  ? 'Let LM Studio orchestrate a target-audience tailored 4-phase camera choreography or choose from the Hollywood catalog.'
                  : 'Lass LM Studio eine zielgruppengenaue 4-Phasen-Kamera-Dramaturgie erstellen oder wähle aus dem Hollywood-Katalog.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-200/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? '⚡ LM Studio AI Camera Choreography' : '⚡ LM Studio KI-Kamera-Dramaturgie'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-200/70'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEn ? `Camera Catalog (${catalog.length})` : `Kamera-Katalog (${catalog.length})`}</span>
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-zinc-600 text-[11px]">{isEn ? 'Target Window:' : 'Ziel-Window:'}</span>
              <div className="flex gap-1">
                {windows.map((w, idx) => (
                  <button
                    key={w.id || idx}
                    type="button"
                    onClick={() => setTargetWindowIndex(idx)}
                    className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition cursor-pointer ${
                      targetWindowIndex === idx
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    W{w.windowNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: LM Studio AI Choreography */}
        {activeTab === 'ai' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-zinc-50/50">
            {/* Action Bar */}
            <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {isEn ? `AI Camera Direction for ${windows.length} Windows` : `KI-Kameraregie für ${windows.length} Windows`}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isEn
                    ? 'Choreographs Intro drone, Steadicam walkthrough, 100mm macro tactile details & sunset crane crane-up.'
                    : 'Choreografiert Intro-Drohne, Steadicam-Walkthrough, 100mm Macro-Haptik & Sunset-Kranaufzug.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiCameraPlan}
                disabled={isGeneratingAiPlan}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isGeneratingAiPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isEn ? 'LM Studio choreographing...' : 'LM Studio choreografiert...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>{isEn ? '⚡ Generate AI Camera Plan' : '⚡ Jetzt KI-Kameraführung generieren'}</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Result */}
            {aiCameraPlan ? (
              <div className="space-y-4">
                {aiDirectorVision && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1 text-xs text-amber-950 font-medium leading-relaxed">
                    <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                      {isEn ? '🎬 DoP Director Vision:' : '🎬 Regie-Vision des DoP:'}
                    </span>
                    {aiDirectorVision}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiCameraPlan.map((item, idx) => {
                    const winNum = item.windowIndex !== undefined ? item.windowIndex + 1 : idx + 1;
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-zinc-200 p-4 rounded-xl shadow-2xs space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-zinc-900 text-white rounded-md">
                              Window {winNum}
                            </span>
                            {item.lensAndRig && (
                              <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[180px]">
                                {item.lensAndRig}
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-zinc-900">{item.movementTitle}</h4>

                          {item.dramaturgyReason && (
                            <p className="text-[11px] text-zinc-600 italic leading-snug">
                              „{item.dramaturgyReason}“
                            </p>
                          )}
                        </div>

                        <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-[11px] font-mono text-zinc-800 line-clamp-3">
                          {item.movementPrompt}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onApplyCameraMovementToWindow(
                              item.windowIndex !== undefined ? item.windowIndex : idx,
                              item.movementPrompt
                            );
                            onShowToast('success', isEn ? `Camera movement applied to Window ${winNum}!` : `Kamerabewegung auf Window ${winNum} angewendet!`);
                          }}
                          className="w-full py-1.5 bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-800 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-amber-500" />
                          <span>{isEn ? `Apply to Window ${winNum}` : `Auf Window ${winNum} anwenden`}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-white border border-dashed border-zinc-300 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-zinc-800">
                  {isEn ? 'No AI Camera Choreography generated yet' : 'Noch keine KI-Kamera-Choreografie generiert'}
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                  {isEn
                    ? 'Click on "⚡ Generate AI Camera Plan" above to let LM Studio calculate a coordinated 4-window sequence.'
                    : 'Klicke oben auf „⚡ Jetzt KI-Kameraführung generieren“, um eine aufeinander abgestimmte 4-Window Dramaturgie von LM Studio berechnen zu lassen.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Catalog Library */}
        {activeTab === 'library' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-zinc-50/50">
            {/* Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {preset.badge}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {preset.lensRecommendation}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-zinc-900">{preset.name}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{preset.description}</p>
                  </div>

                  <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-[11px] font-mono text-zinc-800 space-y-1">
                    <div className="text-[10px] font-sans font-bold text-zinc-500">{isEn ? 'Prompt Text:' : 'Prompt-Text:'}</div>
                    <div className="line-clamp-2">{preset.suggestedPrompt}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyCameraMovementToWindow(targetWindowIndex, preset.suggestedPrompt);
                      onShowToast(
                        'success',
                        isEn
                          ? `"${preset.name}" applied to Window ${windows[targetWindowIndex]?.windowNumber || targetWindowIndex + 1}!`
                          : `"${preset.name}" auf Window ${windows[targetWindowIndex]?.windowNumber || targetWindowIndex + 1} angewendet!`
                      );
                    }}
                    className="w-full py-2 bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-800 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isEn ? `Apply to Window ${windows[targetWindowIndex]?.windowNumber || targetWindowIndex + 1}` : `Auf Window ${windows[targetWindowIndex]?.windowNumber || targetWindowIndex + 1} anwenden`}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {isEn ? 'Close' : 'Schließen'}
          </button>

          <div className="flex items-center gap-2">
            {aiCameraPlan ? (
              <button
                type="button"
                onClick={handleApplyAiPlanToAll}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEn ? `Apply AI Plan to all ${windows.length} Windows` : `KI-Plan auf alle ${windows.length} Windows anwenden`}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAutoApplyAllDefault}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Apply Standard Plan' : 'Standard-Plan anwenden'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
