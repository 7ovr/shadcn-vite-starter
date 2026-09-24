import {
  BracesIcon,
  PaintbrushIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  WaypointsIcon,
} from 'lucide-react'

import {
  type BrandMark,
  BaseUiIcon,
  LefthookIcon,
  ReactIcon,
  ShadcnIcon,
  TailwindIcon,
  TanStackIcon,
  TypeScriptIcon,
  ViteIcon,
  VitestIcon,
} from '@/components/icons'

export type Tool = {
  name: string
  description: string
  href: string
  Mark: BrandMark
}

export type ToolGroup = { title: string; description: string; tools: Tool[] }

export const TECH_STACK: ToolGroup[] = [
  {
    title: 'Core',
    description: 'The runtime, the language and the build.',
    tools: [
      {
        name: 'React',
        description: 'UI runtime, on React 19 with use and useEffectEvent.',
        href: 'https://react.dev',
        Mark: ReactIcon,
      },
      {
        name: 'TypeScript',
        description: 'Strict mode, checked by the native TypeScript 7 compiler.',
        href: 'https://www.typescriptlang.org',
        Mark: TypeScriptIcon,
      },
      {
        name: 'Vite',
        description: 'Dev server and Rolldown production builds.',
        href: 'https://vite.dev',
        Mark: ViteIcon,
      },
    ],
  },
  {
    title: 'Routing And Data',
    description: 'Type-safe routes, server state and forms.',
    tools: [
      {
        name: 'TanStack Router',
        description: 'File-based routes in src/routes, with loaders and code splitting.',
        href: 'https://tanstack.com/router',
        Mark: TanStackIcon,
      },
      {
        name: 'TanStack Query',
        description: 'Server state, caching and prefetching from route loaders.',
        href: 'https://tanstack.com/query',
        Mark: TanStackIcon,
      },
      {
        name: 'TanStack Form',
        description: 'Type-safe forms validated with Zod, like Report An Issue in the sidebar.',
        href: 'https://tanstack.com/form',
        Mark: TanStackIcon,
      },
      {
        name: 'TanStack Table',
        description: 'Headless tables for sorting, filtering and pagination.',
        href: 'https://tanstack.com/table',
        Mark: TanStackIcon,
      },
      {
        name: 'Axios',
        description: 'The HTTP client in src/integrations/axios.ts.',
        href: 'https://axios-http.com',
        Mark: WaypointsIcon,
      },
      {
        name: 'Zod',
        description: 'Schemas for forms, search params and API data.',
        href: 'https://zod.dev',
        Mark: ShieldCheckIcon,
      },
    ],
  },
  {
    title: 'Interface',
    description: 'Components, primitives and styling.',
    tools: [
      {
        name: 'shadcn/ui',
        description: 'Components in the base-nova style, yours to edit in src/components/ui.',
        href: 'https://ui.shadcn.com',
        Mark: ShadcnIcon,
      },
      {
        name: 'Base UI',
        description: 'Accessible, unstyled primitives under every component.',
        href: 'https://base-ui.com',
        Mark: BaseUiIcon,
      },
      {
        name: 'Tailwind CSS',
        description: 'Themed with the 7Ovr tokens in src/index.css.',
        href: 'https://tailwindcss.com',
        Mark: TailwindIcon,
      },
    ],
  },
  {
    title: 'Quality',
    description: 'Checks that run in the editor, on commit and in CI.',
    tools: [
      {
        name: 'Vitest',
        description: 'Unit and component tests with Testing Library and jsdom.',
        href: 'https://vitest.dev',
        Mark: VitestIcon,
      },
      {
        name: 'Oxlint',
        description: 'Fast linting, with @shadcn/lint enforcing the design system.',
        href: 'https://oxc.rs/docs/guide/usage/linter',
        Mark: ScanSearchIcon,
      },
      {
        name: 'oxfmt',
        description: 'Formatting, with Tailwind classes sorted.',
        href: 'https://oxc.rs/docs/guide/usage/formatter',
        Mark: PaintbrushIcon,
      },
      {
        name: 'Lefthook',
        description: 'Git hooks that format and lint staged files on commit.',
        href: 'https://lefthook.dev',
        Mark: LefthookIcon,
      },
      {
        name: 'GitHub Actions',
        description: 'CI runs lint, format check, typecheck, tests and build.',
        href: 'https://docs.github.com/actions',
        Mark: BracesIcon,
      },
    ],
  },
]
