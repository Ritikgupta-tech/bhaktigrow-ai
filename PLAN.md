# BhaktiGrow AI — Implementation Plan

BhaktiGrow AI is a devotional content strategy and optimization platform for creators publishing on YouTube, Instagram, and Facebook.

## 1. Architecture & Tech Stack
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS + Devotional Dark-first Theme (Deep navy, charcoal, saffron, gold, indigo accents)
- **Icons & Motion**: Lucide React + Framer Motion (respects `prefers-reduced-motion`)
- **Data Viz**: Recharts (with accessible labels and demo data disclaimers)
- **Routing**: React Router (DOM) with hash/browser routing and 12 dedicated pages
- **State Management**:
  - `SavedItemsContext`: Unified store persisted in `localStorage` for saved suggestions and library ideas.
  - `CalendarContext`: Persistent calendar entries (Month, Week, List views) in `localStorage`.
  - `PreferencesContext`: Theme, tone, language, reduced motion preferences in `localStorage`.
- **Testing**: Vitest + React Testing Library + jsdom

## 2. 12 Application Pages
1. `/dashboard`: Overview metrics, platform breakdown (YT, IG, FB), recent generated ideas, weekly chart, categories, quick start.
2. `/studio`: AI Content Studio with drag & drop video upload (MP4/WebM/MOV, max 500MB, local preview, fallback, cleanup), multi-field devotional form, deterministic generator (5 strategies per platform: SEO, Hook, Storytelling, Community, Meditative).
3. `/youtube`: 5 dedicated YouTube suggestions (SEO title, description, tags, keywords, pinned comment, thumbnail concept, realistic preview, copy/save/edit/regenerate).
4. `/instagram`: 5 dedicated Instagram suggestions (hook, Reel cover text, caption, hashtags, vertical 9:16 Reel preview, on-screen text, subtitle guidance).
5. `/facebook`: 5 dedicated Facebook suggestions (post title, conversational caption, engagement angle, pinned comment, FB post preview).
6. `/research`: Trend & Keyword Research with search, category/platform/language filters, keyword opportunity cards, strictly labeled evidence status (`editorial`, `calculated`, `illustrative`, `verified` only if real URL).
7. `/thumbnail-lab`: Visual creative workspace with CSS/SVG mockups, 16:9 and 9:16 aspect ratios, safe areas, saffron/gold devotional palettes, editable headlines.
8. `/library`: Curated Bhakti Content Library across 12 devotional categories (Hanuman Chalisa, Shiva, Krishna, Ram Bhakti, Durga, etc.), search, filter, send to Studio, save to shared store.
9. `/calendar`: Interactive Content Calendar with Month, Week, and List views, date navigation (Prev, Next, Today), add/edit/reschedule/delete with modal dialogs, status/platform filters, demo planning notice.
10. `/saved`: Shared Saved Suggestions page with search, filters, inline edit, copy fields/post, export as `.txt`, unsave, and duplicate protection.
11. `/analytics`: Performance Insights dashboard with platform distribution, format distribution, production velocity, clearly labeled demo metrics.
12. `/settings`: Preferences (theme, default language, default platforms, tone, reduced motion) and explicit data reset with confirmation.

## 3. Local Suggestion Engine
- Typed `SuggestionProvider` interface.
- Exactly 5 distinct strategies per platform:
  1. Search-focused SEO
  2. Curiosity-driven, accurate hook
  3. Emotional storytelling
  4. Community engagement
  5. Calm, devotional / meditative approach
- Generates 5 (1 platform), 10 (2 platforms), or 15 (3 platforms) suggestions with unique IDs and tailored platform tone.
- Single-item regeneration preserving strategy.
- Deterministic initial generation from topic/category/tone inputs.
- No fabricated timestamps, trending audio claims, or fake scripture quotes.

## 4. Execution Steps
1. Project setup and dependency verification.
2. Core types, utility helpers, and local storage safety wrappers.
3. Local Content Suggestion Engine (`src/lib/suggestionEngine.ts`) and tests.
4. Video Upload Validator & Local Object URL manager with cleanup.
5. Shared Contexts (`SavedItemsContext`, `CalendarContext`, `PreferencesContext`, `ToastContext`).
6. UI Layout (Sidebar, TopNav, Mobile Drawer, Breadcrumbs, Devotional SVGs/motifs).
7. Implement all 12 feature pages with rich, working interactions.
8. Unit and integration tests (Vitest + RTL).
9. Build verification (`npm run build`).
10. Final review, documentation, and reporting.
