import { cn } from '@/utils';

type BrochureIndicatorProps = {
  total: number;
  currentIndex: number;
};

const BrochureIndicator = ({ total, currentIndex }: BrochureIndicatorProps) => {
  const count = Math.min(total, 10);

  return (
    <div className="flex gap-3 w-75">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex-1 h-1.5 rounded-[10px] transition-colors duration-300',
            index === currentIndex
              ? 'bg-(--primary-color)'
              : 'bg-gomin-neutral-300'
          )}
        />
      ))}
    </div>
  );
};

export default BrochureIndicator;
