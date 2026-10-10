"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

function getInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getLevelInfo(xp: number = 0) {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelProgress = xp % 100;
  return { level, progress: currentLevelProgress, xp };
}

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const openLoginModal = useLoginModal();
  const { user, logout, isLoading } = useAuth();

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const levelInfo = getLevelInfo(user?.xp || 0);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          >
            {/* Custom Geometric Logo Badge */}
            <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 transition-transform duration-200 group-hover:scale-105">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <circle cx="7" cy="7" r="3" />
                <circle cx="17" cy="17" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5l5 5M7 14a7 7 0 007-7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-[21px] font-black tracking-tight text-slate-950">
                SkillVerse
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-slate-400 hidden sm:block -mt-1">
                Peer Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
            {user?.role === "MENTOR" ? (
              <>
                <Link
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 transition-colors hover:text-blue-800"
                  href="/mentor/dashboard"
                >
                  <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span>Mentor Studio</span>
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/community"
                >
                  Community Projects
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-indigo-700 transition-colors hover:text-indigo-950"
                  href="/assessment?quiz=mentor_accreditation"
                >
                  <svg className="size-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                  <span>Accreditation</span>
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/messages"
                >
                  Messages
                </Link>
              </>
            ) : user?.role === "ADMIN" ? (
              <>
                <Link
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-purple-600 transition-colors hover:text-purple-800"
                  href="/mentor/dashboard"
                >
                  <span className="size-1.5 rounded-full bg-purple-600" />
                  <span>Admin Studio</span>
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/search"
                >
                  Catalog
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/community"
                >
                  Community Projects
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/assessment?quiz=mentor_accreditation"
                >
                  Accreditation
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/search"
                >
                  Find Mentors
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/assessment"
                >
                  Skill Assessment
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/roadmap"
                >
                  Career Roadmap
                </Link>
                <Link
                  className="text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950"
                  href="/community"
                >
                  Community Projects
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Section: User Capsule / Auth Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {!isLoading && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mentor Quick Action */}
              {user.role === "MENTOR" && (
                <Link
                  href="/mentor/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>+ Post Skill Ad</span>
                </Link>
              )}

              {/* Messages Shortcut */}
              <Link
                href="/messages"
                className="relative inline-flex size-9 sm:size-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                title="Messages"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.84-.84c.15-.904.53-1.848.966-2.613A7.95 7.95 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </Link>

              {/* Profile Dropdown Trigger */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`group flex items-center gap-2 rounded-full border p-1 pl-1.5 pr-2.5 sm:pr-3 transition-all cursor-pointer ${
                    isProfileOpen
                      ? "border-blue-400 bg-blue-50/50 shadow-xs"
                      : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs"
                  }`}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar with Status Dot */}
                  <div className="relative">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="size-7 sm:size-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 to-indigo-900 text-white text-[11px] font-black tracking-tight shadow-xs">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 size-2 rounded-full border border-white bg-emerald-500" />
                  </div>

                  {/* Name & Role */}
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold text-slate-900 max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {user.role === "MENTOR" ? "Mentor" : "Member"}
                    </span>
                  </div>

                  {/* Chevron Indicator */}
                  <svg
                    className={`size-3.5 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180 text-blue-600" : "group-hover:text-slate-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Floating Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl shadow-slate-900/10 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header Card: User Details & XP */}
                    <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="size-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 via-indigo-900 to-blue-900 text-white text-sm font-black shadow-xs">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* XP / Level Progress Bar */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-700">Level {levelInfo.level}</span>
                          <span className="text-indigo-600">{levelInfo.xp} XP</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                            style={{ width: `${Math.max(8, levelInfo.progress)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu Items */}
                    <div className="mt-1.5 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span>View Profile</span>
                      </Link>

                      <Link
                        href="/messages"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.84-.84c.15-.904.53-1.848.966-2.613A7.95 7.95 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        <span>Direct Messages</span>
                      </Link>

                      {user.role === "MENTOR" ? (
                        <>
                          <Link
                            href="/mentor/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <svg className="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            <span>Mentor Studio & Ads</span>
                          </Link>
                          <Link
                            href="/assessment?quiz=mentor_accreditation"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                          >
                            <svg className="size-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                            </svg>
                            <span>Mentor Accreditation</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/assessment"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                          >
                            <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                            </svg>
                            <span>Skill Assessments</span>
                          </Link>
                          <Link
                            href="/roadmap"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                          >
                            <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25l-2.25 6.75-6.75 2.25 2.25-6.75 6.75-2.25z" />
                            </svg>
                            <span>Career Roadmap</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Sign Out Option */}
                    <div className="mt-2 border-t border-slate-100 pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        <svg className="size-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Logout Button for Fast UX */}
              <button
                type="button"
                onClick={() => logout()}
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 px-3 py-2 text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer"
                title="Sign Out"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 rounded-xl bg-slate-100 animate-pulse" />
              <div className="size-9 rounded-full bg-slate-100 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={openLoginModal}
                className="hidden sm:inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 hover:bg-slate-800 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex size-9 sm:size-10 items-center justify-center rounded-xl border border-slate-200/90 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            title={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            <span aria-hidden="true" className="relative block size-4 sm:size-5">
              <span className={`absolute left-0 block h-0.5 w-full bg-current transition-transform duration-200 ${isMenuOpen ? "top-2 rotate-45" : "top-0.5"}`} />
              <span className={`absolute left-0 top-2 block h-0.5 w-full bg-current transition-opacity duration-200 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 block h-0.5 w-full bg-current transition-transform duration-200 ${isMenuOpen ? "top-2 -rotate-45" : "top-3.5"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div
          className="border-t border-slate-200 bg-white px-5 pb-6 pt-4 lg:hidden shadow-lg"
          id="mobile-navigation"
        >
          {/* User Card on Mobile */}
          {!isLoading && user && (
            <div className="mb-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
              <div className="flex items-center gap-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="size-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                ) : (
                  <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-bold text-sm shadow-xs">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60">
                      {user.role === "MENTOR" ? "Mentor" : "Member"}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600">
                      Level {levelInfo.level} • {levelInfo.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <nav aria-label="Mobile primary navigation" className="flex flex-col space-y-1">
            {user?.role === "MENTOR" ? (
              <>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center justify-between transition-colors"
                  href="/mentor/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Mentor Studio</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">★ Dashboard</span>
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/community"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community Projects
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 flex items-center justify-between transition-colors"
                  href="/assessment?quiz=mentor_accreditation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Accreditation & Rating</span>
                  <span className="text-xs text-indigo-600 font-semibold">Verified</span>
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/messages"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            ) : user?.role === "ADMIN" ? (
              <>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 flex items-center justify-between transition-colors"
                  href="/mentor/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Admin Studio</span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">★ Admin</span>
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Catalog
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/community"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community Projects
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/assessment?quiz=mentor_accreditation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accreditation
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Mentors
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/assessment"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Skill Assessment
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/roadmap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Career Roadmap
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/community"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community Projects
                </Link>
              </>
            )}

            {user && (
              <>
                <div className="my-2 border-t border-slate-200" />
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  href="/messages"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            )}
          </nav>

          <div className="mt-4 pt-3 border-t border-slate-200">
            {isLoading ? (
              <div className="h-11 w-full rounded-xl bg-slate-100 animate-pulse" />
            ) : user ? (
              <button
                className="w-full rounded-xl border border-rose-200 bg-rose-50/60 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                type="button"
              >
                Sign Out
              </button>
            ) : (
              <button
                className="w-full rounded-xl bg-slate-950 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                onClick={() => {
                  setIsMenuOpen(false);
                  openLoginModal();
                }}
                type="button"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}