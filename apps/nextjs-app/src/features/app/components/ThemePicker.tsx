import { useTheme } from '@teable/next-themes';
import { cn } from '@/ui-lib/shadcn';
import { Button } from '@/ui-lib/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/ui-lib/shadcn/ui/dropdown-menu';
export const ThemePicker: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn('capitalize', className)} size={'xs'} variant="ghost">
          {theme || 'system'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            setTheme(value);
          }}
        >
          {['light', 'dark', 'system'].map((item) => {
            return (
              <DropdownMenuRadioItem
                className="capitalize"
                key={item}
                disabled={theme === item}
                value={item}
              >
                {item}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
