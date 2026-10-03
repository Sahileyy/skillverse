import { Suspense } from "react";
import SearchPageView from "@/components/search/search-page-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "Skill Search & Mentors — SkillVerse",
  description: "Discover peer mentors and published skill-sharing sessions on SkillVerse.",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="size-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span>Loading mentor posts...</span>
              </div>
            </div>
          }
        >
          <SearchPageView />
        </Suspense>
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
