import { useSuspenseQuery } from "@tanstack/react-query"

import { waitlistQueryOptions } from "./queries"

export function WaitlistList() {
  const { data: entries } = useSuspenseQuery(waitlistQueryOptions)

  return (
    <ul aria-label="Waitlist" className="flex flex-col divide-y">
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-col py-3 first:pt-0 last:pb-0">
          <span className="text-sm font-medium">{entry.name}</span>
          <span className="text-sm text-muted-foreground">{entry.email}</span>
        </li>
      ))}
    </ul>
  )
}
