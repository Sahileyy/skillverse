import MentorProfileView from "@/components/mentor/mentor-profile-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const name = id.replace("mentor-", "").replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} — Mentor Profile | SkillVerse`,
    description: `Book 1-on-1 mentorship, code reviews, and career advice with ${name} on SkillVerse.`,
  };
}

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <MentorProfileView mentorId={id} />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
