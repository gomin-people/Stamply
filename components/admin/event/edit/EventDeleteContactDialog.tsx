import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EventDeleteContactDialog = () => {
  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gomin-black">
          행사 삭제 제한 안내
        </DialogTitle>
        <DialogDescription className="mt-1">
          행사 삭제는 데이터 보호를 위해 직접 삭제가 제한됩니다.
          <br />
          삭제가 필요한 경우 관리자에게 문의해주세요.
          <br />
          <br />
          📧 gominpeople26@gmail.com
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">닫기</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default EventDeleteContactDialog;
