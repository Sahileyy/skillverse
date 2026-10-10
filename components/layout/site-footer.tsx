"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function SiteFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
      className="flex w-full flex-col justify-end overflow-hidden bg-[#0a0d14] pt-6 sm:pt-8 border-t border-slate-800/80"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Copyright & Secondary Links */}
        <div className="relative z-10 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-[11px] sm:text-xs text-slate-500 pb-2 sm:pb-3">
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

      {/* Full-Length Watermark Typography Container */}
      <div className="w-full mt-2 sm:mt-4 overflow-hidden flex justify-center items-end select-none pointer-events-none pb-2 sm:pb-4 px-2 sm:px-4">
        <p
          aria-hidden="true"
          className="w-full text-center text-[clamp(2.6rem,16.2vw,22rem)] font-black leading-[0.85] tracking-[-0.05em] bg-gradient-to-b from-white/22 via-white/[0.09] to-white/[0.02] bg-clip-text text-transparent select-none whitespace-nowrap py-1"
        >
          SKILLVERSE
        </p>
      </div>
    </motion.footer>
  );
}