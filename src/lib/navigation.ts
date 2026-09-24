import { BotIcon, HomeIcon, LayersIcon, RocketIcon } from 'lucide-react'

import { GitHubIcon, LogoMark, ShadcnIcon } from '@/components/icons'
import { REPOSITORY_URL } from '@/lib/config'

// One list drives the sidebar and the command menu.
export const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/get-started', label: 'Get Started', icon: RocketIcon },
  { to: '/tech-stack', label: 'Tech Stack', icon: LayersIcon },
  { to: '/agentic-coding', label: 'Agentic Coding', icon: BotIcon },
] as const

export const RESOURCES = [
  { href: 'https://7ovr.com/blocks', label: '7Ovr', icon: LogoMark },
  {
    href: REPOSITORY_URL,
    label: 'Starter Source',
    icon: GitHubIcon,
  },
  { href: 'https://ui.shadcn.com/docs', label: 'Shadcn/UI', icon: ShadcnIcon },
] as const
