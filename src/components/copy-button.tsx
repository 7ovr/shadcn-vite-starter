import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

export function CopyButton({
  value,
  label = 'Copy',
  variant = 'ghost',
}: {
  value: string
  label?: string
  variant?: 'ghost' | 'secondary'
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <>
      <Button
        variant={variant}
        size={variant === 'secondary' ? 'icon-sm' : 'icon-xs'}
        aria-label={copied ? 'Copied' : label}
        onClick={() => {
          // The clipboard API is missing outside secure contexts, and a denied write has nothing to show.
          navigator.clipboard?.writeText(value).then(
            () => setCopied(true),
            () => {},
          )
        }}
      >
        {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      </Button>
      <span role="status" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
    </>
  )
}
