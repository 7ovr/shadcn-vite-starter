# CLAUDE.md

How to write code in this repository: conventions, patterns and constraints. Setup, scripts and architecture for people are in [README.md](README.md). This file is the single source of guidance for every agent; `AGENTS.md` points here.

## Constraints

- **pnpm only.** Node 24 or newer, pnpm 12 or newer. Never use npm or yarn. Run one-off CLIs with `pnpm dlx`.
- **TypeScript 7**, strict. `any` is a lint error. Use `import type` for type-only imports (enforced).
- **Oxlint and oxfmt.** Lint with Oxlint and [`@shadcn/lint`](https://github.com/shadcn-ui/lint), format with oxfmt. Do not add ESLint, Prettier or typescript-eslint.
- **Client-rendered SPA.** Vite 8 with TanStack Router. There is no server rendering.
- **Fresh releases wait a day.** pnpm refuses versions published in the last 24 hours. Pick an older version or wait. Never add `minimumReleaseAgeExclude`.
- **Stop the dev server before creating route files in bulk.** Its route generator fills any empty file in `src/routes/` with a placeholder, and a file that is being written counts as empty for a moment.

## Code conventions

- **kebab-case filenames**, such as `page-header.tsx`. TanStack route conventions like `__root.tsx`, `_layout.tsx`, `(group)/` and `$id.tsx` are the only exception.
- **Always import through the `@/` alias**, which maps to `src/*`. No relative imports, not even inside a feature folder.
- **Colocate tests** with the file they cover: `app-shell-1.test.tsx` sits next to `app-shell-1.tsx`. Never put tests in `src/routes/`, because the router plugin treats every file there as a route. Test routes from `src/integrations/router.test.tsx` or the feature folder.
- **Formatting** is oxfmt: 2-space indent, single quotes, trailing commas, 100-character lines, no semicolons. The pre-commit hook formats staged files; `pnpm format` does the whole repo.
- **Comments only when really necessary**, one line at most, and never a ticket or issue reference. Prefer a clearer name over an explanation.
- **No em dashes anywhere**: code, comments, UI copy, docs, commits and PRs. Use a plain hyphen or rephrase. The only exception is vendored third-party content, the installed skills in `.claude/skills/` and `.agents/skills/`, which we never hand-edit.
- **English only, in Title Case for labels**, capitalising every word: headings, titles, buttons, links, navigation, field labels, table headers, badges and the `aria-label` of a control, such as "Report An Issue" and "Open On GitHub". Sentences stay in sentence case: descriptions, error messages, captions, helper text and status lines like "Page 1 of 16". Write Title Case in the source, not with the CSS `capitalize` class, so the text people and screen readers get matches the screen.
- **Docs are for humans.** The README and other docs are written for people using, supporting or deploying the project: plain language, concise, easy to follow. Guidance for whoever writes code belongs in this file.
- **Commits** follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`). No `Co-Authored-By` lines in commits or PRs; `.claude/settings.json` turns Claude Code's attribution off. Never bypass the hooks with `--no-verify`.

## Architecture

### Routing

- Routes live in `src/routes/`, one file each, created with `createFileRoute`. The plugin regenerates `src/route-tree.gen.ts`; commit it, never edit it.
- The root route renders every page inside the app shell, `src/components/app-shell-1.tsx`, wrapped in `TooltipProvider` for the collapsed sidebar's tooltips.
- A new page needs its route file and an entry in `NAV_ITEMS` in `src/lib/navigation.ts`, which drives the sidebar and the command menu. External links go in `RESOURCES` in the same file.
- Route groups in parentheses, like `(group)/`, share a layout without adding a URL segment. Layout routes take an underscore prefix, like `_layout.tsx`, and their children live in the matching `_layout/` folder.
- Every page renders exactly one `<h1>` and sets its title and description through the route's `head` option with `pageMeta` from `src/lib/meta.ts`, which renders `Tech Stack - 7Ovr Starter` (a hyphen, never a pipe) (the Home page is just `7Ovr Starter`). Do not add a static description to `index.html`; the root route provides the default. Pages open with `PageHeader` and group their content in `Section`s: outlined `rounded-xl border` surfaces on the page background and `IconTile` for list icons. The shell caps content at `max-w-4xl`.
- Every route catches its own errors: the router's `defaultErrorComponent` is `RouteError`, so a failed loader shows an error inside the shell and the sidebar stays. Its retry calls `router.invalidate()`, which re-runs the loader; `reset()` alone would throw the same error again.
- Validate route params before they reach a request, and turn one that fails into `notFound()`. Encode params in a URL path with `encodeURIComponent`, because the router decodes `%2F` into a real slash.

### Data fetching

Query options live in `src/features/*/api/queries.ts` and build their keys with `createQueryKeys` from `src/lib/key-factory.ts`. The loader starts the request, and how it starts decides whether navigation waits.

**Default to deferred.** Call `prefetchQuery` without awaiting it. The cache warms while the route transitions, so navigation is instant and the page renders around the data. Home does this for the Pokémon table:

```tsx
export const Route = createFileRoute('/')({
  validateSearch: pokemonSearchSchema,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1, size: search.size ?? DEFAULT_PAGE_SIZE }),
  loader: ({ context: { queryClient }, deps }) => {
    void queryClient.prefetchQuery(pokemonPageOptions(deps.page, deps.size))
  },
  component: HomePage,
})

// In the table: the same options, so the component reads what the loader started.
const query = useQuery(pokemonPageOptions(page, size))
```

A component that reads the query with `useQuery` owns all three states: `Skeleton` rows while `data` is undefined, a `SectionState` with Try Again when `isError`, and the rows otherwise. `placeholderData: keepPreviousData` keeps the current page on screen while the next one loads, so paging never flashes a skeleton. A component that only needs part of the result passes `select`, as Home's count badge does with `select: (data) => data.total`.

**Block only when the route cannot render without the data**: a detail page that must 404 on a missing record, or a permission check. Await `ensureQueryData` so the router waits, turn a 404 into `notFound()`, and let the route's `pendingComponent` cover the wait.

Rules that follow from this:

- `prefetchQuery` is the fire-and-forget call, not `ensureQueryData`. It swallows errors internally, so an unawaited rejection cannot become an unhandled promise rejection.
- Never await a `prefetchQuery`. That blocks navigation and gives up the whole benefit.
- Pass the `signal` from the `queryFn` context to Axios, so a request for a page nobody is looking at any more is cancelled.
- Cache each record under its own key when a list is assembled from per-record requests. `pokemonPageOptions` fetches each Pokémon through `client.fetchQuery(pokemonOptions(name))`, so a new page size or a retry only fetches what is missing.
- The Query client retries a failed query once (`src/integrations/query-client.ts`): enough for a dropped request, without making a real outage wait through several. Tests turn retries off.

### Features

Each feature is self-contained under `src/features/<name>/`:

- `api/api.ts`: HTTP calls through the shared Axios client, mapping raw responses into the feature's own types.
- `api/queries.ts`: `queryOptions` factories (`queryKey` plus `queryFn`) and any mutation hooks. Reuse the same options object for loaders, hooks and invalidation, and invalidate through the key factory scope.
- `components/`: the feature's components.
- `lib/`: feature types, Zod schemas and small helpers.

Shared code lives in `src/lib/` (utilities, config, the key factory, the theme context, test helpers) and hooks in `src/hooks/`. Singletons live in `src/integrations/`: the Axios client, the Query client, the router and the Vitest setup.

The theme is split so every file exports one kind of thing: `src/lib/theme.ts` holds the context, types and storage helpers, `src/components/theme-provider.tsx` the provider and `src/hooks/use-theme.ts` the hook. The inline script in `index.html` sets the theme class before the first paint and must read the same `THEME_STORAGE_KEY`. Storage access is wrapped in try/catch, because a browser that blocks storage would otherwise crash the whole app.

### Design-system lint

`@shadcn/lint` checks Tailwind usage against the design system. All six rules are errors and gate CI: `no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-unknown-classes`, `require-static-classes` and `no-inline-styles`. The codebase is at zero findings; keep it there rather than downgrading a rule.

`no-restyle` runs with no allowlist: a shadcn component accepts no `className` from outside. Not colour, not typography, not spacing, and not layout or margin either. When a page needs a different treatment there are two ways out:

- **Add a variant** to the component in `src/components/ui/` and pass it. Existing ones, which a `shadcn add` overwrite drops and you must re-apply: `Button` `success`/`warning`/`info`, plus `aria-disabled` styles; `Badge` `subtle` and `success`/`warning`/`info`, plus `size="sm"`; `Skeleton` `fill`; `EmptyTitle` `size` plus a `level` prop that renders it as a heading; `Table` `layout="fixed"`; `TableHead`/`TableCell` `hideOnMobile`; `TabsList` `variant="pill"` (wraps onto more lines); `Textarea` `resizable`; `Pagination` `align`; `CommandList` `max-h-96`.
- **Put the layout classes on a plain wrapper element** around the component. This is right for one-off positioning, such as `<div className="w-full max-w-sm"><Card>`, and always for `Skeleton`, whose size belongs to the surrounding layout.

`src/components/ui/` is ignored by the linter, because those files define the variants the rules enforce. It is the one place where editing generated shadcn files is expected. Switching presets or re-running `shadcn add` overwrites them and silently drops the variants; `pnpm typecheck` catches it, because call sites keep passing props the regenerated component no longer accepts. Re-apply the variants to the new files rather than reverting.

Also:

- Base UI takes `render`, not `asChild`. For navigation, style a router `Link` with `buttonVariants()`; `<Button render={<Link />}>` makes the link report itself as a button.
- Use theme tokens such as `bg-muted` and `text-success`, never raw colours. Status colours are `success`, `warning`, `info` and `destructive` in `src/index.css`, each with a `-foreground` pair for text on a solid fill. `Badge` and `Button` have a variant for each, styled like `destructive`: a tinted fill with coloured text. Brand marks all live in `src/components/icons.tsx` (`LogoMark`, `GitHubIcon`, `ReactIcon` and so on). They keep their official colours, so `.oxlintrc.json` exempts that one file from `no-raw-colors`.
- The theme is 7Ovr's: Oxanium is `font-sans` and the 7Ovr wordmark uses `font-brand` (Syne Bold). `src/index.css` declares Oxanium's `@font-face` itself, with `ascent-override: 84%` and `descent-override: 16%` so capitals sit centred next to icons; do not import `@fontsource-variable/oxanium` directly, it would bring the uncorrected metrics back. There is no monospace font: never use `font-mono`, code snippets render through `Code` in the UI font. `text-sm` is 13px (set in `src/index.css`), so labels stay compact. Card and list body text uses `text-soft-foreground`; `text-muted-foreground` is for meta lines and captions.
- Tool names, packages and descriptions live once in `TECH_STACK` (`src/features/tech-stack/lib/tech-stack.ts`); the Tech Stack page reads it.
- **Tables** use `Table layout="fixed"` so columns keep their width as rows change. With TanStack Table, give each column `meta: { width, hideOnMobile }` (typed in `src/components/table-columns.tsx`), render `<TableColGroup columns={...} />` from the same metadata and pass `hideOnMobile` to `TableHead` and `TableCell`; one column has no width and takes the rest. Set `getRowId` from the record's id. `TableHead` is already muted and small, so headers need no wrapper.
- Section headings with a count use `Section count={items.length}` rather than a hand-made badge.
- **State views use the shadcn `Empty` component**: not found, errors, empty lists and any other "nothing to show" state. Both go through `src/components/state-view.tsx`: `PageState` for a whole page, which renders the page's `<h1>`, and `SectionState` for a state inside a section, such as a failed table or a search with no results. Every state view offers one way out as a primary `Button` (or a router `Link` styled with `buttonVariants()`), such as Try Again, Back Home or Clear Filters. Loading states use `Skeleton`.
- Icon-only buttons need an `aria-label`. Sortable table headers set `aria-sort`.
- Render the TanStack devtools without an environment check: both render nothing outside development. The root route hides them on phones through `useIsMobile`, because their buttons would cover the page.
- Keep the first download small. Anything heavy that is not needed on every page loads on first use with `React.lazy`, as `CommandMenu` (cmdk) and `IssueDialog` (the form and full Zod) do in `app-shell-1.tsx`. Pair `useLazyDialog` with `LazyMount`: the dialog stays mounted after first use so closing can animate, and a chunk that fails to load drops the dialog instead of the whole shell. Schemas in route config, such as `validateSearch`, use `zod/mini`, because route config ships with every page.
- Add shadcn components with `pnpm dlx shadcn@latest add <name>`.

### 7Ovr blocks

Install with `pnpm dlx shadcn@latest add @7ovr/<name>`; they land in `src/components/blocks/`. Once a block is adapted into the app, move it up into `src/components/` (as `app-shell-1.tsx` was) so the full design-system lint applies.

- **Never let an install overwrite `src/components/ui/`.** Blocks list `button`, `badge` and similar as dependencies, so the CLI asks to overwrite them. Answer no, and never pass `--overwrite`: our copies carry variants such as `Badge` `subtle`, and overwriting drops them.
- Run `pnpm format` after adding a block. The registry ships double quotes; the pre-commit hook fixes that too, but CI checks formatting.
- Point placeholder calls to action at real pages, as `<a>` or a router `Link` styled with `buttonVariants()`. Pro blocks come from `@7ovr-pro` and need `REGISTRY_TOKEN` in `.env`. Blocks ship their own styling, so `.oxlintrc.json` turns off five of the six design-system rules for them; `no-unknown-classes` still applies.

### Tests

- **Tests come first.** Before writing the code for a feature or a fix, write the test that describes the behaviour and watch it fail. Then write the code that makes it pass. A bug fix starts with a test that reproduces the bug.
- **Do not test shadcn/ui or Base UI primitives.** `src/components/ui/` is vendored and tested upstream: do not check that a `Button` clicks, a `Select` opens or a `Dialog` traps focus. Test the behaviour we build on top of them, such as what a page shows, where a link goes and what a filter does.
- Vitest with Testing Library. Query by role and label, the way people use the page. Render a real route with `renderRoute(path)` from `@/lib/test-utils`.
- Tests never touch the network. `src/integrations/test-setup.ts` installs a fake PokéAPI (`src/features/pokemon/api/fake-poke-api.ts`) before every test; a test that needs a failure overrides it with a one-off `vi.spyOn(http, 'get')`. Spies are restored after every test. Trust the real API; test what our code does with its responses.
- `src/integrations/test-setup.ts` stubs the browser APIs jsdom lacks (`scrollTo`, `matchMedia`, `ResizeObserver`, `scrollIntoView`). Add to it when a new component needs another one.

## Skills

Skills for agents working here live in two identical folders: `.claude/skills/` for Claude Code and `.agents/skills/` for every other agent. They are `vercel-react-best-practices`, `vercel-composition-patterns`, `shadcn` and `improve`, pinned in `skills-lock.json`.

- Add or update a vendored skill for both folders at once, as real files: `pnpm dlx skills add <repo> --skill <name> --agent claude-code universal --copy`. Never hand-edit vendored skills.

## Before you finish

Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test` and `pnpm build`. `pnpm lint` fails on any warning, so the codebase stays at zero findings. CI runs the same checks on every push and pull request.
