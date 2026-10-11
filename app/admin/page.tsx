import AdminDashboardView from "@/components/admin/admin-dashboard-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "Admin Command Center — User Moderation & Platform Analytics | SkillVerse",
  description:
    "Comprehensive administrative control center to manage student & mentor accounts, peer ads, booking requests, XP distributions, and community safety on SkillVerse.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <AdminDashboardView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
