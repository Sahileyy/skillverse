import { Suspense } from "react";
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
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <span className="size-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                Loading Technical Assessment...
              </div>
            </div>
          }
        >
          <AIAssessmentView />
        </Suspense>
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
