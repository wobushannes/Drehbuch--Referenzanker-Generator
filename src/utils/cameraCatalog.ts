export interface CameraMovementPreset {
  id: string;
  name: string;
  category: 'drone' | 'dolly' | 'steadicam' | 'orbit' | 'macro' | 'crane' | 'pan' | 'special';
  badge: string;
  description: string;
  cinematicIntent: string;
  lensRecommendation: string;
  speed: 'slow' | 'medium' | 'dynamic';
  suggestedPrompt: string;
  bestForWindow: 1 | 2 | 3 | 4 | 'any';
}

export interface CameraMovementPreset {
  id: string;
  name: string;
  category: 'drone' | 'dolly' | 'steadicam' | 'orbit' | 'macro' | 'crane' | 'pan' | 'special';
  badge: string;
  description: string;
  cinematicIntent: string;
  lensRecommendation: string;
  speed: 'slow' | 'medium' | 'dynamic';
  suggestedPrompt: string;
  bestForWindow: 1 | 2 | 3 | 4 | 'any';
}

export const CAMERA_MOVEMENT_CATALOG_DE: CameraMovementPreset[] = [
  {
    id: 'fpv-drone-pushin',
    name: 'FPV Cinematic Drone Push-in & Descend',
    category: 'drone',
    badge: 'Drohne / Totale',
    description: 'Flüssiger Vorwärtsflug aus der Vogelperspektive (25m), der sanft auf Augenhöhe zur Hauptfassade absinkt.',
    cinematicIntent: 'Etabliert das Grundstück, die Baukörper-Geometrie und weckt sofort Neugier.',
    lensRecommendation: '24mm Ultra-Wide, T2.0, Cinema Drone Rig',
    speed: 'medium',
    suggestedPrompt: 'Cinematic FPV drone glide starting from 25m aerial overview, smoothly descending to eye-level approaching the facade with continuous horizon leveling',
    bestForWindow: 1,
  },
  {
    id: 'orbit-parallax-180',
    name: '180° Parallax Orbit & Reveal',
    category: 'orbit',
    badge: 'Architektur-Orbit',
    description: 'Halbkreis-Umfahrt um eine Gebäudekante oder Kochinsel, bei der Vorder- und Hintergrund plastisch gegeneinander wandern.',
    cinematicIntent: 'Verleiht dem Raum maximale Tiefe und hebt 3D-Volumetrie sowie Lichtreflexionen hervor.',
    lensRecommendation: '35mm Anamorphic Master Prime, 2.39:1 squeeze',
    speed: 'slow',
    suggestedPrompt: 'Slow 180-degree parallax orbit gliding smoothly around the architectural corner, revealing floor-to-ceiling panoramic glass and depth',
    bestForWindow: 1,
  },
  {
    id: 'steadicam-walkthrough',
    name: '35mm Steadicam Eye-Level Walkthrough',
    category: 'steadicam',
    badge: 'Fließender Rundgang',
    description: 'Gleitender Spaziergang auf Augenhöhe (1,65m) durch Flur, Schiebetüren oder Galerie ohne Erschütterung.',
    cinematicIntent: 'Erzeugt unmittelbares Gefühl des „Selber-Darin-Wohnens“ und der Bewegungsfreiheit.',
    lensRecommendation: '35mm Cine Lens, T1.5, Gimbal / Steadicam',
    speed: 'medium',
    suggestedPrompt: 'Fluid Steadicam tracking at human eye-level gliding effortlessly through the corridor toward the sunlit living area, smooth seamless stabilization',
    bestForWindow: 3,
  },
  {
    id: 'low-angle-dolly-in',
    name: 'Low-Angle Architectural Dolly Push-in',
    category: 'dolly',
    badge: 'Bodennah & Monumental',
    description: 'Niedrige Kamerafahrt (30cm über Boden/Parkett), die auf die Eingangstür oder Schiebeelemente zufährt.',
    cinematicIntent: 'Betont die Materialität des Bodens, Sockels und lässt die Raumhöhe imposant wirken.',
    lensRecommendation: '28mm Wide Angle, T2.8',
    speed: 'slow',
    suggestedPrompt: 'Smooth low-angle slider tracking 30cm above hardwood floor, gently pushing in toward the floor-to-ceiling glass entrance',
    bestForWindow: 2,
  },
  {
    id: 'macro-100mm-texture-sweep',
    name: '100mm Macro Haptic Sweep (T1.8)',
    category: 'macro',
    badge: 'Extreme Haptik & Detail',
    description: 'Extrem nah geführter Schärfezieh-Schwenk über Holzmaserung, Lehmputz, Aluminium-Gehrung oder Türdrücker.',
    cinematicIntent: 'Übertragt sensorische Wertarbeit und kompromisslose Materialqualität direkt auf den Betrachter.',
    lensRecommendation: '100mm Macro Cine Prime, T1.8, razor-sharp focus plane',
    speed: 'slow',
    suggestedPrompt: 'EXTREME CLOSE-UP 100mm macro T1.8 with buttery shallow depth of field, slowly sweeping across the warm tactile brushed wood grain and precision joinery',
    bestForWindow: 2,
  },
  {
    id: 'crane-pedestal-sunset',
    name: 'Jib Crane Pedestal-Up & Sunset Pullback',
    category: 'crane',
    badge: 'Episches Outro / Finale',
    description: 'Vertikale Kranfahrt von der beleuchteten Terrasse nach oben, rückwärts aufsteigend in den Dämmerungshimmel.',
    cinematicIntent: 'Schafft emotionale Katharsis, rundet die Dramaturgie ab und bereitet den perfekten Raum für den CTA & Logo.',
    lensRecommendation: '35mm or 50mm Master Prime, T1.4',
    speed: 'slow',
    suggestedPrompt: 'Smooth jib crane pedestal up elevating from the illuminated terrace, pulling back gracefully into the golden-hour dusk sky as the house glows warmly',
    bestForWindow: 4,
  },
  {
    id: 'slow-whip-pan-lightbeam',
    name: 'Lichtachsen-Schwenk mit Lens Flare',
    category: 'pan',
    badge: 'Licht & Atmosphäre',
    description: 'Sanfter Kameraschwenk vom schattigen Innenbereich genau in den einfallenden Sonnenlichtkegel.',
    cinematicIntent: 'Macht die thermische Behaglichkeit und die gezielte Lichtplanung des Grundrisses spürbar.',
    lensRecommendation: '50mm f/1.2 Anamorphic with warm horizontal lens flare',
    speed: 'slow',
    suggestedPrompt: 'Gentle horizontal pan crossing from soft interior shadow directly into golden sunbeams cutting across the room, subtle organic anamorphic flare',
    bestForWindow: 3,
  },
  {
    id: 'vertigo-dolly-zoom',
    name: 'Subtiler Z-Dolly Parallax Push',
    category: 'dolly',
    badge: 'Tiefenstaffelung',
    description: 'Präzise Vorwärtsfahrt bei gleichbleibendem Blickwinkel, die den Außenbereich hinter der Glasscheibe heranzieht.',
    cinematicIntent: 'Zeigt die perfekte Symbiose von Innenraum und umgebender Natur.',
    lensRecommendation: '40mm Cine Lens, T2.0',
    speed: 'slow',
    suggestedPrompt: 'Slow cinematic tracking shot pushing forward through the open lounge area, expanding the visual connection between interior and garden terrace',
    bestForWindow: 'any',
  },
];

export const CAMERA_MOVEMENT_CATALOG_EN: CameraMovementPreset[] = [
  {
    id: 'fpv-drone-pushin',
    name: 'FPV Cinematic Drone Push-in & Descend',
    category: 'drone',
    badge: 'Drone / Wide Overview',
    description: 'Fluid forward flight from a 25m bird-eye vantage point gently descending to human eye-level approaching the facade.',
    cinematicIntent: 'Establishes site context, building geometry, and immediately triggers viewer curiosity.',
    lensRecommendation: '24mm Ultra-Wide, T2.0, Cinema Drone Rig',
    speed: 'medium',
    suggestedPrompt: 'Cinematic FPV drone glide starting from 25m aerial overview, smoothly descending to eye-level approaching the facade with continuous horizon leveling',
    bestForWindow: 1,
  },
  {
    id: 'orbit-parallax-180',
    name: '180° Parallax Orbit & Reveal',
    category: 'orbit',
    badge: 'Architectural Orbit',
    description: 'Semi-circular sweep around a building corner or kitchen island, dynamically separating foreground from background.',
    cinematicIntent: 'Imparts maximum depth and highlights 3D volumetric space, glass textures, and light bounce.',
    lensRecommendation: '35mm Anamorphic Master Prime, 2.39:1 squeeze',
    speed: 'slow',
    suggestedPrompt: 'Slow 180-degree parallax orbit gliding smoothly around the architectural corner, revealing floor-to-ceiling panoramic glass and depth',
    bestForWindow: 1,
  },
  {
    id: 'steadicam-walkthrough',
    name: '35mm Steadicam Eye-Level Walkthrough',
    category: 'steadicam',
    badge: 'Fluid Walkthrough',
    description: 'Gliding eye-level walkthrough (1.65m) through hallway, sliding doors, or gallery with seamless stabilization.',
    cinematicIntent: 'Creates an immediate first-person feeling of living in the space with effortless freedom of movement.',
    lensRecommendation: '35mm Cine Lens, T1.5, Gimbal / Steadicam',
    speed: 'medium',
    suggestedPrompt: 'Fluid Steadicam tracking at human eye-level gliding effortlessly through the corridor toward the sunlit living area, smooth seamless stabilization',
    bestForWindow: 3,
  },
  {
    id: 'low-angle-dolly-in',
    name: 'Low-Angle Architectural Dolly Push-in',
    category: 'dolly',
    badge: 'Ground-Level & Monumental',
    description: 'Low-angle slider push (30cm above hardwood floor) tracking toward the entrance or sliding glass panels.',
    cinematicIntent: 'Emphasizes tactile floor materiality and baseboard craftsmanship while celebrating ceiling height.',
    lensRecommendation: '28mm Wide Angle, T2.8',
    speed: 'slow',
    suggestedPrompt: 'Smooth low-angle slider tracking 30cm above hardwood floor, gently pushing in toward the floor-to-ceiling glass entrance',
    bestForWindow: 2,
  },
  {
    id: 'macro-100mm-texture-sweep',
    name: '100mm Macro Haptic Sweep (T1.8)',
    category: 'macro',
    badge: 'Tactile Macro & Craft',
    description: 'Extremely close focus rack sweep across wood grain, clay plaster, milled aluminum joinery, or door handles.',
    cinematicIntent: 'Conveys sensory craftsmanship and uncompromising tactile material quality directly to the viewer.',
    lensRecommendation: '100mm Macro Cine Prime, T1.8, razor-sharp focus plane',
    speed: 'slow',
    suggestedPrompt: 'EXTREME CLOSE-UP 100mm macro T1.8 with buttery shallow depth of field, slowly sweeping across the warm tactile brushed wood grain and precision joinery',
    bestForWindow: 2,
  },
  {
    id: 'crane-pedestal-sunset',
    name: 'Jib Crane Pedestal-Up & Sunset Pullback',
    category: 'crane',
    badge: 'Epic Outro / Finale',
    description: 'Vertical crane elevation from illuminated terrace, pulling back gracefully into the twilight evening sky.',
    cinematicIntent: 'Evokes emotional catharsis, grounds the visual story, and opens serene negative space for CTA and brand identity.',
    lensRecommendation: '35mm or 50mm Master Prime, T1.4',
    speed: 'slow',
    suggestedPrompt: 'Smooth jib crane pedestal up elevating from the illuminated terrace, pulling back gracefully into the golden-hour dusk sky as the house glows warmly',
    bestForWindow: 4,
  },
  {
    id: 'slow-whip-pan-lightbeam',
    name: 'Sunbeam Pan & Anamorphic Flare',
    category: 'pan',
    badge: 'Atmosphere & Light',
    description: 'Gentle horizontal pan crossing from soft interior shadow directly into golden sunbeams slicing through the room.',
    cinematicIntent: 'Makes thermal comfort and deliberate daylight pathing tangible and emotionally resonant.',
    lensRecommendation: '50mm f/1.2 Anamorphic with warm horizontal lens flare',
    speed: 'slow',
    suggestedPrompt: 'Gentle horizontal pan crossing from soft interior shadow directly into golden sunbeams cutting across the room, subtle organic anamorphic flare',
    bestForWindow: 3,
  },
  {
    id: 'vertigo-dolly-zoom',
    name: 'Subtle Z-Dolly Parallax Push',
    category: 'dolly',
    badge: 'Depth Stratification',
    description: 'Slow forward dolly tracking while maintaining focal angle, visually pulling the garden terrace closer.',
    cinematicIntent: 'Demonstrates the seamless indoor-outdoor connection between interior lounge and natural landscape.',
    lensRecommendation: '40mm Cine Lens, T2.0',
    speed: 'slow',
    suggestedPrompt: 'Slow cinematic tracking shot pushing forward through the open lounge area, expanding the visual connection between interior and garden terrace',
    bestForWindow: 'any',
  },
];

export const CAMERA_MOVEMENT_CATALOG: CameraMovementPreset[] = CAMERA_MOVEMENT_CATALOG_DE;

export function getCameraMovementCatalog(lang: string = 'DE'): CameraMovementPreset[] {
  return lang === 'EN' ? CAMERA_MOVEMENT_CATALOG_EN : CAMERA_MOVEMENT_CATALOG_DE;
}

/**
 * Returns the best default camera movement for a given window index and focus
 */
export function getRecommendedCameraMovement(
  windowNumber: number,
  totalWindows: number = 4,
  focusHint?: string,
  lang: string = 'DE'
): CameraMovementPreset {
  const catalog = getCameraMovementCatalog(lang);
  const hint = (focusHint || '').toLowerCase();

  if (hint.includes('detail') || hint.includes('holz') || hint.includes('haptik') || hint.includes('material') || hint.includes('tür') || hint.includes('wood') || hint.includes('macro') || hint.includes('tactile')) {
    return catalog.find((c) => c.id === 'macro-100mm-texture-sweep') || catalog[4];
  }

  if (windowNumber === 1) {
    return catalog.find((c) => c.id === 'fpv-drone-pushin') || catalog[0];
  }

  if (windowNumber === 2) {
    return catalog.find((c) => c.id === 'low-angle-dolly-in') || catalog[3];
  }

  if (windowNumber === 3) {
    return catalog.find((c) => c.id === 'steadicam-walkthrough') || catalog[2];
  }

  if (windowNumber === totalWindows || windowNumber === 4) {
    return catalog.find((c) => c.id === 'crane-pedestal-sunset') || catalog[5];
  }

  return catalog[1]; // orbit parallax
}
