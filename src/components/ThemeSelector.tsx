"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { setThemeAction } from "@/server/actions/preferences";

type Theme = "light" | "dark" | "system";

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
}

export default function ThemeSelector({ labels }: { labels: { light: string; dark: string; system: string } }) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState<Theme>("system");

  useEffect(() => {
    setMounted(true);
    try {
      const cookieMatch = document.cookie.match(/(?:^|; )theme=([^;]+)/);
      const cookieVal = cookieMatch && decodeURIComponent(cookieMatch[1]);
      const localVal = localStorage.getItem("theme");
      const initial = (localVal || cookieVal || "system") as Theme;
      setCurrent(["light", "dark", "system"].includes(initial) ? initial : "system");
    } catch {
      // ignore
    }
  }, []);

  const handleSelect = useCallback((value: Theme) => {
    setCurrent(value);
    try {
      localStorage.setItem("theme", value);
      applyThemeClass(value);
    } catch { }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("theme", value);
      await setThemeAction(fd);
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => handleSelect("light")}
        className={`rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full ${mounted && current === "light" ? "ring-2 ring-ring" : ""}`}
        disabled={isPending}
      >
        {labels.light}
      </button>
      <button
        type="button"
        onClick={() => handleSelect("dark")}
        className={`rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full ${mounted && current === "dark" ? "ring-2 ring-ring" : ""}`}
        disabled={isPending}
      >
        {labels.dark}
      </button>
      <button
        type="button"
        onClick={() => handleSelect("system")}
        className={`rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full ${mounted && current === "system" ? "ring-2 ring-ring" : ""}`}
        disabled={isPending}
      >
        {labels.system}
      </button>
    </div>
  );
}


