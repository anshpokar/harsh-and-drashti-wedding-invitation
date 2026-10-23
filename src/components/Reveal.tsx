import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, onEnter, reducedMotion, useGSAP } from '../lib/gsap';

/** Fades + rises its content in once it scrolls into view (GSAP ScrollTrigger). */
export function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  y = 32,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(ref.current, { autoAlpha: 0, y, duration: 1.1, delay: delay / 1000, scrollTrigger: onEnter(ref.current, 'top 88%') });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
