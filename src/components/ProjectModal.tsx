import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Project } from '../types/portfolio.ts';
import { isVideoUrl } from '../lib/media.ts';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ProjectContentProps {
  project: Project;
  onNext: () => void;
  onPrev: () => void;
  isMobile: boolean;
}

type VideoCacheEntry =
  | { status: 'loading'; promise: Promise<string> }
  | { status: 'ready'; objectUrl: string }
  | { status: 'failed' };

const modalVideoCache = new Map<string, VideoCacheEntry>();

function getCachedVideoSrc(src: string): string | null {
  const entry = modalVideoCache.get(src);
  return entry?.status === 'ready' ? entry.objectUrl : null;
}

function warmModalVideoCache(src: string) {
  const cached = modalVideoCache.get(src);
  if (cached?.status === 'loading' || cached?.status === 'ready') {
    return;
  }

  const promise = fetch(src)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to cache video: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      modalVideoCache.set(src, { status: 'ready', objectUrl });
      return objectUrl;
    })
    .catch(() => {
      // Some CDNs disallow CORS fetches for media. In that case keep native video loading.
      modalVideoCache.set(src, { status: 'failed' });
      return src;
    });

  modalVideoCache.set(src, { status: 'loading', promise });
}

function ModalMedia({ src }: { src: string }) {
  if (isVideoUrl(src)) {
    const [cachedSrc, setCachedSrc] = useState(() => getCachedVideoSrc(src));

    useEffect(() => {
      let active = true;
      const cached = modalVideoCache.get(src);

      if (cached?.status === 'ready') {
        setCachedSrc(cached.objectUrl);
        return;
      }

      if (cached?.status === 'loading') {
        cached.promise.then((objectUrl) => {
          if (active && objectUrl !== src) {
            setCachedSrc(objectUrl);
          }
        });
      } else {
        warmModalVideoCache(src);
        const nextCached = modalVideoCache.get(src);
        if (nextCached?.status === 'loading') {
          nextCached.promise.then((objectUrl) => {
            if (active && objectUrl !== src) {
              setCachedSrc(objectUrl);
            }
          });
        }
      }

      return () => {
        active = false;
      };
    }, [src]);

    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="block h-full w-full select-none object-cover pointer-events-none"
      >
        <source src={cachedSrc ?? src} />
      </video>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="h-full w-full select-none object-cover pointer-events-none"
    />
  );
}

export default function ProjectModal({ project, onClose, onNext, onPrev }: ProjectModalProps) {
  const [animationPhase, setAnimationPhase] = useState<0 | 1 | 2>(0);
  const [contentVisible, setContentVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bodyStyleRef = useRef<string>('');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    setAnimationPhase(1);
    const timer = setTimeout(() => {
      setAnimationPhase(2);
      setTimeout(() => setContentVisible(true), 300);
    }, 600);

    bodyStyleRef.current = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = bodyStyleRef.current;
      window.removeEventListener('resize', check);
    };
  }, []);

  const handleClose = () => {
    document.body.style.overflow = bodyStyleRef.current;
    setContentVisible(false);
    setTimeout(() => {
      setAnimationPhase(1);
      setTimeout(() => {
        setAnimationPhase(0);
        setTimeout(onClose, 600);
      }, 950);
    }, 650);
  };

  const containerVariants = {
    initial: {
      width: '30vw',
      height: '0vh',
      borderRadius: '0px',
    },
    middle: {
      width: '30vw',
      height: '30vh',
      borderRadius: '0px',
    },
    full: {
      width: 'calc(100vw - 40px)',
      height: 'calc(100vh - 40px)',
      borderRadius: '12px',
    },
  };

  const getTransition = () => {
    if (animationPhase === 0 && !contentVisible) {
      return { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const };
    }
    return { duration: 0.95, ease: [0.19, 1, 0.22, 1] as const };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      <motion.div
        variants={containerVariants}
        animate={animationPhase === 0 ? 'initial' : animationPhase === 1 ? 'middle' : 'full'}
        initial="initial"
        transition={getTransition()}
        className="relative z-10 overflow-hidden bg-white"
      >
        <AnimatePresence mode="wait">
          {contentVisible && (
            <motion.div
              key="content-root"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%', transition: { duration: 0.6, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute inset-0 z-[40] flex flex-col"
            >
              <AnimatePresence mode="wait" initial={false}>
                <ProjectContent
                  key={project.id}
                  project={project}
                  onNext={onNext}
                  onPrev={onPrev}
                  isMobile={isMobile}
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-auto absolute bottom-5 left-1/2 z-[100] -translate-x-1/2">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={animationPhase === 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            whileHover="hover"
            onClick={handleClose}
            variants={{
              hover: { scale: 1.2 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex h-10 w-10 origin-center items-center justify-center rounded-full bg-black text-white shadow-xl md:h-11 md:w-11"
          >
            <motion.div
              variants={{
                hover: { rotate: 180 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <X className="h-4 w-4" strokeWidth={3} />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

const ProjectContent: React.FC<ProjectContentProps> = ({ project, onNext, onPrev, isMobile }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleLoopWidth, setSingleLoopWidth] = useState(0);
  const [virtualScroll, setVirtualScroll] = useState(0);
  const horizontalSpeed = 1.1;

  const gallery = useMemo(() => {
    return project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project.image];
  }, [project]);

  const loopGallery = useMemo(() => {
    if (isMobile) {
      return gallery;
    }

    return [...gallery, ...gallery, ...gallery];
  }, [gallery, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      const loopWidth = track.scrollWidth / 3;
      setSingleLoopWidth(loopWidth);
    };

    measure();
    window.addEventListener('resize', measure);

    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [gallery.length, isMobile, project.id]);

  useEffect(() => {
    setVirtualScroll(0);
  }, [project.id]);

  const pageVariants = {
    initial: { opacity: 0, x: isMobile ? 20 : 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isMobile ? -20 : 0 },
  };

  if (isMobile) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex h-full flex-col overflow-y-auto bg-white p-5 no-scrollbar"
      >
        <div className="mb-8 flex flex-col gap-4">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold uppercase tracking-tighter text-black"
          >
            {project.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-[12px] font-medium uppercase tracking-normal text-neutral-500"
            style={{ lineHeight: 1.55 }}
          >
            {project.description}
          </motion.p>

          <div className="mt-2 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={onPrev}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black"
              >
                <ArrowLeft className="h-3 w-3" /> ПРЕД
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black"
              >
                СЛЕД <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-black/20 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-black"
              >
                ПОСЕТИТЬ
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 pb-20">
          {gallery.map((src, index) => (
            <div
              key={`${project.id}-mob-img-${index}`}
              className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 shadow-sm"
            >
              <ModalMedia src={src} />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="absolute inset-0 flex flex-col"
      onWheel={(event) => {
        if (isMobile) return;

        event.preventDefault();
        const primaryDelta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        setVirtualScroll((prev) => prev + primaryDelta);
      }}
    >
      <div className="pointer-events-none absolute left-[30px] right-[30px] top-[30px] z-[50] flex justify-center">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-black">
          [ СКРОЛЛ ДЛЯ ИЗУЧЕНИЯ ]
        </span>
      </div>

      <div
        ref={frameRef}
        className="pointer-events-none absolute left-[30px] right-[30px] top-[70px] bottom-[185px] z-[10] flex items-center overflow-hidden"
      >
        <motion.div
          ref={trackRef}
          style={{
            x:
              singleLoopWidth > 0
                ? -singleLoopWidth -
                  ((((virtualScroll * horizontalSpeed) % singleLoopWidth) + singleLoopWidth) %
                    singleLoopWidth)
                : 0,
          }}
          className="flex items-center gap-[60px] px-10"
        >
          {loopGallery.map((src, index) => (
            <div key={`${project.id}-img-${index}`} className="flex-shrink-0">
              <div className="aspect-[4/3] h-[50vh] overflow-hidden bg-neutral-100 shadow-sm xl:h-[50vh] 2xl:h-[65vh]">
                <ModalMedia src={src} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-[30px] left-[30px] right-[30px] z-[60] flex items-end justify-between gap-10">
        <div className="pointer-events-auto flex h-[130px] w-[min(35vw,480px)] flex-col select-text">
          <div className="overflow-hidden select-text">
            <motion.h3
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="select-text text-xl font-bold uppercase leading-none tracking-tighter text-black md:text-2xl lg:text-3xl"
            >
              {project.title}
            </motion.h3>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="my-auto max-w-full select-text text-[11px] font-medium uppercase tracking-normal text-neutral-400 md:text-[12px]"
            style={{
              lineHeight: 1.45,
              minHeight: '4.35em',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </motion.p>

          <div className="h-[20px]">
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex items-center"
              >
                <span className="text-[12px] font-bold uppercase tracking-normal text-black transition-opacity hover:opacity-70">
                  ПОСЕТИТЬ
                </span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-auto flex h-[20px] items-center gap-8 pr-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className="group flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-black"
          >
            <ArrowLeft className="h-4 w-4" /> ПРЕД
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="group flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-black"
          >
            СЛЕД <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
