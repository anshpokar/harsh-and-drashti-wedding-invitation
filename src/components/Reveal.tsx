import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../lib/hooks';

/** Adds `is-visible` when scrolled into view; animation lives in CSS. */
export function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  threshold,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const [ref, inView] = useInView<HTMLElement>(threshold);
  return (
    <Tag
      ref={ref}
      className={`reveal-block ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
