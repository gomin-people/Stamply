import Image from "next/image";
import { cn } from "@/utils";

type EventPosterProps = {
  width: number;
  height: number;
  src: string;
  alt?: string;
  className?: string;
  maxHeight?: string;
};

const EventPoster = ({
  width,
  height,
  src,
  alt = "행사 포스터",
  className,
  maxHeight,
}: EventPosterProps) => {
  return (
    <div
      style={{ width, height, maxHeight, aspectRatio: `${width}/${height}` }}
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
        fetchPriority="high"
        loading="eager"
        className="object-cover"
      />
    </div>
  );
};

export default EventPoster;
