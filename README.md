# BhaktiGrow AI — Premium Devotional Content Growth Platform

[![React](https://img.shields.io/badge/React-19.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-29%20Passed-emerald.svg)](https://vitest.dev/)

**BhaktiGrow AI** is a devotional content strategy and optimization platform designed specifically for Sanatan creators publishing on **YouTube**, **Instagram**, and **Facebook**. 

The platform empowers creators of Bhajans, Aartis, Mantras, Hanuman Chalisa recitations, Shiva & Krishna devotion, Ram Bhakti, Durga Stuti, Ganesh Aarti, and guided spiritual meditations to format, optimize, and organize their creative workflow with tailored editorial frameworks.

---

## 🌟 Key Features

### 1. 12 Dedicated Application Pages
- **Dashboard (`/dashboard`)**: Creator hub with live metrics, platform distribution, weekly production trends, upcoming calendar releases, and quick-start panels.
- **AI Content Studio (`/studio`)**: The primary creation workspace. Features local video drag-and-drop / preview (MP4, WebM, MOV up to 500 MB), multi-field devotional context form, and deterministic 5-strategy multi-platform generator.
- **YouTube Studio (`/youtube`)**: 5 platform-tailored suggestions featuring high-intent SEO titles, comprehensive descriptions, tags, pinned comments, CTR thumbnail concepts, and realistic desktop preview.
- **Instagram Studio (`/instagram`)**: 5 vertical Reel strategies with opening scroll-stopping hooks, cover headlines, on-screen text overlays, subtitle pacing guidance, and vertical 9:16 mobile previews.
- **Facebook Studio (`/facebook`)**: 5 family and community-oriented video frameworks with conversational captions, nostalgic heritage discussions, prayer circles, and realistic Facebook post previews.
- **Trend & Keyword Research (`/research`)**: High-intent devotional keyword cards, search intent analysis, unmet audience content gaps, seasonal festival trajectories, and strictly labeled evidence statuses.
- **Thumbnail & Hook Lab (`/thumbnail-lab`)**: Creative design laboratory with 16:9 and 9:16 aspect ratio previews, editable headlines, safe-area overlay guides, and sacred color harmonies (Sacred Saffron, Midnight Indigo, Devi Crimson, Vrindavan Green).
- **Bhakti Content Library (`/library`)**: Curated repository of authentic devotional themes across 12 sacred categories. Search, filter, inspect details, copy, and send directly into the AI Studio.
- **Content Calendar (`/calendar`)**: Interactive content release planner with Month, Week, and List views, date navigation (Prev, Next, Today), add/edit/reschedule/delete modals, and persistent localStorage sync.
- **Saved Suggestions (`/saved`)**: Shared unified bookmarks store accessible across all pages with search, platform filters, inline edits, and one-click `.txt` export.
- **Performance Insights (`/analytics`)**: Visual analytics dashboard featuring platform voice distribution, strategy engagement benchmarks, and publishing rhythm principles.
- **Settings & Preferences (`/settings`)**: Theme, preferred language, default target platforms, tone configuration, reduced-motion accessibility toggle, and explicit data reset with confirmation.

### 2. Deterministic Local Suggestion Engine
- Typed `SuggestionProvider` interface allowing seamless future backend/AI integration without rewriting the UI.
- Generates exactly 5 distinct strategies per platform:
  1. **Search-Focused SEO**
  2. **Curiosity-Driven Hook**
  3. **Emotional Storytelling**
  4. **Community Engagement**
  5. **Calm & Meditative Approach**
- Output scaling:
  - 1 platform = 5 suggestions
  - 2 platforms = 10 suggestions
  - 3 platforms = 15 suggestions
- Single-item regeneration: re-synthesizes an individual suggestion while strictly preserving its strategy archetype.
- No duplicate titles or hooks within a platform result set.
- Gracefully handles sparse inputs with intelligent category fallbacks.

### 3. Local Video Upload Validator
- Supports MP4, WebM, and MOV up to 500 MB.
- Gracefully handles empty or generic MIME types commonly reported by browsers for QuickTime `.mov` files.
- Memory leak prevention: automatically cleans up object URLs on file replace, removal, or component unmount.
- Best-effort fallback when browser codecs cannot decode local video previews.
- **100% Client-Side Privacy**: No video bytes are ever uploaded to any remote server.

### 4. Strict Evidence Integrity
- Every research record and strategy metric carries a clear evidence status badge:
  - `editorial`: Original devotional recommendation or qualitative framework.
  - `calculated`: Derived mathematically from local application state.
  - `illustrative`: Simulated demo benchmark or sample trajectory.
  - `verified`: Reserved only for accessible URLs with retrieval timestamps.
- Explicit label displayed across research screens: **“Sample research data — not live.”**
- Zero fabricated timestamps, scripture verses, copyrighted lyrics, or fake trending audio claims.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 with Rolldown manual chunks code splitting
- **Styling**: Tailwind CSS v4 (Devotional Dark-first theme with Saffron, Antique Gold, Midnight Navy, and Glassmorphism)
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React + Custom Devotional SVG icons (Diya, Sacred Lotus, Geometric Mandala)
- **Data Visualization**: Recharts (Accessible bar, donut, and area charts)
- **Testing**: Vitest + React Testing Library + User Event + jsdom
- **State Persistence**: Typed `localStorage` wrappers with defensive parsing to protect against corrupted storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js: `v18+` (Tested on `v22.23.1`)
- npm: `v9+` (Tested on `v10.9.8`)

### Installation

```bash
# Navigate to project folder
cd bhaktigrow-ai

# Install dependencies (already installed if cloned in place)
npm install
```

### Development Server

```bash
# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Run Automated Tests

```bash
# Execute Vitest test suites (29 tests)
npm test
```

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ⚠️ Demo Scope & Limitations

- **Frontend Only**: This is a standalone frontend prototype. There is no backend server, database, or real AI API key required.
- **No Social Accounts**: Does not connect to live YouTube, Instagram, or Facebook account APIs.
- **Simulated Metrics**: Analytics graphs, search volume scores, and engagement benchmarks represent qualitative devotional models and local demo state.
- **Local Calendar**: Entries are for creator planning and content drafting; no posts are automatically published to social media.
- **Honest Disclaimer**: BhaktiGrow AI provides editorial frameworks to improve content quality and discoverability, but never guarantees viral views, subscriber counts, or monetization revenue.
