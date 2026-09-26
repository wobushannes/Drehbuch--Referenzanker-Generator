import React from 'react';
import { Camera, Eye } from 'lucide-react';

export interface CinemaLensOption {
  id: string;
  name: string;
  category: string;
  opticalSignature: string;
  bestFor: string;
  promptDirective: string;
}

export const CINEMA_LENS_PORTFOLIO: CinemaLensOption[] = [
  {
    id: 'auto',
    name: '🤖 Auto-Regie (LM Studio wählt die beste Linse pro Szene)',
    category: 'KI-Regisseur',
    opticalSignature: 'Szenen-spezifische dynamische Linsenauswahl',
    bestFor: 'Automatische perfekte Zuordnung je nach Stimmung, Einstellungsgröße und Lichtverhältnissen',
    promptDirective: 'Intelligently select the most fitting cinematic prime lens per shot (Cooke for portraits, Kowa for wide epic flares, Helios for vintage nature, Leica Noctilux for macro isolation, Dream Lens for morning glow, Zeiss for crisp architecture).',
  },
  {
    id: 'cooke',
    name: 'Cooke Speed Panchro / S4 (Der legendäre „Cooke Look“)',
    category: 'Warm & Emotional',
    opticalSignature: 'Seidige warme Hauttöne, samtig-weicher Schärfeabfall, edle malerische Schatten',
    bestFor: 'Porträts, Coaching, Empathie, emotionale Dialoge, intime Szenen',
    promptDirective: 'Shot on Cooke Speed Panchro 50mm T2.3, signature Cooke Look, painterly warm skin tones, gentle organic focus roll-off, subtle amber warmth in shadows.',
  },
  {
    id: 'helios',
    name: 'Helios 44-2 58mm f/2 (Vintage Swirly Bokeh)',
    category: 'Vintage Natur',
    opticalSignature: 'Zirkuläres rotierendes Swirly Bokeh, knackscharfe Mitte, samtige Randabfälle',
    bestFor: 'Wald, Natur, Achtsamkeit, Moos & Steine, nostalgische Outdoor-Aufnahmen',
    promptDirective: 'Vintage Helios 44-2 58mm f/2 optical lens character, razor-sharp foreground focus with characteristic soft swirly circular background blur and cat-eye bokeh at edges.',
  },
  {
    id: 'noctilux',
    name: 'Leica Noctilux-M 50mm f/0.95 (Extremer 3D-Pop & Schmelz)',
    category: 'High-End Freistellung',
    opticalSignature: 'Messerscharfe Freistellung f/0.95, 3D-Pop-Effekt, butterweich verschmelzender Hintergrund',
    bestFor: 'Extreme Close-Ups, Fokus auf Augen/Blickkontakt, Haptik von Fingerkuppen',
    promptDirective: 'Shot on Leica Noctilux-M 50mm f/0.95 ASPH optical profile, razor-thin depth of field, dramatic 3D subject pop separation against buttery smooth melted background bokeh.',
  },
  {
    id: 'dream',
    name: 'Canon 50mm f/0.95 „Dream Lens“ (Märchenhafter Lichterglanz)',
    category: 'Mystisch & Meditativ',
    opticalSignature: 'Sanfte Blooming-Halation um Lichter, weiche sphärische Kanten, verträumter Glanz',
    bestFor: 'Frühmorgendlicher Nebel, Sonnenaufgänge, spirituelle Stille, Entspannung',
    promptDirective: 'Canon 50mm f/0.95 Dream Lens optical character, gentle ethereal blooming on highlights, dreamy spherical softness around frame perimeter, glowing morning mist.',
  },
  {
    id: 'kowa',
    name: 'Kowa Vintage Anamorphic 40mm (Cinemascope Flares)',
    category: 'Hollywood Widescreen',
    opticalSignature: '2x vertikal-ovales Bokeh, horizontale bernsteinfarbene Streak-Flares, Cinemascope-Tiefe',
    bestFor: 'Berg-Panoramen, weite Täler, goldenes Gegenlicht, epische Establishing-Shots',
    promptDirective: 'Vintage Kowa Anamorphic 40mm prime lens, distinctive vertical oval bokeh, subtle horizontal amber streak flare catching early morning sun, gentle anamorphic barrel distortion.',
  },
  {
    id: 'zeiss',
    name: 'ARRI / Zeiss Master Prime (Präzision & Werbe-Perfektion)',
    category: 'Modern Commercial',
    opticalSignature: 'Absolut randscharf, null Verzerrung, klinisch sauberes kreisrundes Bokeh, 8K-Klarheit',
    bestFor: 'Moderne Architektur, Luxus-Lifestyle, Produkte, High-End Imagefilme',
    promptDirective: 'ARRI/Zeiss Master Prime 35mm T1.3, pristine optical clarity, ultra-clean modern cinema contrast, distortion-free framing, clean circular bokeh.',
  },
];

export const getCinemaLensPortfolio = (lang: string = 'DE'): CinemaLensOption[] => {
  const isEn = (lang || '').toUpperCase() === 'EN';
  return [
    {
      id: 'auto',
      name: isEn ? '🤖 Auto-Directing (LM Studio selects optimal lens per shot)' : '🤖 Auto-Regie (LM Studio wählt die beste Linse pro Szene)',
      category: isEn ? 'AI Director' : 'KI-Regisseur',
      opticalSignature: isEn ? 'Scene-specific dynamic lens selection' : 'Szenen-spezifische dynamische Linsenauswahl',
      bestFor: isEn ? 'Automatic optimal assignment based on mood, shot size and lighting' : 'Automatische perfekte Zuordnung je nach Stimmung, Einstellungsgröße und Lichtverhältnissen',
      promptDirective: 'Intelligently select the most fitting cinematic prime lens per shot (Cooke for portraits, Kowa for wide epic flares, Helios for vintage nature, Leica Noctilux for macro isolation, Dream Lens for morning glow, Zeiss for crisp architecture).',
    },
    {
      id: 'cooke',
      name: isEn ? 'Cooke Speed Panchro / S4 (Legendary "Cooke Look")' : 'Cooke Speed Panchro / S4 (Der legendäre „Cooke Look“)',
      category: isEn ? 'Warm & Emotional' : 'Warm & Emotional',
      opticalSignature: isEn ? 'Silky warm skin tones, smooth focus falloff, painterly shadows' : 'Seidige warme Hauttöne, samtig-weicher Schärfeabfall, edle malerische Schatten',
      bestFor: isEn ? 'Portraits, coaching, emotional dialogues, intimate moments' : 'Porträts, Coaching, Empathie, emotionale Dialoge, intime Szenen',
      promptDirective: 'Shot on Cooke Speed Panchro 50mm T2.3, signature Cooke Look, painterly warm skin tones, gentle organic focus roll-off, subtle amber warmth in shadows.',
    },
    {
      id: 'helios',
      name: isEn ? 'Helios 44-2 58mm f/2 (Vintage Swirly Bokeh)' : 'Helios 44-2 58mm f/2 (Vintage Swirly Bokeh)',
      category: isEn ? 'Vintage Nature' : 'Vintage Natur',
      opticalSignature: isEn ? 'Circular swirly bokeh, razor-sharp center, velvety perimeter falloff' : 'Zirkuläres rotierendes Swirly Bokeh, knackscharfe Mitte, samtige Randabfälle',
      bestFor: isEn ? 'Forest, nature, mindfulness, moss & rock textures, nostalgic outdoor scenes' : 'Wald, Natur, Achtsamkeit, Moos & Steine, nostalgische Outdoor-Aufnahmen',
      promptDirective: 'Vintage Helios 44-2 58mm f/2 optical lens character, razor-sharp foreground focus with characteristic soft swirly circular background blur and cat-eye bokeh at edges.',
    },
    {
      id: 'noctilux',
      name: isEn ? 'Leica Noctilux-M 50mm f/0.95 (Extreme 3D Pop & Melt)' : 'Leica Noctilux-M 50mm f/0.95 (Extremer 3D-Pop & Schmelz)',
      category: isEn ? 'Ultra Shallow DOF' : 'High-End Freistellung',
      opticalSignature: isEn ? 'Razor-thin f/0.95 depth of field, 3D pop separation, creamy melted background' : 'Messerscharfe Freistellung f/0.95, 3D-Pop-Effekt, butterweich verschmelzender Hintergrund',
      bestFor: isEn ? 'Extreme close-ups, eye-lock focus, tactile fingertips & textures' : 'Extreme Close-Ups, Fokus auf Augen/Blickkontakt, Haptik von Fingerkuppen',
      promptDirective: 'Shot on Leica Noctilux-M 50mm f/0.95 ASPH optical profile, razor-thin depth of field, dramatic 3D subject pop separation against buttery smooth melted background bokeh.',
    },
    {
      id: 'dream',
      name: isEn ? 'Canon 50mm f/0.95 "Dream Lens" (Ethereal Highlight Bloom)' : 'Canon 50mm f/0.95 „Dream Lens“ (Märchenhafter Lichterglanz)',
      category: isEn ? 'Mystical & Meditative' : 'Mystisch & Meditativ',
      opticalSignature: isEn ? 'Gentle bloom halation on speculars, soft spherical edges, dreamy glow' : 'Sanfte Blooming-Halation um Lichter, weiche sphärische Kanten, verträumter Glanz',
      bestFor: isEn ? 'Early morning mist, golden hour sunrises, spiritual calm, contemplation' : 'Frühmorgendlicher Nebel, Sonnenaufgänge, spirituelle Stille, Entspannung',
      promptDirective: 'Canon 50mm f/0.95 Dream Lens optical character, gentle ethereal blooming on highlights, dreamy spherical softness around frame perimeter, glowing morning mist.',
    },
    {
      id: 'kowa',
      name: isEn ? 'Kowa Vintage Anamorphic 40mm (Cinemascope Flares)' : 'Kowa Vintage Anamorphic 40mm (Cinemascope Flares)',
      category: isEn ? 'Hollywood Widescreen' : 'Hollywood Widescreen',
      opticalSignature: isEn ? '2x vertical oval bokeh, horizontal amber streak flares, anamorphic depth' : '2x vertikal-ovales Bokeh, horizontale bernsteinfarbene Streak-Flares, Cinemascope-Tiefe',
      bestFor: isEn ? 'Mountain vistas, expansive valleys, backlit establishing shots' : 'Berg-Panoramen, weite Täler, goldenes Gegenlicht, epische Establishing-Shots',
      promptDirective: 'Vintage Kowa Anamorphic 40mm prime lens, distinctive vertical oval bokeh, subtle horizontal amber streak flare catching early morning sun, gentle anamorphic barrel distortion.',
    },
    {
      id: 'zeiss',
      name: isEn ? 'ARRI / Zeiss Master Prime (Commercial Precision)' : 'ARRI / Zeiss Master Prime (Präzision & Werbe-Perfektion)',
      category: isEn ? 'Modern Commercial' : 'Modern Commercial',
      opticalSignature: isEn ? 'Corner-to-corner sharpness, zero distortion, surgical circular bokeh, 8K clarity' : 'Absolut randscharf, null Verzerrung, klinisch sauberes kreisrundes Bokeh, 8K-Klarheit',
      bestFor: isEn ? 'Modern architecture, luxury lifestyle, high-end commercial imagery' : 'Moderne Architektur, Luxus-Lifestyle, Produkte, High-End Imagefilme',
      promptDirective: 'ARRI/Zeiss Master Prime 35mm T1.3, pristine optical clarity, ultra-clean modern cinema contrast, distortion-free framing, clean circular bokeh.',
    },
  ];
};

interface LensSelectorCardProps {
  enabled?: boolean;
  selectedLens?: string;
  onToggle: (enabled: boolean) => void;
  onSelectLens: (lensId: string) => void;
  language?: string;
}

export const LensSelectorCard: React.FC<LensSelectorCardProps> = ({
  enabled = false,
  selectedLens = 'auto',
  onToggle,
  onSelectLens,
  language = 'DE',
}) => {
  const isEn = (language || '').toUpperCase() === 'EN';
  const lenses = getCinemaLensPortfolio(language);
  const currentLens = lenses.find((l) => l.id === selectedLens) || lenses[0];

  return (
    <div
      className={`rounded-2xl border transition-all p-5 shadow-xs ${
        enabled
          ? 'bg-gradient-to-br from-indigo-950/90 via-zinc-900 to-zinc-950 text-white border-indigo-500/40 ring-1 ring-indigo-500/20'
          : 'bg-white border-zinc-200 text-zinc-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 ${
                enabled
                  ? 'bg-indigo-400 text-zinc-950'
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>{isEn ? 'Cinema Lens Portfolio' : 'Kino-Objektiv Portfolio'}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                enabled ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {isEn ? 'Optical Signature & Bokeh Engine' : 'Optische Signatur & Bokeh-Engine'}
            </span>
          </div>

          <h3 className="text-sm font-bold flex items-center gap-2">
            <span>
              {isEn ? 'Famous Cinema Optics & Lens Character' : 'Berühmte Kamera-Optiken & Linsen-Charakteristik'}
            </span>
          </h3>

          <p className={`text-xs leading-relaxed ${enabled ? 'text-zinc-300' : 'text-zinc-500'}`}>
            {isEn ? (
              <>
                Defines physical glass characteristics (e.g.,{' '}
                <span className={enabled ? 'text-indigo-300 font-semibold' : 'font-semibold'}>
                  Cooke Speed Panchro, Leica Noctilux f/0.95, Helios Swirly Bokeh, Kowa Anamorphic, or Canon Dream Lens
                </span>
                ) or lets LM Studio automatically pick the dramaturgically optimal prime lens.
              </>
            ) : (
              <>
                Definiert die physikalische Glas-Charakteristik (z. B.{' '}
                <span className={enabled ? 'text-indigo-300 font-semibold' : 'font-semibold'}>
                  Cooke Speed Panchro, Leica Noctilux f/0.95, Helios Swirly Bokeh, Kowa Anamorphic oder Canon Dream Lens
                </span>
                ) oder lässt LM Studio automatisch die dramaturgisch beste Linse wählen.
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
              enabled ? 'bg-indigo-500' : 'bg-zinc-300'
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

      {/* Lens Dropdown & Details when enabled */}
      {enabled && (
        <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold text-indigo-200 mb-1">
                {isEn ? 'Selected Optic / Director Mode:' : 'Gewählte Optik / Regie-Modus:'}
              </label>
              <select
                value={selectedLens}
                onChange={(e) => onSelectLens(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-900 border border-indigo-500/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {lenses.map((lens) => (
                  <option key={lens.id} value={lens.id}>
                    {lens.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-7 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">{isEn ? 'Optical Effect:' : 'Optischer Effekt:'}</span>
                <span className="font-bold text-indigo-300">{currentLens.category}</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                {currentLens.opticalSignature}
              </p>
              <div className="text-[10px] text-zinc-400 pt-0.5">
                <strong className="text-zinc-300">{isEn ? 'Recommended for:' : 'Empfohlen für:'}</strong> {currentLens.bestFor}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
