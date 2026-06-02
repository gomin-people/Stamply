import Image from "next/image";
import { cn } from "@/utils";

type EventPosterProps = {
  width: number;
  height: number;
  src: string;
  alt?: string;
  className?: string;
};

const EventPoster = ({
  width,
  height,
  src,
  alt = "행사 포스터",
  className,
}: EventPosterProps) => {
  return (
    <div
      style={{ width, height }}
      className={cn(
        "relative rounded-[20px] shadow-card overflow-hidden shrink-0",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${width}px`}
        priority
        className="object-cover"
      />
    </div>
  );
};

export default EventPoster;
