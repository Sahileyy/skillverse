"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import LoginModal from "@/components/auth/login-modal";

const LoginModalContext = createContext<(() => void) | null>(null);

export function useLoginModal() {
  const openLoginModal = useContext(LoginModalContext);

  if (!openLoginModal) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }

  return openLoginModal;
}

export default function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LoginModalContext.Provider value={() => setIsOpen(true)}>
      {children}
      {isOpen && <LoginModal onClose={() => setIsOpen(false)} />}
    </LoginModalContext.Provider>
  );
}