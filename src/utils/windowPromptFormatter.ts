import {
  ConfigReference,
  ConceptProposal,
  DialogueLanguage,
  SingleLineWindow,
  WindowConfig,
  TargetAudience,
  ScreenplayReferenceCategory,
  TypographyOverlayConfig,
  WindowClaimTypography,
  VoiceModulationConfig,
} from '../types';

/**
 * Format a number of seconds into MM:SS.000 timecode
 * e.g. 0 -> "00:00.000", 14 -> "00:14.000", 72.5 -> "01:12.500"
 */
export function formatTimecode(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const wholeSecs = Math.floor(secs);
  const millis = Math.round((secs - wholeSecs) * 1000);

  const mStr = String(mins).padStart(2, '0');
  const sStr = String(wholeSecs).padStart(2, '0');
  const msStr = String(millis).padStart(3, '0');

  return `${mStr}:${sStr}.${msStr}`;
}

/**
 * Regex-based sanitization function that escapes all internal single/double quotes
 * within dialogue segments and character anchors to prevent JSON parsing errors in LM Studio.
 */
export function sanitizeQuotesForJSON(text: string): string {
  if (!text) return '';
  return text
    .replace(/(?<!\\)"/g, '\\"')
    .replace(/(?<!\\)'/g, "\\'")
    .replace(/„|“|”|“/g, '\\"');
}

/**
 * Strict single-line cleaner: removes all carriage returns, newlines, tabs, and duplicate spaces.
 * Guarantees that the resulting string is 100% on 1 single line with no line breaks!
 */
export function enforceSingleLine(text: string): string {
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates whether a text block is strictly single-line
 */
export function checkSingleLineValidity(text: string): {
  isValid: boolean;
  lineCount: number;
  totalCharacters: number;
  issues: string[];
} {
  const lineCount = (text.match(/\n/g) || []).length + 1;
  const issues: string[] = [];

  if (lineCount > 1) {
    issues.push(`Enthält ${lineCount - 1} unerlaubte Zeilenumbrüche (Muss genau 1 Zeile sein)`);
  }
  if (!text.startsWith('window')) {
    issues.push('Beginnt nicht mit dem geforderten "windowX:" Präfix');
  }
  if (!text.includes('Action:')) {
    issues.push('Fehlende "Action:" Deklaration');
  }
  if (!text.includes('TIMECODE')) {
    issues.push('Fehlende "TIMECODE" Abschnitte');
  }
  if (!text.includes('EXTREME CLOSE-UP, 100mm macro, T1.8')) {
    issues.push('Fehlende 100mm Macro-Extreme-Closeups');
  }
  if (!text.includes('Active_References:')) {
    issues.push('Fehlende "Active_References:" Abschlusszeile');
  }

  return {
    isValid: issues.length === 0,
    lineCount,
    totalCharacters: text.length,
    issues,
  };
}

/**
 * Clean, customizable categorized default references
 * Distinguishes between Human, Building (Objekt: Haus), Object (Gegenstand), Animal, and Environment.
 */
export const DEFAULT_SUBJECT_REFERENCES: ConfigReference[] = [
  {
    id: 'ref-1',
    category: 'human',
    referenceIndex: 1,
    tag: '<Subject 1>',
    charTag: 'char Protagonist1',
    name: 'Protagonist 1',
    roleOrAction: 'Erkundet die Architektur und interagiert natürlich im Raum',
    relationship: 'Hauptdarsteller',
    gender: 'female',
    ageRange: '',
    build: '',
    hairOrMaterial: '',
    eyesOrGlazing: '',
    clothingOrFinish: '',
    distinguishingMarks: '',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isActiveInProject: true,
  },
  {
    id: 'ref-2',
    category: 'human',
    referenceIndex: 2,
    tag: '<Subject 2>',
    charTag: 'char Protagonist2',
    name: 'Protagonist 2',
    roleOrAction: 'Begleitet die Besichtigung und interagiert im Raum',
    relationship: 'Hauptdarsteller',
    gender: 'male',
    ageRange: '',
    build: '',
    hairOrMaterial: '',
    eyesOrGlazing: '',
    clothingOrFinish: '',
    distinguishingMarks: '',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isActiveInProject: true,
  },
  {
    id: 'ref-3',
    category: 'building',
    referenceIndex: 1,
    tag: '<Building 1>',
    charTag: 'building Musterhaus_Avantgarde',
    name: 'Musterhaus Avantgarde',
    roleOrAction: 'Hauptmotiv und architektonische Kulisse über alle 4 Windows',
    relationship: 'Architektonisches Zentrum & Anwesen',
    build: '2-geschossiger moderner Baukörper mit Flachdach, klarer Geometrie und überdachter Terrasse',
    hairOrMaterial: 'Edler weißer Strukturputz kombiniert mit vertikalen Lärchenholz-Lamellen und Schiefer-Sockel',
    eyesOrGlazing: 'Bodentiefe Dreifach-Schallschutzverglasung mit schlanken anthrazitfarbenen Aluminiumprofilen',
    clothingOrFinish: 'Integrierte Indach-Photovoltaikanlage, rahmenlose Glas-Brüstungen und großzügige 60m² Holzterrasse',
    distinguishingMarks: 'Verdeckte Regenrinne, bündig eingelassene LED-Lichtbänder im Dachüberstand',
    photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    isActiveInProject: true,
  },
  {
    id: 'ref-4',
    category: 'object',
    referenceIndex: 1,
    tag: '<Object 1>',
    charTag: 'prop Schluessel_Expose',
    name: 'Schlüsselbund & Übergabe-Mappe',
    roleOrAction: 'Zentrales haptisches Detail bei der Übergabe im finalen Window',
    relationship: 'Requisite für Schlussszene (Window 4)',
    build: 'Hochwertiger mattierter Edelstahlschlüssel mit graviertem Logo-Anhänger und Lederetui',
    hairOrMaterial: 'Matt gebürsteter Edelstahl, cognacfarbenes Naturleder mit feiner Ziernaht',
    eyesOrGlazing: 'Glänzende Gravur mit filigranen Kantenreflexionen',
    clothingOrFinish: 'Handgefertigte Prägemappe aus festem Naturkarton für Baupläne und Garantieurkunde',
    distinguishingMarks: 'Präzise haptische Kanten, reflexionsfreie matte Oberfläche',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
    isActiveInProject: true,
  },
  {
    id: 'ref-5',
    category: 'logo',
    referenceIndex: 1,
    tag: '<Logo 1>',
    charTag: 'logo Brand_Watermark',
    name: 'Firmenlogo / Brand-Mark',
    roleOrAction: 'Permanentes, dezentes Wasserzeichen strictly in der rechten unteren Ecke (25% Opacity)',
    relationship: 'Unternehmensidentität & Branding über alle Video-Windows',
    build: 'Minimalistisches Vektor-Emblem mit klaren Konturen',
    hairOrMaterial: 'Halbtransparentes weiß/silbergraues Signet mit feiner Konturierung',
    eyesOrGlazing: '25-30% Transparenz für organische Einbettung ohne Bildstörung',
    clothingOrFinish: 'Feste Positionierung: Untere rechte Ecke mit 40px Randabstand',
    distinguishingMarks: 'IMMER rechts unten, dezent & transparent, niemals bildfüllend',
    photoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    isActiveInProject: true,
  },
];

/**
 * 3 High-Quality, Layperson-friendly Concept Proposals
 * Fully neutral, professional, free of fantasy names
 */
export const DEFAULT_PROPOSALS: ConceptProposal[] = [
  {
    id: 'prop-1',
    title: 'Die Entdeckung: Emotionale Ankunft & Raumgefühl',
    tagline: 'Vom spektakulären Drohnen-Orbit über das Anwesen bis zum gemeinsamen Ausklang auf der Terrasse',
    descriptionForLayperson:
      'Eine emotionale Geschichte über das erste Betreten des fertigen Zuhauses. Die Protagonisten erkunden Schritt für Schritt die Architektur, spüren die Haptik der Naturmaterialien und erleben im finalen Window den Sonnenuntergang auf der Terrasse mit klarem Call-to-Action.',
    dramaturgyHighlights: [
      'Window 1: Ankunft am Grundstück & eleganter 360° Drohnenüberflug über das Haus',
      'Window 2: Eingangsbereich, Foyer & haptische Detailaufnahmen der Naturmaterialien',
      'Window 3: Entdeckung des lichtdurchfluteten Wohnraums mit freiem Gartenblick',
      'Window 4: Sonnenuntergang auf der Holzterrasse, Schlüsselübergabe & starker Call-to-Action',
    ],
    toneAndStyle: 'Warm, emotional, einladend, High-End Architekturfilm',
    dialogueLanguage: 'German',
    callToAction: 'Jetzt Musterhaus besichtigen & Ihr Traumhaus planen',
    callToActionTypography: {
      fontStyle: 'blockschrift',
      animation: 'blur_reveal',
      placement: 'center',
      hasCursiveAccent: true,
      cursiveNote: 'Exklusiv reservieren',
    },
    windowBreakdown: [
      {
        windowNumber: 1,
        title: 'Ankunft & Drohnenflug-Totale',
        actionDescription:
          'Die Protagonisten kommen am Anwesen an. Ein sanfter Drohnen-Orbit zeigt die moderne Fassade von <Building 1>, die gepflegte Außenanlage und die Photovoltaikanlage im warmen Sonnenlicht.',
        cameraMovement: 'Drohnenflug Orbit 360° und sanfter Sinkflug auf Augenhöhe',
        dialogueSnippet: 'Hier ist es also. Unser neues Zuhause.',
        dialogueSpeaker: 'Bauherrin',
        focus: 'Fassade von <Building 1>, Kubatur und harmonische Einbettung in das Grundstück',
        claimOrCta: 'Architektur, die begeistert',
        claimTypography: {
          fontStyle: 'blockschrift',
          animation: 'blur_reveal',
          placement: 'lower_third',
        },
      },
      {
        windowNumber: 2,
        title: 'Eingang, Foyer & Materialdetails',
        actionDescription:
          'Sie treten durch die Eingangstür. Haptische Nahaufnahmen von geölter Eiche, anthrazitfarbenen Türgriffen und dem warmen Lichtkegel im Foyer.',
        cameraMovement: 'Dolly-In durch die Eingangstür mit flüssiger Steadicam-Führung',
        dialogueSnippet: 'Spürst du diese Qualität? Genau so wollten wir es haben.',
        dialogueSpeaker: 'Partner',
        focus: 'Holzlamellen, Naturstein und präzise handwerkliche Fugen',
        claimOrCta: 'Präzision bis ins letzte Detail',
        claimTypography: {
          fontStyle: 'serif',
          animation: 'blur_reveal',
          placement: 'lower_third',
        },
      },
      {
        windowNumber: 3,
        title: 'Offener Wohnbereich & Panoramaverglasung',
        actionDescription:
          'Der Blick öffnet sich in den großzügigen Wohn- und Kochbereich. Licht fällt durch raumhohe Schiebefenster. Sie blicken gemeinsam in den Garten.',
        cameraMovement: 'Steadicam Walkthrough entlang der Sichtachse Richtung Garten',
        dialogueSnippet: 'Dieses Licht... genau so habe ich es mir immer vorgestellt.',
        dialogueSpeaker: 'Bauherrin',
        focus: 'Offene Raumachsen, Kücheninsel und nahtloser Übergang zum Garten',
        claimOrCta: 'Lichtdurchflutete Raumkonzepte für Generationen',
        claimTypography: {
          fontStyle: 'handschrift',
          animation: 'fade_in',
          placement: 'lower_third',
        },
      },
      {
        windowNumber: 4,
        title: 'Terrasse, Sunset & Call-to-Action',
        actionDescription:
          'Beide stehen entspannt auf der Holzterrasse. Die Abendsonne taucht das Gebäude in goldenes Licht. Die Schlüsselübergabe mit <Object 1> erfolgt, gefolgt von einer eleganten Einblendung des finalen Call-to-Actions.',
        cameraMovement: 'Langsamer Rückwärts-Dolly und Aufstieg der Kamera in die Abenddämmerung',
        dialogueSnippet: 'Willkommen daheim. Ihr schlüsselfertiges Traumhaus ist bereit.',
        dialogueSpeaker: 'Partner',
        focus: 'Terrasse, warmes Kantenlicht, Übergabe von <Object 1> und Schluss-Grafik',
        claimOrCta: 'Jetzt Musterhaus besichtigen & Ihr Traumhaus planen',
        claimTypography: {
          fontStyle: 'blockschrift',
          animation: 'blur_reveal',
          placement: 'center',
          hasCursiveAccent: true,
          cursiveNote: 'Schlüsselfertig zum Festpreis',
        },
      },
    ],
  },
];

/**
 * Builds the EXACT single-line window string adhering strictly to the user's example prompt.
 * Seamlessly integrates human subjects, buildings (houses), objects, and animals into
 * definitions, anti-crossbleed rules, macro close-ups, and audio delivery tags.
 */
interface DistinctVisualDefaults {
  hair: string;
  eyes: string;
  marks: string;
  clothing: string;
  age: string;
  build: string;
}

/**
 * Generates guaranteed distinct physical attributes for each human subject index
 * to prevent MiniMax H3 / Maestro from cloning faces or clothing when attributes are omitted.
 */
function getDistinctSubjectVisualDefaults(idx: number, name: string, gender?: string, roleOrAction?: string): DistinctVisualDefaults {
  return {
    hair: `exact hairstyle, hair color, and texture matching reference image for ${name}`,
    eyes: `exact eye color and facial features matching reference image for ${name}`,
    marks: `high photorealistic consistency, unique facial structure corresponding 100% to reference image @Subject${idx}_${name}, zero feature transfer from other actors`,
    clothing: `exact wardrobe and attire corresponding to reference image for ${name}`,
    age: 'adult age matching reference image',
    build: 'natural posture matching reference image',
  };
}

/**
 * Builds a cinematic, timecoded on-screen typography segment for imagevideos and commercial films.
 * Allows custom combination of Blockschrift (geometric sans) and Schreibschrift (cursive script)
 * plus an Ausblick-Text (teaser claim).
 */
function buildTypographySegment(
  overlay: TypographyOverlayConfig | undefined,
  windowNumber: number,
  totalWindows: number,
  timecodes: { tcStart: string; t1End: string; t2End: string; t3End: string; tcEnd: string }
): string {
  if (!overlay || !overlay.enabled) return '';

  const parts: string[] = [];
  const isFirst = windowNumber === 1;
  const isLast = windowNumber === totalWindows;
  const isMiddle = !isFirst && !isLast;

  // Window 1: Hook / Opening (Blockschrift + Elegante Schreibschrift)
  if (isFirst && (overlay.openingMainLine || overlay.openingSubLine)) {
    const pos = overlay.openingPosition === 'center' ? 'Exact center' : overlay.openingPosition === 'lower_third' ? 'Lower third' : 'Upper third';
    let hook = `${timecodes.tcStart}–${timecodes.t2End}: ${pos}`;
    if (overlay.openingMainLine) {
      hook += ` – pure white geometric block typography: '${sanitizeQuotesForJSON(overlay.openingMainLine)}'.`;
    }
    if (overlay.openingSubLine) {
      hook += ` Below in elegant handwritten cursive: '${sanitizeQuotesForJSON(overlay.openingSubLine)}'.`;
    }
    if (overlay.openingAccentRule !== false) {
      hook += ` Fine gold rule.`;
    }
    parts.push(hook);
  }

  // Middle Windows (or Window 2): Der smarte Ausblick-Text / Teaser Claim
  if ((isMiddle || (totalWindows <= 2 && isFirst)) && overlay.teaserClaim) {
    const pos = overlay.teaserPosition === 'lower_left' ? 'Lower left' : overlay.teaserPosition === 'center' ? 'Exact center' : overlay.teaserPosition === 'upper_third' ? 'Upper third' : 'Lower right';
    const style = overlay.teaserStyle === 'refined_geometric' ? 'refined geometric block' : overlay.teaserStyle === 'italic_sans' ? 'italic sans-serif' : 'soft handwritten script';
    parts.push(`${timecodes.t1End}–${timecodes.t3End}: ${pos} – ${style}: '${sanitizeQuotesForJSON(overlay.teaserClaim)}'.`);
  }

  // Final Window: Outro Brand + Callout
  if (isLast && (overlay.closingBrandName || overlay.closingCallout)) {
    const pos = overlay.closingPosition === 'lower_third' ? 'Lower third' : 'Exact center';
    let outro = `${timecodes.t2End}–${timecodes.tcEnd}: ${pos}`;
    if (overlay.closingBrandName) {
      outro += ` – ${sanitizeQuotesForJSON(overlay.closingBrandName)} in refined geometric block.`;
    }
    if (overlay.closingCallout) {
      outro += ` Second line in restrained cursive script: '${sanitizeQuotesForJSON(overlay.closingCallout)}'.`;
    }
    if (overlay.closingAccentBar !== false) {
      outro += ` Solid gold accent bar. Gentle warm pulse at transition.`;
    }
    parts.push(outro);
  }

  if (parts.length === 0) return '';

  const texture = overlay.textureLook === 'cinematic_minimal'
    ? 'All text in ultra-clean cinematic typography. Only opacity fades.'
    : overlay.textureLook === 'clean_digital'
    ? 'All text with crisp digital clarity. Minimalist fade transitions.'
    : 'All text on heavy matte paper texture. Only opacity fades. No harsh cuts.';

  return `TYPOGRAPHY: ${parts.join(' ')} ${texture}`;
}

export function buildSingleLineWindowPrompt(params: {
  windowNumber: number;
  totalWindows: number;
  durationSeconds: number;
  actionCode?: string;
  aspectRatio?: '16:9' | '9:16' | '2.39:1';
  weather?: string;
  background?: string;
  cameraMovement?: string;
  visualFocus?: string;
  soundDesign?: string;
  musicStyle?: string;
  dialogueLanguage?: DialogueLanguage;
  dialogueSpeaker?: string;
  dialogueText?: string;
  claimOrCta?: string;
  claimTypography?: WindowClaimTypography;
  isLastWindow?: boolean;
  activeSubjects: ConfigReference[];
  allSubjects: ConfigReference[];
  narrativeAction?: string;
  targetAudience?: TargetAudience;
  typographyOverlay?: TypographyOverlayConfig;
  voiceModulation?: VoiceModulationConfig;
  astroCinemaLoraMode?: boolean;
  astroCinemaLoraKeywords?: boolean;
  visualStyle?: string;
  analogLaborStörung?: string;
  analogMacroRecipe?: string;
}): SingleLineWindow {
  const {
    windowNumber,
    totalWindows,
    durationSeconds = 14,
    actionCode = 'ASTROCINEMAV01K2T',
    aspectRatio = '16:9',
    weather = 'Natural clear daylight with balanced atmospheric illumination',
    background = 'A cinematic environment matching the scene context',
    cameraMovement = 'Smooth cinematic camera movement',
    visualFocus = 'Atmospheric scene details and subjects',
    soundDesign = 'Subtle natural environmental ambience',
    musicStyle = 'Cinematic ambient score with warm emotional resonance',
    dialogueLanguage = 'German',
    dialogueSpeaker,
    dialogueText: initialDialogueText,
    claimOrCta,
    claimTypography,
    isLastWindow = windowNumber === totalWindows,
    activeSubjects = [],
    allSubjects = [],
    narrativeAction,
    targetAudience,
    typographyOverlay,
    voiceModulation,
    astroCinemaLoraMode = true,
    astroCinemaLoraKeywords = true,
    visualStyle = 'natural',
    analogLaborStörung,
    analogMacroRecipe,
  } = params;

  // Stummes Imagevideo Option: Wenn muteVoiceover aktiviert ist, oder art_noir / wet_plate aktiv ist, keine gesprochenen Dialoge einfügen
  const isArtNoir = visualStyle === 'art_noir';
  const isWetPlate = visualStyle === 'wet_plate';
  const isSilentStyle = isArtNoir || isWetPlate;
  const dialogueText = (typographyOverlay?.enabled && typographyOverlay?.muteVoiceover) || isSilentStyle ? undefined : initialDialogueText;

  const startSec = (windowNumber - 1) * durationSeconds;
  const endSec = windowNumber * durationSeconds;

  const tcStart = formatTimecode(startSec);
  const tcEnd = formatTimecode(endSec);

  // Group references by category
  const activeHumans = activeSubjects.filter((r) => r.category === 'human');
  const activeBuildings = activeSubjects.filter((r) => r.category === 'building');
  const activeObjects = activeSubjects.filter((r) => r.category === 'object');
  const activeLogos = allSubjects.filter((r) => r.category === 'logo' && r.isActiveInProject !== false);

  // Fallbacks if empty
  const primaryHuman1 = activeHumans[0] || allSubjects.find((r) => r.category === 'human') || {
    id: 'ref-default-1',
    category: 'human' as const,
    referenceIndex: 1,
    tag: '<Subject 1>',
    charTag: 'char Protagonist',
    name: 'Protagonist',
    roleOrAction: 'Nimmt aktiv an der Haupthandlung teil',
    relationship: 'Hauptprotagonist',
  };
  const primaryBuilding = activeBuildings[0] || allSubjects.find((r) => r.category === 'building');
  const primaryObject = activeObjects[0] || allSubjects.find((r) => r.category === 'object');

  // Align visual focus with primaryBuilding if present
  let enVisualFocus = toEnglishCinematicText(visualFocus, 'The primary subject of the scene and its atmospheric surroundings');
  if (primaryBuilding) {
    const bldMat = primaryBuilding.hairOrMaterial || primaryBuilding.clothingOrFinish || '';
    if (bldMat && /wood|plaster|glass|aluminum|modern/i.test(bldMat) && /brick|traditional roofline/i.test(enVisualFocus)) {
      enVisualFocus = toEnglishCinematicText(bldMat);
    }
  }

  // 1. Window Tag & Action header
  let styleLabel = 'cinematic scene';
  if (isArtNoir) {
    styleLabel = 'monochrome art noir masterpiece';
  } else if (isWetPlate) {
    styleLabel = 'strictly monochrome wet-plate collodion masterpiece from 1851';
  } else if (visualStyle === 'fujicolor_eterna_500t') {
    styleLabel = 'legendary Fujicolor Eterna 500T 8573 motion picture masterpiece with native ECN-2 4th color layer and Zeiss Master Primes';
  } else if (visualStyle === 'agfachrome_ct18') {
    styleLabel = 'legendary Agfachrome CT18 AP-41 photochemical reversal film masterpiece with cold sage shadows and faded ocher highlights';
  } else if (visualStyle === 'kodak_5247') {
    styleLabel = 'legendary Kodak 5247 100T motion picture masterpiece with 100% ENR silver-retention bleach-bypass and clashing color temperature';
  } else if (visualStyle === 'svema_zenit') {
    styleLabel = 'chemically degraded analog Svema lomo masterpiece with heavy grain';
  } else if (visualStyle === 'kodachrome') {
    styleLabel = 'legendary Kodachrome 64 analog color reversal slide masterpiece';
  } else if (visualStyle === 'cinestill_800t') {
    styleLabel = 'legendary CineStill 800T tungsten motion picture analog film masterpiece with carmine-red halation';
  } else if (visualStyle === 'krasnogorsk_16mm') {
    styleLabel = 'strictly monochrome vintage 16mm Krasnogorsk-3 movie masterpiece';
  } else if (visualStyle === 'polaroid_fp100c') {
    styleLabel = 'peel-apart analog polaroid FP-100C packfilm masterpiece';
  } else if (visualStyle === 'petzval') {
    styleLabel = 'historical Petzval 1840 optical masterpiece with swirling background';
  } else if (visualStyle === 'leica_noctilux') {
    styleLabel = 'ultra-shallow depth-of-field Leica Noctilux f/0.95 cinematic masterpiece';
  } else if (visualStyle === 'super8_tri_x') {
    styleLabel = 'flickering analog Super 8 Tri-X / Ektachrome movie masterpiece with heavy gate-weave';
  } else if (visualStyle === '35mm_anamorphic') {
    styleLabel = '35mm Cine-Scope Kodak Vision3 500T cinematic masterpiece with horizontal flares';
  } else if (visualStyle === '70mm_imax') {
    styleLabel = '70mm IMAX large format Kodak Vision3 cinema masterpiece with immense clarity';
  }

  const loraTagPrefix = (astroCinemaLoraMode !== false)
    ? `${actionCode || 'ASTROCINEMAV01K2T'} depicts a live-action ${styleLabel} in a native ${aspectRatio} widescreen frame.`
    : `Native ${aspectRatio} widescreen.`;
  const windowTag = `window${windowNumber}: (${tcStart}–${tcEnd}) ${loraTagPrefix}`;

  // English-normalized scene descriptors
  let enWeather = toEnglishCinematicText(weather, 'Natural clear daylight with balanced atmospheric illumination');
  let enBackground = toEnglishCinematicText(background, 'A cinematic environment matching the scene context');
  const enCamMovement = toEnglishCinematicText(cameraMovement, 'Smooth cinematic camera glide');
  let enSoundDesign = toEnglishCinematicText(soundDesign, 'Natural environmental ambience matching the surroundings');
  let enMusicStyle = toEnglishCinematicText(musicStyle, 'Cinematic music matching the tone of the scene');

  if (isArtNoir) {
    enWeather = 'Stark contrast chiaroscuro overhead Rembrandt key light with dramatic shadow fall-off, casting deep shadows';
    enBackground = 'A pure pitch-black matte negative space void background';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'The dry, textured sound of fingers sliding over rough surfaces, faint analog film grain crackle, and slow heavy breathing';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A single, deeply melancholic solo violin note swelling slowly in the dark void';
    }
  } else if (isWetPlate) {
    enWeather = 'Stark, high-contrast historical photography key-lighting with dark shadow fall-off and overexposed, glowing highlights';
    enBackground = 'An 1850s vintage portrait studio backdrop with muddy textures and dark vignette framing';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'Faint chemical sizzle, old wooden camera squeaking, metallic plate scratches, and historical room silence';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A distant, crackling wax cylinder recording of a dusty solo cello playing a slow melody';
    }
  } else if (visualStyle === 'fujicolor_eterna_500t') {
    enWeather = 'Austere, suffocating diffuse 5000K overcast daylight with clinical geometry, subdued highlight rolloff, and impenetrable cold slate-moss shadows, strictly avoiding warm golden-hour glow';
    enBackground = 'A stark, institutional modern interior or quiet austere landscape with muted color palettes, cold slate-gray walls, deep obsidian D-Max blacks, and ruthless architectural stillness';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'Heavy clinical room silence, faint acoustic breathing resonance, slow deliberate footsteps on stone, and low 19Hz infrasound pressure';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A solitary, austere cello note sustained over an ominous sub-bass vibration with sudden suffocating silence';
    }
  } else if (visualStyle === 'agfachrome_ct18') {
    enWeather = 'Subtle, overcast 5000K daylight with delicate muted pastel rolloff, soft ambient glow, casting cool sage-green and slate shadows with gentle highlight rolloff';
    enBackground = 'A contemplative, decaying modern environment or quiet interior with muted watercolor-like tones, cold sage shadows, faded ocher accents, and deep velvety D-Max blacks';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'Acoustic breathing resonance, rhythmic synchronized mechanical marching steps, deep infrasound pressure hum, and subtle room reverberation';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A somber, haunting acoustic cello motif underscored by an 18Hz sub-bass drone and decaying metallic harmonic resonance';
    }
  } else if (visualStyle === 'kodak_5247') {
    enWeather = 'Stark clashing dual lighting: cold 5500K exterior daylight cutting sharply through windows against warm 2800K tungsten interior practical lamps, casting razor-sharp high-contrast shadows with obsidian D-Max blacks';
    enBackground = 'A stark disaster-zone or high-contrast interior framed by cold 5500K window light and warm 2800K tungsten lamps, rendered with metallic silver retention, pulverized glass dust, and deep pitch-black negative space';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'Ominous low-frequency sub-bass pressure, the sharp high-frequency sound of shattering glass, falling dust particulate, and slow rhythmic breathing';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A cold, minimalist industrial drone with deep sub-bass vibrations and a distant echoing metallophone chime';
    }
  } else if (visualStyle === 'svema_zenit') {
    enWeather = 'Warm sulfur-yellow late-afternoon sunlight with dramatic vintage contrast, casting long yellow-hued shadows';
    enBackground = 'A nostalgic analog background with heavy lomo-vibe, shot on chemically degraded film stock';
  } else if (visualStyle === 'kodachrome') {
    enWeather = 'Neutral 5500K daylight-balanced directional key light with pure white specular highlights, crisp spectral color separation, and deep neutral shadow fall-off, strictly avoiding yellow or sepia cast';
    enBackground = 'A clean, deep neutral-dark studio background with zero amber tint and velvety obsidian D-Max shadows';
  } else if (visualStyle === 'cinestill_800t') {
    enWeather = 'Atmospheric 3200K tungsten-balanced practical incandescent lighting mixed with deep cyan-cobalt ambient shadows, sharp specular reflections, and intense carmine-red 650nm halation glows around point light sources';
    enBackground = 'A cinematic moody urban night interior or exterior with glowing practical tungsten lamps, neon signs, and velvety obsidian shadow fall-off';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'Subtle low-frequency electrical hum of tungsten lamps, distant urban neon buzz, and quiet ambient night resonance';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A moody, slow-tempo cinematic noir ambient score with deep warm analog synth pads and subtle tape-saturated texture';
    }
  } else if (visualStyle === 'krasnogorsk_16mm') {
    enWeather = 'Harsh, dramatic, high-contrast industrial lighting with raw shadowed zones and stark overexposed highlight regions';
    enBackground = 'An old vintage film studio backdrop or textured industrial environment with active lens dust and film gate flutter';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'The rapid mechanical whirring click-clack of a 16mm wind-up spring motor, rhythmic camera shutter flutter, and coarse vintage environmental crackle';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A grainy, distorted brass or accordion solo recording playing a slow, nostalgic Eastern-European melody';
    }
  } else if (visualStyle === 'polaroid_fp100c') {
    enWeather = 'Soft-contrast milky daylight with elegant highlight rolloff and neutral, pleasant diffuse filling';
    enBackground = 'A soft-focus background with slightly desaturated colors and cool indigo-blue undertones';
  } else if (visualStyle === 'super8_tri_x') {
    enWeather = 'Soft, warm retro late afternoon sunlight with continuous frame flicker and dust particles dancing in the air';
    enBackground = 'A nostalgic 8mm home-video background with active film gate flutter, vertical mechanical shake, and warm yellow edge vignettes';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'The rhythmic, mechanical high-pitched whirring chatter of a Super 8 projector motor, celluloid scratch sounds, and crackling vintage warmth';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A nostalgic, lo-fi warm synth progression with heavy tape-wobble and slow mechanical crackle';
    }
  } else if (visualStyle === '35mm_anamorphic') {
    enWeather = 'Moody nighttime street lighting with heavy rain, glowing neon highlights, and horizontal blue anamorphic lens flares';
    enBackground = 'An atmospheric, rain-soaked urban cityscape with warm neon sign reflections and cinematic out-of-focus background details';
    if (!soundDesign || soundDesign.toLowerCase().includes('subtle natural') || soundDesign.toLowerCase().includes('natural environmental')) {
      enSoundDesign = 'Gentle falling rain pattering on asphalt, distant low city hum, and wet tire splashes on pavement';
    }
    if (!musicStyle || musicStyle.toLowerCase().includes('cinematic ambient score') || musicStyle.toLowerCase().includes('cinematic music')) {
      enMusicStyle = 'A deep, immersive electronic analog synthwave sequence with lush retro-futuristic pads';
    }
  } else if (visualStyle === '70mm_imax') {
    enWeather = 'Breathtaking, crystal-clear high-altitude volumetric daylight with majestic light shafts and perfect contrast rendering';
    enBackground = 'A monumental, ultra-high-resolution landscape or architectural vista with majestic depth-of-field and absolute picture stability';
  } else if (visualStyle === 'golden_hour') {
    enWeather = 'Warm golden hour late afternoon sunlight with soft volumetric light beams and long casting shadows';
  }

  // 2. Setting and Environment (Strict Cinematic English - no forced architecture injection)
  let loraAtmosphere = (astroCinemaLoraMode !== false && astroCinemaLoraKeywords !== false)
    ? 'Motivated practical lighting, balanced environmental fill, realistic skin texture, organic fine 35mm film grain, subtle halation, and controlled highlight rolloff.'
    : '';

  if (isArtNoir) {
    loraAtmosphere = 'strictly monochrome black-and-white art-noir aesthetic, photochemical medium format emulation: captured on Mamiya RZ67 Pro II with Mamiya Sekor Z 110mm f/2.8 lens on 120 roll film (Kodak Tri-X 400 / Ilford HP5+ chemistry). Masterpiece chiaroscuro Rembrandt directional overhead keylight casting dramatic shadows into pure matte-black void. Extreme tactile microcontrast on pores, beard stubble, and fabric weave, strictly zero artificial CGI skin smoothing, zero waxiness. Rich continuous silver-halide tonal gradation, obsidian D-Max blacks, razor-sharp focus plane with buttery medium-format depth-of-field falloff.';
  } else if (isWetPlate) {
    loraAtmosphere = 'strictly monochrome wet-plate collodion silver-nitrate glass plate style from 1851, orthochromatic sensitivity rendering warm colors pitch black and light blue tones white, heavy dark irregular silver pouring stains and chemical flow marks bleeding from corners, visible dust, hairline emulsion cracks, and fine metallic scratches embedded directly in the silver plate.';
  } else if (visualStyle === 'fujicolor_eterna_500t') {
    loraAtmosphere = 'photochemical cinema film emulation: authentic Fujicolor Eterna 500T (8573) 35mm motion picture celluloid processed in native ECN-2 chemistry. Proprietary Fujifilm 4th Color Layer technology delivering clean spectral separation between 5000K daylight and cold display/artificial lighting with strictly zero red halation due to intact Remjet carbon backing layer. Captured on Arriflex 535B or Arricam ST with Zeiss Master Primes (35mm/50mm/85mm T1.3 and 100mm macro T2.0) with ruthless microcontrast, razor-sharp edge definition, and zero optical softening. Muted institutional color palette, cool slate-moss and graphite shadows, neutral desaturated skin tones, and velvety obsidian D-Max blacks. Tactile organic 500T fine micro-grain resolving skin pores, chalk dust, fabric weave, and hairline surface cracks with surgical precision, strictly zero artificial CGI smoothing, zero plastic AI artifacts, zero halation.';
  } else if (visualStyle === 'agfachrome_ct18') {
    loraAtmosphere = 'photochemical cinema film emulation: authentic Agfachrome CT18 (50S) color reversal slide film processed in genuine Agfacolor AP-41 reversal chemistry. Signature German reversal color palette with muted watercolor pastel tones, cold sage-green and slate-moss shadows, desaturated warm hues, and faded ocher accents representing civilizational decay. Captured on Arriflex 35 BL4 with Carl Zeiss Sonnar 40mm f/2.8 HFT and Planar 50mm T1.4 lenses. Soft creamy highlight rolloff, pronounced painterly dye-cloud grain structure with velvety tactile edge sharpness resolving skin dust, micro-fractures, and fabric textures with microscopic clarity, deep velvety D-Max blacks, strictly zero artificial CGI smoothing, zero plastic AI artifacts.';
  } else if (visualStyle === 'kodak_5247') {
    loraAtmosphere = 'photochemical cinema film emulation: authentic Kodak Eastman Color Negative II 5247 (100T) motion picture stock processed with 100% ENR (Ernesto Novelli Rouch) silver-retention bleach-bypass technique. Zeiss Super Speed Mk II (T1.3 35mm/50mm and 100mm macro) optical rendering with clinical microcontrast, razor-sharp edge fidelity, and zero optical diffusion. Stark clashing color temperature: icy 5500K daylight clashing against warm 2800K tungsten practical lighting. Heavy color desaturation, muted slate-blues, cold graphite, and bone-pale skin tones, punctuated by deep metallic silver-halide shimmer in highlights and velvety obsidian D-Max blacks. Extremely tactile micro-grain structure resolving skin pores, perspiration beads, glass micro-fractures, and floating particulate dust with razor precision, strictly zero CGI smoothing, zero plastic AI artifacts.';
  } else if (visualStyle === 'svema_zenit') {
    loraAtmosphere = 'distinctive swirly vortex bokeh at f/2 using Helios-44-2 58mm or Jupiter-9 85mm lenses, background rapidly distorting in a circular spinning blur around the sharp center subject, chemically expired C-41 analog Svema filmstock with toxic emerald-green tint in the deep shadows and warm sulfur-yellow/magenta hues in the highlights, dramatic analog light-leak flares in hot orange and crimson red bleeding from the left edge of the frame, heavy 35mm film emulsion grain structure with subtle reticulation.';
  } else if (visualStyle === 'kodachrome') {
    loraAtmosphere = 'photochemical film emulation: authentic Kodachrome 64 daylight-balanced (5500K) color reversal slide film processed in genuine K-14 chemistry. Three-layer subtractive dye-coupler color science delivering iconic hyper-saturated crimson reds, natural peach-and-olive skin tones, and rich cobalt shadows with pure spectral separation. Sclera of the eyes remains natural clean ivory-white with neutral specular catchlights, irises retain natural deep eye color, strictly avoiding glowing yellow eyes or uniform amber sepia wash. Extremely steep analog contrast curve featuring obsidian-black D-Max shadows with zero digital noise. Silky highlight rolloff with distinctive warm 650nm crimson halation bleed along high-contrast specular edges. Crisp microscopic dye-grain celluloid texture with tactile organic sharpness, zero artificial edge haloing, zero digital smoothing.';
  } else if (visualStyle === 'cinestill_800t') {
    loraAtmosphere = 'photochemical motion picture film emulation: authentic CineStill 800T (modified Kodak Vision3 500T 5219 emulsion with Remjet carbon backing layer mechanically removed, processed in ECN-2 / C-41 color cross chemistry). Calibrated 3200K tungsten color balance delivering lush amber-gold highlights against deep cyan-cobalt-tinted ambient shadows and velvety obsidian D-Max blacks. Signature 650nm carmine-red halation bleed glowing intensely around direct point light sources, exposed filaments, street lamps, and specular chrome reflections due to uninhibited light bouncing off the camera pressure plate back into the red-sensitive emulsion layer. Organic Vision3 cinema micro-grain structure, crisp physical edge definition, natural lifelike skin texture with warm tungsten catchlights, strictly zero artificial CGI smoothing, zero plastic digital noise.';
  } else if (visualStyle === 'krasnogorsk_16mm') {
    loraAtmosphere = 'shot on Soviet Krasnogorsk-3 16mm wind-up cine-camera with Meteor 5-1 f/1.9 zoom lens, strictly monochrome black-and-white, coarse high-contrast silver-nitrate emulsion grain, visible physical film vertical frame jitter and gate-weave (shaking), vintage optical distortion at focal edges, with subtle hair-thin emulsion scratches, dust flecks, and chemical residue stains flickering between frames.';
  } else if (visualStyle === 'polaroid_fp100c') {
    loraAtmosphere = 'shot on peel-apart Fujifilm FP-100C packfilm, signature creamy emulsion contrast, warm pastel skin tones, soft and silky highlight roll-off with milky white levels, cool indigo-blue shadow undertones, framed by raw unpeeled chemical development borders with brown caustic developer paste stains and organic torn emulsion edges.';
  } else if (visualStyle === 'petzval') {
    loraAtmosphere = 'shot on historical 19th-century Petzval portrait lens, extreme field curvature and astigmatism with a tiny razor-sharp focal spot in the exact center, aggressive swirling vortex bokeh that rapidly spins the background in circular patterns, deep heavy vignette framing, and nostalgic vintage contrast.';
  } else if (visualStyle === 'leica_noctilux') {
    loraAtmosphere = 'shot on high-end Leica Noctilux-M 50mm f/0.95 lens, paper-thin razor-sharp depth of field, dramatic 3D subject pop-out separation against a butter-smooth melted background, exquisite out-of-focus highlights rendered as cat-eye optical vignetted shapes at the outer edges of the frame.';
  } else if (visualStyle === 'technicolor_v4') {
    loraAtmosphere = 'captured using legendary Technicolor System Three-Strip DF-24 Beam Splitter Camera with Taylor-Hobson Cooke Speed Panchro f/2.0 lenses, glorious highly-saturated three-strip dye-transfer color process, extraordinarily dense scarlet reds, deep mustard yellows, and lush organic emerald greens, velvety thick shadow levels, pristine dye-matrix saturation with three-dimensional depth, and subtle glowing highlight halation from vintage studio floodlights.';
  } else if (visualStyle === 'aerochrome_infrared') {
    loraAtmosphere = 'shot on false-color Kodak Aerochrome IV 2443 infrared filmstock with Carl Zeiss Distagon 40mm f/4 lens and a yellow Tiffen Wratten 12 filter, all live foliage and green vegetation glowing in vibrant surreal crimson red, deep magenta, and hot pink colors, sky and water rendered in stark pechschwarz black and deep ink-indigo, high infrared luminescence bloom (glowing halo effect) along high-contrast interfaces, with medium-coarse organic grain structure.';
  } else if (visualStyle === 'orwo_nc21') {
    loraAtmosphere = 'shot on East German ORWO Color NC21 filmstock with Carl Zeiss Jena Pancolar 50mm f/1.8 lens using radioactive thorium glass, beautiful warm golden-yellow color cast from the glass, soft retro-melancholic color palette, earthy muted blues and pastels, ultra-soft and gentle edge contrast, very dense wolkenartiges 35mm film grain, with delicate glowing lens flare streaks.';
  } else if (visualStyle === 'agfachrome_50s') {
    loraAtmosphere = 'shot on classic Agfachrome Professional 50S dia slide film with Carl Zeiss Sonnar 40mm f/2.8 HFT lens, vintage AP41 reversal chemistry processing, extremely beautiful muted watercolor-like pastel tones, cool minty sage greens and delicate pale blue hues, soft creamy white highlight rolloff, with pronounced painterly film grain giving a gorgeous impressionistic texture.';
  } else if (visualStyle === 'super8_tri_x') {
    loraAtmosphere = 'shot on vintage 8mm Super 8 Tri-X black-and-white or Ektachrome 100D color reversal film with Canon Auto Zoom 1014 camera, characteristic rapid vertical gate-weave picture shake, heavy coarse flickering film emulsion grain, visible physical hair-thin scratches, dust particles, and beautiful amber-orange film burn-in flare transitions bleeding from frame edges, soft analog edge resolution, and nostalgic home-video texture.';
  } else if (visualStyle === '35mm_anamorphic') {
    loraAtmosphere = 'shot on legendary 35mm Cine-Scope Kodak Vision3 500T (ECN-2 process) with Arriflex 35 IIC and Panavision C-Series anamorphic lenses, spectacular wide horizontal anamorphic blue light flares (lens streaks) slicing across the frame, gorgeous out-of-focus highlights rendered as vertically elongated oval bokeh circles, rich cinematic color palette, velvety deep shadows with kühle teal-indigo tint, and ultra-organic fine film grain.';
  } else if (visualStyle === '70mm_imax') {
    loraAtmosphere = 'shot on high-end 70mm IMAX MSM 9802 cine-camera on Kodak Vision3 250D daylight cinematic filmstock with Hasselblad large-format prime lenses, breathtaking panoramic clarity and ultra-high resolution texture, virtually invisible micro-fine grain structure, immense razor-sharp three-dimensional depth-of-field separation, perfect color fidelity, and exceptionally smooth highlights rolloff.';
  } else if (visualStyle === 'golden_hour') {
    loraAtmosphere = 'motivated warm golden hour backlight, soft volumetric dust flares, high-contrast warm glow, organic fine 35mm film grain, subtle halation, and controlled highlight rolloff.';
  } else if (visualStyle === 'vintage_16mm') {
    loraAtmosphere = 'vintage 16mm analog indie film look, warm nostalgic retro color grading, soft contrast, subtle organic chromatic aberration, active grain structure, and nostalgic atmosphere.';
  }

  // Apply Analog Labor Störungen (Chemical/Physical abuses) to loraAtmosphere
  if (analogLaborStörung && analogLaborStörung !== 'none') {
    if (analogLaborStörung === 'cross_processing') {
      loraAtmosphere += ' Subjected to creative chemical cross-processing (C-41 developed in E-6 chemistry) producing hyper-saturated yellow highlight glares and extremely toxic emerald-green and turquoise shadow tones with a raw vintage contrast surge.';
    } else if (analogLaborStörung === 'film_soup') {
      loraAtmosphere += ' Processed in a custom boiling chemical film-soup mixture (lemon juice, seawater, and liquid soap), causing active organic emulsion erosion, beautiful fractal oxidation patterns, and microscopic chemical bubble residues floating over the gelatin carrier.';
    } else if (analogLaborStörung === 'thermal_shock') {
      loraAtmosphere += ' Subjected to intense heat thermal shock prior to development, resulting in semi-melted gelatin layers, bizarre capillary-like deep red veins and crimson artifacts creeping from the film borders, with beautiful edge-softness and dynamic light leaks.';
    } else if (analogLaborStörung === 'bleach_bypass') {
      loraAtmosphere += ' Developed with a harsh bleach-bypass technique (retaining metallic silver in the emulsion) yielding a brutal high-contrast industrial aesthetic, heavily desaturated color tones, deep hard charcoal blacks, and intense silver-halide grain shimmer.';
    }
  }

  // Apply Macro Recipe if selected
  let finalVisualFocus = enVisualFocus;
  if (analogMacroRecipe && analogMacroRecipe !== 'none') {
    if (analogMacroRecipe === 'chemical_feast') {
      finalVisualFocus = 'A magnificent, high-magnification extreme macro shot detailing active chemical corrosion, copper-carbonate green oxidation boiling under a microscope lens, with organic gelatine bubbling and blistering under extreme heat.';
    } else if (analogMacroRecipe === 'silver_scar') {
      finalVisualFocus = 'An intense, extreme macro close-up of pure liquid silver mercury flowing slowly across a cracked obsidian surface, with silver-nitrate crystallization and stark metallic reflections captured with microscopically shallow depth of field.';
    } else if (analogMacroRecipe === 'saturated_rust') {
      finalVisualFocus = 'An extreme macro close-up of bubbling red rust and metal oxidation being hit by high-contrast crimson sparks, revealing beautiful golden-orange crystalline structures and coarse glowing heat textures under heavy light.';
    }
  }

  const settingSegment = [enWeather, enBackground, `Focus on ${finalVisualFocus}.`, loraAtmosphere].filter(Boolean).join(' ');

  // 3. Definitions Segment (Strict Cinematic English & Clean Maestro Anchors)
  const definitionsParts: string[] = [];

  if (activeHumans.length > 0) {
    const humanDefs = activeHumans.map((s) => {
      const idx = s.referenceIndex || 1;
      const cleanName = cleanMaestroAnchorName(s.name, `Subject${idx}`);
      const maestroAnchor = `@Subject${idx}_${cleanName}`;
      const defaults = getDistinctSubjectVisualDefaults(idx, s.name, s.gender, s.roleOrAction);

      const isGenericHair = !s.hairOrMaterial || /^(gepflegtes haar|kurze haare|standard|n\/a)$/i.test(s.hairOrMaterial.trim());
      const isGenericClothing = !s.clothingOrFinish || /^(passende kleidung|zeitgemäße kleidung|standard|n\/a)$/i.test(s.clothingOrFinish.trim());
      const isGenericAge = !s.ageRange || /^(standard|n\/a)$/i.test(s.ageRange.trim());
      const isGenericBuild = !s.build || /^(standard|n\/a)$/i.test(s.build.trim());

      const hair = !isGenericHair ? toEnglishCinematicText(s.hairOrMaterial!) : defaults.hair;
      const eyes = s.eyesOrGlazing && !/blick|augen/i.test(s.eyesOrGlazing) ? toEnglishCinematicText(s.eyesOrGlazing) : defaults.eyes;
      const marks = s.distinguishingMarks && !/konsistenz|bildfehler/i.test(s.distinguishingMarks) ? toEnglishCinematicText(s.distinguishingMarks) : defaults.marks;
      const clothing = !isGenericClothing ? toEnglishCinematicText(s.clothingOrFinish!) : defaults.clothing;
      const age = !isGenericAge ? s.ageRange! : defaults.age;
      const build = !isGenericBuild ? toEnglishCinematicText(s.build!) : defaults.build;
      const actionDesc = s.roleOrActionEn ? toEnglishCinematicText(s.roleOrActionEn) : (s.roleOrAction ? toEnglishCinematicText(s.roleOrAction) : 'Interacts naturally in the scene context');
      const relDesc = s.relationshipEn ? toEnglishCinematicText(s.relationshipEn) : (s.relationship ? toEnglishCinematicText(s.relationship) : 'Protagonist in the screenplay');

      return `${s.tag} is ${cleanName} (${maestroAnchor}). ${hair}, ${eyes}, ${marks}. Wears exactly ${clothing}. Age ${age}, ${build}. Role & Action: ${actionDesc}. Relationship: ${relDesc}. [UNIQUE IDENTITY LOCK: <Subject ${idx}> has distinct face and attire, zero similarity to other subjects].`;
    });
    definitionsParts.push(`Subject definitions: ${humanDefs.join(' ')}`);
  }

  if (activeBuildings.length > 0) {
    const bldDefs = activeBuildings.map((b) => {
      const idx = b.referenceIndex || 1;
      const cleanName = cleanMaestroAnchorName(b.name, `Building${idx}`);
      const maestroAnchor = `@Building${idx}_${cleanName}`;
      const bldAction = b.roleOrActionEn ? toEnglishCinematicText(b.roleOrActionEn) : (b.roleOrAction ? toEnglishCinematicText(b.roleOrAction) : 'Primary architectural facade');
      const bldMat = toEnglishCinematicText(b.hairOrMaterial, 'modern facade with natural wood and fine plaster');
      const bldGlaz = toEnglishCinematicText(b.eyesOrGlazing, 'triple-pane panoramic glazing with slim aluminium profiles');
      const bldFin = toEnglishCinematicText(b.clothingOrFinish, 'integrated solar roof and spacious wooden deck');

      return `${b.tag} is ${cleanName} (${maestroAnchor}). Architecture & materials: ${bldMat}, glazing: ${bldGlaz}, finish: ${bldFin}. Function: ${bldAction}.`;
    });
    definitionsParts.push(`Building definitions: ${bldDefs.join(' ')}`);
  }

  if (activeObjects.length > 0) {
    const objDefs = activeObjects.map((o) => {
      const idx = o.referenceIndex || 1;
      const cleanName = cleanMaestroAnchorName(o.name, `Object${idx}`);
      const maestroAnchor = `@Object${idx}_${cleanName}`;
      const objAction = o.roleOrActionEn ? toEnglishCinematicText(o.roleOrActionEn) : (o.roleOrAction ? toEnglishCinematicText(o.roleOrAction) : 'Central tactile prop');
      const objFin = toEnglishCinematicText(o.clothingOrFinish, 'brushed stainless steel');
      const objMarks = toEnglishCinematicText(o.distinguishingMarks, 'precision craftsmanship and engraved logo');

      return `${o.tag} is ${cleanName} (${maestroAnchor}). Finish: ${objFin}, details: ${objMarks}. Function: ${objAction}.`;
    });
    definitionsParts.push(`Object definitions: ${objDefs.join(' ')}`);
  }

  if (activeLogos.length > 0) {
    const logoDefs = activeLogos.map((l) => {
      const maestroAnchor = `@Logo1_Wasserzeichen_BottomRight`;
      return `${l.tag} is ${l.name} (${maestroAnchor}). Permanent watermark: strictly positioned in the bottom-right corner, subtle and semi-transparent (25% opacity), non-intrusive CI overlay.`;
    });
    definitionsParts.push(`Logo watermark definitions: ${logoDefs.join(' ')}`);
  }

  const definitionsSegment = definitionsParts.join(' ');

  // 4. Separation & Anti-Crossbleed Declarations (Strict MiniMax H3 Anti-Clone Anchor)
  let separationSegment = '';
  if (activeHumans.length > 1) {
    const names = activeHumans.map((s) => {
      const idx = s.referenceIndex || 1;
      const cleanName = cleanMaestroAnchorName(s.name, `Subject${idx}`);
      return `${s.tag} ${cleanName} (@Subject${idx}_${cleanName})`;
    }).join(' and ');
    separationSegment = `ANTI-CLONE & IDENTITY LOCK: ${names} are strictly separate, unique human individuals. Zero feature transfer, zero facial blending, zero morphing, and zero twin duplications. Each actor appears strictly ONCE in this frame. No duplicate or background clones. ALL background extras, visitors, neighbors, and unanchored people in frame strictly keep closed lips with zero talking, zero mouthing, and zero phantom chatter.`;
  } else if (activeHumans.length === 1) {
    const h = activeHumans[0];
    const idx = h.referenceIndex || 1;
    const cleanName = cleanMaestroAnchorName(h.name, `Subject${idx}`);
    separationSegment = `ANTI-CLONE & IDENTITY LOCK: ${h.tag} ${cleanName} (@Subject${idx}_${cleanName}) appears strictly ONCE in this frame as a unique individual. Zero duplicate clones, zero face morphing, zero background twins. ALL background extras, visitors, neighbors, and unanchored people in frame strictly keep closed lips with zero talking, zero mouthing, and zero phantom chatter.`;
  }

  // 5. Timecoded Narrative Sequence (100% Contiguous without time gaps)
  const quarterDur = durationSeconds / 4;
  const t1End = formatTimecode(startSec + quarterDur);
  const t2End = formatTimecode(startSec + quarterDur * 2);
  const t3End = formatTimecode(startSec + quarterDur * 3);

  // Build human tags string INCLUDING ALL active humans (e.g. Subject 2, Subject 3, Subject 4)
  const humanTags = activeHumans.map((h) => {
    const cleanName = cleanMaestroAnchorName(h.name, `Subject${h.referenceIndex || 1}`);
    return `${h.tag} ${cleanName}`;
  });
  const humanTagsStr = humanTags.length > 2
    ? `${humanTags.slice(0, -1).join(', ')} and ${humanTags[humanTags.length - 1]}`
    : humanTags.join(' and ') || `${primaryHuman1.tag} ${primaryHuman1.name}`;

  const bldTagStr = primaryBuilding ? ` at ${primaryBuilding.tag} (${cleanMaestroAnchorName(primaryBuilding.name, 'Building')})` : '';

  const enNarrativeAction = toEnglishCinematicText(narrativeAction);

  // Timecode 1: Start to T1
  let timecodeSegment = `TIMECODE ${tcStart}–${t1End}: ${humanTagsStr} interact in the scene${bldTagStr}. ${enCamMovement}. `;

  // Timecode 2: T1 to T2
  if (enNarrativeAction) {
    timecodeSegment += `TIMECODE ${t1End}–${t2End}: ${enNarrativeAction}. The environment and elements of ${enVisualFocus} are visible. `;
  } else {
    timecodeSegment += `TIMECODE ${t1End}–${t2End}: They explore and interact with ${enVisualFocus}. The scene lighting emphasizes authentic details. `;
  }

  // Dialogue Trigger exactly at T2 (No gap between T2 and dialogue!)
  const allHumans = allSubjects.filter((s) => s.category === 'human');
  let speakerObj = activeHumans[0] || primaryHuman1;

  const spkQuery = (dialogueSpeaker || narrativeAction || visualFocus || '').toLowerCase();
  if (spkQuery) {
    const matched = allHumans.find((h) => {
      const hTag = h.tag.toLowerCase();
      const hName = h.name.toLowerCase();
      const hRole = (h.roleOrAction || '').toLowerCase();

      if (hTag && spkQuery.includes(hTag)) return true;
      if (hName && (spkQuery.includes(hName) || hName.includes(spkQuery))) return true;
      if (hRole && (spkQuery.includes(hRole) || hRole.includes(spkQuery))) return true;

      const numMatch = hTag.match(/subject\s*(\d+)/i) || hTag.match(/(\d+)/);
      if (numMatch && numMatch[1]) {
        const num = numMatch[1];
        if (spkQuery.includes(`subject ${num}`) || spkQuery.includes(`subject${num}`) || spkQuery.includes(`subject_${num}`) || spkQuery.includes(`<subject ${num}>`)) {
          return true;
        }
      }
      return false;
    });

    if (matched) {
      speakerObj = matched;
      if (!activeHumans.some((h) => h.id === speakerObj.id)) {
        activeHumans.push(speakerObj);
      }
    }
  }
  const speakerIdx = speakerObj.referenceIndex || 1;
  const cleanSpeakerName = cleanMaestroAnchorName(speakerObj.name, `Subject${speakerIdx}`);
  const speakerAnchorTag = `@Subject${speakerIdx}_${cleanSpeakerName}`;
  const sanitizedDialogue = sanitizeQuotesForJSON(dialogueText || 'Hier beginnt unser neues Kapitel.');
  const sanitizedSpeakerAnchor = sanitizeQuotesForJSON(speakerAnchorTag);
  const cleanClaimOrCta = sanitizeQuotesForJSON(claimOrCta || '');
  const timePrefix = `[TIME:${startSec}s-${endSec}s]`;

  // Clean timecoded dialogue trigger: strictly matching working template to prevent off-speaker babbling!
  if (dialogueText) {
    timecodeSegment += `TIMECODE ${t2End}, ${speakerObj.tag} ${cleanSpeakerName}: ${timePrefix} <d[Subject${speakerIdx}][${dialogueLanguage}]> ${sanitizedDialogue} </d> `;
  }

  // Timecode 3: T2 to T3 (Reaction of other humans, e.g. Subject 3 and Subject 4, simultaneous with dialogue)
  const otherHumans = activeHumans.filter((h) => h.id !== speakerObj.id);
  const listenerSilenceLock = (voiceModulation?.enabled !== false && voiceModulation?.nonSpeakingListenerLock !== false)
    ? 'with closed mouths, peaceful smile, and subtle attentive nodding (strictly no speaking, zero mouth movement)'
    : 'react naturally in the environment, taking in the scene';

  if (otherHumans.length > 0) {
    const otherNames = otherHumans.map((h) => `${h.tag} ${cleanMaestroAnchorName(h.name, 'Partner')}`).join(' and ');
    timecodeSegment += `TIMECODE ${t2End}–${t3End}: Simultaneously, ${otherNames} listen attentively ${listenerSilenceLock}. `;
  } else {
    timecodeSegment += `TIMECODE ${t2End}–${t3End}: Simultaneously, the camera glides fluidly across the space, highlighting ${enVisualFocus}. `;
  }

  // Timecode 4: T3 to End (Final Call to Action or smooth transition)
  const fontDirective = claimTypography ? (
    claimTypography.fontStyle === 'handschrift'
      ? 'elegant handwritten cursive script'
      : claimTypography.fontStyle === 'serif'
      ? 'refined editorial serif typography'
      : claimTypography.fontStyle === 'condensed_bold'
      ? 'bold condensed cinema block letters'
      : 'clean modern sans-serif block letters'
  ) : 'clean modern typography';

  const animDirective = claimTypography ? (
    claimTypography.animation === 'blur_reveal'
      ? 'cinematic blur-reveal sliding into sharp focus'
      : claimTypography.animation === 'typewriter'
      ? 'sequential typewriter animation reveal'
      : claimTypography.animation === 'hard_cut'
      ? 'sharp direct cut on-screen'
      : 'smooth opacity fade-in'
  ) : 'smooth opacity fade-in';

  const placeDirective = claimTypography ? (
    claimTypography.placement === 'center'
      ? 'exact screen center'
      : claimTypography.placement === 'top_third'
      ? 'upper third of frame'
      : claimTypography.placement === 'lower_right'
      ? 'lower right corner'
      : 'cinematic lower-third'
  ) : (isLastWindow ? 'exact screen center' : 'cinematic lower-third');

  const accentDirective = (claimTypography?.hasCursiveAccent && claimTypography?.cursiveNote)
    ? ` paired with delicate handwritten cursive subtitle '${sanitizeQuotesForJSON(claimTypography.cursiveNote)}'`
    : '';

  if (isLastWindow && cleanClaimOrCta) {
    const objMention = primaryObject ? ` Featuring ${primaryObject.tag} (${cleanMaestroAnchorName(primaryObject.name, 'Object')}).` : '';
    timecodeSegment += `TIMECODE ${t3End}–${tcEnd}: The camera captures the final moments of the scene.${objMention} On-screen text cleanly displaying '${cleanClaimOrCta}' appears at ${placeDirective} in ${fontDirective}${accentDirective} via ${animDirective}. Fade to soft cinematic black over the last second.`;
  } else if (cleanClaimOrCta) {
    timecodeSegment += `TIMECODE ${t3End}–${tcEnd}: Smooth cinematic transition into the next perspective while on-screen text cleanly displaying '${cleanClaimOrCta}' appears at ${placeDirective} in ${fontDirective} via ${animDirective}${accentDirective}.`;
  } else {
    timecodeSegment += `TIMECODE ${t3End}–${tcEnd}: Smooth cinematic transition into the next perspective with ${enVisualFocus} gleaming in the light.`;
  }

  // 6. EXTREME CLOSE-UP Macro Inserts (100mm macro, T1.8)
  const macro1 = `EXTREME CLOSE-UP, 100mm macro, T1.8 – close observation of ${enVisualFocus}, capturing fine details in the light.`;
  const macro2 = primaryBuilding
    ? `EXTREME CLOSE-UP, 100mm macro, T1.8 – reflections and ambient light interacting with ${primaryBuilding.tag}.`
    : `EXTREME CLOSE-UP, 100mm macro, T1.8 – reflections and ambient light interacting with the environment, emphasizing depth.`;
  const macro3 = isLastWindow && cleanClaimOrCta
    ? (primaryObject
        ? `EXTREME CLOSE-UP, 100mm macro, T1.8 – ${primaryObject.tag} (${primaryObject.name}) held firmly in hand, followed by the crisp ${fontDirective} of '${cleanClaimOrCta}'.`
        : `EXTREME CLOSE-UP, 100mm macro, T1.8 – a central focal detail of the final scene, followed by the pristine ${fontDirective} of '${cleanClaimOrCta}'.`)
    : (cleanClaimOrCta
        ? `EXTREME CLOSE-UP, 100mm macro, T1.8 – close detail of ${enVisualFocus}, accompanied by the on-screen claim '${cleanClaimOrCta}' in ${fontDirective}.`
        : `EXTREME CLOSE-UP, 100mm macro, T1.8 – soft light patterns moving slowly across the surface, emphasizing the passage of time.`);

  const macroSegment = `${macro1} ${macro2} ${macro3}`;

  // 7. Camera section (Strict Cinematic English)
  const cameraSegment = `Camera: ${enWeather}, ${enBackground}, ${enCamMovement}, focusing on ${primaryHuman1.tag} ${primaryHuman1.name}, ${enVisualFocus}, shallow depth of field, 35mm master prime, cinematic framing, no artifacts, consistent lighting and anatomy throughout.`;

  // 8. Audio Delivery, Audio Design & Music (Strict Anti-Babble & Anti-Geplappere Lock)
  const soundAcoustic = enSoundDesign;
  const musicAcoustic = enMusicStyle;

  // Voice Modulator nuance directives
  const charKey = voiceModulation?.voiceCharacter || 'makler_authority';
  const voiceCharacterDirective = charKey === 'makler_authority'
    ? 'calm authoritative baritone timbre with warm confidence and trustworthy resonance'
    : charKey === 'warm_narrator'
    ? 'sonorous documentary narrator timbre with grounded warmth and relaxed inflection'
    : charKey === 'emotional_buyer'
    ? 'joyful, expressive natural timbre with genuine emotional delight and clear diction'
    : charKey === 'calm_architect'
    ? 'deliberate, focused architectural specialist timbre with thoughtful cadence'
    : 'clear, dynamic, engaging commercial voice with crisp articulation';

  const pacingKey = voiceModulation?.pacing || 'measured';
  const pacingDirective = pacingKey === 'measured'
    ? 'measured conversational cadence (~110 wpm) with natural breath pauses before and after the sentence'
    : pacingKey === 'relaxed'
    ? 'calm, leisurely pacing (~95 wpm) with smooth breathing and effortless pauses'
    : 'energetic, fluid cadence (~130 wpm) with vibrant momentum and crisp pronunciation';

  const roomKey = voiceModulation?.acousticEnvironment || 'warm_foyer';
  const acousticRoomDirective = roomKey === 'warm_foyer'
    ? 'spacious interior acoustics with gentle natural room reverb'
    : roomKey === 'studio_condenser'
    ? 'ultra-clean close-mic condenser acoustic with pristine presence and zero room echo'
    : roomKey === 'natural_room'
    ? 'well-damped residential room acoustics with balanced acoustic warmth'
    : 'open outdoor terrace acoustic with natural airiness and gentle environmental dispersion';

  const antiBabbleDirectives = (voiceModulation?.enabled !== false && voiceModulation?.antiBabbleLock !== false)
    ? 'STRICT UNIVERSAL ANTI-BABBLE LOCK: ALL subjects, background extras, visitors, neighbors, and nearby people strictly keep their lips completely closed with ZERO phantom mouthing, ZERO talking, ZERO filler chatter, ZERO unsolicited speech fragments, and ZERO mumbling before or after dialogue. Lips stay naturally closed when not speaking.'
    : 'STRICTLY ZERO rambling, ZERO background chatter, ZERO unsolicited speech fragments from anyone in frame.';

  const audioDeliverySegment = dialogueText
    ? `Audio Delivery: ${antiBabbleDirectives} Spoken ONLY by ${cleanSpeakerName} in ${voiceCharacterDirective}, delivered with ${pacingDirective}, captured with ${acousticRoomDirective}. Only the single marked dialogue line.`
    : `Audio Delivery: STRICTLY ZERO speech from anyone in frame, ZERO rambling, ZERO background talking, ZERO mouth movements. Pure silent cinematic ambience only.`;
  const audioDesignSegment = `Audio Design: ${soundAcoustic}, nothing else.`;
  const musicSegment = dialogueText
    ? `Music: ${musicAcoustic}. Only ambience and the marked dialogue lines.`
    : `Music: ${musicAcoustic}. Only ambience.`;

  // 9. Active References Tag
  const activeRefTags: string[] = [];
  activeSubjects.forEach((ref) => {
    const typeLabel = ref.category === 'human' ? 'char' : ref.category === 'building' ? 'building' : ref.category === 'object' ? 'prop' : ref.category === 'logo' ? 'logo-watermark' : 'env';
    activeRefTags.push(`${ref.tag} ${ref.name} (${typeLabel})`);
  });

  // Always bind active logo to active references
  activeLogos.forEach((logo) => {
    if (!activeRefTags.some((t) => t.startsWith(logo.tag))) {
      activeRefTags.push(`${logo.tag} ${logo.name} (logo-watermark-bottom-right)`);
    }
  });

  const activeReferencesSegment =
    activeRefTags.length > 0
      ? `Active_References: ${activeRefTags.join(', ')}.`
      : `Active_References: ${primaryHuman1.tag} ${primaryHuman1.name} (char).`;

  // 10. Permanent Logo Watermark Rule (Strictly bottom-right corner, subtle, semi-transparent)
  const logoWatermarkSegment = activeLogos.length > 0
    ? `Watermark: Brand logo ${activeLogos.map((l) => l.tag).join(', ')} must appear permanently in the bottom-right corner (bottom-right, 25% opacity, subtle, non-intrusive transparent overlay).`
    : '';

  // 11. Timecoded Typography Overlay Segment (Optional Imagevideo & Commercial Mode)
  const typographySegment = buildTypographySegment(
    typographyOverlay,
    windowNumber,
    totalWindows,
    { tcStart, t1End, t2End, t3End, tcEnd }
  );

  // Combine ALL segments into one string and strictly enforce 0 line breaks!
  const rawCombined = [
    windowTag,
    definitionsSegment,
    separationSegment,
    settingSegment,
    timecodeSegment,
    macroSegment,
    typographySegment,
    cameraSegment,
    audioDeliverySegment,
    audioDesignSegment,
    musicSegment,
    logoWatermarkSegment,
    activeReferencesSegment,
  ]
    .filter(Boolean)
    .join(' ');

  const singleLinePrompt = enforceSingleLine(rawCombined);

  return {
    windowNumber,
    timecodeStart: tcStart,
    timecodeEnd: tcEnd,
    durationSeconds,
    singleLinePrompt,
    title: `Window ${windowNumber}: ${visualFocus.slice(0, 30)}...`,
    summary: narrativeAction || `${visualFocus} mit ${cameraMovement}`,
    activeSubjects: activeSubjects.map((s) => s.name),
    activeReferences: activeSubjects.map((s) => `${s.tag} ${s.name}`),
    dialogueSnippet: dialogueText ? `${timePrefix} <d[Subject${speakerIdx}][${dialogueLanguage}]> ${sanitizedDialogue} </d>` : undefined,
    extremeCloseups: [macro1, macro2, macro3],
    cameraMove: cameraMovement,
    musicAudio: `${musicAcoustic} / ${soundAcoustic}`,
    claimOrCta: claimOrCta || undefined,
  };
}

/**
 * Transforms an entire Concept Proposal into the strict Single-Line Windows format
 */
export function pressProposalToSingleLineWindows(params: {
  proposal: ConceptProposal;
  allSubjects: ConfigReference[];
  windowDurationSeconds?: number;
  dialogueLanguage?: DialogueLanguage;
  actionCode?: string;
  aspectRatio?: '16:9' | '9:16' | '2.39:1';
  globalWeather?: string;
  globalBackground?: string;
  finalCallToAction?: string;
  targetAudience?: TargetAudience;
  typographyOverlay?: TypographyOverlayConfig;
  voiceModulation?: VoiceModulationConfig;
  astroCinemaLoraMode?: boolean;
  astroCinemaLoraKeywords?: boolean;
  visualStyle?: string;
  analogLaborStörung?: string;
  analogMacroRecipe?: string;
}): SingleLineWindow[] {
  const {
    proposal,
    allSubjects,
    windowDurationSeconds = 14,
    dialogueLanguage = proposal.dialogueLanguage || 'German',
    actionCode = 'ASTROCINEMAV01K2T',
    aspectRatio = '16:9',
    globalWeather,
    globalBackground,
    finalCallToAction,
    targetAudience,
    typographyOverlay,
    voiceModulation,
    astroCinemaLoraMode = true,
    astroCinemaLoraKeywords = true,
    visualStyle = 'natural',
    analogLaborStörung,
    analogMacroRecipe,
  } = params;

  const totalWindows = proposal.windowBreakdown.length;
  const activeRefs = allSubjects.filter((r) => r.isActiveInProject !== false);

  return proposal.windowBreakdown.map((win, idx) => {
    const isLast = idx === totalWindows - 1;
    const cta = isLast ? (finalCallToAction || proposal.callToAction || win.claimOrCta) : win.claimOrCta;
    const typo = isLast ? (proposal.callToActionTypography || win.claimTypography) : win.claimTypography;

    const firstHuman = allSubjects.find((r) => r.category === 'human') || allSubjects[0];

    return buildSingleLineWindowPrompt({
      windowNumber: win.windowNumber,
      totalWindows,
      durationSeconds: windowDurationSeconds,
      actionCode,
      aspectRatio,
      weather: globalWeather || 'Natural clear daylight with balanced atmospheric illumination',
      background: globalBackground || 'Cinematic environment matching the scene context',
      cameraMovement: win.cameraMovement,
      visualFocus: win.focus,
      soundDesign: win.soundDesign || 'Natural environmental ambience matching the surroundings',
      musicStyle: win.musicStyle || 'Cinematic ambient score with warm emotional resonance',
      dialogueLanguage,
      dialogueSpeaker: win.dialogueSpeaker || firstHuman?.name || 'Protagonist',
      dialogueText: win.dialogueSnippet,
      claimOrCta: cta,
      claimTypography: typo,
      isLastWindow: isLast,
      activeSubjects: activeRefs.length > 0 ? activeRefs : allSubjects.slice(0, 3),
      allSubjects,
      narrativeAction: win.actionDescription,
      targetAudience,
      typographyOverlay,
      voiceModulation,
      astroCinemaLoraMode,
      astroCinemaLoraKeywords,
      visualStyle,
      analogLaborStörung,
      analogMacroRecipe,
    });
  });
}

/**
 * Cinematic English Normalizer & Translator:
 * Translates and standardizes German film, lighting, acoustic, and character
 * descriptions into high-end cinematic English prompt terminology strictly required for MiniMax H3 / Maestro.
 */
export function toEnglishCinematicText(text?: string, fallback: string = ''): string {
  if (!text || typeof text !== 'string') return fallback;
  const trimmed = text.trim();
  if (!trimmed) return fallback;

  // 1. Exact Multi-Word Phrase & Sentence Replacements (Sorted by specificity)
  const phraseReplacements: [RegExp, string][] = [
    // Character & Apparel Specific Phrases
    [/vollständig\s*kahl\s*geschorener\s*Schädel[^,]*/gi, 'completely clean-shaven bald head with distinct smooth cranial contours'],
    [/dichter\s*kurz\s*gestutzter\s*melierter\s*Vollbart[^.]*/gi, 'dense neatly trimmed salt-and-pepper full beard with fine grey and silver stubble'],
    [/tief\s*liegende,?\s*durchdringende\s*Augen[^.]*/gi, 'deep-set piercing eyes with a direct, steady and concentrated gaze into the lens'],
    [/helles\s*Leinen-?\s*oder\s*Oxford-Hemd[^.]*/gi, 'lightweight linen or oxford collared shirt open at the neck'],
    [/well-groomed\s*Naturhaar\s*with\s*natürlichem\s*Glanz/gi, 'well-groomed natural hair with natural sheen'],
    [/Wacher,\s*begeisterter\s*Blick/gi, 'alert, enthusiastic gaze'],
    [/Eindeutiger\s*visueller\s*Anker:\s*Natürlicher\s*Teint,\s*keine\s*auffälligen\s*Uhren,\s*Klon-Ausschluss\s*aktiv/gi, 'distinct visual anchor: natural complexion, no prominent watches, anti-clone lock active'],
    [/Hochwertiges\s*sandfarbenes\s*Leinenhemd/gi, 'high-quality sand-colored linen shirt'],
    [/natural\s*aufrechte\s*stature/gi, 'natural upright posture'],
    [/Edles\s*Lärchenholz\s*&\s*Glattputz/gi, 'fine natural timber and smooth finish'],
    [/Klar\s*reflektierende\s*Dreifach-Isolierverglasung/gi, 'clearly reflective panoramic glazing'],
    [/Matt\s*anthracite\s*eloxierte\s*Profile/gi, 'matte anthracite anodized frames'],
    [/Ruhige,\s*zeitlose\s*Natur-\s*und\s*Erdtöne[^.]*\./gi, 'Calm, timeless natural earth tones and neutral warm diffused daylight.'],
    [/Monochrome\s*Eleganz\s*mit\s*warmen\s*Akzenten[^.]*\./gi, 'Monochrome visual elegance with warm accents and balanced lighting.'],
    [/Sanfte\s*Salbei-,\s*Eukalyptus-\s*und\s*helle\s*Naturtöne[^.]*\./gi, 'Soft natural tones with gentle diffused light and serene organic surroundings.'],
    [/Warme,\s*sonnige\s*und\s*lebendige\s*Töne[^.]*\./gi, 'Warm, sunny and vibrant color palette with crisp daylight and open atmosphere.'],
    [/Kreative\s*Loft-Ästhetik[^.]*\./gi, 'Creative contemporary aesthetic with dynamic atmospheric lighting.'],
    [/Warme,\s*edle\s*Cremetöne[^.]*\./gi, 'Warm, sophisticated cream tones and gentle late afternoon golden light.'],

    // Target Audience Sound Aesthetic Presets
    [/Klassisch-harmonische\s*Streicher\s*mit\s*ruhigem\s*Klavier[^.]*\./gi, 'Classical harmonic strings with calm acoustic piano and natural environmental foley.'],
    [/Präziser\s*Modern-Electronic\s*Ambient[^.]*\./gi, 'Precise modern ambient soundscape with subtle sub-bass pulse and delicate piano notes.'],
    [/Meditative,\s*organische\s*Klanglandschaft[^.]*\./gi, 'Meditative organic soundscape: gentle warm cello, soft breeze, and serene acoustic room isolation.'],
    [/Wärmende\s*akustische\s*Gitarre[^.]*\./gi, 'Warm acoustic guitar, gentle piano melody, and soft ambient breeze.'],
    [/Inspirierende\s*Neo-Klassik[^.]*\./gi, 'Inspiring neo-classical ambient sound with warm acoustic texture.'],
    [/Ruhige,\s*feinsinnige\s*Akustik[^.]*\./gi, 'Serene, sophisticated acoustic soundscape with acoustic guitar, piano and soft natural breeze.'],

    // Weather & Atmosphere Sentences
    [/Bewölkter\s*Tag\s*bei\s*leichtem\s*Nieselregen[^.]*diffus[^.]*\./gi, 'Overcast day with gentle atmospheric drizzle, soft and diffused cinematic light with cozy and enduring warmth.'],
    [/Warmes\s*Abendlicht\s*&\s*goldene\s*Stunde/gi, 'Warm golden hour sunlight with soft diffused shadows and ambient twilight glow'],
    [/Warmes\s*Nachmittagslicht\s*&\s*goldene\s*Stunde/gi, 'Warm golden hour sunlight with soft diffused shadows and ambient twilight glow'],
    [/Sonnig\s*&\s*klarer\s*blauer\s*Himmel/gi, 'Sunny and clear blue sky with warm natural illumination'],
    [/Dunst\s*steigt\s*über\s*der\s*Wiese\s*auf[^.]*\./gi, 'Morning mist rising gently, morning sun breaking through trees, casting warm edge light across the scene.'],
    [/Morgenstille\s*&\s*Naturerwachen/gi, 'Serene morning silence and natural dawn, golden early morning sunlight'],
    [/Dämmerung\s*&\s*Leuchtendes\s*Zuhause/gi, 'Blue hour twilight, glowing warm interior light emanating through windows'],

    // Camera Movements & Presets
    [/Drohnenflug\s*Orbit\s*360°\s*und\s*sanfter\s*Sinkflug\s*auf\s*Augenhöhe/gi, '360-degree orbital drone flight smoothly descending to eye-level'],
    [/Drohnenflug\s*Orbit\s*360°/gi, '360-degree orbital drone shot gliding smoothly'],
    [/Dolly-In\s*durch\s*die\s*Eingangstür\s*mit\s*flüssiger\s*Steadicam-Führung/gi, 'Smooth Steadicam dolly-in gliding through the entrance door into the room'],
    [/Steadicam\s*Walkthrough\s*entlang\s*der\s*Sichtachse\s*Richtung\s*Garten/gi, 'Fluid Steadicam walkthrough along visual sightlines towards the background'],
    [/Langsamer\s*Rückwärts-Dolly\s*und\s*Aufstieg\s*der\s*Kamera\s*in\s*die\s*Abenddämmerung/gi, 'Slow reverse dolly and gentle crane rise into the golden evening twilight'],
    [/Dolly-In\s*mit\s*35mm\s*Prime/gi, 'Smooth forward dolly-in with 35mm master prime lens at eye level'],
    [/Kran-Aufzug\s*&\s*Sunset\s*Outro/gi, 'Slow ascending crane shot into the glowing evening sky'],
    [/FPV\s*Fly-Through\s*entlang\s*der\s*Dachlinie/gi, 'Dynamic FPV fly-through smoothly capturing the scene from above'],
    [/Sanfter\s*Kameraschwenk/gi, 'Gentle cinematic camera pan'],
    [/Statische\s*Meistereinstellung\s*mit\s*sanftem\s*Micro-Dolly/gi, 'Static cinematic master shot with gentle micro-dolly track'],
    [/Low-Angle\s*Steadicam\s*auf\s*die\s*Schritte/gi, 'Low-angle Steadicam tracking the footsteps, then tilting up to the face'],

    // Actions & Character Interactions
    [/Er\s*ist\s*(the\s*)?Makler\s*(und|and)\s*Verkäufer\s*(des\s*Hauses)?/gi, 'He is the presenter and guide of the location'],
    [/Sie\s*ist\s*(the\s*)?Partnerin\s*(von|of)\s*subject3_mann/gi, 'She is the partner of Subject 3'],
    [/Sicht\s*(auf|on)\s*(eine|a)\s*stabile,\s*solide\s*Infrastruktur/gi, 'View facing stable, enduring scenery'],
    [/Einfache,\s*funktionale\s*Gestaltung\s*without\s*übermäßige\s*Dekoration/gi, 'Clean, functional design without excessive decoration'],
    [/Szenerie\s*radiates\s*cozy\s*warmth\s*and\s*security\s*and\s*timeless\s*durability/gi, 'Scene radiates cozy warmth, security, and timeless durability'],
    [/Er\s*begrüßt\s*seine\s*Gäste\s*und\s*führt\s*sie\s*durch\s*das\s*Haus/gi, 'He warmly welcomes his guests and guides them through the space'],
    [/Erkundet\s*die\s*Architektur\s*und\s*prüft\s*die\s*Materialien/gi, 'Explores the surroundings and observes the environment with interest'],
    [/Erkundet\s*die\s*Architektur/gi, 'Explores the scene and interacts naturally with the surroundings'],
    [/Begleitet\s*die\s*Besichtigung/gi, 'Accompanies the walkthrough with confident satisfaction'],
    [/Sie\s*treten\s*durch\s*die\s*Eingangstür/gi, 'They step through the front door into the room'],
    [/Der\s*Blick\s*öffnet\s*sich\s*in\s*den\s*großzügigen\s*Wohn-\s*und\s*Kochbereich/gi, 'The view opens into the spacious interior area with natural sunlight pouring in'],
    [/Beide\s*stehen\s*entspannt\s*auf\s*der\s*Holzterrasse/gi, 'Both stand relaxed together bathed in golden evening light'],
    [/Die\s*Schlüsselübergabe\s*erfolgt/gi, 'The handover takes place in a tactile close-up'],
    [/Geht\s*barfuß\s*über\s*den\s*warmen\s*Parkettboden/gi, 'Walks across the warm floor, holding a steaming cup in both hands'],
    [/Sitzt\s*auf\s*der\s*Lesebank\s*im\s*Fenstererker/gi, 'Sits comfortably on the bench by the panoramic window with a book on her lap'],
    [/Zentrales\s*haptisches\s*Detail\s*bei\s*der\s*Übergabe/gi, 'Central tactile prop in the sequence, held firmly in hand'],
    [/Permanentes,\s*dezentes\s*Wasserzeichen/gi, 'Permanent discreet transparent watermark anchored in bottom-right corner (25% opacity)'],

    // Settings & Environments
    [/Moderne\s*Architektur\s*in\s*natürlicher\s*Umgebung/gi, 'A scenic cinematic environment in a natural setting'],
    [/Neubausiedlung\s*mit\s*gepflegtem\s*Vorgarten/gi, 'Upscale scenic residential setting with manicured grounds'],
    [/Gut\s*gepflegter,\s*naturnaher\s*Garten\s*mit\s*robusten\s*Bäumen\s*und\s*Sträuchern/gi, 'Well-maintained naturalistic setting with lush trees and foliage'],
    [/Gut\s*gepflegter,\s*naturnaher\s*landscaped\s*designer\s*garden\s*mit\s*robusten\s*Bäumen\s*und\s*Sträuchern/gi, 'Well-maintained naturalistic setting with lush trees and foliage'],
    [/Subtile\s*Raumakustik\s*&\s*sanftes\s*Windrauschen/gi, 'Subtle room presence, soft breeze through trees and gentle movement'],
    [/Cinematic\s*Ambient\s*Soundtrack/gi, 'Warm cinematic ambient soundtrack with gentle acoustic instrumentation'],
    [/Hauptmotiv\s*und\s*architektonische\s*Kulisse/gi, 'Primary visual subject and scenic backdrop throughout all windows'],
  ];

  let res = trimmed;

  for (const [regex, rep] of phraseReplacements) {
    res = res.replace(regex, rep);
  }

  // 2. Vocabulary & Word-Level Architectural / Cinematic Replacements
  const vocabReplacements: [RegExp, string][] = [
    // Custom German to English references and descriptors
    [/\bdunkles\b/gi, 'dark'],
    [/\bgepflegtes\b/gi, 'well-groomed'],
    [/\bHaar\b/gi, 'hair'],
    [/\bHaare\b/gi, 'hair'],
    [/\bAugen\b/gi, 'eyes'],
    [/\bleichter\b/gi, 'light'],
    [/\bleichtes\b/gi, 'light'],
    [/\bleichte\b/gi, 'light'],
    [/\bBart\b/gi, 'beard'],
    [/\bNaturhaar\b/gi, 'natural hair'],
    [/\bGlanz\b/gi, 'sheen'],
    [/\bWacher\b/gi, 'alert'],
    [/\bwacher\b/gi, 'alert'],
    [/\bbegeisterter\b/gi, 'enthusiastic'],
    [/\bBlick\b/gi, 'gaze'],
    [/\bTeint\b/gi, 'complexion'],
    [/\bUhren\b/gi, 'watches'],
    [/\bHochwertiges\s*sandfarbenes\s*Leinenhemd\b/gi, 'high-quality sand-colored linen shirt'],
    [/\bHochwertiges\b/gi, 'high-quality'],
    [/\bsandfarbenes\b/gi, 'sand-colored'],
    [/\bLeinenhemd\b/gi, 'linen shirt'],
    [/\baufrechte\b/gi, 'upright'],
    [/\bStatur\b/gi, 'stature'],
    [/\bJahre\b/gi, 'years'],
    [/\bBartwuchs\b/gi, 'beard growth'],
    [/\bfreundliches\b/gi, 'friendly'],
    [/\bfreundliche\b/gi, 'friendly'],
    [/\bLächeln\b/gi, 'smile'],
    [/\bhellgraues\b/gi, 'light gray'],
    [/\bhellgrauer\b/gi, 'light gray'],
    [/\bhellgrau\b/gi, 'light gray'],
    [/\bBlazer\b/gi, 'blazer'],
    [/\büber\b/gi, 'over'],
    [/\blueber\b/gi, 'over'],
    [/\bdunklen\b/gi, 'dark'],
    [/\bdunkle\b/gi, 'dark'],
    [/\bdunkler\b/gi, 'dark'],
    [/\bdunkles\b/gi, 'dark'],
    [/\bHosen\b/gi, 'trousers'],
    [/\bHose\b/gi, 'trousers'],
    [/\bsportlich\b/gi, 'athletic'],
    [/\bMittelblondes\b/gi, 'medium blonde'],
    [/\bmittelblond\b/gi, 'medium blonde'],
    [/\bwelliges\b/gi, 'wavy'],
    [/\bwellige\b/gi, 'wavy'],
    [/\bnatürlichen\b/gi, 'natural'],
    [/\bnatürliche\b/gi, 'natural'],
    [/\bnatuerliche\b/gi, 'natural'],
    [/\bBräunungen\b/gi, 'highlights'],
    [/\bsanften\b/gi, 'soft'],
    [/\bsanfte\b/gi, 'soft'],
    [/\bWellen\b/gi, 'waves'],
    [/\bDunkelbraune\b/gi, 'dark brown'],
    [/\bdunkelbraune\b/gi, 'dark brown'],
    [/\bFeine\b/gi, 'fine'],
    [/\bfeine\b/gi, 'fine'],
    [/\bgoldfarbene\b/gi, 'golden'],
    [/\bgoldene\b/gi, 'golden'],
    [/\bHalskette\b/gi, 'necklace'],
    [/\bdezente\b/gi, 'subtle'],
    [/\bdezent\b/gi, 'subtle'],
    [/\bOhrringe\b/gi, 'earrings'],
    [/\boffenes\b/gi, 'open'],
    [/\boffene\b/gi, 'open'],
    [/\bprofessionelle\b/gi, 'professional'],
    [/\bwarme\b/gi, 'warm'],
    [/\bwarmer\b/gi, 'warm'],
    [/\bwarmes\b/gi, 'warm'],
    [/\bAusstrahlung\b/gi, 'aura/look'],
    [/\bElegante\b/gi, 'elegant'],
    [/\belegante\b/gi, 'elegant'],
    [/\bcremefarbene\b/gi, 'cream-colored'],
    [/\bSeidenbluse\b/gi, 'silk blouse'],
    [/\bV-Ausschnitt\b/gi, 'V-neck'],
    [/\bmineblaue\b/gi, 'navy blue'],
    [/\bmarineblaue\b/gi, 'navy blue'],
    [/\bmarineblau\b/gi, 'navy blue'],
    [/\bstrukturierte\b/gi, 'structured'],
    [/\bstrukturiert\b/gi, 'structured'],
    [/\bJahre\b/gi, 'years'],
    [/\bStatur\b/gi, 'stature'],
    [/\bschlank\b/gi, 'slender'],
    [/\bschlanke\b/gi, 'slender'],
    [/\bproportioniert\b/gi, 'proportioned'],
    [/\bkahlköpfig\b/gi, 'bald'],
    [/\bmeliertes\b/gi, 'grizzled'],
    [/\bmelierter\b/gi, 'grizzled'],
    [/\bschwarze\b/gi, 'black'],
    [/\bschwarzer\b/gi, 'black'],
    [/\bBrille\b/gi, 'glasses'],
    [/\bsilberner\b/gi, 'silver'],
    [/\bsilberne\b/gi, 'silver'],
    [/\bArmbanduhr\b/gi, 'wristwatch'],
    [/\bam\b/gi, 'on'],
    [/\blinken\b/gi, 'left'],
    [/\bHandgelenk\b/gi, 'wrist'],
    [/\bblauer\b/gi, 'blue'],
    [/\bblaues\b/gi, 'blue'],
    [/\bmassgeschneiderter\b/gi, 'tailored'],
    [/\btailored\b/gi, 'tailored'],
    [/\bHemd\b/gi, 'shirt'],
    [/\bAnzug\b/gi, 'suit'],
    [/\bBlazer\b/gi, 'blazer'],
    [/\bGrauer\b/gi, 'gray'],
    [/\bgrauer\b/gi, 'gray'],
    [/\bgraues\b/gi, 'gray'],
    [/\bFassadenbereichen\b/gi, 'facade areas'],
    [/\bGroßflächige\b/gi, 'large panoramic'],
    [/\bgrossflaechige\b/gi, 'large panoramic'],
    [/\bschwarzem\b/gi, 'black'],
    [/\bschwarzen\b/gi, 'black'],
    [/\bschwarzer\b/gi, 'black'],
    [/\bRahmen\b/gi, 'frame'],
    [/\btransparenter\b/gi, 'transparent'],
    [/\bVerglasung\b/gi, 'glazing'],
    [/\bTerrasse\b/gi, 'terrace'],
    [/\bmoderne\b/gi, 'modern'],
    [/\bohne\b/gi, 'without'],
    [/\bdekorative\b/gi, 'decorative'],
    [/\bElemente\b/gi, 'elements'],
    [/\bszenerie\b/gi, 'scenery'],
    [/\bMusterhaus\b/gi, 'show home'],
    [/\bTraumhaus\b/gi, 'dream home'],
    [/\bEinfache\b/gi, 'clean'],
    [/\beinfache\b/gi, 'clean'],
    [/\bfunktionale\b/gi, 'functional'],
    [/\bGestaltung\b/gi, 'design'],
    [/\bübermäßige\b/gi, 'excessive'],
    [/\buebermaessige\b/gi, 'excessive'],
    [/\bDekoration\b/gi, 'decoration'],
    [/\bgut\b/gi, 'well-'],
    [/\bbefestigte\b/gi, 'paved'],
    [/\bStraße\b/gi, 'road'],
    [/\bStrasse\b/gi, 'road'],
    [/\bStrukturierte\b/gi, 'structured'],

    // Shot types & Camera
    [/\bTotale\b/gi, 'Wide establishing shot'],
    [/\bHalbtotale\b/gi, 'Medium wide shot'],
    [/\bNahaufnahme\b/gi, 'Close-up shot'],
    [/\bDetailaufnahme\b/gi, 'Tactile detail shot'],
    [/\bKameraführung\b/gi, 'camera movement'],
    [/\bKamerabewegung\b/gi, 'camera movement'],
    [/\bDrohne\b/gi, 'drone'],
    [/\bDrohnenflug\b/gi, 'drone flight'],
    [/\bSchwenk\b/gi, 'camera pan'],
    [/\bKranfahrt\b/gi, 'crane shot'],

    // Weather & Light
    [/\bBewölkt\b/gi, 'Overcast'],
    [/\bbewölkter Tag\b/gi, 'overcast day'],
    [/\bbei leichtem Nieselregen\b/gi, 'with gentle drizzle'],
    [/\bNieselregen\b/gi, 'gentle drizzle'],
    [/\bSonnenuntergang\b/gi, 'sunset'],
    [/\bAbenddämmerung\b/gi, 'evening twilight'],
    [/\bMorgensonne\b/gi, 'morning sun'],
    [/\bAbendsonne\b/gi, 'golden evening sun'],
    [/\bgoldene Stunde\b/gi, 'golden hour'],
    [/\bdiffus\b/gi, 'diffused'],
    [/\bweich und diffus\b/gi, 'soft and diffused'],
    [/\bLichtkegel\b/gi, 'warm beam of light'],
    [/\bSchattenwurf\b/gi, 'shadow patterns'],
    [/\bTageslicht\b/gi, 'natural daylight'],
    [/\bSonnenstrahl\b/gi, 'sunbeam'],
    [/\bSonnenlicht\b/gi, 'sunlight'],
    [/\bKunstlicht\b/gi, '3200K tungsten practical lighting'],
    [/\bHalation\b/gi, '650nm carmine-red halation'],
    [/\bLichthof\b/gi, 'carmine-red halation aura'],
    [/\bLichthöfe\b/gi, 'carmine-red halation blooms'],
    [/\bGlühlampe\b/gi, 'tungsten incandescent bulb'],
    [/\bGlühlampen\b/gi, 'tungsten incandescent lamps'],
    [/\bLeuchtstoffröhre\b/gi, 'fluorescent light tube'],
    [/\bLeuchtstoffröhren\b/gi, 'fluorescent light tubes'],
    [/\bNeonschild\b/gi, 'glowing neon sign'],
    [/\bNeonschilder\b/gi, 'glowing neon signs'],
    [/\bNeonschrift\b/gi, 'illuminated neon lettering'],

    // Architecture & Spaces
    [/\bFassade\b/gi, 'facade'],
    [/\bGrundriss\b/gi, 'floorplan layout'],
    [/\bTerrasse\b/gi, 'wooden terrace deck'],
    [/\bHolzterrasse\b/gi, 'wooden terrace deck'],
    [/\bWohnbereich\b/gi, 'open-concept living area'],
    [/\bWohnraum\b/gi, 'living space'],
    [/\bKüche\b/gi, 'minimalist designer kitchen'],
    [/\bKochinsel\b/gi, 'kitchen island'],
    [/\bEingangsbereich\b/gi, 'entrance foyer'],
    [/\bEingangstür\b/gi, 'front entrance door'],
    [/\bFoyer\b/gi, 'spacious foyer'],
    [/\bGarten\b/gi, 'landscaped designer garden'],
    [/\bVorgarten\b/gi, 'front yard'],
    [/\bGalerie\b/gi, 'upper gallery floor'],
    [/\bTreppe\b/gi, 'architectural staircase'],
    [/\bEichentreppe\b/gi, 'floating oak staircase'],
    [/\bBadezimmer\b/gi, 'wellness bathroom'],
    [/\bSchlafzimmer\b/gi, 'master bedroom'],
    [/\bMusterhaus\b/gi, 'modern show home residence'],
    [/\bAnwesen\b/gi, 'residential estate'],
    [/\bZuhause\b/gi, 'home'],
    [/\bGebäude\b/gi, 'architectural building'],
    [/\bHaus\b/gi, 'residence'],
    [/\bBauwerk\b/gi, 'architectural structure'],
    [/\bPhotovoltaikanlage\b/gi, 'integrated rooftop solar photovoltaic array'],
    [/\bSolardach\b/gi, 'solar photovoltaic roof'],
    [/\bWallbox\b/gi, 'EV charging wallbox'],
    [/\bPanoramafenster\b/gi, 'panoramic floor-to-ceiling glass window'],
    [/\bPanoramaverglasung\b/gi, 'floor-to-ceiling panoramic glass facade'],
    [/\bSchiebefenster\b/gi, 'sliding glass doors'],
    [/\bSchiebetür\b/gi, 'sliding glass door'],

    // Materials & Details
    [/\bHolz\b/gi, 'natural wood'],
    [/\bEichenholz\b/gi, 'natural oak wood'],
    [/\bEiche\b/gi, 'oak wood'],
    [/\bEichenparkett\b/gi, 'natural oak parquet'],
    [/\bParkettboden\b/gi, 'hardwood parquet floor'],
    [/\bNaturholzlamellen\b/gi, 'natural timber louvers'],
    [/\bHolzlamellen\b/gi, 'wooden louvers'],
    [/\bLamellen\b/gi, 'vertical louvers'],
    [/\bGlas\b/gi, 'glass'],
    [/\bIsolierglas\b/gi, 'insulated glazing'],
    [/\bDreifach-Isolierglas\b/gi, 'triple-glazed low-E insulated glass'],
    [/\bSichtbeton\b/gi, 'smooth architectural concrete'],
    [/\bNaturstein\b/gi, 'natural sandstone'],
    [/\bSandstein\b/gi, 'sandstone'],
    [/\bEdelstahl\b/gi, 'brushed stainless steel'],
    [/\bAluminium\b/gi, 'slim anodized aluminium profiles'],
    [/\bFeinputz\b/gi, 'smooth white architectural plaster'],
    [/\bLeder\b/gi, 'natural leather'],
    [/\bGranit\b/gi, 'polished granite'],
    [/\bSchlüssel\b/gi, 'architectural key fob'],
    [/\bSchlüsselbund\b/gi, 'tactile key ring'],
    [/\bExposé\b/gi, 'architectural folder'],
    [/\bBäume\b/gi, 'lush trees'],
    [/\bBäumen\b/gi, 'lush trees'],
    [/\bSträucher\b/gi, 'shrubs'],
    [/\bSträuchern\b/gi, 'shrubs'],
    [/\bWiese\b/gi, 'manicured lawn'],
    [/\bPflanzen\b/gi, 'architectural greenery'],

    // Colors & Clothing
    [/\blila Tütü\b/gi, 'vibrant purple ballet tutu dress'],
    [/\bTütü\b/gi, 'ballet tutu dress'],
    [/\blila\b/gi, 'vibrant purple'],
    [/\brosa\b/gi, 'soft pink'],
    [/\bpink\b/gi, 'bright pink'],
    [/\bgelb\b/gi, 'warm yellow'],
    [/\bblau\b/gi, 'deep blue'],
    [/\brot\b/gi, 'vibrant red'],
    [/\bKostüm\b/gi, 'costume outfit'],
    [/\bAnzug\b/gi, 'tailored suit'],
    [/\bKrawatte\b/gi, 'silk tie'],
    [/\bAnthrazit\b/gi, 'anthracite'],
    [/\bWarmes Grau\b/gi, 'warm gray'],
    [/\bGrau\b/gi, 'gray'],
    [/\bWeiß\b/gi, 'crisp white'],
    [/\bSchwarz\b/gi, 'matte black'],
    [/\bBraun\b/gi, 'warm brown'],
    [/\bCognac\b/gi, 'cognac brown'],
    [/\bSilber\b/gi, 'silver'],
    [/\bGold\b/gi, 'golden'],
    [/\bHonig\b/gi, 'golden honey'],
    [/\bGrün\b/gi, 'lush green'],
    [/\bSalbei\b/gi, 'sage green'],

    // Verbs & Actions
    [/\berkundet\b/gi, 'explores'],
    [/\berkunden\b/gi, 'explore'],
    [/\bbegrüßt\b/gi, 'welcomes'],
    [/\bführt\b/gi, 'guides'],
    [/\bberührt\b/gi, 'gently touches'],
    [/\bprüft\b/gi, 'inspects'],
    [/\bblickt\b/gi, 'gazes'],
    [/\bblicken\b/gi, 'look together'],
    [/\bschreitet\b/gi, 'walks gracefully'],
    [/\bgeht\b/gi, 'walks'],
    [/\bsteht\b/gi, 'stands'],
    [/\bstehen\b/gi, 'stand together'],
    [/\bsitzt\b/gi, 'sits'],
    [/\bhält\b/gi, 'holds firmly'],
    [/\blächelt\b/gi, 'smiles with confidence'],
    [/\bstrahlt\b/gi, 'glows warmly'],
    [/\bvermittelt\b/gi, 'radiates'],
    [/\bzeigt\b/gi, 'reveals'],
    [/\bfällt\b/gi, 'streams'],
    [/\bflutet\b/gi, 'floods'],
    [/\böffnet\b/gi, 'opens'],

    // General Words & Connectors
    [/\bGeborgenheit\b/gi, 'cozy warmth and security'],
    [/\bBeständigkeit\b/gi, 'timeless durability and permanence'],
    [/\bWerthaltigkeit\b/gi, 'enduring architectural value'],
    [/\bLebensqualität\b/gi, 'highest living quality'],
    [/\bWohlfühl\b/gi, 'wellbeing and comfort'],
    [/\bAtmosphäre\b/gi, 'cinematic atmosphere'],
    [/\bStimmung\b/gi, 'ambience'],
    [/\bRuhe\b/gi, 'peaceful serenity'],
    [/\bPräzision\b/gi, 'precision craftsmanship'],
    [/\bQualität\b/gi, 'premium quality'],
    [/\bBauherrin\b/gi, 'female client homeowner'],
    [/\bBauherr\b/gi, 'male client homeowner'],
    [/\bPartner\b/gi, 'partner'],
    [/\bGäste\b/gi, 'guests'],
    [/\bProtagonistin\b/gi, 'female protagonist'],
    [/\bProtagonist\b/gi, 'protagonist'],
    [/\bRequisite\b/gi, 'prop'],
    [/\bWasserzeichen\b/gi, 'watermark'],
    [/\brechts unten\b/gi, 'bottom-right corner'],
    [/\bDeckkraft\b/gi, 'opacity'],
    [/\btransparent\b/gi, 'transparent'],
    [/\bdezent\b/gi, 'subtle and discreet'],
    [/\bmit\b/gi, 'with'],
    [/\bund\b/gi, 'and'],
    [/\bfür\b/gi, 'for'],
    [/\bvon\b/gi, 'of'],
    [/\bauf\b/gi, 'on'],
    [/\bin\b/gi, 'in'],
    [/\bim\b/gi, 'in the'],
    [/\bins\b/gi, 'into the'],
    [/\bdas\b/gi, 'the'],
    [/\bder\b/gi, 'the'],
    [/\bdie\b/gi, 'the'],
    [/\bein\b/gi, 'a'],
    [/\beine\b/gi, 'a'],
    [/\beiner\b/gi, 'a'],
    [/\beinem\b/gi, 'a'],
    [/\beinen\b/gi, 'a'],
    [/\bohne\b/gi, 'without'],
    [/\bdurch\b/gi, 'through'],
    [/\bentlang\b/gi, 'along'],
    [/\büber\b/gi, 'over'],
    [/\bhier\b/gi, 'here'],
    [/\balle\b/gi, 'all'],
    [/\balles\b/gi, 'everything'],
    [/\bsehr\b/gi, 'very'],
    [/\bnatürlich\b/gi, 'natural'],
    [/\bhochwertig\b/gi, 'high-end premium'],
    [/\bmodern\b/gi, 'modern'],
    [/\bästhetisch\b/gi, 'aesthetic'],
    [/\belegant\b/gi, 'elegant'],
    [/\bzeitlos\b/gi, 'timeless'],
    [/\bharmonisch\b/gi, 'harmonic'],
  ];

  for (const [regex, rep] of vocabReplacements) {
    res = res.replace(regex, rep);
  }

  // 3. Cleanup formatting, duplicate spaces, hanging German commas/periods
  res = res
    .replace(/\s+/g, ' ')
    .replace(/\s,\s/g, ', ')
    .replace(/\s\.\s/g, '. ')
    .replace(/,\s*,/g, ',')
    .replace(/\.\s*\./g, '.')
    .trim();

  return res || fallback;
}

export interface MaestroBindingSlot {
  slotIndex: number;
  category: ScreenplayReferenceCategory;
  promptTag: string; // e.g. "<Subject 1>", "<Building 1>", "<Object 1>", "<Logo 1>"
  maestroLabel: string; // e.g. "@Subject1_Anna_Bauherrin", "@Building1_Musterhaus_Avantgarde"
  referenceName: string;
  roleOrAction: string;
  roleOrActionEn?: string;
  relationship: string;
  localFile?: string;
  distinguishingMarks?: string;
  photoUrl?: string;
}

function cleanMaestroAnchorName(rawName: string, fallback: string): string {
  if (!rawName) return fallback;
  let clean = rawName.replace(/\.(png|jpg|jpeg|webp|svg|gif)$/i, '').trim();
  // If it's a raw UUID like "05d6ed5c-b891-40d8-8519-69170ee06e51" or raw WhatsApp filename without custom name
  if (/^[0-9a-f]{8}[\s_-][0-9a-f]{4}/i.test(clean) || /^[0-9a-f]{16,}/i.test(clean) || /^whatsapp\s*image/i.test(clean)) {
    return fallback;
  }
  clean = clean.replace(/[^a-zA-Z0-9_]/g, '');
  if (clean.length > 20) clean = clean.substring(0, 20);
  return clean || fallback;
}

/**
 * Derives the exact Maestro 2.1.6 binding slots for reference configuration.
 */
export function getMaestro216Bindings(references: ConfigReference[]): MaestroBindingSlot[] {
  return (references || []).map((ref, idx) => {
    const slotIdx = idx + 1;
    const cat = ref.category || 'human';
    const fallback = cat === 'human' ? `Subject${slotIdx}` : cat === 'building' ? 'Musterhaus' : cat === 'logo' ? 'Wasserzeichen' : 'Requisite';
    const cleanName = cleanMaestroAnchorName(ref.name || '', fallback);
    let tag = ref.tag || `<Subject ${slotIdx}>`;
    let maestroLabel = `@Subject${slotIdx}_${cleanName}`;

    if (cat === 'building') {
      tag = `<Building ${ref.referenceIndex || slotIdx}>`;
      maestroLabel = `@Building${ref.referenceIndex || slotIdx}_${cleanName}`;
    } else if (cat === 'object') {
      tag = `<Object ${ref.referenceIndex || slotIdx}>`;
      maestroLabel = `@Object${ref.referenceIndex || slotIdx}_${cleanName}`;
    } else if (cat === 'logo') {
      tag = `<Logo ${ref.referenceIndex || 1}>`;
      maestroLabel = `@Logo${ref.referenceIndex || 1}_Wasserzeichen_BottomRight`;
    }

    return {
      slotIndex: slotIdx,
      category: cat,
      promptTag: tag,
      maestroLabel,
      referenceName: ref.name || `Referenz ${slotIdx}`,
      roleOrAction: ref.roleOrAction || 'Handlungsträger',
      roleOrActionEn: ref.roleOrActionEn || toEnglishCinematicText(ref.roleOrAction),
      relationship: ref.relationship || 'Kernmotiv',
      localFile: ref.localFile,
      distinguishingMarks: ref.distinguishingMarks,
      photoUrl: ref.photoUrl,
    };
  });
}

/**
 * Builds the cheat-sheet text for pasting into Maestro 2.1.6.
 */
export function generateMaestroSlotsMappingText(references: ConfigReference[], projectTitle?: string): string {
  const bindings = getMaestro216Bindings(references);
  let txt = `========================================================================\n`;
  txt += `MAESTRO 2.1.6 REFERENCE BINDING MATRIX: ${projectTitle || 'Drehbuch Projekt'}\n`;
  txt += `Generiert am: ${new Date().toLocaleString('de-DE')}\n`;
  txt += `========================================================================\n\n`;

  bindings.forEach((b) => {
    txt += `[MAESTRO 2.1.6 SLOT ${b.slotIndex}] (${b.category.toUpperCase()})\n`;
    txt += `• MAESTRO LABEL / NAME : ${b.maestroLabel}\n`;
    txt += `• PROMPT BINDING TAG   : ${b.promptTag}\n`;
    txt += `• ELEMENT-NAME         : ${b.referenceName}\n`;
    txt += `• ROLLE & AKTION (DE)  : ${b.roleOrAction}\n`;
    if (b.roleOrActionEn) {
      txt += `• PROMPT ACTION (EN)   : ${b.roleOrActionEn}\n`;
    }
    txt += `• BEZIEHUNG/KONTEXT    : ${b.relationship}\n`;
    if (b.category === 'logo') {
      txt += `• WASSERZEICHEN-REGEL  : IMMER rechts unten, dezent & transparent (25% Opacity)\n`;
    }
    txt += `\n`;
  });

  return txt;
}

/**
 * Transforms standard WindowConfig list into the strict Single-Line Windows format
 */
export function pressConfigToSingleLineWindows(params: {
  windows: WindowConfig[];
  allSubjects: ConfigReference[];
  windowDurationSeconds?: number;
  dialogueLanguage?: DialogueLanguage;
  actionCode?: string;
  aspectRatio?: '16:9' | '9:16' | '2.39:1';
  globalWeather?: string;
  globalBackground?: string;
  finalCallToAction?: string;
  targetAudience?: TargetAudience;
  typographyOverlay?: TypographyOverlayConfig;
  voiceModulation?: VoiceModulationConfig;
  astroCinemaLoraMode?: boolean;
  astroCinemaLoraKeywords?: boolean;
  visualStyle?: string;
  analogLaborStörung?: string;
  analogMacroRecipe?: string;
}): SingleLineWindow[] {
  const {
    windows,
    allSubjects,
    windowDurationSeconds = 14,
    dialogueLanguage = 'German',
    actionCode = 'ASTROCINEMAV01K2T',
    aspectRatio = '16:9',
    globalWeather,
    globalBackground,
    finalCallToAction,
    targetAudience,
    typographyOverlay,
    voiceModulation,
    astroCinemaLoraMode = true,
    astroCinemaLoraKeywords = true,
    visualStyle = 'natural',
    analogLaborStörung,
    analogMacroRecipe,
  } = params;

  const totalWindows = windows.length;
  const activeRefs = allSubjects.filter((r) => r.isActiveInProject !== false);

  return windows.map((win, idx) => {
    const isLast = idx === totalWindows - 1;
    const cta = isLast ? (finalCallToAction || win.claim) : win.claim;

    // Filter active subjects based on window config or default to project-active
    let activeSubjs: ConfigReference[] = [];
    if (win.activeSubjectIndices && win.activeSubjectIndices.length > 0) {
      activeSubjs = allSubjects.filter((s) => win.activeSubjectIndices?.includes(s.referenceIndex));
    }
    if (activeSubjs.length === 0) {
      activeSubjs = activeRefs.length > 0 ? activeRefs : allSubjects.slice(0, 3);
    }

    const firstHuman = activeSubjs.find((r) => r.category === 'human') || activeSubjs[0];

    return buildSingleLineWindowPrompt({
      windowNumber: win.windowNumber,
      totalWindows,
      durationSeconds: win.durationSeconds || windowDurationSeconds,
      actionCode,
      aspectRatio,
      weather: win.weather || globalWeather,
      background: win.background || globalBackground,
      cameraMovement: win.cameraMovement,
      visualFocus: win.visualFocus,
      soundDesign: win.soundDesign,
      musicStyle: win.musicStyle,
      dialogueLanguage,
      dialogueSpeaker: win.dialogueSpeaker || firstHuman?.name,
      dialogueText: win.dialogueText,
      claimOrCta: cta,
      isLastWindow: isLast,
      activeSubjects: activeSubjs,
      allSubjects,
      narrativeAction: `${win.title}: Kamera führt ${win.cameraMovement} aus. Fokus auf ${win.visualFocus}.`,
      targetAudience,
      typographyOverlay,
      voiceModulation,
      astroCinemaLoraMode,
      astroCinemaLoraKeywords,
      visualStyle,
      analogLaborStörung,
      analogMacroRecipe,
    });
  });
}

export interface GermanPromptBreakdown {
  titel: string;
  zeitspanne: string;
  szenenHandlung: string;
  kamerafuehrung: string;
  aktiveReferenzen: string[];
  dialogueGerman?: string;
  closeupsGerman: string[];
  musikUndSound: string;
  callToActionGerman?: string;
  hinweis: string;
}

/**
 * Translates and breaks down a dense technical single-line window prompt into clear, human-understandable German.
 */
export function translateWindowPromptToGerman(win: SingleLineWindow): GermanPromptBreakdown {
  const p = win.singleLinePrompt || '';

  // Extract Action description
  let handlung = win.summary || 'Szene wird aufgebaut und abgebildet.';
  if (win.title && !win.title.startsWith('Window')) {
    handlung = `${win.title}: ${handlung}`;
  }

  // Extract dialogue
  let dialogueGerman = win.dialogueSnippet;
  if (!dialogueGerman && p.includes('<d[')) {
    const dMatch = p.match(/<d\[([^\]]+)\]\[([^\]]+)\]>\s*([^<]+)\s*<\/d>/i);
    if (dMatch) {
      dialogueGerman = `${dMatch[1]} spricht auf ${dMatch[2]}: „${dMatch[3].trim()}“`;
    }
  }

  // Camera movement
  const kamera = win.cameraMove || 'Flüssige, professionelle Kamerabewegung auf Augenhöhe mit Kino-Schärfentiefe';

  // Active references
  const refs = win.activeReferences && win.activeReferences.length > 0
    ? win.activeReferences
    : win.activeSubjects || [];

  // Macro closeups
  const closeups = win.extremeCloseups && win.extremeCloseups.length > 0
    ? win.extremeCloseups.map(c => c.replace(/^EXTREME CLOSE-UP, 100mm macro, T1.8\s*–?\s*/i, 'Extreme Nahaufnahme (100mm Makro): '))
    : ['Detailaufnahme von Material und Haptik'];

  // Music & Sound
  const musikUndSound = win.musicAudio || 'Warme Akustik-Atmosphäre ohne störende Nebengeräusche';

  // CTA
  const callToActionGerman = win.claimOrCta;

  return {
    titel: `Window ${win.windowNumber}`,
    zeitspanne: `Sekunde ${win.timecodeStart} bis ${win.timecodeEnd} (${win.durationSeconds} Sek. Gesamtdauer)`,
    szenenHandlung: handlung,
    kamerafuehrung: kamera,
    aktiveReferenzen: refs,
    dialogueGerman,
    closeupsGerman: closeups,
    musikUndSound,
    callToActionGerman,
    hinweis: 'Dieser Prompt ist technisch im Single-Line Format (0 Zeilenumbrüche) für MiniMax H3 / Maestro optimiert.',
  };
}

