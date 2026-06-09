import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ProjectModal from './ProjectModal.tsx';
import { Project } from '../types/portfolio.ts';

interface ProjectModalManagerProps {
  projects: Project[];
  selectedProjectId: string | null;
  onClose: () => void;
  onSelectProject: (id: string) => void;
}

export default function ProjectModalManager({
  projects,
  selectedProjectId,
  onClose,
  onSelectProject,
}: ProjectModalManagerProps) {
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  return (
    <AnimatePresence>
      {selectedProjectId && selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={onClose}
          onNext={() => {
            const idx = projects.findIndex((project) => project.id === selectedProjectId);
            onSelectProject(projects[(idx + 1) % projects.length].id);
          }}
          onPrev={() => {
            const idx = projects.findIndex((project) => project.id === selectedProjectId);
            onSelectProject(projects[(idx - 1 + projects.length) % projects.length].id);
          }}
        />
      )}
    </AnimatePresence>
  );
}
