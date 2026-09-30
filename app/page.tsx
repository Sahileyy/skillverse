"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Discover", href: "#discover" },
  { label: "Teach", href: "#teach" },
  { label: "Mentors", href: "#mentors" },
  { label: "Community", href: "#community" },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white font-sans text-[#141414]">
      <header className="relative z-20 bg-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
          <Link
            className="text-[21px] font-bold text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
            href="/"
          >
            SkillVerse
          </Link>

          <nav aria-label="Primary navigation" className="ml-14 hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <a
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-5">
            <button
              aria-label="Select language"
              className="inline-flex size-10 items-center justify-center text-xs font-bold text-[#252525] transition-colors hover:text-[#777777] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
              title="Select language"
              type="button"
            >
              EN
            </button>
            <button
              className="hidden text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:inline-flex"
              type="button"
            >
              Log in
            </button>
            <button
              className="hidden h-12 whitespace-nowrap bg-[#151515] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d3d3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:inline-flex sm:items-center sm:justify-center"
              type="button"
            >
              Join SkillVerse
            </button>
            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex size-10 items-center justify-center text-[#252525] transition-colors hover:text-[#777777] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] lg:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              title={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              type="button"
            >
              <span aria-hidden="true" className="relative block size-5">
                <span className={`absolute left-0 block h-px w-5 bg-current transition-transform ${isMenuOpen ? "top-2.5 rotate-45" : "top-1"}`} />
                <span className={`absolute left-0 top-2.5 block h-px w-5 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 block h-px w-5 bg-current transition-transform ${isMenuOpen ? "top-2.5 -rotate-45" : "top-4"}`} />
              </span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="border-t border-black/[0.09] bg-white px-5 pb-6 pt-5 sm:px-8 lg:hidden"
            id="mobile-navigation"
          >
            <nav aria-label="Mobile primary navigation" className="flex flex-col">
              {navigation.map((item) => (
                <a
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex items-center gap-5">
              <button
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
                type="button"
              >
                Log in
              </button>
              <button
                className="h-12 bg-[#151515] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d3d3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
                type="button"
              >
                Join SkillVerse
              </button>
            </div>
          </div>
        )}
      </header>
      <section className="home-hero-backdrop px-5 pb-12 pt-14 text-center sm:px-8 sm:pt-16">
        <h1 className="mx-auto max-w-4xl text-[42px] font-bold leading-[1.08] text-[#292333] sm:text-[54px]">
          Get unstuck.<br />With a mentor who gets it.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#77747e] sm:text-[15px]">
          A fresh perspective from someone who&apos;s been there.<br className="hidden sm:block" />
          Get matched with a mentor and turn “what now?” into what&apos;s next.
        </p>
        <a className="mt-6 inline-flex h-12 items-center gap-4 rounded-md bg-[#103633] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1e514c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103633]" href="#mentors">
          Get matched with a mentor <span aria-hidden="true">↗</span>
        </a>
        <p className="mt-3 text-[11px] text-[#77747e]">Includes one free session · ~3 min</p>

        <div className="mx-auto mt-10 flex w-fit items-center gap-2 text-xs text-[#24212b]" aria-label="Rated excellent, 4.5 out of 5 on Trustpilot">
          <span className="flex gap-0.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => <span className="flex size-4 items-center justify-center bg-[#00b67a] text-[13px] leading-none text-white" key={star}>★</span>)}
          </span>
          <strong className="ml-1">Excellent</strong>
          <span>4.5 out of 5 on</span>
          <strong className="inline-flex items-center gap-1"><span className="text-base text-[#00b67a]" aria-hidden="true">★</span>Trustpilot</strong>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-base font-semibold tracking-tight text-[#77777a] sm:gap-x-14 sm:text-lg" aria-label="Companies our mentors have worked at">
          <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="grid size-4 grid-cols-2 gap-0.5"><i className="bg-current" /><i className="bg-current" /><i className="bg-current" /><i className="bg-current" /></span>Microsoft</span>
          <span className="font-bold">amazon</span>
          <span className="font-medium">Figma</span>
          <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="text-xl">◉</span>Spotify</span>
          <span className="font-black">NETFLIX</span>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 text-center sm:px-8 sm:pt-12" id="discover">
        <h2 className="text-3xl font-bold text-[#292333] sm:text-[34px]">What do you want help with?</h2>
        <p className="mt-3 text-sm text-[#77747e]">You don&apos;t need to have it all figured out. Just a place to start.</p>
        <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
          <article className="min-h-48 rounded-md bg-[#eee7f3] p-6 sm:p-8"><span className="text-xs font-semibold uppercase tracking-wide text-[#776d83]">Find direction</span><h3 className="mt-8 text-2xl font-bold text-[#292333]">Get unstuck</h3><p className="mt-2 text-sm leading-6 text-[#625d69]">Make sense of what comes next, one conversation at a time.</p></article>
          <article className="min-h-48 rounded-md bg-[#e7eee7] p-6 sm:p-8"><span className="text-xs font-semibold uppercase tracking-wide text-[#66776b]">Try something new</span><h3 className="mt-8 text-2xl font-bold text-[#292333]">Switch careers</h3><p className="mt-2 text-sm leading-6 text-[#625d69]">Explore a new path with someone who knows the way.</p></article>
          <article className="min-h-48 rounded-md bg-[#f1e9de] p-6 sm:p-8"><span className="text-xs font-semibold uppercase tracking-wide text-[#827563]">Keep growing</span><h3 className="mt-8 text-2xl font-bold text-[#292333]">Level up</h3><p className="mt-2 text-sm leading-6 text-[#625d69]">Build confidence and skills for the next big step.</p></article>
        </div>
      </section>
      <section className="bg-[#1f2431] px-5 py-24 text-white sm:px-8" id="mentors"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.18em]">People in your corner</p><h2 className="mt-5 text-4xl font-bold">Meet someone who has been where you are.</h2><div className="mt-12 grid gap-5 md:grid-cols-3"><img alt="Mentor Aarav" className="h-72 w-full object-cover" src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=720&q=80" /><img alt="Mentor Maya" className="h-72 w-full object-cover" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=720&q=80" /><img alt="Mentor Noah" className="h-72 w-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=80" /></div></div></section>
      <section className="grid md:grid-cols-2" id="teach"><article className="bg-[#e6efe9] px-5 py-20 sm:px-8 lg:px-20"><p className="text-xs font-bold uppercase">Share what you know</p><h2 className="mt-5 text-4xl font-bold">Every skill is worth passing on.</h2></article><article className="bg-[#f7eddc] px-5 py-20 sm:px-8 lg:px-20"><p className="text-xs font-bold uppercase">A fair exchange</p><h2 className="mt-5 text-4xl font-bold">Give an hour. Get an hour.</h2></article></section>
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8" id="how-it-works"><h2 className="text-4xl font-bold">How SkillVerse works.</h2><div className="mt-12 grid gap-10 md:grid-cols-3"><article><b>01</b><h3 className="mt-6 text-2xl font-bold">Start with you</h3><p className="mt-3">Name the skill, question, or goal you have now.</p></article><article><b>02</b><h3 className="mt-6 text-2xl font-bold">Find the right fit</h3><p className="mt-3">Explore people by skill and goal.</p></article><article><b>03</b><h3 className="mt-6 text-2xl font-bold">Make it count</h3><p className="mt-3">Book a session and leave with a next move.</p></article></div></section>
      <section className="bg-[#eee9f6] px-5 py-24 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase">Career guidance, when you need it</p><h2 className="mt-5 max-w-xl text-4xl font-bold">A clearer question is a powerful start.</h2><div className="mt-8 max-w-lg bg-white p-6 shadow-xl"><b>SkillVerse guide</b><p className="mt-6 bg-[#f4f1f7] p-4">I do not know how to turn what I learned into a career direction.</p><p className="ml-auto mt-5 bg-[#dceee8] p-4">What work makes you lose track of time?</p></div></div></section>
      <section className="bg-[#f6f5f2] px-5 py-24 sm:px-8" id="community"><div className="mx-auto max-w-6xl"><h2 className="text-4xl font-bold">Small conversations. Big shifts.</h2><div className="mt-12 grid gap-4 md:grid-cols-3"><blockquote className="bg-white p-7">&quot;One conversation gave me a plan for my first product case study.&quot;<footer className="mt-8 font-bold">Nisha R.</footer></blockquote><blockquote className="bg-white p-7">&quot;Teaching showed me I had more to offer.&quot;<footer className="mt-8 font-bold">Daniel K.</footer></blockquote><blockquote className="bg-white p-7">&quot;My mentor helped me ask a better question.&quot;<footer className="mt-8 font-bold">Amina B.</footer></blockquote></div></div></section>
      <section className="mx-auto max-w-3xl px-5 py-24"><h2 className="text-center text-4xl font-bold">Questions, answered.</h2><details className="mt-12 border-y py-5"><summary className="cursor-pointer font-bold">Who is SkillVerse for?</summary><p className="pt-4">Students and early-career learners building a confident next step.</p></details></section>
      <section className="bg-[#153e3a] px-5 py-24 text-center text-white"><h2 className="text-5xl font-bold">Learn together. Go further.</h2><button className="mt-9 h-14 bg-white px-6 text-sm font-bold text-[#153e3a]" type="button">Join SkillVerse -&gt;</button></section>
      <footer className="bg-[#171416] px-5 py-12 text-white"><div className="mx-auto flex max-w-6xl justify-between"><b>SkillVerse</b><span>Learn, teach, connect, grow.</span></div></footer>
    </main>
  );
}
