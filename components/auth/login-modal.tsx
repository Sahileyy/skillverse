"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "MENTOR">("STUDENT");
  
  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === "signin") {
        const result = await login(email, password);
        if (result.success) {
          onClose();
        } else {
          setErrorMessage(result.error || "Failed to sign in");
        }
      } else {
        const result = await register(name, email, password, role);
        if (result.success) {
          onClose();
        } else {
          setErrorMessage(result.error || "Failed to sign up");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-xs"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="auth-title"
        aria-modal="true"
        className="w-full max-w-[450px] rounded-[24px] bg-white p-6 text-[#151717] shadow-2xl sm:p-[30px]"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]" id="auth-title">
              {mode === "signin" ? "Welcome Back" : "Join SkillVerse"}
            </h2>
            <p className="text-xs text-gray-500">
              {mode === "signin"
                ? "Enter your credentials to access your account"
                : "Choose your role and start sharing or learning skills"}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            {errorMessage}
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              {/* Role Selection */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">I am a</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("STUDENT")}
                    className={`h-[42px] rounded-lg border text-xs font-semibold transition-all ${
                      role === "STUDENT"
                        ? "border-[#151515] bg-[#151515] text-white"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    🎓 Student / Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("MENTOR")}
                    className={`h-[42px] rounded-lg border text-xs font-semibold transition-all ${
                      role === "MENTOR"
                        ? "border-[#151515] bg-[#151515] text-white"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    💡 Mentor / Teacher
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700" htmlFor="signup-name">Full Name</label>
                <div className="mt-1 flex h-[46px] items-center rounded-lg border border-[#ecedec] px-3 focus-within:border-[#2d79f3]">
                  <input
                    id="signup-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="h-full w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-700" htmlFor="login-email">Email</label>
            <div className="mt-1 flex h-[46px] items-center rounded-lg border border-[#ecedec] px-3 focus-within:border-[#2d79f3]">
              <span aria-hidden="true" className="text-gray-400">@</span>
              <input
                autoComplete="email"
                className="ml-2 h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                type="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-700" htmlFor="login-password">Password</label>
            <div className="mt-1 flex h-[46px] items-center rounded-lg border border-[#ecedec] px-3 focus-within:border-[#2d79f3]">
              <svg aria-hidden="true" className="size-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24">
                <rect height="12" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="16" x="4" y="10" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              <input
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="ml-2 h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                required
                type={isPasswordVisible ? "text" : "password"}
              />
              <button
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded text-gray-400 hover:text-gray-700"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                type="button"
              >
                <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isPasswordVisible ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <button
            className="mt-3 flex h-[48px] w-full items-center justify-center rounded-lg bg-[#151717] text-sm font-medium text-white transition-colors hover:bg-[#252727] disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="size-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {mode === "signin" ? "Signing In..." : "Creating Account..."}
              </span>
            ) : (
              mode === "signin" ? "Sign In" : "Create Account"
            )}
          </button>

          <p className="mt-2 text-center text-xs text-gray-600">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="font-semibold text-[#2d79f3] hover:underline"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setErrorMessage(null);
              }}
              type="button"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}