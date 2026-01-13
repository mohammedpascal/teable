import { useTable } from '@/sdk/hooks';
import {
  Dialog,
  DialogTrigger,
  Button,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/ui-lib/shadcn';
import { useTranslation } from 'react-i18next';
import { DynamicFieldGraph } from '../../graph/DynamicFieldGraph';
export const FieldGraph = ({ fieldId }: { fieldId: string }) => {
  const table = useTable();
  const { t } = useTranslation(['common', 'table']);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'xs'} variant={'outline'}>
          {t('table:field.editor.graph')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DynamicFieldGraph tableId={table?.id as string} fieldId={fieldId} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('common:actions.close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
