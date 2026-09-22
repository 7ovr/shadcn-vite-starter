export function formatPokedexNumber(id: number) {
  return `#${String(id).padStart(3, '0')}`
}
