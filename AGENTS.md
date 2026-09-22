# AGENTS.md

How to write code in this repository: conventions, patterns and constraints. Setup, scripts and architecture for people are in [README.md](README.md). This file is the single source of guidance for every agent; there is no `CLAUDE.md`.

## Constraints

- **pnpm only.** Node 24 or newer, pnpm 12 or newer. Never use npm or yarn. Run one-off CLIs with `pnpm dlx`.
- **TypeScript 7**, strict. `any` is a lint error. Use `import type` for type-only imports (enforced).
- **Oxlint and oxfmt.** Lint with Oxlint and [`@shadcn/lint`](https://github.com/shadcn-ui/lint), format with oxfmt. Do not add ESLint, Prettier or typescript-eslint.
- **Client-rendered SPA.** Vite 8 with TanStack Router. There is no server rendering.
- **Fresh releases wait a day.** pnpm refuses versions published in the last 24 hours. Pick an older version or wait. Never add `minimumReleaseAgeExclude`.

## Code conventions

- **kebab-case filenames**, such as `waitlist-form.tsx`. TanStack route conventions like `__root.tsx` and `$id.tsx` are the only exception.
- **Always import through the `@/` alias**, which maps to `src/*`. No relative imports, not even inside a feature folder.
- **Colocate tests** with the file they cover: `use-mobile.test.ts` sits next to `use-mobile.ts`. Never put tests in `src/routes/`, because the router plugin treats every file there as a route. Test routes from `src/router.test.tsx` or the feature folder.
- **Formatting** is oxfmt: 2-space indent, single quotes, trailing commas, 100-character lines, no semicolons. The pre-commit hook formats staged files; `pnpm format` does the whole repo.
- **Comments only when really necessary**, one line at most, and never a ticket or issue reference. Prefer a clearer name over an explanation.
- **No em dashes anywhere**: code, comments, UI copy, translations, docs, commits and PRs. Use a plain hyphen or rephrase.
- **Docs are for humans.** The README and other docs are written for people using, supporting or deploying the project: plain language, concise, easy to follow. Guidance for whoever writes code belongs in this file.
- **Commits** follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`). No `Co-Authored-By` lines in commits or PRs. Never bypass the hooks with `--no-verify`.

## Patterns

### Routes

- One file per route in `src/routes/`, created with `createFileRoute`. The plugin regenerates `src/route-tree.gen.ts`; commit it, never edit it.
- Load data in the `loader` with `context.queryClient.ensureQueryData(xQueryOptions)`, then read it in the component with `useSuspenseQuery(xQueryOptions)`.
- Every page renders exactly one `<h1>`.

### Features

Group code by feature under `src/features/<name>/`:

- `api.ts`: the network calls, and nothing else.
- `queries.ts`: `queryOptions` objects and mutation hooks. Define each `queryOptions` once and reuse the same object for loaders, hooks and invalidation.
- `schema.ts`: Zod schemas shared by forms and API code.
- Components, such as `waitlist-form.tsx` and `waitlist-table.tsx`.

### Forms

TanStack Form with the Zod schema in `validators.onSubmit`. Render fields with the shadcn `Field`, `FieldLabel` and `FieldError` components, passing `field.state.meta.errors` to `FieldError`. Show server errors from the mutation, and catch them in `onSubmit` so nothing is left unhandled.

### Tables

TanStack Table v9: declare `tableFeatures(...)` and the columns at module scope, create the table with `useTable`, render cells through `table.FlexRender`, and use the shadcn `Table` components. Sortable headers set `aria-sort`.

### UI and styling

- Components are shadcn/ui on Base UI, `base-nova` style. Add them with `pnpm dlx shadcn@latest add <name>`. Do not hand-edit `src/components/ui/`; re-add a component with the CLI instead.
- Base UI takes `render`, not `asChild`. For navigation, style a router `Link` with `buttonVariants()`. `<Button render={<Link />}>` makes the link report itself as a button.
- `@shadcn/lint` enforces the theme:
  - `className` on a shadcn component is for layout and spacing; reach for a `variant` or `size` first.
  - Use theme tokens such as `bg-muted` and `text-success`, never raw colours or hex values.
  - No arbitrary values like `p-[13px]` where a scale value exists.
  - Class strings must be static; use `cn()` for conditional classes.
- Status colours are the `success`, `warning` and `info` tokens in `src/index.css`, alongside `destructive`.
- Icon-only buttons need an `aria-label`.

### 7Ovr blocks

Install with `pnpm dlx shadcn@latest add @7ovr/<name>`; they land in `src/components/blocks/` and are ours to edit in place. Pro blocks come from `@7ovr-pro` and need `REGISTRY_TOKEN` in `.env`. `src/components/ui/` and `src/components/blocks/` are exempt from the restyle rules in `.oxlintrc.json`.

### Tests

Vitest with Testing Library. Query by role and label, the way people use the page. Render a real route with `renderRoute(path)` from `@/test/render`. The in-memory waitlist API resets after every test.

## Before you finish

Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test` and `pnpm build`. CI runs the same checks on every push and pull request.
