import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-16">
      <Outlet />
    </main>
  )
}
