import { useQuery } from '@tanstack/react-query';
import { Database, Plus } from '@teable/icons';
import { getBaseAll } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { Spin } from '@teable/ui-lib/base';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { AccessList } from './AccessList';

interface IValue {
  baseIds: string[];
}

interface IAccessSelectProps {
  value?: IValue;
  onChange: (value: IValue) => void;
}

export const AccessSelect = (props: IAccessSelectProps) => {
  const { onChange, value } = props;
  const { t } = useTranslation('token');
  const [bases, setBases] = useState<string[]>(value?.baseIds || []);
  const [open, setOpen] = useState(false);

  const { data: baseList, isLoading: baseListLoading } = useQuery({
    queryKey: ReactQueryKeys.baseAll(),
    queryFn: () => getBaseAll().then((data) => data.data),
  });

  const onChangeInner = (baseId?: string) => {
    onChange({
      baseIds: baseId ? [...bases, baseId] : bases,
    });
  };

  const onDeleteBaseId = (baseId: string) => {
    const newBases = bases.filter((id) => id !== baseId);
    setBases(newBases);
    onChange({
      baseIds: newBases,
    });
  };

  if (baseListLoading) {
    return <Spin className="size-5" />;
  }

  return (
    <div>
      <AccessList baseIds={bases} onDeleteBaseId={onDeleteBaseId} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-start">
            <Plus className="size-4 shrink-0" />
            {t('accessSelect.button')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder={t('accessSelect.inputPlaceholder')} className="h-9" />
            <CommandEmpty>{t('accessSelect.empty')}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {baseList
                  ?.filter(({ id: baseId }) => !bases.includes(baseId))
                  ?.map(({ id, name }) => (
                    <CommandItem
                      key={id}
                      value={name}
                      onSelect={() => {
                        setBases((prev) => [...prev, id]);
                        setOpen(false);
                        onChangeInner(id);
                      }}
                    >
                      <Database className="size-4 shrink-0" />
                      {name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
