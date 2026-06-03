# Medora — Healthcare Provider Discovery

A production-minded slice of a global healthcare discovery app, built for a
mobile engineering case study. It implements the required flow end-to-end —

> **Provider List → Filter → Provider Detail**

— and wraps it in the polish you'd expect from a real product: an animated
onboarding, light/dark theming, English/Turkish localization, smooth
transitions, rich "visual data", and proper loading / empty / error / offline
handling.

There is no backend (all data is mock), but every request is served through a
**simulated network layer** (latency + injectable failures), so the loading,
retry and offline states exercise real code paths instead of being decorative.

---

## Demo

| Onboarding | Discover (List) | Detail | Filter |
| --- | --- | --- | --- |
| ![onboarding](media/onboarding.png) | ![list](media/list.png) | ![detail](media/detail.png) | ![filter](media/filter.png) |

A short screen recording is in [`media/demo.mp4`](media/demo.mp4).

---

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Expo SDK 56 + Expo Router** | File-based routing; runs in Expo Go with no custom native code. |
| Language | **TypeScript (strict)** | Catch the messy-data edge cases at compile time. |
| Async / server state | **TanStack Query (React Query)** | Caching, `isLoading/isError`, retries, refetch-on-reconnect. |
| Client / UI state | **Zustand** | Filters, bookmarks, theme & language — lightweight, testable. |
| Persistence | **AsyncStorage** | Onboarding flag, theme, language, saved providers, recent searches. |
| Animation | **Reanimated 4** (+ Gesture Handler) | Collapsing header, parallax detail hero, paginated onboarding. |
| Images | **expo-image** (+ BlurHash) | Cached images with smooth blur-up placeholders. |
| i18n | **i18next / react-i18next** | English + Turkish, switchable at runtime. |
| Connectivity | **NetInfo** | Drives the offline banner and React Query's online manager. |

---

## How the requirements are met

### The three required screens

**1. Provider List** (`app/(tabs)/index.tsx`)
- A **search field** (required) — debounced 250 ms before it hits the query.
- Each card shows the required fields: **provider name, specialty/category,
  city, rating** — plus trust signals (verified badge, doctor/clinic/hospital)
  and a save toggle.
- Specialty quick-filter chips, a collapsing header, pull-to-refresh.

**2. Filter** (`app/filter.tsx`, presented as a sheet)
- The three required facets: **Country, City, Specialty/Category**.
- City **cascades** from the selected country; specialty is multi-select.
- A **live result count** ("Show 32 results") updates as you change the draft,
  committed to the store only on confirm.

**3. Provider Detail** (`app/provider/[id].tsx`)
- **Basic profile info**, **contact info**, and a **short bio** (all required).
- Plus a parallax hero, an animated rating-distribution chart, a stats row, and
  contact actions (call / website / email / directions).

### The evaluation checklist (“Dikkat Ettiğimiz Noktalar”)

- **Code organization** — feature-first folders (`src/features/providers`,
  `src/features/filter`) with shared primitives in `src/components`.
- **Component structure & reuse** — small, composable primitives (`Button`,
  `Chip`, `SearchBar`, `Text`, `Screen`, `Skeleton`, `FeedbackView`) reused
  across every screen; `ProviderCard`, `RatingStars`, `ProviderAvatar` reused by
  the list, saved and detail screens.
- **Navigation** — Expo Router: a tab group, a stacked detail route, and a modal
  filter route.
- **State management** — see below.
- **Null / missing data** — several mock providers deliberately omit a photo,
  rating, city or contact field; handled centrally via `src/lib/format.ts`,
  initials avatar fallback, "—" for unrated, and contact buttons that simply
  don't render when data is absent.
- **Loading / empty / error states** — shimmer skeletons, a friendly empty
  state with "clear filters", and an error state with working retry.
- **UX** — haptics, smooth transitions, accessibility labels, ≥44pt targets,
  dark mode, two languages.
- **Readability / maintainability** — strict TypeScript, consistent tokens,
  single-responsibility files.

---

## Architecture & key decisions

### State management — a deliberate split

The most important decision was **separating async state from UI state**:

- **TanStack Query owns everything async.** Components consume
  `useProviders(filters)` / `useProvider(id)` and get caching, retries, and
  reconnect-refetching for free. The filter object is part of the query key, so
  every filter combination is cached independently.
- **Zustand owns client UI state** — applied filters & search, bookmarks, theme
  and language. These are the user's own choices, not server data, so they don't
  belong in React Query, and Zustand avoids Context's provider/re-render churn.
- **AsyncStorage** persists the few things that should survive a restart,
  hydrated once on boot (before the splash hides) so there's no theme/language
  flash.

### Simulated network instead of static data

`src/lib/mockClient.ts` wraps every "API" call in artificial latency and a
configurable failure rate — this is what makes the loading, error+retry and
offline states real. `filterProviders` itself is a **pure function**, so it's
both unit-testable and reused for the filter sheet's live result count.

### Instant navigation, without losing the network story

The default list is **prefetched at boot** and held with `staleTime: Infinity`,
and filter/search changes use `keepPreviousData` — so there is no loading flash
or list "jump" during everyday use. The detail screen seeds from the list cache,
so it opens instantly. The network still runs on pull-to-refresh and on
reconnect, which is where the retry/offline behaviour is exercised.

### Theming

A token-driven theme (`src/theme`) is the single source of truth for color,
spacing, radius and typography. Components describe **intent**
(`color="textMuted"`) and adapt automatically to light/dark.

---

## Project structure

```
app/                         # Expo Router routes
  _layout.tsx                # providers, store hydration, prefetch, onboarding gate
  onboarding.tsx             # first-launch, image-led 3-slide pager
  (tabs)/
    index.tsx                # Provider List (Discover)
    saved.tsx                # bookmarked providers
    settings.tsx             # theme + language
  provider/[id].tsx          # Provider Detail (parallax hero)
  filter.tsx                 # Filter (modal route)
src/
  features/
    providers/               # api, hooks, components, types, saved store
    filter/                  # filter store
  components/                # shared UI primitives
  theme/                     # tokens, colors, ThemeProvider
  lib/                       # mockClient, storage, format, haptics, linking, hooks
  data/                      # mock providers + taxonomy (countries/cities/categories)
  i18n/                      # en.json, tr.json, init
__tests__/                   # Jest + RNTL
```

---

## Bonus

- **Tests** — `npm test` runs 30 Jest / React Native Testing Library tests:
  - `filterProviders` (search incl. case/diacritics, facets, sorting, empty),
  - `format.ts` null-safe formatters,
  - `useFilterStore` and `useSavedStore` logic,
  - `taxonomy` country→city cascade,
  - a `RatingStars` render test (value + unrated fallback).
- **Offline / retry** — an offline banner (NetInfo) appears when connectivity
  drops; React Query retries failed requests and refetches on reconnect. To see
  the full-screen error + retry, set `mockConfig.failureRate = 1` in
  `src/lib/mockClient.ts` and reopen the app / pull-to-refresh.
- **Screen recording** — see [`media/demo.mp4`](media/demo.mp4).

---

## Getting started

```bash
npm install
npm run ios            # open in Expo Go on an iOS simulator
# or
npm run android
npm start              # dev server + QR for a physical device (Expo Go)
```

No custom native modules are used, so Expo Go is enough — no `pod install`.

### Tests & types

```bash
npm test               # Jest + RNTL (30 tests)
npx tsc --noEmit       # strict type-check
```

---

## If I had more time

- A live map snippet on the detail screen (react-native-maps).
- Infinite scroll / pagination and a server-backed search.
- Snapshot + interaction tests for the list and filter screens.
- A skeleton for the detail screen (currently an instant cache-seeded open).
