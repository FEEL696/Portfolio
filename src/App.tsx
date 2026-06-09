import React, { useState, useEffect, useRef } from 'react';
import MainPage from './components/MainPage.tsx';
import ProjectModalManager from './components/ProjectModalManager.tsx';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { PortfolioContent } from './types/portfolio.ts';

const LOADER_MIN_DURATION_MS = 1200;

const App: React.FC<{ content: PortfolioContent }> = ({ content }) => {
  const [loading, setLoading] = useState(true);
  const [introFinished, setIntroFinished] = useState(false); 
  const [actualProgress, setActualProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const actualProgressRef = useRef(0);
  const loaderStartedAtRef = useRef<number | null>(null);
  
  useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    actualProgressRef.current = actualProgress;
  }, [actualProgress]);

  // Loader Visual Ticking
  useEffect(() => {
    if (!loading) return;

    let animationFrameId: number;
    loaderStartedAtRef.current = performance.now();

    const smoothStep = (timestamp: number) => {
      const startedAt = loaderStartedAtRef.current ?? timestamp;
      const elapsedProgress = Math.min(100, ((timestamp - startedAt) / LOADER_MIN_DURATION_MS) * 100);
      const nextProgress = Math.min(actualProgressRef.current, elapsedProgress);

      setDisplayProgress((prev) => (nextProgress > prev ? nextProgress : prev));
      animationFrameId = requestAnimationFrame(smoothStep);
    };

    animationFrameId = requestAnimationFrame(smoothStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [loading]);

  // Assets Preloading Logic
  useEffect(() => {
    const heroVideoUrl = "https://bs.boomstream.com/balancer/rCWyWdI7-3aLokGCi.mp4";
    
    // Prioritize only critical assets: Hero Video and Project Cover Images.
    // Gallery images are loaded lazily to prevent blocking the main interface.
    const projectAssets = Array.from(new Set([
      heroVideoUrl,
      ...content.projects.map(p => p.image)
    ])).filter(url => typeof url === 'string' && url.length > 0);

    if (projectAssets.length === 0) {
      setActualProgress(100);
      return;
    }

    let loadedCount = 0;
    const total = projectAssets.length;

    const incrementProgress = () => {
      loadedCount++;
      const nextProgress = Math.floor((loadedCount / total) * 100);
      setActualProgress(nextProgress);
    };

    projectAssets.forEach((url) => {
      const isVideo = url.toLowerCase().endsWith('.mp4');
      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        video.onloadedmetadata = incrementProgress;
        video.onerror = incrementProgress;
      } else {
        const img = new Image();
        img.src = url;
        img.onload = incrementProgress;
        img.onerror = incrementProgress;
      }
    });
  }, [content.projects]);

  // When progress hits 100, finish loading
  useEffect(() => {
    if (displayProgress === 100 && actualProgress === 100) {
      // Small delay at 100% before transition starts
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [displayProgress, actualProgress]);

  // Sync text animation: Trigger "Feel Creator" exact moment the blur transition ends
  useEffect(() => {
    if (!loading) {
      // Transition duration is 1.5s. Trigger text right at the end.
      const timer = setTimeout(() => {
        setIntroFinished(true);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (!selectedProjectId) return;

    const projectStillExists = content.projects.some((project) => project.id === selectedProjectId);
    if (!projectStillExists) {
      setSelectedProjectId(null);
    }
  }, [content.projects, selectedProjectId]);

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      
      {/* Loader Overlay - Rendered conditionally via AnimatePresence */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[200] bg-black flex flex-col justify-center items-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="w-[200px] md:w-[300px] h-[2px] bg-white/20 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-white" 
                 style={{ width: `${displayProgress}%` }}
                 transition={{ ease: "linear", duration: 0.1 }}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Always Rendered, animated via variants */}
      <motion.div 
        key="content" 
        initial={{ filter: "blur(30px)", opacity: 0 }} 
        animate={{ 
          filter: loading ? "blur(30px)" : "blur(0px)", 
          opacity: loading ? 0 : 1 
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="w-full"
      >
        <MainPage
          introFinished={introFinished}
          onProjectSelect={setSelectedProjectId}
          projects={content.projects}
          services={content.services}
        />
      </motion.div>
      
      <ProjectModalManager
        projects={content.projects}
        selectedProjectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onSelectProject={setSelectedProjectId}
      />
    </div>
  );
};

export default App;
