import CommunityProjectsView from "@/components/community/community-projects-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "Community Projects & Collaboration — SkillVerse",
  description: "Join open student projects, collaborate with peer engineers and mentors, and build real-world software on SkillVerse.",
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <CommunityProjectsView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
