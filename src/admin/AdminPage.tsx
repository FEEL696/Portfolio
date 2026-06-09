import React, { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { PortfolioContent, Project } from '../types/portfolio.ts';
import { createEmptyProject } from '../content/use-portfolio-content-store.ts';
import { isVideoUrl } from '../lib/media.ts';

interface AdminPageProps {
  content: PortfolioContent;
  resetContent: () => void;
  hasStoredOverride: boolean;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  authError: string | null;
  session: Session | null;
  isAuthLoading: boolean;
  isSupabaseConfigured: boolean;
  saveProjects: (projects: Project[]) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function renderPreview(url: string) {
  if (!url.trim()) {
    return <span className="text-[11px] uppercase tracking-[0.2em] text-white/30">Preview</span>;
  }

  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  return <img src={url} alt="" className="h-full w-full object-cover" />;
}

export default function AdminPage({
  content,
  resetContent,
  hasStoredOverride,
  isLoading,
  isSaving,
  saveError,
  authError,
  session,
  isAuthLoading,
  isSupabaseConfigured,
  saveProjects,
  signIn,
  signOut,
}: AdminPageProps) {
  const [draftProjects, setDraftProjects] = useState<Project[]>(content.projects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    content.projects[0]?.id ?? null
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stackInput, setStackInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [projectDropTargetId, setProjectDropTargetId] = useState<string | null>(null);
  const [draggingGalleryIndex, setDraggingGalleryIndex] = useState<number | null>(null);
  const [galleryDropIndex, setGalleryDropIndex] = useState<number | null>(null);

  useEffect(() => {
    setDraftProjects(content.projects);
  }, [content.projects]);

  useEffect(() => {
    if (!draftProjects.length) {
      setSelectedProjectId(null);
      return;
    }

    const stillExists = draftProjects.some((project) => project.id === selectedProjectId);
    if (!stillExists) {
      setSelectedProjectId(draftProjects[0].id);
    }
  }, [draftProjects, selectedProjectId]);

  const selectedProject = useMemo(
    () => draftProjects.find((project) => project.id === selectedProjectId) ?? null,
    [draftProjects, selectedProjectId]
  );

  useEffect(() => {
    if (!selectedProject) {
      setStackInput('');
      return;
    }

    setStackInput(selectedProject.stack.join(', '));
  }, [selectedProjectId]);

  const isDirty = useMemo(() => {
    return JSON.stringify(draftProjects) !== JSON.stringify(content.projects);
  }, [content.projects, draftProjects]);

  const updateProject = (projectId: string, updater: (project: Project) => Project) => {
    setDraftProjects((prev) =>
      prev.map((project) => (project.id === projectId ? updater(project) : project))
    );
  };

  const addProject = () => {
    const nextProject = createEmptyProject(draftProjects.length + 1);
    setDraftProjects((prev) => [...prev, nextProject]);
    setSelectedProjectId(nextProject.id);
  };

  const deleteProject = (projectId: string) => {
    const currentIndex = draftProjects.findIndex((project) => project.id === projectId);
    if (currentIndex === -1) return;

    const nextProjects = draftProjects.filter((project) => project.id !== projectId);
    setDraftProjects(nextProjects);

    const fallbackProject = nextProjects[currentIndex] ?? nextProjects[currentIndex - 1] ?? null;
    setSelectedProjectId(fallbackProject?.id ?? null);
  };

  const reorderProjects = (sourceProjectId: string, targetProjectId: string) => {
    if (sourceProjectId === targetProjectId) return;

    setDraftProjects((prev) => {
      const sourceIndex = prev.findIndex((project) => project.id === sourceProjectId);
      const targetIndex = prev.findIndex((project) => project.id === targetProjectId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return prev;
      }

      return moveItem(prev, sourceIndex, targetIndex);
    });
  };

  const addGalleryItem = (projectId: string) => {
    updateProject(projectId, (project) => ({
      ...project,
      galleryImages: [...project.galleryImages, ''],
    }));
  };

  const updateGalleryItem = (projectId: string, index: number, value: string) => {
    updateProject(projectId, (project) => ({
      ...project,
      galleryImages: project.galleryImages.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const removeGalleryItem = (projectId: string, index: number) => {
    updateProject(projectId, (project) => ({
      ...project,
      galleryImages: project.galleryImages.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const reorderGalleryItems = (projectId: string, sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;

    updateProject(projectId, (project) => ({
      ...project,
      galleryImages: moveItem(project.galleryImages, sourceIndex, targetIndex),
    }));
  };

  const handleSave = async () => {
    setStatusMessage(null);
    const result = await saveProjects(draftProjects);
    setStatusMessage(
      result.error ? `Ошибка сохранения: ${result.error}` : 'Изменения сохранены в Supabase.'
    );
  };

  const handleResetDraft = () => {
    setDraftProjects(content.projects);
    setStatusMessage('Черновик сброшен к последней загруженной версии.');
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    const result = await signIn(email, password);
    if (!result.error) {
      setPassword('');
      setStatusMessage('Вход выполнен.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <header className="flex flex-col gap-4 border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">CMS Admin</p>
              <h1 className="text-2xl font-semibold tracking-tight">Управление проектами</h1>
              <p className="mt-1 max-w-3xl text-sm text-white/60">
                Проекты хранятся в `Supabase`. Медиа по-прежнему задаются обычными ссылками.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/"
                className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white hover:text-black"
              >
                Открыть сайт
              </a>
              <button
                onClick={addProject}
                className="border border-white/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/85"
              >
                Добавить проект
              </button>
              <button
                onClick={handleSave}
                disabled={!session || !isDirty || isSaving}
                className="border border-white/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/85 disabled:opacity-40"
              >
                {isSaving ? 'Сохраняю...' : 'Сохранить'}
              </button>
            </div>
          </div>

          <div className="grid gap-4 border border-white/10 bg-black/20 p-4 md:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-2 text-sm text-white/65">
              <p>
                Supabase:{' '}
                <span className="text-white">{isSupabaseConfigured ? 'configured' : 'not configured'}</span>
              </p>
              <p>
                Status:{' '}
                <span className="text-white">
                  {session ? `signed in as ${session.user.email}` : 'not signed in'}
                </span>
              </p>
              <p>
                Projects loaded: <span className="text-white">{draftProjects.length}</span>
              </p>
              <p>
                Draft state:{' '}
                <span className="text-white">
                  {isDirty
                    ? 'unsaved changes'
                    : hasStoredOverride
                      ? 'synced remote override'
                      : 'matches local default'}
                </span>
              </p>
              {statusMessage && <p className="text-white">{statusMessage}</p>}
              {saveError && <p className="text-red-300">Save error: {saveError}</p>}
              {authError && <p className="text-red-300">Auth error: {authError}</p>}
            </div>

            <div className="border border-white/10 bg-white/5 p-3">
              {isAuthLoading ? (
                <p className="text-sm text-white/55">Проверяю сессию...</p>
              ) : session ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-white/65">
                    Авторизован как <span className="text-white">{session.user.email}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleResetDraft}
                      className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white hover:text-black"
                    >
                      Сбросить черновик
                    </button>
                    <button
                      onClick={resetContent}
                      className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white hover:text-black"
                    >
                      Локальный дефолт
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white hover:text-black"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignIn} className="flex flex-col gap-3">
                  <p className="text-sm text-white/65">Войди под своим пользователем Supabase Auth.</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!isSupabaseConfigured}
                    className="border border-white/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/85 disabled:opacity-40"
                  >
                    Войти
                  </button>
                </form>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="border border-white/10 bg-white/5 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Проекты</p>
                <p className="text-sm text-white/65">
                  Количество на фронте: <span className="text-white">{draftProjects.length}</span>
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                {isLoading ? 'Loading...' : isDirty ? 'Draft changed' : 'Synced'}
              </span>
            </div>

            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/35">
              Перетаскивай карточки для изменения порядка.
            </p>

            <div className="flex flex-col gap-2">
              {draftProjects.map((project, index) => {
                const isActive = project.id === selectedProjectId;
                const isDropTarget =
                  projectDropTargetId === project.id && draggingProjectId !== project.id;

                return (
                  <div
                    key={project.id}
                    draggable
                    onClick={() => setSelectedProjectId(project.id)}
                    onDragStart={() => {
                      setDraggingProjectId(project.id);
                      setProjectDropTargetId(project.id);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (draggingProjectId && draggingProjectId !== project.id) {
                        setProjectDropTargetId(project.id);
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (draggingProjectId) {
                        reorderProjects(draggingProjectId, project.id);
                      }
                      setDraggingProjectId(null);
                      setProjectDropTargetId(null);
                    }}
                    onDragEnd={() => {
                      setDraggingProjectId(null);
                      setProjectDropTargetId(null);
                    }}
                    className={`cursor-grab border p-3 transition ${
                      isActive
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 bg-black/20 text-white'
                    } ${isDropTarget ? 'border-white/60' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-60">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                        <span className="line-clamp-1 text-sm font-medium uppercase tracking-wide">
                          {project.title || 'Без названия'}
                        </span>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="border border-current/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <main className="border border-white/10 bg-white/5 p-4 md:p-6">
            {selectedProject ? (
              <div className="flex flex-col gap-6">
                <section className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                      Заголовок
                    </span>
                    <input
                      value={selectedProject.title}
                      onChange={(event) =>
                        updateProject(selectedProject.id, (project) => ({
                          ...project,
                          title: event.target.value,
                        }))
                      }
                      className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                      Cover image
                    </span>
                    <input
                      value={selectedProject.image}
                      onChange={(event) =>
                        updateProject(selectedProject.id, (project) => ({
                          ...project,
                          image: event.target.value,
                        }))
                      }
                      className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                      Описание
                    </span>
                    <textarea
                      value={selectedProject.description}
                      onChange={(event) =>
                        updateProject(selectedProject.id, (project) => ({
                          ...project,
                          description: event.target.value,
                        }))
                      }
                      rows={5}
                      className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                      Ссылка проекта
                    </span>
                    <input
                      value={selectedProject.href ?? ''}
                      onChange={(event) =>
                        updateProject(selectedProject.id, (project) => ({
                          ...project,
                          href: event.target.value,
                        }))
                      }
                      className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                      Stack
                    </span>
                    <input
                      value={stackInput}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setStackInput(nextValue);
                        updateProject(selectedProject.id, (project) => ({
                          ...project,
                          stack: nextValue
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean),
                        }));
                      }}
                      className="border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                    />
                  </label>
                </section>

                <section className="border border-white/10 bg-black/20 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-white/45">
                        Галерея проекта
                      </p>
                      <p className="text-sm text-white/60">
                        Перетаскивай медиа между собой. Ссылки можно менять прямо в полях.
                      </p>
                    </div>

                    <button
                      onClick={() => addGalleryItem(selectedProject.id)}
                      className="border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
                    >
                      Добавить медиа
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {selectedProject.galleryImages.map((item, index) => {
                      const isDropTarget =
                        galleryDropIndex === index && draggingGalleryIndex !== index;

                      return (
                        <div
                          key={`${selectedProject.id}-gallery-${index}`}
                          draggable
                          onDragStart={() => {
                            setDraggingGalleryIndex(index);
                            setGalleryDropIndex(index);
                          }}
                          onDragOver={(event) => {
                            event.preventDefault();
                            if (draggingGalleryIndex !== null && draggingGalleryIndex !== index) {
                              setGalleryDropIndex(index);
                            }
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            if (draggingGalleryIndex !== null) {
                              reorderGalleryItems(selectedProject.id, draggingGalleryIndex, index);
                            }
                            setDraggingGalleryIndex(null);
                            setGalleryDropIndex(null);
                          }}
                          onDragEnd={() => {
                            setDraggingGalleryIndex(null);
                            setGalleryDropIndex(null);
                          }}
                          className={`grid gap-4 border bg-white/5 p-3 transition md:grid-cols-[220px_minmax(0,1fr)] ${
                            isDropTarget ? 'border-white/60' : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-center overflow-hidden bg-black/30 aspect-[4/3]">
                            {renderPreview(item)}
                          </div>

                          <div className="flex min-w-0 flex-col gap-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[11px] uppercase tracking-[0.25em] text-white/45">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <button
                                onClick={() => removeGalleryItem(selectedProject.id, index)}
                                className="border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                              >
                                Удалить
                              </button>
                            </div>

                            <div className="mt-auto pt-2">
                              <input
                                value={item}
                                onChange={(event) =>
                                  updateGalleryItem(selectedProject.id, index, event.target.value)
                                }
                                className="w-full border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {selectedProject.galleryImages.length === 0 && (
                      <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">
                        У проекта пока нет галереи.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="border border-dashed border-white/10 px-4 py-10 text-sm text-white/45">
                Проект не выбран.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
