// The page numbers to show around the current one, with gaps where pages are skipped.
export function pageRange(current: number, total: number, siblings = 1): (number | 'gap')[] {
  if (total <= 3 + siblings * 2) return Array.from({ length: total }, (_, index) => index + 1)

  const around = Array.from({ length: siblings * 2 + 1 }, (_, index) => current - siblings + index)
  const pages = new Set([1, ...around, total])
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).toSorted((a, b) => a - b)

  return sorted.flatMap((page, index) => {
    const previous = sorted[index - 1]
    return previous !== undefined && page - previous > 1 ? ['gap' as const, page] : [page]
  })
}
