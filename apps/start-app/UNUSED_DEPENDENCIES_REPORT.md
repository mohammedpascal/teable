# Unused Dependencies Report for start-app

Generated on: $(date)

## Summary

This report identifies potentially unused dependencies in the `apps/start-app` package based on analysis using `depcheck` and manual verification of config files, scripts, and dynamic imports.

**Total dependencies analyzed:** 174 dependencies + 49 devDependencies

## Methodology

1. Ran `depcheck` to identify packages not imported in source files
2. Manually verified config files (vite.config.ts, .eslintrc.js, tailwind.config.cjs, playwright.config.ts, postcss.config.js)
3. Checked package.json scripts for dependencies used only in build/test scripts
4. Searched for dynamic imports and other patterns that depcheck might miss

## Confirmed Unused Dependencies

### Dependencies (Production)

The following dependencies appear to be unused and can likely be removed:

#### UI Component Libraries (Potentially Unused)

- `@ariakit/react` - No imports found
- `@radix-ui/react-toolbar` - No imports found

#### CodeMirror Extensions (Potentially Unused)

- `@codemirror/lang-json` - No imports found (other CodeMirror packages are used)
- `@codemirror/lint` - No imports found (other CodeMirror packages are used)

#### Form Libraries (Potentially Unused)

- `@hookform/resolvers` - No imports found

#### Editor Libraries (Potentially Unused)

- `@udecode/cn` - No imports found
- `@udecode/plate-alignment` - No imports found
- `@udecode/plate-combobox` - No imports found
- `@udecode/plate-common` - No imports found
- `@udecode/plate-core` - No imports found
- `@udecode/plate-floating` - No imports found
- `@udecode/plate-heading` - No imports found
- `@udecode/plate-image` - No imports found
- `@udecode/plate-link` - No imports found
- `@udecode/plate-media` - No imports found
- `@udecode/plate-mention` - No imports found
- `@udecode/plate-resizable` - No imports found
- `@udecode/plate-select` - No imports found
- `@udecode/plate-slash-command` - No imports found
- `@udecode/plate-trailing-block` - No imports found

#### UniverJS Packages (Potentially Unused)

- `@univerjs/core` - No imports found
- `@univerjs/data-validation` - No imports found
- `@univerjs/design` - No imports found
- `@univerjs/docs` - No imports found
- `@univerjs/docs-ui` - No imports found
- `@univerjs/engine-formula` - No imports found
- `@univerjs/engine-render` - No imports found
- `@univerjs/facade` - No imports found
- `@univerjs/sheets` - No imports found
- `@univerjs/sheets-data-validation` - No imports found
- `@univerjs/sheets-formula` - No imports found
- `@univerjs/sheets-ui` - No imports found
- `@univerjs/ui` - No imports found

#### Slate Editor Packages (Potentially Unused)

- `slate` - No imports found
- `slate-history` - No imports found
- `slate-hyperscript` - No imports found
- `slate-react` - No imports found

#### Utility Libraries (Potentially Unused)

- `allotment` - No imports found
- `eventsource-parser` - No imports found
- `express` - No imports found (this is a backend framework, likely shouldn't be in frontend)
- `is-port-reachable` - No imports found
- `knex` - No imports found (this is a database query builder, likely shouldn't be in frontend)
- `lodash-es` - No imports found (note: `lodash` is used, but `lodash-es` is not)
- `qrcode.react` - No imports found
- `re-resizable` - No imports found
- `react-confetti` - No imports found
- `react-rnd` - No imports found
- `reflect-metadata` - No imports found (used in backend, not frontend)
- `type-fest` - No imports found

#### Other (Potentially Unused)

- `@belgattitude/http-exception` - No imports found
- `@nem035/gpt-3-encoder` - No imports found

### DevDependencies

The following devDependencies appear to be unused:

#### Testing (Potentially Unused)

- `@testing-library/dom` - No imports found (other testing-library packages are used)
- `@types/react-test-renderer` - No imports found

#### Type Definitions (Potentially Unused)

- `@types/cors` - No imports found
- `@types/express` - No imports found (express itself is unused)

#### Build Tools (Potentially Unused)

- `dotenv-flow-cli` - No usage found in scripts or code (note: `dotenv-flow` is used in playwright.config.ts)
- `get-tsconfig` - No imports found
- `symlink-dir` - No usage found in scripts or code
- `sync-directory` - No usage found in scripts or code
- `ts-node` - No usage found in scripts or code

## False Positives (Actually Used)

The following packages were flagged by depcheck but are actually used:

### Dependencies

- `buffer` - Used in `src/features/app/blocks/import-table/upload-panel/utils.ts`
- `@fontsource-variable/inter` - Used in `src/main.tsx`

### DevDependencies

- `autoprefixer` - Used in `postcss.config.js`
- `postcss` - Used in `postcss.config.js`
- `postcss-flexbugs-fixes` - Used in `postcss.config.js`
- `postcss-preset-env` - Used in `postcss.config.js`
- `rimraf` - Used in package.json scripts (`clean` and `clean:backend`)
- `es-check` - Used in package.json script (`check-dist`)
- `size-limit` - Used in package.json script (`check-size`)
- `@size-limit/file` - Required by `size-limit`
- `cross-env` - Used in package.json script (`bundle-analyze`)
- `dotenv-flow` - Used in `playwright.config.ts`
- `picocolors` - Used in `playwright.config.ts`
- `@vitest/coverage-v8` - Used for test coverage (vitest config)

## Recommendations

### High Confidence - Safe to Remove

These packages have no usage found and can likely be safely removed:

**Dependencies:**

- All `@udecode/plate-*` packages (15 packages)
- All `@univerjs/*` packages (13 packages)
- All `slate*` packages (4 packages)
- `express`, `knex`, `reflect-metadata` (backend packages in frontend)
- `lodash-es` (use `lodash` instead if needed)
- `@ariakit/react`, `@radix-ui/react-toolbar`
- `@codemirror/lang-json`, `@codemirror/lint`
- `@hookform/resolvers`
- `allotment`, `eventsource-parser`, `is-port-reachable`
- `qrcode.react`, `re-resizable`, `react-confetti`, `react-rnd`
- `type-fest`
- `@belgattitude/http-exception`, `@nem035/gpt-3-encoder`

**DevDependencies:**

- `@testing-library/dom`
- `@types/cors`, `@types/express`
- `@types/react-test-renderer`
- `dotenv-flow-cli`
- `get-tsconfig`
- `symlink-dir`, `sync-directory`
- `ts-node`

### Medium Confidence - Verify Before Removing

These packages might be used in ways that weren't detected:

- `@ariakit/react` - Could be used via dynamic imports
- `@radix-ui/react-toolbar` - Could be used in a component library
- `@codemirror/lang-json`, `@codemirror/lint` - Could be used conditionally
- `@hookform/resolvers` - Could be used in form validation
- `qrcode.react`, `react-confetti`, `react-rnd` - Could be used in features not yet implemented

### Notes

1. **Backend packages in frontend**: `express`, `knex`, and `reflect-metadata` are backend packages and should not be in the frontend dependencies. They may have been added by mistake.

2. **Editor libraries**: The large number of unused editor-related packages (`@udecode/plate-*`, `@univerjs/*`, `slate*`) suggests these features may have been removed or are planned but not yet implemented.

3. **Type definitions**: `@types/express` and `@types/cors` are only needed if `express` and `cors` are used, which they are not.

4. **Build tools**: Some devDependencies like `symlink-dir`, `sync-directory`, and `ts-node` may have been used in the past but are no longer needed.

## Estimated Impact

**Total potentially unused packages:** ~50+ packages

**Estimated bundle size reduction:** Significant (especially removing large editor libraries like UniverJS and Plate)

**Risk level:** Low to Medium (verify critical packages before removing)

## Next Steps

1. Review this list with the team to confirm unused packages
2. Test the application after removing high-confidence unused packages
3. Check if any packages are peer dependencies required by other packages
4. Verify that removing editor libraries won't break planned features
5. Consider moving backend packages (`express`, `knex`, `reflect-metadata`) to the backend package if they're needed there

## Command to Remove Packages

To remove the high-confidence unused packages, you can use:

```bash
cd apps/start-app
pnpm remove @ariakit/react @radix-ui/react-toolbar @codemirror/lang-json @codemirror/lint @hookform/resolvers @belgattitude/http-exception @nem035/gpt-3-encoder @udecode/cn @udecode/plate-alignment @udecode/plate-combobox @udecode/plate-common @udecode/plate-core @udecode/plate-floating @udecode/plate-heading @udecode/plate-image @udecode/plate-link @udecode/plate-media @udecode/plate-mention @udecode/plate-resizable @udecode/plate-select @udecode/plate-slash-command @udecode/plate-trailing-block @univerjs/core @univerjs/data-validation @univerjs/design @univerjs/docs @univerjs/docs-ui @univerjs/engine-formula @univerjs/engine-render @univerjs/facade @univerjs/sheets @univerjs/sheets-data-validation @univerjs/sheets-formula @univerjs/sheets-ui @univerjs/ui allotment eventsource-parser express is-port-reachable knex lodash-es qrcode.react re-resizable react-confetti react-rnd reflect-metadata slate slate-history slate-hyperscript slate-react type-fest

pnpm remove -D @testing-library/dom @types/cors @types/express @types/react-test-renderer dotenv-flow-cli get-tsconfig symlink-dir sync-directory ts-node
```
