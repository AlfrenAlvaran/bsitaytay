'use client'
import { useEffect } from "react";
import type { RefObject } from "react";
export function useFocusShortcut(
  ref: RefObject<HTMLInputElement | null>,
  key = "/",
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        ["INPUT", "TEXTAREA"].includes(target.tagName) ||
        target.isContentEditable;
      if (e.key === key && !isTyping) {
        e.preventDefault();
        ref.current?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ref, key]);
}
