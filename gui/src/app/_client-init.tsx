"use client";

export default function ClientInit() {
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "development") {
    // disable some browser shortcuts
    window.addEventListener("keydown", (e) => {
      if (
        ["r", "f"].includes(e.key.toLowerCase()) &&
        (e.ctrlKey || e.metaKey)
      ) e.preventDefault();

      if (e.key === "F5") e.preventDefault();
    });

    // disable right click context menu
    function preventContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    window.addEventListener("contextmenu", preventContextMenu); 
  }

  return null;
}
