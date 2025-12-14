import { ArrowLeft, TeableNew } from '@teable/icons';
import { useSidebar } from '../../contexts/SidebarContext';

interface ISidebarBackButtonProps {
  title?: string;
  icon?: React.ReactNode;
  onBack?: () => void;
}

export const SidebarHeaderLeft = (props: ISidebarBackButtonProps) => {
  const { title, icon, onBack } = props;
  const { leftVisible } = useSidebar();
  const isCollapsed = leftVisible === 'collapsed';
  const displayIcon = icon ?? <TeableNew className="size-5 shrink-0 text-black" />;

  return (
    <>
      {onBack ? (
        <div
          className="mx-2 size-5 shrink-0 cursor-pointer"
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

      {!isCollapsed && <p className="ml-[2px] truncate text-sm">{title ?? 'Teable'}</p>}
    </>
  );
};
