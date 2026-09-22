import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import '@/index.css'
import { ThemeProvider } from '@/components/theme-provider'
import { initI18n } from '@/integrations/i18n'
import { queryClient } from '@/integrations/query-client'
import { router } from '@/integrations/router'

// Translations and the first route's data load together; both finish before the first paint.
await Promise.all([initI18n(), router.load()])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
