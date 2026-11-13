import { isModelFile } from '@xr/contracts';

// An item's preview (layer1-gates-and-queue#AC-22): an image is shown, a video's first frame, a
// PDF in the browser's own viewer with its name as the fallback; audio, Word and 3D model files
// show their file name.
export function ReviewPreview({ src, file, large = false }: { src: string; file: { name: string; mediaType: string }; large?: boolean }) {
  const label = `Preview of ${file.name}`;
  const className = large ? 'preview large' : 'preview';
  if (file.mediaType.startsWith('image/') && !isModelFile(file.name)) {
    // A file from our own storage, shown at its natural ratio inside a fixed box.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={src} alt={label} loading="lazy" />;
  }
  if (file.mediaType.startsWith('video/')) {
    return <video className={className} src={src} preload="metadata" muted controls={large} aria-label={label} />;
  }
  if (file.mediaType === 'application/pdf') {
    return (
      <object className={className} data={src} type="application/pdf" aria-label={label}>
        {file.name}, PDF
      </object>
    );
  }
  if (large && file.mediaType.startsWith('audio/')) {
    return <audio src={src} controls aria-label={label} />;
  }
  return (
    <div className={className} role="img" aria-label={label}>
      {file.name}
    </div>
  );
}
