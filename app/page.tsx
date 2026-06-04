import Image from "next/image";
import Link from "next/link";
import StamplyLogo from "@/components/admin/common/StamplyLogo";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white rounded-2xl p-6 shadow-card border border-gomin-neutral-100">
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-base font-bold text-gomin-neutral-700">{title}</h2>
    </div>
    {children}
  </section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block bg-gomin-primary-100 text-gomin-primary-700 text-xs font-semibold px-2 py-0.5 rounded-md">
    {children}
  </span>
);

const StepItem = ({
  step,
  description,
}: {
  step: string;
  description: string;
}) => (
  <li className="flex gap-3 text-sm">
    <span className="shrink-0 w-5 h-5 rounded-full bg-gomin-primary-200 text-gomin-primary-700 flex items-center justify-center text-xs font-bold mt-0.5">
      {step}
    </span>
    <span className="text-gomin-neutral-600 leading-relaxed">
      {description}
    </span>
  </li>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gomin-primary-100">
      <div className="max-w-sm mx-auto px-4 py-8 flex flex-col gap-6">
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="text-center">
            <StamplyLogo />
            <p className="text-sm text-gomin-neutral-500 mt-1">테스트 가이드</p>
          </div>
        </div>

        {/* 어드민 접근 */}
        <Section title="어드민 페이지 접근">
          <div className="flex items-center gap-2 mb-3">
            <Badge>PC 전용</Badge>
            <span className="text-xs text-gomin-neutral-400">
              모바일/태블릿은 차단됩니다
            </span>
          </div>

          <ol className="flex flex-col gap-2.5">
            <StepItem
              step="1"
              description="아래 버튼을 클릭해 어드민 페이지로 이동합니다."
            />
            <Link
              href="/admin"
              className="flex items-center justify-center w-full py-3 mb-4 rounded-xl bg-gomin-primary-700 text-white text-sm font-semibold hover:bg-gomin-primary-600 transition-colors"
            >
              어드민 페이지로 접근하기
            </Link>
            <StepItem
              step="2"
              description="사전에 제공한 테스트 계정으로 카카오 로그인합니다. 또는 신규 가입도 가능합니다. "
            />
          </ol>
        </Section>

        {/* 사용자 테스트 */}
        <Section title="사용자 테스트하기 1번째 방법">
          <div className="flex items-center gap-2 mb-3">
            <Badge>어드민 페이지 접근 후 진행</Badge>
          </div>
          <ol className="flex flex-col gap-2.5">
            <StepItem
              step="1"
              description="사이드바에 있는 '현재 행사' 셀렉트 박스에서 행사를 선택합니다."
            />
            <StepItem step="2" description="'행사관리 메뉴'를 클릭합니다." />
            <StepItem
              step="3"
              description="'QR 다운로드 버튼'을 클릭해 입장 QR을 확인합니다."
            />
            <StepItem
              step="4"
              description="'입장 QR'을 핸드폰으로 스캔합니다. "
            />
            <StepItem
              step="5"
              description="모바일에서 '시작하기' 버튼을 클릭합니다."
            />
            <StepItem
              step="6"
              description="브로슈어 페이지 왼쪽을 클릭해서 화면을 넘긴 후 '스탬프 투어 시작하기 버튼'을 클릭합니다."
            />
            <StepItem
              step="7"
              description="어드민 페이지에서 '미션 관리 메뉴'로 이동합니다."
            />
            <StepItem step="8" description="'미션 QR' 버튼을 클릭합니다." />
            <StepItem
              step="9"
              description="모바일에서 'QR 체크하기' 버튼을 클릭하여 위에 생성된 QR 스캔하면 미션이 완료처리됩니다."
            />
          </ol>
        </Section>

        {/* QR 코드 직접 테스트 */}
        <Section title="사용자 테스트하기 2번째 방법">
          <div className="flex items-center gap-2 mb-4">
            <Badge>모바일로 스캔</Badge>
          </div>
          <div className="flex flex-col gap-4">
            <StepItem
              step="1"
              description="아래 입장 QR 코드를 먼저 스캔하세요."
            />
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/entry_qr.png"
                alt="입장 QR"
                width={200}
                height={200}
                className="border border-gomin-neutral-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <StepItem
                step="2"
                description="아래 미션 QR 코드를 스캔하면 미션이 완료 처리됩니다. (해당 행사의 미션은 총 10개입니다.)"
              />

              <div className="flex gap-4 justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  <Image
                    src="/images/mission1.png"
                    alt="미션 QR 1"
                    width={130}
                    height={130}
                    className="border border-gomin-neutral-100"
                  />
                  <p className="text-xs text-gomin-neutral-400">미션 1</p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Image
                    src="/images/mission2.png"
                    alt="미션 QR 2"
                    width={130}
                    height={130}
                    className="border border-gomin-neutral-100"
                  />
                  <p className="text-xs text-gomin-neutral-400">미션 2</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <p className="text-center text-xs text-gomin-neutral-300 pb-4">
          Stamply © 2026
        </p>
      </div>
    </div>
  );
}
