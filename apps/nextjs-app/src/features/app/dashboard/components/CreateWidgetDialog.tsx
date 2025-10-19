import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWidget, type WidgetVo } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { useBaseId } from '@teable/sdk/hooks';
import { Error } from '@teable/ui-lib/base';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { dashboardConfig } from '@/features/i18n/dashboard.config';

interface ICreateWidgetDialogProps {
  children?: React.ReactNode;
  dashboardId: string;
  onSuccessCallback?: (widget: WidgetVo) => void;
}

export interface ICreateWidgetDialogRef {
  open: () => void;
  close: () => void;
}

const WIDGET_TYPES = [
  { value: 'chart', label: 'Chart' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'table', label: 'Table' },
  { value: 'metric', label: 'Metric' },
  { value: 'text', label: 'Text' },
];

export const CreateWidgetDialog = forwardRef<
  ICreateWidgetDialogRef,
  ICreateWidgetDialogProps
>(({ children, dashboardId, onSuccessCallback }, ref) => {
  const baseId = useBaseId()!;
  const [error, setError] = useState<string>();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation(dashboardConfig.i18nNamespaces);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const { mutate: createWidgetMutate, isPending } = useMutation({
    mutationFn: (data: { name: string; type: string }) =>
      createWidget(baseId, dashboardId, data),
    onSuccess: (res) => {
      setOpen(false);
      setName('');
      setType('');
      setError(undefined);
      queryClient.invalidateQueries(ReactQueryKeys.getDashboard(dashboardId));
      onSuccessCallback?.(res.data);
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create widget');
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Widget name is required');
      return;
    }
    if (!type) {
      setError('Widget type is required');
      return;
    }
    createWidgetMutate({ name: name.trim(), type });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>Add Widget</DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Widget Name</label>
            <Input
              placeholder="Enter widget name"
              value={name}
              onChange={(e) => {
                setError(undefined);
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Widget Type</label>
            <Select
              value={type}
              onValueChange={(value) => {
                setError(undefined);
                setType(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                {WIDGET_TYPES.map((widgetType) => (
                  <SelectItem key={widgetType.value} value={widgetType.value}>
                    {widgetType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Error error={error} />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim() || !type}
          >
            {isPending ? 'Creating...' : 'Create Widget'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

CreateWidgetDialog.displayName = 'CreateWidgetDialog';