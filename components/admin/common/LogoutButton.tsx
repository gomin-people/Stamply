import { useRef } from "react";
import { LogoutIcon, type LogoutIconHandle } from "lucide-animated";
import { Button } from "@/components/ui/button";
import { useAdminLogoutMutation } from "@/features/admin/logout/adminLogoutMutations";
import { useRouter } from "next/navigation";
import { useClearSelectedEventId } from "@/stores/admin";

type Props = {
  disabled?: boolean;
};

export default function Logout({ disabled = false }: Props) {
  const router = useRouter();
  const clearSelectedEventId = useClearSelectedEventId();
  const { mutate: logout } = useAdminLogoutMutation();
  const logoutIconRef = useRef<LogoutIconHandle>(null);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearSelectedEventId();
        router.replace("/admin");
      },
      onError: (error) => console.error("[handleLogout] :", error),
    });
  };

  return (
    <Button
      disabled={disabled}
      onClick={handleLogout}
      onMouseEnter={() => logoutIconRef.current?.startAnimation()}
      onMouseLeave={() => logoutIconRef.current?.stopAnimation()}
      aria-label="로그아웃"
      variant="outline"
      size="icon"
      className="cursor-pointer disabled:cursor-not-allowed"
    >
      <LogoutIcon
        ref={logoutIconRef}
        size={20}
        animateOnHover={false}
        className="shrink-0 text-current"
      />
    </Button>
  );
}
