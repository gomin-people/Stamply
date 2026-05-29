// 서버 컴포넌트
import MissionItem from "./mission/MissionItem";

const MISSIONS = [
  { id: 1, title: "미션 1", description: "샘플코드입니다.", isStamped: true },
  { id: 2, title: "미션 1", description: "샘플코드입니다.", isStamped: true },
  { id: 3, title: "미션 1", description: "샘플코드입니다.", isStamped: true },
  { id: 4, title: "미션 1", description: "샘플코드입니다.", isStamped: false },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MissionList = async () => {
  await delay(2000);
  //여기에 실제 api
  // 로딩 스켈레톤을 보여주기 위해 딜레이 줬습니다.
  return (
    <div className="flex flex-col gap-3 flex-1">
      {MISSIONS.map((mission) => (
        <MissionItem key={mission.id} mission={mission} />
      ))}
    </div>
  );
};

export default MissionList;
