# TanStack Start Migration Summary

## ✅ Completed Phases

### Phase 1: TanStack Start Setup ✅
- Created `start.config.ts` and `vite.config.ts`
- Updated `package.json` scripts
- Created `index.html` entry point
- Created `app.tsx` and `main.tsx` entry points

### Phase 2: Core Infrastructure ✅
- Migrated `_app.tsx` → `__root.tsx`
- Migrated error pages (`_error.tsx`, `404.tsx`, `403.tsx`)
- Updated `RouterProgress.tsx` component
- Updated TypeScript configuration

### Phase 3: Routing Migration ✅
- Created all route files in `src/routes/`
- Migrated auth routes (login, signup, forget-password, reset-password)
- Migrated table routes (`$tableId`, `$tableId/$viewId`)
- Migrated settings routes (general, users, roles, design, query-builder)
- Migrated developer and monitor routes

### Phase 4: Data Fetching Migration ✅
- Created `src/server/` directory structure
- Created server functions (`table.ts`, `_monitor/healthcheck.ts`, `_monitor/sentry.ts`)
- Set up route loader for table view route
- Created API route wrappers

### Phase 5: Internationalization Migration ✅
- Created `react-i18next` configuration (`src/lib/i18n/config.ts`)
- Updated `useLoadAllTranslations` hook
- **Bulk migrated all 138+ files** from `next-i18next` to `react-i18next`
- Updated `__root.tsx` to import i18n config

### Phase 6: API Routes Migration ✅
- Migrated API routes to server functions
- Created API route wrappers in routes directory

### Phase 7: Component Updates ✅ (10+ files)
- ✅ `BaseLayout.tsx` - Router migration
- ✅ `SidebarContent.tsx` - Link and router migration
- ✅ `SignForm.tsx` - Link and router migration
- ✅ `LoginPage.tsx` - Router migration, removed NextSeo
- ✅ `TableOperation.tsx` - Router and navigation migration
- ✅ `Guide.tsx` - Router migration
- ✅ `Table.tsx` - Router migration, removed Next.js Head
- ✅ `SettingLayout.tsx` - Router migration
- ✅ `UserNav.tsx` - Router migration
- ✅ `ResetPasswordPage.tsx` - Router migration
- ✅ `SocialAuth.tsx` - Router migration
- ✅ `Design.tsx` - Router migration

### Phase 9: Sentry Integration ✅
- Updated `sentry.client.config.ts` to use `@sentry/react`
- Updated `sentry.server.config.ts` to use `@sentry/react`
- Updated environment variable references

### Phase 10: Environment Variables ✅ (Partial)
- Updated `NEXT_PUBLIC_BUILD_VERSION` references to use `VITE_BUILD_VERSION`
- Updated `__root.tsx` window.version assignment

## ⚠️ Remaining Work

### High Priority
1. **Router Updates**: ~15-20 files still use `next/router` or `next/link`
   - Files like `ExpandRecordContainer.tsx`, `GridViewBaseInner.tsx`, `QueryBuilder.tsx`, etc.
   - Pattern established - can be updated systematically

2. **Route Loaders**: Set up loaders for remaining routes that need server data
   - Settings routes may need server data
   - Other routes that previously used `getServerSideProps`

3. **Environment Variables**: Complete migration
   - Update all `NEXT_PUBLIC_*` → `VITE_*` references
   - Update `.env` files
   - Document environment variable changes

4. **Testing**: Comprehensive testing needed
   - Test all routes
   - Test navigation
   - Test data fetching
   - Test authentication flow
   - Test i18n switching

### Medium Priority
5. **Remove Next.js Dependencies**: After thorough testing
   - `next`, `next-i18next`, `next-secure-headers`, `next-seo`, etc.
   - `@next/bundle-analyzer`, `@next/env`, `eslint-config-next`

6. **Clean Up Files**: After verification
   - Remove `pages/` directory
   - Remove `next.config.js`
   - Remove `next-env.d.ts`
   - Remove `next-i18next.config.js`

7. **Documentation**: Update README and setup guides

## Migration Statistics

- **Routes Created**: 20+ route files
- **Components Updated**: 12+ critical components
- **i18n Files Migrated**: 138+ files (bulk migration)
- **Server Functions Created**: 3 server functions
- **Configuration Files**: 5 new config files

## Next Steps

1. **Install TanStack Start packages** (requires Node.js >=22.12.0):
   ```bash
   pnpm add @tanstack/start @tanstack/router @tanstack/router-devtools
   ```

2. **Generate route tree**:
   ```bash
   pnpm tanstack-start generate
   ```

3. **Continue component updates**: Update remaining files using `next/router`/`next/link`

4. **Set up route loaders**: Add loaders for routes needing server data

5. **Test thoroughly**: Test all routes and functionality

6. **Update environment variables**: Complete `NEXT_PUBLIC_*` → `VITE_*` migration

7. **Remove Next.js**: After successful testing, remove Next.js dependencies

## Notes

- Node.js version requirement: TanStack Start requires Node.js >=22.12.0
- The migration maintains backward compatibility where possible
- Server functions can be called from both server and client
- Route loaders provide SSR data fetching similar to `getServerSideProps`
- i18n migration is complete - all files now use `react-i18next`

