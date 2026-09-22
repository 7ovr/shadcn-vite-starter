export function formatPokedexNumber(id: number) {
  return `#${String(id).padStart(3, '0')}`
}

// PokeAPI names are lowercase slugs like "mr-mime"; show them in Title Case.
export function toTitleCase(slug: string) {
  return slug.replace(/(^|[-\s])\p{L}/gu, (match) => match.toUpperCase())
}
