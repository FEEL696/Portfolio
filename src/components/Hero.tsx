import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import KaliningradTime from './shared/KaliningradTime.tsx';
import WaveText from './shared/WaveText.tsx';
import RollingLink from './shared/RollingLink.tsx';

export default function Hero({ startAnimation = true }: { startAnimation?: boolean }) {
  const { scrollY } = useScroll();
  
  // Parallax: Move background slower than foreground.
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const blur = useTransform(scrollY, [0, 800], ["blur(0px)", "blur(20px)"]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.2]);

  const headerTextStyle = "text-[14px] md:text-[16px] font-semibold uppercase tracking-[0.01em] text-white";

  return (
    <section className="relative h-[110vh] w-full bg-transparent overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Image Layer */}
      <motion.div 
        style={{ y, filter: blur, opacity }}
        className="absolute inset-0 z-0 w-full h-[100vh] pointer-events-none select-none"
      >
        <div className="w-full h-full relative">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover select-none"
            >
              <source src="https://bs.boomstream.com/balancer/rCWyWdI7-3aLokGCi.mp4" type="video/mp4" />
            </video>
        </div>
      </motion.div>

      {/* Hero Info Row - Bottom 10vh */}
      <div className="absolute bottom-[10vh] left-0 right-0 z-20 flex justify-between items-center px-5 md:px-8 xl:px-10 2xl:px-[60px] h-[60px] md:h-[80px] pointer-events-none mix-blend-difference">
         
         {/* DESKTOP Left: Location + Time */}
        <div className="hidden md:flex flex-1 justify-start items-center gap-3">
          <span className={`${headerTextStyle} pointer-events-auto drop-shadow-md`}>
            КАЛИНИНГРАД
          </span>
          <span className={`${headerTextStyle} pointer-events-auto drop-shadow-md`}>
            <KaliningradTime />
          </span>
        </div>

        {/* MOBILE Left: Social Links (Moved from footer logic for mobile hero) - CENTERED */}
        <div className="flex md:hidden w-full justify-center items-center gap-6 pointer-events-auto">
             <RollingLink
              name="TELEGRAM"
              href="https://t.me/MADMAFFIN" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={headerTextStyle}
              pointerEventsAuto
              selectNone
            />
            <RollingLink
              name="GMAIL"
              href="mailto:electroice33@gmail.com" 
              className={headerTextStyle}
              pointerEventsAuto
              selectNone
            />
        </div>

        {/* Center: Empty spacer */}
        <div className="hidden md:flex flex-1" />

        {/* Right: Description */}
        <div className="hidden md:flex flex-1 justify-end items-center text-right">
          <span className={`${headerTextStyle} inline-block pointer-events-auto drop-shadow-md`}>
            CREATIVE DIGITAL DESIGNER
          </span>
        </div>
      </div>

      {/* Top Center Content (Description) */}
      <div className="absolute top-[40px] w-full flex justify-center z-10 px-5 mix-blend-difference">
        <div className="overflow-visible text-center text-white font-sans text-[20px] md:text-[30px] leading-snug font-medium tracking-normal drop-shadow-md">
          {/* DESKTOP Description */}
          <p className="hidden md:block">
            <span 
              className="font-normal text-[1.2em] italic"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Креативный партнер
            </span> для компаний и брендов,
            <br />
            которые решили двигаться вперед
          </p>
          
          {/* MOBILE Description: 3 specific lines */}
          <div className="md:hidden flex flex-col items-center">
             <p 
               className="font-normal text-[1.15em] italic" 
               style={{ fontFamily: "'Instrument Serif', serif" }}
             >
               Креативный партнер
             </p>
             <p>для компаний и брендов,</p>
             <p>которые решили двигаться вперед</p>
          </div>
        </div>
      </div>

      {/* Bottom Big Title */}
      <div className="absolute bottom-[18vh] w-full px-5 md:px-8 xl:px-10 2xl:px-[40px] z-10 mix-blend-difference">
        <div className="w-full">
           
           {/* DESKTOP TITLE (Single line, character wave) */}
           <div className="hidden md:flex w-full justify-start items-baseline gap-[1vw]">
             <WaveText 
               text="Feel"
               baseIndexOffset={0}
               centerIndex={3.5}
               trigger={startAnimation}
               delayOffset={0.1}
               className="text-[11.5vw] md:text-[20.5vw] leading-[0.75] text-white tracking-[-0.05em] whitespace-nowrap font-sans font-normal text-left drop-shadow-lg"
             />
             <WaveText 
               text="Creator"
               baseIndexOffset={4}
               centerIndex={3.5}
               trigger={startAnimation}
               delayOffset={0.1}
               className="text-[11.5vw] md:text-[20.5vw] leading-[0.75] text-white tracking-[-0.06em] whitespace-nowrap font-normal text-left drop-shadow-lg"
               style={{ fontFamily: "'Apparel Display Italic', serif" }}
             />
           </div>

           {/* MOBILE TITLE (Stacked, word slide animation) - CENTERED */}
           <div className="md:hidden w-full flex flex-col justify-start items-center">
             <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={startAnimation ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[32vw] leading-[0.85] text-white tracking-[-0.05em] font-sans font-normal drop-shadow-lg"
                >
                  Feel
                </motion.span>
             </div>
             <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={startAnimation ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[32vw] leading-[0.85] text-white tracking-[-0.06em] font-normal drop-shadow-lg"
                  style={{ fontFamily: "'Apparel Display Italic', serif" }}
                >
                  Creator
                </motion.span>
             </div>
           </div>

        </div>
      </div>
      
    </section>
  );
}
