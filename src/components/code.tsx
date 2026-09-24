export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-sans text-xs text-soft-foreground">
      {children}
    </code>
  )
}
