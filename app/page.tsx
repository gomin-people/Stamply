import Image from "next/image";
import Link from "next/link";
import StamploLogo from "@/components/admin/common/StamploLogo";

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
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="text-center">
            <StamploLogo />
            <p className="text-sm text-gomin-neutral-500 mt-1">테스트 가이드</p>
          </div>
        </div>

        {/* QR 코드 직접 테스트 */}
        <div className="flex gap-6 items-start">
          <Section title="사용자 테스트하기 1번 행사">
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
                  src="/qr/entry_qr_1.png"
                  alt="입장 QR"
                  width={200}
                  height={200}
                  className="border border-gomin-neutral-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <StepItem
                  step="2"
                  description="아래 미션 QR 코드를 스캔하면 미션이 완료 처리됩니다."
                />

                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission1_1.png"
                        alt="미션 QR 1"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 1</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission1_2.png"
                        alt="미션 QR 2"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 2</p>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission1_3.png"
                        alt="미션 QR 3"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 3</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission1_4.png"
                        alt="미션 QR 4"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 4</p>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission1_5.png"
                        alt="미션 QR 5"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 5</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission1_6.png"
                        alt="미션 QR 6"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 6</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="사용자 테스트하기 2번 행사">
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
                  src="/qr/entry_qr_30.png"
                  alt="입장 QR 30"
                  width={200}
                  height={200}
                  className="border border-gomin-neutral-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <StepItem
                  step="2"
                  description="아래 미션 QR 코드를 스캔하면 미션이 완료 처리됩니다."
                />

                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission30_1.png"
                        alt="미션 QR 1"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 1</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission30_2.png"
                        alt="미션 QR 2"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 2</p>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission30_3.png"
                        alt="미션 QR 3"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 3</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/qr/mission30_4.png"
                        alt="미션 QR 4"
                        width={130}
                        height={130}
                        className="border border-gomin-neutral-100"
                      />
                      <p className="text-xs text-gomin-neutral-400">미션 4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
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
              description="카카오 로그인합니다. 사전에 제공한 테스트 계정으로 로그인 시도했을때 이메일 인증이 필요한 경우 연락 부탁드립니다.  "
            />
          </ol>
        </Section>

        <p className="text-center text-xs text-gomin-neutral-300 pb-4">
          Stamplo © 2026
        </p>
      </div>
    </div>
  );
}
