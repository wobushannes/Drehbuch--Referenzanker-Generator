import { PromptTemplate, ReferenceCategory } from '../types';

export const INITIAL_PROMPT_CATALOG: PromptTemplate[] = [
  {
    id: 'single-person-anchor',
    title: 'Einzelperson: Physiognomie & Identitätsanker',
    category: 'person',
    badge: 'Standard Person',
    description: 'Exakte Extraktion aller Gesichts- und Körpermerkmale für MiniMax H3 / Maestro zur Vermeidung von Gesichtsmutationen.',
    keywords: ['Gesichtsform', 'Augen', 'Nase', 'Mund', 'Haare', 'Teint', 'Brille', 'Muttermal'],
    prompt: `Analysiere dieses Referenzbild der Person. Extrahiere genau diese Merkmale, in Stichpunkten, auf Deutsch:
- Name / Rolle der Person (falls erkennbar oder aus Kontext)
- Gesichtsform (rund, oval, eckig, schmal, breit)
- Augenfarbe (exakt)
- Augenform (rund, mandelförmig, schmal, groß, klein)
- Augenbrauen (dick, dünn, dunkel, hell, geschwungen, gerade)
- Nase (schmal, breit, gerade, Stupsnase, lang, kurz)
- Mund / Lippen (voll, schmal, Lippenform, Amorbogen)
- Kiefer / Kinn (kantig, weich, rund, spitz, markant)
- Hautfarbe / Teint (hell, gebräunt, oliv, Sommersprossen)
- Haarfarbe (exakt: schwarz, dunkelbraun, mittelbraun, hellbraun, blond, rot)
- Haarlänge (kurz, schulterlang, lang, sehr lang)
- Haarstruktur (glatt, wellig, lockig, kraus)
- Pony (ja / nein, wenn ja: welche Form)
- Besondere Merkmale (Muttermal, Narbe, Brille, Ohrringe, Zahnlücke, Sommersprossen, Tattoo, Piercing)
- Alter ca.
- Körperbau (schlank, sportlich, kurvig, zierlich, kräftig)
- Kleidung & Stil (Farbe, Schnitt, Material)

Gib am Ende einen kompakten "PROMPT-ANKER" (1-2 englische Sätze) aus, der als permanenter visueller Anker in MiniMax H3 / Maestro Videoprompts kopiert werden kann. Keine Interpretation, nur sichtbare Fakten.`,
  },
  {
    id: 'person-with-dogs',
    title: 'Person mit 2 Hunden / Begleitern (Multi-Entität)',
    category: 'multi_subject',
    badge: 'Multi-Entität (Person + 2 Hunde)',
    description: 'Spezifisch für Bilder mit einer Person und zwei Hunden (oder Haustieren). Trennt Person, Hund 1 und Hund 2 sauber auf.',
    keywords: ['Person', 'Hund 1', 'Hund 2', 'Rasse', 'Fell', 'Größe', 'Interaktion'],
    prompt: `Analysiere dieses Referenzbild (Person mit 2 Hunden / Haustieren).
Trenne die Analyse strikt in DREI Listen plus räumliche Relation:

LISTE 1: PERSON (HAUPTSUBJEKT)
- Name / Identifikator
- Gesichtsform & Teint
- Augen & Augenbrauen
- Haare (Farbe, Länge, Schnitt)
- Besondere Merkmale (Brille, Schmuck, Muttermale)
- Alter ca. & Körperbau
- Kleidung (Jacke, Hose, Schuhe)

LISTE 2: HUND 1 (z.B. linker Hund oder Primärhund)
- Erkennbare Rasse / Mischung (z.B. Schäferhund, Golden Retriever, Dobermann, Terrier)
- Fellfarbe & Muster (z.B. schwarz-braun, gestromt, uni-weiß, Flecken)
- Felllänge & Textur (kurzhaarig, zottelig, glänzend, dicht)
- Statur & Größe (groß, mittel, klein, muskulös, schlank)
- Kopf- & Ohrenform (Stehohren, Hängeohren, Schnauzenlänge)
- Zubehör (Halsband, Geschirr, Leinenfarbe)

LISTE 3: HUND 2 (z.B. rechter Hund oder Sekundärhund)
- Erkennbare Rasse / Mischung
- Fellfarbe & Muster (deutlicher Kontrast zu Hund 1)
- Felllänge & Textur
- Statur & Größe (im Vergleich zu Hund 1)
- Kopf- & Ohrenform
- Zubehör (Halsband, Geschirr)

RÄUMLICHE RELATION & INTERAKTION:
- Positionierung (wer steht/sitzt links, rechts, vordergründig)
- Haltung der Person (an der Leine, Hand auf dem Kopf, stehend, hockend)
- Blickrichtungen aller 3 Subjekte

Gib am Ende einen kompakten englischen "MULTI-ENTITY PROMPT-ANKER" aus, der Person, Hund 1 und Hund 2 für MiniMax H3 / Maestro eindeutig formuliert, damit kein Tier morpht oder verschwindet.`,
  },
  {
    id: 'object-prop-anchor',
    title: 'Gegenstand / Requisite (Prop-Anker)',
    category: 'object',
    badge: 'Requisite / Objekt',
    description: 'Exakte Material-, Form- und Texturanalyse für Requisiten (z.B. Waffe, Koffer, Amulett, Uhr, Buch, Flasche).',
    keywords: ['Material', 'Form', 'Patina', 'Gravur', 'Größe', 'Oberfläche'],
    prompt: `Analysiere diesen Gegenstand / diese Requisite (Prop) als visuellen Anker für Videoproduktionen:
- Gegenstandsart & Funktion (z.B. antikes Lederbuch, chromfarbener Revolver, silbernes Amulett)
- Geometrische Form & Proportionen (Maße im Verhältnis zu einer Menschenhand)
- Hauptmaterial (Messing, gebürsteter Stahl, dunkles Mahagoniholz, abgewetztes Leder, Glas)
- Oberflächentextur & Zustand (glänzend, matt, verkratzt, Patina, Fingerabdrücke, Rost, poliert)
- Farbgebung & Reflexionsverhalten (Primärfarbe, Akzente, Glanzpunkte)
- Besondere Kennzeichen (Gravuren, Symbole, Nähte, Schrauben, Beschläge, Schalter, leuchtende Elemente)
- Typische Handhabung (wird in der Hand gehalten, am Gürtel getragen, auf dem Tisch stehend)

Gib am Ende einen kompakten englischen "PROP PROMPT-ANKER" für MiniMax H3 aus, der das Objekt fotorealistisch und konsistent in jede Szene einbettet.`,
  },
  {
    id: 'vehicle-tech-anchor',
    title: 'Fahrzeug / Maschine / Tech-Objekt',
    category: 'vehicle',
    badge: 'Fahrzeug & Tech',
    description: 'Analyse von Autos, Motorrädern, Drohnen oder futuristischer Technologie für Szenenkonsistenz.',
    keywords: ['Fahrzeugtyp', 'Karosserie', 'Lackfarbe', 'Scheinwerfer', 'Felgen', 'Zustand'],
    prompt: `Analysiere dieses Fahrzeug oder Tech-Objekt als visuellen Konsistenz-Anker:
- Typ & Modellkategorie (z.B. 1970er Muscle Car, futuristisches Drohnensystem, klassisches Motorrad)
- Karosserieform & Silhouette (kantig, aerodynamisch, bullig, kompakt)
- Lackierung & Farbe (Metallic, Matt, Zweifarbig, Verwitterung)
- Front & Scheinwerfer-Signatur (runde Lichter, LED-Band, Kühlergrill)
- Felgen, Reifen & mechanische Details
- Verschleiß & Patina (Schlammspritzer, Dellen, fabrikneu poliert)
- Innenraum / Cockpit-Sichtbarkeit (falls im Bild)

Gib am Ende einen englischen "VEHICLE PROMPT-ANKER" für MiniMax H3 / Maestro aus.`,
  },
  {
    id: 'environment-location-anchor',
    title: 'Umgebung / Location & Raum (Set-Anker)',
    category: 'environment',
    badge: 'Location & Set',
    description: 'Extraktion von architektonischen Merkmalen, Wandbeschaffenheiten, Requisiten und Lichtarchitektur.',
    keywords: ['Architektur', 'Wände', 'Boden', 'Lichtquellen', 'Möbel', 'Atmosphäre'],
    prompt: `Analysiere diesen Raum / diese Location als szenischen Hintergrund-Anker:
- Location-Typ (z.B. verlassenes Industrielager, viktorianisches Arbeitszimmer, verregnete Neon-Seitengasse)
- Architektonische Elemente (Deckenhöhe, Säulen, Fensterart, Treppen)
- Wand- & Bodenmaterial (Backstein, feuchter Asphalt, Fischgrätparkett, Beton)
- Requisiten & Set-Dressing im Raum (welche Möbel, Lampen, Gegenstände stehen wo)
- Lichtarchitektur & Primärlichtquellen (Sonnenstrahlen durch Fenster, Deckenpendelleuchte, Neonschein)
- Farbtemperatur & Atmosphäre (kaltblau, warmes Bernstein, düster-diffus)

Gib am Ende einen prägnanten englischen "ENVIRONMENT PROMPT-ANKER" für MiniMax H3 aus.`,
  },
  {
    id: 'duo-two-persons',
    title: 'Zwei Personen (Duo / Gegenüberstellung)',
    category: 'multi_subject',
    badge: 'Zwei Personen',
    description: 'Für Referenzbilder mit zwei Charakteren. Trennt beide Personen strikt voneinander ab.',
    keywords: ['Person 1', 'Person 2', 'Größenverhältnis', 'Kontrast', 'Interaktion'],
    prompt: `Analysiere dieses Referenzbild mit ZWEI Personen.
Erstelle zwei klar getrennte Listen (Person 1 links/vorne, Person 2 rechts/hinten):

Für jede Person getrennt:
- Name / Identifikator
- Gesichtsform, Teint, Augen
- Haare (Farbe, Schnitt, Länge)
- Kleidung & Stil
- Besondere Merkmale (Brille, Narben, Schmuck)
- Statur & sichtbares Alter

ZUSÄTZLICH:
- Größen- und Proportionsverhältnis zueinander
- Räumliche Beziehung und Interaktionshaltung

Gib am Ende zwei getrennte englische Prompt-Anker aus.`,
  },
  {
    id: 'style-aesthetic-anchor',
    title: 'Stil, Optik & Film-Look (Grading-Anker)',
    category: 'style',
    badge: 'Stil & Look',
    description: 'Definiert den visuellen Stil, Körnung, Optik und Farbstimmung für das gesamte Projekt.',
    keywords: ['35mm', 'Filmkorn', 'Color Grading', 'Kontrast', 'Linse', 'Bokeh'],
    prompt: `Analysiere den visuellen Stil, die Kameraoptik und das Color Grading dieses Bildes:
- Film-Look & Ästhetik (z.B. 35mm Vintage Noir, 16mm Indie-Korn, 70mm IMAX-Schärfe, Neo-Noir)
- Farbpalette & Dominanz (Entsättigt, Teal-and-Orange, warme Erdtöne, monochrome Schatten)
- Kontrast & Beleuchtungscharakter (High-Key, Low-Key, Chiaroscuro, starkes Kantenlicht)
- Objektivcharakteristik (Weitwinkel, Tele-Bokeh, anamorphotische Reflexionen, sanfte Vignette)

Gib einen englischen "CINEMATIC STYLE ANCHOR" für MiniMax H3 aus.`,
  },
  {
    id: 'costume-wardrobe-anchor',
    title: 'Kostüm, Kleidung & Stoff-Textur',
    category: 'person',
    badge: 'Kleidung & Textur',
    description: 'Fokussiert auf Kleidungsdetails, Stoffe, Schnitt, Abnutzung und Accessoires der Figur.',
    keywords: ['Kostüm', 'Kleidung', 'Stoff', 'Schnitt', 'Leder', 'Accessoires'],
    prompt: `Analysiere ausschließlich das Kostüm und die Kleidung dieser Figur für MiniMax H3:
- Oberbekleidung (Art, Schnitt, Material: Leder, Wolle, Seide, Denim)
- Farbton & Muster (Farbcodes, Karomuster, verwaschen, gebleicht)
- Zustand & Abnutzung (neu, abgewetzt, Schmutzflecken, Risse, Faltenwurf)
- Accessoires (Gürtel, Schal, Handschuhe, Schmuck, Knöpfe, Reißverschlüsse)
- Beinkleid & Schuhe (falls sichtbar)

Gib am Ende einen englischen "WARDROBE PROMPT-ANKER" für MiniMax H3 aus.`,
  },
  {
    id: 'weapon-tactical-anchor',
    title: 'Waffe & Taktische Ausrüstung',
    category: 'object',
    badge: 'Waffe & Taktik',
    description: 'Präzise Erfassung von Waffen, Klingen, Holstern und taktischer Ausrüstung.',
    keywords: ['Waffe', 'Kaliber', 'Metall', 'Griffstück', 'Holster', 'Optik'],
    prompt: `Analysiere diese Waffe oder taktische Ausrüstung als Requisiten-Anker:
- Typ & Modellbezeichnung (z.B. Polymer-Pistole, Jagdmesser, Scharfschützengewehr)
- Material & Finish (mattschwarz beschichtet, polierter Stahl, Holzgriffschalen)
- Anbauteile & Optik (Zielfernrohr, Schalldämpfer, Taschenlampe, Lasermodul)
- Gebrauchsspuren & Gravuren (Kratzer an Kanten, Seriennummer, Abnutzung am Schlitten)
- Handhabungspose & Positionierung

Gib am Ende einen präzisen englischen "TACTICAL WEAPON ANCHOR" für MiniMax H3 aus.`,
  },
  {
    id: 'floorplan-apartment-anchor',
    title: 'Wohnungs-Grundriss: Raumaufteilung & Kamerafahrt-Achsen',
    category: 'floorplan',
    badge: 'Grundriss & Raumplan',
    description: 'Extrahiert Raumaufteilung, Flurachsen, Fenster/Lichtachsen, Wandverläufe und empfohlene Kameraflug-Pfade aus 2D/3D-Wohnungsgrundrissen.',
    keywords: ['Grundriss', 'Wohnung', 'Raumaufteilung', 'Fensterachsen', 'Kameraflug', 'Offenes Wohnen', 'Architektur'],
    prompt: `Analysiere diesen Wohnungsgrundriss als exakten räumlichen Anker für Video-Kamerafahrten und fotorealistische Raumübergänge (MiniMax H3 / Maestro):
- Wohnungsgröße & Typ (z.B. 3-Zimmer-Wohnung, offenes Loft, Maisonette, Penthouse)
- Raumaufteilung & Zonen (Eingang/Flur, offener Wohn-/Essbereich, Master-Bedroom, Kinder-/Arbeitszimmer, Badezimmer, Balkon/Loggia)
- Fensterfronten & Lichtachsen (Haupteinfallstor des Tageslichts, Ausrichtung, bodentiefe Verglasung)
- Wandverläufe & Raumfluss (offenes Raumkonzept vs. geschlossener Flurtrakt, Schiebetüren, Durchgänge)
- Vorgesehene Möblierung & Key-Positionen (Kücheninsel-Platzierung, Esstisch, Sofalandschaft, Bett)
- Bodenbeläge & Materialhinweise (soweit lesbar: Eichenparkett, großformatige Fliesen, Sichtbeton)
- Logische Kameraflug-Achse (Empfehlung für Steadicam/FPV-Walkthrough: z.B. Eingangstür -> Flur -> Öffnung in lichtdurchfluteten Wohnbereich -> Schwenk zur Terrasse)

Gib am Ende einen prägnanten englischen "FLOORPLAN ARCHITECTURE ANCHOR" für MiniMax H3 / Maestro aus, der den räumlichen Fluss und die exakten Proportionen fixiert.`,
  },
  {
    id: 'prefab-house-exterior',
    title: 'Fertighaus-Visualisierung: Fassade, Kubatur & Außenanlagen',
    category: 'architecture',
    badge: 'Fertighaus Exterior',
    description: 'Analysiert 3D-Renderings von Fertigteilhäusern: Baustil, Holzlamellen/Putz-Fassaden, Dachform, Fensterbänder, Carport & Drohnen-Überflug.',
    keywords: ['Fertighaus', 'Fassade', 'Holzlamellen', 'Kubatur', 'Flachdach', 'Drohnenflug', 'Außenanlagen', 'Render'],
    prompt: `Analysiere diese Visualisierung / dieses 3D-Rendering des Fertigteilhauses als visuellen Architektur-Anker:
- Haustyp & Baustil (z.B. modernes Bauhaus-Flachdach, skandinavisches Holzhaus mit Satteldach, kubische Stadtvilla, Pultdach-Bungalow)
- Kubatur & Baukörper (Zweigeschossig, L-Form, Erker, auskragendes Obergeschoss, Doppelhaushälfte)
- Fassadenmaterial & Texturen (z.B. weiße Glattputz-Fassade kombiniert mit warmen Lärchenholz-Lamellen, Anthrazit-Faserzementplatten)
- Dachform & Eindeckung (Satteldach mit anthrazitfarbenen Ziegeln, Flachdach mit Attika/Begrünung, integrierte PV-Module)
- Fensterarchitektur (bodentiefe Hebeschiebe-Türen, anthrazitfarbene Aluminiumrahmen, schmale Lichtbänder)
- Außenanlagen & Setting (Holzterrasse, Poolbereich, moderner Steingarten, Carport/Garage, Pflasterung, Rasenfläche)
- Beleuchtungskonzept & Atmosphäre (Fassaden-Up-Downlights, indirekte Terrassenbeleuchtung, Abendstimmung / goldene Stunde)
- Drohnen-Perspektive (Empfehlung für Drohnenüberflug: z.B. Weitwinkel Orbit-Shot, fly-in auf Eingangsbereich)

Gib am Ende einen englischen "PREFAB HOME ARCHITECTURAL ANCHOR" für MiniMax H3 / Maestro aus, der Baukörper, Material und Licht fotorealistisch fixiert.`,
  },
  {
    id: 'prefab-house-interior',
    title: 'Fertighaus-Innenraum: Licht, Holz & offene Wohnkonzepte',
    category: 'architecture',
    badge: 'Interieur & Visualisierung',
    description: 'Für gerenderte Innenraum-Perspektiven von Musterhäusern / Fertighäusern: Holztreppen, Galerie, Luftraum, Deckenhöhe, Fußböden und Möbeldesign.',
    keywords: ['Innenraum', 'Galerie', 'Fertighaus', 'Eichenholz', 'Glasgeländer', 'Panoramafenster'],
    prompt: `Analysiere diesen visualisierten Innenraum des Fertighauses / Musterhauses:
- Raumeindruck & Deckenhöhe (Luftraum/Galerie, Sichtdachstuhl, standard 2.70m Raumhöhe)
- Leitmaterialien & Farbwelt (Helles Eichenholz, Sichtbetonwand, matte weiße Wände, schwarze Metallakzente)
- Treppenarchitektur & Geländer (Freitragende Holzstufen, Glasgeländer, Wangentreppe)
- Fenster- & Lichteinfall (Großflächige Panoramascheiben, Lichteinfallswinkel, Verbindung zu Garten/Terrasse)
- Ausstattungsdetails (Kaminofen, Einbauküche mit Kochinsel, Design-Pendelleuchten)
- Kamera-Führung (Gleitender Steadicam-Schwenk auf Augenhöhe durch den Raum)

Gib am Ende einen englischen "INTERIOR ARCHITECTURE ANCHOR" für MiniMax H3 / Maestro aus.`,
  },
];

// Helper functions for persistent storage in localStorage / data layer
export const INITIAL_PROMPT_CATALOG_DE: PromptTemplate[] = INITIAL_PROMPT_CATALOG;

export const INITIAL_PROMPT_CATALOG_EN: PromptTemplate[] = [
  {
    id: 'single-person-anchor',
    title: 'Single Person: Physiognomy & Identity Anchor',
    category: 'person',
    badge: 'Standard Person',
    description: 'Exact extraction of facial and body features for MiniMax H3 / Maestro to prevent facial morphing and clone artifacts.',
    keywords: ['Facial shape', 'Eyes', 'Nose', 'Mouth', 'Hair', 'Complexion', 'Glasses', 'Distinctive marks'],
    prompt: `Analyze this reference image of the person. Extract precisely these features in clear bullet points in English:
- Full Name / Role in scene (if discernible or from context)
- Facial shape (round, oval, square, narrow, broad, sharp)
- Eye color (exact tint)
- Eye shape (almond, wide, hooded, deep-set, prominent)
- Eyebrows (thick, trimmed, dark, light, arched, straight)
- Nose (slender, wide, straight, button, aquiline)
- Lips & Mouth (full, thin, cupid's bow shape)
- Jawline & Chin (defined, soft, square, pointed, chiseled)
- Complexion / Skin tone (fair, warm ivory, olive, tan, freckles)
- Hair color (exact: jet black, dark brown, medium brown, blonde, auburn, silver)
- Hair length & styling (short crop, shoulder-length, long, swept back, textured)
- Hair texture (straight, wavy, curly, coiled)
- Bangs / Fringe (yes/no, specific cut)
- Distinctive features (moles, beauty marks, scars, glasses, piercings, dimples)
- Approximate visible age
- Body build & posture (athletic, slender, curvier, stocky, tall)
- Wardrobe style & materials (color, tailored cut, fabric weave)

Conclude with a compact "PROMPT-ANCHOR" (1-2 English sentences) that can be permanently copied into MiniMax H3 / Maestro video prompts as a visual consistency anchor. Visible facts only, zero speculation.`,
  },
  {
    id: 'person-with-dogs',
    title: 'Person with 2 Dogs / Companions (Multi-Entity)',
    category: 'multi_subject',
    badge: 'Multi-Entity (Person + 2 Dogs)',
    description: 'Specialized for reference images containing one person and two animals or companions. Strictly separates subjects to prevent merging.',
    keywords: ['Person', 'Dog 1', 'Dog 2', 'Breed', 'Fur', 'Size', 'Spatial relation'],
    prompt: `Analyze this reference image containing a person with two dogs / companion pets.
Strictly separate the analysis into THREE discrete lists plus spatial relationships:

LIST 1: PRIMARY PERSON
- Name / Identifier tag
- Facial features & complexion
- Hair color, cut & styling
- Distinctive features (eyewear, accessories, scars)
- Body build & estimated age
- Outerwear & shoes (jacket material, pants color)

LIST 2: DOG 1 (e.g., left or primary dog)
- Discernible breed / mix (e.g. German Shepherd, Golden Retriever, Terrier)
- Fur coloration & pattern (tricolor, brindle, solid, patches)
- Coat length & texture (short-haired, plush, curly, sleek)
- Build & scale relative to the person (large, medium, muscular, slender)
- Head, muzzle & ear shape (erect ears, floppy ears, long snout)
- Collars or harness gear

LIST 3: DOG 2 (e.g., right or secondary dog)
- Discernible breed / mix
- Fur coloration & distinct markings contrasting with Dog 1
- Coat texture & grooming
- Size & physical silhouette
- Gear & collar details

SPATIAL RELATION & INTERACTION:
- Relative positioning (who is on screen-left, screen-right, foreground)
- Person's interaction (holding leash, petting head, walking beside)
- Gaze direction of all three entities

End with a compact English "MULTI-ENTITY PROMPT ANCHOR" explicitly locking Subject 1, Dog 1, and Dog 2 for MiniMax H3 / Maestro so no subject morphs or vanishes.`,
  },
  {
    id: 'object-prop-anchor',
    title: 'Item / Prop / Equipment Anchor',
    category: 'object',
    badge: 'Prop / Object',
    description: 'Exact material, geometry, wear, and surface reflections for key scene props (e.g., camera, watch, key, jewel, bottle).',
    keywords: ['Material', 'Geometry', 'Patina', 'Engraving', 'Scale', 'Reflections'],
    prompt: `Analyze this object / prop as a visual anchor for cinematic video production:
- Item classification & purpose (e.g., vintage leather notebook, chrome fountain pen, analog rangefinder camera)
- Geometric silhouette & scale relative to a human hand
- Primary materials (brushed steel, milled aluminum, solid walnut, weathered leather, optical glass)
- Surface finish & condition (mirror polish, matte powder-coat, micro-scratches, patina, fingerprints)
- Color spectrum & reflectivity (primary tone, specular highlights, accents)
- Distinctive markings (engravings, brand badges, screw types, mechanical dials, LED indicators)
- Typical ergonomic interaction (held in hand, resting on table, worn on belt)

Conclude with a compact English "PROP PROMPT ANCHOR" for MiniMax H3 ensuring photorealistic, consistent continuity across all shots.`,
  },
  {
    id: 'vehicle-tech-anchor',
    title: 'Vehicle / Machine / Tech Hardware',
    category: 'vehicle',
    badge: 'Vehicle & Tech',
    description: 'In-depth analysis of cars, motorcycles, drones, or futuristic gear for unbroken shot continuity.',
    keywords: ['Vehicle type', 'Chassis', 'Paint finish', 'Headlights', 'Rims', 'Condition'],
    prompt: `Analyze this vehicle or tech hardware as a visual consistency anchor:
- Vehicle category & styling heritage (e.g., 1970s classic coupe, carbon-fiber cinema drone, bespoke motorcycle)
- Bodywork geometry & silhouette (muscular, angular, aerodynamic, compact)
- Paint finish & livery (metallic flake, matte satin, dual-tone, weathered edge)
- Front fascia & lighting signature (round projector lamps, continuous LED lightbar, grille mesh)
- Wheels, tires & mechanical details (alloy wheel design, disc brakes, suspension)
- Wear & patina (road dust, water droplets, factory-fresh polish)
- Visible cabin / cockpit cues if framed

Conclude with an English "VEHICLE PROMPT ANCHOR" for MiniMax H3 / Maestro.`,
  },
  {
    id: 'environment-location-anchor',
    title: 'Environment / Location & Architectural Set',
    category: 'environment',
    badge: 'Location & Set',
    description: 'Extraction of architectural elements, wall materials, lighting design, and atmospheric volume.',
    keywords: ['Architecture', 'Walls', 'Flooring', 'Light sources', 'Furnishings', 'Atmosphere'],
    prompt: `Analyze this room / location as a cinematic background anchor:
- Location classification (e.g., minimalist concrete villa, warm timber library, industrial loft studio)
- Architectural elements (ceiling height, structural pillars, floor-to-ceiling glass, floating stairs)
- Wall & floor finishes (fair-faced concrete, herringbone oak parquet, hand-applied lime plaster)
- Set dressing & furnishings (designer lounge chairs, monolithic marble islands, pendant luminaires)
- Natural & artificial lighting paths (raking morning sunbeam, warm ceiling recessed LEDs, diffuse skylight)
- Color temperature & atmospheric mood (warm 2700K ambient, neutral 5500K daylight, soft volumetric haze)

Conclude with a punchy English "ENVIRONMENT PROMPT ANCHOR" for MiniMax H3.`,
  },
  {
    id: 'duo-two-persons',
    title: 'Two Persons (Duo / Counterpart)',
    category: 'multi_subject',
    badge: 'Two Persons',
    description: 'For reference images with two distinct human characters. Rigorously isolates each character to prevent visual cross-bleeding.',
    keywords: ['Person 1', 'Person 2', 'Height ratio', 'Costume contrast', 'Interaction'],
    prompt: `Analyze this reference image featuring TWO persons.
Structure into two clearly separated sections (Person 1 on screen-left/foreground, Person 2 on screen-right/background):

For each person individually:
- Name / Identifier tag
- Facial structure, complexion, eye tint
- Hair (color, cut, length, texture)
- Wardrobe & clothing materials
- Distinctive physical features
- Build & visible age

ADDITIONALLY:
- Relative height and physical proportion
- Spatial distance, angle, and mutual body language

Conclude with two separate English prompt anchors for MiniMax H3.`,
  },
  {
    id: 'style-aesthetic-anchor',
    title: 'Style, Optics & Film Look (Grading Anchor)',
    category: 'style',
    badge: 'Style & Look',
    description: 'Defines optical character, lens roll-off, grain structure, and color grading for the entire film project.',
    keywords: ['35mm', 'Film grain', 'Color grading', 'Contrast', 'Lens', 'Bokeh'],
    prompt: `Analyze the visual style, camera optics, and color grading of this image:
- Film stock & aesthetic signature (e.g., 35mm organic negative, 16mm indie grain, 70mm large format crispness, monochrome noir)
- Color palette dominance (muted earth tones, rich teal & amber, desaturated pastel, high-contrast monochrome)
- Contrast & illumination characteristics (deep D-max shadows, soft specular roll-off, chiaroscuro edge key)
- Optical lens character (anamorphic horizontal flare, shallow depth of field, creamy cat-eye bokeh)

Conclude with an English "CINEMATIC STYLE ANCHOR" for MiniMax H3.`,
  },
  {
    id: 'costume-wardrobe-anchor',
    title: 'Costume, Wardrobe & Fabric Texture',
    category: 'person',
    badge: 'Wardrobe & Texture',
    description: 'Focused on clothing textiles, tailoring, distress patterns, and signature character accessories.',
    keywords: ['Costume', 'Clothing', 'Fabric', 'Tailoring', 'Leather', 'Accessories'],
    prompt: `Analyze exclusively the wardrobe and styling of this character for MiniMax H3:
- Garment types & tailoring (cut, drape, collar style, sleeve cuffs)
- Textiles & materials (grain leather, heavy knit wool, raw denim, breathable linen)
- Color tones & fabric patterns (color codes, weave texture, stone-washed finishes)
- Wear & patina (crisp brand-new, broken-in creases, weathered edges)
- Accessories (belts, timepiece, scarf, jewelry, zipper pulls)

Conclude with an English "WARDROBE PROMPT ANCHOR" for MiniMax H3.`,
  },
  {
    id: 'weapon-tactical-anchor',
    title: 'Tactical Equipment & Prop Anchor',
    category: 'object',
    badge: 'Tactical & Prop',
    description: 'Precise analysis of tactical gear, holsters, optics, and metallic finishes for action productions.',
    keywords: ['Hardware', 'Material', 'Metal', 'Finish', 'Mounts', 'Optics'],
    prompt: `Analyze this tactical prop or specialized hardware as a visual anchor:
- Classification & nomenclature (e.g., precision tactical tool, hunting blade, specialized instrument)
- Materiality & finish (matte cerakote, machined black steel, textured composite grip)
- Attached accessories & modules (optical scope, tactical flashlight, lanyard loop)
- Handling wear & serial markings (subtle edge brassing, knurled surface grip)

Conclude with a precise English "TACTICAL PROP ANCHOR" for MiniMax H3.`,
  },
  {
    id: 'floorplan-apartment-anchor',
    title: 'Apartment Floorplan: Spatial Zones & Camera Axes',
    category: 'floorplan',
    badge: 'Floorplan & Layout',
    description: 'Extracts spatial room flow, hallway axes, natural light paths, and recommended camera walkthrough routes from 2D/3D architectural plans.',
    keywords: ['Floorplan', 'Spatial layout', 'Sightlines', 'Daylight axes', 'Walkthrough route', 'Architecture'],
    prompt: `Analyze this architectural floorplan as an exact spatial anchor for cinematic camera tracking and photorealistic transitions (MiniMax H3 / Maestro):
- Footprint & layout archetype (e.g., 3-bedroom residence, open-concept loft, penthouse with perimeter terrace)
- Room zoning & transitions (foyer/entry, open living & dining, primary suite, kitchen island, private balcony)
- Glazing & daylight axes (primary orientation, raking window paths, floor-to-ceiling glass reveals)
- Wall partitioning & sightlines (visual flow from entrance to terrace, pocket doors, open circulation)
- Key furnishings & spatial landmarks (monolithic kitchen counter, dining table, seating zone)
- Specified flooring materials (wide-plank natural oak, large-format terrazzo, polished screed)
- Logical camera flight trajectory (e.g., entrance -> vestibule -> unfolding daylight living area -> terrace reveal)

Conclude with a precise English "FLOORPLAN ARCHITECTURE ANCHOR" locking the exact spatial proportions for MiniMax H3 / Maestro.`,
  },
  {
    id: 'prefab-house-exterior',
    title: 'Prefab Home Visualization: Facade, Volume & Landscaping',
    category: 'architecture',
    badge: 'Prefab Exterior',
    description: 'Analyzes 3D renderings of modern prefabricated architectural homes: timber batten facade, roof geometry, glazing, carport & drone overflight.',
    keywords: ['Prefab house', 'Facade', 'Timber battens', 'Cubic volume', 'Flat roof', 'Drone flight', 'Landscaping'],
    prompt: `Analyze this 3D architectural visualization of the modern prefabricated home as a visual anchor:
- Architectural typology & style (e.g., Bauhaus cubic flat-roof, Nordic timber-frame gable, modern pavilion)
- Volumetric geometry (two-story, L-shape, cantilevered upper floor, integrated carport)
- Facade materials & textures (smooth white mineral render combined with vertical natural larch louvers, charcoal fiber-cement panels)
- Roof design & green tech (hipped slate tiles, green roof with integrated flush photovoltaic solar arrays)
- Glazing architecture (floor-to-ceiling lift-and-slide glass doors, slim anthracite aluminum mullions)
- Outdoor landscaping & site context (hardwood deck, reflecting water feature, manicured ornamental grasses)
- Illumination design (facade up/down-lights, warm terrace glow, golden hour sunset backdrop)
- Recommended drone trajectory (e.g., wide 360° orbit gliding toward the front glass facade)

Conclude with an English "PREFAB HOME ARCHITECTURAL ANCHOR" for MiniMax H3 / Maestro locking the building geometry and materiality.`,
  },
  {
    id: 'prefab-house-interior',
    title: 'Prefab Home Interior: Light, Wood & Open Living',
    category: 'architecture',
    badge: 'Interior Architecture',
    description: 'For rendered interior perspectives: Cantilevered oak stairs, double-height ceiling voids, gallery sightlines, and bespoke finishes.',
    keywords: ['Interior', 'Gallery', 'Oak timber', 'Glass balustrade', 'Panorama glass', 'Prefab home'],
    prompt: `Analyze this visualized interior space of the modern architectural home:
- Spatial volume & ceiling height (double-height void, exposed timber rafters, 2.80m airy ceiling)
- Primary material palette (pale European oak, exposed architectural concrete, matte chalk walls, blackened steel hardware)
- Staircase architecture & balustrades (floating solid oak treads, frameless structural glass balustrade)
- Glazing & daylight connection (panoramic sliding glass wall, seamless connection to garden deck)
- Built-in bespoke features (flush kitchen island with induction, minimalist fireplace, designer pendant light)
- Camera movement recommendation (smooth eye-level Steadicam tracking through the living area)

Conclude with an English "INTERIOR ARCHITECTURE ANCHOR" for MiniMax H3 / Maestro.`,
  },
];

const STORAGE_KEY = 'prompt_catalog_data';

export function getInitialPromptCatalog(lang: string = 'DE'): PromptTemplate[] {
  return lang === 'EN' ? INITIAL_PROMPT_CATALOG_EN : INITIAL_PROMPT_CATALOG_DE;
}

export function loadPromptCatalog(lang: string = 'DE'): PromptTemplate[] {
  const initial = getInitialPromptCatalog(lang);
  const storageKey = lang === 'EN' ? `${STORAGE_KEY}_en` : STORAGE_KEY;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p: PromptTemplate) => p.id));
        const missingDefaults = initial.filter((item) => !existingIds.has(item.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          savePromptCatalog(merged, lang);
          return merged;
        }
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return initial;
}

export function savePromptCatalog(catalog: PromptTemplate[], lang: string = 'DE'): void {
  const storageKey = lang === 'EN' ? `${STORAGE_KEY}_en` : STORAGE_KEY;
  try {
    localStorage.setItem(storageKey, JSON.stringify(catalog));
  } catch (err) {
    console.error('Error saving prompt catalog:', err);
  }
}

export function resetPromptCatalog(lang: string = 'DE'): PromptTemplate[] {
  const storageKey = lang === 'EN' ? `${STORAGE_KEY}_en` : STORAGE_KEY;
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
  return getInitialPromptCatalog(lang);
}
