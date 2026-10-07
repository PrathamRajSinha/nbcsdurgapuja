import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';

export function GalleryPhotoViewer({ photo, onClose }: {
  photo: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={photo !== null} onOpenChange={open => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="gallery-photo-scrim" />
        <Dialog.Content className="gallery-photo-viewer" aria-describedby={undefined} data-lenis-prevent>
          <Dialog.Title className="sr-only">{photo?.alt || 'Festival photo'}</Dialog.Title>
          {photo && <TransformWrapper key={photo.src} minScale={1} maxScale={5} centerOnInit wheel={{ step: 0.08 }} doubleClick={{ mode: 'toggle', step: 2 }}>
            {({ zoomIn, zoomOut, resetTransform }) => <>
              <div className="gallery-photo-toolbar">
                <Button variant="ghost" size="icon" aria-label="Zoom out" title="Zoom out" onClick={() => zoomOut()}><Minus /></Button>
                <Button variant="ghost" size="icon" aria-label="Zoom in" title="Zoom in" onClick={() => zoomIn()}><Plus /></Button>
                <Button variant="ghost" size="icon" aria-label="Reset zoom" title="Reset zoom" onClick={() => resetTransform()}><RotateCcw /></Button>
                <Button variant="ghost" size="icon" aria-label="Close image" title="Close image" onClick={onClose}><X /></Button>
              </div>
              <TransformComponent wrapperClass="gallery-photo-zoom" contentClass="gallery-photo-content">
                <img src={photo.src} alt={photo.alt} draggable={false} />
              </TransformComponent>
            </>}
          </TransformWrapper>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}