import AIAssessmentView from "@/components/assessment/ai-assessment-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "AI Skill Assessment & Verification — SkillVerse",
  description: "Test your engineering and design skills with adaptive AI quizzes and earn verified badges on SkillVerse.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <AIAssessmentView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
