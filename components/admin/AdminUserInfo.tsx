"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminUserQuery } from "@/features/admin/user/adminUserQueries";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminUserInfo() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useAdminUserQuery();

  useEffect(() => {
    if (isError) router.replace("/admin");
  }, [isError, router]);

  return (
    <div>
      <Separator className="mb-4 bg-gomin-neutral-100" />
      <div className="flex items-center gap-2.5 p-2">
        {isLoading ? (
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#F4748A] flex items-center justify-center shrink-0">
            <span className="text-sm text-white">{user?.name[0]}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <p className="text-sm text-gomin-black">{user?.name}</p>
          )}
        </div>

        <LogoutButton disabled={isLoading} />
      </div>
    </div>
  );
}
