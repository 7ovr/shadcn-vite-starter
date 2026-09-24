import { useCallback, useState } from 'react'

// Open state for a dialog whose code loads on first use. `used` stays true after closing,
// so the dialog stays mounted and its exit animation can run.
export function useLazyDialog() {
  const [open, setOpenState] = useState(false)
  const [used, setUsed] = useState(false)

  const setOpen = useCallback((next: React.SetStateAction<boolean>) => {
    setUsed(true)
    setOpenState(next)
  }, [])

  // Called when the dialog's chunk fails to load, so the shell carries on without it.
  const reset = useCallback(() => {
    setUsed(false)
    setOpenState(false)
  }, [])

  return { open, used, setOpen, reset }
}
