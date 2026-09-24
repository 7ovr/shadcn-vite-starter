import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { BugIcon, ExternalLinkIcon, MoonIcon, SearchIcon, SunIcon } from 'lucide-react'
import * as React from 'react'

import { LogoMark } from '@/components/icons'
import { LazyMount } from '@/components/lazy-mount'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { useLazyDialog } from '@/hooks/use-lazy-dialog'
import { useTheme } from '@/hooks/use-theme'
import { NAV_ITEMS, RESOURCES } from '@/lib/navigation'

// cmdk and its dialog load on first use, not with every page; hovering the search field preloads them.
const loadCommandMenu = () => import('@/components/command-menu')
const CommandMenu = React.lazy(() =>
  loadCommandMenu().then((module) => ({ default: module.CommandMenu })),
)
// A failed preload is harmless: opening the menu loads it again and handles the error there.
const preloadCommandMenu = () => void loadCommandMenu().catch(() => {})

// The issue dialog, its form and full Zod load the first time someone reports an issue.
const IssueDialog = React.lazy(() =>
  import('@/features/issue-form/components/issue-dialog').then((module) => ({
    default: module.IssueDialog,
  })),
)

const MOD_KEY = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl'

function Brand() {
  return (
    <Link to="/" aria-label="7Ovr Starter" className="flex items-center gap-2 px-1">
      <LogoMark className="size-5 shrink-0" />
      <span className="flex items-center gap-1.5">
        <span className="font-brand text-lg leading-none font-bold tracking-tight">7Ovr</span>
        <span aria-hidden="true" className="text-xs leading-none text-muted-foreground/50">
          /
        </span>
        <span className="text-xs leading-none font-light text-muted-foreground">Starter</span>
      </span>
    </Link>
  )
}

// With the sidebar collapsed or on a phone, its toggle moves out into the page.
function InsetTopBar() {
  const { isMobile, state } = useSidebar()

  if (isMobile) {
    return (
      <div className="flex h-12 items-center border-b px-4">
        <SidebarTrigger />
      </div>
    )
  }
  if (state === 'expanded') return null
  return (
    <div className="absolute top-3 left-3 z-10">
      <SidebarTrigger />
    </div>
  )
}

// On a phone the sidebar is a sheet; it closes once any link or command changes the page.
function CloseSheetOnNavigate() {
  const { setOpenMobile } = useSidebar()
  const router = useRouter()
  React.useEffect(
    () => router.subscribe('onResolved', () => setOpenMobile(false)),
    [router, setOpenMobile],
  )
  return null
}

// The search field hides when the sidebar collapses, so the rail gets a search icon instead.
function CollapsedSearch({ onOpen }: { onOpen: () => void }) {
  const { isMobile, state } = useSidebar()
  if (isMobile || state === 'expanded') return null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton size="sm" tooltip="Search" onClick={onOpen}>
        <SearchIcon aria-hidden="true" />
        <span>Search</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const command = useLazyDialog()
  const issue = useLazyDialog()
  const setCommandOpen = command.setOpen
  const openIssue = () => issue.setOpen(true)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { resolvedTheme, toggleTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // A held key repeats keydown, which would flip the menu open and shut.
      if (event.repeat) return
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [setCommandOpen])

  return (
    <SidebarProvider defaultOpen>
      <CloseSheetOnNavigate />
      <Sidebar collapsible="icon">
        {/* A landmark, so screen readers can jump straight to the navigation. */}
        <nav aria-label="Sidebar" className="flex min-h-0 flex-1 flex-col">
          <SidebarHeader>
            <div className="flex h-9 items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
              <span className="group-data-[collapsible=icon]:hidden">
                <Brand />
              </span>
              <span className="group-data-[collapsible=icon]:hidden">
                <SidebarTrigger />
              </span>
              <Link
                to="/"
                aria-label="7Ovr Starter"
                className="hidden size-8 place-items-center group-data-[collapsible=icon]:grid"
              >
                <LogoMark className="size-5" />
              </Link>
            </div>
            <button
              type="button"
              onClick={() => command.setOpen(true)}
              aria-keyshortcuts={MOD_KEY === '⌘' ? 'Meta+K' : 'Control+K'}
              onPointerEnter={preloadCommandMenu}
              onFocus={preloadCommandMenu}
              className="flex h-7 w-full items-center gap-2 rounded-md border bg-background px-2 text-xs text-muted-foreground transition-colors group-data-[collapsible=icon]:hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">Search</span>
              <KbdGroup>
                <Kbd>{MOD_KEY}</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </button>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <CollapsedSearch onOpen={() => command.setOpen(true)} />
                  {NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        size="sm"
                        isActive={item.to === pathname}
                        tooltip={item.label}
                        render={<Link to={item.to} activeProps={{ 'aria-current': 'page' }} />}
                      >
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Resources</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {RESOURCES.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        size="sm"
                        tooltip={item.label}
                        render={
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={item.label}
                          />
                        }
                      >
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                        <ExternalLinkIcon
                          aria-hidden="true"
                          className="ml-auto text-muted-foreground group-data-[collapsible=icon]:hidden"
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="flex flex-col gap-1 rounded-lg bg-secondary px-2.5 py-2 text-xs text-secondary-foreground group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-2">
                <LogoMark className="size-3.5 shrink-0" />
                <span className="flex-1 truncate font-medium">Try Blocks & Templates</span>
                <a
                  href="https://7ovr.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Browse 7Ovr Blocks And Templates"
                  className="shrink-0 text-info underline underline-offset-2 hover:no-underline"
                >
                  Browse
                </a>
              </div>
              <p className="text-soft-foreground">
                Free and Pro pages that install with one command and match your theme.
              </p>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" tooltip="Report An Issue" onClick={openIssue}>
                  <BugIcon aria-hidden="true" />
                  <span>Report An Issue</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" tooltip="Toggle Theme" onClick={toggleTheme}>
                  {resolvedTheme === 'dark' ? (
                    <SunIcon aria-hidden="true" />
                  ) : (
                    <MoonIcon aria-hidden="true" />
                  )}
                  <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  <span className="ml-auto group-data-[collapsible=icon]:hidden">
                    <Kbd>D</Kbd>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </nav>
      </Sidebar>

      <SidebarInset>
        <InsetTopBar />
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:py-14">
          {children}
        </div>
      </SidebarInset>

      <LazyMount used={command.used} onError={command.reset}>
        <CommandMenu open={command.open} onOpenChange={command.setOpen} onReportIssue={openIssue} />
      </LazyMount>
      <LazyMount used={issue.used} onError={issue.reset}>
        <IssueDialog open={issue.open} onOpenChange={issue.setOpen} />
      </LazyMount>
    </SidebarProvider>
  )
}
