# 🎬 Drehbuchstudio Pro & Single-Line Prompt Engine `v3.0.0`

> **Professional Dramaturgical Screenplay Studio, Multimodal Reference Anchor Generator & Single-Line Prompt Presser for AI Video Production.**  
> Optimized for **MiniMax H3**, **Maestro 2.1.6**, **Kling AI 1.5/1.6**, **Runway Gen-3 Alpha**, **Luma Dream Machine**, and **Sora**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Drehbuch--Referenzanker--Generator-181717?style=for-the-badge&logo=github)](https://github.com/wobushannes/Drehbuch--Referenzanker-Generator)
[![Instagram Showcase](https://img.shields.io/badge/Instagram-@mo__ment__e-E4405F?style=for-the-badge&logo=instagram)](https://www.instagram.com/mo_ment_e/reels/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version: 3.0.0](https://img.shields.io/badge/Version-3.0.0-emerald.svg?style=for-the-badge)](https://github.com/wobushannes/Drehbuch--Referenzanker-Generator)

---

## 🌟 Overview & Video Showcase

The **Single-Line Video Prompt Engine & Reference Anchor Generator (v3.0.0)** is an open-source, high-precision cinematic production cockpit designed for directors, cinematographers, AI video artists, and screenwriters. It translates complex dramaturgical screenplay sequences, multimodal character/location reference anchors, and physical film stock lighting parameters into continuous, timecoded video windows (e.g., **14.000 seconds per window**, seamless 28s, 56s, or 84s multi-window arcs) formatted with **strictly zero line breaks**.

### 🎥 Live Video Showcase & Production Examples
- 🎬 **Watch the Reels on Instagram**: [https://www.instagram.com/mo_ment_e/reels/](https://www.instagram.com/mo_ment_e/reels/) (`@mo_ment_e`)
- 📸 **Instagram Profile**: [https://www.instagram.com/mo_ment_e](https://www.instagram.com/mo_ment_e)
- 💻 **GitHub Repository**: [https://github.com/wobushannes/Drehbuch--Referenzanker-Generator](https://github.com/wobushannes/Drehbuch--Referenzanker-Generator)

> *All sample reels and apocalyptic film cycles (e.g., "Das Erlöschen des Spektrums") on `@mo_ment_e` were produced using prompt windows and photochemical film profiles engineered inside this studio.*

---

## 🏷️ Version 3.0.0 Release Highlights

- **🎞️ Agfachrome CT18 Master Plugin (AP-41 Reversal Chemistry)**: Full photochemical simulation of vintage German Agfachrome CT18 (50S) reversal slide film with cool sage shadows, slate tones, faded ocher highlights, and soft watercolor pastels.
- **🔬 Optical Precision Engineering**: Carl Zeiss Sonnar 40mm f/2.8 HFT, Planar 50mm T1.4, and Arri Master Prime profiles with realistic microcontrast and zero artificial digital oversharpening.
- **🏷️ Multimodal Identity & Location Anchoring (`compactPromptAnchor`)**: Extract and bind physical subject markers (`@Subject1_...`, `@Building1_...`, `@Floorplan1_...`) with private local LM Studio vision models.
- **🎛️ Astroburner Cinematic LoRA Disentanglement (`ASTROCINEMAV01K2T`)**: 1-click management and smart toggles to isolate or blend MiniMax H3 Cinema V2 LoRA without contaminating analog reversal color palettes.
- **📜 Proposal Claims & Typographic Director**: Dedicated overlay director for on-screen typography, handwritten notes, outro claim cards, and font styling.
- **🎬 NLE Timeline Suite**: Direct export to DaVinci Resolve (`.edl`, `.fcpxml`), Final Cut Pro, Premiere Pro, and Markdown/CSV formats.
- **🌐 Full Bilingual German/English UI**: Seamless live switching across all presets, technical descriptions, and prompt generators.

---

## 🚀 Key Studio Modules

### 1. 🎞️ Photochemical Analog Film Lab
- **Agfachrome CT18 (AP-41 Reversal)**: Muted earth tones, delicate pastel transitions, cold sage shadows.
- **Kodachrome 64 (K-14 Subtractive Dye)**: Vivid cinnabar reds, natural skin tones, Sclera Protection (Anti-Sepia Guard), 650nm carmine halation.
- **CineStill 800T (Tungsten & Remjet Physics)**: 3200K tungsten balance with distinct carmine halation halos around point light sources.
- **Kodak 5247 / Ektachrome / Tri-X 400**: Historic cinema and black & white emulsions.

### 2. 📐 Strict Single-Line Window Pressing (0 Line Breaks)
- Formats multi-scene screenplays into exact, continuous single-line strings.
- Prevents token drops, syntax truncation, and parser errors in generative diffusion models.
- Sequential timecoded windows: `00:00.000 – 00:14.000`, `00:14.000 – 00:28.000`, `00:28.000 – 00:42.000`, etc.

### 3. 🧠 Local LM Studio Integration (Private Local AI)
- Connects to local LM Studio instances (`http://localhost:1234/v1/chat/completions`) via built-in proxy.
- Extracts visual reference anchors from images (characters, companion subjects, architecture, floorplans, props) 100% locally and privately.

### 4. 🗺️ Multimodal Floorplan & Spatial Axis Director
- Analyze architectural blueprints and floorplans (`PNG`, `JPG`, `WebP`).
- Map 4-station choreography and continuous sightline camera paths (`Steadicam dolly-in along sightline...`).

### 5. 🎙️ Voice Modulation & Sound Architecture
- Soundscape design, frequency filters (e.g. 18Hz infrasound, telephone bandpass, cathedral reverb), and voice inflection presets.

### 6. ✍️ Claims & Typography Director
- Define on-screen title overlays, calligraphy styles, lower thirds, and animated outro claims.

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/wobushannes/Drehbuch--Referenzanker-Generator.git

# Enter project directory
cd Drehbuch--Referenzanker-Generator

# Install dependencies
npm install
```

### 2. Start Development Server
```bash
# Start Vite + Express backend proxy (runs on http://localhost:3000)
npm run dev
```

### 3. Production Build
```bash
# Compile and build applet
npm run build

# Start production server
npm start
```

---

## 👥 Supporters & Vision Partners

- 🧙‍♂️ **AI Wizards**: [https://ai-wizards.de/](https://ai-wizards.de/) — *Pioneering AI automation, workflow optimization, and generative AI solutions.*
- 👨‍💻 **Johannes Wobus**: [https://johannes-wobus.de/](https://johannes-wobus.de/) — *Digital strategy, software architecture, and innovative media engineering.*
- 🎥 **Instagram Showcase**: [https://www.instagram.com/mo_ment_e/reels/](https://www.instagram.com/mo_ment_e/reels/)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
