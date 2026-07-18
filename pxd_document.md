# Product Experience Design Document (PXD)
## SAT-MSS — Satellite Mining Surveillance System
### Mission Control Interface · Earth Observation Platform · India MVP

---

| Document Control | |
|---|---|
| **Document ID** | PXD-SATMSS-001 |
| **Version** | 1.0.0 |
| **Status** | Draft — Internal Design Review |
| **Prepared By** | Principal Product Architect / GIS UX Lead |
| **Review Authority** | Head of Product, Head of Design, Head of Engineering |
| **Classification** | Internal — Design Confidential |
| **Source Documents** | `problem_definition.md` (PRD), `srs_document.md` (SRS-SIMDS-001) |
| **Date Issued** | 2026-07-18 |
| **Product Codename** | SAT-MSS |
| **Target Geography** | India (MVP) |

---

## 1. Product Vision

### 1.1 The Core Statement

SAT-MSS is not a web application. It is a **Mission Control**.

The system exists to give Earth Observation analysts at organizations like NRSC and ISRO the feeling of operating a planetary-scale surveillance platform — not filling out a government form or navigating a traditional dashboard. The Earth itself is the primary navigation surface. Every action the analyst takes is a spatial decision made on a living, breathing model of the planet.

The product sits in a tradition of the world's most respected spatial intelligence platforms: **NASA Eyes on the Earth, Cesium Ion, Google Earth Studio, ESRI ArcGIS Earth, and Sentinel Hub EO Browser.** But unlike those, SAT-MSS is operationally focused with a specific mission: detect, verify, and document unauthorized mining activity across Indian terrain.

### 1.2 Design North Star

> "The analyst should feel the weight of the mission — the scale of the problem, the precision of the tool, and the authority of the evidence they produce."

### 1.3 Emotional Design Intent

| Moment | Intended Emotion |
|---|---|
| First landing on Mission Control | Awe. Orientation. Authority. |
| Zooming into a flagged district | Urgency. Precision. Focus. |
| Drawing an AOI over forest terrain | Control. Surgical accuracy. |
| Watching analysis run | Anticipation. Confidence in the system. |
| Viewing before-and-after imagery | Clarity. The evidence speaks. |
| Generating a report | Finality. The mission is complete. |

### 1.4 What SAT-MSS is Not

- It is not a traditional GIS desktop application.
- It is not a government portal with forms and tables.
- It is not a satellite imagery browser.
- It is not a report generator with a map embedded in it.
- It is not a dashboard with charts in a sidebar.

### 1.5 What SAT-MSS Is

- A spatial mission control environment where the Earth is the primary interface.
- A workflow engine guiding analysts from observation to evidence without breaking spatial context.
- A 3D operational platform that treats satellite data as mission-critical intelligence.
- An institutional tool projecting the analytical authority of NRSC/ISRO-class organizations.

---

## 2. User Personas

### 2.1 Primary Persona — The Earth Observation Analyst

**Name:** Dr. Aryan Mehta (representative archetype)
**Organization:** NRSC, Hyderabad | **Role:** Senior Remote Sensing Scientist | **Age Range:** 30–52

**Background:** Decade-long experience in satellite data analysis. Trained in multi-spectral image interpretation, change detection, and GIS-based spatial analysis. Fluent in NDVI, SAR interpretation, and spectral signature comparison. Uses ArcGIS, QGIS, and ERDAS Imagine. Technically sophisticated but not a software developer.

**Goals:**
- Detect unauthorized surface mining incursions within assigned districts.
- Build irrefutable, time-stamped evidence packages for regulatory submission.
- Monitor the rate of expansion of known illegal mining clusters.

**Pain Points with Existing Tools:**
- GIS software requires excessive manual steps to produce regulatory-grade reports.
- Switching between image viewers, GIS, and document editors breaks analysis flow.
- Existing web interfaces feel generic — they do not respect the analytical gravity of the work.

**What Aryan wants from SAT-MSS:**
> "I want to navigate directly to a district, pull the latest Sentinel imagery, draw my AOI, run the analysis, and have the system show me exactly where the forest cover has been destroyed. Then I want one button to produce a report my department director can sign and submit to the Ministry."

---

### 2.2 Secondary Persona A — The Mining Department Official

**Name:** Shri Rajan Pillai | **Organization:** Ministry of Mines / State Mining Department | **Role:** Deputy Director, Mineral Administration

**Background:** Administratively senior but not technically trained in GIS. Understands mining concession boundaries and legal permit registers. Reviews reports and decides on enforcement escalation. Does not perform analysis.

**Journey in SAT-MSS:** Login → Operational Dashboard → Review Report → Export PDF → Exit.

---

### 2.3 Secondary Persona B — The Forest Department Officer

**Name:** Smt. Kavitha Rao | **Organization:** State Forest Department | **Role:** Deputy Conservator of Forests

**Background:** Forest cover protection mandate. Concerned with deforestation within Protected Forest zones. Uses GIS occasionally but is not a remote sensing specialist.

**Journey in SAT-MSS:** Review AOIs within forest jurisdiction → View change timelines → Download evidence packages for field teams.

---

## 3. User Journey

```
SPLASH SCREEN
     │
     ▼
MISSION CONTROL                    ← Persistent home environment
     │
     ▼
3D EARTH VIEW                      ← Globe loads, India illuminated
     │
     ▼
ZOOM TO INDIA                      ← Automated camera transition
     │
     ▼
STATE SELECTION                    ← State boundaries appear; analyst selects state
     │
     ▼
DISTRICT SELECTION                 ← Districts of chosen state appear
     │
     ▼
AOI SELECTION / DRAWING            ← Analyst selects existing AOI or draws new one
     │
     ▼
SATELLITE IMAGERY LOAD             ← System retrieves and renders imagery for AOI
     │
     ▼
RUN ANALYSIS                       ← Analyst initiates change detection run
     │
     ▼
VIEW RESULTS                       ← Flagged change zones appear as overlays
     │
     ▼
TIMELINE COMPARISON                ← Analyst scrubs through temporal imagery stack
     │
     ▼
GENERATE REPORT                    ← Analyst compiles and exports case file
     │
     ▼
RETURN TO MISSION CONTROL          ← Camera retracts to global overview
```

### 3.1 Journey Design Principles

- **No journey step should break spatial context.** The Earth remains visible or transitioning at all times.
- **Every step forward has a visible, deliberate back path.**
- **Progress is spatial, not linear.** Position in the journey is communicated by position in the spatial hierarchy: Globe → India → State → District → AOI → Site.

---

## 4. Screen-by-Screen Walkthrough

### SCREEN 01 — Splash Screen

Full-black screen. Over 2.5 seconds, the Earth emerges from darkness — the Indian subcontinent visible at center. The SAT-MSS logotype appears in wide-spaced white in the display typeface. Subtitle: **"Satellite Mining Surveillance System — India Operational Platform."** Attribution: **"NRSC · Ministry of Mines · Forest Survey of India."** A pulsing dot at bottom center is the only loading indicator.

After initialization, the Earth begins to rotate. The splash elements fade. The camera begins a slow push toward India. The Mission Control interface assembles over the globe. Transition duration: 3.5 seconds. Auto-advancing: 3–6 seconds total.

---

### SCREEN 02 — Mission Control

**Zone A — The Earth (center, 70% viewport width):** Full-screen 3D globe rotating slowly (0.2°/second). India is centered and gently highlighted. Active AOIs appear as dim pulsing rings. Confirmed alerts appear as brighter amber rings. Atmospheric halo visible.

**Zone B — Left Command Panel (15% width):** User identity badge; Mission briefing (Active AOIs, Pending Alerts, Case Files); Quick-access navigation icons; System status (Data Feed health, Last Imagery Update).

**Zone C — Right Intelligence Panel (15% width):** Recent Alerts feed (last 5 alerts with severity chip, state name, time-ago); Active Case Files; Data stream status (satellite passes ingested today).

**Zone D — Top Mission Bar (48px):** SAT-MSS logotype, Mission date/time (IST), Operational Mode indicator, Notification bell.

**Zone E — Bottom Navigation Strip (36px):** Keyboard shortcut hints, spatial context breadcrumb, gradient blending into Earth.

Earth hover behavior: pauses rotation, shows tooltip with state name, district name, AOI name, last alert date. Click initiates camera zoom.

---

### SCREEN 03 — 3D Earth / Zoom to India

Left and right panels retract (400ms ease-out). Earth expands to fill full viewport. Camera descends toward Indian subcontinent in a smooth orbital arc — resembling a spacecraft dropping into approach orbit.

As camera descends: national border appears (thick luminous white), then state boundaries (thinner cool blue-white). Terrain resolves — Deccan Plateau brown, Western Ghats green, Himalayan snow caps, Thar Desert ochre. City nodes appear as dim white halos. Atmospheric haze thickens.

**This is not a map. It is a camera descent into real Earth.**

Breadcrumb: `INDIA`

---

### SCREEN 04 — State Selection

State boundaries glow with interactive luminosity. Cursor near a state: boundary brightens; floating label shows state name + count of active AOIs + pending alerts.

Click a state: the state illuminates with warm white fill animation; other states recede to 15% opacity dark overlay; camera descends toward selected state. State Context Card slides in from left (state name, total forest area monitored, total licensed concessions, last analysis date).

Breadcrumb: `INDIA > ODISHA`

---

### SCREEN 05 — District Selection

Camera drops further into selected state. District boundaries emerge as fine cyan-tinted lines. Terrain resolution increases — topography, river systems, forest patches visible.

District labels float above centroids: name, active AOI count, highest severity alert (color chip). Hover: borders brighten, tooltip card. Click: selected district illuminates; camera descends.

District Context Panel (left): district name, forest type classification, active mining leases count, last satellite pass date, list of existing AOIs with status chips.

Breadcrumb: `INDIA > ODISHA > SUNDARGARH`

---

### SCREEN 06 — AOI Selection / Drawing

Camera is at approximately 15–25 km altitude. Terrain is highly detailed. Individual forest patches, river channels, road networks, and bare earth zones are visible.

**Existing AOI Selection:** Glowing boundary polygons (green/amber/red by status). Click an AOI: polygon pulses, camera zooms to frame the AOI, AOI Context Panel slides in from right.

**Drawing Mode:**
- Fine 1km grid overlay appears over terrain.
- Cursor transforms to precision crosshair.
- Click to place vertices anchored to terrain (lat/lon).
- Lines between vertices are glowing cyan rendered on terrain surface, following contour.
- Live area counter in lower-left: `"AOI Area: 247.3 km²"`
- Double-click or click first vertex to close polygon.
- Confirmation panel: AOI Name field, Priority chips (HIGH/MEDIUM/LOW), auto-populated State/District, area display. `SAVE AOI` (primary) and `DISCARD` actions.

Breadcrumb: `INDIA > ODISHA > SUNDARGARH > AOI-SG-047`

---

### SCREEN 07 — Satellite Imagery Load

Camera settled near-overhead with slight oblique angle. Imagery Configuration Panel appears from right:
- Date range selector (From/To calendar wheels; default 24-month lookback)
- Band selection: Natural Color, False Color (NIR), SWIR, SAR
- Cloud cover tolerance slider (0–30%)
- Available scenes list (scrollable; date, satellite, cloud %, quality indicator)

On scene selection: imagery loads progressively on 3D terrain within AOI boundary — low-res preview within 1 second, full resolution over 2–4 seconds (darkroom developing metaphor). AOI boundary polygon remains visible as bright cyan overlay. Area outside AOI: base composite, 70% opacity, slightly desaturated.

Breadcrumb: `INDIA > ODISHA > SUNDARGARH > AOI-SG-047 > 2025-11-14 (S2A)`

---

### SCREEN 08 — Run Analysis

Analysis Configuration Panel appears from right:
- Analysis Type: Land-Cover Change Detection (default for V1)
- Baseline scene display (read-only)
- Target scene display (read-only or selectable)
- Sensitivity: Standard / High Sensitivity
- Analysis scope: Full AOI / Sub-region

**"INITIATE ANALYSIS"** button: large, centered, Mission Amber, Orbitron typeface in caps.

On click: panel collapses. Scene dims to 60% opacity. A luminous scanning line sweeps north-to-south across AOI over 4–8 seconds. Bottom progress strip: `PROCESSING · SCENE COMPARISON · 68%`

---

### SCREEN 09 — View Results

Scanning line completes and fades. Imagery returns to full opacity. Detection overlays appear on terrain surface:

| Category | Fill Color | Opacity | Border |
|---|---|---|---|
| Vegetation Loss | Warm Red `#FF4C29` | 35% | Solid 2px |
| Exposed Bare Earth | Orange `#FF8C42` | 35% | Solid 2px |
| New Water / Tailings | Amber `#FFD166` | 30% | Dashed 2px |
| Access Road | Cyan `#06D6A0` | 20% | Dashed 1px |

Results Panel (right): Total flagged change area (`342.7 ha flagged`), zone count, severity score (large, color-ringed), concession intersection status, protected area status (red chip if incursion).

Zone click: camera recenters on zone; Zone Detail Card appears (zone ID, area, type, distance to water body, distance to protected boundary, NDVI delta).

---

### SCREEN 10 — Timeline Comparison

Timeline Panel slides up from bottom (full width). Terrain view compresses upward to accommodate.

**Temporal Strip:** Horizontal timeline; each available scene is a vertical tick mark, color-coded by cloud cover quality (white/gray/amber/crossed). Baseline marker (●) and Target marker (◎) are independently draggable. Terrain imagery crossfades live on drag (50ms delay, 300ms crossfade).

**Compare Mode:** Toggle activates left/right split view on terrain. Draggable center divider. Both sides render full 3D.

**Animation Playback:** ▶ PLAY advances through scenes at 1/second. Analyst watches time-lapse of terrain change.

**Change Area Sparkline:** Area chart above timeline ticks. Gradient fill from alert-amber at peak to transparent at baseline. Smooth SVG curves. Hover crosshair shows exact area value and date. Corresponding terrain scene crossfades on hover.

---

### SCREEN 11 — Generate Report

Report Assembly Panel opens from right (40% width). Terrain visible in background at 40% opacity.

**Auto-populated:** Case reference, AOI details, analyst identity, imagery sources, severity score, change area, zone count, concession/protected area classification.

**Analyst-required:**
- Evidence imagery: drag from thumbnail grid into evidence slots (minimum 2, maximum 6)
- Image captions (required per image)
- Analyst notes (minimum 100 characters)
- Recommendation (dropdown + explanation)

**Live PDF Preview:** Updates in real time as sections are completed. `Full Preview` opens scrollable preview.

**Export Actions (fixed at panel bottom):**
- `EXPORT PDF REPORT` (primary, Mission Amber)
- `EXPORT GEOJSON PACKAGE` (secondary, outlined)
- `SAVE DRAFT` (tertiary, text-only)

PDF structure: Cover page → Executive Summary → Evidence Imagery (one per page) → Methodology → Change Zone Data Table → Analyst Notes → Recommendation + Signature Block → Audit Trail Summary.

---

### SCREEN 12 — Return to Mission Control

Camera retracts: Site → AOI → District → State → India → Globe. Continuous, smooth, 4 seconds. Inverse of descent. Left and right panels slide back in. Completed case file appears in Right Intelligence Panel with `COMPLETE` chip. The analyzed AOI shows a dim pulsing green ring on the globe.

---

## 5. Navigation Philosophy

### 5.1 Spatial Navigation as Primary Metaphor

Navigation hierarchy:
```
GLOBAL ORBIT           (~full Earth visible)
     ↕
INDIA OVERVIEW         (~800km altitude equivalent)
     ↕
STATE LEVEL            (~200km altitude equivalent)
     ↕
DISTRICT LEVEL         (~50km altitude equivalent)
     ↕
AOI LEVEL              (~15-25km altitude equivalent)
     ↕
SITE LEVEL             (~3-5km altitude equivalent)
```

### 5.2 Breadcrumb as Spatial Context

`INDIA > ODISHA > SUNDARGARH > AOI-SG-047 > 2025-11-14`

Each element is clickable, triggering smooth camera retraction to that level.

### 5.3 No Modals

Zero full-screen modals. All interactions happen in panels sharing the screen with the live terrain view.

### 5.4 Panel Behavior

Non-modal, non-blocking, edge-anchored. Configuration panels: right edge. Context panels: left edge. Timeline: bottom edge. All panels have drag handles (resizable) and can collapse to icon-strip state.

### 5.5 Keyboard Navigation

All primary actions have keyboard shortcuts. Arrow keys for spatial hierarchy navigation, Spacebar for timeline animation, Z for vertex undo, Enter to confirm/close polygon.

---

## 6. Camera Transition Philosophy

### 6.1 Camera as Storytelling Instrument

The camera is an active design element — not a passive viewport. Every movement is choreographed.

### 6.2 Camera Transition Types

**Type 1 — Orbital Descent (Globe → State → District):**
Smooth arc descending toward target altitude. Duration: 3.5–6 seconds. Easing: custom cubic-bezier (0.4, 0.0, 0.2, 1.0). Tilt progresses from 45° toward 80° (near-overhead). Slight counter-clockwise roll (±3°) for cinematic depth.

**Type 2 — Lateral Glide (Peer to peer at same level):**
Camera glides laterally maintaining altitude — like an aircraft banking. Duration: 2–3.5 seconds. Linear acceleration/deceleration.

**Type 3 — Site Focus (AOI level → Change Zone):**
Short, precise zoom to center on a selected detection zone. Duration: 1.2–2 seconds. Easing: ease-out. Moves to near-nadir for precision.

**Type 4 — Retraction (Back navigation):**
Exact inverse of descent. Camera rises, tilts outward, view expands. Duration: 4 seconds total for full return to Mission Control.

### 6.3 Visual Cues During Transition

- Target boundary already illuminated before camera arrives.
- Target label already rendering at reduced opacity, growing to full opacity on arrival.
- Terrain resolution increases progressively during descent (terrain sharpens as camera approaches).

---

## 7. Earth Interaction Model

### 7.1 Interaction at Each Level

| Zoom Level | Hover Effect | Click Effect |
|---|---|---|
| Global | Country tooltip | Initiate descent |
| India Overview | State context card | Begin state zoom |
| State Level | District context card | Begin district zoom |
| District Level | AOI summary tooltip | AOI selection or drawing |
| AOI Level | Zone type indicator | Zone detail card + camera focus |
| Site Level | Coordinate readout | Precision vertex placement |

### 7.2 Earth Rendering Layers

| Layer | Visibility Range |
|---|---|
| Base Terrain (DEM + composite imagery) | Always |
| Atmosphere (sky dome + limb haze) | Always |
| Administrative Boundaries | India level and below |
| Concession Boundaries | District level and below |
| Protected Area Boundaries | District level and below |
| AOI Polygons | State level and below |
| Satellite Imagery (scene draped on terrain) | AOI level and below |
| Detection Overlays (change zones) | AOI level and below |
| City / Infrastructure Labels | District level and below |

All layers have individual opacity sliders in a **Layer Control Popover** (icon top-right of terrain view).

### 7.3 Terrain Interaction During AOI Drawing

- Terrain held steady (rotation paused, no auto-pan).
- Mouse wheel: zoom in/out (altitude adjustment, same pitch).
- Click-drag on empty terrain: pan view.
- Click on terrain: place AOI vertex.
- Placed vertices: selectable and draggable handles.
- Coordinate chip floats near cursor during placement (WGS84, 6 decimal places).

---

## 8. Mission Control Layout

### 8.1 Layout Grid

```
┌──────────────────────────────────────────────────────────────┐
│  TOP MISSION BAR (full width, 48px)                          │
├──────────────┬───────────────────────────┬───────────────────┤
│              │                           │                   │
│  LEFT        │    THE EARTH (3D Globe)   │  RIGHT            │
│  COMMAND     │                           │  INTELLIGENCE     │
│  PANEL       │     (FILLS REMAINDER)     │  PANEL            │
│  (240px)     │                           │  (280px)          │
│              │                           │                   │
├──────────────┴───────────────────────────┴───────────────────┤
│  BOTTOM NAVIGATION STRIP (full width, 36px)                  │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Top Mission Bar Elements

| Element | Position | Content |
|---|---|---|
| SAT-MSS logotype | Far left | Logo + wordmark |
| Spatial breadcrumb | Center-left | Current spatial position |
| Mission clock | Center-right | Date + IST time, live |
| Mode indicator | Right-center | ACTIVE / REVIEW / OFFLINE |
| Notification bell | Right | Count badge |
| User avatar | Far right | Profile/settings |

### 8.3 Left Command Panel — Detailed

- User identity badge (avatar, name, organization)
- Mission Briefing (Active AOIs count, Pending Alerts count, Case Files count)
- Navigation icons (Mission Map, Alert Queue, Case Archive, Settings)
- System Status (Data Feed health indicator, Last Imagery Update timestamp)

### 8.4 Right Intelligence Panel — Detailed

- Recent Alerts feed (last 5 entries: severity chip, state name, time-ago)
- Active Case Files (name, status, last modified)
- Data Stream status (satellite pass ingestion status for each source)

---

## 9. Visual Hierarchy

### 9.1 Three Layers of Concern

**Layer 1 — The Earth:** Always visually dominant. Most pixels, highest contrast, most interactivity.

**Layer 2 — Structural UI (Glassmorphism panels):** Translucent, allowing Earth bleed-through. Context-providing but not dominant.

**Layer 3 — Transient UI (Action Surface):** Configuration panels, zone cards, tooltips. Highest contrast within their layer; appears on demand.

### 9.2 Size as Authority

| Element | Hierarchy Role |
|---|---|
| 3D Globe | Supreme |
| Alert severity score (numerical) | Dominant within its panel |
| AOI name / Case file reference | Primary labels |
| Metadata (dates, coordinates) | Secondary |
| System status indicators | Tertiary |
| Keyboard shortcut hints | Ambient |

### 9.3 Depth Stacking

1. Earth (deepest)
2. Atmospheric effects
3. Terrain overlays (change zones, boundaries — attached to Earth surface)
4. Glassmorphism panels
5. Tooltips and hover cards
6. Action notifications (topmost, disappear within 4 seconds)

---

## 10. UI Design Language

### 10.1 Design Language Name: **Orbital Glass**

Three influences:
- NASA/ISRO mission control room aesthetics (dark, high-contrast, data-primary)
- macOS / visionOS glassmorphism (translucency, depth, material blur)
- Earth Observation cartographic tradition (ArcGIS, QGIS, Sentinel Hub — spatial precision, clean boundary rendering)

### 10.2 Five Core Design Principles

**Spatial Primacy:** Every decision defers to the Earth. UI panels are servants of spatial navigation.

**Operational Calm:** The interface feels controlled, not frenetic. Urgent alerts are communicated precisely and calmly.

**Data Dignity:** Every number represents real geospatial truth. Hectares to one decimal. Coordinates to 6 decimal places. No rounding that obscures meaning.

**Dark by Default:** Always dark. The Earth at night demands dark chrome. Detection overlays (red, amber, cyan) pop against darkness.

**Precision over Personality:** SAT-MSS is an instrument. It is precise, reliable, authoritative. Decoration without purpose is rejected.

---

## 11. Animation Principles

### 11.1 The Four Laws

**Law 1:** Animations communicate; they do not entertain. Every animation serves a functional purpose.

**Law 2:** Spatial animations (camera transitions, terrain crossfades, AOI appearances) are the most important and must be smooth and physically plausible.

**Law 3:** UI animations (panel slide-ins, button states) are secondary and must not pull the analyst's gaze from the terrain.

**Law 4:** No animation loops without meaning. The only permitted loops are: Earth rotation (system is live), AOI pulse rings (active monitoring), scanning line (analysis running).

### 11.2 Animation Vocabulary

| Animation | Duration | Easing |
|---|---|---|
| Splash Earth emergence | 2,500ms | ease-in-out |
| Mission Control panel assembly | 400ms | ease-out |
| Camera descent (state) | 5,000ms | custom spatial ease |
| Camera descent (district) | 3,500ms | custom spatial ease |
| Camera descent (AOI) | 2,000ms | ease-out |
| Panel slide-in (edge panels) | 350ms | ease-out |
| Imagery crossfade (scene change) | 400ms | ease-in-out |
| Detection zone appear (staggered) | 400ms per zone | ease-out |
| Alert pulse ring | 3,000ms cycle | ease-in-out loop |
| Timeline scrub crossfade | 300ms | ease-in-out |
| Camera retraction (full return) | 4,000ms | custom spatial ease |

---

## 12. Motion Guidelines

### 12.1 Spatial Motion Standards

**Continuity:** The camera never cuts. It always transitions. Redirects smoothly if interrupted.

**Physical Plausibility:** Motion has mass and momentum. Accelerates from stationary; decelerates before settling. No hovering, jittering, or oscillating.

**Tilt Behavior:** Global/India level: 25–35° off-nadir (oblique). Descending toward district/AOI: approaches nadir (0° — overhead). Overhead at site level for precision imagery interpretation.

### 12.2 UI Element Motion Standards

**Enter:** Panels slide from relevant edge, 350ms ease-out. Cards/tooltips: fade in + 4px upward translate, 200ms. Detection zones: fade + scale from centroid (0.7→1.0), 400ms, 80ms stagger per zone.

**Exit:** Panels slide to edge, 300ms ease-in. Cards: fade out + 4px downward translate, 150ms.

**State changes:** Button hover: +15% brightness, 150ms. Button press: scale to 0.97, 100ms. Alert chip color change: cross-fade, 200ms.

### 12.3 Timeline Scrub Motion

50ms delay after scrubber movement stops → 300ms crossfade. Prevents excessive crossfades during rapid dragging while maintaining responsive feedback.

### 12.4 Reduced Motion

Respects `prefers-reduced-motion`. Camera transitions become instant (brief fade). All UI animations replaced with simple opacity fades (200ms). Earth rotation paused. Timeline animation disabled (scrub-only).

---

## 13. Color System

### 13.1 Color Philosophy

Dark, science-instrument palette. Base: deep space black. Accent colors drawn from Earth Observation natural color signatures — amber of bare soil, deep red of vegetation loss, cyan of water signatures.

### 13.2 Base Palette

| Token | Hex | Usage |
|---|---|---|
| `space-black` | `#06080D` | Primary background |
| `mission-night` | `#0D1117` | Panel backgrounds |
| `deep-panel` | `#131920` | Secondary panels |
| `surface-panel` | `#1C2333` | Card surfaces |
| `border-dim` | `#2A3547` | Dividers, inactive borders |
| `border-active` | `#3D5080` | Active/focused borders |

### 13.3 Earth Accent Palette

| Token | Hex | Usage |
|---|---|---|
| `terrain-green` | `#1A4A2E` | Healthy vegetation indicator |
| `alert-amber` | `#E88C30` | Active alerts, pending states |
| `critical-red` | `#C94040` | Confirmed incursions, critical |
| `water-cyan` | `#1AABB0` | Water body detections, AOI borders |
| `bare-orange` | `#C77A3A` | Bare soil detections |
| `road-teal` | `#06D6A0` | Access road detections |
| `concession-purple` | `#7B5EA7` | Licensed concession boundaries |
| `protected-forest-green` | `#2D8653` | Protected area boundaries |

### 13.4 System UI Palette

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#E8EAF0` | Primary readable text |
| `text-secondary` | `#8A9BBB` | Secondary labels, metadata |
| `text-tertiary` | `#4E5D7A` | Placeholders, hints |
| `mission-amber` | `#E88C30` | Primary action buttons |
| `mission-amber-hover` | `#F5A042` | Primary button hover |
| `success-signal` | `#2D8653` | Success states |
| `error-signal` | `#C94040` | Error states, critical alerts |

### 13.5 Severity Score Color Gradient

| Score Range | Label | Hex |
|---|---|---|
| 1–30 | Low | `#2D8653` |
| 31–55 | Moderate | `#8BC34A` |
| 56–70 | Elevated | `#E88C30` |
| 71–85 | High | `#D4541A` |
| 86–100 | Critical | `#C94040` |

---

## 14. Typography System

### 14.1 Typeface Selection

**Display — Orbitron (Google Fonts):** Mission bar, severity numerals, analysis headlines, report references, screen titles. Geometric, wide, mission-control aesthetic. Weights: 400, 700.

**Primary UI — Inter (Google Fonts):** All body text, panel labels, metadata, alert descriptions, form fields. Neutral, highly legible at small sizes. Weights: 300, 400, 500, 600.

**Data / Monospaced — JetBrains Mono (Google Fonts):** Coordinates, case file references, scene IDs, satellite identifiers, area measurements, timestamps. Technical, precise. Weights: 400, 500.

### 14.2 Type Scale

| Token | Typeface | Size | Weight | Usage |
|---|---|---|---|---|
| `display-xl` | Orbitron | 32px | 700 | Splash screen title |
| `display-lg` | Orbitron | 24px | 700 | Section titles |
| `display-md` | Orbitron | 18px | 400 | Panel headers, mode indicators |
| `display-sm` | Orbitron | 13px | 400 | Subsection titles |
| `body-lg` | Inter | 16px | 400 | Primary body |
| `body-md` | Inter | 14px | 400 | Secondary body, alert descriptions |
| `body-sm` | Inter | 12px | 400 | Metadata, timestamps |
| `label-md` | Inter | 13px | 600 | Form labels, column headers |
| `label-sm` | Inter | 11px | 600 | Chips, badges, status labels |
| `data-lg` | JetBrains Mono | 16px | 500 | Coordinates, area measurements |
| `data-md` | JetBrains Mono | 13px | 400 | Scene IDs, reference numbers |
| `data-sm` | JetBrains Mono | 11px | 400 | Fine-grain metadata |
| `severity-number` | Orbitron | 48px | 700 | Severity score large display |

### 14.3 Letter Spacing

- Orbitron: `+0.08em` to `+0.12em` (wide spacing reinforces mission-control aesthetic)
- Inter: Default (-0.01em large, 0 body, +0.01em small labels)
- JetBrains Mono: Default (do not adjust)

---

## 15. Glassmorphism / Material System

### 15.1 Material Philosophy

Three-tier material system. All surfaces are non-opaque — Earth imagery bleeds through every panel to varying degrees. This maintains spatial context even when panels are foregrounded.

### 15.2 Material Tiers

**Tier 1 — Deep Glass (Command Panels, Mission Bar):**
```
Background:  rgba(13, 17, 23, 0.80)
Blur:        24px
Border:      1px solid rgba(255, 255, 255, 0.07)
Inner:       inset 0 1px 0 rgba(255, 255, 255, 0.04)
Shadow:      0 4px 32px rgba(0, 0, 0, 0.40)
```

**Tier 2 — Mid Glass (Configuration Panels, Context Cards):**
```
Background:  rgba(28, 35, 51, 0.72)
Blur:        16px
Border:      1px solid rgba(255, 255, 255, 0.10)
Inner:       inset 0 1px 0 rgba(255, 255, 255, 0.06)
Shadow:      0 2px 16px rgba(0, 0, 0, 0.30)
```

**Tier 3 — Light Glass (Tooltips, Hover Cards):**
```
Background:  rgba(45, 58, 82, 0.60)
Blur:        8px
Border:      1px solid rgba(255, 255, 255, 0.12)
Shadow:      0 2px 8px rgba(0, 0, 0, 0.20)
```

### 15.3 Interactive States

**Hover:** Border brightens to `rgba(255,255,255,0.16)`. Fill opacity +5%.
**Active/Selected:** Border → `rgba(232,140,48,0.50)`. Left accent → `3px solid rgba(232,140,48,0.80)`.
**Keyboard Focus:** Border → `rgba(106,153,255,0.60)`.

### 15.4 Corner Radius System

| Element | Radius |
|---|---|
| Full-height edge panels | 0px |
| Configuration panels (floating) | 12px |
| Context cards | 10px |
| Tooltips | 8px |
| Chips / badges | 999px |
| Buttons | 8px |

---

## 16. 3D Interaction Philosophy

### 16.1 The Earth is Not a Map

The globe uses perspective projection, not flat map tiles. This means:
- AOI polygons wrap terrain contour — on mountains they follow ridgelines and valleys.
- Detection zones are terrain-following — visible as terrain-accurate polygons from oblique angles.
- Labels are billboard-rendered (always face camera) for legibility at any angle.

### 16.2 Terrain Fidelity Requirements

The 3D terrain uses real-world DEM data for India:
- Accurate profiles for Himalayas, Western Ghats, Eastern Ghats, Vindhyas.
- Correct river valleys and channels at district zoom.
- Forest texture at lower zoom; satellite imagery at close range.
- Graceful fallback to flat terrain with subtle texture where DEM data is unavailable.

### 16.3 Camera Pitch by Zoom Level

| Zoom Level | Camera Pitch | Visual Effect |
|---|---|---|
| Global | 20° from nadir | Oblique globe, depth visible |
| India Overview | 30° | Topographic depth |
| State Level | 25° | Mountains rendered 3D |
| District Level | 20° | River valleys visible |
| AOI Level | 10° | Near-overhead; terrain relief subtle |
| Site Level | 5° | Overhead; maximum spatial precision |

### 16.4 Ambient Earth Behavior

Globe rotates at 0.2°/second at Mission Control — visually alive, communicating system health. In 15 idle seconds, Earth rotates 3° — barely noticeable but unmistakably animated.

AOI rings: 3-second pulse cycle. Ring expands outward and fades — like a sonar ping. Slow enough to be calming; fast enough to be clearly animated.

---

## 17. Remote Sensing Workflow Visualization

### 17.1 Principle: Workflow Mirrors the Science

Visual design at each workflow step mirrors how EO scientists actually think:

**Scene Selection:** Imagery thumbnail strip uses scene browser language — thumbnails with cloud cover markers, date axis, quality indicators. Immediately recognizable to NRSC analysts.

**Band Compositing:** When the analyst selects a band combination, terrain imagery morphs live. Vegetation turns red in NIR composites. Water bodies darken in SWIR. The analyst sees the scene respond, reinforcing their understanding of what each composite reveals. Crossfade duration: 400ms.

**Detection Results:** Overlay colors have spectral grounding — red for vegetation loss (inverse of NDVI), orange for bare earth (soil spectral signature), cyan for new water bodies. Experienced analysts read the overlay as a spectral legend without needing to consult one.

### 17.2 Scene Metadata Display

Always visible for every loaded scene (Data typeface, compact badge format):
- Satellite and sensor: `Sentinel-2A · MSI`
- Acquisition date/time: `2025-11-14 · 05:22 UTC`
- Tile ID: `T44QPE`
- Cloud cover: `3.2%`
- Processing level: `L2A`
- Solar elevation angle: `46.3°`

### 17.3 Band Selection Visualization

Four options, each with a visual preview thumbnail chip showing how the scene appears in that composite:
- Natural Color (4-3-2)
- False Color NIR (8-4-3) — vegetation appears red
- SWIR (12-8-4) — enhanced mineral and moisture discrimination
- SAR — grayscale radar backscatter

Toggle between composites in real time; 400ms crossfade between transitions.

---

## 18. Data Visualization Principles

### 18.1 Hierarchy of Data Display

**Show the number that drives the next action.** At results, severity score is the largest number on screen — not area in hectares, not zone count. The severity score determines what the analyst does next.

**Spatial data belongs on the Earth, not in tables.** Change zones, concession boundaries, protected area boundaries — all on terrain. Analysts read spatial relationships from the Earth directly.

**Tables exist only for non-spatial data.** Scene selection list, alert queue, case file archive — these are appropriately presented as sorted lists in panels.

### 18.2 Change Area Metric Display

**Form 1 — Results Panel:** `342.7 ha` in Orbitron Bold 32px. Comparison below: `↑ 156.3 ha since previous analysis (83% increase)` in alert-amber.

**Form 2 — Timeline Chart:** Sparkline area chart above timeline ticks. X: time, Y: cumulative change area. Gradient fill (alert-amber at peak → transparent at baseline). Smooth SVG curves. Steep slope identifies escalation point.

### 18.3 Severity Score Visualization

- Large numerical value: 48px Orbitron Bold (center)
- Circular SVG arc ring: fills proportionally (87% score = 87% ring filled), colored by severity band
- Band label below: `HIGH · 87/100`

### 18.4 Timeline Chart Interaction

Hover crosshair snaps to nearest tick. Tooltip shows exact area value and date. Corresponding terrain imagery crossfades on hover. Enabling immediate correlation between spatial evidence and temporal data.

---

## 19. Timeline Interaction

### 19.1 Timeline Panel Layout

```
[BASELINE]                                    [COMPARE ◎] [▶ PLAY]
~~~~~~~~~~~~~~~~~ (Change Area Sparkline) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
┤  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  ├
Jan  Mar  May  Jul  Sep  Nov 2025  Jan  Mar  May  Jul 2026
            ●                ◎
          (BASE)           (TARGET)
```

**● Baseline marker:** Draggable solid dot. "Before" scene reference.
**◎ Target marker:** Draggable ring dot. "After" scene comparison.

### 19.2 Interaction Modes

**Mode 1 — Single Scene Browse:** One active marker. Terrain shows selected scene. No split view.

**Mode 2 — Comparison Mode:** Two markers active. Terrain splits left/right with draggable center divider. Both sides full 3D.

**Mode 3 — Animation Playback:** ▶ PLAY advances through scenes at 1/second. Baseline marker stays; target marker tracks playback.

**Mode 4 — Gap Mode:** Imagery gaps shown as hatched visual `░░░░ NO DATA ░░░░`. Analyst is informed of data gaps for analysis integrity.

### 19.3 Scene Quality Indicators

- Green tick: < 5% cloud cover (best quality)
- Gray tick: 5–20% cloud cover (usable)
- Amber tick: 20–30% cloud cover (marginal)
- Crossed (×): > 30% cloud cover (not analyzed)

---

## 20. AOI Drawing Workflow

### 20.1 Drawing Mode Entry

From District Selection via `+ Define New AOI` in left panel or right-click context menu: `Draw AOI Here`.

### 20.2 Drawing Mode Visual State

Left panel switches to compact Drawing Toolbar (60px vertical strip):
- `✱` Place vertex (active default)
- `↩` Undo last vertex
- `⊠` Clear and restart
- `✓` Confirm and close
- `✕` Cancel Drawing Mode

Cursor: precision crosshair. Terrain: fine 1km grid overlay (low opacity). Drawing HUD (lower-left): vertex count, live area calculation, cursor coordinates.

### 20.3 Vertex Placement

- Click → places terrain-anchored vertex (white dot)
- Line → glowing cyan `water-cyan` at 80% opacity, follows terrain contour
- Vertex handles → draggable after placement
- Polygon closing → click within 10px of first vertex (snap indicator) or press Enter / click ✓
- Minimum 3 vertices required; confirmation button disabled until met

### 20.4 AOI Confirmation

Panel appears after polygon close:
- AOI Name (required text input)
- Priority radio chips: HIGH / MEDIUM / LOW
- State and District: auto-populated, read-only
- Area: read-only display (`247.3 km²`)
- `SAVE AOI` (primary) | `DISCARD` (secondary)

### 20.5 Existing AOI Editing

Edit mode: all vertices shown as draggable handles. New vertices insertable by clicking edge segment (+ indicator on hover). Vertex deletion via right-click context menu. Unsaved-changes indicator (●) in panel header until `Save Changes` clicked.

---

## 21. Analysis Workflow

### 21.1 Pre-Analysis Validation

Analysis blocked (button disabled + tooltip) if:
- No AOI selected
- Fewer than 2 available scenes in date range
- No baseline/target scene explicitly identified
- Selected scenes exceed cloud cover tolerance

Tooltip explains specifically what is missing.

### 21.2 Execution Phases

**Phase 1 (0–15%):** `PREPARING SCENES · SCENE NORMALIZATION` — Subtle imagery coloring shift.
**Phase 2 (15–85%):** `PROCESSING · SCENE COMPARISON · [%]` — Scanning line sweeps north-to-south.
**Phase 3 (85–100%):** `CLASSIFYING CHANGES · SCORING ALERT` — Scanning completes; half-second pause before results render.

### 21.3 Post-Analysis Actions

- **Zone selection:** Click polygon → Zone Detail Card + camera recenters
- **Flag as evidence:** Right-click → `Flag as Primary Evidence` → bright border, auto-included in Case File
- **Dismiss zone:** Right-click → `Mark as False Positive` → grey out, excluded from Case File → inline justification required (20 character minimum)
- **Re-run:** Secondary action in Results Panel; adjusts sensitivity; clears previous results

---

## 22. Report Workflow

### 22.1 Report Assembly Principle

The report is curated, not transcribed. The analyst judges and annotates; the system populates the evidence.

### 22.2 Auto-Populated Sections

- Case reference (format: `CF-YYYY-XXXX`)
- AOI name, state, district, centroid coordinates
- Analysis date, analyst identity, imagery sources, acquisition dates
- Severity score and classification
- Total change area and zone count
- Concession intersection classification and protected area status
- Complete zone data list (ID, area, type)

### 22.3 Analyst-Required Inputs

- Evidence imagery (minimum 2, drag from thumbnail grid)
- Image captions (required per image)
- Analyst notes (minimum 100 characters)
- Recommendation (dropdown + explanation text)

Missing required inputs: amber left border + inline message `Required — Please complete this section.`

### 22.4 PDF Structure

Cover → Executive Summary → Evidence Imagery (one per page, with caption) → Methodology → Change Zone Data Table → Analyst Notes → Recommendation + Signature Block → Audit Trail Summary.

### 22.5 Export Flow

On `EXPORT PDF REPORT` click: button transforms to `GENERATING PDF...` with spinner → PDF downloads (2–4 seconds) → success notification (`Case File CF-2026-0047 exported successfully.`) → case file appears in Right Intelligence Panel with `COMPLETE` chip.

---

## 23. Empty States

**Philosophy:** Spatially grounded. Never blank white panels. Empty states occur within the Earth context and carry the system visual language.

| Scenario | Visual Treatment | Action Offered |
|---|---|---|
| No AOIs in District | `No AOIs defined in this district.` — terrain remains live and interactive | `+ Define First AOI` (Mission Amber) |
| No Imagery in Date Range | `No scenes meeting your criteria. Try expanding the date range or increasing the cloud cover threshold.` | `Expand Date Range` / `Adjust Cloud Tolerance` |
| No Alerts in Queue | Dim orbital radar sweep animation returning nothing. `No active alerts. All zones within parameters.` — a reassuring positive empty state | None (informational) |
| No Case Files | Dim case file icon with dotted border. `No case files compiled. Begin an analysis to generate your first case file.` | None (contextual hint) |

---

## 24. Loading States

**Philosophy:** System is working, making progress, spatial context is maintained. Earth always visible.

| Scenario | Loading Treatment |
|---|---|
| Satellite imagery loading | Progressive coarse-to-fine resolution. Pulsing blue border on AOI polygon. Border fades on completion. |
| Analysis execution | Scanning line animation + `PROCESSING · [%]` progress readout |
| PDF generation | Button → `GENERATING PDF...` + rotating spinner ring (16px, 1 rotation/second) |
| Concession boundary layer | Horizontal progress bar in Layer Control Popover. Shown only if > 500ms load time. |
| Mission Control initial load | Progressive Earth resolution + panel assembly animation. |

---

## 25. Error States

**Philosophy:** Immediately visible, precise, actionable.

| Scenario | Visual Treatment | Actions |
|---|---|---|
| Data Feed Offline | `● Data Feed: OFFLINE` in left panel (red). Notification badge appears. Imagery using cached data shows banner: `Using cached data · Feed offline since [time]` | None required; informational |
| Analysis Failed | Scanning animation halts. `ANALYSIS FAILED · [specific reason]`. Results Panel does not open. Error card with cause. | `Retry with Different Scene` / `Contact Support` |
| Boundary Import Failed | Top-right toast: `⚠ Boundary import failed — [specific reason]`. 8 seconds, dismissible. | Re-upload with corrected file |
| Session Timeout | Semi-transparent overlay: `Session expired due to inactivity. Your work has been auto-saved.` Earth continues rotating behind overlay. | `RESUME SESSION` (Mission Amber) |
| Unsaved Navigation Attempt | Inline confirmation strip below action: `Unsaved changes will be lost. Continue?` | `YES, CONTINUE` / `CANCEL` |

---

## 26. Future Extensibility

### 26.1 Extension Points Built Into V1

**Layer System:** Layer control popover is scrollable and extensible. V2 additions: Water Turbidity, SAR Coherence Change, Hansen GFC Deforestation, LULC classification.

**Analysis Type Selector:** Currently a dropdown with one item. V2 additions: Water Quality Analysis, NDVI Time Series, Thermal Anomaly Detection.

**Satellite Sources:** V2 additions: ResourceSat-2/2A, Cartosat-series imagery for India-specific high-resolution coverage.

**Report Template System:** V2: configurable mandatory/optional sections; organization-specific headers (NRSC, State Departments).

**Multi-Country:** The spatial hierarchy (Global → Country → Admin L1 → Admin L2 → AOI) is country-agnostic. V2 simply loads additional administrative boundary and concession registry data.

**Collaboration (V3):** AOI naming and organizational ownership structure in V1 accommodates V3's shared AOI and collaborative review features.

---

## 27. Design Constraints

| ID | Constraint | Rationale |
|---|---|---|
| DC-01 | Browser-only deployment (Chrome 100+, Firefox 100+, Edge 100+, Safari 16+). No client-side plugins. | Institutional deployment constraint |
| DC-02 | Graceful degradation on low-bandwidth connections (< 5 Mbps: lower-res imagery; < 1 Mbps: 2D flat map mode available in V2) | Field office accessibility |
| DC-03 | Desktop/laptop only for V1. Minimum resolution: 1440×900px. No mobile optimization. | Multi-panel and 3D terrain requirements |
| DC-04 | Dark mode only. Not a user preference — it is the operational environment. No light theme in V1. | EO analyst operational environment standard |
| DC-05 | All coordinates displayed in WGS84. Per ISRO and Survey of India GIS standards. | Government interoperability requirement |
| DC-06 | Report PDFs in English only for V1. Vernacular languages deferred to V2. | MVP scope constraint |
| DC-07 | No tile-based base maps at the top experience level. The Earth is a 3D globe with composite imagery. | Core product identity — not a web map application |
| DC-08 | Detection overlay system must use both color AND pattern fill (solid/crosshatch/dot/dash) to accommodate color vision deficiency. | Accessibility requirement |

---

## 28. Accessibility Considerations

### 28.1 Target Standard

WCAG 2.1 Level AA compliance.

### 28.2 Color and Contrast

- All text on glassmorphism surfaces: minimum 4.5:1 contrast ratio (WCAG AA).
- Status chips: color + text label. `HIGH` chip is red AND reads "HIGH" in text. Screen readers and color-blind analysts receive identical information.

### 28.3 Keyboard Accessibility

- All navigation: Tab + Enter to select, Escape to up-level.
- Timeline scrub: arrow keys advance one scene at a time.
- Report section completion: all fields fully keyboard-accessible. Drag-and-drop has keyboard alternative (Tab → Enter to select as evidence).
- AOI vertex drawing: pointer device required in V1 (keyboard-only drawing is V2 feature).

### 28.4 Screen Reader Support

- All interactive elements: `aria-label` with purpose and current state.
- Status changes: `aria-live` region announcements (analysis complete, alert generated).
- 3D globe: text summary accessible to screen readers — `"3D globe showing India with [X] active AOIs and [Y] pending alerts. Press Tab to navigate to the list of AOIs."`

### 28.5 Focus Management

Panel open: focus moves into panel. Panel close: focus returns to triggering element. Focus ring: `2px solid rgba(106, 153, 255, 0.90)` — distinguishable from hover and selected states.

### 28.6 Text Sizing

Minimum body text: 12px (`body-sm`) — ambient information only. Primary body: 14px. No SVG-rendered text without accessible text alternative.

---

## 29. MVP Scope

### 29.1 V1 Feature Set

| Feature | V1 MVP |
|---|---|
| 3D Globe with India | ✅ |
| State and District spatial hierarchy | ✅ |
| Existing AOI browsing and selection | ✅ |
| New AOI drawing and naming | ✅ |
| Satellite imagery loading (Sentinel-2, Sentinel-1) | ✅ |
| Band composite selection (NR, FC, SWIR, SAR) | ✅ |
| Land-Cover Change Detection analysis | ✅ |
| Detection results overlay (4 change types) | ✅ |
| Severity scoring and display | ✅ |
| Concession and Protected Area boundary overlays | ✅ |
| Timeline comparison (scrub, animation, compare mode) | ✅ |
| Change area timeline chart | ✅ |
| Case File assembly and PDF export | ✅ |
| GeoJSON export | ✅ |
| Alert queue and status management | ✅ |
| Operational Dashboard (Operations Director) | ✅ |
| Role-based access (4 roles) | ✅ |
| Audit trail | ✅ |
| Session management and 2FA authentication | ✅ |

### 29.2 Deferred to V2 / V3

| Feature | Target Version |
|---|---|
| Additional analysis types (water quality, NDVI, thermal) | V2 |
| ResourceSat-2 / Cartosat imagery sources | V2 |
| Vernacular language report generation | V2 |
| Predictive risk modeling overlay | V2 |
| Low-data 2D flat map mode | V2 |
| Custom report templates per organization | V2 |
| Multi-country expansion | V2 |
| Mobile interface | V3 |
| Collaborative AOI review | V3 |
| Keyboard-only AOI drawing | V2 |
| Automated satellite tasking | V3 |

---

## 30. Screens Included in Version 1

| Screen ID | Name | Primary Actor | Description |
|---|---|---|---|
| **SCR-01** | Splash Screen | All | Brand entry, system initialization, animated Earth emergence |
| **SCR-02** | Mission Control | All | Persistent home environment; live 3D globe with command panels |
| **SCR-03** | 3D Earth / Zoom to India | Primary Analyst | Camera descends to India; state boundaries emerge |
| **SCR-04** | State Selection | Primary Analyst | Interactive state boundaries; State Context Card |
| **SCR-05** | District Selection | Primary Analyst | District boundaries; terrain detail; District Context Panel |
| **SCR-06** | AOI Selection / Drawing | Primary Analyst | Browse existing AOIs or enter AOI Drawing Mode |
| **SCR-07** | Satellite Imagery Load | Primary Analyst | Imagery configuration; progressive scene rendering on terrain |
| **SCR-08** | Run Analysis | Primary Analyst | Analysis configuration panel; scanning animation execution |
| **SCR-09** | View Results | Primary Analyst | Detection zone overlays on terrain; Results Panel; zone selection |
| **SCR-10** | Timeline Comparison | Primary Analyst | Timeline panel; scene scrub; compare mode; animation playback |
| **SCR-11** | Generate Report | Primary Analyst | Report Assembly Panel; live PDF preview; export actions |
| **SCR-12** | Return to Mission Control | All | Camera retraction sequence; mission cycle completion |
| **SCR-13** | Alert Queue | Analyst, Director | Sortable, filterable list of all active and historical alerts |
| **SCR-14** | Case File Archive | Analyst, Director | Archive of compiled case files with filter and search |
| **SCR-15** | Operational Dashboard | Operations Director | Region-wide metrics; alert trend charts; AOI heat map |
| **SCR-16** | User Management | System Administrator | Create, modify, deactivate user accounts and roles |
| **SCR-17** | AOI Management | System Administrator | View, edit, activate, deactivate all registered AOIs |
| **SCR-18** | Boundary Dataset Management | System Administrator | Import, version, and review concession boundary datasets |
| **SCR-19** | Settings | System Administrator | Alert thresholds, severity weights, data feed configuration |
| **SCR-20** | User Profile | All | Personal profile, notification preferences, active sessions |

---

### Design Specification Completeness

This PXD constitutes the complete, authoritative design specification for SAT-MSS Version 1. It is sufficient to brief a UI/UX design team on visual production (wireframes, high-fidelity Figma screens) and a frontend engineering team on interaction behavior, animation specifications, layout structure, component design, and spatial navigation logic.

**Recommended next document in design phase:**
> **Wireframe Set (WFS-SATMSS-001):** High-fidelity annotated wireframes for all 20 screens, derived directly from screen specifications in §4 and §30 of this PXD.

---

*End of Document — PXD-SATMSS-001 v1.0.0*

*This document is subject to design change control. Any modification must be proposed as a Design Change Request, reviewed by the Principal Product Architect and GIS UX Lead, and re-versioned before distribution.*
