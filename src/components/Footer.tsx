import React, { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import KaliningradTime from './shared/KaliningradTime.tsx';
import WaveText from './shared/WaveText.tsx';
import RollingLink from './shared/RollingLink.tsx';

export default function Footer() {
  const containerRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.95) {
      setStartAnimation(true);
    } else if (latest < 0.05) {
      setStartAnimation(false);
    }
  });

  const headerTextStyle = "text-[14px] md:text-[16px] font-semibold uppercase tracking-[0.01em] text-white";

  return (
    <footer 
      ref={containerRef} 
      id="contact" 
      className="relative h-screen min-h-screen flex flex-col items-center bg-transparent overflow-hidden"
    >
      {/* Standard Absolute Background Video */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
         <video 
           autoPlay 
           muted 
           loop 
           playsInline 
           className="w-full h-full object-cover blur-[20px] scale-110 select-none"
         >
           <source src="https://bs.boomstream.com/balancer/rCWyWdI7-3aLokGCi.mp4" type="video/mp4" />
         </video>
      </div>

      {/* Main Content Area: Idea / Discuss */}
      <div className="relative z-10 w-full flex flex-col pt-[18vh] md:pt-[20vh] px-5 md:px-8 xl:px-10 2xl:px-[60px] mix-blend-difference">
        <div className="text-center w-full">
          <div className="overflow-hidden py-1">
            <motion.h2
              initial={{ y: "110%" }}
              animate={startAnimation ? { y: "0%" } : { y: "110%" }}
              transition={{ duration: startAnimation ? 0.8 : 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[1.2em] md:text-[2.23em] font-medium tracking-tighter leading-tight max-w-5xl mx-auto text-white uppercase"
            >
              Есть проект или идея?
            </motion.h2>
          </div>
          
          <div className="overflow-hidden py-1">
            <motion.div
              initial={{ y: "110%" }}
              animate={startAnimation ? { y: "0%" } : { y: "110%" }}
              transition={{ duration: startAnimation ? 0.8 : 0.1, delay: startAnimation ? 0.1 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              <span 
                className="text-[1.2em] md:text-[2.5em] font-normal text-white/90 block tracking-wide leading-tight mix-blend-difference italic uppercase"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                давайте обсудим и найдём лучшее решение
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* "Feel Creator" Large Text - Bottom 8vh */}
      <div className="absolute bottom-[8vh] w-full px-5 md:px-8 xl:px-10 2xl:px-[40px] z-10 mix-blend-difference pointer-events-none">
        <div className="w-full">
           {/* DESKTOP TITLE (Single line, character wave) */}
           <div className="hidden md:flex w-full justify-start items-baseline gap-[1vw]">
             <WaveText 
               text="Feel"
               baseIndexOffset={0}
               centerIndex={3.5} 
               trigger={startAnimation}
               delayOffset={0.6} // Delay after header text
               className="text-[11.5vw] md:text-[20.5vw] leading-[0.75] text-white tracking-[-0.05em] whitespace-nowrap font-sans font-normal text-left drop-shadow-lg"
             />
             <WaveText 
               text="Creator"
               baseIndexOffset={4}
               centerIndex={3.5}
               trigger={startAnimation}
               delayOffset={0.6} // Delay after header text
               className="text-[11.5vw] md:text-[20.5vw] leading-[0.75] text-white tracking-[-0.06em] whitespace-nowrap font-normal text-left drop-shadow-lg"
               style={{ fontFamily: "'Apparel Display Italic', serif" }}
             />
           </div>

           {/* MOBILE TITLE (Stacked) - Centered, matching Hero style */}
           <div className="md:hidden w-full flex flex-col justify-start items-center">
             <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={startAnimation ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                  className="block text-[32vw] leading-[0.85] text-white tracking-[-0.05em] font-sans font-normal drop-shadow-lg"
                >
                  Feel
                </motion.span>
             </div>
             <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={startAnimation ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[32vw] leading-[0.85] text-white tracking-[-0.06em] font-normal drop-shadow-lg"
                  style={{ fontFamily: "'Apparel Display Italic', serif" }}
                >
                  Creator
                </motion.span>
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Bar Info - Absolute 0px from bottom of footer (kept as configured by user) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: startAnimation ? 0.8 : 0.1, delay: startAnimation ? 1.4 : 0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[0px] left-0 right-0 z-20 flex justify-between items-center px-5 md:px-8 xl:px-10 2xl:px-[60px] h-[60px] md:h-[60px] mix-blend-difference pointer-events-none"
      >
         {/* Left: Location + Time (HIDDEN ON MOBILE) */}
        <div className="hidden md:flex flex-1 justify-start items-center gap-3">
          <span className={`${headerTextStyle} pointer-events-auto drop-shadow-md`}>
            КАЛИНИНГРАД
          </span>
          <span className={`${headerTextStyle} pointer-events-auto drop-shadow-md`}>
            <KaliningradTime />
          </span>
        </div>

        {/* Center: Links */}
        <div className="flex-1 flex justify-center items-center gap-4 md:gap-8">
            <RollingLink 
              name="TELEGRAM"
              href="https://t.me/MADMAFFIN" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${headerTextStyle} pointer-events-auto drop-shadow-md`}
              pointerEventsAuto
            />
            <RollingLink 
              name="GMAIL"
              href="mailto:electroice33@gmail.com" 
              className={`${headerTextStyle} pointer-events-auto drop-shadow-md`}
              pointerEventsAuto
            />
        </div>

        {/* Right: Role (HIDDEN ON MOBILE - as per standard layout to balance center) */}
        <div className="hidden md:flex flex-1 justify-end items-center text-right">
          <span className={`${headerTextStyle} inline-block pointer-events-auto drop-shadow-md`}>
            CREATIVE DIGITAL DESIGNER
          </span>
        </div>
      </motion.div>
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-150 z-[3] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </footer>
  );
}
