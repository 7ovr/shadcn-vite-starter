import { createFileRoute } from '@tanstack/react-router'
import {
  FlaskConicalIcon,
  PackageIcon,
  PaintbrushIcon,
  PlayIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
} from 'lucide-react'

import { Code } from '@/components/code'
import { CopyButton } from '@/components/copy-button'
import { LogoMark } from '@/components/icons'
import { ItemCard } from '@/components/item-card'
import { PageHeader } from '@/components/page-header'
import { Section } from '@/components/section'
import { StatusTokens } from '@/components/status-tokens'
import { Badge } from '@/components/ui/badge'
import { pageMeta } from '@/lib/meta'

export const Route = createFileRoute('/get-started')({
  head: () =>
    pageMeta({
      title: 'Get Started',
      description:
        'Install, run and extend the starter in four steps, with every script and status token explained.',
    }),
  component: GetStartedPage,
})

const STEPS: {
  title: string
  label?: React.ReactNode
  code: string
  copy?: boolean
  requires?: string[]
}[] = [
  {
    title: 'Install Dependencies',
    code: 'pnpm install',
    copy: true,
    requires: ['Node 24+', 'Pnpm 12+'],
  },
  { title: 'Start The Dev Server', code: 'pnpm dev', copy: true },
  { title: 'Make A Page Yours', code: 'src/routes/index.tsx' },
  {
    title: 'Add 7Ovr Blocks & Templates',
    // The mark stands in for the word, so screen readers get the name from the hidden text.
    label: (
      <span className="inline-flex items-center gap-1.5">
        Add
        <span>
          <LogoMark className="size-3.5" />
          <span className="sr-only">7Ovr</span>
        </span>
        Blocks & Templates
      </span>
    ),
    code: 'pnpm dlx shadcn@latest add @7ovr/hero-1',
    copy: true,
  },
]

const SCRIPTS = [
  { name: 'pnpm dev', icon: PlayIcon, description: 'Start the dev server with hot reload.' },
  { name: 'pnpm build', icon: PackageIcon, description: 'Typecheck, then build for production.' },
  { name: 'pnpm test', icon: FlaskConicalIcon, description: 'Run the whole Vitest suite once.' },
  { name: 'pnpm lint', icon: ScanSearchIcon, description: 'Lint the code with the design rules.' },
  { name: 'pnpm format', icon: PaintbrushIcon, description: 'Format every file and sort classes.' },
  {
    name: 'pnpm typecheck',
    icon: ShieldCheckIcon,
    description: 'Check every type in strict mode.',
  },
]

function GetStartedPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <PageHeader title="Get Started" />
        <Section title="Setup" count={STEPS.length}>
          <ol className="flex flex-col divide-y rounded-xl border">
            {STEPS.map((step) => (
              <li
                key={step.title}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{step.label ?? step.title}</p>
                  {step.requires?.map((requirement) => (
                    <Badge key={requirement} variant="subtle" size="sm">
                      {requirement}
                    </Badge>
                  ))}
                </div>
                <div className="flex min-w-0 items-center gap-1">
                  <Code>{step.code}</Code>
                  {step.copy ? (
                    <CopyButton value={step.code} label={`Copy ${step.code}`} />
                  ) : (
                    // Keeps the chips in one column when a row has nothing to copy.
                    <span aria-hidden="true" className="size-6 max-sm:hidden" />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section title="Scripts" count={SCRIPTS.length}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SCRIPTS.map((script) => (
            <li key={script.name} className="grid">
              <ItemCard
                icon={script.icon}
                title={script.name}
                description={script.description}
                action={<CopyButton value={script.name} label={`Copy ${script.name}`} />}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Status Tokens">
        <StatusTokens />
      </Section>
    </div>
  )
}
