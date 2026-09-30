"use client";

import { useLoginModal } from "@/components/auth/login-modal-provider";

export default function GetMatchedButton() {
  const openLoginModal = useLoginModal();

  return (
    <button
      className="mt-6 inline-flex h-12 items-center gap-4 rounded-md bg-[#103633] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1e514c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103633]"
      onClick={openLoginModal}
      type="button"
    >
      Get matched with a mentor <span aria-hidden="true">↗</span>
    </button>
  );
}