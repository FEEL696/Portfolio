import React from 'react';
import Hero from './Hero.tsx';
import Navbar from './Navbar.tsx';
import ProjectsAndServices from './ProjectsAndServices.tsx';
import Footer from './Footer.tsx';
import { Project, Service } from '../types/portfolio.ts';

interface MainPageProps {
  introFinished: boolean;
  onProjectSelect: (id: string) => void;
  projects: Project[];
  services: Service[];
}

export default function MainPage({
  introFinished,
  onProjectSelect,
  projects,
  services,
}: MainPageProps) {
  return (
    <main className="w-full">
      <div id="hero" className="relative w-full z-10">
        <Hero startAnimation={introFinished} />
      </div>

      <div className="sticky top-0 -mt-[calc(10vh+60px)] md:-mt-[calc(10vh+80px)] z-[100] pointer-events-none mix-blend-difference">
        <Navbar />
      </div>

      <div id="projects" className="relative z-30">
        <ProjectsAndServices
          projects={projects}
          services={services}
          onProjectClick={onProjectSelect}
        />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
