# shadcn-vite-starter

A React starter with the stack already wired: Vite, TypeScript, TanStack Router, Query, Form and Table, and shadcn/ui on Base UI. It ships a page built from six free [7Ovr](https://7ovr.com) blocks and a working example of the whole data flow, so you can start on the product instead of the setup.

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
| Data     | TanStack Query, wired into the router                           |
| Forms    | TanStack Form with Zod validation                               |
| Tables   | TanStack Table                                                  |
| Tests    | Vitest and Testing Library                                      |
| Lint     | Oxlint with [`@shadcn/lint`](https://github.com/shadcn-ui/lint) |
| Format   | oxfmt, which also sorts Tailwind classes                        |
| Hooks    | Lefthook, which formats and lints staged files on commit        |

## Environment variables

Copy `.env.example` to `.env` and fill in what you need. `.env` is ignored by Git.

| Variable         | Required | Used for                                                            |
| ---------------- | -------- | ------------------------------------------------------------------- |
| `REGISTRY_TOKEN` | No       | Installing 7Ovr Pro blocks. Read by the shadcn CLI, not by the app. |

Variables the app itself should read must start with `VITE_`. Vite exposes those to the browser as `import.meta.env.VITE_*`, so never put secrets in them.

## Scripts

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start the dev server, with the TanStack devtools |
| `pnpm build`        | Typecheck, then build the site to `dist/`        |
| `pnpm preview`      | Serve the production build locally               |
| `pnpm test`         | Run the tests once                               |
| `pnpm test:watch`   | Run the tests and rerun them on every change     |
| `pnpm lint`         | Lint the code                                    |
| `pnpm lint:fix`     | Lint and fix what can be fixed automatically     |
| `pnpm typecheck`    | Check the types                                  |
| `pnpm format`       | Format every file                                |
| `pnpm format:check` | Check the formatting without changing files      |

## Project layout

```
src/
├── routes/                 One file per page
│   ├── __root.tsx          Layout, header and the not found page
│   ├── index.tsx           Home page, built from 7Ovr blocks
│   └── waitlist.tsx        The example feature's page
├── components/
│   ├── blocks/             Installed 7Ovr blocks, yours to edit
│   └── ui/                 shadcn/ui components
├── features/waitlist/      The example feature: API, queries, schema, form, table
├── lib/                    Shared helpers and the query client
├── test/                   Test setup and the render helper
├── router.tsx              Creates the router
├── route-tree.gen.ts       Generated from src/routes, do not edit
├── main.tsx                Starts the app
└── index.css               Tailwind and the theme tokens
```

## Architecture

The app is a single-page application: the server sends one HTML file and the browser handles every page from there.

1. `main.tsx` creates one TanStack Query client and the router, passes the client to the router, and renders the app inside the theme provider.
2. The router builds its pages from the files in `src/routes/`. Each page is its own bundle, loaded when you first visit or hover a link to it.
3. Before a page renders, its `loader` fetches the data it needs into the Query cache, so the page appears with its data and no loading flash.
4. Components read that data from the cache. When something changes it, such as a form submission, a mutation updates the server and marks the cached data stale, and Query fetches it again.

`/waitlist` shows the whole loop. The form validates with Zod and submits through a mutation, and the table renders the list and sorts it by any column. The API behind it in `src/features/waitlist/api.ts` is an in-memory stand-in. Replace those functions with `fetch` calls to your backend and the rest keeps working.

To remove the example, delete `src/features/waitlist/` and `src/routes/waitlist.tsx`, and take its link out of `src/components/site-header.tsx`.

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
