import { LogOut } from "lucide-react";
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
      aria-label="로그아웃"
      variant="outline"
      size="icon"
      className="cursor-pointer disabled:cursor-not-allowed"
    >
      <LogOut className="size-5" />
    </Button>
  );
}
