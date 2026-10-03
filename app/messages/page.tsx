import ChatView from "@/components/chat/chat-view";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export const metadata = {
  title: "Direct Messages & Session Chat — SkillVerse",
  description: "Direct 1-on-1 messaging and video meeting scheduling with peer mentors on SkillVerse.",
};

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <LoginModalProvider>
        <SiteHeader />
        <ChatView />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
