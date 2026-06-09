import React, { Suspense, lazy } from 'react';
import App from './App.tsx';
import { usePortfolioContentStore } from './content/use-portfolio-content-store.ts';

const AdminPage = lazy(() => import('./admin/AdminPage.tsx'));

function isAdminRoute() {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/admin');
}

export default function Root() {
  const contentStore = usePortfolioContentStore();

  if (isAdminRoute()) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
            Загрузка CMS...
          </div>
        }
      >
        <AdminPage
          content={contentStore.content}
          resetContent={contentStore.resetContent}
          hasStoredOverride={contentStore.hasStoredOverride}
          isLoading={contentStore.isLoading}
          isSaving={contentStore.isSaving}
          saveError={contentStore.saveError}
          authError={contentStore.authError}
          session={contentStore.session}
          isAuthLoading={contentStore.isAuthLoading}
          isSupabaseConfigured={contentStore.isSupabaseConfigured}
          saveProjects={contentStore.saveProjects}
          signIn={contentStore.signIn}
          signOut={contentStore.signOut}
        />
      </Suspense>
    );
  }

  return <App content={contentStore.content} />;
}
