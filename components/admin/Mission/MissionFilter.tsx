import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type MissionFilter = 'all' | 'active' | 'inactive';

type Props = {
  defaultValue?: MissionFilter;
};

export default function MissionFilter({ defaultValue = 'all' }: Props) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      spacing={0}
      defaultValue={defaultValue}
    >
      <ToggleGroupItem
        value="all"
        className="data-[state=on]:bg-gomin-primary-600 data-[state=on]:text-white"
      >
        전체
      </ToggleGroupItem>
      <ToggleGroupItem
        value="active"
        className="data-[state=on]:bg-gomin-primary-600 data-[state=on]:text-white"
      >
        활성
      </ToggleGroupItem>
      <ToggleGroupItem
        value="inactive"
        className="data-[state=on]:bg-gomin-primary-600 data-[state=on]:text-white"
      >
        비활성
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
