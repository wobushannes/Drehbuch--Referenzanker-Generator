import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Sun,
  Music,
  Volume2,
  Trees,
  CheckCircle2,
  RefreshCw,
  X,
  Copy,
  Check,
  Layers,
  Sliders,
  Type,
} from 'lucide-react';
import { TargetAudience } from '../../types';
import { Language } from '../../utils/i18n';

interface ColorItem {
  name: string;
  hex: string;
  usage?: string;
}

interface DesignConcept {
  themeTitle: string;
  lightAndAtmosphere: string;
  colorPalette: ColorItem[];
  materialWorld: string;
  soundAndMusic: string;
  typographyAndCI: string;
  globalWeatherSuggestion: string;
  globalBackgroundSuggestion: string;
  globalMusicSuggestion: string;
  globalSoundDesignSuggestion: string;
  source?: string;
}

interface DesignConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAudience: TargetAudience;
  onApplyDesign: (design: {
    globalWeather: string;
    globalBackground: string;
    globalMusic: string;
    globalSoundDesign: string;
    colorPalette?: ColorItem[];
    themeTitle?: string;
  }) => void;
  lmStudioEndpoint?: string;
  lmStudioModel?: string;
  lmStudioApiKey?: string;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  language?: Language;
}

export const DesignConceptModal: React.FC<DesignConceptModalProps> = ({
  isOpen,
  onClose,
  targetAudience,
  onApplyDesign,
  lmStudioEndpoint,
  lmStudioModel,
  lmStudioApiKey,
  onShowToast,
  language = 'DE',
}) => {
  const isEn = language === 'EN';
  const [isLoading, setIsLoading] = useState(false);
  const [design, setDesign] = useState<DesignConcept | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateDesign = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/screenplay/suggest-design-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: lmStudioEndpoint || 'http://localhost:1234/v1',
          modelName: lmStudioModel || 'local-model',
          apiKey: lmStudioApiKey || '',
          targetAudience,
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      if (data.success && data.design) {
        setDesign(data.design);
        onShowToast(
          'success',
          data.source === 'lmstudio'
            ? (isEn ? 'Design & Look concept generated via LM Studio!' : 'Design- & Look-Konzept via LM Studio generiert!')
            : (isEn ? 'Design & Look concept created (Intelligent Mode)!' : 'Design- & Look-Konzept erstellt (Intelligenter Modus)!')
        );
      } else {
        throw new Error(data.error || (isEn ? 'Error creating design concept' : 'Fehler beim Erstellen des Design-Konzepts'));
      }
    } catch (err: any) {
      console.error('Design generation failed:', err);
      onShowToast('error', `${isEn ? 'Design generation failed' : 'Design-Generierung fehlgeschlagen'}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!design) return;
    onApplyDesign({
      globalWeather: design.globalWeatherSuggestion,
      globalBackground: design.globalBackgroundSuggestion,
      globalMusic: design.globalMusicSuggestion,
      globalSoundDesign: design.globalSoundDesignSuggestion,
      colorPalette: design.colorPalette,
      themeTitle: design.themeTitle,
    });
    onShowToast('success', isEn ? 'Design, lighting and sound settings applied to screenplay!' : 'Design-, Licht- und Sound-Vorgaben ins Drehbuch übernommen!');
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
    onShowToast('info', isEn ? `Color code "${text}" copied to clipboard.` : `Farbwert "${text}" in die Zwischenablage kopiert.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900">
                  {isEn ? 'LM Studio Design & Look Director' : 'LM Studio Design- & Look-Director'}
                </h2>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-bold rounded-full font-mono">
                  {isEn ? 'Audience Aesthetics' : 'Zielgruppen-Ästhetik'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {isEn
                  ? 'Generate lighting mood, color palette, tactile materials, and sound design tailored to '
                  : 'Generiere Lichtstimmung, Farbpalette, Haptik und Sounddesign abgestimmt auf '}
                <strong className="text-zinc-800 font-semibold">{targetAudience.name}</strong>.
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-zinc-50/50">
          {/* Top Audience Reminder & Action */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900">{targetAudience.name}</span>
                <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full font-mono">
                  {targetAudience.badge || targetAudience.ageGroup}
                </span>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {targetAudience.psychology}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateDesign}
              disabled={isLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{isEn ? 'LM Studio analyzing look...' : 'LM Studio analysiert Look...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isEn ? '⚡ Generate Design Concept' : '⚡ Design-Vorschlag generieren'}</span>
                </>
              )}
            </button>
          </div>

          {/* Design Result View */}
          {design ? (
            <div className="space-y-4">
              {/* Theme Title Banner */}
              <div className="bg-zinc-900 text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    {isEn ? 'Creative Look Concept:' : 'Kreatives Look-Konzept:'}
                  </span>
                  <h3 className="text-base font-bold">{design.themeTitle}</h3>
                </div>
                {design.source === 'lmstudio' && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono">
                    ✓ via LM Studio
                  </span>
                )}
              </div>

              {/* Color Palette Swatches */}
              <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600" />
                    {isEn ? 'Harmonious Color Palette & Material Accents' : 'Harmonische Farbpalette & Materialakzente'}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">{isEn ? 'Click to copy' : 'Klick zum Kopieren'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {design.colorPalette?.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => copyToClipboard(c.hex)}
                      className="group p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition text-left cursor-pointer flex flex-col justify-between space-y-2"
                    >
                      <div
                        className="w-full h-12 rounded-lg border border-black/10 shadow-inner flex items-center justify-center transition group-hover:scale-[1.02]"
                        style={{ backgroundColor: c.hex }}
                      >
                        {copiedHex === c.hex && (
                          <div className="bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {isEn ? 'Copied' : 'Kopiert'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 truncate">{c.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{c.hex}</span>
                        </div>
                        {c.usage && (
                          <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{c.usage}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2-Column Grid for Lighting & Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lighting & Atmosphere */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    {isEn ? 'Lighting Direction & Atmosphere' : 'Lichtführung & Atmosphäre (Beleuchtung)'}
                  </h4>
                  <p className="text-xs text-zinc-700 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 font-medium">
                    {design.lightAndAtmosphere}
                  </p>
                  <div className="text-[11px] text-zinc-500 font-mono pt-1">
                    <strong>Global Prompt:</strong> {design.globalWeatherSuggestion}
                  </div>
                </div>

                {/* Material World & Architecture */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    {isEn ? 'Materials, Tactility & Textures' : 'Materialwelt, Haptik & Texturen'}
                  </h4>
                  <p className="text-xs text-zinc-700 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-200/60 font-medium">
                    {design.materialWorld}
                  </p>
                  <div className="text-[11px] text-zinc-500 font-mono pt-1">
                    <strong>{isEn ? 'Setting:' : 'Kulisse:'}</strong> {design.globalBackgroundSuggestion}
                  </div>
                </div>
              </div>

              {/* 2-Column Grid for Sound/Music & Typography */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sound & Music */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Music className="w-4 h-4 text-indigo-600" />
                    {isEn ? 'Sound Design & Acoustic Signature' : 'Sounddesign & Akustische Signatur'}
                  </h4>
                  <p className="text-xs text-zinc-700 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-200/60 font-medium">
                    {design.soundAndMusic}
                  </p>
                  <div className="text-[11px] text-zinc-500 font-mono pt-1">
                    <strong>{isEn ? 'Foley & Haptics:' : 'Foley & Haptik:'}</strong> {design.globalSoundDesignSuggestion}
                  </div>
                </div>

                {/* Typography & CI */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <Type className="w-4 h-4 text-purple-600" />
                    {isEn ? 'Typography & Brand / CI Overlays' : 'Typografie & CI-Einblendungen'}
                  </h4>
                  <p className="text-xs text-zinc-700 leading-relaxed bg-purple-50/50 p-3 rounded-lg border border-purple-200/60 font-medium">
                    {design.typographyAndCI}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3 bg-white border border-dashed border-zinc-300 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800">
                {isEn ? 'No design concept generated yet' : 'Noch kein Design-Konzept generiert'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                {isEn
                  ? <>Click on <strong>„⚡ Generate Design Concept“</strong> above to create a color, lighting and sound profile tailored for <strong>{targetAudience.name}</strong> with LM Studio.</>
                  : <>Klicke oben auf <strong>„⚡ Design-Vorschlag generieren“</strong>, um mit LM Studio ein perfekt abgestimmtes Farb-, Licht- und Soundprofil für <strong>{targetAudience.name}</strong> zu erstellen.</>}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {isEn ? 'Cancel' : 'Abbrechen'}
          </button>

          {design && (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEn ? '✨ Apply to screenplay & global settings' : '✨ In Drehbuch & globale Einstellungen übernehmen'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
