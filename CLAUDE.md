# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:5173)
pnpm build        # Build for production
pnpm check        # Generate types + run TypeScript type checking
pnpm release      # Deploy to Cloudflare Workers
```

## Architecture

This is a **RedwoodSDK** application running on **Cloudflare Workers** with React Server Components.

### Entry Points
- `src/worker.tsx` - Cloudflare Worker entry point. Defines the app with `defineApp()`, sets up routing with `render()` and `route()`, and establishes middleware chain
- `src/client.tsx` - Browser entry point. Initializes client-side React hydration via `initClient()`

### Routing & Middleware
Routes are defined declaratively in `src/worker.tsx` using rwsdk's routing DSL:
- `render(Document, [...routes])` - Wraps routes with the Document layout
- `route("/path", Component)` - Defines individual routes
- Middleware functions in the `defineApp()` array execute in order for every request

### Key Patterns
- **Path alias**: `@/*` maps to `./src/*` (configured in tsconfig.json)
- **Type-safe links**: Use `link()` from `src/app/shared/links.ts` for type-safe route references
- **App context**: Extend `AppContext` type in `src/worker.tsx` and augment `DefaultAppContext` in `types/rw.d.ts`

### Project Structure
```
src/
├── worker.tsx         # Worker entry + route definitions
├── client.tsx         # Client hydration
└── app/
    ├── Document.tsx   # HTML document shell
    ├── headers.ts     # Security headers middleware
    ├── pages/         # Page components
    └── shared/        # Shared utilities (links, etc.)
```

## Configuration

- `wrangler.jsonc` - Cloudflare Workers config (change `name` field before deploying)
- `vite.config.mts` - Vite config with Cloudflare and RedwoodSDK plugins
- The app's UI is in german