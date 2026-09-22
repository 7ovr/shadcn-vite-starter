export function createQueryKeys<const TScope extends string>(scope: TScope) {
  return {
    all: [scope] as const,
    lists: () => [scope, 'list'] as const,
    details: () => [scope, 'detail'] as const,
    detail: (id: string) => [scope, 'detail', id] as const,
  }
}
