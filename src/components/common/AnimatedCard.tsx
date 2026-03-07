import { ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  tilt?: boolean;
  tiltIntensity?: number;
}

export const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  tilt = true,
  tiltIntensity = 10,
}: AnimatedCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), {
    stiffness: 300,
    damping: 30,
  });

  const directionMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
    >
      {children}
    </motion.div>
  );
};
