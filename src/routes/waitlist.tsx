import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { waitlistQueryOptions } from '@/features/waitlist/queries'
import { WaitlistForm } from '@/features/waitlist/waitlist-form'
import { WaitlistTable } from '@/features/waitlist/waitlist-table'

export const Route = createFileRoute('/waitlist')({
  loader: ({ context }) => context.queryClient.ensureQueryData(waitlistQueryOptions),
  component: WaitlistPage,
})

function WaitlistPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Waitlist</h1>
        <p className="text-muted-foreground">
          A working example of TanStack Router, Query, Form and Table together. Replace it with your
          own feature.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Join The Waitlist</CardTitle>
            <CardDescription>
              A TanStack Form validated with Zod, submitted through a Query mutation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WaitlistForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On The List</CardTitle>
            <CardDescription>
              A sortable TanStack Table, loaded by the route loader and refreshed after each signup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WaitlistTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
