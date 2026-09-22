import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const LOCALES_DIR = join(import.meta.dirname, '..', 'public', 'locales')
const SOURCE_LOCALE = 'en.json'
const checkOnly = process.argv.includes('--check')

function byKey([a]: [string, unknown], [b]: [string, unknown]) {
  return a < b ? -1 : a > b ? 1 : 0
}

async function readCatalog(file: string) {
  const raw = await readFile(join(LOCALES_DIR, file), 'utf8')
  const messages: Record<string, unknown> = JSON.parse(raw)
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value !== 'string') {
      throw new Error(`${file}: "${key}" must be a string, catalogs are flat`)
    }
  }
  return { file, raw, messages }
}

function keyList(messages: Record<string, unknown>) {
  return Object.keys(messages).toSorted().join(',')
}

const files = (await readdir(LOCALES_DIR)).filter((file) => file.endsWith('.json'))
const catalogs = await Promise.all(files.map(readCatalog))
const source = catalogs.find((catalog) => catalog.file === SOURCE_LOCALE)
if (!source) throw new Error(`${SOURCE_LOCALE} is missing`)

const problems: string[] = []
const writes: Promise<void>[] = []

for (const { file, raw, messages } of catalogs) {
  const entries = Object.entries(messages).toSorted(byKey)
  const sorted = `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`

  if (sorted !== raw) {
    if (checkOnly) problems.push(`${file} is not sorted, run pnpm sort-messages`)
    else writes.push(writeFile(join(LOCALES_DIR, file), sorted))
  }

  if (checkOnly && keyList(messages) !== keyList(source.messages)) {
    problems.push(`${file} has different keys from ${SOURCE_LOCALE}, sync the translations`)
  }
}

await Promise.all(writes)

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}
