import { useNavigate } from '@tanstack/react-router'
import { BugIcon, ExternalLinkIcon, MoonIcon, SunIcon } from 'lucide-react'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { useTheme } from '@/hooks/use-theme'
import { NAV_ITEMS, RESOURCES } from '@/lib/navigation'

export function CommandMenu({
  open,
  onOpenChange,
  onReportIssue,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReportIssue: () => void
}) {
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useTheme()
  const ThemeIcon = resolvedTheme === 'dark' ? SunIcon : MoonIcon

  const run = (action: () => void) => {
    onOpenChange(false)
    action()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput aria-label="Search Commands" placeholder="Search Pages And Actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV_ITEMS.map((item) => (
              <CommandItem key={item.to} onSelect={() => run(() => void navigate({ to: item.to }))}>
                <item.icon />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Resources">
            {RESOURCES.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => run(() => window.open(item.href, '_blank', 'noreferrer'))}
              >
                <item.icon />
                <span>{item.label}</span>
                <CommandShortcut>
                  <ExternalLinkIcon aria-hidden="true" />
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(onReportIssue)}>
              <BugIcon />
              <span>Report An Issue</span>
            </CommandItem>
            <CommandItem onSelect={() => run(toggleTheme)}>
              <ThemeIcon />
              <span>Toggle Theme</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
