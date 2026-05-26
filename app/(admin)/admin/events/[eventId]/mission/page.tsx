import MissionFilter from '@/components/admin/Mission/MissionFilter';
import QRDownloadButton from '@/components/admin/Mission/QRDownloadButton';
import MissionList from '@/components/admin/Mission/MissionList';
import MissionStats from '@/components/admin/Mission/MissionStats';

const missions = [
  {
    id: 1,
    name: '1번 부스 · 슈가버블 솜사탕',
    description: '솜사탕 부스에서 시그니처 메뉴를 주문하고 QR 스캔',
    active: true,
  },
  {
    id: 2,
    name: '2번 부스 · 노티드 도넛 체험',
    description: '도넛 만들기 클래스 참여 후 인증 스탬프',
    active: true,
  },
  {
    id: 3,
    name: '3번 부스 · 블루보틀 컵 디자인',
    description: '나만의 텀블러 슬리브 디자인 후 사진 업로드',
    active: true,
  },
  {
    id: 4,
    name: '4번 부스 · 어메이즈 포토존',
    description: '포토부스에서 4컷 사진 촬영 후 SNS 해시태그',
    active: true,
  },
  {
    id: 5,
    name: '5번 부스 · 마맹킴 시즌 굿즈',
    description: '시즌 한정 굿즈 픽업 카운터 QR 스캔',
    active: true,
  },
  {
    id: 6,
    name: '6번 부스 · 스탬플리 마지막 미션',
    description: '5개 미션을 모두 완료한 참여자만 잠금 해제',
    active: false,
  },
];

export default function MissionPage() {
  const activeCount = missions.filter((m) => m.active).length;
  const inactiveCount = missions.filter((m) => !m.active).length;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gomin-black">미션 관리</h1>
          <p className="mt-1 text-sm text-gomin-neutral-400">
            &quot;성수 팝업 페스타 2026&quot; 의 미션 목록입니다. 행을 끌어
            순서를 변경할 수 있습니다.
          </p>
        </div>
        <QRDownloadButton />
      </div>

      <div className="bg-white border rounded-xl border-gomin-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gomin-neutral-100">
          <MissionStats
            total={missions.length}
            active={activeCount}
            inactive={inactiveCount}
          />
          <MissionFilter />
        </div>

        <div
          className="grid items-center px-6 py-3 text-sm font-medium border-b bg-gomin-primary-100 text-gomin-primary-700 border-gomin-neutral-100"
          style={{ gridTemplateColumns: '40px 60px 1fr 2fr 110px 72px 90px' }}
        >
          <div />
          <div>#</div>
          <div>미션명</div>
          <div>설명</div>
          <div className="text-center">활성화</div>
          <div className="text-center">QR</div>
          <div className="text-center">관리</div>
        </div>

        <MissionList missions={missions} />
      </div>
    </div>
  );
}
