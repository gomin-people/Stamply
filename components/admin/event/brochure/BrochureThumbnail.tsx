"use client";

type ThumbnailProps = {
  file: File;
  previewUrl: string;
};

const BrochureThumbnail = ({ file, previewUrl }: ThumbnailProps) => (
  <div className="relative flex aspect-44/66 self-center overflow-hidden rounded-lg border border-gomin-neutral-100">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={previewUrl}
      alt={file.name}
      className="h-full w-full object-cover"
    />
  </div>
);

export default BrochureThumbnail;
