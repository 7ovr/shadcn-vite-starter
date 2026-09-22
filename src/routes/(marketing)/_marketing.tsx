import { Outlet, createFileRoute } from '@tanstack/react-router'

// Marketing pages run full width so blocks can set their own bands.
export const Route = createFileRoute('/(marketing)/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
