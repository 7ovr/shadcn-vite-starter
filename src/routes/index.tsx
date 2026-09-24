import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { Section } from '@/components/section'
import { Showcase } from '@/components/showcase'
import { pokemonPageOptions } from '@/features/pokemon/api/queries'
import { PokemonTable } from '@/features/pokemon/components/pokemon-table'
import { DEFAULT_PAGE_SIZE, pokemonSearchSchema } from '@/features/pokemon/lib/types'
import { pageMeta } from '@/lib/meta'

export const Route = createFileRoute('/')({
  validateSearch: pokemonSearchSchema,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1, size: search.size ?? DEFAULT_PAGE_SIZE }),
  // Not awaited: the page renders at once and only the table waits for its data.
  loader: ({ context: { queryClient }, deps }) => {
    void queryClient.prefetchQuery(pokemonPageOptions(deps.page, deps.size))
  },
  head: () =>
    pageMeta({
      description:
        'A Vite and React app shell with TanStack, shadcn/ui and strict TypeScript, with a live Pokémon table to learn from.',
    }),
  component: HomePage,
})

function HomePage() {
  const { page, size } = Route.useLoaderDeps()
  const { data: total } = useQuery({
    ...pokemonPageOptions(page, size),
    select: (data) => data.total,
  })

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <PageHeader title="Home" />
        <Showcase />
      </div>

      <Section title="Pokémon" count={total}>
        <PokemonTable page={page} size={size} />
      </Section>
    </div>
  )
}
