import { useSuspenseQuery } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { pokemonOptions } from '@/features/pokemon/api/queries'
import { formatPokedexNumber, toTitleCase } from '@/features/pokemon/lib/format'

export function PokemonDetails({ name }: { name: string }) {
  const { data: pokemon } = useSuspenseQuery(pokemonOptions(name))

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      {pokemon.imageUrl ? (
        <img
          src={pokemon.imageUrl}
          alt={`Official artwork of ${toTitleCase(pokemon.name)}`}
          width={240}
          height={240}
          className="size-60 rounded-xl bg-muted"
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{formatPokedexNumber(pokemon.id)}</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {toTitleCase(pokemon.name)}
          </h1>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Types</dt>
          <dd className="flex gap-1">
            {pokemon.types.map((type) => (
              <Badge key={type} variant="secondary">
                {toTitleCase(type)}
              </Badge>
            ))}
          </dd>
          <dt className="text-muted-foreground">Height</dt>
          <dd>{`${pokemon.heightCm} cm`}</dd>
          <dt className="text-muted-foreground">Weight</dt>
          <dd>{`${pokemon.weightKg} kg`}</dd>
        </dl>
      </div>
    </div>
  )
}
