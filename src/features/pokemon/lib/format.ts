// PokeAPI names are lowercase slugs like "mr-mime"; show them in Title Case.
export function toTitleCase(slug: string) {
  return slug.replace(/(^|[-\s])\p{L}/gu, (match) => match.toUpperCase())
}
