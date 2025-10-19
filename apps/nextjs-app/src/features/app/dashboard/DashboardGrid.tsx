import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from '@teable/icons';
import type { IDashboardLayout } from '@teable/openapi';
import { getDashboard, updateLayoutDashboard } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { useBaseId, useBasePermission } from '@teable/sdk/hooks';
import { Button } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { dashboardConfig } from '@/features/i18n/dashboard.config';
import { CreateWidgetDialog, type ICreateWidgetDialogRef } from './components/CreateWidgetDialog';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardGrid = (props: { dashboardId: string }) => {
  const { dashboardId } = props;
  const baseId = useBaseId()!;
  const queryClient = useQueryClient();
  const { t } = useTranslation(dashboardConfig.i18nNamespaces);
  const [, setIsDragging] = useState(false);
  const basePermissions = useBasePermission();
  const canMange = basePermissions?.['base|update'];
  const createWidgetDialogRef = useRef<ICreateWidgetDialogRef>(null);
  const { data: dashboardData } = useQuery({
    queryKey: ReactQueryKeys.getDashboard(dashboardId),
    queryFn: () => getDashboard(baseId, dashboardId).then((res) => res.data),
  });

  const { mutate: updateLayoutDashboardMutate } = useMutation({
    mutationFn: (layout: IDashboardLayout) => updateLayoutDashboard(baseId, dashboardId, layout),
    onSuccess: () => {
      queryClient.invalidateQueries(ReactQueryKeys.getDashboard(dashboardId));
    },
  });

  const layout = dashboardData?.layout ?? [];
  const widgetMap = dashboardData?.widgetMap ?? {};

  const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
    updateLayoutDashboardMutate(layout.map(({ i, x, y, w, h }) => ({ widgetId: i, x, y, w, h })));
  };

  return (
    <div className="space-y-4">
      {canMange && (
        <div className="flex justify-end">
          <CreateWidgetDialog ref={createWidgetDialogRef} dashboardId={dashboardId}>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 size-4" />
              Add Widget
            </Button>
          </CreateWidgetDialog>
        </div>
      )}
      <ResponsiveGridLayout
        className="w-full"
        layouts={{
          md: layout.map(({ widgetId, x, y, w, h }) => ({
            i: widgetId,
            x,
            y,
            w,
            h,
          })),
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        rowHeight={80}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle=".dashboard-draggable-handle"
        onResize={() => setIsDragging(true)}
        onResizeStop={(layout) => {
          setIsDragging(false);
          onLayoutChange(layout);
        }}
        onDrag={() => setIsDragging(true)}
        onDragStop={(layout) => {
          setIsDragging(false);
          onLayoutChange(layout);
        }}
        isResizable={canMange}
        isDraggable={canMange}
      >
        {layout.map(({ widgetId, x, y, w, h }) => (
          <div
            key={widgetId}
            data-grid={{ x, y, w, h }}
            className="rounded-lg border bg-background p-4"
          >
            {widgetMap[widgetId] ? (
              <div>
                <h3 className="font-medium">{widgetMap[widgetId].name}</h3>
                <p className="text-sm text-muted-foreground">{widgetMap[widgetId].type} widget</p>
              </div>
            ) : (
              <div>{t('common:widgetNotFound')}</div>
            )}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
