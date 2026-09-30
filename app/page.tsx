import HomeSections from "@/components/home/home-sections";
import LoginModalProvider from "@/components/auth/login-modal-provider";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#141414]">
      <LoginModalProvider>
        <SiteHeader />
        <HomeSections />
        <SiteFooter />
      </LoginModalProvider>
    </main>
  );
}
