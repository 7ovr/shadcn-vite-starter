import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronRightIcon,
  CodeIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GitCommitHorizontalIcon,
  SettingsIcon,
  SparklesIcon,
  WorkflowIcon,
} from 'lucide-react'

import { IconTile } from '@/components/icon-tile'
import { ItemCard } from '@/components/item-card'
import { PageHeader } from '@/components/page-header'
import { Section } from '@/components/section'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { pageMeta } from '@/lib/meta'

export const Route = createFileRoute('/agentic-coding')({
  head: () =>
    pageMeta({
      title: 'Agentic Coding',
      description:
        'The instructions, skills and checks that keep Claude Code, Codex and Cursor on convention.',
    }),
  component: AgenticCodingPage,
})

const FILES = [
  {
    path: 'CLAUDE.md',
    icon: FileTextIcon,
    description: 'Conventions, architecture and the checks to run before finishing.',
    readBy: 'Claude Code',
  },
  {
    path: 'AGENTS.md',
    icon: FileTextIcon,
    description: 'Points Codex, Cursor and other agents to CLAUDE.md.',
    readBy: 'Codex, Cursor',
  },
  {
    path: '.claude/settings.json',
    icon: SettingsIcon,
    description: 'Turns off co-author lines on commits and pull requests.',
    readBy: 'Claude Code',
  },
]

const SKILLS = [
  {
    name: 'vercel-react-best-practices',
    source: 'vercel-labs/agent-skills',
    description: 'Performance rules for components, rendering and data fetching.',
  },
  {
    name: 'vercel-composition-patterns',
    source: 'vercel-labs/agent-skills',
    description: 'Component API design with compound components and context.',
  },
  {
    name: 'shadcn',
    source: 'shadcn-ui/ui',
    description: 'Adding, composing and styling shadcn/ui components and blocks.',
  },
  {
    name: 'improve',
    source: 'shadcn/improve',
    description: 'Read-only audits that turn findings into plans for an agent.',
  },
]

const STAGES = [
  {
    title: 'In The Editor',
    icon: CodeIcon,
    description: 'Errors show up while the agent writes the code.',
    checks: ['Oxlint', '@shadcn/lint', 'TypeScript Strict'],
  },
  {
    title: 'On Commit',
    icon: GitCommitHorizontalIcon,
    description: 'Lefthook formats and lints every staged file.',
    checks: ['oxfmt', 'Oxlint'],
  },
  {
    title: 'On Push',
    icon: WorkflowIcon,
    description: 'GitHub Actions runs the full set before merge.',
    checks: ['Lint', 'Format', 'Typecheck', 'Tests', 'Build'],
  },
]

function AgenticCodingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <PageHeader title="Agentic Coding" />
        <Section title="Instructions" count={FILES.length}>
          <ul className="flex flex-col divide-y rounded-xl border">
            {FILES.map((file) => (
              <li key={file.path} className="flex items-start gap-3 px-4 py-3">
                <IconTile>
                  <file.icon aria-hidden="true" />
                </IconTile>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-sm font-medium">{file.path}</p>
                  <p className="text-sm text-soft-foreground">{file.description}</p>
                  <p className="text-xs text-muted-foreground">Read by {file.readBy}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Skills" count={SKILLS.length}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SKILLS.map((skill) => (
            <li key={skill.name} className="grid">
              <ItemCard
                icon={SparklesIcon}
                title={skill.name}
                description={skill.description}
                meta={`by ${skill.source}`}
                action={
                  <a
                    href={`https://skills.sh/${skill.source}/${skill.name}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${skill.name} On skills.sh`}
                    className={buttonVariants({ variant: 'ghost', size: 'icon-xs' })}
                  >
                    <ExternalLinkIcon aria-hidden="true" />
                  </a>
                }
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Guardrails" count={STAGES.length}>
        <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-10">
          {STAGES.map((stage, index) => (
            <li
              key={stage.title}
              className="relative flex flex-1 basis-0 flex-col gap-3 rounded-xl border p-4"
            >
              {/* Centred in the gap before this stage, pointing on from the previous one. */}
              {index > 0 ? (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="absolute top-1/2 -left-7 hidden size-4 -translate-y-1/2 text-muted-foreground md:block"
                />
              ) : null}
              <div className="flex items-center gap-2">
                <IconTile size="sm">
                  <stage.icon aria-hidden="true" />
                </IconTile>
                <p className="text-sm font-semibold">{stage.title}</p>
              </div>
              <p className="text-sm text-soft-foreground">{stage.description}</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {stage.checks.map((check) => (
                  <Badge key={check} variant="secondary" size="sm">
                    {check}
                  </Badge>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}
