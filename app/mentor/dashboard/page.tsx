import MentorDashboardView from "@/components/mentor/mentor-dashboard-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "Mentor Studio — Post Skill Ads & Connect with Students | SkillVerse",
  description:
    "Dedicated Mentor Portal to publish skill offerings, manage availability, and let students discover your 1-on-1 sessions on SkillVerse.",
};

export default function MentorDashboardPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <MentorDashboardView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
