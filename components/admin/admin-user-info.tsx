'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminOauthUserQueries } from "@/features/admin/oauth/user/adminOauthUserQueries"
import { logoutAdmin } from '@/features/admin/oauth/api/adminOauthLogout';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUserInfo() {
    const router = useRouter();

    const { data: user, isLoading } = useAdminOauthUserQueries()

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            alert('로그아웃 되었습니다.');
            router.replace('/admin');
        } catch (error) {
            console.error("[handleLogout] :", error);
            alert('로그아웃에 실패했습니다.');
        }
    }

    return (
        <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2.5 p-2">
                {isLoading ? (
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F4748A] flex items-center justify-center shrink-0">
                        <span className="text-xl font-bold text-white">{user?.name[0]}</span>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {isLoading ? (
                        <Skeleton className="h-5 w-24" />
                    ) : (
                        <p className="text-lg font-bold text-gomin-black">{user?.name}</p>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    aria-label="로그아웃"
                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-gomin-neutral-200 text-gomin-neutral-400 hover:text-gomin-neutral-600 hover:border-gomin-neutral-300 transition-colors shrink-0"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
