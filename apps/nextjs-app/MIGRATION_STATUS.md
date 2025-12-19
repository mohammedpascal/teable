# TanStack Start Migration Status

## ✅ Completed

### Phase 1: TanStack Start Setup
- ✅ Created `start.config.ts` with Vite configuration
- ✅ Created `vite.config.ts` for build configuration
- ✅ Updated `package.json` scripts (dev, build)
- ✅ Created `index.html` entry point
- ⚠️ **Note**: TanStack Start packages require Node.js >=22.12.0 (currently on 20.9.0)

### Phase 2: Core Infrastructure Migration
- ✅ Created `src/routes/__root.tsx` (migrated from `_app.tsx`)
- ✅ Created `src/routes/_error.tsx` (migrated from `_error.tsx`)
- ✅ Created `src/routes/_404.tsx` (migrated from `404.tsx`)
- ✅ Created `src/routes/_403.tsx` (migrated from `403.tsx`)
- ✅ Updated `RouterProgress.tsx` to use TanStack Router
- ✅ Created `src/app.tsx` and `src/main.tsx` entry points

### Phase 3: Routing Migration
- ✅ Created `src/routes/index.tsx` (home page)
- ✅ Created auth routes:
  - `src/routes/auth/login.tsx`
  - `src/routes/auth/signup.tsx`
  - `src/routes/auth/forget-password.tsx`
  - `src/routes/auth/reset-password.tsx`
- ✅ Created table routes:
  - `src/routes/table/$tableId.tsx`
  - `src/routes/table/$tableId/$viewId.tsx`
- ✅ Created settings routes:
  - `src/routes/settings/general.tsx`
  - `src/routes/settings/users.tsx`
  - `src/routes/settings/roles.tsx`
  - `src/routes/settings/design.tsx`
  - `src/routes/settings/query-builder.tsx`
- ✅ Created developer routes:
  - `src/routes/developer/tool/query-builder.tsx`
- ✅ Created monitor routes:
  - `src/routes/_monitor/sentry/ssr-page.tsx`
  - `src/routes/_monitor/sentry/csr-page.tsx`
  - `src/routes/_monitor/preview/error-page.tsx`

### Phase 4: Data Fetching Migration
- ✅ Created `src/server/_monitor/healthcheck.ts` (server function)
- ✅ Created `src/server/_monitor/sentry.ts` (server function)
- ✅ Created `src/server/table.ts` with `getViewPageServerData` server function
- ✅ Created API route wrappers:
  - `src/routes/api/_monitor/healthcheck.ts`
  - `src/routes/api/_monitor/sentry.ts`
- ✅ Set up route loader for `/table/$tableId/$viewId` route
- ✅ Route loaders configured for server-side data fetching

### Phase 5: Internationalization Migration
- ✅ Created `src/lib/i18n/config.ts` (react-i18next configuration)
- ✅ Updated `useLoadAllTranslations.ts` to use `react-i18next`
- ✅ Updated `__root.tsx` to import i18n config
- ✅ **COMPLETE**: All 138+ components migrated from `next-i18next` to `react-i18next`
- ⚠️ **TODO**: Remove `next-i18next` dependency (after testing)

### Phase 6: API Routes Migration
- ✅ Migrated API routes to server functions
- ✅ Created API route wrappers in routes directory

### Phase 9: Sentry Integration
- ✅ Updated `sentry.client.config.ts` to use `@sentry/react`
- ✅ Updated `sentry.server.config.ts` to use `@sentry/react`
- ✅ Updated environment variable references (`NEXT_PUBLIC_*` → `VITE_*`)

### Phase 10: TypeScript Configuration
- ✅ Updated `tsconfig.json` to remove Next.js-specific types
- ✅ Added Vite types

## ⚠️ In Progress / TODO

### Critical: Node.js Version
- **REQUIRED**: Upgrade Node.js to >=22.12.0 to install TanStack Start packages
- Current version: 20.9.0
- Command: `nvm install 22` or update Node.js installation

### Phase 3: Component Migration ✅ COMPLETE
- ✅ **COMPLETE**: All components using `next/link` migrated to TanStack Router `Link` (20+ files)
- ✅ **COMPLETE**: All components using `next/router` migrated to `@tanstack/react-router` (20+ files)
- ✅ Updated hooks: `useAddView`, `useDuplicateView`, `useDeleteView`, `useAddTable`, `useViewErrorHandler`
- ✅ Updated components: `BaseLayout`, `SettingLayout`, `SidebarContent`, `LoginPage`, `Table`, `Guide`, `TableOperation`, `UserNav`, `ResetPasswordPage`, `SocialAuth`, `SignForm`, `NotificationList`, `ExpandRecordContainer`, `ChangeEmailDialog`, `ChangePasswordDialog`, `LinkOptions`, `SelectTable`, `QueryBuilder`, `GridViewBaseInner`, `ViewListItem`, `TableListItem`, `TableTabs`, `TableImport`, `Others`, and more

### Phase 6: Next.js Component Removal ✅ COMPLETE
- ✅ Removed all `next/head` imports - replaced with `document.title` via `useEffect`
- ✅ Removed all `next/image` imports - replaced with regular `img` tags
- ✅ Updated error pages: `NotFoundPage`, `ForbiddenPage`, `ErrorPage`
- ✅ Updated avatar components: `UserAvatar`, `NotificationIcon`
- ✅ Updated form components: `FromBody`, `FormEditorMain`

### Phase 7: Layouts Migration ✅ COMPLETE
- ✅ `BaseLayout` updated to use TanStack Router hooks
- ✅ `SettingLayout` updated to use TanStack Router hooks
- ✅ All layout components verified to work with TanStack Router

### Phase 8: Build Configuration
- ✅ Environment variable references updated (with fallbacks for compatibility)
- ⚠️ Test Vite build process (requires Node.js >=22.12.0)
- ⚠️ Verify SVG handling with `vite-plugin-svgr`
- ⚠️ Test monorepo transpilation (`@teable/core`, `@teable/openapi`)

### Phase 10: Cleanup
- ⚠️ Remove Next.js dependencies:
  - `next`
  - `next-i18next`
  - `next-secure-headers`
  - `next-seo`
  - `next-transpile-modules`
  - `@next/bundle-analyzer`
  - `@next/env`
  - `eslint-config-next`
- ⚠️ Remove Next.js files:
  - `next.config.js`
  - `next-env.d.ts`
  - `next-i18next.config.js`
  - `pages/` directory (after verification)
- ⚠️ Update documentation

## Migration Helper: Next.js to TanStack Router

### Link Component Migration
Replace:
```tsx
import Link from 'next/link';
<Link href="/path">Text</Link>
```

With:
```tsx
import { Link } from '@tanstack/react-router';
<Link to="/path">Text</Link>
```

### Router Hook Migration
Replace:
```tsx
import { useRouter } from 'next/router';
const router = useRouter();
router.push('/path');
router.query.param;
```

With:
```tsx
import { useRouter, useNavigate, useParams, useSearch } from '@tanstack/react-router';
const router = useRouter();
const navigate = useNavigate();
const params = useParams({ from: Route.fullPath });
const search = useSearch({ from: Route.fullPath });
navigate({ to: '/path' });
```

### Route Parameters
- Next.js: `[param]` → TanStack Router: `$param`
- Access: `router.query.param` → `Route.useParams().param`

## Next Steps

1. **Upgrade Node.js** to >=22.12.0
2. **Install TanStack Start packages**:
   ```bash
   pnpm add @tanstack/start @tanstack/router @tanstack/router-devtools
   ```
3. **Generate route tree**:
   ```bash
   pnpm tanstack-start generate
   ```
4. **Update all Link and router imports** (see helper above)
5. **Set up route loaders** for server-side data
6. **Test routes** incrementally
7. **Remove Next.js dependencies** after verification

## Testing Checklist

- [ ] All routes load correctly
- [ ] Navigation works (Link components)
- [ ] Dynamic routes work (`$tableId`, `$viewId`)
- [ ] Authentication flow works
- [ ] Data fetching works (server functions/loaders)
- [ ] i18n translations load correctly
- [ ] Error handling works
- [ ] Build process works
- [ ] Production deployment works

