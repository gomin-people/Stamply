"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/browser";

type UseDashboardKpiBroadcastParams = {
  eventId: number;
  enabled: boolean;
  onInvalidate: () => void;
};

/**
 * 관리자 대시보드 KPI 갱신 신호를 Realtime private Broadcast로 구독합니다.
 *
 * 실제 데이터는 조회하지 않고 invalidate 신호만 받아 KPI route refetch를 호출합니다.
 */
export const useDashboardKpiBroadcast = ({
  eventId,
  enabled,
  onInvalidate,
}: UseDashboardKpiBroadcastParams) => {
  useEffect(() => {
    if (
      !enabled ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const topic = `dashboard-kpis:${eventId}`;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let isDisposed = false;

    const subscribe = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        await supabase.realtime.setAuth(session.access_token);
      } else {
        await supabase.realtime.setAuth();
      }

      if (isDisposed) {
        return;
      }

      channel = supabase
        .channel(topic, { config: { private: true } })
        .on("broadcast", { event: "invalidate" }, () => {
          onInvalidate();
        });

      channel.subscribe();
    };

    void subscribe().catch(() => {
      // Realtime 실패 시에도 매 분 00초 fallback polling이 KPI를 보정합니다.
    });

    return () => {
      isDisposed = true;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [enabled, eventId, onInvalidate]);
};
