"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollRevealProvider
 * Automatically attaches smooth, slow appear animations to sections and major
 * content blocks across all pages as the user scrolls.
 */
export default function ScrollRevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if user prefers reduced motion
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Unobserve once revealed for performance and to preserve interaction state
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeElements = () => {
      // Find candidate elements: sections, articles, .scroll-reveal, and major content containers
      const candidates = document.querySelectorAll(
        "main section, main article, .scroll-reveal, main > div > div.rounded-3xl, main > div > div.rounded-2xl"
      );

      candidates.forEach((el) => {
        // Skip navbars, dialogs, modals, and sticky/fixed headers
        if (
          el.closest("header") ||
          el.closest("nav") ||
          el.closest("[role='dialog']") ||
          el.closest(".fixed") ||
          el.classList.contains("fixed") ||
          el.classList.contains("sticky")
        ) {
          return;
        }

        if (!el.classList.contains("scroll-reveal")) {
          el.classList.add("scroll-reveal");
        }

        // If the element is already above the viewport or in top viewport fold on initial load, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
          // Add a tiny staggered delay for natural feel
          el.classList.add("is-visible");
        } else {
          observer.observe(el);
        }
      });
    };

    // Run on initial mount and route transition
    const timeoutId = setTimeout(observeElements, 60);

    // Watch for dynamic DOM changes (e.g. data fetching, tab changes)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
