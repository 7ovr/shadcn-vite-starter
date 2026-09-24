export const SITE_NAME = '7Ovr Starter'

// Head tags for a route: "Page - 7Ovr Starter", plus a description for search results and link previews.
export function pageMeta({ title, description }: { title?: string; description: string }) {
  return {
    meta: [
      { title: title ? `${title} - ${SITE_NAME}` : SITE_NAME },
      { name: 'description', content: description },
      { property: 'og:title', content: title ?? SITE_NAME },
      { property: 'og:description', content: description },
    ],
  }
}
