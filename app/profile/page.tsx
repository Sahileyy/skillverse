import ProfileView from "@/components/profile/profile-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "My Profile — SkillVerse",
  description: "View and edit your SkillVerse profile, learning progress, verified skills, and experience points.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <ProfileView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
