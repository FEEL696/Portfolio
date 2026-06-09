import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RollingLinkProps {
  name: string;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  pointerEventsAuto?: boolean;
  selectNone?: boolean;
}

export default function RollingLink({
  name,
  href,
  target,
  rel,
  className,
  onClick,
  pointerEventsAuto = false,
  selectNone = false,
}: RollingLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        className,
        'relative flex items-center overflow-hidden h-[1.2em] leading-none cursor-pointer',
        pointerEventsAuto ? 'pointer-events-auto' : '',
        selectNone ? 'select-none' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex">
        {name.split('').map((char, i) => (
          <span key={i} className="relative block overflow-hidden">
            <motion.span
              animate={isHovered ? { y: '-100%' } : { y: '0%' }}
              transition={{ duration: 0.4, delay: i * 0.02, ease: [0.19, 1, 0.22, 1] }}
              className="block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
            <motion.span
              animate={isHovered ? { y: '-100%' } : { y: '0%' }}
              transition={{ duration: 0.4, delay: i * 0.02, ease: [0.19, 1, 0.22, 1] }}
              className="absolute top-full left-0 block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        ))}
      </div>
    </a>
  );
}
