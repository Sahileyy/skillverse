"use client";

import Link from "next/link";
import { useState } from "react";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

const navigation = [
  { label: "Find Mentors", href: "/search" },
  { label: "Community Projects", href: "/community" },
  { label: "Session Formats", href: "/#sessions" },
  { label: "AI Tools", href: "/#ai-tools" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openLoginModal = useLoginModal();
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="relative z-20 bg-white border-b border-black/[0.06]">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <Link
          className="text-[21px] font-bold text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          href="/"
        >
          SkillVerse
        </Link>

        <nav aria-label="Primary navigation" className="ml-14 hidden items-center gap-7 lg:flex">
          {user?.role === "MENTOR" ? (
            <>
              <Link
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                href="/search"
              >
                Find Peers & Mentors
              </Link>
              <Link
                className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-800 flex items-center gap-1.5"
                href="/mentor/dashboard"
              >
                <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Mentor Studio</span>
              </Link>
              <Link
                className="text-sm font-semibold text-amber-700 transition-colors hover:text-amber-900 flex items-center gap-1"
                href="/assessment?quiz=mentor_accreditation"
              >
                <span>👑 AI Accreditation</span>
              </Link>
              <Link
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                href="/community"
              >
                Community Projects
              </Link>
            </>
          ) : (
            <>
              <Link
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                href="/search"
              >
                Find Mentors
              </Link>
              <Link
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                href="/assessment"
              >
                AI Skill Assessment
              </Link>
              <Link
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                href="/roadmap"
              >
                Career Roadmap
              </Link>
              <Link
                className="text-sm font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                href="/community"
              >
                Community Projects
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {!isLoading && user ? (
            <div className="flex items-center gap-3">
              {user.role === "MENTOR" && (
                <Link
                  href="/mentor/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02]"
                >
                  <span>+ Post Skill Ad</span>
                </Link>
              )}
              <Link
                href="/messages"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="size-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Messages</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 transition hover:bg-slate-100/80"
              >
                <div className="flex flex-col items-start leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#151515]">{user.name}</span>
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-semibold text-blue-700">
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600">
                    ⚡ {user.xp || 0} XP
                  </span>
                </div>
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                type="button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="hidden h-11 items-center justify-center rounded-lg bg-[#151515] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d3d3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:inline-flex"
              onClick={openLoginModal}
              type="button"
            >
              Join SkillVerse
            </button>
          )}

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
            {user?.role === "MENTOR" ? (
              <>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Peers & Mentors
                </Link>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-bold text-blue-600 flex items-center justify-between transition-colors hover:text-blue-700"
                  href="/mentor/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Mentor Studio (+ Post Ad)</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">★ Mentor</span>
                </Link>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-bold text-amber-700 flex items-center justify-between transition-colors hover:text-amber-800"
                  href="/assessment?quiz=mentor_accreditation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>AI Mentor Accreditation & Rating</span>
                  <span className="text-amber-600">👑</span>
                </Link>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                  href="/community"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community Projects
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Mentors
                </Link>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                  href="/assessment"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI Skill Assessment
                </Link>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                  href="/roadmap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Career Roadmap
                </Link>
                <Link
                  className="border-b border-black/[0.09] py-4 text-base font-semibold text-[#252525] transition-colors hover:text-[#777777]"
                  href="/community"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community Projects
                </Link>
              </>
            )}
          </nav>
          <div className="mt-6">
            {!isLoading && user ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{user.role}</span>
                    <span className="text-[10px] font-bold text-amber-600">⚡ {user.xp || 0} XP</span>
                  </div>
                </Link>
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  type="button"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="h-12 w-full rounded-lg bg-[#151515] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d3d3d]"
                onClick={() => {
                  setIsMenuOpen(false);
                  openLoginModal();
                }}
                type="button"
              >
                Join SkillVerse
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}