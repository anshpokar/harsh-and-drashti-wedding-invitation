import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { showPlaceholders } from '../lib/content';
import { PhotoFrame, SectionTitle } from './Ornaments';
import { Reveal } from './Reveal';

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const photo = wedding.gallery[index];
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onStep]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <figure key={index} className="lightbox-figure">
        <img src={photo.src} alt={photo.alt} />
        {photo.caption && <figcaption>{photo.caption}</figcaption>}
      </figure>
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button className="lightbox-nav lightbox-nav--prev" onClick={() => onStep(-1)} aria-label="Previous photo">
        ‹
      </button>
      <button className="lightbox-nav lightbox-nav--next" onClick={() => onStep(1)} aria-label="Next photo">
        ›
      </button>
      <p className="lightbox-count">
        {index + 1} / {wedding.gallery.length}
      </p>
    </div>
  );
}

/** Scene 10: editorial gallery with a full-screen viewer. */
export function PhotoGallery() {
  const { gallery } = wedding;
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)), [gallery.length]);
  const close = useCallback(() => setOpen(null), []);

  if (!gallery.length && !showPlaceholders) return null;

  return (
    <section id="gallery" className="scene paper gallery">
      <SectionTitle eyebrow="Moments" title="Our Story in Frames" />
      <div className="gallery-grid">
        {gallery.length
          ? gallery.map((p, i) => (
              <Reveal key={p.src} className={`gallery-item gallery-item--${i % 5}`} delay={(i % 3) * 100}>
                <PhotoFrame photo={p} shape="rect" label={p.alt} onClick={() => setOpen(i)} />
              </Reveal>
            ))
          : ['Pre-wedding', 'Couple', 'Groom portrait', 'Bride portrait', 'Family'].map((label, i) => (
              <Reveal key={label} className={`gallery-item gallery-item--${i % 5}`} delay={(i % 3) * 100}>
                <PhotoFrame photo={null} shape="rect" label={`${label} photo`} />
              </Reveal>
            ))}
      </div>
      {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
    </section>
  );
}
