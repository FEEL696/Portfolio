import { useEffect, useMemo, useState } from 'react';
import { portfolioContent } from './portfolio.ts';
import { PortfolioContent, Project } from '../types/portfolio.ts';
import { isSupabaseConfigured, supabase } from '../lib/supabase.ts';
import { Session } from '@supabase/supabase-js';

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  stack: string[] | null;
  image: string;
  href: string | null;
  gallery_images: string[] | null;
  sort_order: number;
}

function cloneContent(content: PortfolioContent): PortfolioContent {
  return JSON.parse(JSON.stringify(content)) as PortfolioContent;
}

function mapRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    stack: row.stack ?? [],
    image: row.image,
    href: row.href ?? '',
    galleryImages: row.gallery_images ?? [],
  };
}

function mapProjectToRow(project: Project, index: number) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    stack: project.stack,
    image: project.image,
    href: project.href || null,
    gallery_images: project.galleryImages,
    sort_order: index,
  };
}

export function usePortfolioContentStore() {
  const [content, setContent] = useState<PortfolioContent>(() => cloneContent(portfolioContent));
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      setIsAuthLoading(false);
      return;
    }

    let cancelled = false;

    const loadProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id,title,description,stack,image,href,gallery_images,sort_order')
        .order('sort_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        setSaveError(error.message);
        setContent(cloneContent(portfolioContent));
      } else if (data && data.length > 0) {
        setContent({
          ...cloneContent(portfolioContent),
          projects: data.map((row) => mapRowToProject(row as ProjectRow)),
        });
      } else {
        setContent(cloneContent(portfolioContent));
      }

      setIsLoading(false);
    };

    loadProjects();

    const loadSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!cancelled) {
        setSession(initialSession);
        setIsAuthLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const hasStoredOverride = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(portfolioContent);
  }, [content]);

  const resetContent = () => {
    setContent(cloneContent(portfolioContent));
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase is not configured.' };

    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const saveProjects = async (projects: Project[]) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    if (!session) return { error: 'You must sign in first.' };

    setIsSaving(true);
    setSaveError(null);

    const rows = projects.map((project, index) => mapProjectToRow(project, index));
    const projectIds = rows.map((row) => row.id);

    const { error: upsertError } = await supabase.from('projects').upsert(rows, {
      onConflict: 'id',
    });

    if (upsertError) {
      setIsSaving(false);
      setSaveError(upsertError.message);
      return { error: upsertError.message };
    }

    const { data: existingRows, error: fetchError } = await supabase
      .from('projects')
      .select('id');

    if (fetchError) {
      setIsSaving(false);
      setSaveError(fetchError.message);
      return { error: fetchError.message };
    }

    const idsToDelete =
      existingRows?.map((row) => row.id).filter((id) => !projectIds.includes(id)) ?? [];

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        setIsSaving(false);
        setSaveError(deleteError.message);
        return { error: deleteError.message };
      }
    }

    setContent((prev) => ({ ...prev, projects }));
    setIsSaving(false);
    return { error: null };
  };

  return {
    content,
    setContent,
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
  };
}

export function createEmptyProject(nextIndex: number) {
  return {
    id: `project-${Date.now()}`,
    title: `Новый проект ${nextIndex}`,
    description: '',
    stack: [],
    image: '',
    href: '',
    galleryImages: [],
  };
}
