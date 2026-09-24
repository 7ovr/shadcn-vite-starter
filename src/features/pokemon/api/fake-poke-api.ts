import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { vi } from 'vitest'

import { http } from '@/integrations/axios'

// Thirty Pokémon in Pokédex order: three pages of ten, so paging has somewhere to go.
const NAMES = [
  'bulbasaur',
  'ivysaur',
  'venusaur',
  'charmander',
  'charmeleon',
  'charizard',
  'squirtle',
  'wartortle',
  'blastoise',
  'caterpie',
  'metapod',
  'butterfree',
  'weedle',
  'kakuna',
  'beedrill',
  'pidgey',
  'pidgeotto',
  'pidgeot',
  'rattata',
  'raticate',
  'spearow',
  'fearow',
  'ekans',
  'arbok',
  'pikachu',
  'raichu',
  'sandshrew',
  'sandslash',
  'nidoran-f',
  'nidorina',
]

export const FAKE_TOTAL = NAMES.length

const resource = (name: string) => ({ name, url: `https://pokeapi.test/${name}/` })

// Bulbasaur matches the real API, so tests can assert real values; the rest share placeholders.
function detail(name: string) {
  const id = NAMES.indexOf(name) + 1
  const isBulbasaur = id === 1
  return {
    id,
    name,
    types: (isBulbasaur ? ['grass', 'poison'] : ['normal']).map((type) => ({
      type: resource(type),
    })),
    abilities: [
      { ability: resource(isBulbasaur ? 'overgrow' : 'run-away'), is_hidden: false },
      { ability: resource(isBulbasaur ? 'chlorophyll' : 'keen-eye'), is_hidden: true },
    ],
    stats: [45, 49, 49, 65, 65, 45].map((base_stat) => ({ base_stat })),
    sprites: { front_default: `https://sprites.test/${id}.png` },
  }
}

const respond = <T>(data: T) => Promise.resolve({ data } as AxiosResponse<T>)

function notFound(url: string) {
  const config = { url, headers: new AxiosHeaders() } as InternalAxiosRequestConfig
  return Promise.reject(
    new AxiosError('Request failed with status code 404', 'ERR_BAD_REQUEST', config, null, {
      status: 404,
      statusText: 'Not Found',
      data: 'Not Found',
      headers: {},
      config,
    }),
  )
}

// Stands in for PokeAPI in every test, so the suite never touches the network.
export function installFakePokeApi() {
  return vi.spyOn(http, 'get').mockImplementation((url, config) => {
    if (url === '/pokemon') {
      const { limit, offset } = (config?.params ?? {}) as { limit?: number; offset?: number }
      // The real API silently returns twenty; failing loudly catches a dropped param.
      if (limit === undefined || offset === undefined) {
        return Promise.reject(new Error('limit and offset are required'))
      }
      return respond({
        count: FAKE_TOTAL,
        results: NAMES.slice(offset, offset + limit).map(resource),
      })
    }
    const name = decodeURIComponent(url.replace(/^\/pokemon\//, ''))
    return NAMES.includes(name) ? respond(detail(name)) : notFound(url)
  })
}
