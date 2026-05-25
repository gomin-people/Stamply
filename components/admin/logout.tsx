import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogoutAdminMutation } from '@/features/admin/oauth/adminOauthMutations';
import { useRouter } from 'next/navigation';

type Props = {
  disabled?: boolean;
};

export default function Logout({ disabled = false }: Props) {
  const router = useRouter();
  const { mutate: logout } = useLogoutAdminMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace('/admin');
      },
      onError: (error) => console.error('[handleLogout] :', error),
    });
  };

  return (
    <Button
      disabled={disabled}
      onClick={handleLogout}
      aria-label="로그아웃"
      variant="outline"
      size="icon"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
}
