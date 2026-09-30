"use client";

import Link from "next/link";
import { useState } from "react";
import { useLoginModal } from "@/components/auth/login-modal-provider";

const navigation = [
  { label: "Discover", href: "#discover" },
  { label: "Teach", href: "#teach" },
  { label: "Mentors", href: "#mentors" },
  { label: "Community", href: "#community" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openLoginModal = useLoginModal();

  return (
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
            className="hidden h-12 whitespace-nowrap bg-[#151515] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d3d3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:inline-flex sm:items-center sm:justify-center"
            onClick={openLoginModal}
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
          <div className="mt-6">
            <button
              className="h-12 bg-[#151515] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3d3d3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
              onClick={() => {
                setIsMenuOpen(false);
                openLoginModal();
              }}
              type="button"
            >
              Join SkillVerse
            </button>
          </div>
        </div>
      )}
    </header>
  );
}