"use client";

import Link from "next/link";
import { motion } from "motion/react";

const IMPORTANT_LINKS = [
  { name: "Find Mentors", href: "/search" },
  { name: "AI Assessment", href: "/assessment" },
  { name: "Career Roadmaps", href: "/roadmap" },
  { name: "Community Projects", href: "/community" },
  { name: "1-on-1 Chat", href: "/messages" },
];

const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com", external: true },
  { name: "Discord", href: "https://discord.com", external: true },
  { name: "LinkedIn", href: "https://linkedin.com", external: true },
  { name: "Twitter / X", href: "https://x.com", external: true },
  { name: "YouTube", href: "https://youtube.com", external: true },
];

export default function SiteFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
      className="flex w-full flex-col justify-end overflow-hidden bg-[#0a0d14] px-4 pt-12 sm:px-8 sm:pt-20 lg:px-12 border-t border-slate-800/80"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-6 sm:gap-x-4 lg:gap-x-8">
          {/* Platform Links (Visible on mobile & desktop) */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">Platform</h3>
            <div className="mt-3 sm:mt-5 flex flex-wrap sm:flex-col gap-x-4 gap-y-2 sm:gap-2.5">
              {IMPORTANT_LINKS.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mentorship Links (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col items-start text-left">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">Mentorship</h3>
            <div className="mt-3.5 sm:mt-5 flex flex-col gap-2 sm:gap-2.5">
              <Link href="/search" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                Find a Mentor
              </Link>
              <Link href="/messages" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                1:1 Mentorship Calls
              </Link>
              <Link href="/search" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                Code & PR Reviews
              </Link>
              <Link href="/search" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                Portfolio Audits
              </Link>
            </div>
          </div>

          {/* AI Intelligence Links (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col items-start text-left">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">AI Intelligence</h3>
            <div className="mt-3.5 sm:mt-5 flex flex-col gap-2 sm:gap-2.5">
              <Link href="/assessment" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                Skill Assessment
              </Link>
              <Link href="/assessment" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                AI Verified Badges
              </Link>
              <Link href="/roadmap" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                Career Roadmaps
              </Link>
              <Link href="/roadmap" className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white">
                Skill Gap Analysis
              </Link>
            </div>
          </div>

          {/* Community Links (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col items-start text-left">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">Community</h3>
            <div className="mt-3.5 sm:mt-5 flex flex-col gap-2 sm:gap-2.5">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal subtle divider */}
        <div className="mb-4 sm:mb-6 mt-8 sm:mt-16 h-px w-full bg-gradient-to-r from-slate-800/20 via-slate-700/60 to-slate-800/20" />

        {/* Copyright & Secondary Links */}
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[11px] sm:text-xs text-slate-500 pb-2">
          <p>© {new Date().getFullYear()} SkillVerse. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <Link href="#" className="transition-colors hover:text-slate-300">
              Terms & Conditions
            </Link>
            <div className="h-3 w-px bg-slate-800 hidden xs:block" />
            <Link href="#" className="transition-colors hover:text-slate-300">
              Privacy Policy
            </Link>
            <div className="h-3 w-px bg-slate-800 hidden xs:block" />
            <Link href="#" className="transition-colors hover:text-slate-300">
              Code of Conduct
            </Link>
          </div>
        </div>
      </div>

      {/* Giant Full-Width Watermark Typography Container (Bold and visible on mobile & web) */}
      <div className="w-full mt-6 sm:mt-8 md:mt-12 overflow-hidden flex justify-center items-end select-none pointer-events-none pb-3 sm:pb-6 md:pb-10">
        <h1 className="w-full text-center text-[clamp(3.8rem,19vw,18rem)] font-black leading-[0.80] tracking-[-0.07em] bg-gradient-to-b from-white/35 via-white/15 to-white/5 bg-clip-text text-transparent px-1">
          SKILLVERSE
        </h1>
      </div>
    </motion.footer>
  );
}