"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useIsEditMode, useSetPendingHref } from "@/stores/admin";

type SidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

interface SidebarNavProps {
  items: SidebarNavItem[];
  pathname: string;
}

// 관리자 사이드바 라우트 메뉴 목록
export default function SidebarNav({ items, pathname }: SidebarNavProps) {
  const isEditMode = useIsEditMode();
  const setPendingHref = useSetPendingHref();

  return (
    <nav className="mt-6 space-y-1">
      <Separator className="mb-4 bg-gomin-neutral-100" />
      <p className="ml-2 mb-2 text-xs text-gomin-neutral-500">메뉴</p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => {
              if (isEditMode && pathname !== item.href) {
                e.preventDefault();
                setPendingHref(item.href);
              }
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm transition-[background-color,color,box-shadow,transform] duration-150 ease-out ${
              isActive
                ? " bg-gomin-primary-700 text-gomin-white shadow-lg shadow-gomin-primary-700/30"
                : "text-gomin-neutral-700 hover:bg-gomin-neutral-100 hover:text-gomin-black"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
