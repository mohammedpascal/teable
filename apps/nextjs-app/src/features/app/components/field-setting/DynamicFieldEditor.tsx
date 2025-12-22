import dynamic from '@/lib/utils/dynamic';
import { Skeleton } from '@/ui-lib/shadcn';

export const DynamicFieldEditor = dynamic(
  () => import('./FieldEditor').then((mod) => mod.FieldEditor),
  {
    loading: () => (
      <div className="h-full space-y-2 p-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    ),
    ssr: false,
  }
);
