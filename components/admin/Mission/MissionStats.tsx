import { Badge } from '@/components/ui/badge';

type Props = {
  total: number;
  active: number;
  inactive: number;
};

export default function MissionStats({ total, active, inactive }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge className="bg-gomin-primary-100 text-gomin-primary-700">
        총 {total} 개 미션
      </Badge>
      <Badge variant="secondary" className="bg-green-100 text-green-600">
        활성 {active}
      </Badge>
      <Badge variant="secondary" className="bg-gomin-neutral-100 text-gomin-neutral-700">
        비활성 {inactive}
      </Badge>
    </div>
  );
}
