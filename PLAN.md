# Lyss Abfallkalender - Implementation Status

## Overview
Waste collection calendar app for Lyss + Busswil focusing on Paper (Papier) and Cardboard (Karton) collection dates.

**Stack:** RedwoodSDK on Cloudflare Workers, D1 SQLite, shadcn/ui, Tailwind CSS v4

---

## Completed

### Phase 1: Infrastructure
- [x] Created D1 database: `lyss-abfallkalender` (ID: `609a1675-2d7e-4ed1-98cb-12f8d1522e01`)
- [x] Added D1 binding to `wrangler.jsonc` as `DB`
- [x] Created database schema in `migrations/0001_schema.sql`
- [x] Executed schema on both local and remote D1

### Phase 2: Data Layer
- [x] Created `data/2025.json` with all street mappings and collection schedules
  - 143 Lyss streets with directory assignments (1-4)
  - 6 Busswil streets (directory 0)
  - Papier and Karton schedules for all directories
- [x] Created `scripts/seed.ts` for database seeding
- [x] Added npm scripts: `seed` and `seed:remote`
- [x] Successfully seeded local database (260 SQL commands)

### Phase 3: UI Setup
- [x] Installed Tailwind CSS v4 with `@tailwindcss/vite`
- [x] Configured `vite.config.mts` with Tailwind plugin
- [x] Created `src/app/globals.css` with monochrome theme (shadcn modified it)
- [x] Updated `src/app/Document.tsx` with German lang, Inter font, proper title
- [x] Initialized shadcn/ui with neutral color scheme
- [x] Added shadcn components: button, input, card, command, popover, dialog
- [x] Created `src/lib/utils.ts` with `cn()` helper

### Phase 4: API Routes (Code Written)
- [x] Created `src/lib/ics.ts` - ICS file generation utility
- [x] Created `src/app/api/streets.ts` - GET /api/streets endpoint
- [x] Created `src/app/api/schedule.ts` - GET /api/schedule endpoint
- [x] Created `src/app/api/ics.ts` - GET /api/ics endpoint
- [x] Updated `src/worker.tsx` with route definitions

---

## Current Blocker

### D1 Binding Not Available in Dev Mode

**Problem:** When running `npm run dev`, the `env.DB` binding is `undefined`. The Cloudflare Vite plugin isn't loading the D1 binding from `wrangler.jsonc`.

**Evidence:**
```
Available env bindings: []
DB binding not available - D1 operations will fail
```

**Attempted fixes:**
1. Added `persistState: true` to cloudflare plugin config - didn't help
2. Confirmed local D1 database exists at `.wrangler/state/v3/d1/`
3. Confirmed `wrangler.jsonc` has correct D1 configuration

**Possible solutions to investigate:**
1. Check if `@cloudflare/vite-plugin` requires specific version or config for D1
2. Try converting `wrangler.jsonc` to `wrangler.toml` format
3. Check rwsdk documentation for D1 setup in dev mode
4. Use `wrangler dev` instead of `vite dev` for testing DB operations
5. Check if there's a specific way to pass bindings in the cloudflare plugin

---

## Remaining Work

### Phase 4: API Routes (Testing)
- [ ] Fix D1 binding issue in development
- [ ] Test /api/streets endpoint
- [ ] Test /api/schedule endpoint
- [ ] Test /api/ics endpoint

### Phase 5: Frontend Components
- [ ] Create `src/app/components/StreetSelector.tsx` - autocomplete with house number input
- [ ] Create `src/app/components/CollectionSchedule.tsx` - display dates
- [ ] Create `src/app/components/CalendarCard.tsx` - single type card
- [ ] Create `src/app/components/DownloadButtons.tsx` - ICS download options
- [ ] Update `src/app/pages/Home.tsx` - assemble all components

### Phase 6: Polish
- [ ] German translations for all UI text
- [ ] Loading and empty states
- [ ] Error handling
- [ ] Test all user flows
- [ ] Seed remote database
- [ ] Deploy with `npm run release`

---

## File Structure

```
lyss-tools/
├── data/
│   └── 2025.json              # Seed data (streets + schedules)
├── migrations/
│   └── 0001_schema.sql        # Database schema
├── scripts/
│   └── seed.ts                # Database seeding script
├── src/
│   ├── worker.tsx             # Entry point + routes
│   ├── client.tsx             # Client hydration
│   ├── app/
│   │   ├── Document.tsx       # HTML shell
│   │   ├── globals.css        # Tailwind + shadcn styles
│   │   ├── headers.ts         # Security headers
│   │   ├── api/
│   │   │   ├── streets.ts     # GET /api/streets
│   │   │   ├── schedule.ts    # GET /api/schedule
│   │   │   └── ics.ts         # GET /api/ics
│   │   └── pages/
│   │       └── Home.tsx       # Main page (needs update)
│   ├── components/
│   │   └── ui/                # shadcn components
│   └── lib/
│       ├── utils.ts           # cn() helper
│       └── ics.ts             # ICS generation
├── wrangler.jsonc             # Cloudflare config with D1 binding
├── vite.config.mts            # Vite + Cloudflare + Tailwind
└── components.json            # shadcn config
```

---

## API Endpoints

| Endpoint | Method | Params | Response |
|----------|--------|--------|----------|
| `/api/streets` | GET | `locality?` | All streets for autocomplete |
| `/api/schedule` | GET | `street`, `houseNumber?`, `year?` | Paper + cardboard dates |
| `/api/ics` | GET | `street`, `houseNumber?`, `year?`, `type?`, `date?` | ICS file download |

---

## Database Schema

```sql
-- schedules: year + directory + type combination
CREATE TABLE schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  directory INTEGER NOT NULL,  -- 1-4 for Lyss, 0 for Busswil
  collection_type TEXT NOT NULL,  -- 'papier' or 'karton'
  UNIQUE(year, directory, collection_type)
);

-- collection_dates: actual dates per schedule
CREATE TABLE collection_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL,
  date TEXT NOT NULL,  -- ISO: YYYY-MM-DD
  FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

-- streets: name + house number range -> directory mapping
CREATE TABLE streets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  house_numbers TEXT,  -- NULL = all, or "18,20,22,24,26" or "61-98"
  directory INTEGER NOT NULL,
  locality TEXT NOT NULL DEFAULT 'lyss',
  UNIQUE(name, house_numbers, locality)
);
```
