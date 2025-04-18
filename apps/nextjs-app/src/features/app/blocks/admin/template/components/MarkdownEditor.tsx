import { Edit } from '@teable/icons';
import { cn, Textarea } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';
import { MarkdownPreview } from '@/features/app/components/mark-down-preview';

interface MarkdownEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation('common');
  return (
    <div className="flex w-full items-center gap-2 overflow-hidden">
      {isEditing ? (
        <Textarea
          defaultValue={value}
          className="size-40"
          onKeyDown={(e) => {
            const newValue = (e.target as HTMLInputElement).value;
            if (e.key === 'Enter' && !e.shiftKey) {
              setIsEditing(false);
              onChange(newValue);
            }
          }}
          onBlur={(e) => {
            const newValue = e.target.value;
            if (newValue !== value) {
              onChange(newValue);
            }
            setIsEditing(false);
          }}
          ref={inputRef}
        />
      ) : (
        <div
          className={cn('overflow-auto', {
            'flex-1': value || value === '0',
          })}
        >
          {value || value === '0' ? (
            <MarkdownPreview className="max-h-40 overflow-auto">{value}</MarkdownPreview>
          ) : (
            <span className="px-3 py-2 text-sm text-gray-500">{t('noDescription')}</span>
          )}
        </div>
      )}

      <Edit
        className="size-3 shrink-0 cursor-pointer"
        onClick={() => {
          setIsEditing(true);

          setTimeout(() => {
            inputRef?.current?.focus();
          }, 100);
        }}
      />
    </div>
  );
};
