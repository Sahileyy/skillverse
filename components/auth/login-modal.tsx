"use client";

import { useEffect, useState } from "react";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#000000]/85 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="login-title"
        aria-modal="true"
        className="w-full max-w-[450px] rounded-[20px] bg-white p-6 text-[#151717] shadow-2xl sm:p-[30px]"
        role="dialog"
      >
        <h2 className="sr-only" id="login-title">Sign in to SkillVerse</h2>
        <form className="flex flex-col gap-[10px]" onSubmit={(event) => event.preventDefault()}>
          <label className="font-semibold" htmlFor="login-email">Email</label>
          <div className="flex h-[50px] items-center rounded-[10px] border border-[#ecedec] px-[10px] transition-colors focus-within:border-[#2d79f3]">
            <span aria-hidden="true" className="text-[20px]">@</span>
            <input
              autoComplete="email"
              className="ml-[10px] h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#858585]"
              id="login-email"
              name="email"
              placeholder="Enter your Email"
              required
              type="email"
            />
          </div>

          <label className="mt-1 font-semibold" htmlFor="login-password">Password</label>
          <div className="flex h-[50px] items-center rounded-[10px] border border-[#ecedec] px-[10px] transition-colors focus-within:border-[#2d79f3]">
            <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24">
              <rect height="12" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="16" x="4" y="10" />
              <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <input
              autoComplete="current-password"
              className="ml-[10px] h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#858585]"
              id="login-password"
              name="password"
              placeholder="Enter your Password"
              required
              type={isPasswordVisible ? "text" : "password"}
            />
            <button
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#2d79f3]"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              type="button"
            >
              <svg aria-hidden="true" className="size-[21px]" fill="none" viewBox="0 0 24 24">
                <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" fill="currentColor" />
                <circle cx="12" cy="12" fill="white" r="3.2" />
                <circle cx="12" cy="12" fill="currentColor" r="1.7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 text-sm">
            <label className="inline-flex items-center gap-1.5 text-black">
              <input className="size-[14px] accent-[#2d79f3]" name="remember" type="checkbox" />
              Remember me
            </label>
            <button className="text-[#2d79f3] hover:underline" type="button">Forgot password?</button>
          </div>

          <button
            className="mt-[20px] h-[50px] w-full rounded-[10px] bg-[#151717] text-[15px] font-medium text-white transition-colors hover:bg-[#252727] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d79f3]"
            type="submit"
          >
            Sign In
          </button>

          <p className="my-[5px] text-center text-sm text-black">
            Don&apos;t have an account? <button className="ml-1 text-[#2d79f3] hover:underline" type="button">Sign Up</button>
          </p>
          <p className="my-[5px] text-center text-sm text-black">Or With</p>

          <div className="mt-[10px] grid grid-cols-2 gap-[10px]">
            <button className="flex h-[50px] items-center justify-center gap-[10px] rounded-[10px] border border-[#ededef] bg-white font-medium transition-colors hover:border-[#2d79f3]" type="button">
              <svg aria-hidden="true" className="size-5" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z" />
                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z" />
                <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6V15H5.9a20 20 0 0 0 0 18l6.9-5.2Z" />
                <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 15l6.9 5.2C14.4 15.5 18.8 12 24 12Z" />
              </svg>
              Google
            </button>
            <button className="flex h-[50px] items-center justify-center gap-[10px] rounded-[10px] border border-[#ededef] bg-white font-medium transition-colors hover:border-[#2d79f3]" type="button">
              <svg aria-hidden="true" className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M16.4 12.8c0-2.2 1.8-3.3 1.9-3.4a4.2 4.2 0 0 0-3.3-1.8c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8a4.5 4.5 0 0 0-3.8 2.3c-1.6 2.8-.4 6.9 1.2 9.1.8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.3a10 10 0 0 0 1.3-2.7 4 4 0 0 1-2.6-3.4ZM14.1 6.1a4 4 0 0 0 1-3 4.2 4.2 0 0 0-2.8 1.4 3.8 3.8 0 0 0-1 2.9 3.5 3.5 0 0 0 2.8-1.3Z" />
              </svg>
              Apple
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}