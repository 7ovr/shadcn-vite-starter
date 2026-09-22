# shadcn-vite-starter

A React starter with the stack already wired: Vite, TypeScript, TanStack Router, Query, Form and Table, and shadcn/ui on Base UI. It ships a page built from six free [7Ovr](https://7ovr.com) blocks and a working example built on the free [PokéAPI](https://pokeapi.co), so you can start on the product instead of the setup.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/7ovr/shadcn-vite-starter&project-name=shadcn-vite-starter&repository-name=shadcn-vite-starter)

## Setup

You need Node 24 or newer and [pnpm](https://pnpm.io) 12 or newer.

```bash
git clone https://github.com/7ovr/shadcn-vite-starter
cd shadcn-vite-starter
pnpm install
pnpm dev
```

Open http://localhost:5173. Installing also sets up the Git hooks that format and lint your changes on commit.

## What is inside

| Layer    | Choice                                                          |
| -------- | --------------------------------------------------------------- |
| Build    | Vite 8                                                          |
| UI       | React 19, shadcn/ui (`base-nova` style) on Base UI              |
| Styling  | Tailwind CSS v4 with light and dark theme tokens                |
| Language | TypeScript 7 in strict mode                                     |
| Routing  | TanStack Router, file-based and code-split per route            |
| Data     | TanStack Query and Axios                                        |
| Forms    | TanStack Form with Zod validation                               |
| Tables   | TanStack Table                                                  |
| Tests    | Vitest and Testing Library                                      |
| Lint     | Oxlint with [`@shadcn/lint`](https://github.com/shadcn-ui/lint) |
| Format   | oxfmt, which also sorts Tailwind classes                        |
| Hooks    | Lefthook, which formats and lints staged files on commit        |

## Environment variables

Copy `.env.example` to `.env` and fill in what you need. `.env` is ignored by Git.

| Variable         | Required | Used for                                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------------------- |
| `VITE_API_URL`   | No       | Where API requests go. Defaults to the PokéAPI. Set it to `/api` to use your backend. |
| `REGISTRY_TOKEN` | No       | Installing 7Ovr Pro blocks. Read by the shadcn CLI, not by the app.                   |

Only variables starting with `VITE_` reach the app, as `import.meta.env.VITE_*`. They end up in the browser, so never put secrets in them.

With `VITE_API_URL=/api`, the dev server forwards every `/api` request to `http://localhost:8080`. Change the target in `vite.config.ts` if your backend runs elsewhere.

## Scripts

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Start the dev server, with the TanStack devtools              |
| `pnpm build`        | Typecheck, then build the site to `dist/`                     |
| `pnpm preview`      | Serve the production build locally                            |
| `pnpm test`         | Run the tests once (they need network access for the PokéAPI) |
| `pnpm test:watch`   | Run the tests and rerun them on every change                  |
| `pnpm lint`         | Lint the code                                                 |
| `pnpm lint:fix`     | Lint and fix what can be fixed automatically                  |
| `pnpm typecheck`    | Check the types                                               |
| `pnpm format`       | Format every file                                             |
| `pnpm format:check` | Check the formatting without changing files                   |

## Project layout

```
src/
├── routes/                     One file per page
│   ├── __root.tsx              Header, not found page and error page
│   ├── (marketing)/            Full-width pages, like the block-built home page
│   └── (app)/                  Pages in the app layout, like the Pokémon example
├── components/
│   ├── blocks/                 Installed 7Ovr blocks, yours to edit
│   └── ui/                     shadcn/ui components and their variants
├── features/pokemon/           The example feature
│   ├── api/                    API calls and queries
│   ├── components/             Search form, table and detail view
│   └── lib/                    Types, validation and formatting
├── integrations/               Axios, Query client, router, test setup
├── lib/                        Shared helpers, config and the query key factory
├── types/                      Type declarations for environment variables
├── route-tree.gen.ts           Generated from src/routes, do not edit
├── index.tsx                   Starts the app
└── index.css                   Tailwind and the theme tokens
```

## Architecture

The app is a single-page application: the server sends one HTML file and the browser handles every page from there.

**Start-up.** `src/index.tsx` renders the app with the shared Query client and router from `src/integrations/`.

**Pages.** The router builds its pages from the files in `src/routes/`. Folders in parentheses group pages that share a layout without changing their URL: `(marketing)` pages run full width, `(app)` pages sit in a centred container. Each page is its own bundle, loaded when you first visit or hover a link to it.

**Data.** Every request goes through one Axios client. A page's loader starts its requests before the page renders, in one of two ways:

- **Most pages don't wait.** `/pokemon` starts loading the list and renders at once. Only the table shows a loading state, and if the request fails only the table shows an error with a retry button.
- **Some pages must wait.** `/pokemon/$name` waits for its Pokémon, because an unknown name has to show a proper "not found" page instead of an empty one.

**Features.** Each feature keeps its API calls, queries, components and types together in `src/features/<name>/`. To remove the example, delete `src/features/pokemon/` and `src/routes/(app)/_app/pokemon/`, and take its link out of `src/components/site-header.tsx`.

## Add blocks from 7Ovr

The 7Ovr registry is already set up in `components.json`. Install any free block by name:

```bash
pnpm dlx shadcn@latest add @7ovr/hero-2
```

The source lands in `src/components/blocks/`. Import it into a page:

```tsx
import HeroBlock from '@/components/blocks/hero-2'
```

Browse every block at [7ovr.com/blocks](https://7ovr.com/blocks).

For Pro blocks, set `REGISTRY_TOKEN` in `.env` to the token from your 7Ovr account, then install from the Pro registry:

```bash
pnpm dlx shadcn@latest add @7ovr-pro/<name>
```

## Deploy

`pnpm build` writes a static site to `dist/`. Because pages are handled in the browser, the host must answer every path with `index.html`, or refreshing any page but the home page returns a 404:

- **Vercel**: add a `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- **Netlify**: add a `public/_redirects` file containing `/* /index.html 200`.
- **Anything else**: set up a fallback to `index.html`.

## Theme

Colours come from CSS variables in `src/index.css`, with a light and a dark set. Change them there and every component and block follows. Press `d` to switch between light and dark, or use the button in the header.

## License

[MIT](LICENSE)
