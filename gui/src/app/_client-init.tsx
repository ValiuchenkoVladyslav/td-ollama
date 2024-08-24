"use client";

import { useAppStore } from "~/store";

export default function ClientInit() {
  if (typeof window !== "undefined") {
    // init store on client side
    useAppStore.getState().initStore();

    // disable some browser features so app feels more native
    if (process.env.NODE_ENV !== "development") {
      window.addEventListener("keydown", (e) => {
        if (
          ["r", "f"].includes(e.key.toLowerCase()) &&
          (e.ctrlKey || e.metaKey)
        ) e.preventDefault();

        if (e.key === "F5") e.preventDefault();
      });

      window.addEventListener("contextmenu", (e) => e.preventDefault());

      const noSelectStyles = document.createElement("style")
      noSelectStyles.textContent = `
        * {
          user-select: none;
        }
      `;
      document.head.appendChild(noSelectStyles);
    }
  }

  return null;
}
