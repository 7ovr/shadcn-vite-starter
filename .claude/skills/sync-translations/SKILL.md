---
name: sync-translations
description: Propagate changes in public/locales/en.json to every other language catalog. Use after adding, renaming or removing English keys, or when pnpm check-messages reports different keys.
---

# Sync translations

`public/locales/en.json` is the source catalog. Every other file in `public/locales/` must hold exactly the same keys.

## Steps

1. Read `public/locales/en.json` and each other catalog in `public/locales/`.
2. For each other catalog:
   - Remove keys that no longer exist in `en.json`.
   - Add every key that is missing, translated from the English value into that language.
   - Keep existing translations as they are, unless the English value changed meaning. Then translate it again.
3. Translate with care:
   - Keep ICU syntax intact: placeholders such as `{count}` and `{value, number}` stay exactly as written, and `plural` blocks use that language's plural categories (Polish needs `one`, `few`, `many` and `other`).
   - Match the tone and length of the English. Button labels stay short.
   - Never use em dashes. Use a plain hyphen or rephrase.
4. Run `pnpm sort-messages`, then `pnpm check-messages`. It must pass.

## Notes

- Catalogs are flat: every value is a string, never a nested object.
- Adding a language also needs an entry in `SUPPORTED_LANGUAGES` in `src/lib/config.ts`. A catalog on its own is never loaded.
