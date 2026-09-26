import React, { useState, useMemo, useRef } from 'react';
import {
  Layers,
  Sparkles,
  Music,
  Volume2,
  Compass,
  Sun,
  Trees,
  MessageSquareQuote,
  Plus,
  Minus,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  Sliders,
  FileText,
  Camera,
  Film,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  Globe,
  Download,
  ShieldCheck,
  Eye,
  Settings2,
  Home,
  Box,
  Type,
  Edit2,
} from 'lucide-react';
import {
  DrehbuchKonfiguratorState,
  WindowConfig,
  LMStudioSettings,
  DialogueLanguage,
  ConfigReference,
  ConceptProposal,
  SingleLineWindow,
  ReferenceImage,
  TargetAudience,
  WindowClaimTypography,
} from '../types';
import { Language, t } from '../utils/i18n';
import {
  formatTimecode,
  checkSingleLineValidity,
  DEFAULT_SUBJECT_REFERENCES,
  DEFAULT_PROPOSALS,
  pressProposalToSingleLineWindows,
  pressConfigToSingleLineWindows,
  translateWindowPromptToGerman,
} from '../utils/windowPromptFormatter';
import {
  TARGET_AUDIENCE_CATALOG,
  getTargetAudienceById,
  DEFAULT_TARGET_AUDIENCE,
} from '../utils/targetAudienceCatalog';
import { TargetAudienceSelector } from './drehbuch/TargetAudienceSelector';
import { ReferenceManagerSection } from './drehbuch/ReferenceManagerSection';
import { SavedPromptsModal } from './drehbuch/SavedPromptsModal';
import { CameraDirectorModal } from './drehbuch/CameraDirectorModal';
import { DesignConceptModal } from './drehbuch/DesignConceptModal';
import { ProjectManagerModal } from './drehbuch/ProjectManagerModal';
import { MaestroWindowsBindingList } from './drehbuch/MaestroWindowsBindingList';
import { TypographyOverlayCard } from './drehbuch/TypographyOverlayCard';
import { VoiceModulationCard } from './drehbuch/VoiceModulationCard';
import { AstroCinemaLoraCard } from './drehbuch/AstroCinemaLoraCard';
import { UltraPhysicsCard } from './drehbuch/UltraPhysicsCard';
import { LensSelectorCard } from './drehbuch/LensSelectorCard';
import { VisualStyleCard } from './drehbuch/VisualStyleCard';
import { AnalogFilmCard, ANALOG_PROFILES } from './drehbuch/AnalogFilmCard';
import { RetributionDisclaimerCard } from './drehbuch/RetributionDisclaimerCard';
import { ProposalClaimsEditor } from './drehbuch/ProposalClaimsEditor';
import { ReferenceUsageGuideCard } from './drehbuch/ReferenceUsageGuideCard';
import { TimelineExportModal } from './drehbuch/TimelineExportModal';
import { TypographyOverlayConfig, VoiceModulationConfig } from '../types';
import { FolderOpen, FileJson, Video, Palette, HardDrive, FolderPlus, Save, Flame, AlertTriangle, UtensilsCrossed } from 'lucide-react';

interface DrehbuchKonfiguratorProps {
  config: DrehbuchKonfiguratorState;
  references?: ReferenceImage[];
  onChangeConfig: (newConfig: DrehbuchKonfiguratorState) => void;
  onApplyToScreenplay: (config: DrehbuchKonfiguratorState) => void;
  settings: LMStudioSettings;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  language?: Language;
}

export const CAMERA_PRESETS_DE = [
  'Drohnenflug Orbit 360° (Gleitender Kreisflug um das Gebäude)',
  'Drohnenflug Top-Down (Senkrechte Vogelperspektive & Übersicht)',
  'Drohnenflug FPV Fly-Through (Vom Garten durchs Panoramafenster ins Wohnzimmer)',
  'Dolly-In (Gleitende Kamerafahrt auf die Eingangstür / Fassade)',
  'Crane-Up (Vertikale Kranfahrt vom Vorgarten bis zum Dachfirst)',
  'Steadicam Walkthrough (Flüssiger Spaziergang auf Augenhöhe durch den Flur)',
  'Slow Tilt & Pan (Langsamer Schwenk über Holzlamellen & Glasfassade)',
  'Weitwinkel Statisch (Epische Architektur-Totale mit 24mm Master Prime)',
];

export const CAMERA_PRESETS_EN = [
  'Drone Orbit 360° (Smooth circular flight around building)',
  'Drone Top-Down (Vertical bird\'s eye perspective & overview)',
  'Drone FPV Fly-Through (From garden through panoramic window into living room)',
  'Dolly-In (Smooth push-in camera track towards entrance / facade)',
  'Crane-Up (Vertical crane ascend from front yard to roof ridge)',
  'Steadicam Walkthrough (Fluid eye-level walk along corridor)',
  'Slow Tilt & Pan (Slow pan over timber slats & glass facade)',
  'Wide Angle Static (Epic architectural wide with 24mm Master Prime)',
];

export const WEATHER_PRESETS_DE = [
  'Sonnig & klarer blauer Himmel mit warmem Sonnenlicht',
  'Goldene Stunde / Sunset (Warme Abendsonne, lange weiche Schatten)',
  'Cinematic Overcast (Diffuses, weiches Architektur-Tageslicht)',
  'Dämmerung / Blue Hour (Hausbeleuchtung warm eingeschaltet)',
  'Morgennebel (Mystisch aufsteigender Frühdunst im Gegenlicht)',
  'Frischer Sommerregen (Nasse spiegelnde Terrassenfliesen, saftiges Grün)',
];

export const WEATHER_PRESETS_EN = [
  'Sunny & clear blue sky with warm sunlight',
  'Golden Hour / Sunset (Warm evening sun, long soft shadows)',
  'Cinematic Overcast (Diffuse, soft architectural daylight)',
  'Twilight / Blue Hour (House interior warmly illuminated)',
  'Morning Mist (Mystic rising morning fog in backlight)',
  'Fresh Summer Rain (Reflective wet patio tiles, lush green)',
];

export const BACKGROUND_PRESETS_DE = [
  'Neubausiedlung / Grüne Wohnsiedlung mit gepflegtem Vorgarten & Holzterrasse',
  'Wald & hohe Baumkronen (Naturverbunden, geschützt, Kiefernwald)',
  'Idyllische Hanglage mit Panoramablick ins weite Tal',
  'Strand & Meeresküste mit Holzsteg & ruhigem türkisfarbenem Wasser',
  'Alpenpanorama / Majestätische Bergkulisse im Hintergrund',
  'Moderner minimalistischer Designergarten mit Pool & Sonnendeck',
];

export const BACKGROUND_PRESETS_EN = [
  'New Residential Area / Green suburb with manicured garden & timber terrace',
  'Forest & High Canopies (Nature-connected, serene pine woods)',
  'Scenic Hillside with panoramic vista over the valley',
  'Beach & Coastline with wooden jetty & calm turquoise water',
  'Alpine Vista / Majestic mountain scenery in background',
  'Modern Minimalist Designer Garden with pool & sun deck',
];

export const isDarkRetributionGenre = (genre?: string): boolean => {
  if (!genre) return false;
  const g = genre.toLowerCase();
  return g.includes('rache') || g.includes('retribution') || g.includes('ghostrider');
};

export const isTourGuideGenre = (genre?: string): boolean => {
  if (!genre) return false;
  const g = genre.toLowerCase();
  return g.includes('reiseführung') || g.includes('tourismus') || g.includes('reisevideo') || g.includes('tourguide') || g.includes('travel guide');
};

export const GENRE_PRESETS_DE = [
  'Reiseführung (Reisevideos & Tourismus)',
  'Imagevideo / Brand Film (Kino & Ästhetik)',
  'Imagevideo -> Restaurant (Gastronomie, Fine Dining & Kulinarik)',
  'Imagevideo / Cinematic Showcase',
  'Imagevideo / Atmosphäre & Storytelling',
  'Musikvideo / Artist & Mood Film',
  'Rache & Vergeltung / Dark Retribution (Ghostrider Action & Chaos)',
  'Werbung / Commercial',
  'Architektur & Lifestyle (Immobilien)',
  'Comedy / Humor',
  'Horror / Thriller',
  'Drama / Emotion',
  'Science-Fiction / Sci-Fi',
  'Dokumentation (Documentary)',
  'Action / Abenteuer',
  'Erotik / Romance',
  'Kunst / Experimental',
  'Reise / Dokumentarisch',
];

export const GENRE_PRESETS_EN = [
  'Travel Guide (Travel Videos & Tourism)',
  'Brand Film / Image Video (Cinema & Aesthetics)',
  'Restaurant / Fine Dining & Culinary Experience',
  'Cinematic Showcase / Portfolio',
  'Atmospheric Storytelling',
  'Music Video / Artist & Mood Film',
  'Dark Retribution / Action & Revenge (Ghostrider Style)',
  'Commercial / Advertising',
  'Architecture & Lifestyle (Real Estate)',
  'Comedy / Humor',
  'Horror / Thriller',
  'Drama / Emotion',
  'Science-Fiction / Sci-Fi',
  'Documentary',
  'Action / Adventure',
  'Romance / Erotic',
  'Art / Experimental',
  'Travel / Documentary',
];

export const CALL_TO_ACTION_PRESETS_DE = [
  'Entdecke die verborgenen Geschichten der Stadt – Jetzt VIP-Führung buchen',
  'Erlebe die Magie historischer Orte hautnah. Jetzt geführte Tour sichern.',
  'Jetzt Musterhaus besichtigen & Ihr Traumhaus planen',
  'Einzugsbereit in nur 4 Monaten – Jetzt unverbindlich anfragen',
  'Bauen ohne Kompromisse. Fordern Sie jetzt den kostenlosen Katalog an.',
  'Ihr Lebensraum für Generationen. Vereinbaren Sie ein Beratungsgespräch.',
  'Qualität spüren. Besuchen Sie unsere Schauhäuser am kommenden Wochenende.',
];

export const CALL_TO_ACTION_PRESETS_EN = [
  'Discover the hidden stories of the city – Book your VIP tour now',
  'Experience the magic of historic sites up close. Reserve your guided tour now.',
  'Visit our model house now & plan your dream home',
  'Move-in ready in just 4 months – Inquire without obligation today',
  'Building without compromise. Request your free catalog now.',
  'Your living space for generations. Schedule a consultation.',
  'Feel the quality. Visit our show houses this coming weekend.',
];

export const SAMPLE_STICHPUNKTE_LIST_DE = [
  {
    label: 'Agfachrome CT18: Das Erlöschen des Spektrums (6-Teiliger Film-Zyklus)',
    text: `- Genre: Drama / Apokalyptisch / Psychologischer Thriller
- Setting: Dekadente Metropole, monolithische Regierungsbauten, verlassene Wohnkorridore und Bunkeranlagen im schleichenden Zusammenbruch
- Film-Emulation: Agfachrome CT18 Master Plugin (AP-41 Reversal Chemistry, kalte Salbei- & Schiefergrün-Schatten, verblassendes Ocker, malerisches Farbstoffkorn, Zeiss Sonnar & Planar Optik)
- Audio-Architektur: Rhythmisches Dröhnen (18Hz Infraschall), mechanischer Marschtritt, getragene Cello-Klagemotive und berstende Hochfrequenz-Resonanzen
- Teil 1 (00:00-00:14): Die Illusion von Kontrolle & die Machtlosigkeit der Masse – Monolithisches Ministerium für Informationssicherheit, flackernde Monitore, dumpfes Vibrieren.
- Teil 2 (00:14-00:28): Medien-Hysterie & Narrative ("Wir schaffen das") – Verlassenes TV-Broadcast-Studio, rot blinkendes ON AIR, zitternde Moderatorin, verblassende Teleprompter-Phrasen.
- Teil 3 (00:28-00:42): Die 5-Sekunden-Warnung & das Ticken der Zünder – Akustische Sirenen im Infraschall-Bereich, abbrechende Handy-Netze, digitaler Blackout.
- Teil 4 (00:42-00:56): Die Spaltung der Gesellschaft & Eliten-Flucht – Absperrgitter, fluchtartige Konvois gepanzerter Limousinen, zersplitterte Glasbarrieren.
- Teil 5 (00:56-01:10): 5 Sekunden vor 12 & die persönliche Ohnmacht – Verlassenes Apartment, stillstehende mechanische Wanduhr, Staub wirbelt im letzten Sonnenstrahl.
- Teil 6 (01:10-01:24): Das Finale – Das Erlöschen des Spektrums – Stille vor der Druckwelle, thermische Entfärbung, Transformation in verwehende Staubstatuen im Carl Zeiss 100mm Makro.
- Call to Action: "Das Erlöschen des Spektrums — Ein photochemischer Film-Zyklus auf Agfachrome CT18"`,
  },
  {
    label: 'Elemental Matter: Kodachrome 64 K-14 Makro-Kunst (Pigment, Metall & Kinetik)',
    text: `- Genre: Kunst / Experimental
- Protagonist: <Subject 1> Johannes Wobus (@Subject1_johannes_wobus), minimalistischer dunkler Künstler-Mantel, intensive braune Augen, natürliche klare weiße Sklera, 5500K neutrales Tageslicht
- Setting: Dunkles Studio, Basaltstein-Gefäß, samtige Obsidian D-Max Schatten, kein gelblicher Sepia-Drift
- Emulation: Kodachrome 64 Master Plugin (5500K Tageslicht, 650nm Karminrot-Halation, echte K-14 Subtraktivfarben)
- Fenster 1: Makro 100mm T1.8: Hand von @Subject1_johannes_wobus berührt trockenes mineralisches Pulver im Basalttiegel, mikroskopische Pyrit- und Goldreflexe im 5500K Direktlicht
- Fenster 2: Kontrastlinie & Finish: Zieht Pigmentstreifen über Wangenknochen und Hals, samtige Obsidian D-Max Schattenkante, zentrierter Blur-Reveal Titel und Ausklang in reinem Schwarz
- Audio & Score: Reibung von mineralischem Staub auf Stein und Haut, getragener Kontrabass/Cello-Subbass
- Call to Action: "Elemental Matter — Pure Material Kinetics"`,
  },
  {
    label: 'Reiseführung: Avatar moderiert Denkmal & Kultur-Highlight',
    text: `- Genre: Reiseführung (Reisevideos & Tourismus)
- Avatar / Guide: <Subject 1> Charismatische Reiseleiterin / Avatar (moderiert direkt in die Kamera, lebendig & begeisternd)
- Denkmal / Sehenswürdigkeit: <Building 1> Historisches Monument / Kathedrale / Wahrzeichen vor blauem Himmel
- Location: <Building 1> Historischer Vorplatz & monumentales Bauwerk
- Fenster 1: Anmoderation: Avatar <Subject 1> steht vor dem imposanten Portal von <Building 1>, begrüßt die Zuschauer und kündigt das historische Geheimnis an
- Fenster 2: Spektakulärer Drohnenflug: Kamera steigt über das Denkmal auf, kreist majestätisch und fängt die kunstvollen Verzierungen im Sonnenlicht ein
- Fenster 3: Detailführung: <Subject 1> steht am Relief von <Building 1>, zeigt mit der Hand auf antike Inschriften und teilt eine verblüffende historische Anekdote
- Fenster 4: Goldene Stunde & Outro: Kamera fährt zurück, <Subject 1> lächelt und lädt zur geführten VIP-Tour ein
- Call to Action: "Entdecke die verborgenen Geschichten der Stadt – Jetzt VIP-Führung buchen"`,
  },
  {
    label: 'Imagevideo -> Restaurant: Fine Dining & Gourmet-Genuss',
    text: `- Setting: Exklusives Restaurant mit offener Showküche & stimmungsvollem Kerzenlicht
- Personen / Rollen: <Subject 1> Chefkoch (meisterhaftes Anrichten), <Subject 2> Sommelier/Service (edler Weinservice), Gäste (Genussmoment)
- Location: <Building 1> Restaurant & stilvoller Gastraum
- Fenster 1: Makro-Nahaufnahme: <Subject 1> vollendet kunstvoll ein Gourmet-Gericht mit Pinzette und Kräutern
- Fenster 2: Leidenschaft in der Küche: Pfanne flammt auf dem Gasherd auf, duftender Dampf steigt empor
- Fenster 3: Eleganter Tischservice: <Subject 2> schenkt rubinroten Wein in bauchige Kristallgläser im Kerzenlicht ein
- Fenster 4: Genuss & Schwenk über den edlen Gastraum: Zufriedene Gäste stoßen lächelnd an, Übergang zum Outro
- Call to Action: "Geschmack erleben, der in Erinnerung bleibt – Jetzt Ihren Tisch reservieren"`,
  },
  {
    label: 'Ghostrider-Stil: Brennendes Pferd & Vergeltung (Dark Action)',
    text: `- Protagonistin: Rächerin in schwarzer Lederkluft, glühende Augen & feurige Aura (Ghostrider-Ästhetik)
- Wesen / Requisit: Ein brennendes dämonisches Pferd mit flammender Mähne und glühenden Hufen
- Setting: Nächtliche Großstadtstraße, glühender Asphalt, Rauchschwaden & berstende Straßenkulisse
- Fenster 1: Die Rächerin stürmt auf dem brennenden Pferd aus dem Nachthimmel herab und schlägt mit gewaltigem Krater auf dem Asphalt ein
- Fenster 2: Zeitlupen-Landung: Gewaltige Schockwelle fegt über die Straße, Flammen spiegeln sich in den Augen der Reiterin
- Fenster 3: Vergeltungs-Vorstoß: Das flammende Pferd prescht vorwärts, der Asphalt bricht auf und Trümmer fliegen durch die Luft
- Fenster 4: Epischer Stillstand im Flammenmeer: Die Rächerin wendet sich zur Kamera, während im Hintergrund das Chaos lodert
- Call to Action: "Revenge Unleashed – Aus der Asche erwächst die Vergeltung"`,
  },
  {
    label: 'Mental- & Resilienzcoaching im Bergwald',
    text: `- Person: Die Resilienz-Beraterin (Coaching-Spezialistin) mit ihren 2 Hunden (Golden Retriever & Border Collie)
- Setting: Nebliger Bergkiefernwald, frische Bergluft, danach gemütliche Beratungspraxis mit Holz & Glasfront
- Fenster 1: Große Drohnenaufnahme über den nebligen Bergwald, die Beraterin läuft entspannt mit ihren 2 Hunden über den Waldweg
- Fenster 2: Nahaufnahme & Atmosphäre: Sie atmet die frische Bergluft ein, krault einen der Hunde, Blick in den Morgennebel
- Fenster 3: Übergang in die warme Praxis: Sie bereitet den Beratungsraum vor, stellt dampfenden Tee bereit
- Fenster 4: POV-Perspektive: Der Klient betritt die Tür des Beratungsraums und wird von der Beraterin lächelnd empfangen
- Call to Action: "Innere Stärke & Resilienz finden – Jetzt kostenloses Erstgespräch anfordern"`,
  },
  {
    label: 'Grundriss-Geführt: Vom Flur gezielt in die Küche',
    text: `- Referenz: Grundriss (Wohnbereich, Flurachse, offene Kochinsel) & Musterhaus
- 2 Personen: Bauherrin (Subject 1) und Partner (Subject 2)
- Fenster 1: Blick auf den Grundriss/Eingangsbereich, Betreten des Foyers durch die Haustür
- Fenster 2: Gezielter Walkthrough entlang der Sichtachse aus dem Grundriss direkt in die Küche
- Fenster 3: Bauherrin kocht am Induktionskochfeld, Partner schaut am Tresen zu
- Fenster 4: Gemeinsamer Blick durch die Glasfront auf die Garten-Terrasse mit Call to Action: "Grundriss live erleben – Besuchen Sie unser Schauhaus"`,
  },
  {
    label: 'Fertighaus: Einzug & Sunset-Terrasse',
    text: `- 2 Personen: Bauherrin (32) und Partner (36) kommen am neuen Fertighaus an
- Objekt: Modernes Holzständer-Musterhaus 'Avantgarde 180' mit Photovoltaik und Garten
- Fenster 1: Großer Drohnen-Überflug 360° über Dach mit Photovoltaik und Garten
- Fenster 2: Betreten des Foyers, Haptik von Eichenholz und Haustür
- Fenster 3: Staunen über den offenen Wohn- und Essbereich mit Panoramafenster
- Fenster 4: Gemeinsamer Moment bei Sonnenuntergang auf der Holzterrasse mit Schlüsselübergabe
- Dialog auf Deutsch, am Ende starker Call to Action: "Jetzt Musterhaus besichtigen & Ihr Traumhaus planen"`,
  },
  {
    label: 'Katamaran & Strand-Pier (Film-Format)',
    text: `- 3 Personen: Schiffsführerin, Crew-Mitglied mit moderner Hand-Prothese und Kapitän
- Objekt: 45ft Katamaran am Holzsteg
- Fenster 1: Holzsteg am Strand, Schiffsführerin zeigt auf den Katamaran, Übergabe der Festmacherleine
- Fenster 2: Katamaran gleitet über ruhiges türkisfarbenes Meer, Zweisamkeit an Bord
- Fenster 3: Ankunft in der versteckten Lagune mit Wasserfall, Sprung ins Wasser
- Fenster 4: Rückkehr zum Steg, Anlegen und Blick in den Abendhimmel
- Fokus auf 14s Windows, realistische Zeitcodes und extreme Nahaufnahmen (100mm Macro)`,
  },
  {
    label: 'Luxus-Penthouse mit Smarthome',
    text: `- 2 Personen: Architektin und Bauherr erkunden High-End Dachgeschoss mit 360° Skyline-Blick
- Objekt: Penthouse mit raumhoher 3-fach Verglasung
- Drohnenflug über die Dachterrasse mit Infinity-Pool
- Steadicam durch die Designerküche mit freistehendem Küchenblock
- Automatische Beschattung und Lichtsteuerung im Sonnenuntergang
- Call to Action: "Exklusives Wohnen über den Dächern der Stadt"`,
  },
];

export const SAMPLE_STICHPUNKTE_LIST_EN = [
  {
    label: 'Agfachrome CT18: Extinction of the Spectrum (6-Part Film Cycle)',
    text: `- Genre: Drama / Apocalyptic / Psychological Thriller
- Setting: Decadent metropolis, monolithic government architecture, abandoned corridors and bunkers
- Film Emulation: Agfachrome CT18 Master Plugin (AP-41 Reversal Chemistry, cold sage shadows, fading ochre, picturesque dye grain, Zeiss Sonnar & Planar optics)
- Audio Architecture: Rhythmic infrasound drone (18Hz), mechanical march, mournful cello motifs and high-frequency resonances
- Part 1 (00:00-00:14): Illusion of control & mass powerlessness – Monolithic ministry, flickering monitors, deep vibration.
- Part 2 (00:14-00:28): Media hysteria & narratives – Abandoned TV studio, red flashing ON AIR, trembling anchor.
- Part 3 (00:28-00:42): 5-second warning & ticking fuses – Infrasound sirens, dropping cell towers, digital blackout.
- Part 4 (00:42-00:56): Societal divide & elite exodus – Barricades, fleeing armored convoys, shattered glass.
- Part 5 (00:56-01:10): 5 seconds to twelve – Abandoned apartment, ticking mechanical clock, dust swirling in sunbeam.
- Part 6 (01:10-01:24): The Finale – Silence before shockwave, thermal bleaching, transformation into dust statues in 100mm macro.
- Call to Action: "Extinction of the Spectrum — A photochemical film cycle on Agfachrome CT18"`,
  },
  {
    label: 'Elemental Matter: Kodachrome 64 K-14 Macro Art (Pigment, Metal & Kinetics)',
    text: `- Genre: Art / Experimental
- Protagonist: <Subject 1> Johannes Wobus (@Subject1_johannes_wobus), minimalist dark artist coat, intense eyes, 5500K neutral daylight
- Setting: Dark studio, basalt vessel, velvety obsidian D-Max shadows, zero yellow sepia drift
- Emulation: Kodachrome 64 Master Plugin (5500K daylight, 650nm carmine halation, authentic K-14 subtractive hues)
- Window 1: Macro 100mm T1.8: Hand of @Subject1_johannes_wobus touches dry mineral pigment in basalt crucible, microscopic pyrite reflections
- Window 2: Contrast line & finish: Draws pigment stroke across cheekbone and neck, velvety obsidian shadow edge, blur-reveal title and outro in pure black
- Audio & Score: Friction of mineral dust on stone and skin, deep double bass/cello sub-bass
- Call to Action: "Elemental Matter — Pure Material Kinetics"`,
  },
  {
    label: 'Guided Tour: Avatar Hosts Monument & Cultural Landmark',
    text: `- Genre: Travel Guide (Travel Videos & Tourism)
- Avatar / Guide: <Subject 1> Charismatic tour host / avatar (presents directly to camera, lively & engaging)
- Landmark / Monument: <Building 1> Historic cathedral / monument before blue sky
- Location: <Building 1> Historic plaza & monumental architecture
- Window 1: Introduction: Host <Subject 1> stands before grand portal of <Building 1>, welcomes viewers and teases historical mystery
- Window 2: Spectacular drone flight: Camera ascends above monument, orbits majestically capturing intricate stone carvings
- Window 3: Detailed walkthrough: <Subject 1> stands by relief carvings of <Building 1>, points out antique inscriptions with intriguing anecdote
- Window 4: Golden hour & outro: Camera glides back, <Subject 1> smiles inviting viewers to book the VIP guided tour
- Call to Action: "Discover the hidden stories of the city – Book your VIP tour now"`,
  },
  {
    label: 'Brand Film -> Restaurant: Fine Dining & Gourmet Indulgence',
    text: `- Setting: Exclusive restaurant with open kitchen & atmospheric candlelight
- Roles: <Subject 1> Head Chef (masterful plating), <Subject 2> Sommelier (fine wine service), Guests (enjoyment)
- Location: <Building 1> Restaurant & stylish dining hall
- Window 1: Macro close-up: <Subject 1> meticulously garnishes gourmet dish with tweezers and micro-herbs
- Window 2: Culinary passion: Sauté pan flares on gas burner, fragrant steam rises in slow motion
- Window 3: Elegant table service: <Subject 2> pours ruby red wine into wide crystal glasses in candlelight
- Window 4: Dining experience & room pan: Smiling guests clink glasses, seamless transition to outro
- Call to Action: "Taste experiences that linger in memory – Reserve your table today"`,
  },
  {
    label: 'Dark Retribution: Burning Steed & Vengeance (Action Aesthetic)',
    text: `- Protagonist: Avenger in black leather, glowing eyes & fiery aura (Ghostrider aesthetic)
- Entity / Prop: A demonic burning steed with flaming mane and glowing hooves
- Setting: Night cityscape, steaming asphalt, billowing smoke & shattered streetscape
- Window 1: The avenger descends on the flaming steed from the night sky, impacting with a massive crater
- Window 2: Slow-motion landing: Tremendous shockwave sweeps across the street, flames reflecting in the rider's eyes
- Window 3: Vengeance advance: The flaming steed charges forward, asphalt buckling and debris flying
- Window 4: Epic stillness in sea of flames: The avenger turns toward camera while fire blazes in background
- Call to Action: "Revenge Unleashed – From the ashes vengeance rises"`,
  },
  {
    label: 'Prefab Architecture: Move-in & Sunset Terrace',
    text: `- 2 Characters: Homeowner (32) and partner (36) arrive at their new timber frame prefab house
- Object: Modern timber show house 'Avantgarde 180' with solar panels and garden
- Window 1: Grand drone orbit 360° over roof with photovoltaic installation and landscaping
- Window 2: Entering foyer, tactile feel of natural oak and solid entrance door
- Window 3: Gazing in awe at open-plan living and dining area with panoramic glazing
- Window 4: Intimate sunset moment on the cedar deck with symbolic key handover
- Dialogue in English, concluding with compelling Call to Action: "Visit our model home now & plan your dream residence"`,
  },
];

export const getCameraPresets = (lang: Language = 'DE') => lang === 'EN' ? CAMERA_PRESETS_EN : CAMERA_PRESETS_DE;
export const getWeatherPresets = (lang: Language = 'DE') => lang === 'EN' ? WEATHER_PRESETS_EN : WEATHER_PRESETS_DE;
export const getBackgroundPresets = (lang: Language = 'DE') => lang === 'EN' ? BACKGROUND_PRESETS_EN : BACKGROUND_PRESETS_DE;
export const getGenrePresets = (lang: Language = 'DE') => lang === 'EN' ? GENRE_PRESETS_EN : GENRE_PRESETS_DE;
export const getCallToActionPresets = (lang: Language = 'DE') => lang === 'EN' ? CALL_TO_ACTION_PRESETS_EN : CALL_TO_ACTION_PRESETS_DE;
export const getSampleStichpunkte = (lang: Language = 'DE') => lang === 'EN' ? SAMPLE_STICHPUNKTE_LIST_EN : SAMPLE_STICHPUNKTE_LIST_DE;

export const CAMERA_PRESETS = CAMERA_PRESETS_DE;
export const WEATHER_PRESETS = WEATHER_PRESETS_DE;
export const BACKGROUND_PRESETS = BACKGROUND_PRESETS_DE;
export const GENRE_PRESETS = GENRE_PRESETS_DE;
export const CALL_TO_ACTION_PRESETS = CALL_TO_ACTION_PRESETS_DE;
export const SAMPLE_STICHPUNKTE_LIST = SAMPLE_STICHPUNKTE_LIST_DE;

export const DrehbuchKonfigurator: React.FC<DrehbuchKonfiguratorProps> = ({
  config,
  references = [],
  onChangeConfig,
  onApplyToScreenplay,
  settings,
  onShowToast,
  language = 'DE',
}) => {
  // Navigation / active tabs inside configurator
  const [activeTab, setActiveTab] = useState<'workflow' | 'subjects' | 'pressedView'>('workflow');
  const [inputMode, setInputMode] = useState<'stichpunkte' | 'presets'>('stichpunkte');

  // Generation & UI states
  const [isGeneratingProposals, setIsGeneratingProposals] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [expandedWindowIndex, setExpandedWindowIndex] = useState<number | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTimelineExportOpen, setIsTimelineExportOpen] = useState(false);
  const [editingClaimsProposal, setEditingClaimsProposal] = useState<ConceptProposal | null>(null);

  // Textarea Ref for precise cursor tag injection
  const stichpunkteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper: Insert text/tag at cursor position or append cleanly
  const handleInsertTextIntoStichpunkte = (textToInsert: string) => {
    const textarea = stichpunkteTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      const current = config.stichpunkte || '';
      const before = current.substring(0, start);
      const after = current.substring(end);
      const prefix = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : '';
      const suffix = after.startsWith(' ') || after.startsWith('\n') || after.length === 0 ? '' : ' ';
      const updated = before + prefix + textToInsert + suffix + after;
      onChangeConfig({ ...config, stichpunkte: updated });
      setTimeout(() => {
        textarea.focus();
        const newPos = start + prefix.length + textToInsert.length + suffix.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 50);
    } else {
      const current = config.stichpunkte || '';
      const updated = current.trim() ? `${current.trim()} ${textToInsert}` : textToInsert;
      onChangeConfig({ ...config, stichpunkte: updated });
    }
    onShowToast('info', `"${textToInsert}" eingefügt`);
  };

  // Active References derived (synced with config.references or config.subjects)
  const currentReferences = useMemo(() => {
    if (config.references !== undefined) return config.references;
    if (config.subjects !== undefined) return config.subjects;
    return DEFAULT_SUBJECT_REFERENCES;
  }, [config.references, config.subjects]);

  // Target Audience derived from config
  const currentTargetAudience = useMemo(() => {
    if (config.targetAudienceCustom) return config.targetAudienceCustom;
    return (
      getTargetAudienceById(config.targetAudienceId, config.customTargetAudiences) ||
      DEFAULT_TARGET_AUDIENCE
    );
  }, [config.targetAudienceId, config.targetAudienceCustom, config.customTargetAudiences]);

  // Concept proposals
  const proposals = useMemo(() => {
    return config.proposals && config.proposals.length > 0
      ? config.proposals
      : DEFAULT_PROPOSALS;
  }, [config.proposals]);

  const selectedProposal = useMemo(() => {
    return (
      proposals.find((p) => p.id === config.selectedProposalId) ||
      proposals[0]
    );
  }, [proposals, config.selectedProposalId]);

  // Window duration helper (Default 14s)
  const windowDuration = config.windowDurationSeconds || 14;
  const dialogueLang = config.dialogueLanguage || 'German';
  const finalCta =
    config.finalCallToAction !== undefined ? config.finalCallToAction : 'Jetzt Musterhaus besichtigen & Ihr Traumhaus planen';

  // Handler: Update References & sync subjects
  const handleUpdateReferences = (newRefs: ConfigReference[]) => {
    onChangeConfig({
      ...config,
      references: newRefs,
      subjects: newRefs,
    });
  };

  // Handler: Select Target Audience
  const handleSelectAudience = (audience: TargetAudience) => {
    onChangeConfig({
      ...config,
      targetAudienceId: audience.id,
      targetAudienceCustom: audience,
    });
    onShowToast('info', `Zielgruppe "${audience.name}" aktiviert.`);
  };

  // Handler: Add Custom Audience
  const handleAddCustomAudience = (audience: TargetAudience) => {
    const existing = config.customTargetAudiences || [];
    const updated = [...existing.filter((a) => a.id !== audience.id), audience];
    onChangeConfig({
      ...config,
      customTargetAudiences: updated,
      targetAudienceId: audience.id,
      targetAudienceCustom: audience,
    });
  };

  // Handler: Delete Custom Audience
  const handleDeleteCustomAudience = (id: string) => {
    const existing = config.customTargetAudiences || [];
    const updated = existing.filter((a) => a.id !== id);
    const newSelectedId =
      config.targetAudienceId === id ? DEFAULT_TARGET_AUDIENCE.id : config.targetAudienceId;
    onChangeConfig({
      ...config,
      customTargetAudiences: updated,
      targetAudienceId: newSelectedId,
      targetAudienceCustom: getTargetAudienceById(newSelectedId, updated),
    });
  };

  // Handler: Apply Target Audience CTA
  const handleApplyAudienceCta = (ctaText: string) => {
    onChangeConfig({
      ...config,
      finalCallToAction: ctaText,
    });
    onShowToast('success', `Zielgruppen-CTA übernommen: "${ctaText}"`);
  };

  // Handler: Change duration
  const handleSetDuration = (duration: number) => {
    const valid = Math.max(4, Math.min(30, duration));
    const updatedWindows = (config.windows || []).map((w) => ({
      ...w,
      durationSeconds: valid,
    }));
    onChangeConfig({
      ...config,
      windowDurationSeconds: valid,
      windows: updatedWindows,
    });
    onShowToast('info', `Dauer auf ${valid} Sekunden pro Window gesetzt.`);
  };

  // Handler: Change window count
  const handleSetWindowCount = (count: number) => {
    const valid = Math.max(1, Math.min(12, count));
    const currentWins = config.windows || [];
    const updatedWins: WindowConfig[] = [];

    for (let i = 1; i <= valid; i++) {
      const existing = currentWins.find((w) => w.windowNumber === i);
      if (existing) {
        updatedWins.push(existing);
      } else {
        updatedWins.push({
          id: `win-${i}-${Date.now()}`,
          windowNumber: i,
          title: `Window ${i}: ${i === 1 ? 'Anflug & Totale' : i === valid ? 'Outro & Call-to-Action' : `Szenenabschnitt ${i}`}`,
          durationSeconds: windowDuration,
          cameraMovement: CAMERA_PRESETS[(i - 1) % CAMERA_PRESETS.length],
          weather: config.globalWeather || WEATHER_PRESETS[0],
          background: config.globalBackground || BACKGROUND_PRESETS[0],
          musicStyle: config.globalMusic || 'Cinematic Ambient',
          soundDesign: config.globalSoundDesign || 'Sanfter Sommerwind & Atmos',
          claim: i === valid ? finalCta : `Qualität in jedem Detail (Window ${i})`,
          visualFocus: i === 1 ? 'Architektur & Fassade' : 'Raumaufteilung & Materialästhetik',
        });
      }
    }

    onChangeConfig({
      ...config,
      windowCount: valid,
      windows: updatedWins,
    });
  };

  // Handler: Apply single camera movement to window
  const handleApplyCameraMovementToWindow = (windowIndex: number, movementPrompt: string) => {
    const currentWins = [...(config.windows || [])];
    if (currentWins[windowIndex]) {
      currentWins[windowIndex] = {
        ...currentWins[windowIndex],
        cameraMovement: movementPrompt,
      };
      onChangeConfig({
        ...config,
        windows: currentWins,
      });
    }
  };

  // Handler: Apply whole camera plan to all windows
  const handleApplyCameraPlanToAll = (
    cameraPlan: { windowIndex: number; movementPrompt: string }[]
  ) => {
    const currentWins = [...(config.windows || [])];
    cameraPlan.forEach(({ windowIndex, movementPrompt }) => {
      if (currentWins[windowIndex]) {
        currentWins[windowIndex] = {
          ...currentWins[windowIndex],
          cameraMovement: movementPrompt,
        };
      }
    });
    onChangeConfig({
      ...config,
      windows: currentWins,
    });
  };

  // Handler: Apply LM Studio Design Concept (Colors, Light, Sound, Atmosphere)
  const handleApplyDesignConcept = (design: {
    globalWeather: string;
    globalBackground: string;
    globalMusic: string;
    globalSoundDesign: string;
    colorPalette?: { name: string; hex: string; usage?: string }[];
    themeTitle?: string;
  }) => {
    const updatedWindows = (config.windows || []).map((w) => ({
      ...w,
      weather: design.globalWeather || w.weather,
      background: design.globalBackground || w.background,
      musicStyle: design.globalMusic || w.musicStyle,
      soundDesign: design.globalSoundDesign || w.soundDesign,
    }));

    onChangeConfig({
      ...config,
      globalWeather: design.globalWeather,
      globalBackground: design.globalBackground,
      globalMusic: design.globalMusic,
      globalSoundDesign: design.globalSoundDesign,
      windows: updatedWindows,
    });
  };

  // Handler: Load project from saved JSON file (legacy)
  const handleLoadProjectState = (
    loadedState: Partial<DrehbuchKonfiguratorState>,
    title?: string
  ) => {
    onChangeConfig({
      ...config,
      ...loadedState,
      title: title || loadedState.title || config.title,
    });
  };

  // Handler: Save complete project to /data/projects/{slug}/
  const handleSaveProjectToDisk = async (projectName: string, title?: string): Promise<boolean> => {
    try {
      const payload = {
        name: projectName,
        title: title || config.title || projectName,
        description: config.stichpunkte?.slice(0, 150) || 'Drehbuch & Windows',
        projectData: {
          ...config,
          title: title || config.title || projectName,
          references: currentReferences,
          subjects: currentReferences,
          targetAudienceId: currentTargetAudience.id,
          targetAudienceCustom: currentTargetAudience,
        },
      };

      const res = await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onChangeConfig({
          ...config,
          title: title || config.title || projectName,
          projectName: data.slug,
          projectId: data.slug,
        });
        onShowToast(
          'success',
          `Projekt "${title || projectName}" erfolgreich in /data/projects/${data.slug}/ abgelegt!`
        );
        return true;
      } else {
        onShowToast('error', data.error || 'Fehler beim Speichern des Projekts.');
        return false;
      }
    } catch (err: any) {
      onShowToast('error', `Fehler beim Speichern: ${err.message}`);
      return false;
    }
  };

  // Handler: Load project from /data/projects/{slug}/
  const handleLoadProjectFromDisk = (
    loadedState: Partial<DrehbuchKonfiguratorState>,
    projectName: string
  ) => {
    const nextRefs = loadedState.references !== undefined ? loadedState.references : loadedState.subjects;
    onChangeConfig({
      ...config,
      ...loadedState,
      references: nextRefs,
      subjects: nextRefs,
      title: loadedState.title || projectName,
      projectName: projectName,
      projectId: projectName,
    });
  };

  // Handler: Change dialogue language
  const handleSetDialogueLanguage = (lang: DialogueLanguage) => {
    onChangeConfig({
      ...config,
      dialogueLanguage: lang,
    });
    onShowToast('success', `Dialogsprache auf ${lang} umgeschaltet.`);
  };

  // Handler: Generate 3 Proposals via LM Studio
  const handleGenerateProposalsWithLMStudio = async () => {
    if (isDarkRetributionGenre(config.genre) && !config.darkRetributionDisclaimerAccepted) {
      onShowToast(
        'error',
        'Pflicht-Disclaimer erforderlich: Bitte bestätige zuerst den Rache- & Vergeltungs-Disclaimer mit dem Häkchen.'
      );
      return;
    }

    setIsGeneratingProposals(true);
    try {
      const payload = {
        endpoint: settings.endpoint,
        modelName: settings.modelName,
        apiKey: settings.apiKey,
        timeoutSeconds: settings.timeoutSeconds || 240,
        stichpunkte: config.stichpunkte || '',
        windowCount: config.windowCount || 4,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        references: currentReferences,
        subjects: currentReferences,
        targetAudience: currentTargetAudience,
        finalCallToAction: finalCta,
        globalWeather: config.globalWeather || currentTargetAudience.colorSpectrum || WEATHER_PRESETS[0],
        globalBackground: config.globalBackground || BACKGROUND_PRESETS[0],
        globalCam: config.windows?.[0]?.cameraMovement || CAMERA_PRESETS[0],
        genre: config.genre || 'Architektur & Lifestyle (Immobilien)',
        ultraPhysicsMode: config.ultraPhysicsMode === true,
        lensOpticsMode: config.lensOpticsMode === true,
        selectedLens: config.selectedLens || 'auto',
        voiceModulation: config.voiceModulation,
      };

      const res = await fetch('/api/screenplay/generate-proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Serverfehler beim Generieren');
      }

      const data = await res.json();
      if (data.proposals && Array.isArray(data.proposals) && data.proposals.length > 0) {
        onChangeConfig({
          ...config,
          proposals: data.proposals,
          selectedProposalId: data.proposals[0].id,
        });
        onShowToast(
          'success',
          `Drehbuch-Vorschlag ${data.source === 'lmstudio' ? 'aus LM Studio' : 'erfolgreich'} geladen!`
        );
      } else {
        throw new Error('Keine Vorschläge empfangen.');
      }
    } catch (err: any) {
      console.error(err);
      onShowToast('error', `Generierungsfehler: ${err.message}`);
    } finally {
      setIsGeneratingProposals(false);
    }
  };

  // Handler: Update CTA with instant live re-pressing of single-line windows
  const handleUpdateCta = (newCta: string) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      finalCallToAction: newCta,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: newCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
  };

  // Handler: Update Typography Overlay with instant live re-pressing of single-line windows
  const handleUpdateTypographyOverlay = (newOverlay: TypographyOverlayConfig) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      typographyOverlay: newOverlay,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: newOverlay,
        voiceModulation: config.voiceModulation,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    } else if (config.windows && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressConfigToSingleLineWindows({
        windows: config.windows,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: newOverlay,
        voiceModulation: config.voiceModulation,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
  };

  // Handler: Update Voice Modulation with instant live re-pressing of single-line windows
  const handleUpdateVoiceModulation = (newVoiceConfig: VoiceModulationConfig) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      voiceModulation: newVoiceConfig,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: newVoiceConfig,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    } else if (config.windows && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressConfigToSingleLineWindows({
        windows: config.windows,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: newVoiceConfig,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
  };

  // Handler: Update AstroCinema LoRA toggle with instant live re-pressing of single-line windows
  const handleToggleAstroCinemaLora = (enabled: boolean) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      astroCinemaLoraMode: enabled,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: enabled,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
    onShowToast('info', enabled ? 'Cinematic Style LoRA (ASTROCINEMAV01K2T) aktiviert' : 'Cinematic Style LoRA deaktiviert');
  };

  // Handler: Update AstroCinema LoRA keywords toggle
  const handleToggleAstroCinemaKeywords = (keywordsEnabled: boolean) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      astroCinemaLoraKeywords: keywordsEnabled,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: keywordsEnabled,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
  };

  // Handler: Update Visual Style with instant live re-pressing of single-line windows
  const handleSelectVisualStyle = (styleId: string) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      visualStyle: styleId,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: styleId,
        analogLaborStörung: config.analogLaborStörung,
        analogMacroRecipe: config.analogMacroRecipe,
      });
      updatedConfig.pressedWindows = rePressed;
    } else if (config.windows && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressConfigToSingleLineWindows({
        windows: config.windows,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: styleId,
        analogLaborStörung: config.analogLaborStörung,
        analogMacroRecipe: config.analogMacroRecipe,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);

    const styleNames: Record<string, string> = {
      natural: 'Natürlicher Tageslicht-Stil',
      golden_hour: 'Warm Golden Hour Stil',
      art_noir: 'Mamiya RZ67 Art Noir (Monochrom/Chiaroscuro) Stil',
      vintage_16mm: 'Vintage 16mm Analog-Film Stil',
      fujicolor_eterna_500t: 'Fujicolor Eterna 500T Master Plugin (Die Falsifikation)',
      agfachrome_ct18: 'Agfachrome CT18 Master Plugin (Das Erlöschen des Spektrums)',
      kodak_5247: 'Kodak 5247 Master Plugin (ENR Bleach-Bypass)',
      svema_zenit: 'Svema Color & Helios/Jupiter Emulation',
      kodachrome: 'Kodachrome 64 Dia Emulation',
      krasnogorsk_16mm: 'Krasnogorsk-3 16mm Emulation',
      polaroid_fp100c: 'Fujifilm FP-100C Trennbild Emulation',
      wet_plate: 'Kollodium-Nassplatte (1851) Emulation',
      petzval: 'Petzval 1840 Optik-Emulation',
      leica_noctilux: 'Leica Noctilux f/0.95 Optik-Emulation',
      technicolor_v4: 'Technicolor System No. 4 (1935) Emulation',
      aerochrome_infrared: 'Kodak Aerochrome Infrared Emulation',
      orwo_nc21: 'ORWO Color NC21 Emulation',
      agfachrome_50s: 'Agfachrome 50S Pastell Emulation',
      super8_tri_x: 'Super 8 Kodak Tri-X/Ektachrome Emulation',
      '35mm_anamorphic': '35mm Cine-Scope Kodak Vision3 Emulation',
      '70mm_imax': '70mm IMAX Large Format Emulation',
    };
    onShowToast('success', `${styleNames[styleId] || styleId} aktiviert!`);
  };

  // Handler: Update Analog Labor Störung with instant live re-pressing
  const handleSelectLaborStörung = (störung: 'none' | 'cross_processing' | 'film_soup' | 'thermal_shock' | 'bleach_bypass') => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      analogLaborStörung: störung,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
        analogLaborStörung: störung,
        analogMacroRecipe: config.analogMacroRecipe,
      });
      updatedConfig.pressedWindows = rePressed;
    } else if (config.windows && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressConfigToSingleLineWindows({
        windows: config.windows,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
        analogLaborStörung: störung,
        analogMacroRecipe: config.analogMacroRecipe,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
    
    const störungNames = {
      none: 'Keine chemische Störung',
      cross_processing: 'Cross-Processing (C-41 in E-6)',
      film_soup: 'Film-Souping (Chemischer Gelatine-Fraß)',
      thermal_shock: 'Thermal Shock (Hitzeschaden)',
      bleach_bypass: 'Bleach Bypass (Silberrückhaltung)',
    };
    onShowToast('success', `${störungNames[störung]} aktiviert!`);
  };

  // Handler: Update Analog Macro Recipe with instant live re-pressing
  const handleSelectMacroRecipe = (recipeId: 'none' | 'chemical_feast' | 'silver_scar' | 'saturated_rust') => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      analogMacroRecipe: recipeId,
    };
    // If a recipe is chosen, automatically set a domain-appropriate visualStyle/profile if none is active
    if (recipeId === 'chemical_feast' && config.visualStyle !== 'svema_zenit') {
      updatedConfig.visualStyle = 'svema_zenit';
    } else if (recipeId === 'silver_scar' && config.visualStyle !== 'wet_plate') {
      updatedConfig.visualStyle = 'wet_plate';
    } else if (recipeId === 'saturated_rust' && config.visualStyle !== 'kodachrome') {
      updatedConfig.visualStyle = 'kodachrome';
    }

    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: updatedConfig.visualStyle || config.visualStyle,
        analogLaborStörung: config.analogLaborStörung,
        analogMacroRecipe: recipeId,
      });
      updatedConfig.pressedWindows = rePressed;
    } else if (config.windows && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressConfigToSingleLineWindows({
        windows: config.windows,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: updatedConfig.visualStyle || config.visualStyle,
        analogLaborStörung: config.analogLaborStörung,
        analogMacroRecipe: recipeId,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);

    const recipeNames = {
      none: 'Standard-Makrofokus',
      chemical_feast: 'Rezept: „The Chemical Feast“ (Svema-Souping)',
      silver_scar: 'Rezept: „The Silver Scar“ (Kollodium-Quecksilber)',
      saturated_rust: 'Rezept: „Saturated Rust“ (Kodachrome-Glut)',
    };
    onShowToast('success', `${recipeNames[recipeId]} geladen und injiziert!`);
  };

  // Handler: Update custom LoRA Action Code with live re-pressing
  const handleUpdateActionCode = (newCode: string) => {
    const activeProposal = selectedProposal || proposals[0];
    const updatedConfig: DrehbuchKonfiguratorState = {
      ...config,
      actionCode: newCode,
    };
    if (activeProposal && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressProposalToSingleLineWindows({
        proposal: activeProposal,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: newCode,
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    } else if (config.windows && config.pressedWindows && config.pressedWindows.length > 0) {
      const rePressed = pressConfigToSingleLineWindows({
        windows: config.windows,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: newCode,
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
      updatedConfig.pressedWindows = rePressed;
    }
    onChangeConfig(updatedConfig);
  };

  // Handler: Update an individual window's claim & typography in a proposal with live re-pressing
  const handleUpdateProposalWindowClaim = (
    proposalId: string,
    windowNumber: number,
    newClaim: string,
    newTypography?: WindowClaimTypography
  ) => {
    const updatedProposals = (config.proposals || []).map((p) => {
      if (p.id !== proposalId) return p;
      const updatedWindows = p.windowBreakdown.map((w) => {
        if (w.windowNumber !== windowNumber) return w;
        return {
          ...w,
          claimOrCta: newClaim,
          claimTypography: newTypography !== undefined ? newTypography : w.claimTypography,
        };
      });
      return { ...p, windowBreakdown: updatedWindows };
    });

    const activeProp =
      updatedProposals.find((p) => p.id === (config.selectedProposalId || selectedProposal.id)) ||
      updatedProposals[0];

    let newPressed = config.pressedWindows;
    if (activeProp && activeProp.id === proposalId && config.pressedWindows && config.pressedWindows.length > 0) {
      newPressed = pressProposalToSingleLineWindows({
        proposal: activeProp,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: activeProp.callToAction || config.finalCallToAction || finalCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
    }

    onChangeConfig({
      ...config,
      proposals: updatedProposals,
      pressedWindows: newPressed,
    });
    onShowToast('info', `Claim & Typografie für Window ${windowNumber} aktualisiert`);
  };

  // Handler: Update a proposal's final call to action & typography with live re-pressing
  const handleUpdateProposalCta = (
    proposalId: string,
    newCta: string,
    newTypography?: WindowClaimTypography
  ) => {
    const updatedProposals = (config.proposals || []).map((p) => {
      if (p.id !== proposalId) return p;
      return {
        ...p,
        callToAction: newCta,
        callToActionTypography: newTypography !== undefined ? newTypography : p.callToActionTypography,
      };
    });

    const activeProp =
      updatedProposals.find((p) => p.id === (config.selectedProposalId || selectedProposal.id)) ||
      updatedProposals[0];

    let newPressed = config.pressedWindows;
    if (activeProp && activeProp.id === proposalId && config.pressedWindows && config.pressedWindows.length > 0) {
      newPressed = pressProposalToSingleLineWindows({
        proposal: activeProp,
        allSubjects: currentReferences,
        windowDurationSeconds: windowDuration,
        dialogueLanguage: dialogueLang,
        actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
        aspectRatio: config.aspectRatio || '16:9',
        globalWeather: config.globalWeather,
        globalBackground: config.globalBackground,
        finalCallToAction: newCta,
        targetAudience: currentTargetAudience,
        typographyOverlay: config.typographyOverlay,
        voiceModulation: config.voiceModulation,
        astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
        astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
        visualStyle: config.visualStyle,
      });
    }

    onChangeConfig({
      ...config,
      proposals: updatedProposals,
      finalCallToAction: newCta,
      pressedWindows: newPressed,
    });
    onShowToast('info', `Call-to-Action & Typografie aktualisiert`);
  };

  // Handler: Press Proposal into Single-Line Windows format!
  const handlePressProposalToSingleLine = (proposal: ConceptProposal) => {
    if (isDarkRetributionGenre(config.genre) && !config.darkRetributionDisclaimerAccepted) {
      onShowToast(
        'error',
        'Pflicht-Disclaimer erforderlich: Bitte bestätige zuerst den Rache- & Vergeltungs-Disclaimer mit dem Häkchen.'
      );
      return;
    }

    const activeCta = config.finalCallToAction || proposal.callToAction || finalCta;
    const pressed = pressProposalToSingleLineWindows({
      proposal,
      allSubjects: currentReferences,
      windowDurationSeconds: windowDuration,
      dialogueLanguage: dialogueLang,
      actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
      aspectRatio: config.aspectRatio || '16:9',
      globalWeather: config.globalWeather,
      globalBackground: config.globalBackground,
      finalCallToAction: activeCta,
      targetAudience: currentTargetAudience,
      typographyOverlay: config.typographyOverlay,
      voiceModulation: config.voiceModulation,
      astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
      astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
      visualStyle: config.visualStyle,
    });

    onChangeConfig({
      ...config,
      selectedProposalId: proposal.id,
      finalCallToAction: activeCta,
      pressedWindows: pressed,
    });

    setActiveTab('pressedView');
    onShowToast(
      'success',
      `Erfolgreich gepresst! Alle ${pressed.length} Windows sind garantiert 1 Zeile ohne Umbrüche.`
    );
  };

  // Handler: Press Current Manual Windows to Single-Line Windows format!
  const handlePressCurrentConfigToSingleLine = () => {
    if (isDarkRetributionGenre(config.genre) && !config.darkRetributionDisclaimerAccepted) {
      onShowToast(
        'error',
        'Pflicht-Disclaimer erforderlich: Bitte bestätige zuerst den Rache- & Vergeltungs-Disclaimer mit dem Häkchen.'
      );
      return;
    }

    const pressed = pressConfigToSingleLineWindows({
      windows: config.windows,
      allSubjects: currentReferences,
      windowDurationSeconds: windowDuration,
      dialogueLanguage: dialogueLang,
      actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
      aspectRatio: config.aspectRatio || '16:9',
      globalWeather: config.globalWeather,
      globalBackground: config.globalBackground,
      finalCallToAction: finalCta,
      targetAudience: currentTargetAudience,
      typographyOverlay: config.typographyOverlay,
      voiceModulation: config.voiceModulation,
      astroCinemaLoraMode: config.astroCinemaLoraMode !== false,
      astroCinemaLoraKeywords: config.astroCinemaLoraKeywords !== false,
      visualStyle: config.visualStyle,
    });

    onChangeConfig({
      ...config,
      pressedWindows: pressed,
    });

    setActiveTab('pressedView');
    onShowToast(
      'success',
      `Erfolgreich gepresst! Alle ${pressed.length} Windows im exakten Single-Line Format.`
    );
  };

  // Copy full prompt string (all windows combined with single newline separator)
  const handleCopyAllSingleLineWindows = () => {
    if (!config.pressedWindows || config.pressedWindows.length === 0) return;
    const fullText = config.pressedWindows.map((w) => w.singleLinePrompt).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedPromptId('all');
    setTimeout(() => setCopiedPromptId(null), 2500);
    onShowToast('success', 'Alle Windows in die Zwischenablage kopiert!');
  };

  // Copy individual window
  const handleCopySingleWindow = (windowNumber: number, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(`win-${windowNumber}`);
    setTimeout(() => setCopiedPromptId(null), 2500);
    onShowToast('info', `Window ${windowNumber} kopiert (garantiert 1 Zeile)!`);
  };

  // Download as text file
  const handleDownloadTxt = () => {
    if (!config.pressedWindows || config.pressedWindows.length === 0) return;
    const fullText = config.pressedWindows.map((w) => w.singleLinePrompt).join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `single_line_windows_${windowDuration}s_${dialogueLang.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('success', 'Textdatei heruntergeladen!');
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
        {/* Project Context & Storage Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 text-white px-4 py-2.5 rounded-xl mb-4 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Projektordner
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {config.title || config.projectName || 'Musterhaus Drehbuch'}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block truncate">
                /data/projects/{config.projectName || 'standard'}/
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSaveProjectToDisk(config.projectName || config.title || 'Musterhaus')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Speichert Referenzen, Windows & Prompts direkt in den Unterordner /data/projects/{name}"
            >
              <Save className="w-3.5 h-3.5" />
              <span>In data speichern</span>
            </button>

            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Projekte ({config.projectName || 'standard'})</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Single-Line Windows Format
              </span>
              <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                1 Window = Exakt 1 Zeile ohne Umbrüche
              </span>
              <span className="text-[11px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                Default: 14.000s
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Zielgruppe: {currentTargetAudience.name.split(' ')[0]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              Drehbuchkonfigurator &amp; Single-Line Windows-Studio
            </h2>
            <p className="text-xs text-zinc-600 mt-1 max-w-3xl leading-relaxed">
              Erstelle per Stichpunkt oder Preset einen laientauglichen Drehbuch-Entwurf mit LM Studio.
              Wähle die Zielgruppe und hinterlege Referenzen für Menschen, Haus/Objekt, Grundriss und Requisiten.
              Drücke das Ergebnis mit 1 Klick in das verbindliche Single-Line-Format für MiniMax H3 und Maestro.
            </p>
          </div>

          {/* Quick Stats / Global Bar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
            {/* Window Count Control */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Windows
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetWindowCount(config.windowCount - 1)}
                  disabled={config.windowCount <= 1}
                  className="w-7 h-7 rounded-lg bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-mono font-bold text-sm text-zinc-900 bg-white border border-zinc-300 rounded-lg py-0.5">
                  {config.windowCount}
                </span>
                <button
                  type="button"
                  onClick={() => handleSetWindowCount(config.windowCount + 1)}
                  disabled={config.windowCount >= 12}
                  className="w-7 h-7 rounded-lg bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-200 mx-1 hidden sm:block" />

            {/* Window Duration (Default 14s) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                Dauer / Win
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetDuration(windowDuration - 1)}
                  disabled={windowDuration <= 4}
                  className="w-7 h-7 rounded-lg bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center font-mono font-bold text-xs text-zinc-900 bg-white border border-zinc-300 rounded-lg px-2 py-1 shadow-2xs">
                  <span>{windowDuration}s</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSetDuration(windowDuration + 1)}
                  disabled={windowDuration >= 30}
                  className="w-7 h-7 rounded-lg bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-200 mx-1 hidden sm:block" />

            {/* Dialogue Language Switcher */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-600" />
                Dialog-Sprache
              </span>
              <div className="flex items-center gap-1 bg-white border border-zinc-300 rounded-lg p-0.5">
                {(['German', 'English', 'French', 'Spanish'] as DialogueLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleSetDialogueLanguage(lang)}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      dialogueLang === lang
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {lang === 'German' ? '🇩🇪 DE' : lang === 'English' ? '🇬🇧 EN' : lang === 'French' ? '🇫🇷 FR' : '🇪🇸 ES'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mt-6 pt-4 border-t border-zinc-200">
          {/* Main 3 Workflow Steps */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-2xl border border-zinc-200 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'workflow'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Zielgruppe &amp; Vorschläge</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'subjects'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Referenzen &amp; Objekte ({currentReferences.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!config.pressedWindows || config.pressedWindows.length === 0) {
                  handlePressProposalToSingleLine(selectedProposal);
                } else {
                  setActiveTab('pressedView');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'pressedView'
                  ? 'bg-amber-400 text-zinc-950 font-extrabold shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3. Single-Line Windows</span>
              {config.pressedWindows && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Tools: Design Concept, Camera Director, Prompt Archive */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDesignModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>Design &amp; Look</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-amber-700" />
              <span>Camführung</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPromptModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON-Archiv</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TARGET AUDIENCE, WORKFLOW & 3 LM STUDIO PROPOSALS */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          {/* Genre & Tonalität Hauptauswahl ganz oben */}
          <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-2xl p-4.5 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-extrabold rounded-md uppercase tracking-wide">
                  Globales Leit-Genre
                </span>
                <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-rose-600" />
                  <span>Haupt-Genre &amp; Tonalität des Drehbuchs</span>
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Bestimmt die dramaturgische Ausrichtung, Musikästhetik, Kameraführung und Tonalität der Dialoge.
                </p>
              </div>

              <div className="w-full sm:w-80 shrink-0">
                <select
                  value={config.genre || 'Architektur & Lifestyle (Immobilien)'}
                  onChange={(e) => onChangeConfig({ ...config, genre: e.target.value })}
                  className="w-full text-xs bg-white border-2 border-rose-300 rounded-xl px-3 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-rose-500 shadow-2xs cursor-pointer"
                >
                  {GENRE_PRESETS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reiseführung Info & Workflow Box */}
            {isTourGuideGenre(config.genre) && (
              <div className="mt-3 p-3.5 bg-gradient-to-r from-sky-50 via-blue-50/50 to-indigo-50/30 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-start gap-3 shadow-2xs">
                <Compass className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sky-900">
                      Genre Reiseführung aktiviert
                    </span>
                    <span className="text-[10px] bg-sky-100/90 text-sky-800 font-bold px-2 py-0.5 rounded border border-sky-300">
                      Avatar + Kultur-/Denkmal-Referenz
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-800 leading-relaxed">
                    <strong>Workflow:</strong> Klinke unter <em>&bdquo;2. Referenzen &amp; Objekte&ldquo;</em> deinen Avatar als <code className="font-mono bg-white text-sky-950 px-1.5 py-0.5 rounded border border-sky-200 font-bold">&lt;Subject 1&gt;</code> und dein Denkmal / Monument / Sehenswürdigkeit als <code className="font-mono bg-white text-sky-950 px-1.5 py-0.5 rounded border border-sky-200 font-bold">&lt;Building 1&gt;</code> oder <code className="font-mono bg-white text-sky-950 px-1.5 py-0.5 rounded border border-sky-200 font-bold">&lt;Object 1&gt;</code> ein. LM Studio generiert daraus die lebendige Moderation des Avatars (gesprochene Dialoge &amp; Anekdoten), epische Drohnen- &amp; Detailflüge um das Bauwerk sowie informative On-Screen Fakten-Claims.
                  </p>
                </div>
              </div>
            )}

            {/* Retribution Disclaimer (Mandatory Checkbox when Rache genre is selected) */}
            {isDarkRetributionGenre(config.genre) && (
              <div className="mt-4 pt-4 border-t border-rose-100">
                <RetributionDisclaimerCard
                  isAccepted={Boolean(config.darkRetributionDisclaimerAccepted)}
                  onToggleAccept={(accepted) =>
                    onChangeConfig({ ...config, darkRetributionDisclaimerAccepted: accepted })
                  }
                  genreTitle={config.genre}
                />
              </div>
            )}
          </div>

          {/* Target Audience Component: Colors, Sound, Psychology */}
          <TargetAudienceSelector
            selectedAudienceId={currentTargetAudience.id}
            onSelectAudience={handleSelectAudience}
            onApplyCtaToVideo={handleApplyAudienceCta}
            currentCta={finalCta}
            customAudiences={config.customTargetAudiences || []}
            onAddCustomAudience={handleAddCustomAudience}
            onDeleteCustomAudience={handleDeleteCustomAudience}
            lmStudioEndpoint={settings.endpoint}
            lmStudioModel={settings.modelName}
            lmStudioApiKey={settings.apiKey}
            onShowToast={onShowToast}
            language={language}
          />

          {/* Input Card: Stichpunkte OR Presets */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-zinc-700" />
                  <span>Schritt A: Drehbuch-Vorgaben (Stichpunkte oder Zusammenklicken)</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Gib kurz in Stichpunkten vor, was passieren soll – oder nutze die vorgefertigten Schnell-Presets.
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setInputMode('stichpunkte')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputMode === 'stichpunkte'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Stichpunkt-Modus
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('presets')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputMode === 'presets'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Zusammenklicken
                </button>
              </div>
            </div>

            {inputMode === 'stichpunkte' ? (
              <div className="space-y-3.5">
                {/* Reference Usage Guide & Infotext: How LM Studio processes references & why tags prevent confusion */}
                <ReferenceUsageGuideCard
                  currentReferences={currentReferences}
                  onInsertTag={(sample) => handleInsertTextIntoStichpunkte(sample)}
                />

                {/* Interactive 1-Click Reference Chips Bar */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      <span>Referenzen per Klick direkt in Text einfügen:</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                      {currentReferences.length} Referenzen verfügbar
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentReferences.map((ref, idx) => {
                      const tagText = ref.tag || `<Ref ${idx + 1}>`;
                      const tagWithRef = `${tagText} ${ref.name}`;
                      const insertLine = `- Referenz: ${ref.name} (${tagText}) – Rolle/Aktion: ${ref.roleOrAction || 'Hauptmotiv'}`;
                      return (
                        <div
                          key={ref.id || idx}
                          className="flex items-center bg-white border border-amber-200 rounded-lg shadow-2xs overflow-hidden"
                        >
                          {/* Tag Button: Inlines into cursor sentence */}
                          <button
                            type="button"
                            onClick={() => handleInsertTextIntoStichpunkte(tagWithRef)}
                            className="group flex items-center gap-1 px-2 py-1 hover:bg-amber-100/90 text-zinc-800 hover:text-amber-950 text-xs font-semibold transition cursor-pointer"
                            title={`Klicke hier, um "${tagWithRef}" an die Cursor-Position einzufügen (z. B. "${tagWithRef} knutscht mit...")`}
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition" />
                            <span>+ {ref.name}</span>
                            <span className="text-[10px] font-mono text-amber-900 bg-amber-100/80 px-1 py-0.2 rounded border border-amber-200">
                              {tagText}
                            </span>
                          </button>

                          {/* Full Line Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const current = config.stichpunkte || '';
                              const updated = current.trim() ? `${current.trim()}\n${insertLine}` : insertLine;
                              onChangeConfig({ ...config, stichpunkte: updated });
                              onShowToast('info', `Zeile für "${ref.name}" angehängt.`);
                            }}
                            className="px-1.5 py-1 hover:bg-amber-200/60 text-amber-800 text-[10px] font-bold border-l border-amber-200 transition cursor-pointer"
                            title="Ganze Zeile an Stichpunkte anhängen"
                          >
                            + Zeile
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">
                    Komplette Szenario-Presets:
                  </span>
                  {SAMPLE_STICHPUNKTE_LIST.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChangeConfig({ ...config, stichpunkte: sample.text });
                        onShowToast('info', `"${sample.label}" eingefügt.`);
                      }}
                      className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>

                <textarea
                  ref={stichpunkteTextareaRef}
                  rows={5}
                  value={config.stichpunkte}
                  onChange={(e) => onChangeConfig({ ...config, stichpunkte: e.target.value })}
                  placeholder="Gib hier deine Stichpunkte ein (z. B. '<Subject 1> Dirk knutscht mit <Subject 2> Anna...') oder klicke oben auf die Referenz-Buttons..."
                  className="w-full p-4 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white resize-none leading-relaxed font-mono shadow-inner"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Genre */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-rose-600" />
                    <span>Genre &amp; Tonalität</span>
                  </label>
                  <select
                    value={config.genre || 'Architektur & Lifestyle (Immobilien)'}
                    onChange={(e) => onChangeConfig({ ...config, genre: e.target.value })}
                    className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 text-zinc-900 font-bold focus:outline-none focus:border-rose-400"
                  >
                    {GENRE_PRESETS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Drohne / Cam */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Drohnenflug &amp; Kameraführung</span>
                  </label>
                  <select
                    value={config.windows?.[0]?.cameraMovement || CAMERA_PRESETS[0]}
                    onChange={(e) => {
                      const updated = config.windows.map((w) => ({
                        ...w,
                        cameraMovement: e.target.value,
                      }));
                      onChangeConfig({ ...config, windows: updated });
                    }}
                    className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 text-zinc-900 focus:outline-none"
                  >
                    {CAMERA_PRESETS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wetter & Licht */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Wetter &amp; Lichtstimmung</span>
                  </label>
                  <select
                    value={config.globalWeather || WEATHER_PRESETS[0]}
                    onChange={(e) => onChangeConfig({ ...config, globalWeather: e.target.value })}
                    className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 text-zinc-900 focus:outline-none"
                  >
                    {WEATHER_PRESETS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Setting / Hintergrund */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hintergrund &amp; Setting</span>
                  </label>
                  <select
                    value={config.globalBackground || BACKGROUND_PRESETS[0]}
                    onChange={(e) => onChangeConfig({ ...config, globalBackground: e.target.value })}
                    className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 text-zinc-900 focus:outline-none"
                  >
                    {BACKGROUND_PRESETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Final Call to Action (Wichtig für das letzte Window!) */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-amber-700" />
                  <span>Claim / Call-to-Action für das letzte Window (Window {config.windowCount})</span>
                </label>
                <span className="text-[10px] text-amber-800 font-medium">
                  Erscheint als On-Screen Text &amp; Schluss-Aktion
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={config.finalCallToAction || finalCta}
                  onChange={(e) => handleUpdateCta(e.target.value)}
                  placeholder="z.B. Jetzt Musterhaus besichtigen & Ihr Traumhaus planen"
                  className="w-full text-xs font-bold bg-white border border-amber-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-amber-600 shadow-2xs"
                />

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleUpdateCta(e.target.value);
                    }
                  }}
                  className="w-full sm:w-auto text-xs bg-white border border-amber-300 rounded-lg px-3 py-2 text-zinc-700 focus:outline-none shrink-0"
                >
                  <option value="">Vorlagen wählen...</option>
                  {CALL_TO_ACTION_PRESETS.map((cta, i) => (
                    <option key={i} value={cta}>
                      {cta}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Erweiterte Typografie & On-Screen Claims (Imagevideo-Modus) */}
            <TypographyOverlayCard
              overlay={config.typographyOverlay}
              onChangeOverlay={handleUpdateTypographyOverlay}
              windowCount={config.windowCount}
              genre={config.genre}
            />

            {/* Voice & Delivery Modulator (Stimmfarbe, Pacing, Raumakustik & Anti-Geplappere-Lock) */}
            <VoiceModulationCard
              config={config.voiceModulation}
              onChangeConfig={handleUpdateVoiceModulation}
            />

            {/* Visueller Stil & Filmstock (Königsweg-Ästhetik-Ebene) */}
            <VisualStyleCard
              selectedStyleId={config.visualStyle || 'natural'}
              onSelectStyle={handleSelectVisualStyle}
            />

            {/* Analog-Film & Emulsions-Triebwerk (Ultra-Präzise chemisch-optische Simulation) */}
            <AnalogFilmCard
              enabled={ANALOG_PROFILES.some(p => p.id === config.visualStyle)}
              selectedProfileId={ANALOG_PROFILES.some(p => p.id === config.visualStyle) ? config.visualStyle! : 'fujicolor_eterna_500t'}
              onToggleEnabled={(enabled) => {
                if (enabled) {
                  handleSelectVisualStyle('fujicolor_eterna_500t');
                } else {
                  handleSelectVisualStyle('natural');
                }
              }}
              onSelectProfile={(profileId) => handleSelectVisualStyle(profileId)}
              loraEnabled={config.astroCinemaLoraMode !== false}
              onToggleLora={handleToggleAstroCinemaLora}
              actionCode={config.actionCode || 'ASTROCINEMAV01K2T'}
              onChangeActionCode={handleUpdateActionCode}
              language={language === 'EN' ? 'EN' : 'DE'}
              analogLaborStörung={config.analogLaborStörung || 'none'}
              onSelectLaborStörung={handleSelectLaborStörung}
              analogMacroRecipe={config.analogMacroRecipe || 'none'}
              onSelectMacroRecipe={handleSelectMacroRecipe}
            />

            {/* Cinematic Style V2 LoRA (ASTROCINEMAV01K2T & Detail Enhancer for MiniMax H3) */}
            <AstroCinemaLoraCard
              enabled={config.astroCinemaLoraMode !== false}
              addAtmosphericKeywords={config.astroCinemaLoraKeywords !== false}
              onToggle={handleToggleAstroCinemaLora}
              onToggleKeywords={handleToggleAstroCinemaKeywords}
              language={language}
            />

            {/* Kinetik- & Kausalitäts-Engine (Ultra-Physik, Muskelspannung, Subsurface-Gegenlicht, 4-Phasen Rhythmus) - DEFAULT OFF */}
            <UltraPhysicsCard
              enabled={config.ultraPhysicsMode === true}
              onToggle={(enabled) => onChangeConfig({ ...config, ultraPhysicsMode: enabled })}
            />

            {/* Kino-Objektiv Portfolio & Bokeh-Engine (Cooke, Leica Noctilux, Helios, Kowa Anamorphic, Dream Lens, Zeiss) - DEFAULT OFF */}
            <LensSelectorCard
              enabled={config.lensOpticsMode === true}
              selectedLens={config.selectedLens || 'auto'}
              onToggle={(enabled) => onChangeConfig({ ...config, lensOpticsMode: enabled })}
              onSelectLens={(lensId) => onChangeConfig({ ...config, selectedLens: lensId })}
            />

            {/* Trigger Button: Generate 3 Proposals via LM Studio */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-zinc-500">
                Verbindet mit LM Studio ({settings.endpoint || 'http://localhost:1234/v1'}) &bull; Modell:{' '}
                <strong className="text-zinc-800">{settings.modelName || 'local-model'}</strong>
              </span>

              <button
                type="button"
                onClick={handleGenerateProposalsWithLMStudio}
                disabled={
                  isGeneratingProposals ||
                  (isDarkRetributionGenre(config.genre) && !config.darkRetributionDisclaimerAccepted)
                }
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                  isDarkRetributionGenre(config.genre) && !config.darkRetributionDisclaimerAccepted
                    ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed border border-zinc-300'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white disabled:opacity-50'
                }`}
              >
                {isGeneratingProposals ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>LM Studio denkt &amp; generiert Drehbuch...</span>
                  </>
                ) : isDarkRetributionGenre(config.genre) && !config.darkRetributionDisclaimerAccepted ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Zuerst Rache-Disclaimer abhaken</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Drehbuch-Vorschlag mit LM Studio generieren</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section B: 3 Concept Proposals (Laien-verständlich aufbereitet) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Schritt B: Verständlicher Drehbuch-Entwurf – Übernehme den Vorschlag</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Klicke auf den Button unten, um den Vorschlag direkt in das exakte {windowDuration}s Single-Line Format zu pressen.
                </p>
              </div>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                Sprache: {dialogueLang} &bull; {windowDuration}s / Window
              </span>
            </div>

            <div className={`grid grid-cols-1 ${proposals.length > 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-3xl'} gap-5`}>
              {proposals.map((prop, idx) => {
                const isSelected = selectedProposal.id === prop.id;

                return (
                  <div
                    key={prop.id || idx}
                    className={`bg-white rounded-2xl border transition shadow-xs flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {/* Top Edge Bar with Button DIRECTLY at the top edge ("direkt oben an die Kante") */}
                    <div className="px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-zinc-50 via-indigo-50/30 to-zinc-50 border-b border-zinc-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                          Vorschlag {idx + 1}
                        </span>
                        <span className="text-[10px] font-medium text-zinc-500 truncate">
                          {prop.windowBreakdown.length} Windows
                        </span>
                      </div>

                      {/* Der Button direkt oben an die Kante */}
                      <button
                        type="button"
                        onClick={() => setEditingClaimsProposal(prop)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 transition shadow-2xs cursor-pointer shrink-0"
                        title="Claims & Typografie für diesen Vorschlag bearbeiten"
                      >
                        <Edit2 className="w-3 h-3 text-indigo-600" />
                        <span>Claims bearbeiten</span>
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 space-y-4">
                      {/* Card Title & Tagline */}
                      <div>
                        <h4 className="text-base font-bold text-zinc-900 leading-snug">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">
                          {prop.tagline}
                        </p>
                      </div>

                      {/* Description for Layperson */}
                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                          Für Laien erklärt:
                        </span>
                        <p className="text-xs text-zinc-700 leading-relaxed">
                          {prop.descriptionForLayperson}
                        </p>
                      </div>

                      {/* Window Breakdown list */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          Ablauf der Windows:
                        </span>
                        {prop.windowBreakdown.map((win) => (
                          <div
                            key={win.windowNumber}
                            className="text-xs p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start gap-2"
                          >
                            <span className="font-mono font-bold text-[11px] text-zinc-800 bg-zinc-200/70 px-1.5 py-0.2 rounded shrink-0">
                              W{win.windowNumber}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-zinc-900 truncate">
                                {win.title}
                              </p>
                              <p className="text-[11px] text-zinc-500 line-clamp-1">
                                {win.cameraMovement}
                              </p>
                              {win.dialogueSnippet && (
                                <p className="text-[11px] text-indigo-700 font-mono italic mt-0.5">
                                  &bdquo;{win.dialogueSnippet}&ldquo;
                                </p>
                              )}

                              {/* On-Screen Claim Badge with Typography preview */}
                              {win.claimOrCta && (
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 font-medium">
                                  <Type className="w-2.5 h-2.5 text-purple-600 shrink-0" />
                                  <span className="font-bold text-[9px] text-purple-700 uppercase tracking-wider">
                                    Claim:
                                  </span>
                                  <span className={`truncate italic ${win.claimTypography?.fontStyle === 'handschrift' ? 'font-serif text-amber-900' : ''}`}>
                                    &bdquo;{win.claimOrCta}&ldquo;
                                  </span>
                                  {win.claimTypography && (
                                    <span className="text-[9px] px-1.5 py-0.2 bg-purple-200/70 text-purple-950 rounded font-semibold">
                                      {win.claimTypography.fontStyle === 'handschrift'
                                        ? '✍️ Handschrift'
                                        : win.claimTypography.fontStyle === 'serif'
                                        ? 'Editorial Serif'
                                        : win.claimTypography.fontStyle === 'condensed_bold'
                                        ? '🎬 Kino-Plakat'
                                        : 'Blockschrift'}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Final Call to Action Preview */}
                      <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
                            Call-to-Action (Outro):
                          </span>
                          <p className="text-xs font-bold text-amber-950 truncate">
                            &bdquo;{prop.callToAction || finalCta}&ldquo;
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingClaimsProposal(prop)}
                          className="text-[11px] font-bold text-amber-900 hover:text-amber-950 px-2 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/70 shrink-0 transition shadow-2xs cursor-pointer flex items-center gap-1"
                          title="CTA & Typografie bearbeiten"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                          <span>Bearbeiten</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Action: Press into Single-Line Format */}
                    <div className="p-4 bg-zinc-50 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => handlePressProposalToSingleLine(prop)}
                        disabled={
                          isDarkRetributionGenre(config.genre) &&
                          !config.darkRetributionDisclaimerAccepted
                        }
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 font-bold rounded-xl text-xs transition shadow-2xs cursor-pointer ${
                          isDarkRetributionGenre(config.genre) &&
                          !config.darkRetributionDisclaimerAccepted
                            ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                            : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                        }`}
                      >
                        {isDarkRetributionGenre(config.genre) &&
                        !config.darkRetributionDisclaimerAccepted ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Zuerst Rache-Disclaimer abhaken</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-zinc-950" />
                            <span>In Single-Line Format pressen</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REFERENCE MANAGER (HAUS, GRUNDRISS, MENSCHEN, PROPS) */}
      {activeTab === 'subjects' && (
        <ReferenceManagerSection
          references={currentReferences}
          onUpdateReferences={handleUpdateReferences}
          appReferences={references}
          onShowToast={onShowToast}
          dialogueLanguage={dialogueLang}
          targetAudience={currentTargetAudience}
          projectTitle={config.title || config.projectName || 'Musterhaus Drehbuch'}
          stichpunkte={config.stichpunkte}
          lmStudioEndpoint={settings.endpoint}
          lmStudioModel={settings.modelName}
          lmStudioApiKey={settings.apiKey}
        />
      )}

      {/* TAB 3: THE PRESSED SINGLE-LINE WINDOWS (Exact Reference Prompt Format) */}
      {activeTab === 'pressedView' && (
        <div className="space-y-6">
          {/* Format Validation Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <span>100% Valides Single-Line Format bestätigt</span>
                  <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    0 Linebreaks pro Window
                  </span>
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Jedes Window ist eine einzige, ununterbrochene Zeile inklusive Timecode, Subjekten, Dialogen in {dialogueLang},
                  Kameraführung, Tonvorgaben und finalem Call-to-Action.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsTimelineExportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                title="Timeline & Schnitt-Export (DaVinci Resolve EDL, FCPXML, CSV, Markdown, TXT)"
              >
                <Film className="w-4 h-4 text-zinc-950" />
                <span>Timeline-Export (.edl / .fcpxml / .csv)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAllSingleLineWindows}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {copiedPromptId === 'all' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Alle kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Alle Windows kopieren</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition cursor-pointer"
                title="Als .txt herunterladen"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dedicated Maestro 2.1.6 Reference Naming & Binding List */}
          <MaestroWindowsBindingList
            references={currentReferences}
            projectTitle={config.title || config.projectName}
            onShowToast={onShowToast}
          />

          {/* Quick CTA Live-Editor for Window 4 / Final Window */}
          {config.pressedWindows && config.pressedWindows.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  CTA
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 block">
                    Finaler Call-to-Action (Window {config.pressedWindows.length})
                  </span>
                  <span className="text-[11px] text-zinc-600">
                    Live anpassen – aktualisiert Window {config.pressedWindows.length} sofort im Prompt &amp; Drehbuch:
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <input
                  type="text"
                  value={config.finalCallToAction || finalCta}
                  onChange={(e) => handleUpdateCta(e.target.value)}
                  placeholder="z.B. Jetzt Musterhaus besichtigen & Ihr Traumhaus planen"
                  className="w-full text-xs font-bold bg-white border border-amber-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-amber-600 shadow-2xs"
                />
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleUpdateCta(e.target.value);
                    }
                  }}
                  className="text-xs bg-white border border-amber-300 rounded-lg px-2.5 py-2 text-zinc-700 focus:outline-none shrink-0"
                >
                  <option value="">Vorlagen...</option>
                  {CALL_TO_ACTION_PRESETS.map((cta, i) => (
                    <option key={i} value={cta}>
                      {cta}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quick Typography Overlay Bar */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-950 block">
                  Imagevideo Typografie-Modus {config.typographyOverlay?.enabled ? '(Aktiv)' : '(Optional)'}
                </span>
                <span className="text-[11px] text-zinc-600">
                  {config.typographyOverlay?.enabled
                    ? 'Block- & Schreibschrift, Ausblick-Text und Schluss-Claim sind live in die Windows eingepresst.'
                    : 'Typografie-Einblendungen, Ausblick-Text und stumme Musik für Imagevideos konfigurieren:'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('workflow')}
              className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-300 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
            >
              {config.typographyOverlay?.enabled ? 'Typografie-Details bearbeiten' : 'Typografie konfigurieren'}
            </button>
          </div>

          {/* List of Pressed Single-Line Windows */}
          <div className="space-y-4">
            {config.pressedWindows && config.pressedWindows.length > 0 ? (
              config.pressedWindows.map((win) => {
                const validity = checkSingleLineValidity(win.singleLinePrompt);
                const isExpanded = expandedWindowIndex === win.windowNumber;

                return (
                  <div
                    key={win.windowNumber}
                    className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-3 hover:border-zinc-300 transition"
                  >
                    {/* Window Bar Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 text-amber-400 font-bold font-mono text-sm flex items-center justify-center shrink-0 shadow-2xs">
                          W{win.windowNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-zinc-900">
                              window{win.windowNumber}: ({win.timecodeStart}–{win.timecodeEnd})
                            </span>
                            <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.2 rounded border border-zinc-200">
                              {win.durationSeconds}.000s
                            </span>
                            {win.claimOrCta && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded border border-amber-300">
                                {win.windowNumber === config.pressedWindows!.length ? 'Call-to-Action' : 'Claim'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{win.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => handleCopySingleWindow(win.windowNumber, win.singleLinePrompt)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition cursor-pointer"
                        >
                          {copiedPromptId === `win-${win.windowNumber}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Kopiert!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Window {win.windowNumber} kopieren</span>
                            </>
                          )}
                        </button>

                        {/* Inspector Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedWindowIndex(isExpanded ? null : win.windowNumber)
                          }
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
                          title="Struktur analysieren"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Single-Line Raw Output Box (Strictly 1 Line displayed with overflow scroll) */}
                    <div className="relative">
                      <div className="p-3.5 bg-zinc-900 text-zinc-200 rounded-xl font-mono text-[11px] leading-normal overflow-x-auto whitespace-nowrap shadow-inner border border-zinc-800 select-all">
                        {win.singleLinePrompt}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1 block">
                        Zeichen: {validity.totalCharacters} &bull; Zeilenumbrüche im Window:{' '}
                        <strong className={validity.isValid ? 'text-emerald-600' : 'text-red-600'}>
                          {validity.lineCount - 1}
                        </strong>
                      </span>
                    </div>

                    {/* Structured Inspector & German Translation (if expanded) */}
                    {isExpanded && (() => {
                      const german = translateWindowPromptToGerman(win);
                      return (
                        <div className="pt-3 border-t border-zinc-100 text-xs space-y-3 bg-zinc-50 p-4 rounded-xl">
                          {/* German Translation Highlight Box */}
                          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-zinc-800 space-y-2">
                            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                              <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-amber-700" />
                                <span>Verständliches Deutsch (Prompt-Übersetzung)</span>
                              </span>
                              <span className="text-[10px] font-mono text-amber-800 font-semibold">
                                {german.zeitspanne}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <div>
                                <strong className="text-zinc-900 block text-[11px]">Szenenhandlung &amp; Inhalt:</strong>
                                <p className="text-zinc-700 font-medium">{german.szenenHandlung}</p>
                              </div>

                              <div>
                                <strong className="text-zinc-900 block text-[11px]">Kameraführung:</strong>
                                <p className="text-zinc-700">{german.kamerafuehrung}</p>
                              </div>

                              {german.dialogueGerman && (
                                <div>
                                  <strong className="text-zinc-900 block text-[11px]">Gesprochener Dialog:</strong>
                                  <p className="text-indigo-950 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 font-medium inline-block mt-0.5">
                                    {german.dialogueGerman}
                                  </p>
                                </div>
                              )}

                              {german.callToActionGerman && (
                                <div>
                                  <strong className="text-zinc-900 block text-[11px]">Einblendung / Call to Action:</strong>
                                  <p className="text-amber-950 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                                    &bdquo;{german.callToActionGerman}&ldquo;
                                  </p>
                                </div>
                              )}

                              {german.closeupsGerman && german.closeupsGerman.length > 0 && (
                                <div>
                                  <strong className="text-zinc-900 block text-[11px]">Makro-Nahaufnahmen (100mm):</strong>
                                  <ul className="list-disc list-inside text-zinc-600 space-y-0.5 pl-1">
                                    {german.closeupsGerman.map((c, idx) => (
                                      <li key={idx}>{c}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div>
                                <strong className="text-zinc-900 block text-[11px]">Ton &amp; Musikstil:</strong>
                                <p className="text-zinc-600 italic">{german.musikUndSound}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                                Aktive Subjekte &amp; Referenzen:
                              </span>
                              <span className="font-semibold text-zinc-800">
                                {win.activeReferences && win.activeReferences.length > 0
                                  ? win.activeReferences.join(', ')
                                  : win.activeSubjects.join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                                Kamerabewegung (Englischer Prompt-Code):
                              </span>
                              <span className="font-semibold text-zinc-800">{win.cameraMove}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white border border-dashed border-zinc-300 rounded-2xl space-y-3">
                <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-800">
                  Noch keine Windows gepresst
                </h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Wähle oben im Reiter &bdquo;1. Zielgruppe &amp; Vorschläge&ldquo; den Vorschlag aus
                  und klicke auf &bdquo;In Single-Line Format pressen&ldquo;.
                </p>
                <button
                  type="button"
                  onClick={() => handlePressProposalToSingleLine(selectedProposal)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Vorschlag 1 jetzt pressen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Final Action Footer */}
      <div className="bg-zinc-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <span>In Drehbuch- &amp; Video-Runner übernehmen</span>
            <span className="text-[10px] font-mono bg-amber-400 text-zinc-950 px-2 py-0.5 rounded font-bold">
              {config.windowCount} Windows &bull; {windowDuration}s &bull; {dialogueLang}
            </span>
            <span className="text-[10px] font-mono bg-indigo-400 text-zinc-950 px-2 py-0.5 rounded font-bold">
              {currentTargetAudience.name.split(' ')[0]}
            </span>
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Überträgt alle Windows, gepressten Single-Line Prompts, Zielgruppen-Ästhetik, Referenzen und Claims in den Drehbuchgenerator.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            // Auto-press if not yet pressed
            if (!config.pressedWindows || config.pressedWindows.length === 0) {
              const pressed = pressProposalToSingleLineWindows({
                proposal: selectedProposal,
                allSubjects: currentReferences,
                windowDurationSeconds: windowDuration,
                dialogueLanguage: dialogueLang,
                actionCode: config.actionCode || 'ASTROCINEMAV01K2T',
                aspectRatio: config.aspectRatio || '16:9',
                globalWeather: config.globalWeather,
                globalBackground: config.globalBackground,
                finalCallToAction: finalCta,
                targetAudience: currentTargetAudience,
                visualStyle: config.visualStyle,
              });
              onApplyToScreenplay({
                ...config,
                references: currentReferences,
                subjects: currentReferences,
                targetAudienceId: currentTargetAudience.id,
                targetAudienceCustom: currentTargetAudience,
                pressedWindows: pressed,
              });
            } else {
              onApplyToScreenplay({
                ...config,
                references: currentReferences,
                subjects: currentReferences,
                targetAudienceId: currentTargetAudience.id,
                targetAudienceCustom: currentTargetAudience,
              });
            }
          }}
          className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs transition shadow-sm cursor-pointer shrink-0"
        >
          <span>In Drehbuch &amp; Shots übertragen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* JSON Saved Prompts Modal (data/saved_prompts) */}
      <SavedPromptsModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        currentState={{
          ...config,
          references: currentReferences,
          subjects: currentReferences,
          targetAudienceId: currentTargetAudience.id,
          targetAudienceCustom: currentTargetAudience,
        }}
        onLoadProject={handleLoadProjectState}
        onShowToast={onShowToast}
        language={language}
      />

      {/* Camera Director Modal with Cinematic Library & LM Studio AI Guidance */}
      <CameraDirectorModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        windows={config.windows || []}
        targetAudience={currentTargetAudience}
        targetAudienceName={currentTargetAudience.name}
        onApplyCameraMovementToWindow={handleApplyCameraMovementToWindow}
        onApplyCameraPlanToAll={handleApplyCameraPlanToAll}
        lmStudioEndpoint={settings.endpoint}
        lmStudioModel={settings.modelName}
        lmStudioApiKey={settings.apiKey}
        onShowToast={onShowToast}
        language={language}
      />

      {/* LM Studio Design & Look Director Modal */}
      <DesignConceptModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        targetAudience={currentTargetAudience}
        onApplyDesign={handleApplyDesignConcept}
        lmStudioEndpoint={settings.endpoint}
        lmStudioModel={settings.modelName}
        lmStudioApiKey={settings.apiKey}
        onShowToast={onShowToast}
        language={language}
      />

      {/* Project-Based Data Storage Modal (/data/projects/) */}
      <ProjectManagerModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        currentProjectName={config.projectName || config.projectId || 'standard'}
        currentConfig={config}
        onLoadProject={handleLoadProjectFromDisk}
        onSaveProject={handleSaveProjectToDisk}
        onShowToast={onShowToast}
        language={language}
      />

      {/* Interactive Proposal Claims & Typography Modal Dialog */}
      {editingClaimsProposal && (
        <ProposalClaimsEditor
          isOpen={Boolean(editingClaimsProposal)}
          onClose={() => setEditingClaimsProposal(null)}
          proposal={editingClaimsProposal}
          proposalIndex={proposals.findIndex((p) => p.id === editingClaimsProposal.id)}
          onUpdateWindowClaim={handleUpdateProposalWindowClaim}
          onUpdateProposalCta={handleUpdateProposalCta}
          isPressed={Boolean(config.pressedWindows && config.pressedWindows.length > 0)}
        />
      )}

      {/* Timeline & Editing Export Modal (DaVinci Resolve EDL, FCPXML, CSV, Markdown, TXT) */}
      <TimelineExportModal
        isOpen={isTimelineExportOpen}
        onClose={() => setIsTimelineExportOpen(false)}
        windows={config.pressedWindows || []}
        projectTitle={config.title || config.projectName || 'Musterhaus_Drehbuch'}
        dialogueLanguage={config.dialogueLanguage || dialogueLang}
        genre={config.genre || 'Architektur & Lifestyle'}
        aspectRatio={config.aspectRatio || '16:9'}
        targetAudienceName={currentTargetAudience?.name}
        weather={config.globalWeather || 'Sonnig & klar'}
        background={config.globalBackground || 'Neubausiedlung'}
        language={language}
        onShowToast={onShowToast}
      />
    </div>
  );
};
