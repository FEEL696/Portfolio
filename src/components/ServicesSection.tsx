import React from 'react';
import { motion, MotionValue, AnimatePresence } from 'framer-motion';
import { getServiceIcon } from '../lib/service-icons.tsx';
import { Service } from '../types/portfolio.ts';

type SectionPhase = 'hidden' | 'projects' | 'transition' | 'services';

const IconCube: React.FC<{ hoveredId: string | null }> = ({ hoveredId }) => {
  const getRotation = () => {
    switch (hoveredId) {
      case 'design':
        return { rotateX: -90, rotateY: 0 };
      case 'webflow':
        return { rotateX: 0, rotateY: -90 };
      case 'custom':
        return { rotateX: 90, rotateY: 0 };
      case 'creative':
        return { rotateX: 0, rotateY: 90 };
      case 'bots':
        return { rotateX: 180, rotateY: 0 };
      default:
        return { rotateX: 0, rotateY: 0 };
    }
  };

  const { rotateX, rotateY } = getRotation();
  const faceStyle =
    'absolute inset-0 flex items-center justify-center bg-white border border-neutral-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.015)] backface-hidden';

  return (
    <div className="w-[64px] h-[64px] perspective-[1000px] mb-12 relative [--tz:32px]">
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 1 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        <div className={faceStyle} style={{ transform: 'translateZ(var(--tz))' }}>
          <div className="w-5 h-5 rounded-full bg-neutral-100/40 border border-neutral-200/50" />
        </div>
        <div className={faceStyle} style={{ transform: 'rotateX(90deg) translateZ(var(--tz))' }}>
          {getServiceIcon('Layout', true)}
        </div>
        <div className={faceStyle} style={{ transform: 'rotateY(90deg) translateZ(var(--tz))' }}>
          {getServiceIcon('Code', true)}
        </div>
        <div className={faceStyle} style={{ transform: 'rotateX(-90deg) translateZ(var(--tz))' }}>
          {getServiceIcon('Settings', true)}
        </div>
        <div className={faceStyle} style={{ transform: 'rotateY(-90deg) translateZ(var(--tz))' }}>
          {getServiceIcon('Sparkles', true)}
        </div>
        <div className={faceStyle} style={{ transform: 'rotateY(180deg) translateZ(var(--tz))' }}>
          {getServiceIcon('Bot', true)}
        </div>
      </motion.div>
    </div>
  );
};

interface ServicesSectionProps {
  services: Service[];
  phase: SectionPhase;
  servicesOpacity: MotionValue<number>;
  servicesY: MotionValue<number>;
  hoveredServiceId: string | null;
  onHoveredServiceChange: (id: string | null) => void;
  descriptionLines: string[];
}

export default function ServicesSection({
  services,
  phase,
  servicesOpacity,
  servicesY,
  hoveredServiceId,
  onHoveredServiceChange,
  descriptionLines,
}: ServicesSectionProps) {
  return (
    <motion.div
      id="services"
      style={{
        opacity: servicesOpacity,
        y: servicesY,
        pointerEvents: phase === 'services' ? 'auto' : 'none',
      }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-transparent"
    >
      <div className="flex flex-col items-center">
        {services.map((service, index) => (
          <div key={service.id} className="relative">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '110%' }}
                animate={phase === 'services' ? { y: '0%' } : { y: '110%' }}
                transition={{
                  y: {
                    duration: 0.8,
                    delay:
                      phase === 'services'
                        ? index * 0.1 + 0.3
                        : (services.length - 1 - index) * 0.05,
                    ease: [0.16, 1, 0.3, 1] as const,
                  },
                }}
                onMouseEnter={() => onHoveredServiceChange(service.id)}
                onMouseLeave={() => onHoveredServiceChange(null)}
                className="cursor-pointer group relative text-center px-5 md:px-8 xl:px-10 2xl:px-[60px] py-1"
              >
                <motion.h2
                  animate={{
                    filter:
                      hoveredServiceId && hoveredServiceId !== service.id ? 'blur(4px)' : 'blur(0px)',
                    opacity: hoveredServiceId && hoveredServiceId !== service.id ? 0.3 : 1,
                    scale: hoveredServiceId === service.id ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-medium tracking-tighter uppercase leading-none text-black origin-center whitespace-nowrap"
                >
                  {service.title.split(' ').map((word, i) => {
                    let isSerif = i % 2 !== 0;
                    if (service.id === 'bots') {
                      isSerif = i === 0;
                    }

                    return (
                      <span
                        key={i}
                        className={
                          isSerif
                            ? 'font-normal px-1 text-black/90 text-[1.1em] italic uppercase tracking-normal'
                            : 'px-1'
                        }
                        style={isSerif ? { fontFamily: "'Instrument Serif', serif" } : undefined}
                      >
                        {word}
                      </span>
                    );
                  })}
                </motion.h2>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={phase === 'services' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
        transition={{
          opacity: { duration: 0.8, delay: 0.75 },
          y: { type: 'spring', stiffness: 100, damping: 20, delay: 0.75 },
          scale: { type: 'spring', stiffness: 100, damping: 20, delay: 0.75 },
        }}
        className="absolute bottom-10 md:bottom-16 w-full px-5 md:px-8 xl:px-10 2xl:px-[60px] flex flex-col items-center"
      >
        <IconCube hoveredId={hoveredServiceId} />
        <div className="max-w-3xl w-full min-h-[4em] flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div key={hoveredServiceId || 'empty'} className="flex flex-col items-center gap-0.5">
              {descriptionLines.map((line, idx) => (
                <div key={`${hoveredServiceId}-${idx}`} className="overflow-hidden py-0.5">
                  <motion.span
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-105%' }}
                    transition={{ duration: 0.2, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] as const }}
                    className="inline-block text-black text-sm md:text-base font-medium leading-snug uppercase tracking-wider text-center"
                  >
                    {line}
                  </motion.span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
