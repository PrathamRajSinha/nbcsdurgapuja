import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';

export function GalleryPhotoViewer({ photo, onClose }: {
  photo: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  const open = photo !== null;
  const pushedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Phone back button closes the photo instead of leaving the page.
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ ...(window.history.state ?? {}), nbcsPhoto: true }, '', window.location.href);
    pushedRef.current = true;
    const onPop = () => {
      if (!pushedRef.current) return;
      pushedRef.current = false;
      onCloseRef.current();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [open]);

  const close = () => {
    if (pushedRef.current) {
      window.history.back(); // popstate handler closes the viewer
    } else {
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={o => { if (!o) close(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="gallery-photo-scrim" />
        <Dialog.Content className="gallery-photo-viewer" aria-describedby={undefined} data-lenis-prevent>
          <Dialog.Title className="sr-only">{photo?.alt || 'Festival photo'}</Dialog.Title>
          <div className="gallery-photo-toolbar">
            <Button variant="ghost" size="icon" aria-label="Close image" title="Close image" onClick={close}><X /></Button>
          </div>
          {photo && <TransformWrapper key={photo.src} minScale={1} maxScale={5} centerOnInit wheel={{ step: 0.08 }} doubleClick={{ mode: 'toggle', step: 2 }}>
            <TransformComponent wrapperClass="gallery-photo-zoom" contentClass="gallery-photo-content">
              <div
                className="gallery-photo-backdrop"
                onClick={e => { if (e.target === e.currentTarget) close(); }}
              >
                <img src={photo.src} alt={photo.alt} draggable={false} />
              </div>
            </TransformComponent>
          </TransformWrapper>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
