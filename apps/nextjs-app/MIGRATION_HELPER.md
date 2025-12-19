# Migration Helper: Next.js to TanStack Start

This document provides quick reference for migrating components from Next.js to TanStack Start.

## Import Changes

### Link Component
```tsx
// Before (Next.js)
import Link from 'next/link';
<Link href="/path">Text</Link>
<Link href={{ pathname: '/path', query: { id: '123' } }}>Text</Link>

// After (TanStack Router)
import { Link } from '@tanstack/react-router';
<Link to="/path">Text</Link>
<Link to="/path" search={{ id: '123' }}>Text</Link>
```

### Router Hooks
```tsx
// Before (Next.js)
import { useRouter } from 'next/router';
const router = useRouter();
router.push('/path');
router.replace('/path');
router.query.param;
router.pathname;
router.asPath;

// After (TanStack Router)
import { useRouter, useNavigate, useParams, useSearch } from '@tanstack/react-router';
const router = useRouter();
const navigate = useNavigate();
const params = useParams({ from: Route.fullPath });
const search = useSearch({ from: Route.fullPath });
navigate({ to: '/path' });
navigate({ to: '/path', replace: true });
// Access params: params.param
// Access search: search.queryParam
```

### Route Parameters
```tsx
// Before (Next.js)
// File: pages/table/[tableId].tsx
const router = useRouter();
const tableId = router.query.tableId;

// After (TanStack Router)
// File: routes/table/$tableId.tsx
export const Route = createFileRoute('/table/$tableId')({
  component: Component,
});
const { tableId } = Route.useParams();
```

### Head Component
```tsx
// Before (Next.js)
import Head from 'next/head';
<Head>
  <title>Page Title</title>
</Head>

// After (TanStack Start)
// Use <title> directly in route component or use route meta
export const Route = createFileRoute('/path')({
  meta: () => [
    { title: 'Page Title' },
  ],
  component: Component,
});
```

### Environment Variables
```tsx
// Before (Next.js)
process.env.NEXT_PUBLIC_VAR
process.env.VAR

// After (Vite/TanStack Start)
import.meta.env.VITE_VAR
import.meta.env.VITE_VAR ?? process.env.VAR
```

### getServerSideProps Replacement
```tsx
// Before (Next.js)
export async function getServerSideProps(context) {
  const data = await fetchData();
  return { props: { data } };
}

// After (TanStack Start)
export const Route = createFileRoute('/path')({
  loader: async () => {
    const data = await fetchData();
    return { data };
  },
  component: Component,
});

// In component:
const data = Route.useLoaderData();
```

### API Routes
```tsx
// Before (Next.js)
// File: pages/api/healthcheck.ts
export default async function handler(req, res) {
  res.json({ status: 'ok' });
}

// After (TanStack Start)
// File: src/server/healthcheck.ts
export async function healthCheck() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// File: src/routes/api/healthcheck.ts
import { healthCheck } from '@/server/healthcheck';
export const Route = createFileRoute('/api/healthcheck')({
  loader: async () => {
    const response = await healthCheck();
    return response.json();
  },
  component: Component,
});
```

## Common Patterns

### Conditional Navigation
```tsx
// Before (Next.js)
if (condition) {
  router.push('/path');
}

// After (TanStack Router)
if (condition) {
  navigate({ to: '/path' });
}
```

### Query Parameters
```tsx
// Before (Next.js)
router.push({
  pathname: '/path',
  query: { id: '123', filter: 'active' }
});

// After (TanStack Router)
navigate({
  to: '/path',
  search: { id: '123', filter: 'active' }
});
```

### Shallow Routing
```tsx
// Before (Next.js)
router.push('/path', undefined, { shallow: true });

// After (TanStack Router)
// Shallow routing is not needed - TanStack Router handles this automatically
navigate({ to: '/path' });
```

### Route Events
```tsx
// Before (Next.js)
router.events.on('routeChangeStart', handler);
router.events.on('routeChangeComplete', handler);

// After (TanStack Router)
// Use router state or navigation callbacks
const router = useRouter();
// Check router.state for navigation state
```

## i18n Migration

```tsx
// Before (next-i18next)
import { useTranslation, Trans } from 'next-i18next';
const { t } = useTranslation('namespace');

// After (react-i18next)
import { useTranslation, Trans } from 'react-i18next';
const { t } = useTranslation('namespace');
// Same API, just different import
```

## Testing Migration

1. Update imports in one file at a time
2. Test the route/component
3. Move to next file
4. Use find/replace for common patterns:
   - `from 'next/link'` → `from '@tanstack/react-router'`
   - `from 'next/router'` → `from '@tanstack/react-router'`
   - `router.push(` → `navigate({ to: `
   - `router.query.` → `params.` or `search.`
   - `href=` → `to=`

