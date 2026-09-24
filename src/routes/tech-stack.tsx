import { createFileRoute } from '@tanstack/react-router'
import {
  BlocksIcon,
  BotIcon,
  CircleAlertIcon,
  CommandIcon,
  DatabaseIcon,
  LinkIcon,
  SunMoonIcon,
  GitCommitHorizontalIcon,
  PaletteIcon,
  RouteIcon,
  TestTubeIcon,
  WorkflowIcon,
} from 'lucide-react'

import { FeatureList } from '@/components/feature-list'
import { PageHeader } from '@/components/page-header'
import { Section } from '@/components/section'
import { TechStackTable } from '@/features/tech-stack/components/tech-stack-table'
import { pageMeta } from '@/lib/meta'

export const Route = createFileRoute('/tech-stack')({
  head: () =>
    pageMeta({
      title: 'Tech Stack',
      description:
        'Every tool in the starter, from Vite and TanStack to Oxlint and Lefthook, and what each one does.',
    }),
  component: TechStackPage,
})

const HIGHLIGHTS = [
  {
    icon: RouteIcon,
    title: 'Type-Safe Routing',
    description: 'File-based routes with loaders, search params and code splitting.',
    meta: 'TanStack Router',
  },
  {
    icon: DatabaseIcon,
    title: 'Cached Server State',
    description: 'Loaders prefetch, pages render at once and data stays cached.',
    meta: 'TanStack Query',
  },
  {
    icon: PaletteIcon,
    title: 'Design-System Lint',
    description: 'Raw colours, arbitrary values and restyled components fail the build.',
    meta: 'Oxlint and @shadcn/lint',
  },
  {
    icon: TestTubeIcon,
    title: 'Tests That Render Routes',
    description: 'Component and route tests run against the real router.',
    meta: 'Vitest and Testing Library',
  },
  {
    icon: GitCommitHorizontalIcon,
    title: 'Checked On Commit',
    description: 'Staged files are formatted and linted before every commit.',
    meta: 'Lefthook',
  },
  {
    icon: WorkflowIcon,
    title: 'Checked In CI',
    description: 'Lint, format, typecheck, tests and build on every push.',
    meta: 'GitHub Actions',
  },
  {
    icon: LinkIcon,
    title: 'State In The URL',
    description: 'Page and page size live in the URL, validated with Zod.',
    meta: 'TanStack Router and Zod',
  },
  {
    icon: SunMoonIcon,
    title: 'Light And Dark Themes',
    description: 'Both themes come from tokens, load without a flash and switch with D.',
    meta: 'Tailwind CSS',
  },
  {
    icon: CircleAlertIcon,
    title: 'Error And Empty States',
    description: 'Failed loads offer a retry and unknown pages show a proper 404.',
    meta: 'shadcn/ui Empty',
  },
  {
    icon: CommandIcon,
    title: 'Command Menu',
    description: 'Jump to any page or action with Ctrl+K, from anywhere in the app.',
    meta: 'cmdk',
  },
  {
    icon: BlocksIcon,
    title: '7Ovr Registry',
    description: 'Free and Pro blocks install with one shadcn CLI command.',
    meta: 'shadcn CLI',
  },
  {
    icon: BotIcon,
    title: 'Agent Instructions',
    description: 'CLAUDE.md, AGENTS.md and four skills keep agents on convention.',
    meta: 'Claude Code, Codex and Cursor',
  },
]

function TechStackPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <PageHeader title="Tech Stack" />
        <TechStackTable />
      </div>
      <Section title="What's Wired" count={HIGHLIGHTS.length}>
        <FeatureList items={HIGHLIGHTS} />
      </Section>
    </div>
  )
}
