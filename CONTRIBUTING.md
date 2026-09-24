# Contributing

Thanks for helping improve the 7Ovr Starter. Bug reports, ideas and pull requests are all welcome. Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

- **Found a bug or have an idea?** [Open an issue](https://github.com/7ovr/shadcn-vite-starter/issues/new/choose) first, as a Bug Report, Feature Request or Block Request, or use **Report An Issue** in the running app, which prefills one for you. Search the existing issues before opening a new one.
- **Planning a larger change?** Open an issue to discuss it before writing code, so your time is not spent on something that will not be merged.
- **Found a security problem?** Do not open a public issue. Follow [SECURITY.md](SECURITY.md) instead.

## Set up

You need Node 24 or newer and [pnpm](https://pnpm.io) 12 or newer.

```bash
git clone https://github.com/<your-username>/shadcn-vite-starter
cd shadcn-vite-starter
pnpm install
pnpm dev
```

Fork the repository first, then clone your fork. `pnpm install` also sets up the Git hooks that format and lint your changes on commit.

## Make your change

Work on a branch named after the change, such as `fix/command-menu-caps-lock` or `feat/settings-page`.

[CLAUDE.md](CLAUDE.md) holds every convention in this repository, for people and coding agents alike. The ones that matter most:

- **Tests come first.** Write the test that describes the behaviour, watch it fail, then make it pass. A bug fix starts with a test that reproduces the bug.
- **Test what we build, not the primitives.** Do not test that a shadcn/ui or Base UI component works; test what a page shows, where a link goes and what a filter does. Tests never touch the network.
- **Follow the design system.** `className` is for layout and spacing. Use a component's `variant` or `size`, and theme tokens rather than raw colours. `@shadcn/lint` enforces this.
- **Do not hand-edit `src/components/ui/`** beyond the variants listed in CLAUDE.md.
- **Keep comments to one line**, only where the code cannot explain itself.
- **Title Case** for button labels and headings, and **no em dashes** anywhere.

## Check your work

Run the same checks CI runs:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

`pnpm lint` fails on any warning. Never skip the Git hooks with `--no-verify`.

## Commit

Commits follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:` and so on. Write the subject in the imperative, as in `fix: open the command menu with Caps Lock on`, and keep each commit to one logical change.

## Open a pull request

1. Push your branch to your fork and open a pull request against `master`.
2. Describe what changed and why, and link the issue it closes.
3. Add screenshots for any visual change, in both light and dark mode.
4. Make sure CI passes. Workflows from forks run once a maintainer approves them.

The maintainer reviews every pull request and is the only one who can merge. Feedback may ask for changes; resolve each conversation before the pull request can be merged.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
