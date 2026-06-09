import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectsSection from './ProjectsSection.tsx';
import ServicesSection from './ServicesSection.tsx';
import { Project, Service } from '../types/portfolio.ts';

type SectionPhase = 'hidden' | 'projects' | 'transition' | 'services';

const MOBILE_PROJECT_END = 0.7;
const DESKTOP_PROJECT_END = 0.6;
const MOBILE_TRANSITION_END = 0.75;
const DESKTOP_TRANSITION_END = 0.62;
const MOBILE_SERVICES_FADE_START = 0.94;
const DESKTOP_SERVICES_FADE_START = 0.93;

export default function ProjectsAndServices({
  projects,
  services,
  onProjectClick,
}: {
  projects: Project[];
  services: Service[];
  onProjectClick: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<SectionPhase>('hidden');
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const projectEnd = isMobile ? MOBILE_PROJECT_END : DESKTOP_PROJECT_END;
      const transitionEnd = isMobile ? MOBILE_TRANSITION_END : DESKTOP_TRANSITION_END;

      if (latest < 0.01) {
        setPhase('hidden');
      } else if (latest < projectEnd) {
        setPhase('projects');
      } else if (latest < transitionEnd) {
        setPhase('transition');
      } else {
        setPhase('services');
      }
    });

    return () => unsubscribe();
  }, [isMobile, scrollYProgress]);

  const backgroundColor = useTransform(
    scrollYProgress,
    [isMobile ? MOBILE_PROJECT_END : DESKTOP_PROJECT_END, isMobile ? MOBILE_TRANSITION_END : DESKTOP_TRANSITION_END],
    ['rgba(0,0,0,0)', '#ffffff']
  );
  const servicesOpacity = useTransform(
    scrollYProgress,
    [
      isMobile ? MOBILE_TRANSITION_END : DESKTOP_TRANSITION_END,
      isMobile ? 0.8 : 0.63,
      isMobile ? MOBILE_SERVICES_FADE_START : DESKTOP_SERVICES_FADE_START,
      1,
    ],
    [0, 1, 1, 0]
  );
  const servicesY = useTransform(
    scrollYProgress,
    [isMobile ? MOBILE_TRANSITION_END : DESKTOP_TRANSITION_END, isMobile ? 0.8 : 0.63],
    [60, 0],
    { clamp: true }
  );

  const activeHoveredService = services.find((service) => service.id === hoveredServiceId);

  const descriptionLines = useMemo(() => {
    if (!hoveredServiceId) {
      return ['Выберите категорию для ознакомления'];
    }

    const text = activeHoveredService?.description;
    if (!text) return [];

    if (isMobile) {
      return [text];
    }

    const words = text.split(' ');
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].filter(Boolean);
  }, [activeHoveredService, hoveredServiceId, isMobile]);

  const sectionHeightVh = isMobile ? 210 + projects.length * 50 : 210 + projects.length * 48;

  return (
    <section ref={containerRef} className="relative" style={{ height: `${sectionHeightVh}vh` }}>
      <div
        className="absolute top-0 left-0 right-0 h-[18vh] z-0 backdrop-blur-0xl pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      <div
        className="absolute inset-0 z-0 bg-black pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15vh)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15vh)',
        }}
      />

      <motion.div
        style={{ backgroundColor }}
        className={`sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden transition-colors duration-700 ${phase === 'services' ? 'selection:bg-black selection:text-white' : 'selection:bg-white selection:text-black'}`}
      >
        <ProjectsSection
          projects={projects}
          scrollProgress={scrollYProgress}
          phase={phase}
          onProjectClick={onProjectClick}
          isMobile={isMobile}
        />

        <ServicesSection
          services={services}
          phase={phase}
          servicesOpacity={servicesOpacity}
          servicesY={servicesY}
          hoveredServiceId={hoveredServiceId}
          onHoveredServiceChange={setHoveredServiceId}
          descriptionLines={descriptionLines}
        />
      </motion.div>
    </section>
  );
}
