import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RollingLink from './shared/RollingLink.tsx';

export function smoothScrollTo(targetId: string) {
  if (targetId === 'contact') {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
    return;
  }

  const container = document.getElementById('projects');
  
  if (targetId === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (targetId === 'projects' && container) {
    const rect = container.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    window.scrollTo({
      top: absoluteTop + 120,
      behavior: 'smooth'
    });
    return;
  }

  if (targetId === 'services' && container) {
    const rect = container.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    window.scrollTo({
      top: absoluteTop + (container.offsetHeight * 0.65),
      behavior: 'smooth'
    });
    return;
  }
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // If it's an external link (doesn't start with #), don't prevent default
    if (!targetId.startsWith('#')) return;

    e.preventDefault();
    setIsMenuOpen(false); // Close menu on click
    smoothScrollTo(targetId.substring(1)); // remove # for smoothScrollTo
  };

  const navTextStyle = "text-[14px] md:text-[16px] font-semibold uppercase tracking-[0.01em] text-white";
  const mobileMenuLargeText = "text-[14vw] leading-[0.9] font-semibold uppercase tracking-tight text-white block";
  const mobileMenuContactText = "text-[14px] font-bold uppercase tracking-widest text-white";

  return (
    <>
      <nav className="w-full h-[60px] md:h-[80px] bg-transparent px-5 md:px-8 xl:px-10 2xl:px-[60px] flex items-center justify-between md:justify-center border-none mix-blend-difference z-[100]">
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center gap-8">
          <RollingLink 
            name="ПРОЕКТЫ" 
            href="#projects" 
            onClick={(e) => handleScroll(e, '#projects')} 
            className={navTextStyle}
            pointerEventsAuto
            selectNone
          />
          <RollingLink 
            name="УСЛУГИ" 
            href="#services" 
            onClick={(e) => handleScroll(e, '#services')} 
            className={navTextStyle}
            pointerEventsAuto
            selectNone
          />
          <RollingLink 
            name="КОНТАКТЫ" 
            href="#contact" 
            onClick={(e) => handleScroll(e, '#contact')} 
            className={navTextStyle}
            pointerEventsAuto
            selectNone
          />
        </div>
      </nav>

      {/* Mobile Menu Button & Overlay - Rendered via Portal to ensure Fixed Position works regardless of parent transforms */}
      {domReady && createPortal(
        <>
           {/* Fixed Menu Button - Always on top */}
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="md:hidden fixed top-6 right-5 z-[10000] text-white mix-blend-difference pointer-events-auto flex flex-col items-center justify-center w-8 h-8 cursor-pointer gap-[6px]"
             aria-label="Menu"
           >
             <motion.span 
               animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="w-8 h-[2px] bg-white block shadow-sm origin-center" 
             />
             <motion.span 
               animate={isMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="w-8 h-[2px] bg-white block shadow-sm origin-center" 
             />
           </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9999] flex flex-col backdrop-blur-2xl md:hidden bg-black/40"
              >
                {/* Menu Items */}
                <div className="flex-1 flex flex-col justify-center items-center gap-8 pb-10">
                  <div className="overflow-hidden">
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a 
                        href="#projects" 
                        onClick={(e) => handleScroll(e, '#projects')} 
                        className={mobileMenuLargeText}
                      >
                        ПРОЕКТЫ
                      </a>
                    </motion.div>
                  </div>
                  
                  <div className="overflow-hidden">
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a 
                        href="#services" 
                        onClick={(e) => handleScroll(e, '#services')} 
                        className={mobileMenuLargeText}
                      >
                        УСЛУГИ
                      </a>
                    </motion.div>
                  </div>

                  {/* Contacts */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col gap-4 items-center mt-12"
                  >
                      <a 
                        href="https://t.me/MADMAFFIN" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={mobileMenuContactText}
                      >
                        TELEGRAM
                      </a>
                      <a 
                        href="mailto:electroice33@gmail.com" 
                        className={mobileMenuContactText}
                      >
                        GMAIL
                      </a>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}
