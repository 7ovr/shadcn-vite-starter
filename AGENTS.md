# AGENTS.md

How to write code in this repository: conventions, patterns and constraints. Setup, scripts and architecture for people are in [README.md](README.md). This file is the single source of guidance for every agent; there is no `CLAUDE.md`.

## Constraints

- **pnpm only.** Node 24 or newer, pnpm 12 or newer. Never use npm or yarn. Run one-off CLIs with `pnpm dlx`.
- **TypeScript 7**, strict. `any` is a lint error. Use `import type` for type-only imports (enforced).
- **Oxlint and oxfmt.** Lint with Oxlint and [`@shadcn/lint`](https://github.com/shadcn-ui/lint), format with oxfmt. Do not add ESLint, Prettier or typescript-eslint.
- **Client-rendered SPA.** Vite 8 with TanStack Router. There is no server rendering.
- **Fresh releases wait a day.** pnpm refuses versions published in the last 24 hours. Pick an older version or wait. Never add `minimumReleaseAgeExclude`.
- **Stop the dev server before creating route files in bulk.** Its route generator fills any empty file in `src/routes/` with a placeholder, and a file that is being written counts as empty for a moment.

## Code conventions

- **kebab-case filenames**, such as `pokemon-search.tsx`. TanStack route conventions like `__root.tsx`, `_app.tsx`, `(app)/` and `$name.tsx` are the only exception.
- **Always import through an alias.** `@/` maps to `src/*` and `@locales/` to `public/locales/*`. No relative imports, not even inside a feature folder.
- **Colocate tests** with the file they cover: `use-mobile.test.ts` sits next to `use-mobile.ts`. Never put tests in `src/routes/`, because the router plugin treats every file there as a route. Test routes from `src/integrations/router.test.tsx` or the feature folder.
- **Formatting** is oxfmt: 2-space indent, single quotes, trailing commas, 100-character lines, no semicolons. The pre-commit hook formats staged files; `pnpm format` does the whole repo.
- **Comments only when really necessary**, one line at most, and never a ticket or issue reference. Prefer a clearer name over an explanation.
- **No em dashes anywhere**: code, comments, UI copy, translations, docs, commits and PRs. Use a plain hyphen or rephrase. The only exception is vendored third-party content, the installed skills in `.claude/skills/` other than our own `sync-translations`, which we never hand-edit.
- **Docs are for humans.** The README and other docs are written for people using, supporting or deploying the project: plain language, concise, easy to follow. Guidance for whoever writes code belongs in this file.
- **Commits** follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`). No `Co-Authored-By` lines in commits or PRs; `.claude/settings.json` turns Claude Code's attribution off. Never bypass the hooks with `--no-verify`.

## Architecture

### Routing

- Routes live in `src/routes/`, one file each, created with `createFileRoute`. The plugin regenerates `src/route-tree.gen.ts`; commit it, never edit it.
- Route groups in parentheses, like `(app)/`, share a layout without adding a URL segment. Layout routes take an underscore prefix, like `_app.tsx`, and their children live in the matching `_app/` folder.
- `(marketing)/_marketing` renders full width for block pages; `(app)/_app` renders the centred app container.
- Every page renders exactly one `<h1>`.

### Data fetching

Query options live in `src/features/*/api/queries.ts` and build their keys with `createQueryKeys` from `src/lib/key-factory.ts`. The loader starts the request, and how it starts decides whether navigation waits.

**Default to deferred.** Call `prefetchQuery` without awaiting it. The cache warms while the route transitions, so navigation is instant and only the data-dependent subtree suspends:

```tsx
export const Route = createFileRoute('/(app)/_app/pokemon/')({
  loader: ({ context: { queryClient } }) => {
    void queryClient.prefetchQuery(pokemonListOptions())
  },
  component: PokemonPage,
})

// In the page: the heading renders at once, the table suspends.
<CatchBoundary getResetKey={() => 'pokemon-list'} errorComponent={ErrorFallback}>
  <Suspense fallback={<PendingFallback />}>
    <PokemonTable />
  </Suspense>
</CatchBoundary>
```

**Block only when the route cannot render without the data**: a detail page that must 404 on a missing record, or a permission check. Await `ensureQueryData` so the router waits, turn a 404 into `notFound()`, and let the route's `pendingComponent` cover the wait. See `src/routes/(app)/_app/pokemon/$name.tsx`.

Three rules follow from this:

- `prefetchQuery` is the fire-and-forget call, not `ensureQueryData`. It swallows errors internally, so an unawaited rejection cannot become an unhandled promise rejection.
- Never await a `prefetchQuery`. That blocks navigation and gives up the whole benefit.
- `useSuspenseQuery` throws on error instead of returning an error state, so a suspended subtree needs a `CatchBoundary` above it. Without one the error escapes to the route's `errorComponent` and replaces the entire page. `ErrorFallback` resets Query's error boundary so a retry fetches again.

### Features

Each feature is self-contained under `src/features/<name>/`:

- `api/api.ts`: HTTP calls through the shared Axios client, mapping raw responses into the feature's own types.
- `api/queries.ts`: `queryOptions` factories (`queryKey` plus `queryFn`) and any mutation hooks. Reuse the same options object for loaders, hooks and invalidation, and invalidate through the key factory scope.
- `components/`: the feature's components.
- `lib/`: feature types, Zod schemas and small helpers.

Shared code lives in `src/lib/` (utilities, config, the key factory, test helpers). Singletons live in `src/integrations/`: the Axios client, the Query client, the router, i18next and the Vitest setup.

### Internationalization

- Catalogs are static files in `public/locales/<lang>.json`, fetched at runtime by `i18next-http-backend`, so a deployment can fix a string without a rebuild. `src/index.tsx` awaits `initI18n()` before the first render, so nothing ever paints a raw key.
- **Keys are always flat**: `"pokemon.title": "Pokémon"`, never nested objects. `keySeparator` and `nsSeparator` are both `false` to enforce it.
- ICU MessageFormat handles plurals, selects and numbers. Use each language's plural categories.
- `src/types/i18next.d.ts` types `t()` from `en.json`, so keys autocomplete and `tsc` catches typos.
- Keys stay sorted alphabetically. `pnpm sort-messages` sorts them and the pre-commit hook runs it; `pnpm check-messages` fails in CI on unsorted files or catalogs whose keys differ from `en.json`.
- When `en.json` changes, use the `sync-translations` skill in `.claude/skills/` to update the other catalogs.
- Adding a language takes two steps: the catalog in `public/locales/`, and an entry in `SUPPORTED_LANGUAGES` in `src/lib/config.ts` with its `dir`. A catalog on its own is never loaded.
- **Zod messages hold translation keys, not translated text** (see `src/features/pokemon/lib/types.ts`), and components resolve them with `t()` at render. A form keeps whatever a field last validated to, so a message translated at validation time would stay in the old language after a switch.
- The installed 7Ovr blocks ship English copy. Move their strings into the catalogs when you adopt a block.

### Design-system lint

`@shadcn/lint` checks Tailwind usage against the design system. All six rules are errors and gate CI: `no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-unknown-classes`, `require-static-classes` and `no-inline-styles`. The codebase is at zero findings; keep it there rather than downgrading a rule.

`no-restyle` runs with no allowlist: a shadcn component accepts no `className` from outside. Not colour, not typography, not spacing, and not layout or margin either. When a page needs a different treatment there are two ways out:

- **Add a variant** to the component in `src/components/ui/` and pass it. For example, `Skeleton` has a `fill` variant.
- **Put the layout classes on a plain wrapper element** around the component. This is right for one-off positioning, such as `<div className="w-full max-w-sm"><Card>`, and always for `Skeleton`, whose size belongs to the surrounding layout.

`src/components/ui/` is ignored by the linter, because those files define the variants the rules enforce. It is the one place where editing generated shadcn files is expected. Switching presets or re-running `shadcn add` overwrites them and silently drops the variants; `pnpm typecheck` catches it, because call sites keep passing props the regenerated component no longer accepts. Re-apply the variants to the new files rather than reverting.

Also:

- Base UI takes `render`, not `asChild`. For navigation, style a router `Link` with `buttonVariants()`; `<Button render={<Link />}>` makes the link report itself as a button.
- Use theme tokens such as `bg-muted` and `text-success`, never raw colours. Status colours are `success`, `warning`, `info` and `destructive` in `src/index.css`.
- Icon-only buttons need an `aria-label`. Sortable table headers set `aria-sort`.
- Add shadcn components with `pnpm dlx shadcn@latest add <name>`.

### 7Ovr blocks

Install with `pnpm dlx shadcn@latest add @7ovr/<name>`; they land in `src/components/blocks/` and are ours to edit in place. Pro blocks come from `@7ovr-pro` and need `REGISTRY_TOKEN` in `.env`. Blocks are exempt from the design-system rules in `.oxlintrc.json`, since they ship their own styling.

### Tests

- Vitest with Testing Library. Query by role and label, the way people use the page. Render a real route with `renderRoute(path)` from `@/lib/test-utils`.
- Tests call the real PokéAPI. Its first-generation data never changes, so assertions on names, numbers and measurements stay stable. The suite needs network access.
- Only fake what a healthy API cannot produce, such as a failure or a request that never finishes, with a one-off `vi.spyOn(http, 'get')`. Spies are restored after every test.

## Skills

`.claude/skills/` holds skills for agents working here, pinned in `skills-lock.json`: `vercel-react-best-practices`, `vercel-composition-patterns`, `shadcn`, `improve`, and our own `sync-translations`. Add or update the vendored ones with `pnpm dlx skills add <repo> --skill <name> --agent claude-code --copy` and never hand-edit them.

## Before you finish

Run `pnpm lint`, `pnpm format:check`, `pnpm check-messages`, `pnpm typecheck`, `pnpm test` and `pnpm build`. CI runs the same checks on every push and pull request.
