import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export const ParallaxSection = ({
  children,
  className = '',
  speed = 50,
  direction = 'up',
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [speed, -speed] : [-speed, speed]
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};
