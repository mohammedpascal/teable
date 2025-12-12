import { ArrowLeft, TeableNew } from '@teable/icons';

interface ISidebarBackButtonProps {
  title?: string;
  icon?: React.ReactNode;
  onBack?: () => void;
}

export const SidebarHeaderLeft = (props: ISidebarBackButtonProps) => {
  const { title, icon, onBack } = props;
  const displayIcon = icon ?? <TeableNew className="size-5 shrink-0 text-black" />;

  return (
    <>
      {onBack ? (
        <div
          className="size-5 shrink-0 cursor-pointer"
          onClick={() => onBack?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onBack?.();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <ArrowLeft className="size-5 text-black" />
        </div>
      ) : (
        displayIcon
      )}

      <p className="ml-[2px] truncate text-sm">{title ?? 'Teable'}</p>
    </>
  );
};
