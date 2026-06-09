import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useTransform, MotionValue, AnimatePresence, Variants } from 'framer-motion';
import { Project } from '../types/portfolio.ts';

type SectionPhase = 'hidden' | 'projects' | 'transition' | 'services';

const PROJECT_SCROLL_START = 0.05;
const PROJECT_SCROLL_END = 0.55;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const SlidingNumber: React.FC<{ value: number }> = ({ value }) => {
  const prevValueRef = useRef(value);
  const direction = value > prevValueRef.current ? 1 : -1;

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  const variants = {
    enter: (nextDirection: number) => ({
      y: nextDirection > 0 ? '-100%' : '100%',
    }),
    center: {
      y: '0%',
    },
    exit: (nextDirection: number) => ({
      y: nextDirection > 0 ? '100%' : '-100%',
    }),
  };

  return (
    <div className="relative flex h-[1.2em] w-full items-center justify-end overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={value}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
          }}
          className="block w-full text-right text-white"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  scrollProgress: MotionValue<number>;
  phase: SectionPhase;
  onClick: (id: string) => void;
  isMobile: boolean;
}> = ({ project, index, scrollProgress, phase, onClick, isMobile }) => {
  const imageX = useTransform(
    scrollProgress,
    [PROJECT_SCROLL_START, PROJECT_SCROLL_END],
    isMobile ? ['0%', '0%'] : ['0%', '40%']
  );

  const initialLeft = useMemo(() => {
    if (isMobile) return '0%';
    return `-${50 + index * 8}%`;
  }, [index, isMobile]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.8,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={
        phase === 'projects'
          ? 'visible'
          : phase === 'transition' || phase === 'services'
            ? 'exit'
            : 'hidden'
      }
      variants={cardVariants}
      onClick={() => onClick(project.id)}
      data-project-card="true"
      className="relative mx-[1vw] my-10 aspect-[1/1.3] w-[85vw] flex-shrink-0 cursor-pointer overflow-hidden bg-neutral-900 shadow-2xl md:my-0 md:w-[24vw]"
    >
      <motion.div
        style={{
          x: isMobile ? '0%' : imageX,
          left: initialLeft,
          width: isMobile ? '100%' : '150%',
        }}
        className="absolute inset-0 h-full origin-right"
      >
        <img
          src={project.image}
          alt={project.title}
          draggable="false"
          className="h-full w-full select-none object-cover pointer-events-none"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/10 transition-colors duration-500 hover:bg-black/0" />
    </motion.div>
  );
};

interface ProjectsSectionProps {
  projects: Project[];
  scrollProgress: MotionValue<number>;
  phase: SectionPhase;
  onProjectClick: (id: string) => void;
  isMobile: boolean;
}

export default function ProjectsSection({
  projects,
  scrollProgress,
  phase,
  onProjectClick,
  isMobile,
}: ProjectsSectionProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackMetrics, setTrackMetrics] = useState({
    viewportWidth: 0,
    viewportHeight: 0,
    horizontalCenters: [] as number[],
    verticalCenters: [] as number[],
    horizontalStart: 0,
    horizontalEnd: 0,
    verticalTravel: 0,
  });
  const [currentNum, setCurrentNum] = useState(1);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-project-card="true"]'));
      const horizontalCenters = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
      const verticalCenters = cards.map((card) => card.offsetTop + card.offsetHeight / 2);
      const firstHorizontalCenter = horizontalCenters[0] ?? viewport.clientWidth / 2;
      const lastHorizontalCenter =
        horizontalCenters[horizontalCenters.length - 1] ?? firstHorizontalCenter;

      setTrackMetrics({
        viewportWidth: viewport.clientWidth,
        viewportHeight: viewport.clientHeight,
        horizontalCenters,
        verticalCenters,
        horizontalStart: viewport.clientWidth / 2 - firstHorizontalCenter,
        horizontalEnd: viewport.clientWidth / 2 - lastHorizontalCenter,
        verticalTravel: Math.max(0, track.scrollHeight - viewport.clientHeight * 0.78),
      });
    };

    measure();
    window.addEventListener('resize', measure);

    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [projects.length, isMobile]);

  const trackX = useTransform(scrollProgress, (latest) => {
    if (isMobile) return 0;

    const normalized = clamp(
      (latest - PROJECT_SCROLL_START) / (PROJECT_SCROLL_END - PROJECT_SCROLL_START),
      0,
      1
    );

    return (
      trackMetrics.horizontalStart +
      (trackMetrics.horizontalEnd - trackMetrics.horizontalStart) * normalized
    );
  });

  const trackY = useTransform(scrollProgress, (latest) => {
    if (!isMobile) return 0;

    const normalized = clamp(
      (latest - PROJECT_SCROLL_START) / (PROJECT_SCROLL_END - PROJECT_SCROLL_START),
      0,
      1
    );

    return -normalized * trackMetrics.verticalTravel;
  });

  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (latest) => {
      const normalized = clamp(
        (latest - PROJECT_SCROLL_START) / (PROJECT_SCROLL_END - PROJECT_SCROLL_START),
        0,
        1
      );

      const centers = isMobile ? trackMetrics.verticalCenters : trackMetrics.horizontalCenters;
      if (centers.length === 0) return;

      const trackPosition = isMobile
        ? -normalized * trackMetrics.verticalTravel
        : trackMetrics.horizontalStart +
          (trackMetrics.horizontalEnd - trackMetrics.horizontalStart) * normalized;

      const viewportCenter = isMobile
        ? trackMetrics.viewportHeight / 2
        : trackMetrics.viewportWidth / 2;

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      centers.forEach((center, index) => {
        const distance = Math.abs(center + trackPosition - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      const nextValue = Math.min(projects.length, nearestIndex + 1);
      setCurrentNum((prev) => (prev === nextValue ? prev : nextValue));
    });

    return () => unsubscribe();
  }, [isMobile, projects.length, scrollProgress, trackMetrics]);

  return (
    <motion.div
      animate={{ opacity: phase === 'services' ? 0 : 1 }}
      style={{ pointerEvents: phase === 'projects' ? 'auto' : 'none' }}
      className={`absolute inset-0 flex flex-col items-center overflow-hidden ${isMobile ? 'justify-start pt-[40vh]' : 'justify-center'}`}
    >
      <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{
            x: trackX,
            y: trackY,
          }}
          className={`absolute ${isMobile ? 'left-0 right-0 top-0 flex flex-col items-center' : 'inset-y-0 left-0 flex w-max items-center'}`}
        >
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              scrollProgress={scrollProgress}
              phase={phase}
              onClick={onProjectClick}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: phase === 'projects' ? 1 : 0 }}
        className="pointer-events-none absolute bottom-10 left-0 right-0 flex w-full justify-center md:bottom-16"
      >
        <div className="flex items-center gap-4 text-lg font-medium tracking-[0.1em] text-white md:text-xl">
          <div className="h-[1.2em] w-8 overflow-hidden text-right">
            <SlidingNumber value={currentNum} />
          </div>
          <span className="translate-y-[-1px] font-light text-white opacity-100">-</span>
          <div className="w-8 text-left">
            <span>{projects.length}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
