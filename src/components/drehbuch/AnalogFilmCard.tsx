import React, { useState } from 'react';
import {
  Camera,
  Film,
  Zap,
  CheckCircle2,
  Sliders,
  Info,
  ShieldCheck,
  Sun,
  Eye,
  Palette,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  Layers,
  HelpCircle,
} from 'lucide-react';

export interface AnalogProfile {
  id: string;
  name: string;
  camera: string;
  lens: string;
  chemistry: string;
  description: string;
  colorShift: string;
  grain: string;
  flare: string;
  badge?: string;
  badgeStyle?: string;
  paletteColors?: string[];
  recommendedTemp?: string;
}

export const ANALOG_PROFILES: AnalogProfile[] = [
  {
    id: 'fujicolor_eterna_500t',
    name: 'Fujicolor Eterna 500T Master Plugin (8573 • ECN-2 • Die Falsifikation)',
    camera: 'Arriflex 535B / Arricam ST (35mm Motion Picture Celluloid)',
    lens: 'Zeiss Master Prime (35mm / 50mm / 85mm T1.3 & 100mm Macro T2.0)',
    chemistry: 'Fujicolor Eterna 500T (8573) in nativer ECN-2 Chemie (4th Color Layer)',
    description: 'Das offizielle Fujicolor Eterna 500T Master Plugin für den 6-teiligen Zyklus "Die Falsifikation". Emuliert die legendäre japanische Eterna-Emulsion mit 4th Color Layer Technologie: Kühle, gedeckte Schattentiefe (Obsidian D-Max), unbarmherzige Muted Colors, aschige Schiefertöne, messerscharfe Trennung von 5000K-Tageslicht und Kunstlicht/Displays, mikroskopische Texturschärfe auf Deckenstaub und Stoffgewebe sowie natürlicher Highlight-Rolloff mit strikt ZERO roter Halation.',
    colorShift: 'Gedämpfte Muted Colors, kühle Schiefertöne in den Schatten, saubere 4th-Color-Layer Farbtrennung, neutrale Hauttöne & tiefes samtiges Obsidian D-Max',
    grain: 'Organisches, mikro-feines 500T Silberhalogenid-Korn mit überragender Plastizität auf Kalkstaub, nasser Wolle und gerissener Bausubstanz',
    flare: 'Strikt ZERO rote Halation (intakte ECN-2 Remjet-Rußschicht), mikropräzise reflexionsarme T1.3 Linsenzeichnung',
    badge: 'Master Plugin v4.0',
    badgeStyle: 'bg-cyan-500/15 text-cyan-950 border-cyan-500/40',
    paletteColors: ['#1E293B', '#475569', '#94A3B8', '#090D16'],
    recommendedTemp: '4800K/5000K ECN-2'
  },
  {
    id: 'agfachrome_ct18',
    name: 'Agfachrome CT18 Master Plugin (AP-41 Reversal • Das Erlöschen des Spektrums)',
    camera: 'Arriflex 35 BL4 / Leica M4 Rangefinder (Photochemical 35mm)',
    lens: 'Carl Zeiss Sonnar 40mm f/2.8 HFT & Planar 50mm T1.4 (Pure Optical Macro)',
    chemistry: 'Agfacolor AP-41 Reversal Chemistry (Cold Sage, Muted Ocher & Watercolor Dye)',
    description: 'Das offizielle Agfachrome CT18 Master Plugin für den 6-teiligen Film-Zyklus "Das Erlöschen des Spektrums". Emuliert die legendäre deutsche AP-41 Farbumkehr-Chemie: Entsättigung warmer Farbtöne, kalte Salbei- & Schiefergrün-Schatten, bernsteinfarbenes Glühen verfallender Zivilisation und malerisches Farbstoffkorn mit weichem Highlight-Rolloff ohne digitale AI-Glättung.',
    colorShift: 'Subtile Entsättigung, pastellige Salbei- & Schiefergrün-Schatten, verblassendes Ocker, aschige Hauttöne & sanftes D-Max Tiefschwarz',
    grain: 'Ausgeprägtes, malerisches AP-41 Farbstoffkorn mit weichen Kanten, mikroskopischer Plastizität auf Hautstaub, Rissen und Glasbruch',
    flare: 'Diffuser analoger Lichthof an extremen Lichtkanten, gedämpftes Glühen ohne digitales Blooming',
    badge: 'Master Plugin v3.0',
    badgeStyle: 'bg-emerald-500/15 text-emerald-950 border-emerald-500/40',
    paletteColors: ['#2A4736', '#879883', '#D4B483', '#1A1E1C'],
    recommendedTemp: '5000K AP-41'
  },
  {
    id: 'kodak_5247',
    name: 'Kodak 5247 Master Plugin (100T • ENR Bleach-Bypass)',
    camera: 'Arriflex 35 III / Panavision Panaflex Gold II (35mm Cine)',
    lens: 'Zeiss Super Speed Mk II (T1.3 Primes: 35mm / 50mm / 100mm Macro)',
    chemistry: 'Kodak 5247 100T Color Negative (100% ENR Silver-Retention Bleach-Bypass)',
    description: 'Das offizielle Kodak 5247 Master Plugin für die 6-teilige Katastrophen-Dramaturgie. Emuliert den legendären 100T Kinofilm mit 100% ENR Bleach-Bypass: Stark entsättigte Farben, brutaler Mikrokontrast durch metallische Silberrückhaltung, clashing 5500K Daylight vs. 2800K Tungsten und abgrundtiefes D-Max Schwarz.',
    colorShift: 'Strikte Entsättigung, eiskaltes 5500K Tageslicht prallt auf 2800K Tungsten, metallischer Silberschimmer, stahlblaue Schatten & tiefschwarzes D-Max',
    grain: 'Nadelscharfes 100T Silberhalogenid-Korn mit plastischer Mikroschärfe auf Poren, Hautstaub und zerborstenem Glas',
    flare: 'Harte Lichtkanten, klinische T1.3 Reflexionen ohne Weichzeichner, metallische Glanzlichter',
    badge: 'Master Plugin v2.2',
    badgeStyle: 'bg-amber-500/15 text-amber-900 border-amber-500/40',
    paletteColors: ['#0F172A', '#334155', '#D97706', '#F8FAFC'],
    recommendedTemp: '5500K/2800K Clash'
  },
  {
    id: 'art_noir',
    name: 'Mamiya RZ67 Pro II (120 Mittelformat • Studio Noir)',
    camera: 'Mamiya RZ67 Pro II (6x7 Mittelformat)',
    lens: 'Mamiya Sekor Z 110mm f/2.8 W / Sekor Z 140mm Macro',
    chemistry: 'Kodak Tri-X 400 / Ilford HP5 Plus (120 Rollfilm S/W, D-76 Push +1)',
    description: 'Radikaler Chiaroscuro-Kontrast im Stil klassischer Studio-Porträts, samtiges D-Max Tiefschwarz ohne Streulicht, organisch fühlbares 120er Silbersalzkorn und kompromisslose mikroskopische Textur ohne künstliche CGI-Glättung.',
    colorShift: 'Streng monochrom (Schwarz-Weiß), steile Gradationskurve, reines Silber-Graustufenspektrum, samtig pechschwarzer Negativraum-Hintergrund',
    grain: 'Sichtbares, haptisch fühlbares 120mm Mittelformat-Silbersalzkorn mit organischer Struktur und überragender Plastizität',
    flare: 'Kein Schleier; rasiermesserscharfe Lichtkanten durch tiefes Rembrandt-Oberlicht',
    badge: 'Mittelformat S/W',
    badgeStyle: 'bg-zinc-900 text-zinc-100 border-zinc-700',
    paletteColors: ['#000000', '#27272A', '#71717A', '#F4F4F5'],
    recommendedTemp: 'Monochrom Chiaroscuro'
  },
  {
    id: 'kodachrome',
    name: 'Kodachrome 64 Master Plugin (K-14 Dia)',
    camera: 'Leica M3 Rangefinder / Bolex H16',
    lens: 'Leitz Summicron 50mm f/2 Rigid (5500K Tageslicht-Kalibriert)',
    chemistry: 'Kodachrome 64 Reversal Slide Film (K-14 Dreifarben-Subtraktiv)',
    description: 'Das offizielle Kodachrome 64 Plugin für absolute Farbtreue. Erzeugt leuchtendes Zinnoberrot und natürliche Hauttöne bei reinweißem Augenweiß (Sklera-Schutz). Verhindert den berüchtigten gelblichen Sepia-Drift.',
    colorShift: '5500K Reines Tageslicht, neutrale Sklera (Augenweiß), isoliertes Karminrot auf natürlicher Pfirsichhaut, samtiges Obsidian D-Max Tiefschwarz',
    grain: 'Extrem feines, rasiermesserscharfes Farbstoff-Korn für plastischen Realismus ohne Kantenüberschärfung',
    flare: 'Sanfte 650nm Karminrot-Halation an extremen Lichtübergängen',
    badge: 'Master Plugin v1.0',
    badgeStyle: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    paletteColors: ['#DC2626', '#F59E0B', '#FDE68A', '#0F172A'],
    recommendedTemp: '5500K Neutral'
  },
  {
    id: 'cinestill_800t',
    name: 'CineStill 800T Master Plugin (Tungsten & 650nm Halation)',
    camera: 'Arriflex 35 III / Leica M6 Cine-Mod',
    lens: 'Zeiss Super Speed 50mm T1.3 MK II / Cooke Speed Panchro',
    chemistry: 'Kodak Vision3 500T (5219) mit entfernter Remjet-Rußschicht, C-41 / ECN-2 Chemie',
    description: 'Das offizielle CineStill 800T Master Plugin für cinematische Nacht- und Kunstlicht-Ästhetik. Durch die mechanische Entfernung der Remjet-Rückschicht streut Licht direkt in die rote Emulsionsschicht und erzeugt die ikonische 650nm karminrote Halation um Punktlichtquellen, Neonschilder und Glanzlichter.',
    colorShift: '3200K Kunstlicht-Abstimmung (Tungsten), kühle Cyan-Kobalt-Schatten, leuchtend warmes Kunstlicht und samtiges Tiefschwarz',
    grain: 'Charakteristisches feines Kinofilm-Korn (Vision3 500T Stock) mit organischer Mikroschärfe',
    flare: 'Ikonische karminrote 650nm Halation-Aura (Remjet-Removal Bleed) um Lichtquellen, Glühlampen und metallische Reflexionen',
    badge: 'Master Plugin v1.0',
    badgeStyle: 'bg-red-500/10 text-red-700 border-red-500/30',
    paletteColors: ['#EF4444', '#06B6D4', '#F59E0B', '#09090B'],
    recommendedTemp: '3200K Tungsten'
  },
  {
    id: 'leica_noctilux',
    name: 'Leica Noctilux-M f/0.95 (Katzenaugen-Pop)',
    camera: 'Leica M11 Rangefinder',
    lens: 'Noctilux-M 50mm f/0.95 ASPH (Extremer 3D-Pop)',
    chemistry: 'Moderne Kinofilm-Emulsion (Ultrafein)',
    description: 'Unerreichte Schärfentiefe im Millimeterbereich. Objekte heben sich plastisch wie ein 3D-Schnitt aus einem butterweichen, cremig geschmolzenen Hintergrund hervor.',
    colorShift: 'Präzise, neutrale Farbwiedergabe mit feinsten Kontrastabstufungen und perfekter Schärfe',
    grain: 'Ultrafeines, fast unsichtbares Filmkorn für maximale 8K-Klarheit',
    flare: 'Ikonische nieren- und katzenaugenförmige Bokeh-Lichter an den Bildrändern',
    badge: 'Premium Glas',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    paletteColors: ['#059669', '#10B981', '#E2E8F0', '#1E293B'],
    recommendedTemp: '5600K Clean'
  },
  {
    id: '70mm_imax',
    name: '70mm IMAX Large Format (Nolan Cine-Look)',
    camera: 'IMAX MSM 9802 15/70mm Cine-Kamera',
    lens: 'Hasselblad/IMAX Large Format Primes (Optische Spitzenklasse)',
    chemistry: 'Kodak Vision3 250D Tageslicht-Cinefilm (ECN-2)',
    description: 'Das absolute Nonplusultra der analogen Kinematografie. Gigantischer Detailreichtum, immense Tiefenschärfe und weiche, unendliche Raumzeichnung mit extrem feinem Kinokorn.',
    colorShift: 'Perfekte, naturgetreue Farbwiedergabe, extrem weite Lichterzeichnung und sanft abrollende Highlights',
    grain: 'Praktisch unsichtbares, mikro-feines 70mm Edel-Silberkorn mit überragender Bildruhe',
    flare: 'Hochelegante, mikro-präzise Linsenreflexionen ohne störenden Schleier',
    badge: '70mm IMAX',
    badgeStyle: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    paletteColors: ['#7C3AED', '#A78BFA', '#F8FAFC', '#0F172A'],
    recommendedTemp: '5500K Daylight'
  },
  {
    id: 'polaroid_fp100c',
    name: 'Fujifilm FP-100C Trennbild-Farbfilm (Instant-Luxus)',
    camera: 'Polaroid Land Camera 250 (Faltbalgen)',
    lens: 'Tomonon 114mm f/8.8 Triplett-Glaslinse',
    chemistry: 'Peel-Apart Instant Packfilm (Chemische Diffusions-Paste)',
    description: 'Die absolute Definition von haptischem Sofortbild-Luxus. Cremige Farbüberläufe, seidige Pfirsich-Hauttöne und weiche Indigo-Schattierungen.',
    colorShift: 'Seidige pfirsichwarme Hauttöne kontrastiert durch kühle Indigo-Blauschattierungen',
    grain: 'Feines, pastellartiges Korn mit extrem cremigen Schärfeübergängen',
    flare: 'Keine Flares, aber unperfekte braune Guss-Ränder von der Entwicklerpaste',
    badge: 'Instant Dia',
    badgeStyle: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    paletteColors: ['#2563EB', '#F472B6', '#FEF3C7', '#1E1B4B'],
    recommendedTemp: '5200K Soft'
  },
  {
    id: 'svema_zenit',
    name: 'Svema Color & Helios/Jupiter (Sowjet-Lomo)',
    camera: 'Zenit-E / Kiev-19 (35mm SLR)',
    lens: 'Helios-44-2 58mm f/2 or Jupiter-9 85mm f/2 (Wirbelndes Bokeh)',
    chemistry: 'Abgelaufener Svema DS-4 Farbnegativfilm (ca. 1985)',
    description: 'Sibirischer Lomo-Traum. Die Helios/Jupiter-Linsenkombination erzeugt eine verträumte Weichheit und wirbelndes Bokeh auf abgelaufenem Svema-Film.',
    colorShift: 'Tiefes Smaragdgrün/Cyan in den Schatten, warmes Schwefelgelb in den Lichtern',
    grain: 'Massives, wolkenartiges 35mm Farbkorn mit feiner Runzelkorn-Gelatinetextur',
    flare: 'Fette orange-purpurne Lichtlecks (Light Leaks) und kreisrunde Helios-Linsenschleier',
    badge: 'Kult-Hardware',
    badgeStyle: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
    paletteColors: ['#059669', '#F59E0B', '#EF4444', '#134E4A'],
    recommendedTemp: '4500K Vintage'
  },
  {
    id: '35mm_anamorphic',
    name: '35mm Cine-Scope Kodak Vision3 500T (Hollywood-Spielfilm)',
    camera: 'Arriflex 35 IIC / Panavision Panaflex Gold',
    lens: 'Panavision C-Series Anamorphic Prime (f/2.0 Anamorphot)',
    chemistry: 'Kodak Vision3 500T Farbnegativfilm (ECN-2 Prozess)',
    description: 'Der epische Kinolook Hollywoods. Gekennzeichnet durch spektakuläre anamorphotische blaue Linsenstreifen (Horizontal Streaks) und ovale Bokeh-Katzenaugen.',
    colorShift: 'Präzise, kühle Kunstlicht-Abstimmung (T-Film) mit smaragdgrünen und tiefblauen Nachtschatten',
    grain: 'Hauchfeines, lebendiges Kinokorn mit hohem Dynamikumfang in den Halbtönen',
    flare: 'Breite, horizontale blaue Linsen-Lichtstreifen (Streaks) und markante ovale Bokeh-Scheiben',
    badge: '35mm Cine',
    badgeStyle: 'bg-sky-500/10 text-sky-700 border-sky-500/30',
    paletteColors: ['#0284C7', '#0EA5E9', '#38BDF8', '#082F49'],
    recommendedTemp: '3200K Tungsten'
  },
  {
    id: 'technicolor_v4',
    name: 'Technicolor System No. 4 (Golden Hollywood 1935)',
    camera: 'Technicolor Three-Strip DF-24 Beam-Splitter Camera',
    lens: 'Taylor-Hobson Cooke Speed Panchro f/2.0 Glass',
    chemistry: 'Three separate dye-transfer matrices (Cyan/Magenta/Yellow)',
    description: 'Der legendäre Farb-Urvater Hollywoods. Atemberaubend dichte, plastische Primärfarben und samtiges Schwarz mit phantastischer Dreidimensionalität.',
    colorShift: 'Hyper-gesättigte Purpur-, Scharlachrot- und Gelbtöne mit dichten, samtig-schwarzen Schattenstufen',
    grain: 'Absolut kornfreie, butterweiche Farbstoffflächen durch die Farbstoff-Übertragungs-Matrize',
    flare: 'Sanfte diffuse Halation-Höfe um strahlend helle Scheinwerfer',
    badge: 'Vintage 1935',
    badgeStyle: 'bg-violet-500/10 text-violet-700 border-violet-500/30',
    paletteColors: ['#9333EA', '#DC2626', '#EAB308', '#18181B'],
    recommendedTemp: '5000K Studio'
  },
  {
    id: 'krasnogorsk_16mm',
    name: 'Krasnogorsk-3 16mm (Sowjetisches Autorenkino)',
    camera: 'Krasnogorsk-3 (K-3) 16mm Wind-up Cine-Camera',
    lens: 'Meteor 5-1 17-69mm f/1.9 Zoom-Objektiv',
    chemistry: 'Svema OCh-50 16mm Schwarz-Weiß Umkehrfilm',
    description: 'Der rohe, mechanische Geist sowjetischer Kinodokumentationen. Kräftiges Bildstandsflimmern (Gate-Weave), mechanischer Abrieb und markantes Silberkorn.',
    colorShift: 'Kohliges, aschiges S/W mit kernigem Kontrast und rauer Tonalität',
    grain: 'Grobes, flimmerndes 16mm Kinokorn mit sichtbarem Gate-Weave (Bildstandsschwanken)',
    flare: 'Vertikale Lichtstreifen, mechanische Schrammen und Staubpartikel direkt auf der Emulsion',
    badge: 'Autorenkino S/W',
    badgeStyle: 'bg-zinc-700/10 text-zinc-800 border-zinc-700/30',
    paletteColors: ['#000000', '#52525B', '#D4D4D8', '#FFFFFF'],
    recommendedTemp: 'Monochrom'
  },
  {
    id: 'super8_tri_x',
    name: 'Super 8 Kodak Tri-X / Ektachrome (Vintage-Schmalfilm)',
    camera: 'Beaulieu 4008 ZM II / Canon Auto Zoom 1014',
    lens: 'Schneider-Kreuznach Optivaron 6-66mm f/1.8 Zoom',
    chemistry: 'Kodak Tri-X Schwarz-Weiß / Ektachrome 100D Farb-Umkehr',
    description: 'Der Inbegriff des nostalgischen Schmalfilms. Kräftiges Bildstandsflimmern, dichte Körnung, weiche Kanten und die ikonischen rot-gelben Einbrenneffekte.',
    colorShift: 'Warmes, flimmerndes Gelb/Orange; kohlig-weiches Schmalfilm-Monochrom im Schwarz-Weiß-Modus',
    grain: 'Sehr grobes, tanzendes Schmalfilmkorn mit typischen vertikalen Bildschwingungen (8mm Gate-Weave)',
    flare: 'Kräftiges Halo-Überstrahlen, Staubpartikel und orangefarbene Film-Einbrenneffekte',
    badge: 'Schmalfilm 8mm',
    badgeStyle: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
    paletteColors: ['#EA580C', '#F97316', '#FEF08A', '#292524'],
    recommendedTemp: '4200K Schmalfilm'
  },
  {
    id: 'aerochrome_infrared',
    name: 'Kodak Aerochrome IV 2443 (Infrarot-Falschfarben)',
    camera: 'Fairchild K-17 Luftbildkamera / Hasselblad 500ELX',
    lens: 'Carl Zeiss Distagon 40mm f/4 mit Tiffen Wratten 12 Gelbfilter',
    chemistry: 'Infrarot-sensitiver Falschfarben-Ektachrome Umkehrprozess',
    description: 'Militärischer Luftbildfilm zur Tarnungserkennung. Verwandelt organische Vegetation in glühendes Karmesinrot oder Pink, während der Himmel in pechschwarzem Indigo versinkt.',
    colorShift: 'Pflanzen & Bäume leuchten in surrealem Karmesinrot/Neon-Magenta, Himmel versinkt in tiefem Pechschwarz/Indigo',
    grain: 'Mittelgroßes, charakteristisches Farbstoffkorn mit hoher struktureller Kantenschärfe',
    flare: 'Glühende Infrarot-Überstrahlungen (Aura-Bloom) an Reflexionsgrenzen',
    badge: 'Exotisch IR',
    badgeStyle: 'bg-pink-500/10 text-pink-700 border-pink-500/30',
    paletteColors: ['#DB2777', '#EC4899', '#F472B6', '#09090B'],
    recommendedTemp: 'Infrarot Wratten 12'
  },
  {
    id: 'wet_plate',
    name: 'Kollodium-Nassplatte & Silber-Glas (1851 Museum)',
    camera: 'Großformat Holzkamera von 1851 (Balgenzug)',
    lens: 'Rapid Rectilinear Portrait-Objektiv',
    chemistry: 'Echtglasplatte, sensibilisiert im Silbernitratbad',
    description: 'Historisches Orthochromatisches Ur-Verfahren. Reagiert farbblind auf Rottöne: Lippen werden tiefschwarz, Augen leuchten durchdringend und Haut erhält plastische Narbigkeit.',
    colorShift: 'Streng monochrom (Schwarz-Weiß) mit extrem harten, silbernen Kontraststufen',
    grain: 'Kein Filmkorn im modernen Sinne, stattdessen metallischer Silberglanz',
    flare: 'Flecken vom Chemie-Überguss, Kratzer, feine Risse in der getrockneten Gelatine',
    badge: '1851 Museum',
    badgeStyle: 'bg-zinc-700/10 text-zinc-800 border-zinc-700/30',
    paletteColors: ['#09090B', '#3F3F46', '#A1A1AA', '#FAFAFA'],
    recommendedTemp: 'Orthochromatisch'
  },
  {
    id: 'petzval',
    name: 'Petzval 1840 (Extremer Bokeh-Wirbelsturm)',
    camera: 'Daguerreotypie-Kammer (1840)',
    lens: 'Original Joseph Petzval Portrait-Linse f/3.7',
    chemistry: 'Historische monochrome Emulsionsabdeckung',
    description: 'Optische Extreme der Ur-Fotografie: Radiale Bildfeldwölbung reißt den Hintergrund in einen spektakulär kreisenden Wirbelwind um das gestochen scharfe Bildzentrum.',
    colorShift: 'Weicher historischer Kontrast mit sanfter Tönung und dramatischer Randabschattung',
    grain: 'Mittelgroßes, raues Silbersalzkorn',
    flare: 'Starke kreisförmige optische Randabdunklung (Vignette)',
    badge: 'Ur-Vortex 1840',
    badgeStyle: 'bg-yellow-500/10 text-yellow-800 border-yellow-500/30',
    paletteColors: ['#78350F', '#B45309', '#FDE68A', '#1C1917'],
    recommendedTemp: 'Historisch Warm'
  },
  {
    id: 'agfachrome_50s',
    name: 'Agfachrome Professional 50S (Pastell-Traum)',
    camera: 'Rollei 35S / Leica M4 Rangefinder',
    lens: 'Carl Zeiss Sonnar 40mm f/2.8 HFT (Maximale Mikrokontraste)',
    chemistry: 'Klassischer Agfa AP41 Umkehrprozess (ca. 1978)',
    description: 'Die Krone des 70er-Jahre-Pastell-Looks. Sanfte Aquarellfarben, kühle Minztöne und ein weiches Korn, das an impressionistische Malerei erinnert.',
    colorShift: 'Gedämpfte Minz- und Salbeitöne, weiche cremige Hauttöne, samtige Pastellzeichnung',
    grain: 'Ausgeprägtes, malerisches Korn mit weichen Kanten für analoge Zeichnung',
    flare: 'Warme, weichgezeichnete Gegenlichtüberstrahlungen mit minimalem Schärfeverlust',
    badge: 'Pastell AP41',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30',
    paletteColors: ['#06B6D4', '#67E8F9', '#CCFBF1', '#164E63'],
    recommendedTemp: '5000K Soft'
  },
  {
    id: 'orwo_nc21',
    name: 'ORWO Color NC21 (DDR Wolfen Emulation)',
    camera: 'Praktica LTL3 / Pentacon Six Medium Format',
    lens: 'Carl Zeiss Jena Pancolar 50mm f/1.8 (Thorium-Zusatzglas)',
    chemistry: 'Original ORWO C-9165 Entwicklungsprozess (Wolfen, ca. 1972)',
    description: 'Melancholischer Ost-Look. Das linseneigene radioaktive Thoriumglas erzeugt einen warmen Gelb-Gold-Schleier und sanfte Brauntöne.',
    colorShift: 'Erdige, gedeckte Pastelltöne mit warmem Gelb-Gold-Schleier und sanften Brauntönen',
    grain: 'Sehr dichtes, wolkenartiges und angenehm raues Silbersalzkorn',
    flare: 'Zarte gelbliche Lichtschleier durch die linseneigene Gelbfärbung des Thoriumglases',
    badge: 'DDR Kult',
    badgeStyle: 'bg-teal-500/10 text-teal-700 border-teal-500/30',
    paletteColors: ['#0D9488', '#F59E0B', '#FDE68A', '#115E59'],
    recommendedTemp: '4000K Thorium'
  }
];

interface AnalogFilmCardProps {
  enabled: boolean;
  selectedProfileId: string;
  onToggleEnabled: (enabled: boolean) => void;
  onSelectProfile: (profileId: string) => void;
  loraEnabled: boolean;
  onToggleLora: (enabled: boolean) => void;
  actionCode: string;
  onChangeActionCode: (code: string) => void;
  language: 'DE' | 'EN';
  analogLaborStörung?: string;
  onSelectLaborStörung?: (störung: any) => void;
  analogMacroRecipe?: string;
  onSelectMacroRecipe?: (recipe: any) => void;
}

export const AnalogFilmCard: React.FC<AnalogFilmCardProps> = ({
  enabled,
  selectedProfileId,
  onToggleEnabled,
  onSelectProfile,
  loraEnabled,
  onToggleLora,
  actionCode,
  onChangeActionCode,
  language = 'DE',
  analogLaborStörung = 'none',
  onSelectLaborStörung,
  analogMacroRecipe = 'none',
  onSelectMacroRecipe,
}) => {
  const currentProfile = ANALOG_PROFILES.find((p) => p.id === selectedProfileId) || ANALOG_PROFILES[0];
  const [activeCategory, setActiveCategory] = useState<'all' | 'favorites' | 'photo' | 'cine' | 'historic'>('favorites');
  const [showSpecsSheet, setShowSpecsSheet] = useState(false);
  const [showLabSection, setShowLabSection] = useState(false);

  // Group definitions for clear filtering
  const FAVORITES_IDS = ['fujicolor_eterna_500t', 'agfachrome_ct18', 'kodak_5247', 'kodachrome', 'cinestill_800t', 'art_noir', 'leica_noctilux', '70mm_imax'];
  const PHOTO_CLASSIC_IDS = ['agfachrome_ct18', 'art_noir', 'kodachrome', 'cinestill_800t', 'polaroid_fp100c', 'svema_zenit', 'agfachrome_50s', 'orwo_nc21'];
  const CINE_IDS = ['fujicolor_eterna_500t', 'agfachrome_ct18', 'kodak_5247', 'cinestill_800t', '70mm_imax', '35mm_anamorphic', 'technicolor_v4', 'krasnogorsk_16mm', 'super8_tri_x', 'art_noir'];
  const HISTORIC_IDS = ['wet_plate', 'petzval', 'aerochrome_infrared'];

  const filteredProfiles = ANALOG_PROFILES.filter((p) => {
    if (activeCategory === 'favorites') return FAVORITES_IDS.includes(p.id);
    if (activeCategory === 'photo') return PHOTO_CLASSIC_IDS.includes(p.id);
    if (activeCategory === 'cine') return CINE_IDS.includes(p.id);
    if (activeCategory === 'historic') return HISTORIC_IDS.includes(p.id);
    return true;
  });

  const isFujicolorEterna = currentProfile.id === 'fujicolor_eterna_500t';
  const isAgfachromeCT18 = currentProfile.id === 'agfachrome_ct18';
  const isKodak5247 = currentProfile.id === 'kodak_5247';
  const isKodachrome = currentProfile.id === 'kodachrome';
  const isCineStill = currentProfile.id === 'cinestill_800t';

  return (
    <div
      className={`rounded-2xl border transition-all p-5 shadow-sm ${
        enabled
          ? 'bg-white border-red-500/30 text-zinc-900 ring-1 ring-red-500/10'
          : 'bg-zinc-50/70 border-zinc-200 text-zinc-700'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 text-xs font-black rounded-md uppercase tracking-wider flex items-center gap-1.5 ${
                enabled
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Analog-Trimmer &amp; Linsen-Emulation (V3)</span>
            </span>

            {enabled && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-red-600" />
                <span>Aktiv: {currentProfile.name.split(' (')[0]}</span>
              </span>
            )}

            {enabled && isFujicolorEterna && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-950 border border-cyan-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-700" />
                <span>ECN-2 4th Layer &amp; Zeiss Master Primes Aktiv</span>
              </span>
            )}

            {enabled && isKodak5247 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-900 border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>100% ENR Bleach-Bypass &amp; 5500K/2800K Clash Aktiv</span>
              </span>
            )}

            {enabled && isKodachrome && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>5500K Farbtreue &amp; Sklera-Schutz Aktiv</span>
              </span>
            )}

            {enabled && isCineStill && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-600" />
                <span>3200K Tungsten &amp; 650nm Halation Aktiv</span>
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <span>{language === 'EN' ? 'Photochemical Lens & Emulation Cockpit' : 'Optik- & Emulsions-Triebwerk für Hailuo / MiniMax H3'}</span>
          </h3>

          <p className="text-xs text-zinc-500 leading-relaxed max-w-3xl">
            {language === 'EN'
              ? 'Injects physical camera lenses and historic photochemical emulsions directly into the prompt to eradicate artificial CGI skin smoothing.'
              : 'Verankert physikalische Linsen-Aberrationen, natürliche Mikrokontraste und echte chemische Farbtrennung im Prompt. Befreit MiniMax H3 zuverlässig von künstlicher Wachshaut und sterilem CGI-Look.'}
          </p>
        </div>

        {/* Master Power Switch */}
        <div className="shrink-0 flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-600">
            {enabled ? 'Triebwerk Aktiv' : 'Ausgeschaltet'}
          </span>
          <button
            type="button"
            onClick={() => onToggleEnabled(!enabled)}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enabled ? 'bg-red-600' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Cockpit Body (Shown when Enabled) */}
      {enabled && (
        <div className="mt-5 pt-5 border-t border-zinc-200 space-y-6">

          {/* 1. Category Quick Filters (Clear, fast navigation) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-red-600" />
                <span>Schritt 1: Analog-Emulsion &amp; Objektiv wählen</span>
              </label>
              <span className="text-xs text-zinc-500">
                {filteredProfiles.length} Profile in dieser Ansicht
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
              {[
                { id: 'favorites', label: '🌟 Empfohlen & Getestet', desc: 'Kodachrome 64, Leica Noctilux, 70mm IMAX' },
                { id: 'photo', label: '🎞️ 35mm & Sofortbild', desc: 'Dia, Packfilm, Lomo' },
                { id: 'cine', label: '🎥 Kino & Spielfilm', desc: '70mm, 35mm Scope, Technicolor' },
                { id: 'historic', label: '⏳ Historisch & Rarität', desc: '1851 Nassplatte, Petzval, Infrarot' },
                { id: 'all', label: '⚡ Alle Profile', desc: 'Gesamtkatalog' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Profile Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {filteredProfiles.map((p) => {
                const isSelected = p.id === selectedProfileId;
                const isKoda = p.id === 'kodachrome';

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProfile(p.id)}
                    className={`relative flex flex-col text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? isKoda
                          ? 'bg-rose-50/70 border-rose-600 text-rose-950 shadow-sm ring-2 ring-rose-500/20'
                          : 'bg-red-50/70 border-red-600 text-red-950 shadow-sm ring-2 ring-red-500/20'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 w-full mb-1">
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold leading-snug line-clamp-1">
                          {p.name.split(' (')[0]}
                        </span>
                      </div>
                      {p.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 ${
                            isSelected
                              ? 'bg-red-600 text-white border-red-700'
                              : p.badgeStyle || 'bg-zinc-100 text-zinc-700 border-zinc-300'
                          }`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-zinc-500 line-clamp-1 font-mono">
                      {p.camera.split(' / ')[0]}
                    </span>

                    {/* Color palette indicator dots */}
                    {p.paletteColors && (
                      <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-zinc-100">
                        {p.paletteColors.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <span className="text-[10px] text-zinc-400 font-mono ml-auto">
                          {p.recommendedTemp || '5500K'}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. DEDICATED FUJICOLOR ETERNA 500T MASTER COCKPIT (Shown when Fujicolor Eterna is selected) */}
          {isFujicolorEterna && (
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 border-2 border-cyan-500/50 shadow-md space-y-4 text-white">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-xs">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-cyan-200">
                        Fujicolor Eterna 500T Master Plugin (8573 • ECN-2 • Die Falsifikation)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-600 text-white">
                        Aktiv &amp; Kalibriert
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      35mm Motion Picture Celluloid • Fujicolor Eterna 500T (8573) ECN-2 • 4th Color Layer • Zeiss Master Primes (T1.3 &amp; 100mm Macro) • Haneke / Fincher Rigor.
                    </p>
                  </div>
                </div>

                {/* LoRA & Optical Sync Status */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ECN-2 4th Layer &amp; Zeiss Master Primes injiziert</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Verification Guarantees for Fujicolor Eterna 500T */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>4th Color Layer Farbtrennung</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Fujis patentierte Zwischenschicht trennt 5000K-Mischlicht und Kaltlicht-Displays ohne unkontrollierten Farbstich oder Halation.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                    <Flame className="w-4 h-4 text-slate-400" />
                    <span>Muted Colors &amp; Obsidian D-Max</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Unbarmherzige Schattentiefe und aschige Schiefertöne. Entzieht der Szenerie jede bunte Trivialität für existenzielle Wucht.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Zeiss Master Primes T1.3</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Chirurgische Schärfe auf Deckenstaub, Hautporen und Textilfasern – rigoros frei von digitaler Wachshaut oder AI-Glättung.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ZERO Rote Halation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    Intakte ECN-2 Remjet-Rußschicht verhindert Lichtstreuung an Kanten; 100% fotochemische Disziplin ohne CineStill-Effekthascherei.
                  </p>
                </div>
              </div>

              {/* Technical Recipe / Knowledge Box */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-100 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Photochemische Master-Emulation:</strong> Fujicolor Eterna 500T (8573) ist das filmische Fundament des 6-teiligen Zyklus <em>&quot;Die Falsifikation&quot;</em>. Das Plugin injiziert verbindlich: <code>Fujicolor Eterna 500T (8573) motion picture celluloid</code>, <code>native ECN-2 processing with 4th color layer</code>, <code>Zeiss Master Primes (35mm/50mm/85mm T1.3 &amp; 100mm macro)</code>, <code>muted institutional tones &amp; slate-moss shadows</code>, <code>obsidian D-Max blacks</code> und <code>tactile organic micro-grain with strictly ZERO red halation or CGI smoothing</code>.
                </div>
              </div>
            </div>
          )}

          {/* 2. DEDICATED AGFACHROME CT18 MASTER COCKPIT (Shown when Agfachrome CT18 is selected) */}
          {isAgfachromeCT18 && (
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/70 border-2 border-emerald-600/40 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-emerald-950">
                        Agfachrome CT18 Master Plugin (AP-41 Reversal • Das Erlöschen des Spektrums)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                        Aktiv &amp; Kalibriert
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900/80 font-medium mt-0.5">
                      Agfacolor AP-41 Farbumkehr-Chemie • Kalte Salbei- &amp; Schiefergrün-Schatten • Verblassendes Ocker • Carl Zeiss Sonnar 40mm f/2.8 &amp; Planar 50mm T1.4.
                    </p>
                  </div>
                </div>

                {/* LoRA & Physics Sync Status */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>AP-41 Reversal &amp; Salbei-Palette injiziert</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Verification Guarantees for Agfachrome CT18 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Palette className="w-4 h-4 text-emerald-700" />
                    <span>AP-41 Spektral-Verschiebung</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Verdrängt warmes Rot zugunsten kühler, melancholischer Salbei-, Moos- und Schiefergrüntöne; pastelliger Aquarell-Charakter.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>Bernstein &amp; Zivilisations-Verfall</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Verblassendes Ocker und gedämpfte Amber-Glühfäden in den Lichtern spiegeln das schleichende Erlöschen moderner Systeme wider.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Eye className="w-4 h-4 text-zinc-800" />
                    <span>Zeiss Sonnar &amp; Planar Optik</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    HFT-Vergütung löst feinste Risse, Staubablagerungen auf Glas und Textilgewebe mikroskopisch plastisch auf – ohne digitales Überschärfen.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Layers className="w-4 h-4 text-emerald-800" />
                    <span>Malerisches Farbstoffkorn</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Organisches, weichkörniges Farbstoffwolken-Korn der AP-41 Chemie mit samtig analogem Highlight-Rolloff und tiefem D-Max.
                  </p>
                </div>
              </div>

              {/* Technical Recipe / Knowledge Box */}
              <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-200 text-xs text-emerald-950 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong>Photochemische Master-Emulation:</strong> Agfachrome CT18 (50S / AP-41) ist das filmische Fundament des 6-teiligen Zyklus <em>&quot;Das Erlöschen des Spektrums&quot;</em>. Das Plugin injiziert verbindlich: <code>Agfachrome CT18 AP-41 reversal chemistry</code>, <code>muted cold sage and slate-green shadows</code>, <code>faded ocher highlights</code>, <code>Carl Zeiss Sonnar 40mm f/2.8 HFT &amp; Planar 50mm T1.4</code> und <code>painterly organic dye-cloud grain with zero CGI smoothing</code>.
                </div>
              </div>
            </div>
          )}

          {/* 2a. DEDICATED KODACHROME 64 MASTER COCKPIT (Shown when Kodachrome is selected) */}
          {isKodachrome && (
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 border-2 border-rose-500/40 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-rose-950">
                        Kodachrome 64 Plugin (Master Edition)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                        Aktiv &amp; Kalibriert
                      </span>
                    </div>
                    <p className="text-xs text-rose-800/80 font-medium mt-0.5">
                      Farbdia-Emulsion nach K-14 Umkehrprozess mit subtraktiver Farbtrennung.
                    </p>
                  </div>
                </div>

                {/* LoRA Warning / Quick Toggle Button */}
                <div className="flex items-center gap-2">
                  {loraEnabled ? (
                    <button
                      type="button"
                      onClick={() => onToggleLora(false)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      title="Klicke hier, um das LoRA zu deaktivieren und die Farbtreue von Kodachrome voll zu entfalten"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>LoRA trennen (Empfohlen für Farbdias)</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>LoRA getrennt: 100% Farbreinheit</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Core Verification Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>5500K Tageslicht</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Verhindert den berüchtigten gelblichen 3800K-Sepiastich von MiniMax H3.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>Sklera-Schutz</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Augenweiß bleibt elfenbeinfarben rein; verhindert gelbe &quot;Sith/Dune&quot;-Augen.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                    <Palette className="w-4 h-4 text-red-500" />
                    <span>K-14 Farbtrennung</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    3 getrennte Farbstoff-Schichten: Leuchtendes Zinnoberrot auf natürlicher Haut.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>Obsidian D-Max</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Steile Kontrastkurve mit samtigem Tiefschwarz und feinstem Farbstoffkorn.
                  </p>
                </div>
              </div>

              {/* LoRA Info Box */}
              <div className="p-3 rounded-xl bg-rose-100/50 border border-rose-200 text-xs text-rose-900 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Warum LoRA bei Kodachrome ausschalten?</strong> Das MiniMax-LoRA <code>ASTROCINEMAV01K2T</code> neigt dazu, das Bild ins Monochrom- oder Sepia-Spektrum zu ziehen. Ohne LoRA liefert der MiniMax H3 DiT-Transformer exakt das unverfälschte Kodachrome 64 Farbspektrum mit reinen, leuchtenden Rot- und Hauttönen.
                </div>
              </div>
            </div>
          )}

          {/* 2b. DEDICATED CINESTILL 800T MASTER COCKPIT (Shown when CineStill 800T is selected) */}
          {isCineStill && (
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-red-50/90 via-white to-cyan-50/60 border-2 border-red-500/40 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-red-950">
                        CineStill 800T Plugin (Master Edition)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                        Aktiv &amp; Kalibriert
                      </span>
                    </div>
                    <p className="text-xs text-red-800/80 font-medium mt-0.5">
                      Kodak Vision3 500T (5219) Kinofilm mit entfernter Remjet-Rußschicht für C-41 / ECN-2 Entwicklung.
                    </p>
                  </div>
                </div>

                {/* LoRA Info Tag */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3200K Tungsten &amp; 650nm Halation injiziert</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Verification Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-red-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>650nm Karminrot-Halation</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Ikonische rote Lichthöfe um Punktlichtquellen, Neonschilder, Autoscheinwerfer und Glanzlichter.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-red-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>3200K Tungsten-Balance</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Auf Kunstlicht abgestimmte Emulsion; taucht Umgebungslicht in samtiges Cyan-Kobalt-Blau.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-red-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <span>Remjet-Removal Physik</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Rückseitige Anti-Halations-Rußschicht chemisch entfernt; Licht reflektiert in die rote Schicht.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-red-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs">
                    <Eye className="w-4 h-4 text-zinc-800" />
                    <span>Vision3 500T Kinokorn</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Organisches 35mm Hollywood-Filmkorn mit hoher Mikroschärfe, ECN-2/C-41 Farbseparation ohne CGI-Look.
                  </p>
                </div>
              </div>

              {/* Technical Recipe / Knowledge Box */}
              <div className="p-3 rounded-xl bg-red-100/50 border border-red-200 text-xs text-red-950 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Photochemische Emulation:</strong> CineStill 800T basiert auf originalem <code>Kodak Vision3 500T (5219)</code> Filmstock. Das System injiziert automatisch die prompt-verbindlichen Direktiven: <code>3200K tungsten balanced</code>, <code>650nm carmine-red halation bleed</code>, <code>Remjet layer removed</code> und <code>ECN-2 / C-41 color cross</code>.
                </div>
              </div>
            </div>
          )}

          {/* 2c. DEDICATED KODAK 5247 MASTER COCKPIT (Shown when Kodak 5247 is selected) */}
          {isKodak5247 && (
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-slate-100/70 border-2 border-amber-500/40 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-amber-950">
                        Kodak 5247 Master Plugin (ENR Bleach-Bypass Edition • v2.2)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-600 text-white">
                        Aktiv &amp; Kalibriert
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                      Kodak Eastman Color Negative II 5247 (100T) • 100% ENR Silberrückhaltung (Bleach-Bypass) • Zeiss Super Speed Mk II (T1.3 &amp; 100mm Macro).
                    </p>
                  </div>
                </div>

                {/* LoRA & Physics Sync Status */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>5500K/2800K Clash &amp; ENR Silber injiziert</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Verification Guarantees for Kodak 5247 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>100% ENR Silberrückhaltung</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Reines metallisches Silber verbleibt in der Gelatineschicht; liefert unbarmherzigen Mikrokontrast und metallischen Schimmer.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Sun className="w-4 h-4 text-sky-600" />
                    <span>5500K / 2800K Clash</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Kollision extremer Lichtfarben: Eiskaltes 5500K Tageslicht trifft auf intensives 2800K Kunstlicht im Innenraum.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Eye className="w-4 h-4 text-zinc-800" />
                    <span>Zeiss T1.3 &amp; 100mm Macro</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Rasiermesserscharfe Optik ohne Weichzeichner; löst Poren, Staubstatue-Partikel und zerborstenes Glas mikroskopisch auf.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Flame className="w-4 h-4 text-slate-900" />
                    <span>Obsidian D-Max &amp; Entsättigung</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Steilste Gradation, tiefes kohlrabenschwarzes D-Max und unterkühlte, aschige Schiefer- und Stahlblautöne.
                  </p>
                </div>
              </div>

              {/* Technical Recipe / Knowledge Box */}
              <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200 text-xs text-amber-950 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Photochemische Master-Emulation:</strong> Kodak 5247 (100T) ist das filmische Fundament der 6-teiligen Katastrophen-Dramaturgie. Das Plugin injiziert verbindlich: <code>Kodak 5247 100T tungsten-balanced</code>, <code>100% ENR silver retention bleach-bypass</code>, <code>clashing 5500K daylight vs 2800K tungsten</code>, <code>Zeiss Super Speed Mk II (T1.3 &amp; 100mm macro)</code> und <code>obsidian D-Max blacks with zero CGI smoothing</code>.
                </div>
              </div>
            </div>
          )}

          {/* 3. ACTIVE PROFILE DETAIL COCKPIT (Clean, high-contrast, fully readable) */}
          <div className="p-4.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  Ausgewähltes Profil-Cockpit:
                </span>
                <h4 className="text-base font-black text-zinc-900 mt-0.5">
                  {currentProfile.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSpecsSheet(!showSpecsSheet)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{showSpecsSheet ? 'Optik-Datenblatt schließen' : 'Vollständiges Datenblatt anzeigen'}</span>
                  {showSpecsSheet ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick 3-Pillar Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-1">
                  Kamera-Body (Chassis)
                </span>
                <p className="font-bold text-zinc-900 font-mono text-xs leading-snug">
                  {currentProfile.camera}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-1">
                  Objektiv &amp; Glasformel
                </span>
                <p className="font-bold text-zinc-900 font-mono text-xs leading-snug">
                  {currentProfile.lens}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-1">
                  Chemische Emulsion
                </span>
                <p className="font-bold text-zinc-900 font-mono text-xs leading-snug">
                  {currentProfile.chemistry}
                </p>
              </div>
            </div>

            {/* What this profile does in plain German */}
            <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-700 leading-relaxed shadow-2xs">
              <span className="font-bold text-zinc-900 block mb-1">Visuelle Wirkung im KI-Prompt:</span>
              <p className="text-zinc-600 italic leading-normal">
                &quot;{currentProfile.description}&quot;
              </p>
            </div>

            {/* Collapsible Extended Specs Sheet */}
            {showSpecsSheet && (
              <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  Physikalische Prompt-Parameter:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-1">
                      Farbtreue &amp; Tonalität
                    </span>
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      {currentProfile.colorShift}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-1">
                      Korn- &amp; Oberflächenstruktur
                    </span>
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      {currentProfile.grain}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono mb-1">
                      Linsen-Aberrationen / Flares
                    </span>
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      {currentProfile.flare}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. EXPERIMENTAL CHEMICAL LAB (Clean, optional, collapsible accordion) */}
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowLabSection(!showLabSection)}
              className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100/80 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-zinc-900">
                      Optionale Labor-Störungen &amp; Haptische Makro-Rezepte
                    </h4>
                    {analogLaborStörung !== 'none' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Störung: {analogLaborStörung}
                      </span>
                    )}
                    {analogMacroRecipe !== 'none' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Makro aktiv
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Für kreative Störungen (Cross-Processing, Film Souping, Hitzeschock) oder extreme Material-Nahaufnahmen.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-zinc-600">
                <span>{showLabSection ? 'Schließen' : 'Öffnen'}</span>
                {showLabSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showLabSection && (
              <div className="p-5 border-t border-zinc-200 space-y-5 animate-fadeIn">
                {/* Chemical degradation selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    Chemisch-physikalische Film-Degradation:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'none', name: 'Keine Störung', desc: 'Saubere, reguläre Entwicklung (Standard)' },
                      { id: 'cross_processing', name: 'Cross-Processing', desc: 'C-41 in E-6: Neongelb & Smaragd' },
                      { id: 'film_soup', name: 'Film Souping', desc: 'Kochbad: Fraktale & feine Bläschen' },
                      { id: 'thermal_shock', name: 'Thermal Shock', desc: 'Hitzeschock: Rote Äderchen' },
                      { id: 'bleach_bypass', name: 'Bleach Bypass', desc: 'Silberrückhaltung: Brutaler Kontrast' },
                    ].map((stör) => {
                      const isSelected = analogLaborStörung === stör.id;
                      return (
                        <button
                          key={stör.id}
                          type="button"
                          onClick={() => onSelectLaborStörung?.(stör.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500/30'
                              : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                          }`}
                        >
                          <span className="text-xs font-bold block">{stör.name}</span>
                          <span className="text-[11px] text-zinc-500 block mt-0.5 leading-snug">
                            {stör.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Macro presets */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    Haptische Material-Makro Rezepte:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {[
                      { id: 'none', title: 'Standard-Fokus', desc: 'Normaler Szenen-Fokus aus dem Drehbuch' },
                      { id: 'chemical_feast', title: '„The Chemical Feast“', desc: 'Kochendes Kupfer, Metallsalze & Bläschen' },
                      { id: 'silver_scar', title: '„The Silver Scar“', desc: 'Flüssiges Quecksilber auf Obsidian' },
                      { id: 'saturated_rust', title: '„Saturated Rust“', desc: 'Brennender Schwefel & rotglühendes Metall' },
                    ].map((rec) => {
                      const isSelected = analogMacroRecipe === rec.id;
                      return (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => onSelectMacroRecipe?.(rec.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500/30'
                              : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                          }`}
                        >
                          <span className="text-xs font-bold block">{rec.title}</span>
                          <span className="text-[11px] text-zinc-500 block mt-0.5 leading-snug">
                            {rec.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. LoRA Synchronization Status Bar */}
          <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${loraEnabled ? 'text-amber-600 animate-pulse' : 'text-zinc-400'}`} />
              <span className="font-bold text-zinc-800">
                LoRA-Kopplung (ASTROCINEMAV01K2T):
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${loraEnabled ? 'bg-amber-200 text-amber-900' : 'bg-zinc-200 text-zinc-600'}`}>
                {loraEnabled
                  ? (isCineStill ? 'Gekoppelt (CineStill 800T Cinema Mode)' : 'Gekoppelt')
                  : (isKodachrome ? 'Getrennt (Empfohlen für Kodachrome Farbdia)' : 'Getrennt')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onToggleLora(!loraEnabled)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                loraEnabled
                  ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-2xs'
              }`}
            >
              {loraEnabled ? 'LoRA ausschalten' : 'LoRA aktivieren'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
