import dynamic from '@/lib/utils/dynamic';
import { Skeleton } from '@/ui-lib/shadcn';

export const DynamicFieldGraph = dynamic(
  () => import('./FieldGraph').then((mod) => mod.FieldGraph),
  {
    loading: () => (
      <div className="space-y-2 p-4">
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
