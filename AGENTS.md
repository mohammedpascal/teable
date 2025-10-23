# AGENTS

**Overview**: Build, lint, test, and style guidelines for this monorepo.

**Commands**

- Build all: `pnpm -r run build`
- Build single: `pnpm -F @teable/app run build`
- Lint all: `pnpm -r run lint` (per-package: `pnpm -F @teable/app run lint`)
- Run tests (all): `pnpm -r run g:test`
- Run unit tests only: `pnpm -r run g:test-unit`
- Run a single test file: `pnpm -F @teable/app run test-unit -- path/to/file.test.ts`
- Typecheck: `pnpm -r run typecheck`
- Format: `pnpm -w exec -- prettier --write "**/*.{ts,tsx,js,jsx,md}"`

**Code Style**

- Imports: external first, then internal, then relative; use `import type` for types; avoid unused imports; align with `@teable/eslint-config-bases`.
- Formatting: rely on root Prettier config in `.prettierrc.js`; format on commit via lint-staged.
- Types: prefer explicit types; avoid `any` in public APIs; use `unknown` when appropriate.
- Naming: locals/functions camelCase; types PascalCase; files/directories kebab-case where sensible.
- Errors: throw informative `Error` instances; don't swallow errors; include context.

**Cursor rules**: none found in this repository. If present, follow `.cursor/rules` (or `.cursorrules`).
**Copilot rules**: none found in this repository. If present, follow `.github/copilot-instructions.md`.
