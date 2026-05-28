'use client';

type Props = {
  file: File;
  previewUrl: string;
  index: number;
};

const BrochureThumbnail = ({ file, previewUrl, index }: Props) => (
  <div className="relative flex aspect-44/66 self-center overflow-hidden rounded-lg border border-gomin-neutral-100">
    {file.type.startsWith('image/') ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
    ) : (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, #efebff 0%, #efebff 8%, #fff 8%, #fff 16%)',
        }}
      >
        <span className="font-mono text-[9px] font-bold tracking-wide text-gomin-primary-700">
          p.{index + 1}
        </span>
      </div>
    )}
  </div>
);

export default BrochureThumbnail;
