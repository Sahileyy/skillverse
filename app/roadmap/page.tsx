import { Suspense } from "react";
import AIRoadmapView from "@/components/roadmap/ai-roadmap-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "AI Career Guidance & Roadmap — SkillVerse",
  description: "Visual roadmap progression from current baseline skills to target roles with personalized mentor recommendations on SkillVerse.",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <span className="size-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                Loading Career Path Navigation...
              </div>
            </div>
          }
        >
          <AIRoadmapView />
        </Suspense>
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
