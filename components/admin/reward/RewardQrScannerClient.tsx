"use client";

import type QrScanner from "qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useClaimAdminRewardQrMutation } from "@/features/admin/reward-qr/adminRewardQrMutations";
import { useQrScanner } from "@/hooks/useQrScanner";
import { cn } from "@/utils";
import type { CameraStatus } from "@/types/qr-check";

type Props = {
  eventId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type RewardQrClaimResult = {
  isSuccess: boolean;
  message: string;
};

const RESULT_DISPLAY_MS = 3000;
const STATUS_RESET_FADE_MS = 180;

const getCameraStatusText = (
  cameraStatus: CameraStatus,
  loadingDotCount: number
) => {
  if (cameraStatus === "active") {
    return "QR 코드를 스캔하세요";
  }

  if (cameraStatus === "denied") {
    return "카메라 권한 필요";
  }

  if (cameraStatus === "unavailable") {
    return "카메라 사용 불가";
  }

  return `카메라 준비 중${".".repeat(loadingDotCount)}`;
};

const ScanStatusPill = ({
  result,
  isChecking,
  isResetting,
}: {
  result: RewardQrClaimResult | null;
  isChecking: boolean;
  isResetting: boolean;
}) => {
  const message = isChecking
    ? "리워드 처리 중입니다."
    : (result?.message ?? "스캔 대기 중");
  const toneClassName = isChecking
    ? "bg-gomin-black/85 text-gomin-white"
    : result
      ? result.isSuccess
        ? "bg-green-600/85 text-gomin-white"
        : "bg-destructive/85 text-gomin-white"
      : "bg-gomin-black/85 text-gomin-white";
  const shouldAnimateResult = !isChecking && result !== null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "absolute left-1/2 top-full mt-4 flex h-10 max-w-[min(28rem,80vw)] -translate-x-1/2 items-center justify-center rounded-full px-4 text-sm font-semibold transition-[opacity,background-color,color] duration-200",
        toneClassName,
        isResetting ? "opacity-0" : "opacity-100",
        shouldAnimateResult && "animate-in fade-in-0 slide-in-from-bottom-2"
      )}
      role="status"
    >
      <span className="truncate">{message}</span>
    </div>
  );
};

const RewardQrScannerClient = ({ eventId, open, onOpenChange }: Props) => {
  const scanLockedRef = useRef(false);
  const isMountedRef = useRef(false);
  const resultResetTimeoutRef = useRef<number | null>(null);
  const statusFadeTimeoutRef = useRef<number | null>(null);
  const [loadingDotCount, setLoadingDotCount] = useState(1);
  const [isStatusResetting, setIsStatusResetting] = useState(false);
  const [claimResult, setClaimResult] = useState<RewardQrClaimResult | null>(
    null
  );
  const { mutate: claimRewardQr, isPending: isChecking } =
    useClaimAdminRewardQrMutation();

  const clearStatusTimers = useCallback(() => {
    if (resultResetTimeoutRef.current !== null) {
      window.clearTimeout(resultResetTimeoutRef.current);
      resultResetTimeoutRef.current = null;
    }

    if (statusFadeTimeoutRef.current !== null) {
      window.clearTimeout(statusFadeTimeoutRef.current);
      statusFadeTimeoutRef.current = null;
    }
  }, []);

  const scheduleStatusReset = useCallback(() => {
    clearStatusTimers();

    resultResetTimeoutRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return;

      setIsStatusResetting(true);

      statusFadeTimeoutRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;

        setClaimResult(null);
        scanLockedRef.current = false;
        setIsStatusResetting(false);
        statusFadeTimeoutRef.current = null;
      }, STATUS_RESET_FADE_MS);

      resultResetTimeoutRef.current = null;
    }, RESULT_DISPLAY_MS);
  }, [clearStatusTimers]);

  const resetScannerState = useCallback(() => {
    clearStatusTimers();
    scanLockedRef.current = false;
    setClaimResult(null);
    setIsStatusResetting(false);
  }, [clearStatusTimers]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetScannerState();
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange, resetScannerState]
  );

  const handleQrDecode = useCallback(
    (result: QrScanner.ScanResult) => {
      const qrValue = result.data.trim();

      if (scanLockedRef.current || !qrValue) {
        return;
      }

      scanLockedRef.current = true;
      clearStatusTimers();
      setIsStatusResetting(false);
      setClaimResult(null);

      claimRewardQr(
        { eventId, qrValue },
        {
          onSuccess: () => {
            if (isMountedRef.current) {
              setClaimResult({
                isSuccess: true,
                message: "리워드 수령 처리가 완료되었습니다.",
              });
              scheduleStatusReset();
            }
          },
          onError: (error) => {
            if (isMountedRef.current) {
              setClaimResult({
                isSuccess: false,
                message:
                  error instanceof Error
                    ? error.message
                    : "리워드 수령 처리에 실패했습니다.",
              });
              scheduleStatusReset();
            }
          },
        }
      );
    },
    [claimRewardQr, clearStatusTimers, eventId, scheduleStatusReset]
  );

  const {
    cameraStatus,
    handleVideoLoadedMetadata,
    handleVideoPlaying,
    setVideoRef,
  } = useQrScanner({
    enabled: open,
    errorLogLabel: "Reward QR scanner",
    onDecode: handleQrDecode,
    preferredCamera: "user",
  });
  const isCameraActive = cameraStatus === "active";

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearStatusTimers();
    };
  }, [clearStatusTimers]);

  useEffect(() => {
    if (!open) return;
    if (cameraStatus !== "loading") return;

    const intervalId = window.setInterval(() => {
      setLoadingDotCount((currentCount) =>
        currentCount === 3 ? 1 : currentCount + 1
      );
    }, 300);

    return () => window.clearInterval(intervalId);
  }, [cameraStatus, open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(1180px,calc(100vw-3rem))] max-h-[calc(100vh-3rem)] overflow-hidden bg-gomin-white p-0 sm:max-w-none"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-30 size-9 cursor-pointer bg-gomin-white text-gomin-black hover:bg-gomin-neutral-100 hover:text-gomin-black"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">닫기</span>
          </Button>
        </DialogClose>
        <section className="relative aspect-[16/11] overflow-hidden bg-gomin-neutral-700 text-gomin-white">
          <video
            ref={setVideoRef}
            className={cn(
              "absolute inset-0 h-full w-full -scale-x-100 bg-gomin-black object-cover transition-opacity duration-200",
              isCameraActive ? "opacity-100" : "opacity-0"
            )}
            autoPlay
            muted
            playsInline
            onLoadedMetadata={handleVideoLoadedMetadata}
            onPlaying={handleVideoPlaying}
          />
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gomin-neutral-200">
              {cameraStatus === "loading" ? (
                <Loader2 className="size-8 animate-spin" aria-hidden="true" />
              ) : (
                <Video className="size-8" aria-hidden="true" />
              )}
              <p className="text-sm font-medium">
                {getCameraStatusText(cameraStatus, loadingDotCount)}
              </p>
            </div>
          )}

          <div className="pointer-events-none absolute left-1/2 top-1/2 w-72 max-w-[42%] -translate-x-1/2 -translate-y-1/2">
            <div className="aspect-square rounded-xl border-4 border-gomin-primary-700" />
            <ScanStatusPill
              result={claimResult}
              isChecking={isChecking}
              isResetting={isStatusResetting}
            />
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default RewardQrScannerClient;
