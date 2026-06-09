import React from 'react';
import { motion } from 'framer-motion';

interface WaveTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  baseIndexOffset: number;
  centerIndex?: number;
  trigger: boolean;
  delayOffset?: number;
  duration?: number;
  initialY?: string;
}

export default function WaveText({
  text,
  className,
  style,
  baseIndexOffset,
  centerIndex = 3.5,
  trigger,
  delayOffset = 0,
  duration = 1.0,
  initialY = '140%',
}: WaveTextProps) {
  return (
    <div className={`flex ${className || ''}`} style={style}>
      {text.split('').map((char, i) => {
        const globalIndex = baseIndexOffset + i;
        const distanceFromCenter = Math.abs(globalIndex - centerIndex);

        return (
          <div
            key={i}
            className="relative"
            style={{ clipPath: 'inset(-200% -200% -5px -200%)' }}
          >
            <motion.span
              initial={{ y: initialY }}
              animate={trigger ? { y: '0%' } : { y: initialY }}
              transition={{
                duration: trigger ? duration : 0.1,
                ease: [0.16, 1, 0.3, 1],
                delay: trigger ? delayOffset + distanceFromCenter * 0.08 : 0,
              }}
              className="block"
            >
              {char}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
