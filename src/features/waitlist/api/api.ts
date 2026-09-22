// In-memory stand-in for a real API: swap these functions for fetch calls.

export type WaitlistEntry = {
  id: string
  name: string
  email: string
}

export type NewWaitlistEntry = Omit<WaitlistEntry, 'id'>

// Deliberately not in alphabetical order, so sorting the table visibly changes it.
const SEED: WaitlistEntry[] = [
  { id: '1', name: 'Margaret Hamilton', email: 'margaret@example.com' },
  { id: '2', name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: '3', name: 'Alan Turing', email: 'alan@example.com' },
]

let entries = [...SEED]

const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 400

function wait() {
  return new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
}

export async function fetchWaitlist(): Promise<WaitlistEntry[]> {
  await wait()
  return [...entries]
}

export async function joinWaitlist(input: NewWaitlistEntry): Promise<WaitlistEntry> {
  await wait()
  const email = input.email.toLowerCase()
  if (entries.some((entry) => entry.email === email)) {
    throw new Error('That email is already on the waitlist.')
  }
  const entry = { id: crypto.randomUUID(), name: input.name, email }
  entries = [entry, ...entries]
  return entry
}

export function resetWaitlist() {
  entries = [...SEED]
}
