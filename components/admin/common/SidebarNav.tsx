"use client";

import Link from "next/link";
import { useRef } from "react";
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  MouseEvent,
  RefAttributes,
} from "react";
import {
  CalendarCheck2Icon,
  ClipboardCheckIcon,
  LayoutGridIcon,
} from "lucide-animated";
import type { AdminSidebarIconName } from "@/constants/adminRoutes";
import { Separator } from "@/components/ui/separator";
import { useIsEditMode, useSetPendingHref } from "@/stores/admin";

type SidebarNavItem = {
  label: string;
  href: string;
  icon: AdminSidebarIconName;
};

type SidebarNavProps = {
  items: SidebarNavItem[];
  pathname: string;
};

type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type AnimatedIconProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
  animateOnHover?: boolean;
};

type AnimatedIcon = ForwardRefExoticComponent<
  AnimatedIconProps & RefAttributes<AnimatedIconHandle>
>;

type SidebarNavLinkProps = {
  item: SidebarNavItem;
  pathname: string;
  onNavClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

const SIDEBAR_ICONS: Record<AdminSidebarIconName, AnimatedIcon> = {
  "layout-grid": LayoutGridIcon,
  "calendar-check-2": CalendarCheck2Icon,
  "clipboard-check": ClipboardCheckIcon,
};

const SidebarNavLink = ({
  item,
  pathname,
  onNavClick,
}: SidebarNavLinkProps) => {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const Icon = SIDEBAR_ICONS[item.icon];
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={(e) => onNavClick(e, item.href)}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm transition-[background-color,color,box-shadow,transform] duration-150 ease-out ${
        isActive
          ? " bg-gomin-primary-700 text-gomin-white shadow-lg shadow-gomin-primary-700/30"
          : "text-gomin-neutral-700 hover:bg-gomin-neutral-100 hover:text-gomin-black"
      }`}
    >
      <Icon
        ref={iconRef}
        size={20}
        animateOnHover={false}
        className="shrink-0 text-current"
      />
      {item.label}
    </Link>
  );
};

// 관리자 사이드바 라우트 메뉴 목록
const SidebarNav = ({ items, pathname }: SidebarNavProps) => {
  const isEditMode = useIsEditMode();
  const setPendingHref = useSetPendingHref();

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isEditMode && pathname !== href) {
      e.preventDefault();
      setPendingHref(href);
    }
  };

  return (
    <nav className="mt-6 space-y-1">
      <Separator className="mb-4 bg-gomin-neutral-100" />
      <p className="ml-2 mb-2 text-xs text-gomin-neutral-500">메뉴</p>
      {items.map((item) => (
        <SidebarNavLink
          key={item.href}
          item={item}
          pathname={pathname}
          onNavClick={handleNavClick}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;
