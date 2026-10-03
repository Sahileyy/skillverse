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
        <AIRoadmapView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
