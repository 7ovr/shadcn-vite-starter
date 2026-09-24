import type { LucideIcon } from 'lucide-react'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type StateProps = {
  icon: LucideIcon
  title: string
  description: string
  // One way out, as a primary Button or a router Link styled with buttonVariants().
  action?: React.ReactNode
}

function StateView({
  icon: Icon,
  title,
  description,
  action,
  scope,
}: StateProps & { scope: 'page' | 'section' }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>
        {scope === 'page' ? (
          <EmptyTitle level={1} size="lg">
            {title}
          </EmptyTitle>
        ) : (
          <EmptyTitle>{title}</EmptyTitle>
        )}
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}

// A whole page given over to one state, such as not found or an error; it renders the page's h1.
export function PageState(props: StateProps) {
  return (
    <div className="flex w-full py-16">
      <StateView {...props} scope="page" />
    </div>
  )
}

// A state inside a section, such as a failed table or a search with no results.
export function SectionState(props: StateProps) {
  return <StateView {...props} scope="section" />
}
