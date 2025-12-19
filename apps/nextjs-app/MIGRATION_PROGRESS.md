# Migration Progress Update

## Recently Completed

### Component Updates
- ✅ Updated `BaseLayout.tsx` - Migrated from `next/router` to `@tanstack/react-router`
- ✅ Updated `SidebarContent.tsx` - Migrated Link and router usage
- ✅ Updated `SignForm.tsx` - Migrated Link and router usage  
- ✅ Updated `LoginPage.tsx` - Migrated router and Link usage, removed NextSeo
- ✅ Updated `TableOperation.tsx` - Migrated router and Link usage
- ✅ Updated `Guide.tsx` - Migrated router usage, fixed dynamic import
- ✅ Updated `Table.tsx` - Migrated router usage, removed Next.js Head

### Key Changes Made
1. **Router Hooks**: `useRouter()` → `useRouterState()`, `useNavigate()`, `useParams()`
2. **Link Component**: `next/link` → `@tanstack/react-router` Link with `to` prop
3. **i18n**: Updated several files from `next-i18next` to `react-i18next`
4. **Route Parameters**: `router.query` → `useParams()` or `useSearch()`
5. **Navigation**: `router.push()` → `navigate({ to: '...' })`

## Remaining Work

### High Priority
1. **Bulk i18n Migration**: ~138 files still use `next-i18next`
   - Script created: `scripts/migrate-i18n-imports.sh`
   - Run: `bash scripts/migrate-i18n-imports.sh`

2. **Router Updates**: ~30+ files still use `next/router` or `next/link`
   - Critical files:
     - `src/features/app/blocks/design/Design.tsx`
     - `src/features/app/layouts/SettingLayout.tsx`
     - `src/features/app/components/user/UserNav.tsx`
     - `src/features/auth/pages/ResetPasswordPage.tsx`
     - `src/features/auth/components/SocialAuth.tsx`
     - And many more...

3. **Route Loaders**: Set up server-side data fetching
   - Create loaders for routes that need server data
   - Migrate `getViewPageServerData` to route loaders

4. **Environment Variables**: Update all `NEXT_PUBLIC_*` to `VITE_*`
   - Search and replace across codebase

### Medium Priority
5. **Remove Next.js Dependencies**: After testing
6. **Update Documentation**: README, setup guides
7. **Testing**: Comprehensive route and functionality testing

## Next Steps

1. Run i18n migration script
2. Continue updating router imports systematically
3. Set up route loaders for data fetching
4. Test critical user flows
5. Update environment variable references

